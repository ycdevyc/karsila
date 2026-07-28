import { supabase } from "@/lib/supabase";

export type CurrentDriver = {
  id: string;
  name: string;
  vehicle_id: string | null;
};

export async function getCurrentDriver(): Promise<CurrentDriver | null> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Failed to fetch auth user:", userError);
    return null;
  }

  const { data: driver, error: driverError } = await supabase
    .from("drivers")
    .select("id, name, vehicle_id")
    .eq("auth_user_id", user.id)
    .single();

  if (driverError || !driver) {
    console.error("Failed to fetch current driver:", driverError);
    return null;
  }

  return driver;
}