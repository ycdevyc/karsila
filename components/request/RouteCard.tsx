import type { RequestPortalRide } from "@/lib/request/portal";
import type { PublicRequestLocale } from "@/lib/i18n/public";

type RouteCardProps = {
  ride: RequestPortalRide;
  locale: PublicRequestLocale;
};

function translate(
  locale: PublicRequestLocale,
  english: string,
  russian: string,
) {
  return locale === "ru" ? russian : english;
}

function formatDate(value: string | null, locale: PublicRequestLocale) {
  if (!value) {
    return translate(locale, "Not scheduled yet", "Дата ещё не назначена");
  }

  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function RouteCard({ ride, locale }: RouteCardProps) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {translate(locale, "Transfer details", "Детали трансфера")}
        </h2>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          {ride.passengers ?? "-"}{" "}
          {translate(locale, "passengers", "пассажиров")}
        </span>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {translate(locale, "Pickup location", "Место встречи")}
          </p>

          <p className="mt-2 text-lg font-medium">
            {ride.pickup_location}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {translate(locale, "Destination", "Пункт назначения")}
          </p>

          <p className="mt-2 text-lg font-medium">
            {ride.dropoff_location}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {translate(locale, "Departure", "Отправление")}
          </p>

          <p className="mt-2">
            {formatDate(ride.scheduled_at, locale)}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {translate(locale, "Flight number", "Номер рейса")}
          </p>

          <p className="mt-2">
            {ride.flight_number ||
              translate(locale, "Not provided", "Не указано")}
          </p>
        </div>
      </div>

      {ride.customer_note ? (
        <div className="mt-6 rounded-xl bg-muted p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {translate(locale, "Note", "Примечание")}
          </p>

          <p className="mt-2 whitespace-pre-wrap">
            {ride.customer_note}
          </p>
        </div>
      ) : null}
    </section>
  );
}
