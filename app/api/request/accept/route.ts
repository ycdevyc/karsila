import { NextResponse } from "next/server";

import { acceptProposal } from "@/lib/request/accept-proposal";

type AcceptProposalRequestBody = {
  publicId?: unknown;
  accessToken?: unknown;
  proposalId?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AcceptProposalRequestBody;

    const publicId =
      typeof body.publicId === "string" ? body.publicId.trim() : "";

    const accessToken =
      typeof body.accessToken === "string" ? body.accessToken.trim() : "";

    const proposalId =
      typeof body.proposalId === "string" ? body.proposalId.trim() : "";

    if (!publicId || !accessToken || !proposalId) {
      return NextResponse.json(
        {
          success: false,
          errorMessage: "Missing or invalid request details.",
        },
        { status: 400 }
      );
    }

    const result = await acceptProposal({
      publicId,
      accessToken,
      proposalId,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Failed to accept proposal:", error);

    return NextResponse.json(
      {
        success: false,
        errorMessage:
          "The offer could not be accepted because of an unexpected error.",
      },
      { status: 500 }
    );
  }
}
