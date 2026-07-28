import "server-only";

import type { DriverRide } from "@/lib/driver/rides";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function getDriverRideById(
  rideId: string,
): Promise<DriverRide | null> {
  const normalizedRideId = rideId.trim();

  if (!normalizedRideId) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("rides")
    .select(
      `
        id,
        public_id,
        pickup_location,
        dropoff_location,
        flight_number,
        passengers,
        scheduled_at,
        customer_note,
        status,
        created_at
      `,
    )
    .eq("id", normalizedRideId)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch server driver ride:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });

    return null;
  }

  return (data as DriverRide | null) ?? null;
}
