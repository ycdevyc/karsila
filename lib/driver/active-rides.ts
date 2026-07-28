import "server-only";

import { getCurrentApprovedServerDriver } from "@/lib/driver/profile-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type ActiveDriverRide = {
  id: string;
  public_id: string;
  customer_name: string;
  phone: string;
  email: string | null;
  pickup_location: string;
  dropoff_location: string;
  scheduled_at: string | null;
  passengers: number | null;
  flight_number: string | null;
  customer_note: string | null;
  status: string;
  driver_id: string;
  created_at: string;
  accepted_price_eur: number | null;
  accepted_message: string | null;
};

type ActiveRideRow = {
  id: string;
  public_id: string;
  customer_name: string;
  phone: string;
  email: string | null;
  pickup_location: string;
  dropoff_location: string;
  scheduled_at: string | null;
  passengers: number | null;
  flight_number: string | null;
  customer_note: string | null;
  status: string;
  driver_id: string;
  created_at: string;
};

type AcceptedOfferRow = {
  ride_id: string;
  price_eur: number;
  message: string | null;
};

export async function getActiveDriverRides(): Promise<ActiveDriverRide[]> {
  const driver = await getCurrentApprovedServerDriver();

  if (!driver) {
    console.error("No logged-in server driver found.");
    return [];
  }

  const { data: rideData, error: rideError } = await supabaseAdmin
    .from("rides")
    .select(
      `
        id,
        public_id,
        customer_name,
        phone,
        email,
        pickup_location,
        dropoff_location,
        scheduled_at,
        passengers,
        flight_number,
        customer_note,
        status,
        driver_id,
        created_at
      `
    )
    .eq("driver_id", driver.id)
    .eq("status", "confirmed")
    .order("scheduled_at", {
      ascending: true,
      nullsFirst: false,
    });

  if (rideError) {
    console.error("Failed to fetch active driver rides:", {
      message: rideError.message,
      details: rideError.details,
      hint: rideError.hint,
      code: rideError.code,
      driverId: driver.id,
    });

    return [];
  }

  const rides = (rideData ?? []) as ActiveRideRow[];

  if (rides.length === 0) {
    return [];
  }

  const rideIds = rides.map((ride) => ride.id);

  const { data: offerData, error: offerError } = await supabaseAdmin
    .from("offers")
    .select("ride_id, price_eur, message")
    .in("ride_id", rideIds)
    .eq("driver_id", driver.id)
    .eq("status", "accepted");

  if (offerError) {
    console.error("Failed to fetch accepted driver offers:", {
      message: offerError.message,
      details: offerError.details,
      hint: offerError.hint,
      code: offerError.code,
      driverId: driver.id,
    });
  }

  const acceptedOffers = (offerData ?? []) as AcceptedOfferRow[];

  const acceptedOfferByRideId = new Map(
    acceptedOffers.map((offer) => [offer.ride_id, offer])
  );

  return rides.map((ride) => {
    const acceptedOffer = acceptedOfferByRideId.get(ride.id);

    return {
      id: ride.id,
      public_id: ride.public_id,
      customer_name: ride.customer_name,
      phone: ride.phone,
      email: ride.email,
      pickup_location: ride.pickup_location,
      dropoff_location: ride.dropoff_location,
      scheduled_at: ride.scheduled_at,
      passengers: ride.passengers,
      flight_number: ride.flight_number,
      customer_note: ride.customer_note,
      status: ride.status,
      driver_id: ride.driver_id,
      created_at: ride.created_at,
      accepted_price_eur: acceptedOffer?.price_eur ?? null,
      accepted_message: acceptedOffer?.message ?? null,
    };
  });
}
