import type { PublicRequestLocale } from "@/lib/i18n/public";

type TimelineCardProps = {
  status: string;
  proposalCount: number;
  locale: PublicRequestLocale;
};

type TimelineStep = {
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
};

function getTimelineSteps(
  status: string,
  proposalCount: number,
  locale: PublicRequestLocale,
): TimelineStep[] {
  const russian = locale === "ru";
  const hasProposals =
    proposalCount > 0 ||
    status === "offered" ||
    status === "confirmed";

  const isConfirmed = status === "confirmed";

  return [
    {
      title: russian ? "Запрос получен" : "Request received",
      description: russian
        ? "Ваш запрос на трансфер успешно получен."
        : "Your transfer request has been received successfully.",
      completed: true,
      active: status === "pending" || status === "new",
    },
    {
      title: russian ? "Доступно водителям" : "Available to drivers",
      description: russian
        ? "Доступные водители могут просмотреть ваш запрос."
        : "Available drivers can view your request.",
      completed:
        status === "open" ||
        hasProposals ||
        isConfirmed,
      active: status === "open" && !hasProposals,
    },
    {
      title: russian ? "Предложения получены" : "Offers received",
      description:
        proposalCount === 1
          ? russian
            ? "Вы получили одно предложение."
            : "You have received one offer."
          : proposalCount > 1
            ? russian
              ? `Вы получили ${proposalCount} предложений.`
              : `You have received ${proposalCount} offers.`
            : russian
              ? "Здесь появятся предложения водителей."
              : "Driver offers will appear here.",
      completed: hasProposals,
      active: hasProposals && !isConfirmed,
    },
    {
      title: russian ? "Трансфер подтверждён" : "Transfer confirmed",
      description: russian
        ? "Выбранный водитель назначен на ваш трансфер."
        : "The selected driver has been assigned to your transfer.",
      completed: isConfirmed,
      active: isConfirmed,
    },
  ];
}

export function TimelineCard({
  status,
  proposalCount,
  locale,
}: TimelineCardProps) {
  const steps = getTimelineSteps(status, proposalCount, locale);

  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          {locale === "ru" ? "Прогресс" : "Progress"}
        </p>

        <h2 className="mt-1 text-xl font-semibold">
          {locale === "ru" ? "Статус вашего запроса" : "Your request status"}
        </h2>
      </div>

      <ol className="mt-6">
        {steps.map((step, index) => {
          const isLastStep = index === steps.length - 1;

          return (
            <li
              key={step.title}
              className="relative flex gap-4"
            >
              {!isLastStep ? (
                <div
                  className={`absolute left-[15px] top-8 h-[calc(100%-8px)] w-px ${
                    step.completed
                      ? "bg-emerald-300"
                      : "bg-border"
                  }`}
                />
              ) : null}

              <div
                className={`relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${
                  step.completed
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : step.active
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-border bg-background text-muted-foreground"
                }`}
              >
                {step.completed ? "✓" : index + 1}
              </div>

              <div className={isLastStep ? "pb-0" : "pb-7"}>
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    className={`font-semibold ${
                      step.completed || step.active
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </h3>

                  {step.active ? (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {locale === "ru" ? "Текущий статус" : "Current status"}
                    </span>
                  ) : null}
                </div>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
