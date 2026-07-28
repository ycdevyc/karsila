import { NextResponse } from "next/server";

import { getCurrentAdmin } from "@/lib/admin/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

type RouteContext = {
  params: Promise<{
    documentId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json(
      { success: false, error: "Admin access required." },
      { status: 401 },
    );
  }

  const { documentId } = await context.params;
  const { data: document, error } = await supabaseAdmin
    .from("driver_documents")
    .select("file_path")
    .eq("id", documentId)
    .maybeSingle();

  if (error || !document) {
    return NextResponse.json(
      { success: false, error: "Document not found." },
      { status: 404 },
    );
  }

  const { data, error: signedUrlError } = await supabaseAdmin.storage
    .from("driver-documents")
    .createSignedUrl(document.file_path, 300);

  if (signedUrlError || !data?.signedUrl) {
    console.error("Failed to create admin document URL:", {
      adminId: admin.id,
      documentId,
      message: signedUrlError?.message ?? null,
    });

    return NextResponse.json(
      { success: false, error: "Document could not be opened." },
      { status: 500 },
    );
  }

  return NextResponse.redirect(data.signedUrl);
}
