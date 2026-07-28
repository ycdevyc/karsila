import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";

export type RequestPortalRide = {
  id: string;
  public_id: string;
  access_token: string;
  customer_name: string;
  phone: string | null;
  email: string | null;
  pickup_location: string;
  dropoff_location: string;
  flight_number: string | null;
  passengers: number | null;
  scheduled_at: string | null;
  customer_note: string | null;
  status: string;
  created_at: string;
};

export type RequestPortalProposalStatus =
  | "pending"
  | "accepted"
  | "rejected";

export type RequestPortalProposal = {
  id: string;
  ride_id: string;
  driver_id: string;
  driver_name: string;
  driver_phone: string | null;
  driver_profile_photo: string | null;
  driver_languages: string | null;
  driver_rating: number | null;
  vehicle_name: string | null;
  price_eur: number;
  message: string | null;
  status: RequestPortalProposalStatus;
  created_at: string;
};

export type RequestPortalData = {
  ride: RequestPortalRide;
  proposals: RequestPortalProposal[];
  acceptedProposal: RequestPortalProposal | null;
};

type OfferRow = {
  id: string;
  ride_id: string;
  driver_id: string;
  price_eur: number;
  message: string | null;
  status: RequestPortalProposalStatus;
  created_at: string;
};

type VehicleRow = {
  id: string;
  name: string;
};

type DriverRow = {
  id: string;
  name: string | null;
  full_name: string | null;
  phone: string | null;
  profile_photo: string | null;
  languages: string | null;
  rating: number | null;
  vehicle: VehicleRow | VehicleRow[] | null;
};

function normalizeVehicle(
  vehicle: VehicleRow | VehicleRow[] | null
): VehicleRow | null {
  if (Array.isArray(vehicle)) {
    return vehicle[0] ?? null;
  }

  return vehicle;
}

export async function getRequestPortalData(
  publicId: string,
  accessToken: string
): Promise<RequestPortalData | null> {
  const normalizedPublicId = publicId.trim();
  const normalizedAccessToken = accessToken.trim();

  if (!normalizedPublicId || !normalizedAccessToken) {
    return null;
  }

  /*
   * The portal is authorized by the unguessable public ID + access token,
   * not by a Supabase user session. All reads therefore happen through the
   * server-only admin client after both values have been validated. This
   * keeps the underlying tables closed to the anon role.
   */
  const { data: ride, error: rideError } = await supabaseAdmin
    .from("rides")
    .select(
      `
        id,
        public_id,
        access_token,
        customer_name,
        phone,
        email,
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
    .eq("public_id", normalizedPublicId)
    .eq("access_token", normalizedAccessToken)
    .single();

  if (rideError || !ride) {
    console.error("Failed to fetch request portal ride:", rideError);
    return null;
  }

  const { data: offerData, error: offersError } =
    await supabaseAdmin
    .from("offers")
    .select(
      `
        id,
        ride_id,
        driver_id,
        price_eur,
        message,
        status,
        created_at
      `
    )
    .eq("ride_id", ride.id)
    .order("price_eur", { ascending: true });

  if (offersError) {
    console.error("Failed to fetch request portal offers:", offersError);

    return {
      ride: ride as RequestPortalRide,
      proposals: [],
      acceptedProposal: null,
    };
  }

  const offers = (offerData ?? []) as OfferRow[];

  const driverIds = Array.from(
    new Set(offers.map((offer) => offer.driver_id))
  );

  let drivers: DriverRow[] = [];

  if (driverIds.length > 0) {
    const { data: driverData, error: driversError } =
      await supabaseAdmin
      .from("drivers")
      .select(
        `
          id,
          name,
          full_name,
          phone,
          profile_photo,
          languages,
          rating,
          vehicle:vehicles (
            id,
            name
          )
        `
      )
      .in("id", driverIds);

    if (driversError) {
      console.error("Failed to fetch proposal drivers:", driversError);
    } else {
      drivers = (driverData ?? []) as DriverRow[];
    }
  }

  const driverById = new Map(
    drivers.map((driver) => [driver.id, driver])
  );

  const proposals: RequestPortalProposal[] = offers.map((offer) => {
    const driver = driverById.get(offer.driver_id);
    const vehicle = normalizeVehicle(driver?.vehicle ?? null);

    const driverName =
      driver?.name?.trim() ||
      driver?.full_name?.trim() ||
      "Karsila";

    return {
      id: offer.id,
      ride_id: offer.ride_id,
      driver_id: offer.driver_id,
      driver_name: driverName,
      driver_phone:
        offer.status === "accepted"
          ? driver?.phone?.trim() || null
          : null,
      driver_profile_photo: driver?.profile_photo?.trim() || null,
      driver_languages: driver?.languages?.trim() || null,
      driver_rating: driver?.rating ?? null,
      vehicle_name: vehicle?.name?.trim() || null,
      price_eur: offer.price_eur,
      message: offer.message,
      status: offer.status,
      created_at: offer.created_at,
    };
  });

  const acceptedProposal =
    proposals.find((proposal) => proposal.status === "accepted") ?? null;

  return {
    ride: ride as RequestPortalRide,
    proposals,
    acceptedProposal,
  };
}
