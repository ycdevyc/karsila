import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";

type AcceptProposalInput = {
  publicId: string;
  accessToken: string;
  proposalId: string;
};

type AcceptProposalResult = {
  success: boolean;
  errorMessage?: string;
};

type AcceptProposalRpcResult = {
  success?: unknown;
  errorMessage?: unknown;
};

export async function acceptProposal({
  publicId,
  accessToken,
  proposalId,
}: AcceptProposalInput): Promise<AcceptProposalResult> {
  const { data, error } = await supabaseAdmin.rpc(
    "accept_falcon_proposal",
    {
      p_public_id: publicId,
      p_access_token: accessToken,
      p_proposal_id: proposalId,
    },
  );

  if (error) {
    console.error("Failed to call accept_falcon_proposal:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    return {
      success: false,
      errorMessage: "The offer could not be accepted.",
    };
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    console.error("Invalid accept proposal response:", data);

    return {
      success: false,
      errorMessage: "The offer could not be accepted.",
    };
  }

  const result = data as AcceptProposalRpcResult;

  if (result.success !== true) {
    const errorMessage =
      typeof result.errorMessage === "string"
        ? result.errorMessage
        : "The offer could not be accepted.";

    console.error("Proposal acceptance failed:", errorMessage);

    return {
      success: false,
      errorMessage,
    };
  }

  return {
    success: true,
  };
}
