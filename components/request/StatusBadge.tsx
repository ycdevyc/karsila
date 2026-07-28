import type { PublicRequestLocale } from "@/lib/i18n/public";

type StatusBadgeProps = {
  status: string;
  locale: PublicRequestLocale;
};

function getStatusConfig(status: string, locale: PublicRequestLocale) {
  const russian = locale === "ru";

  switch (status) {
    case "confirmed":
      return {
        label: russian ? "Подтверждено" : "Confirmed",
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-700",
      };

    case "offered":
      return {
        label: russian ? "Предложения получены" : "Offers received",
        className:
          "border-blue-200 bg-blue-50 text-blue-700",
      };

    case "open":
      return {
        label: russian ? "Открыто для водителей" : "Open to drivers",
        className:
          "border-amber-200 bg-amber-50 text-amber-700",
      };

    case "pending":
    case "new":
      return {
        label: russian ? "Запрос получен" : "Request received",
        className:
          "border-slate-200 bg-slate-100 text-slate-700",
      };

    default:
      return {
        label: status,
        className:
          "border-slate-200 bg-slate-100 text-slate-700",
      };
  }
}

export function StatusBadge({ status, locale }: StatusBadgeProps) {
  const config = getStatusConfig(status, locale);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}
