import { NextResponse } from "next/server";

import {
  assertValidEmail,
  assertValidLicensePlate,
  assertValidPhone,
  publicRegistrationMessage,
  RegistrationError,
} from "@/lib/driver/registration-validation";
import { supabaseAdmin } from "@/lib/supabase-admin";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;
const MAX_REQUEST_BODY_BYTES = 2_048;

type CheckField = "email" | "phone" | "licensePlate";

type RequestBody = {
  field?: unknown;
  value?: unknown;
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

const rateLimitEntries = new Map<string, RateLimitEntry>();

export async function POST(request: Request) {
  try {
    assertRequestSize(request);
    assertRateLimit(request);

    const body = (await request.json()) as RequestBody;
    const field = parseField(body.field);
    const value = parseAndValidateValue(field, body.value);

    const { data, error } = await supabaseAdmin.rpc(
      "check_driver_registration_uniqueness",
      {
        p_email: field === "email" ? value : null,
        p_phone: field === "phone" ? value : null,
        p_license_plate:
          field === "licensePlate" ? value : null,
      },
    );

    if (error) {
      console.error("Driver uniqueness RPC failed", {
        code: error.code,
        message: error.message,
        details: error.details,
      });

      throw new RegistrationError("UNIQUENESS_CHECK_FAILED", {
        cause: error,
      });
    }

    const result = (data ?? {}) as UniquenessResult;

    return NextResponse.json(
      {
        available: !isTaken(field, result),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    if (error instanceof RegistrationError) {
      return NextResponse.json(
        {
          available: false,
          code: error.code,
          error: publicRegistrationMessage(error.code),
        },
        {
          status: error.status,
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    console.error("Driver uniqueness endpoint failed", error);

    return NextResponse.json(
      {
        available: false,
        code: "INVALID_REQUEST",
        error: publicRegistrationMessage("INVALID_REQUEST"),
      },
      {
        status: 400,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}

function parseField(value: unknown): CheckField {
  if (
    value === "email" ||
    value === "phone" ||
    value === "licensePlate"
  ) {
    return value;
  }

  throw new RegistrationError("INVALID_REQUEST");
}

function parseAndValidateValue(
  field: CheckField,
  value: unknown,
) {
  if (typeof value !== "string") {
    throw new RegistrationError("INVALID_REQUEST");
  }

  if (field === "email") {
    return assertValidEmail(value);
  }

  if (field === "phone") {
    return assertValidPhone(value);
  }

  return assertValidLicensePlate(value);
}

function isTaken(
  field: CheckField,
  result: UniquenessResult,
) {
  if (field === "email") {
    return result.emailTaken === true;
  }

  if (field === "phone") {
    return result.phoneTaken === true;
  }

  return result.licensePlateTaken === true;
}

function assertRequestSize(request: Request) {
  const contentLength = request.headers.get("content-length");

  if (
    contentLength &&
    Number(contentLength) > MAX_REQUEST_BODY_BYTES
  ) {
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
  const clientIp =
    forwardedFor?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  return clientIp;
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
