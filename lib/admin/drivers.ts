import "server-only";

import { requireAdmin } from "@/lib/admin/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type PendingDriverApplication = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  companyName: string | null;
  city: string | null;
  country: string | null;
  airportRegion: string | null;
  applicationStatus: string;
  submittedAt: string | null;
  vehicleName: string | null;
  documentCount: number;
};

export type AdminDriverVehicle = {
  id: string;
  name: string;
  brand: string | null;
  model: string | null;
  productionYear: number | null;
  licensePlate: string | null;
  color: string | null;
  capacity: number | null;
  luggageCapacity: number | null;
  verified: boolean;
};

export type AdminDriverDocument = {
  id: string;
  documentType: string;
  fileName: string | null;
  mimeType: string | null;
  fileSizeBytes: number | null;
  verificationStatus: string;
  verified: boolean;
  createdAt: string;
};

export type AdminDriverApplication = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  languages: string | null;
  companyName: string | null;
  vatNumber: string | null;
  city: string | null;
  country: string | null;
  airportRegion: string | null;
  applicationStatus: string;
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  verified: boolean;
  active: boolean;
  isActive: boolean;
  vehicles: AdminDriverVehicle[];
  documents: AdminDriverDocument[];
};

type DriverRow = {
  id: string;
  full_name: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  company_name: string | null;
  city: string | null;
  country: string | null;
  airport_region: string | null;
  application_status: string | null;
  application_submitted_at: string | null;
};

type VehicleRow = {
  driver_id: string;
  name: string;
};

type DocumentRow = {
  driver_id: string;
};

type DriverDetailRow = DriverRow & {
  languages: string | null;
  vat_number: string | null;
  application_reviewed_at: string | null;
  application_review_note: string | null;
  verified: boolean | null;
  active: boolean | null;
  is_active: boolean | null;
};

type VehicleDetailRow = VehicleRow & {
  id: string;
  brand: string | null;
  model: string | null;
  production_year: number | null;
  license_plate: string | null;
  color: string | null;
  capacity: number | null;
  luggage_capacity: number | null;
  verified: boolean | null;
};

type DocumentDetailRow = DocumentRow & {
  id: string;
  document_type: string;
  file_name: string | null;
  mime_type: string | null;
  file_size_bytes: number | null;
  verification_status: string;
  verified: boolean;
  created_at: string;
};

export async function getPendingDriverApplications(): Promise<
  PendingDriverApplication[]
> {
  await requireAdmin();

  const { data: driverData, error: driverError } = await supabaseAdmin
    .from("drivers")
    .select(
      `
        id,
        full_name,
        name,
        email,
        phone,
        company_name,
        city,
        country,
        airport_region,
        application_status,
        application_submitted_at
      `,
    )
    .in("application_status", ["pending", "under_review"])
    .order("application_submitted_at", {
      ascending: true,
      nullsFirst: false,
    });

  if (driverError) {
    console.error("Failed to fetch pending driver applications:", {
      code: driverError.code,
      message: driverError.message,
    });

    throw new Error("Pending applications could not be loaded.");
  }

  const drivers = (driverData ?? []) as DriverRow[];

  if (drivers.length === 0) {
    return [];
  }

  const driverIds = drivers.map((driver) => driver.id);
  const [vehicleResult, documentResult] = await Promise.all([
    supabaseAdmin
      .from("vehicles")
      .select("driver_id, name")
      .in("driver_id", driverIds),
    supabaseAdmin
      .from("driver_documents")
      .select("driver_id")
      .in("driver_id", driverIds),
  ]);

  if (vehicleResult.error) {
    console.error("Failed to fetch pending driver vehicles:", {
      code: vehicleResult.error.code,
      message: vehicleResult.error.message,
    });
  }

  if (documentResult.error) {
    console.error("Failed to fetch pending driver document counts:", {
      code: documentResult.error.code,
      message: documentResult.error.message,
    });
  }

  const vehicleByDriverId = new Map(
    ((vehicleResult.data ?? []) as VehicleRow[]).map((vehicle) => [
      vehicle.driver_id,
      vehicle.name,
    ]),
  );

  const documentCountByDriverId = (
    (documentResult.data ?? []) as DocumentRow[]
  ).reduce((counts, document) => {
    counts.set(
      document.driver_id,
      (counts.get(document.driver_id) ?? 0) + 1,
    );

    return counts;
  }, new Map<string, number>());

  return drivers.map((driver) => ({
    id: driver.id,
    fullName:
      driver.full_name?.trim() || driver.name?.trim() || "Unknown driver",
    email: driver.email?.trim() || "No email address",
    phone: driver.phone?.trim() || null,
    companyName: driver.company_name?.trim() || null,
    city: driver.city?.trim() || null,
    country: driver.country?.trim() || null,
    airportRegion: driver.airport_region?.trim() || null,
    applicationStatus: driver.application_status ?? "pending",
    submittedAt: driver.application_submitted_at,
    vehicleName: vehicleByDriverId.get(driver.id) ?? null,
    documentCount: documentCountByDriverId.get(driver.id) ?? 0,
  }));
}

export async function getAdminDriverApplication(
  driverId: string,
): Promise<AdminDriverApplication | null> {
  await requireAdmin();

  const { data, error } = await supabaseAdmin
    .from("drivers")
    .select(
      `
        id,
        full_name,
        name,
        email,
        phone,
        languages,
        company_name,
        vat_number,
        city,
        country,
        airport_region,
        application_status,
        application_submitted_at,
        application_reviewed_at,
        application_review_note,
        verified,
        active,
        is_active
      `,
    )
    .eq("id", driverId)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch admin driver application:", {
      code: error.code,
      message: error.message,
    });

    return null;
  }

  if (!data) {
    return null;
  }

  const driver = data as DriverDetailRow;
  const [vehicleResult, documentResult] = await Promise.all([
    supabaseAdmin
      .from("vehicles")
      .select(
        `
          id,
          driver_id,
          name,
          brand,
          model,
          production_year,
          license_plate,
          color,
          capacity,
          luggage_capacity,
          verified
        `,
      )
      .eq("driver_id", driverId)
      .order("created_at", { ascending: true }),
    supabaseAdmin
      .from("driver_documents")
      .select(
        `
          id,
          driver_id,
          document_type,
          file_name,
          mime_type,
          file_size_bytes,
          verification_status,
          verified,
          created_at
        `,
      )
      .eq("driver_id", driverId)
      .order("created_at", { ascending: true }),
  ]);

  if (vehicleResult.error || documentResult.error) {
    console.error("Failed to fetch admin application relations:", {
      vehicleError: vehicleResult.error?.message ?? null,
      documentError: documentResult.error?.message ?? null,
    });

    throw new Error("The complete driver application could not be loaded.");
  }

  return {
    id: driver.id,
    fullName:
      driver.full_name?.trim() || driver.name?.trim() || "Unknown driver",
    email: driver.email?.trim() || "No email address",
    phone: driver.phone?.trim() || null,
    languages: driver.languages?.trim() || null,
    companyName: driver.company_name?.trim() || null,
    vatNumber: driver.vat_number?.trim() || null,
    city: driver.city?.trim() || null,
    country: driver.country?.trim() || null,
    airportRegion: driver.airport_region?.trim() || null,
    applicationStatus: driver.application_status ?? "pending",
    submittedAt: driver.application_submitted_at,
    reviewedAt: driver.application_reviewed_at,
    reviewNote: driver.application_review_note?.trim() || null,
    verified: driver.verified === true,
    active: driver.active === true,
    isActive: driver.is_active === true,
    vehicles: ((vehicleResult.data ?? []) as VehicleDetailRow[]).map(
      (vehicle) => ({
        id: vehicle.id,
        name: vehicle.name,
        brand: vehicle.brand,
        model: vehicle.model,
        productionYear: vehicle.production_year,
        licensePlate: vehicle.license_plate,
        color: vehicle.color,
        capacity: vehicle.capacity,
        luggageCapacity: vehicle.luggage_capacity,
        verified: vehicle.verified === true,
      }),
    ),
    documents: ((documentResult.data ?? []) as DocumentDetailRow[]).map(
      (document) => ({
        id: document.id,
        documentType: document.document_type,
        fileName: document.file_name,
        mimeType: document.mime_type,
        fileSizeBytes: document.file_size_bytes,
        verificationStatus: document.verification_status,
        verified: document.verified === true,
        createdAt: document.created_at,
      }),
    ),
  };
}
