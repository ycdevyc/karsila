import Link from "next/link";

import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { KarsilaLogo } from "@/components/brand/KarsilaLogo";
import { requireAdmin } from "@/lib/admin/auth";

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-[#eef2f4] dark:bg-background">
      <header className="border-b border-white/10 bg-[#071c31] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="flex items-center gap-3">
            <KarsilaLogo tone="light" subtitle="Administration" />
          </Link>

          <div className="flex items-center gap-4">
            <p className="hidden max-w-56 truncate text-xs font-semibold text-white/50 sm:block">
              {admin.email}
            </p>
            <AdminLogoutButton />
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
