import { redirect } from "next/navigation";

export default async function LegacyRequestStatusPage({
  params,
  searchParams,
}: PageProps<"/request/status/[publicId]">) {
  const { publicId } = await params;
  const { token } = await searchParams;
  const query = typeof token === "string" ? `?token=${encodeURIComponent(token)}` : "";

  redirect(`/en/request/status/${publicId}${query}`);
}
