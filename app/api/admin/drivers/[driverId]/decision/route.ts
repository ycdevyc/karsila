import { NextResponse } from "next/server";

import { getCurrentAdmin } from "@/lib/admin/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

type ReviewAction = "approve" | "reject" | "suspend";

type RequestBody = {
  action?: unknown;
  note?: unknown;
};

type ReviewResult = {
  success?: boolean;
  code?: string;
  message?: string;
  status?: string;
};

type RouteContext = {
  params: Promise<{
    driverId: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json(
      {
        success: false,
        code: "ADMIN_ACCESS_REQUIRED",
        message: "Admin access is required.",
      },
      { status: 401 },
    );
  }

  try {
    const { driverId } = await context.params;
    const body = (await request.json()) as RequestBody;
    const action = parseAction(body.action);
    const note = parseNote(body.note);

    if ((action === "reject" || action === "suspend") && !note) {
      return NextResponse.json(
        {
          success: false,
          code: "REVIEW_NOTE_REQUIRED",
          message: "Add a reason before continuing.",
        },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin.rpc(
      "review_driver_application",
      {
        p_driver_id: driverId,
        p_action: action,
        p_admin_auth_user_id: admin.id,
        p_note: note,
      },
    );

    if (error) {
      console.error("Admin driver review RPC failed:", {
        adminId: admin.id,
        driverId,
        action,
        code: error.code,
        message: error.message,
      });

      return NextResponse.json(
        {
          success: false,
          code: "REVIEW_FAILED",
          message: "The review decision could not be saved.",
        },
        { status: 500 },
      );
    }

    const result = (data ?? {}) as ReviewResult;

    if (result.success !== true) {
      return NextResponse.json(
        {
          success: false,
          code: result.code ?? "REVIEW_FAILED",
          message: result.message ?? "The review decision could not be saved.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      status: result.status,
    });
  } catch (error) {
    console.error("Admin driver review endpoint failed:", error);

    return NextResponse.json(
      {
        success: false,
        code: "INVALID_REQUEST",
        message: "The review request is invalid.",
      },
      { status: 400 },
    );
  }
}

function parseAction(value: unknown): ReviewAction {
  if (value === "approve" || value === "reject" || value === "suspend") {
    return value;
  }

  throw new Error("INVALID_ACTION");
}

function parseNote(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error("INVALID_NOTE");
  }

  const normalized = value.trim();

  if (normalized.length > 2000) {
    throw new Error("INVALID_NOTE");
  }

  return normalized || null;
}
