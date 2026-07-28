import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

const MAX_REQUEST_BODY_BYTES = 16_384;
const RATE_LIMIT_WINDOW_MS = 15 * 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitEntries = new Map<string, RateLimitEntry>();

export async function POST(request: Request) {
  try {
    assertRequestSize(request);
    assertRateLimit(request);

    const body = (await request.json()) as Record<string, unknown>;

    const publicId = getRequiredText(body.public_id, 32);
    const accessToken = getRequiredText(body.access_token, 128);
    const customerName = getRequiredText(body.customer_name, 160);
    const phone = getRequiredText(body.phone, 32);
    const email = getRequiredText(body.email, 320).toLowerCase();
    const pickupLocation = getRequiredText(body.pickup_location, 500);
    const dropoffLocation = getRequiredText(body.dropoff_location, 500);
    const flightNumber = getOptionalText(body.flight_number, 64);
    const customerNote = getOptionalText(body.customer_note, 2000);
    const passengers = Number(body.passengers);
    const scheduledAt =
      typeof body.scheduled_at === "string" ? body.scheduled_at.trim() : "";

    if (!/^(?:KA|FL)-[A-Z0-9]{6}$/.test(publicId)) {
      throw new RequestValidationError(
        "INVALID_PUBLIC_ID",
        "The transfer request could not be created.",
      );
    }

    if (!isUuid(accessToken)) {
      throw new RequestValidationError(
        "INVALID_ACCESS_TOKEN",
        "The transfer request could not be created.",
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new RequestValidationError(
        "INVALID_EMAIL",
        "Enter a valid email address.",
      );
    }

    if (!Number.isInteger(passengers) || passengers < 1 || passengers > 100) {
      throw new RequestValidationError(
        "INVALID_PASSENGERS",
        "Enter a valid number of passengers.",
      );
    }

    const scheduledDate = new Date(scheduledAt);

    if (!scheduledAt || Number.isNaN(scheduledDate.getTime())) {
      throw new RequestValidationError(
        "INVALID_SCHEDULED_AT",
        "Enter a valid pickup date and time.",
      );
    }

    const { data, error } = await supabaseAdmin
      .from("rides")
      .insert({
        public_id: publicId,
        access_token: accessToken,
        customer_name: customerName,
        phone,
        email,
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation,
        flight_number: flightNumber,
        passengers,
        scheduled_at: scheduledAt,
        customer_note: customerNote,
        status: "open",
      })
      .select("id, public_id")
      .single();

    if (error) {
      console.error("Failed to create ride:", {
        code: error.code,
        message: error.message,
      });

      return NextResponse.json(
        {
          success: false,
          code: "RIDE_CREATION_FAILED",
          error: "The transfer request could not be created.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        ride: data,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof RequestValidationError) {
      return NextResponse.json(
        {
          success: false,
          code: error.code,
          error: error.message,
        },
        { status: 400 },
      );
    }

    console.error("Unexpected ride creation error:", error);

    return NextResponse.json(
      {
        success: false,
        code: "INVALID_REQUEST",
        error: "The transfer request could not be created.",
      },
      { status: 400 },
    );
  }
}

class RequestValidationError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

function getRequiredText(value: unknown, maximumLength: number) {
  if (typeof value !== "string") {
    throw new RequestValidationError(
      "INVALID_FIELD",
      "Check the submitted details.",
    );
  }

  const normalized = value.trim();

  if (!normalized || normalized.length > maximumLength) {
    throw new RequestValidationError(
      "INVALID_FIELD",
      "Check the submitted details.",
    );
  }

  return normalized;
}

function getOptionalText(value: unknown, maximumLength: number) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new RequestValidationError(
      "INVALID_FIELD",
      "Check the submitted details.",
    );
  }

  const normalized = value.trim();

  if (normalized.length > maximumLength) {
    throw new RequestValidationError(
      "INVALID_FIELD",
      "Check the submitted details.",
    );
  }

  return normalized || null;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function assertRequestSize(request: Request) {
  const contentLength = request.headers.get("content-length");

  if (
    contentLength &&
    Number(contentLength) > MAX_REQUEST_BODY_BYTES
  ) {
    throw new RequestValidationError(
      "REQUEST_TOO_LARGE",
      "The request contains too much information.",
    );
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

    return;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    throw new RequestValidationError(
      "RATE_LIMITED",
      "You have sent too many requests. Please try again later.",
    );
  }

  current.count += 1;
}

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const forwardedAddress = forwardedFor?.split(",")[0]?.trim();

  return (
    forwardedAddress ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}
