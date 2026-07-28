import { supabase } from "@/lib/supabase";

export type OfferStatus = "pending" | "accepted" | "rejected";

export type DriverOfferRide = {
  pickup_location: string;
  dropoff_location: string;
  scheduled_at: string | null;
  passengers: number | null;
  flight_number: string | null;
  status: string;
};

export type DriverOffer = {
  id: string;
  ride_id: string;
  driver_id: string;
  price_eur: number;
  message: string | null;
  status: OfferStatus;
  created_at: string;
  ride: DriverOfferRide | null;
};

type CreateDriverProposalInput = {
  rideId: string;
  driverId: string;
  priceEur: number;
  message: string | null;
};

type CreateDriverProposalResult = {
  success: boolean;
  errorMessage?: string;
};

type DriverOfferRow = {
  id: string;
  ride_id: string;
  driver_id: string;
  price_eur: number;
  message: string | null;
  status: OfferStatus;
  created_at: string;
  ride: DriverOfferRide | DriverOfferRide[] | null;
};

export async function createDriverProposal({
  rideId,
  driverId,
  priceEur,
  message,
}: CreateDriverProposalInput): Promise<CreateDriverProposalResult> {
  if (!rideId || !driverId) {
    return {
      success: false,
      errorMessage: "Transfer veya sürücü belirlenemedi.",
    };
  }

  if (!Number.isFinite(priceEur) || priceEur <= 0) {
    return {
      success: false,
      errorMessage: "Geçerli bir fiyat girin.",
    };
  }

  const { data: existingOffers, error: existingOfferError } = await supabase
    .from("offers")
    .select("id, status")
    .eq("ride_id", rideId)
    .eq("driver_id", driverId)
    .limit(1);

  if (existingOfferError) {
    console.error(
      "Failed to check existing driver proposal:",
      existingOfferError
    );

    return {
      success: false,
      errorMessage: "Mevcut teklif kontrol edilemedi.",
    };
  }

  if (existingOffers && existingOffers.length > 0) {
    return {
      success: false,
      errorMessage: "Bu transfer için zaten bir teklif gönderdiniz.",
    };
  }

  const normalizedMessage = message?.trim() || null;

  const { error } = await supabase.from("offers").insert({
    ride_id: rideId,
    driver_id: driverId,
    price_eur: priceEur,
    message: normalizedMessage,
    status: "pending" satisfies OfferStatus,
  });

  if (error) {
    console.error("Failed to create driver proposal:", error);

    return {
      success: false,
      errorMessage: "Teklif kaydedilemedi.",
    };
  }

  return {
    success: true,
  };
}

function normalizeDriverOffer(row: DriverOfferRow): DriverOffer {
  const ride = Array.isArray(row.ride) ? row.ride[0] ?? null : row.ride;

  return {
    id: row.id,
    ride_id: row.ride_id,
    driver_id: row.driver_id,
    price_eur: row.price_eur,
    message: row.message,
    status: row.status,
    created_at: row.created_at,
    ride,
  };
}

export async function getDriverOffers(
  driverId: string
): Promise<DriverOffer[]> {
  if (!driverId) {
    console.error("Cannot fetch driver offers without a driver ID.");
    return [];
  }

  const { data, error } = await supabase
    .from("offers")
    .select(
      `
        id,
        ride_id,
        driver_id,
        price_eur,
        message,
        status,
        created_at,
        ride:rides (
          pickup_location,
          dropoff_location,
          scheduled_at,
          passengers,
          flight_number,
          status
        )
      `
    )
    .eq("driver_id", driverId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch driver offers:", error);
    return [];
  }

  return ((data ?? []) as DriverOfferRow[]).map(normalizeDriverOffer);
}
