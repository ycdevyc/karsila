import { supabase } from "@/lib/supabase";

type AcceptProposalInput = {
  rideId: string;
  proposalId: string;
};

export async function acceptProposal({
  rideId,
  proposalId,
}: AcceptProposalInput): Promise<{
  success: boolean;
  errorMessage?: string;
}> {
  const { error: acceptError } = await supabase
    .from("offers")
    .update({ status: "accepted" })
    .eq("id", proposalId)
    .eq("ride_id", rideId);

  if (acceptError) {
    console.error("Failed to accept proposal:", acceptError);

    return {
      success: false,
      errorMessage: "The offer could not be selected.",
    };
  }

  const { error: rejectError } = await supabase
    .from("offers")
    .update({ status: "rejected" })
    .eq("ride_id", rideId)
    .neq("id", proposalId);

  if (rejectError) {
    console.error("Failed to reject other proposals:", rejectError);

    return {
      success: false,
      errorMessage: "The other offers could not be updated.",
    };
  }

  const { error: rideError } = await supabase
    .from("rides")
    .update({ status: "driver_selected" })
    .eq("id", rideId);

  if (rideError) {
    console.error("Failed to update ride status:", rideError);

    return {
      success: false,
      errorMessage: "The request status could not be updated.",
    };
  }

  return {
    success: true,
  };
}
