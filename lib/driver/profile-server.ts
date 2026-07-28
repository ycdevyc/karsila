import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase-server";

export type CurrentServerDriver = {
  id: string;
  auth_user_id: string;
  name: string;
  vehicle_id: string | null;
};

type ServerDriverAccessRow = {
  id: string;
  auth_user_id: string;
  name: string | null;
  vehicle_id: string | null;
  verified: boolean | null;
  active: boolean | null;
  is_active: boolean | null;
};

export type DriverProfile = {
  id: string;
  auth_user_id: string;
  name: string;
  full_name: string | null;
  phone: string | null;
  languages: string | null;
  rating: number | null;
  profile_photo: string | null;
  vehicle_id: string | null;
  vehicle_name: string | null;
  verified: boolean;
  active: boolean;
};

export type VehicleOption = {
  id: string;
  name: string;
};

type DriverRow = {
  id: string;
  auth_user_id: string;
  name: string | null;
  full_name: string | null;
  phone: string | null;
  languages: string | null;
  rating: number | null;
  profile_photo: string | null;
  vehicle_id: string | null;
  verified: boolean | null;
  active: boolean | null;
};

type VehicleRow = {
  id: string;
  name: string;
};

export type UpdateDriverProfileInput = {
  name: string;
  phone: string | null;
  languages: string | null;
  vehicleId: string | null;
  profilePhoto: string | null;
};

export type UpdateDriverProfileResult = {
  success: boolean;
  errorMessage?: string;
};

function normalizeText(
  value: string | null | undefined
): string | null {
  const normalizedValue = value?.trim();

  return normalizedValue ? normalizedValue : null;
}

function logSupabaseError(
  label: string,
  error: {
    message?: string;
    details?: string;
    hint?: string;
    code?: string;
  } | null
) {
  console.error(label, {
    message: error?.message ?? null,
    details: error?.details ?? null,
    hint: error?.hint ?? null,
    code: error?.code ?? null,
  });
}

async function getAuthenticatedUserId(): Promise<string | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    logSupabaseError(
      "Failed to fetch authenticated driver user:",
      error
    );

    return null;
  }

  return user?.id ?? null;
}

/**
 * Existing driver functions, including active-rides.ts, use this
 * compatibility helper.
 */
export async function getCurrentServerDriver(): Promise<CurrentServerDriver | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    logSupabaseError(
      "Failed to fetch authenticated server driver:",
      userError
    );

    return null;
  }

  if (!user) {
    return null;
  }

  const { data: driverData, error: driverError } = await supabase
    .from("drivers")
    .select(
      `
        id,
        auth_user_id,
        name,
        vehicle_id
      `
    )
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (driverError) {
    logSupabaseError(
      "Failed to fetch current server driver:",
      driverError
    );

    return null;
  }

  if (!driverData) {
    return null;
  }

  return {
    id: driverData.id,
    auth_user_id: driverData.auth_user_id,
    name: normalizeText(driverData.name) ?? "Sürücü",
    vehicle_id: driverData.vehicle_id ?? null,
  };
}

export async function getCurrentApprovedServerDriver(): Promise<CurrentServerDriver | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    logSupabaseError(
      "Failed to fetch approved server driver user:",
      userError
    );

    return null;
  }

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("drivers")
    .select(
      `
        id,
        auth_user_id,
        name,
        vehicle_id,
        verified,
        active,
        is_active
      `
    )
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error) {
    logSupabaseError(
      "Failed to fetch approved server driver:",
      error
    );

    return null;
  }

  const driver = data as ServerDriverAccessRow | null;

  if (
    !driver ||
    driver.verified !== true ||
    driver.active !== true ||
    driver.is_active !== true
  ) {
    return null;
  }

  return {
    id: driver.id,
    auth_user_id: driver.auth_user_id,
    name: normalizeText(driver.name) ?? "Sürücü",
    vehicle_id: driver.vehicle_id ?? null,
  };
}

export async function getCurrentDriverProfile(): Promise<DriverProfile | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    logSupabaseError(
      "Failed to fetch authenticated driver:",
      userError
    );

    return null;
  }

  if (!user) {
    return null;
  }

  const { data: driverData, error: driverError } = await supabase
    .from("drivers")
    .select(
      `
        id,
        auth_user_id,
        name,
        full_name,
        phone,
        languages,
        rating,
        profile_photo,
        vehicle_id,
        verified,
        active
      `
    )
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (driverError) {
    logSupabaseError(
      "Failed to fetch driver profile:",
      driverError
    );

    return null;
  }

  if (!driverData) {
    return null;
  }

  const driver = driverData as DriverRow;

  let vehicle: VehicleRow | null = null;

  if (driver.vehicle_id) {
    const { data: vehicleData, error: vehicleError } = await supabase
      .from("vehicles")
      .select(
        `
          id,
          name
        `
      )
      .eq("id", driver.vehicle_id)
      .maybeSingle();

    if (vehicleError) {
      logSupabaseError(
        "Failed to fetch driver vehicle:",
        vehicleError
      );
    } else if (vehicleData) {
      vehicle = vehicleData as VehicleRow;
    }
  }

  const driverName =
    normalizeText(driver.name) ??
    normalizeText(driver.full_name) ??
    "Sürücü";

  return {
    id: driver.id,
    auth_user_id: driver.auth_user_id,
    name: driverName,
    full_name: normalizeText(driver.full_name),
    phone: normalizeText(driver.phone),
    languages: normalizeText(driver.languages),
    rating: driver.rating ?? null,
    profile_photo: normalizeText(driver.profile_photo),
    vehicle_id: driver.vehicle_id ?? null,
    vehicle_name: normalizeText(vehicle?.name),
    verified: driver.verified ?? false,
    active: driver.active ?? false,
  };
}

export async function getAvailableVehicles(): Promise<
  VehicleOption[]
> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("vehicles")
    .select(
      `
        id,
        name
      `
    )
    .order("name", { ascending: true });

  if (error) {
    logSupabaseError(
      "Failed to fetch available vehicles:",
      error
    );

    return [];
  }

  return (data ?? []) as VehicleOption[];
}

export async function updateCurrentDriverProfile(
  input: UpdateDriverProfileInput
): Promise<UpdateDriverProfileResult> {
  const supabase = await createSupabaseServerClient();

  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return {
      success: false,
      errorMessage: "Sürücü olarak giriş yapmadınız.",
    };
  }

  const normalizedName = input.name.trim();

  if (!normalizedName) {
    return {
      success: false,
      errorMessage: "Bir ad girin.",
    };
  }

  const { error: updateError } = await supabase
    .from("drivers")
    .update({
      name: normalizedName,
      full_name: normalizedName,
      phone: normalizeText(input.phone),
      languages: normalizeText(input.languages),
      vehicle_id: input.vehicleId || null,
      profile_photo: normalizeText(input.profilePhoto),
    })
    .eq("auth_user_id", userId);

  if (updateError) {
    logSupabaseError(
      "Failed to update driver profile:",
      updateError
    );

    return {
      success: false,
      errorMessage:
        "Sürücü profili güncellenemedi.",
    };
  }

  return {
    success: true,
  };
}
