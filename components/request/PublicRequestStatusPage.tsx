import { notFound } from "next/navigation";

import { ProposalCard } from "@/components/request/ProposalCard";
import { RouteCard } from "@/components/request/RouteCard";
import { StatusBadge } from "@/components/request/StatusBadge";
import { TimelineCard } from "@/components/request/TimelineCard";
import { SiteHeader } from "@/components/falcon/SiteHeader";
import {
  getRequestPortalData,
  type RequestPortalProposal,
} from "@/lib/request/portal";
import type { PublicRequestLocale } from "@/lib/i18n/public";

function translate(
  locale: PublicRequestLocale,
  english: string,
  russian: string,
) {
  return locale === "ru" ? russian : english;
}

function getPortalIntro(
  status: string,
  proposalCount: number,
  locale: PublicRequestLocale,
): string {
  if (status === "confirmed") {
    return translate(
      locale,
      "Your transfer is confirmed. Contact your driver directly to coordinate the final details.",
      "Ваш трансфер подтверждён. Свяжитесь с водителем напрямую, чтобы согласовать последние детали.",
    );
  }

  if (proposalCount > 0) {
    return translate(
      locale,
      "You have received offers. Compare driver prices and messages and choose the best option.",
      "Вы получили предложения. Сравните цены и сообщения водителей и выберите лучший вариант.",
    );
  }

  return translate(
    locale,
    "Your transfer request has been received. Drivers can now send an offer.",
    "Ваш запрос на трансфер получен. Теперь водители могут отправить предложение.",
  );
}

function formatPrice(
  value: number,
  locale: PublicRequestLocale,
): string {
  return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-GB", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function formatPhoneForWhatsApp(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}

function ConfirmedMatchCard({
  proposal,
  customerName,
  pickupLocation,
  dropoffLocation,
  locale,
}: {
  proposal: RequestPortalProposal;
  customerName: string;
  pickupLocation: string;
  dropoffLocation: string;
  locale: PublicRequestLocale;
}) {
  const whatsappPhone = proposal.driver_phone
    ? formatPhoneForWhatsApp(proposal.driver_phone)
    : null;

  const whatsappMessage = encodeURIComponent(
    translate(
      locale,
      `Hello ${proposal.driver_name}, I am ${customerName}. I accepted your Karsila offer for my transfer from ${pickupLocation} to ${dropoffLocation}.`,
      `Здравствуйте, ${proposal.driver_name}. Меня зовут ${customerName}. Я принял(а) ваше предложение Karsila на трансфер из ${pickupLocation} в ${dropoffLocation}.`,
    ),
  );

  const whatsappUrl = whatsappPhone
    ? `https://wa.me/${whatsappPhone}?text=${whatsappMessage}`
    : null;

  return (
    <section className="overflow-hidden rounded-2xl border border-emerald-200 bg-card shadow-sm">
      <div className="bg-emerald-50 px-6 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-700">
              {translate(locale, "Match confirmed", "Трансфер подтверждён")}
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              {translate(
                locale,
                "Your driver has been selected",
                "Ваш водитель выбран",
              )}
            </h2>
          </div>

          <span className="w-fit rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
            {translate(locale, "Confirmed", "Подтверждено")}
          </span>
        </div>

        <p className="mt-3 max-w-2xl text-sm text-emerald-900/80">
          {translate(
            locale,
            "Karsila has connected you. Coordinate the pickup time, meeting point and any changes directly with your driver.",
            "Karsila связал вас с водителем. Время встречи, место и возможные изменения согласуйте напрямую с водителем.",
          )}
        </p>
      </div>

      <div className="p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            {proposal.driver_profile_photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={proposal.driver_profile_photo}
                alt={proposal.driver_name}
                className="h-16 w-16 shrink-0 rounded-full border object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-muted text-xl font-bold">
                {proposal.driver_name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">
                {translate(locale, "Selected driver", "Выбранный водитель")}
              </p>

              <h3 className="truncate text-xl font-semibold">
                {proposal.driver_name}
              </h3>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {proposal.vehicle_name ? (
                  <span>{proposal.vehicle_name}</span>
                ) : null}

                {proposal.driver_rating !== null ? (
                  <span>
                    {translate(locale, "Rating", "Рейтинг")}:{" "}
                    {proposal.driver_rating.toFixed(1)} / 5
                  </span>
                ) : null}

                {proposal.driver_languages ? (
                  <span>
                    {translate(locale, "Languages", "Языки")}:{" "}
                    {proposal.driver_languages}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="shrink-0 md:text-right">
            <p className="text-sm text-muted-foreground">
              {translate(locale, "Accepted price", "Принятая цена")}
            </p>

            <p className="mt-1 text-3xl font-bold">
              {formatPrice(proposal.price_eur, locale)}
            </p>
          </div>
        </div>

        {proposal.message ? (
          <div className="mt-6 rounded-xl bg-muted p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {translate(
                locale,
                "Message from the driver",
                "Сообщение водителя",
              )}
            </p>

            <p className="mt-2 text-sm">{proposal.message}</p>
          </div>
        ) : null}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {proposal.driver_phone ? (
            <a
              href={`tel:${proposal.driver_phone}`}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              {translate(locale, "Call", "Позвонить")} {proposal.driver_name}
            </a>
          ) : (
            <div className="flex items-center justify-center rounded-lg border px-4 py-3 text-sm text-muted-foreground">
              {translate(
                locale,
                "Phone number unavailable",
                "Номер телефона недоступен",
              )}
            </div>
          )}

          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-emerald-600 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              {translate(locale, "Open WhatsApp", "Открыть WhatsApp")}
            </a>
          ) : (
            <div className="flex items-center justify-center rounded-lg border px-4 py-3 text-sm text-muted-foreground">
              {translate(
                locale,
                "WhatsApp unavailable",
                "WhatsApp недоступен",
              )}
            </div>
          )}
        </div>

        {proposal.driver_phone ? (
          <p className="mt-4 text-center text-sm text-muted-foreground sm:text-left">
            {translate(
              locale,
              "Driver phone number",
              "Телефон водителя",
            )}
            :{" "}
            <span className="font-medium text-foreground">
              {proposal.driver_phone}
            </span>
          </p>
        ) : null}
      </div>
    </section>
  );
}

export async function PublicRequestStatusPage({
  publicId,
  token,
  locale,
}: {
  publicId: string;
  token?: string;
  locale: PublicRequestLocale;
}) {
  if (!token) {
    notFound();
  }

  const portalData = await getRequestPortalData(publicId, token);

  if (!portalData) {
    notFound();
  }

  const { ride, proposals, acceptedProposal } = portalData;

  const hasAcceptedProposal = acceptedProposal !== null;

  const remainingProposals = acceptedProposal
    ? proposals.filter((proposal) => proposal.id !== acceptedProposal.id)
    : proposals;

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader locale={locale} />

      <div className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                {translate(
                  locale,
                  "Karsila transfer request",
                  "Запрос на трансфер Karsila",
                )}{" "}
                #{ride.public_id}
              </p>

              <h1 className="text-3xl font-bold tracking-tight">
                {translate(locale, "Hello", "Здравствуйте")},{" "}
                {ride.customer_name}
              </h1>

              <p className="text-muted-foreground">
                {getPortalIntro(ride.status, proposals.length, locale)}
              </p>
            </div>

            <StatusBadge status={ride.status} locale={locale} />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border bg-background p-4">
              <p className="text-sm text-muted-foreground">
                {translate(locale, "Offers", "Предложения")}
              </p>
              <p className="mt-1 text-2xl font-bold">{proposals.length}</p>
            </div>

            <div className="rounded-xl border bg-background p-4">
              <p className="text-sm text-muted-foreground">
                {translate(locale, "Status", "Статус")}
              </p>

              <p className="mt-1 text-lg font-semibold">
                {ride.status === "open"
                  ? translate(
                      locale,
                      "Waiting for drivers",
                      "Ожидание водителей",
                    )
                  : ride.status === "offered"
                    ? translate(
                        locale,
                        "Offers received",
                        "Предложения получены",
                      )
                    : ride.status === "confirmed"
                      ? translate(
                          locale,
                          "Match confirmed",
                          "Трансфер подтверждён",
                        )
                      : ride.status}
              </p>
            </div>

            <div className="rounded-xl border bg-background p-4">
              <p className="text-sm text-muted-foreground">
                {translate(locale, "Selected driver", "Выбранный водитель")}
              </p>

              <p className="mt-1 text-lg font-semibold">
                {acceptedProposal?.driver_name ??
                  translate(locale, "Not selected yet", "Пока не выбран")}
              </p>
            </div>
          </div>
        </section>

        {acceptedProposal ? (
          <ConfirmedMatchCard
            proposal={acceptedProposal}
            customerName={ride.customer_name}
            pickupLocation={ride.pickup_location}
            dropoffLocation={ride.dropoff_location}
            locale={locale}
          />
        ) : null}

        <RouteCard ride={ride} locale={locale} />

        <TimelineCard
          status={ride.status}
          proposalCount={proposals.length}
          locale={locale}
        />

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">
              {acceptedProposal
                ? translate(locale, "Other offers", "Другие предложения")
                : translate(
                    locale,
                    "Received offers",
                    "Полученные предложения",
                  )}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {acceptedProposal
                ? translate(
                    locale,
                    "You have already selected a driver. The other offers are no longer available.",
                    "Вы уже выбрали водителя. Остальные предложения больше недоступны.",
                  )
                : translate(
                    locale,
                    "Drivers send their price and message here. You can accept one offer.",
                    "Здесь водители отправляют цену и сообщение. Вы можете принять одно предложение.",
                  )}
            </p>
          </div>

          {proposals.length === 0 ? (
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold">
                {translate(locale, "No offers yet", "Предложений пока нет")}
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                {translate(
                  locale,
                  "Your request has been received. A driver's offer will appear here as soon as it arrives.",
                  "Ваш запрос получен. Когда водитель отправит предложение, оно появится здесь.",
                )}
              </p>
            </div>
          ) : acceptedProposal && remainingProposals.length === 0 ? (
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold">
                {translate(locale, "No other offers", "Других предложений нет")}
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                {translate(
                  locale,
                  "You accepted the only offer received.",
                  "Вы приняли единственное полученное предложение.",
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {(acceptedProposal ? remainingProposals : proposals).map(
                (proposal) => (
                  <ProposalCard
                    key={proposal.id}
                    proposal={proposal}
                    rideStatus={ride.status}
                    publicId={publicId}
                    accessToken={token}
                    hasAcceptedProposal={hasAcceptedProposal}
                    locale={locale}
                  />
                )
              )}
            </div>
          )}
        </section>

        <section className="rounded-2xl border bg-card p-6">
          <h2 className="text-xl font-semibold">
            {translate(locale, "Need help?", "Нужна помощь?")}
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {translate(
              locale,
              "Contact Karsila if you have a problem with your request or match. After confirmation, coordinate the practical details directly with your driver.",
              "Свяжитесь с Karsila, если возникли проблемы с запросом или подтверждением. После выбора согласуйте детали напрямую с водителем.",
            )}
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="rounded-lg border px-4 py-2 text-sm font-medium"
            >
              WhatsApp Karsila
            </button>

            <button
              type="button"
              className="rounded-lg border px-4 py-2 text-sm font-medium"
            >
              {translate(locale, "Change request", "Изменить запрос")}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
