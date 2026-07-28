"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

import {
  createDriverProposal,
  type OfferStatus,
} from "@/lib/driver/offers";

import {
  getCurrentDriver,
  type CurrentDriver,
} from "@/lib/driver/profile";

import { supabase } from "@/lib/supabase";

type ProposalFormProps = {
  rideId: string;
};

type ExistingProposal = {
  id: string;
  price_eur: number;
  message: string | null;
  status: OfferStatus;
};

const MAX_MESSAGE_LENGTH = 500;

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function getProposalDurumLabel(status: OfferStatus): string {
  switch (status) {
    case "accepted":
      return "Kabul edildi";

    case "rejected":
      return "Seçilmedi";

    case "pending":
    default:
      return "Müşteri bekleniyor";
  }
}

function getProposalDurumDescription(status: OfferStatus): string {
  switch (status) {
    case "accepted":
      return "Müşteri teklifinizi kabul etti. Transfer size atandı.";

    case "rejected":
      return "Müşteri başka bir teklif seçti.";

    case "pending":
    default:
      return "Müşteri artık teklifinizi müşteri portalında görüntüleyip karşılaştırabilir.";
  }
}

function getProposalDurumClasses(status: OfferStatus): string {
  switch (status) {
    case "accepted":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200";

    case "rejected":
      return "border-slate-200 bg-slate-100 text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/50";

    case "pending":
    default:
      return "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200";
  }
}

function getProposalDurumIcon(status: OfferStatus) {
  if (status === "accepted") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m6.75 12.75 3 3 7.5-7.5"
        />
      </svg>
    );
  }

  if (status === "rejected") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m7.5 7.5 9 9m0-9-9 9"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6l3.75 2.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}

export function ProposalForm({
  rideId,
}: ProposalFormProps) {
  const [driver, setDriver] =
    useState<CurrentDriver | null>(null);

  const [existingProposal, setExistingProposal] =
    useState<ExistingProposal | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [price, setPrice] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const numericPrice = useMemo(() => {
    const value = Number(price);

    if (!Number.isFinite(value) || value <= 0) {
      return null;
    }

    return value;
  }, [price]);

  const messageCharactersRemaining =
    MAX_MESSAGE_LENGTH - message.length;

  useEffect(() => {
    let active = true;

    async function loadProposalData() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const currentDriver =
          await getCurrentDriver();

        if (!active) {
          return;
        }

        setDriver(currentDriver);

        if (!currentDriver) {
          setExistingProposal(null);
          return;
        }

        const { data, error } = await supabase
          .from("offers")
          .select(
            `
            id,
            price_eur,
            message,
            status
            `,
          )
          .eq("ride_id", rideId)
          .eq("driver_id", currentDriver.id)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!active) {
          return;
        }

        setExistingProposal(
          data as ExistingProposal | null,
        );
      } catch (error) {
        console.error(
          "Failed to load driver proposal:",
          error,
        );

        if (active) {
          setErrorMessage(
            "Teklif bilgileriniz yüklenemedi.",
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadProposalData();

    return () => {
      active = false;
    };
  }, [rideId]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage("");

    if (!driver) {
      setErrorMessage(
        "Bu hesap için sürücü profili bulunamadı.",
      );

      return;
    }

    if (!numericPrice) {
      setErrorMessage(
        "Geçerli bir toplam fiyat girin.",
      );

      return;
    }

    setIsSubmitting(true);

    const normalizedMessage =
      message.trim() || null;

    try {
      const result =
        await createDriverProposal({
          rideId,
          driverId: driver.id,
          priceEur: numericPrice,
          message: normalizedMessage,
        });

      if (!result.success) {
        setErrorMessage(
          result.errorMessage ??
            "Teklifiniz gönderilemedi.",
        );

        return;
      }

      setExistingProposal({
        id: "new-proposal",
        price_eur: numericPrice,
        message: normalizedMessage,
        status: "pending",
      });

      setPrice("");
      setMessage("");
    } catch (error) {
      console.error(
        "Failed to submit driver proposal:",
        error,
      );

      setErrorMessage(
        "Teklifiniz gönderilirken bir sorun oluştu.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="h-3 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-white/10" />
          <div className="h-7 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-white/10" />
          <div className="h-4 w-full animate-pulse rounded-full bg-slate-100 dark:bg-white/[0.06]" />
          <div className="h-4 w-4/5 animate-pulse rounded-full bg-slate-100 dark:bg-white/[0.06]" />
        </div>

        <div className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/[0.05]" />
        <div className="h-32 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/[0.05]" />
        <div className="h-12 animate-pulse rounded-xl bg-slate-200 dark:bg-white/10" />

        <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500 dark:text-white/40">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 animate-spin"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3a9 9 0 1 1-9 9"
            />
          </svg>

          Teklif bilgileri yükleniyor
        </div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-300/20 dark:bg-red-300/10">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-200 bg-white text-red-600 dark:border-red-300/20 dark:bg-red-300/10 dark:text-red-200">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.1a7.5 7.5 0 0 1 15 0"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.75 15.75 21 18m0-2.25L18.75 18"
              />
            </svg>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-red-700 dark:text-red-200/70">
              Hesap sorunu
            </p>

            <h3 className="mt-1 text-lg font-black text-red-950 dark:text-red-100">
              Sürücü profili bulunamadı
            </h3>

            <p className="mt-2 text-sm leading-6 text-red-700 dark:text-red-200/70">
              Bu hesap bir sürücü profiline bağlı değil. Yeniden giriş yapın
              veya Karsila yöneticisiyle iletişime geçin.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (existingProposal) {
    return (
      <div className="space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">
            Teklifiniz
          </p>

          <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            Teklif gönderildi
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-white/45">
            Teklifiniz kaydedildi ve müşteri tarafından görülebilir.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-800 bg-slate-950 p-5 text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl"
          />

          <div className="relative">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/40">
                  Sabit transfer fiyatı
                </p>

                <p className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
                  {formatCurrency(
                    Number(existingProposal.price_eur),
                  )}
                </p>

                <p className="mt-2 text-xs font-medium text-white/40">
                  Transferin tamamı için toplam fiyat
                </p>
              </div>

              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold ${getProposalDurumClasses(
                  existingProposal.status,
                )}`}
              >
                {getProposalDurumIcon(
                  existingProposal.status,
                )}

                {getProposalDurumLabel(
                  existingProposal.status,
                )}
              </span>
            </div>
          </div>
        </div>

        <div
          className={`rounded-2xl border p-4 ${getProposalDurumClasses(
            existingProposal.status,
          )}`}
        >
          <div className="flex gap-3">
            <div className="mt-0.5 shrink-0">
              {getProposalDurumIcon(
                existingProposal.status,
              )}
            </div>

            <div>
              <p className="text-sm font-bold">
                {getProposalDurumLabel(
                  existingProposal.status,
                )}
              </p>

              <p className="mt-1 text-xs leading-5 opacity-80">
                {getProposalDurumDescription(
                  existingProposal.status,
                )}
              </p>
            </div>
          </div>
        </div>

        {existingProposal.message ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
            <div className="flex items-center gap-2">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 text-slate-400"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 10.5h7.5m-7.5 3h4.5M6.75 4.5h10.5A2.25 2.25 0 0 1 19.5 6.75v9A2.25 2.25 0 0 1 17.25 18H12l-4.5 3v-3h-.75A2.25 2.25 0 0 1 4.5 15.75v-9A2.25 2.25 0 0 1 6.75 4.5Z"
                />
              </svg>

              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-white/40">
                Müşteriye mesaj
              </p>
            </div>

            <p className="mt-3 whitespace-pre-wrap text-sm font-medium leading-6 text-slate-700 dark:text-white/65">
              “{existingProposal.message}”
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center dark:border-white/10 dark:bg-white/[0.03]">
            <p className="text-sm font-medium text-slate-500 dark:text-white/40">
              Kişisel mesaj eklenmedi.
            </p>
          </div>
        )}

        <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="mt-0.5 h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-300"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8.25v4.5m0 3h.008v.008H12V15.75ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>

          <p className="text-xs leading-5 text-slate-500 dark:text-white/45">
            Her transfer talebi için yalnızca bir teklif gönderilebilir.
            Müşteri seçim yaptığında durum burada otomatik olarak güncellenir.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">
          Yeni teklif
        </p>

        <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
          Fiyatınızı belirleyin
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-white/45">
          Toplam sabit fiyatı girin ve isterseniz müşteriye kişisel bir
          mesaj ekleyin.
        </p>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-black uppercase text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/[0.06] dark:text-white/70">
          {driver.name?.slice(0, 1) || "F"}
        </div>

        <div className="min-w-0">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-white/35">
            Teklifi veren
          </p>

          <p className="mt-1 truncate text-sm font-bold text-slate-950 dark:text-white">
            {driver.name || "Karsila sürücüsü"}
          </p>
        </div>

        <span className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200">
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          Giriş yapıldı
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="proposal-price"
            className="text-sm font-bold text-slate-950 dark:text-white"
          >
            Toplam transfer fiyatı
          </label>

          <span className="text-xs font-medium text-slate-400 dark:text-white/35">
            Zorunlu
          </span>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex w-16 items-center justify-center border-r border-slate-200 text-2xl font-black text-slate-500 dark:border-white/10 dark:text-white/45">
            €
          </div>

          <input
            id="proposal-price"
            type="number"
            min="1"
            step="0.01"
            inputMode="decimal"
            value={price}
            onChange={(event) =>
              setPrice(event.target.value)
            }
            placeholder="55,00"
            required
            disabled={isSubmitting}
            className="h-20 w-full rounded-2xl border border-slate-200 bg-white pl-20 pr-4 text-3xl font-black tracking-tight text-slate-950 outline-none transition placeholder:text-slate-300 hover:border-slate-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/15 dark:hover:border-white/20"
          />
        </div>

        <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-white/[0.03]">
          <p className="text-xs leading-5 text-slate-500 dark:text-white/40">
            Transferin tamamı için sabit toplam fiyatı girin.
          </p>

          {numericPrice ? (
            <span className="shrink-0 text-sm font-black text-cyan-700 dark:text-cyan-300">
              {formatCurrency(numericPrice)}
            </span>
          ) : (
            <span className="shrink-0 text-xs font-semibold text-slate-400 dark:text-white/30">
              Henüz fiyat yok
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="proposal-message"
            className="text-sm font-bold text-slate-950 dark:text-white"
          >
            Kişisel mesaj
          </label>

          <span className="text-xs font-medium text-slate-400 dark:text-white/35">
            İsteğe bağlı
          </span>
        </div>

        <textarea
          id="proposal-message"
          value={message}
          onChange={(event) =>
            setMessage(
              event.target.value.slice(
                0,
                MAX_MESSAGE_LENGTH,
              ),
            )
          }
          placeholder="Örneğin: Çıkışta isim tabelasıyla beklerim ve bagaj konusunda yardımcı olurum."
          rows={6}
          disabled={isSubmitting}
          className="min-h-36 w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/25 dark:hover:border-white/20"
        />

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs leading-5 text-slate-500 dark:text-white/40">
            Hizmeti, karşılama şeklini veya özel ayrıntıları belirtin.
          </p>

          <span
            className={`shrink-0 text-xs font-semibold ${
              messageCharactersRemaining <= 50
                ? "text-amber-600 dark:text-amber-300"
                : "text-slate-400 dark:text-white/30"
            }`}
          >
            {messageCharactersRemaining} karakter
          </span>
        </div>
      </div>

      {numericPrice ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-white/40">
              Özet
            </p>
          </div>

          <div className="space-y-4 bg-white p-4 dark:bg-white/[0.02]">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-500 dark:text-white/45">
                Sabit transfer fiyatı
              </span>

              <span className="text-xl font-black text-slate-950 dark:text-white">
                {formatCurrency(numericPrice)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-500 dark:text-white/45">
                Sürücü
              </span>

              <span className="truncate text-sm font-bold text-slate-950 dark:text-white">
                {driver.name}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-500 dark:text-white/45">
                Mesaj
              </span>

              <span className="text-sm font-bold text-slate-950 dark:text-white">
                {message.trim()
                  ? "Eklendi"
                  : "Eklenmedi"}
              </span>
            </div>
          </div>
        </div>
      ) : null}

      {errorMessage ? (
        <div
          role="alert"
          className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-300/20 dark:bg-red-300/10 dark:text-red-100"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="mt-0.5 h-5 w-5 shrink-0"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4.5m0 3h.008v.008H12V16.5Zm8.25 2.25H3.75L12 3.75l8.25 14.5Z"
            />
          </svg>

          <div>
            <p className="text-sm font-bold">
              Teklif gönderilmedi
            </p>

            <p className="mt-1 text-xs leading-5 opacity-80">
              {errorMessage}
            </p>
          </div>
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting || !numericPrice}
        className="group h-14 w-full rounded-2xl bg-cyan-500 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none dark:disabled:bg-white/10 dark:disabled:text-white/25"
      >
        {isSubmitting ? (
          <>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="mr-2 h-5 w-5 animate-spin"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3a9 9 0 1 1-9 9"
              />
            </svg>

            Teklif gönder
          </>
        ) : (
          <>
            Teklif gönder

            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 12h13.5m-5.25-5.25L18.75 12l-5.25 5.25"
              />
            </svg>
          </>
        )}
      </Button>

      <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 dark:text-white/35"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M12 3.75 19.5 6v5.25c0 4.8-3.2 7.9-7.5 9-4.3-1.1-7.5-4.2-7.5-9V6L12 3.75Z"
          />
        </svg>

        <p className="text-xs leading-5 text-slate-500 dark:text-white/40">
          Fiyatınızı dikkatlice kontrol edin. Gönderdikten sonra bu talep için
          ikinci bir teklif veremezsiniz.
        </p>
      </div>
    </form>
  );
}
