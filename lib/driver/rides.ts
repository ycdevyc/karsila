import { supabase } from "@/lib/supabase";

export type DriverRide = {
  id: string;
  public_id: string;
  pickup_location: string;
  dropoff_location: string;
  flight_number: string | null;
  passengers: number | null;
  scheduled_at: string | null;
  customer_note: string | null;
  status: string;
  created_at: string;
};

export async function getOpenDriverRides(): Promise<DriverRide[]> {
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
    `
    )
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch open driver rides:", error);
    return [];
  }

  return data ?? [];
}
