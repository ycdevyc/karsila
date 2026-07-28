"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { RequestPortalProposal } from "@/lib/request/portal";
import type { PublicRequestLocale } from "@/lib/i18n/public";

type ProposalCardProps = {
  proposal: RequestPortalProposal;
  rideStatus: string;
  publicId: string;
  accessToken: string;
  hasAcceptedProposal: boolean;
  locale: PublicRequestLocale;
};

type AcceptProposalResponse = {
  success?: boolean;
  errorMessage?: string;
};

function translate(
  locale: PublicRequestLocale,
  english: string,
  russian: string,
) {
  return locale === "ru" ? russian : english;
}

function formatPrice(value: number, locale: PublicRequestLocale): string {
  return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-GB", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function formatDate(value: string, locale: PublicRequestLocale): string {
  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getProposalStatusLabel(
  status: string,
  locale: PublicRequestLocale,
): string {
  if (status === "accepted") {
    return translate(locale, "Accepted", "Принято");
  }

  if (status === "rejected") {
    return translate(locale, "Not selected", "Не выбрано");
  }

  return translate(locale, "Available", "Доступно");
}

function getProposalStatusClasses(status: string): string {
  if (status === "accepted") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "rejected") {
    return "border-slate-200 bg-slate-100 text-slate-600";
  }

  return "border-blue-200 bg-blue-50 text-blue-700";
}

export function ProposalCard({
  proposal,
  rideStatus,
  publicId,
  accessToken,
  hasAcceptedProposal,
  locale,
}: ProposalCardProps) {
  const router = useRouter();

  const [isAccepting, setIsAccepting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const proposalIsAccepted = proposal.status === "accepted";
  const proposalIsRejected = proposal.status === "rejected";

  const rideIsConfirmed = rideStatus === "confirmed";

  const acceptanceDisabled =
    isAccepting ||
    rideIsConfirmed ||
    hasAcceptedProposal ||
    proposalIsAccepted ||
    proposalIsRejected;

  async function handleAcceptProposal() {
    if (acceptanceDisabled) {
      return;
    }

    setIsAccepting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/request/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proposalId: proposal.id,
          publicId,
          accessToken,
        }),
      });

      const result = (await response.json()) as AcceptProposalResponse;

      if (!response.ok || !result.success) {
        throw new Error(
          translate(
            locale,
            "The offer could not be accepted. Please try again.",
            "Не удалось принять предложение. Попробуйте ещё раз.",
          ),
        );
      }

      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : translate(
              locale,
              "Something went wrong while accepting the offer.",
              "Произошла ошибка при принятии предложения.",
            ),
      );

      setIsAccepting(false);
    }
  }

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-card shadow-sm ${
        proposalIsAccepted ? "border-emerald-300" : ""
      }`}
    >
      <div className="p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-semibold">
                {proposal.driver_name}
              </h3>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${getProposalStatusClasses(
                  proposal.status
                )}`}
              >
                {getProposalStatusLabel(proposal.status, locale)}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {proposal.vehicle_name ? (
                <span>
                  {translate(locale, "Vehicle", "Автомобиль")}:{" "}
                  {proposal.vehicle_name}
                </span>
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

          <div className="shrink-0 md:text-right">
            <p className="text-sm text-muted-foreground">
              {translate(locale, "Offered price", "Предложенная цена")}
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

            <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
              {proposal.message}
            </p>
          </div>
        ) : (
          <div className="mt-6 rounded-xl bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              {translate(
                locale,
                "The driver did not add an additional message.",
                "Водитель не добавил дополнительное сообщение.",
              )}
            </p>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-sm text-muted-foreground">
            <p>{translate(locale, "Offer received", "Предложение получено")}</p>
            <p className="mt-1 font-medium text-foreground">
              {formatDate(proposal.created_at, locale)}
            </p>
          </div>

          {proposalIsAccepted ? (
            <div className="rounded-lg bg-emerald-600 px-5 py-3 text-center text-sm font-semibold text-white">
              {translate(
                locale,
                "This offer has been accepted",
                "Это предложение принято",
              )}
            </div>
          ) : proposalIsRejected || hasAcceptedProposal || rideIsConfirmed ? (
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-lg border px-5 py-3 text-sm font-semibold text-muted-foreground opacity-70"
            >
              {translate(
                locale,
                "No longer available",
                "Больше недоступно",
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAcceptProposal}
              disabled={acceptanceDisabled}
              className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAccepting
                ? translate(
                    locale,
                    "Accepting offer...",
                    "Принимаем предложение...",
                  )
                : translate(
                    locale,
                    "Choose this driver",
                    "Выбрать этого водителя",
                  )}
            </button>
          )}
        </div>

        {errorMessage ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}
      </div>
    </article>
  );
}
