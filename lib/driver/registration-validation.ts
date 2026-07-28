import "server-only";

export const DRIVER_DOCUMENT_BUCKET = "driver-documents";
export const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_REGISTRATION_BODY_BYTES =
  4 * MAX_DOCUMENT_SIZE_BYTES + 256 * 1024;

export const REQUIRED_DOCUMENT_TYPES = [
  "driver_license",
  "commercial_driver_license",
  "vehicle_registration",
  "vehicle_insurance",
] as const;

export type DriverDocumentType =
  (typeof REQUIRED_DOCUMENT_TYPES)[number];

export type RegistrationErrorCode =
  | "INVALID_REQUEST"
  | "REQUEST_TOO_LARGE"
  | "FULL_NAME_REQUIRED"
  | "FULL_NAME_TOO_LONG"
  | "INVALID_EMAIL"
  | "EMAIL_ALREADY_EXISTS"
  | "INVALID_PHONE"
  | "PHONE_ALREADY_EXISTS"
  | "LANGUAGES_REQUIRED"
  | "LANGUAGES_TOO_LONG"
  | "INVALID_PASSWORD"
  | "COMPANY_NAME_TOO_LONG"
  | "VAT_NUMBER_TOO_LONG"
  | "OPERATING_DETAILS_REQUIRED"
  | "OPERATING_DETAILS_TOO_LONG"
  | "VEHICLE_REQUIRED"
  | "VEHICLE_DETAILS_TOO_LONG"
  | "INVALID_VEHICLE_YEAR"
  | "LICENSE_PLATE_REQUIRED"
  | "INVALID_LICENSE_PLATE"
  | "LICENSE_PLATE_ALREADY_EXISTS"
  | "INVALID_CAPACITY"
  | "INVALID_LUGGAGE_CAPACITY"
  | "MISSING_DOCUMENT"
  | "EMPTY_DOCUMENT"
  | "DOCUMENT_TOO_LARGE"
  | "INVALID_DOCUMENT_TYPE"
  | "INVALID_DOCUMENT_CONTENT"
  | "UNIQUENESS_CHECK_FAILED"
  | "AUTH_CREATION_FAILED"
  | "DOCUMENT_UPLOAD_FAILED"
  | "APPLICATION_DATABASE_FAILED"
  | "ROLLBACK_INCOMPLETE"
  | "RATE_LIMITED"
  | "UNKNOWN_ERROR";

export class RegistrationError extends Error {
  readonly code: RegistrationErrorCode;
  readonly status: number;
  readonly field?: string;

  constructor(
    code: RegistrationErrorCode,
    options?: {
      status?: number;
      field?: string;
      cause?: unknown;
    },
  ) {
    super(code, { cause: options?.cause });
    this.name = "RegistrationError";
    this.code = code;
    this.status = options?.status ?? statusForRegistrationError(code);
    this.field = options?.field;
  }
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function normalizePhone(value: string) {
  let normalized = value.trim().replace(/[^0-9+]/g, "");

  if (normalized.startsWith("00")) {
    normalized = `+${normalized.slice(2)}`;
  }

  return normalized;
}

export function normalizeLicensePlate(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function assertValidEmail(value: string) {
  const email = normalizeEmail(value);

  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    throw new RegistrationError("INVALID_EMAIL", {
      field: "email",
    });
  }

  return email;
}

export function assertValidPhone(value: string) {
  const phone = normalizePhone(value);

  if (!/^\+[1-9][0-9]{7,14}$/.test(phone)) {
    throw new RegistrationError("INVALID_PHONE", {
      field: "phone",
    });
  }

  return phone;
}

export function assertValidLicensePlate(value: string) {
  const licensePlate = normalizeLicensePlate(value);

  if (
    licensePlate.length < 4 ||
    licensePlate.length > 16
  ) {
    throw new RegistrationError("INVALID_LICENSE_PLATE", {
      field: "licensePlate",
    });
  }

  return licensePlate;
}

export function assertRequiredText(
  value: string,
  options: {
    requiredCode: RegistrationErrorCode;
    tooLongCode: RegistrationErrorCode;
    maxLength: number;
    field: string;
  },
) {
  const normalized = value.trim();

  if (!normalized) {
    throw new RegistrationError(options.requiredCode, {
      field: options.field,
    });
  }

  if (normalized.length > options.maxLength) {
    throw new RegistrationError(options.tooLongCode, {
      field: options.field,
    });
  }

  return normalized;
}

export function assertOptionalText(
  value: string,
  options: {
    tooLongCode: RegistrationErrorCode;
    maxLength: number;
    field: string;
  },
) {
  const normalized = value.trim();

  if (normalized.length > options.maxLength) {
    throw new RegistrationError(options.tooLongCode, {
      field: options.field,
    });
  }

  return normalized;
}

export function assertIntegerInRange(
  value: string,
  options: {
    code: RegistrationErrorCode;
    min: number;
    max: number;
    field: string;
  },
) {
  if (!/^\d+$/.test(value.trim())) {
    throw new RegistrationError(options.code, {
      field: options.field,
    });
  }

  const number = Number(value);

  if (
    !Number.isSafeInteger(number) ||
    number < options.min ||
    number > options.max
  ) {
    throw new RegistrationError(options.code, {
      field: options.field,
    });
  }

  return number;
}

export async function assertValidDocument(
  file: File,
  documentType: DriverDocumentType,
) {
  if (file.size <= 0) {
    throw new RegistrationError("EMPTY_DOCUMENT", {
      field: documentType,
    });
  }

  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    throw new RegistrationError("DOCUMENT_TOO_LARGE", {
      field: documentType,
    });
  }

  if (!isAllowedDocumentMimeType(file.type)) {
    throw new RegistrationError("INVALID_DOCUMENT_TYPE", {
      field: documentType,
    });
  }

  const signature = new Uint8Array(
    await file.slice(0, 16).arrayBuffer(),
  );

  if (!signatureMatchesMimeType(signature, file.type)) {
    throw new RegistrationError("INVALID_DOCUMENT_CONTENT", {
      field: documentType,
    });
  }
}

export function isDriverDocumentType(
  value: string,
): value is DriverDocumentType {
  return REQUIRED_DOCUMENT_TYPES.some((type) => type === value);
}

export function publicRegistrationMessage(
  code: RegistrationErrorCode,
) {
  const messages: Record<RegistrationErrorCode, string> = {
    INVALID_REQUEST:
      "Kayıt isteği geçersiz. Lütfen sayfayı yenileyip tekrar deneyin.",
    REQUEST_TOO_LARGE:
      "Başvurunun toplam boyutu çok büyük. Her belge 10 MB'tan küçük olmalıdır.",
    FULL_NAME_REQUIRED: "Adınızı ve soyadınızı girin.",
    FULL_NAME_TOO_LONG: "Adınız ve soyadınız çok uzun.",
    INVALID_EMAIL: "Geçerli bir e-posta adresi girin.",
    EMAIL_ALREADY_EXISTS:
      "Bu e-posta adresiyle kayıtlı bir hesap zaten var.",
    INVALID_PHONE:
      "Geçerli bir uluslararası telefon numarası girin; örneğin +90 532 123 45 67.",
    PHONE_ALREADY_EXISTS:
      "Bu telefon numarası zaten kayıtlı.",
    LANGUAGES_REQUIRED: "En az bir dil girin.",
    LANGUAGES_TOO_LONG: "Dil bilgisi çok uzun.",
    INVALID_PASSWORD:
      "Şifreniz 8 ile 128 karakter arasında olmalıdır.",
    COMPANY_NAME_TOO_LONG: "Şirket adı çok uzun.",
    VAT_NUMBER_TOO_LONG: "Vergi numarası çok uzun.",
    OPERATING_DETAILS_REQUIRED:
      "Ülke, faaliyet gösterilen şehir ve havalimanı bölgesi zorunludur.",
    OPERATING_DETAILS_TOO_LONG:
      "Çalışma bölgesi alanlarından biri çok uzun.",
    VEHICLE_REQUIRED: "Araç markası ve modeli zorunludur.",
    VEHICLE_DETAILS_TOO_LONG:
      "Araç alanlarından biri çok uzun.",
    INVALID_VEHICLE_YEAR:
      "Geçerli bir araç üretim yılı girin.",
    LICENSE_PLATE_REQUIRED: "Araç plakasını girin.",
    INVALID_LICENSE_PLATE: "Geçerli bir araç plakası girin.",
    LICENSE_PLATE_ALREADY_EXISTS:
      "Bu araç plakası zaten kayıtlı.",
    INVALID_CAPACITY: "Geçerli bir yolcu kapasitesi girin.",
    INVALID_LUGGAGE_CAPACITY:
      "Geçerli bir bagaj kapasitesi girin.",
    MISSING_DOCUMENT:
      "Gerekli tüm doğrulama belgeleri yüklenmelidir.",
    EMPTY_DOCUMENT: "Seçilen belgelerden biri boş.",
    DOCUMENT_TOO_LARGE:
      "Her belge 10 MB'tan küçük olmalıdır.",
    INVALID_DOCUMENT_TYPE:
      "Belgeler PDF, JPG, PNG veya WebP formatında olmalıdır.",
    INVALID_DOCUMENT_CONTENT:
      "Bir belgenin içeriği bildirilen dosya türüyle eşleşmiyor.",
    UNIQUENESS_CHECK_FAILED:
      "Kullanılabilirlik kontrol edilemedi. Lütfen tekrar deneyin.",
    AUTH_CREATION_FAILED:
      "Sürücü hesabı oluşturulamadı. Hiçbir kayıt oluşturulmadı.",
    DOCUMENT_UPLOAD_FAILED:
      "Bir doğrulama belgesi yüklenemedi. Hiçbir kayıt oluşturulmadı.",
    APPLICATION_DATABASE_FAILED:
      "Başvuru kaydedilemedi. Hiçbir kayıt oluşturulmadı.",
    ROLLBACK_INCOMPLETE:
      "Kayıt başarısız oldu ve destek yardımı gerekiyor. Lütfen şimdilik yeni bir başvuru göndermeyin.",
    RATE_LIMITED:
      "Çok fazla deneme yapıldı. Lütfen bekleyip tekrar deneyin.",
    UNKNOWN_ERROR:
      "Başvuru gönderilemedi. Hiçbir kayıt oluşturulmadı. Lütfen tekrar deneyin.",
  };

  return messages[code];
}

function isAllowedDocumentMimeType(mimeType: string) {
  return (
    mimeType === "application/pdf" ||
    mimeType === "image/jpeg" ||
    mimeType === "image/png" ||
    mimeType === "image/webp"
  );
}

function signatureMatchesMimeType(
  bytes: Uint8Array,
  mimeType: string,
) {
  if (mimeType === "application/pdf") {
    return (
      bytes[0] === 0x25 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x44 &&
      bytes[3] === 0x46 &&
      bytes[4] === 0x2d
    );
  }

  if (mimeType === "image/jpeg") {
    return (
      bytes[0] === 0xff &&
      bytes[1] === 0xd8 &&
      bytes[2] === 0xff
    );
  }

  if (mimeType === "image/png") {
    return (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    );
  }

  if (mimeType === "image/webp") {
    return (
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    );
  }

  return false;
}

function statusForRegistrationError(
  code: RegistrationErrorCode,
) {
  if (
    code === "EMAIL_ALREADY_EXISTS" ||
    code === "PHONE_ALREADY_EXISTS" ||
    code === "LICENSE_PLATE_ALREADY_EXISTS"
  ) {
    return 409;
  }

  if (code === "REQUEST_TOO_LARGE") {
    return 413;
  }

  if (code === "RATE_LIMITED") {
    return 429;
  }

  if (
    code === "UNIQUENESS_CHECK_FAILED" ||
    code === "AUTH_CREATION_FAILED" ||
    code === "DOCUMENT_UPLOAD_FAILED" ||
    code === "APPLICATION_DATABASE_FAILED" ||
    code === "ROLLBACK_INCOMPLETE" ||
    code === "UNKNOWN_ERROR"
  ) {
    return 500;
  }

  return 400;
}
