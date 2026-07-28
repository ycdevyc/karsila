"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { updateCurrentDriverProfile } from "@/lib/driver/profile-server";

export type DriverProfileFormState = {
  success: boolean;
  errorMessage: string | null;
};

function getFormValue(
  formData: FormData,
  fieldName: string
): string | null {
  const value = formData.get(fieldName);

  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue ? normalizedValue : null;
}

export async function updateDriverProfileAction(
  _previousState: DriverProfileFormState,
  formData: FormData
): Promise<DriverProfileFormState> {
  const name = getFormValue(formData, "name");

  if (!name) {
    return {
      success: false,
      errorMessage: "Adınızı girin.",
    };
  }

  const phone = getFormValue(formData, "phone");
  const languages = getFormValue(formData, "languages");
  const vehicleId = getFormValue(formData, "vehicleId");
  const profilePhoto = getFormValue(formData, "profilePhoto");

  const result = await updateCurrentDriverProfile({
    name,
    phone,
    languages,
    vehicleId,
    profilePhoto,
  });

  if (!result.success) {
    return {
      success: false,
      errorMessage:
        result.errorMessage ??
        "Profil kaydedilemedi.",
    };
  }

  revalidatePath("/driver/profile");
  revalidatePath("/driver/profile/edit");
  revalidatePath("/driver");
  revalidatePath("/request/status/[publicId]", "page");

  redirect("/driver/profile");
}
