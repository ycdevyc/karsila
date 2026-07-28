import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { DriverRide } from "@/lib/driver/rides";

type OpenRideCardProps = {
  ride: DriverRide;
};

function formatDate(value: string | null) {
  if (!value) return "Tarih henüz bilinmiyor";

  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function OpenRideCard({ ride }: OpenRideCardProps) {
  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div>
            <p className="text-sm text-muted-foreground">Güzergâh</p>
            <h2 className="text-lg font-semibold">
              {ride.pickup_location} → {ride.dropoff_location}
            </h2>
          </div>

          <div className="grid gap-1 text-sm text-muted-foreground">
            <p>Tarih: {formatDate(ride.scheduled_at)}</p>
            <p>Yolcular: {ride.passengers ?? "Bilinmiyor"}</p>
            <p>Uçuş numarası: {ride.flight_number || "Belirtilmedi"}</p>
          </div>

          {ride.customer_note ? (
            <p className="text-sm text-muted-foreground">
              Not: {ride.customer_note}
            </p>
          ) : null}
        </div>

        <Button asChild>
          <Link href={`/driver/rides/${ride.id}`}>Talebi görüntüle</Link>
        </Button>
      </div>
    </Card>
  );
}
