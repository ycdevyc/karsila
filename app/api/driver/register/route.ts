import { NextResponse } from "next/server";

import {
  assertIntegerInRange,
  assertOptionalText,
  assertRequiredText,
  assertValidDocument,
  assertValidEmail,
  assertValidLicensePlate,
  assertValidPhone,
  DRIVER_DOCUMENT_BUCKET,
  DriverDocumentType,
  MAX_REGISTRATION_BODY_BYTES,
  publicRegistrationMessage,
  RegistrationError,
  RegistrationErrorCode,
  REQUIRED_DOCUMENT_TYPES,
} from "@/lib/driver/registration-validation";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 15 * 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;

type DocumentMetadata = {
  documentType: DriverDocumentType;
  fileName: string;
  filePath: string;
  mimeType: string;
  fileSizeBytes: number;
};

type UniquenessResult = {
  emailTaken?: boolean;
  phoneTaken?: boolean;
  licensePlateTaken?: boolean;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type CleanupResult = {
  complete: boolean;
  storageError: unknown | null;
  authError: unknown | null;
};

const rateLimitEntries = new Map<string, RateLimitEntry>();

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const uploadedPaths: string[] = [];
  let authUserId: string | null = null;

  try {
    assertRequestSizeHeader(request);
    assertRateLimit(request);

    const formData = await parseFormData(request);
    assertCalculatedRequestSize(formData);

    const application = await validateApplication(formData);
    const files = await validateDocuments(formData);

    await assertRegistrationIsUnique({
      email: application.email,
      phone: application.phone,
      licensePlate: application.licensePlate,
    });

    const driverId = crypto.randomUUID();
    const vehicleId = crypto.randomUUID();

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: application.email,
        password: application.password,
        email_confirm: true,
        user_metadata: {
          full_name: application.fullName,
          phone: application.phone,
          account_type: "driver",
        },
      });

    if (authError || !authData.user) {
      console.error("Driver Auth creation failed", {
        requestId,
        code: authError?.code,
        message: authError?.message,
      });

      if (isDuplicateAuthError(authError?.message)) {
        throw new RegistrationError("EMAIL_ALREADY_EXISTS", {
          field: "email",
          cause: authError,
        });
      }

      throw new RegistrationError("AUTH_CREATION_FAILED", {
        cause: authError,
      });
    }

    authUserId = authData.user.id;

    const documentMetadata: DocumentMetadata[] = [];

    for (const documentType of REQUIRED_DOCUMENT_TYPES) {
      const file = files.get(documentType);

      if (!file) {
        throw new RegistrationError("MISSING_DOCUMENT", {
          field: documentType,
        });
      }

      const filePath = createStoragePath(
        driverId,
        documentType,
        file.name,
      );
      const buffer = Buffer.from(await file.arrayBuffer());
      const { error: uploadError } = await supabaseAdmin.storage
        .from(DRIVER_DOCUMENT_BUCKET)
        .upload(filePath, buffer, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Driver document upload failed", {
          requestId,
          documentType,
          message: uploadError.message,
        });

        throw new RegistrationError("DOCUMENT_UPLOAD_FAILED", {
          field: documentType,
          cause: uploadError,
        });
      }

      uploadedPaths.push(filePath);
      documentMetadata.push({
        documentType,
        fileName: file.name,
        filePath,
        mimeType: file.type,
        fileSizeBytes: file.size,
      });
    }

    const { data: applicationData, error: applicationError } =
      await supabaseAdmin.rpc("create_driver_application", {
        p_driver_id: driverId,
        p_auth_user_id: authUserId,
        p_full_name: application.fullName,
        p_email: application.email,
        p_phone: application.phone,
        p_languages: application.languages,
        p_company_name: application.companyName,
        p_vat_number: application.vatNumber,
        p_country: application.country,
        p_city: application.city,
        p_airport_region: application.airportRegion,
        p_vehicle_id: vehicleId,
        p_vehicle_brand: application.vehicleBrand,
        p_vehicle_model: application.vehicleModel,
        p_vehicle_year: application.vehicleYear,
        p_vehicle_license_plate: application.licensePlate,
        p_vehicle_color: application.vehicleColor,
        p_vehicle_capacity: application.capacity,
        p_vehicle_luggage_capacity:
          application.luggageCapacity,
        p_documents: documentMetadata,
      });

    if (applicationError) {
      console.error("Atomic driver database RPC failed", {
        requestId,
        code: applicationError.code,
        message: applicationError.message,
        details: applicationError.details,
      });

      throw databaseRegistrationError(applicationError);
    }

    return NextResponse.json(
      {
        success: true,
        application: applicationData,
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    const cleanupResult = await cleanupFailedRegistration({
      authUserId,
      uploadedPaths,
      requestId,
    });

    if (!cleanupResult.complete) {
      return registrationErrorResponse(
        new RegistrationError("ROLLBACK_INCOMPLETE", {
          cause: error,
        }),
        requestId,
      );
    }

    if (error instanceof RegistrationError) {
      return registrationErrorResponse(error, requestId);
    }

    console.error("Unexpected driver registration failure", {
      requestId,
      error,
    });

    return registrationErrorResponse(
      new RegistrationError("UNKNOWN_ERROR", {
        cause: error,
      }),
      requestId,
    );
  }
}

async function parseFormData(request: Request) {
  try {
    return await request.formData();
  } catch (error) {
    throw new RegistrationError("INVALID_REQUEST", {
      cause: error,
    });
  }
}

async function validateApplication(formData: FormData) {
  const fullName = assertRequiredText(
    getTrimmedText(formData, "fullName"),
    {
      requiredCode: "FULL_NAME_REQUIRED",
      tooLongCode: "FULL_NAME_TOO_LONG",
      maxLength: 120,
      field: "fullName",
    },
  );
  const email = assertValidEmail(
    getTrimmedText(formData, "email"),
  );
  const phone = assertValidPhone(
    getTrimmedText(formData, "phone"),
  );
  const languages = assertRequiredText(
    getTrimmedText(formData, "languages"),
    {
      requiredCode: "LANGUAGES_REQUIRED",
      tooLongCode: "LANGUAGES_TOO_LONG",
      maxLength: 250,
      field: "languages",
    },
  );
  const password = getRawText(formData, "password");

  if (password.length < 8 || password.length > 128) {
    throw new RegistrationError("INVALID_PASSWORD", {
      field: "password",
    });
  }

  const companyName = assertOptionalText(
    getTrimmedText(formData, "companyName"),
    {
      tooLongCode: "COMPANY_NAME_TOO_LONG",
      maxLength: 160,
      field: "companyName",
    },
  );
  const vatNumber = assertOptionalText(
    getTrimmedText(formData, "vatNumber"),
    {
      tooLongCode: "VAT_NUMBER_TOO_LONG",
      maxLength: 80,
      field: "vatNumber",
    },
  );
  const country = assertRequiredText(
    getTrimmedText(formData, "country"),
    {
      requiredCode: "OPERATING_DETAILS_REQUIRED",
      tooLongCode: "OPERATING_DETAILS_TOO_LONG",
      maxLength: 100,
      field: "country",
    },
  );
  const city = assertRequiredText(
    getTrimmedText(formData, "city"),
    {
      requiredCode: "OPERATING_DETAILS_REQUIRED",
      tooLongCode: "OPERATING_DETAILS_TOO_LONG",
      maxLength: 120,
      field: "city",
    },
  );
  const airportRegion = assertRequiredText(
    getTrimmedText(formData, "airportRegion"),
    {
      requiredCode: "OPERATING_DETAILS_REQUIRED",
      tooLongCode: "OPERATING_DETAILS_TOO_LONG",
      maxLength: 160,
      field: "airportRegion",
    },
  );
  const vehicleBrand = assertRequiredText(
    getTrimmedText(formData, "vehicleBrand"),
    {
      requiredCode: "VEHICLE_REQUIRED",
      tooLongCode: "VEHICLE_DETAILS_TOO_LONG",
      maxLength: 80,
      field: "vehicleBrand",
    },
  );
  const vehicleModel = assertRequiredText(
    getTrimmedText(formData, "vehicleModel"),
    {
      requiredCode: "VEHICLE_REQUIRED",
      tooLongCode: "VEHICLE_DETAILS_TOO_LONG",
      maxLength: 80,
      field: "vehicleModel",
    },
  );
  const currentYear = new Date().getFullYear();
  const vehicleYear = assertIntegerInRange(
    getTrimmedText(formData, "vehicleYear"),
    {
      code: "INVALID_VEHICLE_YEAR",
      min: 1990,
      max: currentYear + 1,
      field: "vehicleYear",
    },
  );
  const licensePlate = assertValidLicensePlate(
    getTrimmedText(formData, "licensePlate"),
  );
  const vehicleColor = assertOptionalText(
    getTrimmedText(formData, "vehicleColor"),
    {
      tooLongCode: "VEHICLE_DETAILS_TOO_LONG",
      maxLength: 50,
      field: "vehicleColor",
    },
  );
  const capacity = assertIntegerInRange(
    getTrimmedText(formData, "capacity"),
    {
      code: "INVALID_CAPACITY",
      min: 1,
      max: 100,
      field: "capacity",
    },
  );
  const luggageCapacity = assertIntegerInRange(
    getTrimmedText(formData, "luggageCapacity"),
    {
      code: "INVALID_LUGGAGE_CAPACITY",
      min: 0,
      max: 100,
      field: "luggageCapacity",
    },
  );

  return {
    fullName,
    email,
    phone,
    languages,
    password,
    companyName,
    vatNumber,
    country,
    city,
    airportRegion,
    vehicleBrand,
    vehicleModel,
    vehicleYear,
    licensePlate,
    vehicleColor,
    capacity,
    luggageCapacity,
  };
}

async function validateDocuments(formData: FormData) {
  const files = new Map<DriverDocumentType, File>();

  for (const documentType of REQUIRED_DOCUMENT_TYPES) {
    const entries = formData.getAll(documentType);

    if (
      entries.length !== 1 ||
      !(entries[0] instanceof File)
    ) {
      throw new RegistrationError("MISSING_DOCUMENT", {
        field: documentType,
      });
    }

    const file = entries[0];
    await assertValidDocument(file, documentType);
    files.set(documentType, file);
  }

  return files;
}

async function assertRegistrationIsUnique(input: {
  email: string;
  phone: string;
  licensePlate: string;
}) {
  const { data, error } = await supabaseAdmin.rpc(
    "check_driver_registration_uniqueness",
    {
      p_email: input.email,
      p_phone: input.phone,
      p_license_plate: input.licensePlate,
    },
  );

  if (error) {
    console.error("Final driver uniqueness RPC failed", {
      code: error.code,
      message: error.message,
      details: error.details,
    });

    throw new RegistrationError("UNIQUENESS_CHECK_FAILED", {
      cause: error,
    });
  }

  const result = (data ?? {}) as UniquenessResult;

  if (result.emailTaken === true) {
    throw new RegistrationError("EMAIL_ALREADY_EXISTS", {
      field: "email",
    });
  }

  if (result.phoneTaken === true) {
    throw new RegistrationError("PHONE_ALREADY_EXISTS", {
      field: "phone",
    });
  }

  if (result.licensePlateTaken === true) {
    throw new RegistrationError(
      "LICENSE_PLATE_ALREADY_EXISTS",
      {
        field: "licensePlate",
      },
    );
  }
}

async function cleanupFailedRegistration(input: {
  authUserId: string | null;
  uploadedPaths: string[];
  requestId: string;
}): Promise<CleanupResult> {
  let storageError: unknown | null = null;
  let authError: unknown | null = null;

  if (input.uploadedPaths.length > 0) {
    const { error } = await supabaseAdmin.storage
      .from(DRIVER_DOCUMENT_BUCKET)
      .remove(input.uploadedPaths);

    if (error) {
      storageError = error;
      console.error("Storage rollback failed", {
        requestId: input.requestId,
        paths: input.uploadedPaths,
        message: error.message,
      });
    }
  }

  if (input.authUserId) {
    const { error } =
      await supabaseAdmin.auth.admin.deleteUser(
        input.authUserId,
      );

    if (error) {
      authError = error;
      console.error("Auth rollback failed", {
        requestId: input.requestId,
        authUserId: input.authUserId,
        message: error.message,
      });
    }
  }

  return {
    complete: storageError === null && authError === null,
    storageError,
    authError,
  };
}

function databaseRegistrationError(error: {
  message: string;
}) {
  const knownCodes: RegistrationErrorCode[] = [
    "EMAIL_ALREADY_EXISTS",
    "PHONE_ALREADY_EXISTS",
    "LICENSE_PLATE_ALREADY_EXISTS",
  ];
  const code = knownCodes.find((candidate) =>
    error.message.includes(candidate),
  );

  return new RegistrationError(
    code ?? "APPLICATION_DATABASE_FAILED",
    {
      field:
        code === "EMAIL_ALREADY_EXISTS"
          ? "email"
          : code === "PHONE_ALREADY_EXISTS"
            ? "phone"
            : code === "LICENSE_PLATE_ALREADY_EXISTS"
              ? "licensePlate"
              : undefined,
      cause: error,
    },
  );
}

function registrationErrorResponse(
  error: RegistrationError,
  requestId: string,
) {
  return NextResponse.json(
    {
      success: false,
      code: error.code,
      field: error.field,
      message: publicRegistrationMessage(error.code),
      requestId,
    },
    {
      status: error.status,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

function getRawText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getTrimmedText(formData: FormData, key: string) {
  return getRawText(formData, key).trim();
}

function assertRequestSizeHeader(request: Request) {
  const contentLength = request.headers.get("content-length");

  if (
    contentLength &&
    Number(contentLength) > MAX_REGISTRATION_BODY_BYTES
  ) {
    throw new RegistrationError("REQUEST_TOO_LARGE");
  }
}

function assertCalculatedRequestSize(formData: FormData) {
  let totalBytes = 0;
  const encoder = new TextEncoder();

  for (const value of formData.values()) {
    totalBytes +=
      typeof value === "string"
        ? encoder.encode(value).byteLength
        : value.size;
  }

  if (totalBytes > MAX_REGISTRATION_BODY_BYTES) {
    throw new RegistrationError("REQUEST_TOO_LARGE");
  }
}

function assertRateLimit(request: Request) {
  const now = Date.now();
  const key = getClientKey(request);
  const current = rateLimitEntries.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitEntries.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    pruneExpiredRateLimits(now);
    return;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    throw new RegistrationError("RATE_LIMITED");
  }

  current.count += 1;
}

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  return (
    forwardedFor?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function pruneExpiredRateLimits(now: number) {
  if (rateLimitEntries.size < 1_000) {
    return;
  }

  for (const [key, entry] of rateLimitEntries) {
    if (entry.resetAt <= now) {
      rateLimitEntries.delete(key);
    }
  }
}

function createStoragePath(
  driverId: string,
  documentType: DriverDocumentType,
  originalFileName: string,
) {
  const safeFileName =
    sanitizeFileName(originalFileName) || "document";

  return (
    `${driverId}/${documentType}/` +
    `${crypto.randomUUID()}-${safeFileName}`
  );
}

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 160);
}

function isDuplicateAuthError(message?: string) {
  const normalized = message?.toLowerCase() ?? "";

  return (
    normalized.includes("already") ||
    normalized.includes("registered") ||
    normalized.includes("exists")
  );
}
