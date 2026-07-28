import "server-only";

import { getCurrentServerDriver } from "@/lib/driver/profile-server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export type DashboardStats = {
  openRequests: number;
  activeTrips: number;
  pendingOffers: number;
  acceptedOffers: number;
};

export type DashboardRecentRide = {
  id: string;
  pickup_location: string;
  dropoff_location: string;
  scheduled_at: string | null;
  passengers: number | null;
  flight_number: string | null;
  customer_note: string | null;
};

export type DashboardActiveRide = {
  id: string;
  pickup_location: string;
  dropoff_location: string;
  scheduled_at: string | null;
  passengers: number | null;
  flight_number: string | null;
};

export type DriverDashboardData = {
  driver: {
    id: string;
    name: string;
  };
  stats: DashboardStats;
  recentRequests: DashboardRecentRide[];
  activeTrips: DashboardActiveRide[];
};

export async function getDriverDashboard(): Promise<DriverDashboardData | null> {
  const driver = await getCurrentServerDriver();

  if (!driver) {
    return null;
  }

  const supabase = await createSupabaseServerClient();

  const [
    openRideResult,
    activeRideResult,
    pendingOfferResult,
    acceptedOfferResult,
    recentRideResult,
  ] = await Promise.all([
    supabase
      .from("rides")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("status", "open"),

    supabase
      .from("rides")
      .select(
        `
          id,
          pickup_location,
          dropoff_location,
          scheduled_at,
          passengers,
          flight_number
        `,
      )
      .eq("driver_id", driver.id)
      .eq("status", "confirmed")
      .order("scheduled_at", {
        ascending: true,
      })
      .limit(10),

    supabase
      .from("offers")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("driver_id", driver.id)
      .eq("status", "pending"),

    supabase
      .from("offers")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("driver_id", driver.id)
      .eq("status", "accepted"),

    supabase
      .from("rides")
      .select(
        `
          id,
          pickup_location,
          dropoff_location,
          scheduled_at,
          passengers,
          flight_number,
          customer_note
        `,
      )
      .eq("status", "open")
      .order("created_at", {
        ascending: false,
      })
      .limit(5),
  ]);

  if (openRideResult.error) {
    console.error(
      "Failed to count open dashboard rides:",
      openRideResult.error,
    );
  }

  if (activeRideResult.error) {
    console.error(
      "Failed to fetch active dashboard rides:",
      activeRideResult.error,
    );
  }

  if (pendingOfferResult.error) {
    console.error(
      "Failed to count pending dashboard offers:",
      pendingOfferResult.error,
    );
  }

  if (acceptedOfferResult.error) {
    console.error(
      "Failed to count accepted dashboard offers:",
      acceptedOfferResult.error,
    );
  }

  if (recentRideResult.error) {
    console.error(
      "Failed to fetch recent dashboard rides:",
      recentRideResult.error,
    );
  }

  const activeTrips: DashboardActiveRide[] =
    activeRideResult.data?.map((ride) => ({
      id: ride.id,
      pickup_location: ride.pickup_location,
      dropoff_location: ride.dropoff_location,
      scheduled_at: ride.scheduled_at,
      passengers: ride.passengers,
      flight_number: ride.flight_number,
    })) ?? [];

  const recentRequests: DashboardRecentRide[] =
    recentRideResult.data?.map((ride) => ({
      id: ride.id,
      pickup_location: ride.pickup_location,
      dropoff_location: ride.dropoff_location,
      scheduled_at: ride.scheduled_at,
      passengers: ride.passengers,
      flight_number: ride.flight_number,
      customer_note: ride.customer_note,
    })) ?? [];

  return {
    driver: {
      id: driver.id,
      name: driver.name,
    },

    stats: {
      openRequests: openRideResult.count ?? 0,
      activeTrips: activeRideResult.count ?? activeTrips.length,
      pendingOffers: pendingOfferResult.count ?? 0,
      acceptedOffers: acceptedOfferResult.count ?? 0,
    },

    recentRequests,
    activeTrips,
  };
}
