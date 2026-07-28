"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Copy,
  ExternalLink,
  Info,
  Luggage,
  Mail,
  MapPin,
  MessageSquareText,
  Plane,
  Route,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRound,
  Users,
} from "lucide-react";

import { SiteHeader } from "@/components/falcon/SiteHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PublicLocale } from "@/lib/i18n/public";

const TOTAL_STEPS = 4;

const holidayImage =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=88";

function createPublicId() {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `KA-${random}`;
}

function createAccessToken() {
  return crypto.randomUUID();
}

function translate(locale: PublicLocale, english: string, russian: string) {
  return locale === "ru" ? russian : english;
}

function formatScheduledDate(value: string, locale: PublicLocale) {
  if (!value) {
    return translate(locale, "Not provided", "Не указано");
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function PublicRequestPage({ locale }: { locale: PublicLocale }) {
  const stepInformation = [
    {
      number: 1,
      shortTitle: translate(locale, "Route", "Маршрут"),
      title: translate(
        locale,
        "Where would you like to go?",
        "Куда вы хотите поехать?",
      ),
      description: translate(
        locale,
        "Tell us where your Antalya journey begins and where your holiday continues.",
        "Укажите, где начинается ваша поездка по Анталье и куда вы направляетесь.",
      ),
      icon: Route,
    },
    {
      number: 2,
      shortTitle: translate(locale, "Journey", "Поездка"),
      title: translate(
        locale,
        "When are you travelling?",
        "Когда вы путешествуете?",
      ),
      description: translate(
        locale,
        "Add your pickup time, passengers and flight details so drivers can prepare.",
        "Укажите время встречи, количество пассажиров и данные рейса.",
      ),
      icon: CalendarDays,
    },
    {
      number: 3,
      shortTitle: translate(locale, "Contact", "Контакты"),
      title: translate(
        locale,
        "How can drivers reach you?",
        "Как водитель может связаться с вами?",
      ),
      description: translate(
        locale,
        "Your details are only used for this transfer request and confirmed journey.",
        "Ваши данные используются только для этого запроса и подтверждённой поездки.",
      ),
      icon: UserRound,
    },
    {
      number: 4,
      shortTitle: translate(locale, "Review", "Проверка"),
      title: translate(
        locale,
        "Review your transfer request",
        "Проверьте запрос на трансфер",
      ),
      description: translate(
        locale,
        "Check the details before sharing your journey with local VIP drivers.",
        "Проверьте данные перед отправкой запроса местным VIP-водителям.",
      ),
      icon: BadgeCheck,
    },
  ];
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [trackingUrl, setTrackingUrl] = useState<string | null>(null);
  const [debugMessage, setDebugMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const origin =
    typeof window === "undefined" ? "" : window.location.origin;

  const [form, setForm] = useState({
    pickup_location: "",
    dropoff_location: "",
    scheduled_at: "",
    flight_number: "",
    passengers: "2",
    customer_name: "",
    phone: "",
    email: "",
    customer_note: "",
  });

  function updateForm(field: keyof typeof form, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function nextStep() {
    setDebugMessage(null);
    setStep((current) => Math.min(current + 1, TOTAL_STEPS));
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function previousStep() {
    setDebugMessage(null);
    setStep((current) => Math.max(current - 1, 1));
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function goToStep(nextStepNumber: number) {
    if (nextStepNumber >= step) {
      return;
    }

    setStep(nextStepNumber);
    setDebugMessage(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit() {
    setLoading(true);
    setDebugMessage(null);

    const publicId = createPublicId();
    const accessToken = createAccessToken();

    const payload = {
      public_id: publicId,
      access_token: accessToken,
      customer_name: form.customer_name,
      phone: form.phone,
      email: form.email,
      pickup_location: form.pickup_location,
      dropoff_location: form.dropoff_location,
      flight_number: form.flight_number,
      passengers: Number(form.passengers),
      scheduled_at: form.scheduled_at,
      customer_note: form.customer_note,
      status: "open",
    };

    try {
      const response = await fetch("/api/rides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setDebugMessage(getRideSubmissionError(locale, result.code));
        setLoading(false);
        return;
      }

      setTrackingUrl(
        `/${locale}/request/status/${publicId}?token=${accessToken}`,
      );
    } catch (error) {
      setDebugMessage(
        error instanceof Error
          ? translate(
              locale,
              `Fetch error: ${error.message}`,
              `Ошибка соединения: ${error.message}`,
            )
          : translate(locale, "Unknown fetch error", "Неизвестная ошибка"),
      );
    }

    setLoading(false);
  }

  async function copyTrackingLink() {
    if (!trackingUrl) {
      return;
    }

    const fullTrackingUrl = `${origin}${trackingUrl}`;

    try {
      await navigator.clipboard.writeText(fullTrackingUrl);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2200);
    } catch {
      setDebugMessage(
        translate(
          locale,
          "The link could not be copied automatically. Please select and copy it manually.",
          "Не удалось скопировать ссылку автоматически. Выделите и скопируйте её вручную.",
        ),
      );
    }
  }

  const canGoNextFromStep1 =
    form.pickup_location.trim().length > 0 &&
    form.dropoff_location.trim().length > 0;

  const canGoNextFromStep2 =
    form.scheduled_at.trim().length > 0 &&
    Number(form.passengers) > 0;

  const canGoNextFromStep3 =
    form.customer_name.trim().length > 0 &&
    form.phone.trim().length > 0 &&
    form.email.trim().length > 0;

  const activeStep = stepInformation[step - 1];
  const ActiveStepIcon = activeStep.icon;
  const progressPercentage = (step / TOTAL_STEPS) * 100;
  const fullTrackingUrl = trackingUrl ? `${origin}${trackingUrl}` : "";

  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <SiteHeader locale={locale} />

      <section className="relative isolate overflow-hidden bg-[#071c31] text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("${holidayImage}")`,
          }}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,21,39,0.97)_0%,rgba(5,21,39,0.84)_48%,rgba(5,21,39,0.5)_100%)]"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,21,39,0.1)_0%,rgba(5,21,39,0.72)_100%)]"
        />

        <div
          aria-hidden="true"
          className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-300/15 blur-[120px]"
        />

        <div
          aria-hidden="true"
          className="absolute right-0 top-0 h-80 w-80 rounded-full bg-amber-300/12 blur-[130px]"
        />

        <div className="relative mx-auto max-w-7xl px-5 pb-28 pt-10 sm:px-6 lg:px-8 lg:pb-36 lg:pt-14">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-white/68 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {translate(locale, "Back to Karsila", "Назад в Karsila")}
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.17em] text-white/88 backdrop-blur-xl">
                <Sun className="h-4 w-4 text-amber-200" />
                {translate(
                  locale,
                  "Your holiday starts here",
                  "Ваш отдых начинается здесь",
                )}
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-[1.02] tracking-[-0.05em] sm:text-5xl lg:text-7xl">
                {translate(locale, "Request your private", "Закажите частный")}
                <span className="block text-amber-200">
                  {translate(
                    locale,
                    "Antalya transfer.",
                    "трансфер в Анталье.",
                  )}
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                {translate(
                  locale,
                  "Share your journey once and receive fixed offers from trusted local VIP drivers.",
                  "Опишите поездку и получите предложения с фиксированной ценой от проверенных местных VIP-водителей.",
                )}
              </p>
            </div>

            <div className="hidden rounded-[1.75rem] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl lg:block">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-300/15 text-emerald-200">
                  <ShieldCheck className="h-6 w-6" />
                </div>

                <div>
                  <p className="font-extrabold">
                    {translate(
                      locale,
                      "No immediate payment",
                      "Без немедленной оплаты",
                    )}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-white/62">
                    {translate(
                      locale,
                      "First compare the offers and choose your preferred driver.",
                      "Сначала сравните предложения и выберите подходящего водителя.",
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"
        />
      </section>

      <section className="relative z-10 -mt-16 px-4 pb-20 sm:px-6 lg:-mt-20 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-7xl">
          {trackingUrl ? (
            <RequestSuccess
              fullTrackingUrl={fullTrackingUrl}
              trackingUrl={trackingUrl}
              copied={copied}
              debugMessage={debugMessage}
              onCopy={copyTrackingLink}
              locale={locale}
            />
          ) : (
            <div className="grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)_310px] lg:items-start">
              <aside className="falcon-surface-elevated hidden p-5 lg:block">
                <div className="px-2 pb-5">
                  <p className="falcon-section-label">
                    {translate(locale, "Your journey", "Ваша поездка")}
                  </p>
                  <h2 className="mt-2 text-xl font-extrabold tracking-tight">
                    {translate(
                      locale,
                      "Four simple steps",
                      "Четыре простых шага",
                    )}
                  </h2>
                </div>

                <div className="space-y-2">
                  {stepInformation.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.number === step;
                    const isComplete = item.number < step;
                    const isClickable = item.number < step;

                    return (
                      <button
                        key={item.number}
                        type="button"
                        onClick={() => goToStep(item.number)}
                        disabled={!isClickable}
                        className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${
                          isActive
                            ? "bg-falcon-navy text-white shadow-lg"
                            : isComplete
                              ? "bg-falcon-mist/60 text-foreground hover:bg-falcon-mist"
                              : "text-muted-foreground"
                        }`}
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            isActive
                              ? "bg-white/12 text-amber-200"
                              : isComplete
                                ? "bg-white text-falcon-ocean shadow-sm dark:bg-white/10"
                                : "bg-muted"
                          }`}
                        >
                          {isComplete ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Icon className="h-4 w-4" />
                          )}
                        </span>

                        <span className="min-w-0">
                          <span className="block text-[10px] font-bold uppercase tracking-[0.14em] opacity-65">
                            {translate(locale, "Step", "Шаг")} {item.number}
                          </span>
                          <span className="mt-0.5 block text-sm font-bold">
                            {item.shortTitle}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-2xl bg-falcon-soft-gradient p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-falcon-ocean" />
                    <p className="text-xs leading-6 text-muted-foreground">
                      {translate(
                        locale,
                        "Drivers will only see the information needed to prepare an accurate offer.",
                        "Водители увидят только данные, необходимые для точного предложения.",
                      )}
                    </p>
                  </div>
                </div>
              </aside>

              <section className="falcon-surface-elevated overflow-hidden">
                <div className="border-b border-border/65 px-5 py-5 sm:px-7">
                  <div className="flex items-center justify-between gap-5">
                    <div className="flex items-center gap-3">
                      <div className="falcon-icon-tile-light">
                        <ActiveStepIcon className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                          {translate(locale, "Step", "Шаг")} {step}{" "}
                          {translate(locale, "of", "из")} {TOTAL_STEPS}
                        </p>
                        <p className="mt-1 text-sm font-bold">
                          {activeStep.shortTitle}
                        </p>
                      </div>
                    </div>

                    <span className="text-sm font-extrabold text-falcon-ocean">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>

                  <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,var(--falcon-turquoise),var(--falcon-ocean),var(--falcon-gold))] transition-all duration-500"
                      style={{
                        width: `${progressPercentage}%`,
                      }}
                    />
                  </div>
                </div>

                <div
                  key={step}
                  className="animate-[falconRequestReveal_.4s_ease-out_both] p-5 sm:p-7 lg:p-9"
                >
                  <div>
                    <h2 className="text-2xl font-extrabold tracking-[-0.035em] sm:text-3xl">
                      {activeStep.title}
                    </h2>

                    <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                      {activeStep.description}
                    </p>
                  </div>

                  {debugMessage ? (
                    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300">
                      <Info className="mt-0.5 h-4 w-4 shrink-0" />
                      <p className="leading-6">{debugMessage}</p>
                    </div>
                  ) : null}

                  {step === 1 ? (
                    <div className="mt-8 space-y-6">
                      <div className="falcon-route-card">
                        <div className="falcon-route-line">
                          <LocationField
                            id="pickup_location"
                            label={translate(
                              locale,
                              "Pickup location",
                              "Место встречи",
                            )}
                            helper={translate(
                              locale,
                              "Airport, hotel or another address",
                              "Аэропорт, отель или другой адрес",
                            )}
                            placeholder={translate(
                              locale,
                              "Antalya Airport",
                              "Аэропорт Антальи",
                            )}
                            value={form.pickup_location}
                            onChange={(value) =>
                              updateForm("pickup_location", value)
                            }
                          />

                          <LocationField
                            id="dropoff_location"
                            label={translate(locale, "Destination", "Куда")}
                            helper={translate(
                              locale,
                              "Hotel, resort or private address",
                              "Отель, курорт или частный адрес",
                            )}
                            placeholder="Rixos Premium Belek"
                            value={form.dropoff_location}
                            onChange={(value) =>
                              updateForm("dropoff_location", value)
                            }
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <PrimaryButton
                          onClick={nextStep}
                          disabled={!canGoNextFromStep1}
                        >
                          {translate(
                            locale,
                            "Continue to journey details",
                            "Перейти к деталям поездки",
                          )}
                          <ArrowRight className="h-4 w-4" />
                        </PrimaryButton>
                      </div>
                    </div>
                  ) : null}

                  {step === 2 ? (
                    <div className="mt-8 space-y-6">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <FormField
                          id="scheduled_at"
                          label={translate(
                            locale,
                            "Pickup date and time",
                            "Дата и время встречи",
                          )}
                          icon={CalendarDays}
                        >
                          <Input
                            id="scheduled_at"
                            type="datetime-local"
                            value={form.scheduled_at}
                            onChange={(event) =>
                              updateForm(
                                "scheduled_at",
                                event.target.value,
                              )
                            }
                            className="h-12 rounded-xl bg-background/70"
                            required
                          />
                        </FormField>

                        <FormField
                          id="passengers"
                          label={translate(
                            locale,
                            "Passengers",
                            "Пассажиры",
                          )}
                          icon={Users}
                        >
                          <Input
                            id="passengers"
                            type="number"
                            min="1"
                            value={form.passengers}
                            onChange={(event) =>
                              updateForm("passengers", event.target.value)
                            }
                            className="h-12 rounded-xl bg-background/70"
                            required
                          />
                        </FormField>
                      </div>

                      <FormField
                        id="flight_number"
                        label={translate(
                          locale,
                          "Flight number",
                          "Номер рейса",
                        )}
                        helper={translate(
                          locale,
                          "Optional, but recommended for airport pickups",
                          "Необязательно, но рекомендуется для встречи в аэропорту",
                        )}
                        icon={Plane}
                      >
                        <Input
                          id="flight_number"
                          value={form.flight_number}
                          onChange={(event) =>
                            updateForm("flight_number", event.target.value)
                          }
                          placeholder={translate(
                            locale,
                            "For example TK2417",
                            "Например, TK2417",
                          )}
                          className="h-12 rounded-xl bg-background/70"
                        />
                      </FormField>

                      <div className="rounded-2xl border border-cyan-200/70 bg-cyan-50/70 p-4 dark:border-cyan-400/15 dark:bg-cyan-400/8">
                        <div className="flex items-start gap-3">
                          <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-falcon-ocean" />
                          <p className="text-xs leading-6 text-muted-foreground">
                            {translate(
                              locale,
                              "Adding your flight number helps the driver follow delays and plan the airport meeting time.",
                              "Номер рейса поможет водителю отследить задержку и спланировать встречу в аэропорту.",
                            )}
                          </p>
                        </div>
                      </div>

                      <FormNavigation
                        onBack={previousStep}
                        onNext={nextStep}
                        nextDisabled={!canGoNextFromStep2}
                        nextLabel={translate(
                          locale,
                          "Continue to contact details",
                          "Перейти к контактам",
                        )}
                        locale={locale}
                      />
                    </div>
                  ) : null}

                  {step === 3 ? (
                    <div className="mt-8 space-y-6">
                      <FormField
                        id="customer_name"
                        label={translate(locale, "Full name", "Полное имя")}
                        icon={UserRound}
                      >
                        <Input
                          id="customer_name"
                          value={form.customer_name}
                          onChange={(event) =>
                            updateForm("customer_name", event.target.value)
                          }
                          placeholder={translate(locale, "Your name", "Ваше имя")}
                          className="h-12 rounded-xl bg-background/70"
                          autoComplete="name"
                          required
                        />
                      </FormField>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <FormField
                          id="phone"
                          label={translate(
                            locale,
                            "Phone or WhatsApp",
                            "Телефон или WhatsApp",
                          )}
                          icon={MessageSquareText}
                        >
                          <Input
                            id="phone"
                            type="tel"
                            value={form.phone}
                            onChange={(event) =>
                              updateForm("phone", event.target.value)
                            }
                            placeholder="+31 6 12345678"
                            className="h-12 rounded-xl bg-background/70"
                            autoComplete="tel"
                            required
                          />
                        </FormField>

                        <FormField
                          id="email"
                          label={translate(
                            locale,
                            "Email address",
                            "Электронная почта",
                          )}
                          icon={Mail}
                        >
                          <Input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(event) =>
                              updateForm("email", event.target.value)
                            }
                            placeholder="you@example.com"
                            className="h-12 rounded-xl bg-background/70"
                            autoComplete="email"
                            required
                          />
                        </FormField>
                      </div>

                      <FormField
                        id="customer_note"
                        label={translate(
                          locale,
                          "Anything the driver should know?",
                          "Что ещё нужно знать водителю?",
                        )}
                        helper={translate(locale, "Optional", "Необязательно")}
                        icon={Luggage}
                      >
                        <textarea
                          id="customer_note"
                          value={form.customer_note}
                          onChange={(event) =>
                            updateForm(
                              "customer_note",
                              event.target.value,
                            )
                          }
                          placeholder={translate(
                            locale,
                            "Child seat, extra luggage, hotel entrance or another request...",
                            "Детское кресло, дополнительный багаж, вход в отель или другое пожелание...",
                          )}
                          rows={4}
                          className="flex min-h-28 w-full resize-none rounded-xl border border-input bg-background/70 px-3 py-3 text-sm shadow-xs outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />
                      </FormField>

                      <div className="flex items-start gap-3 rounded-2xl bg-muted/60 p-4">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-falcon-ocean" />
                        <p className="text-xs leading-6 text-muted-foreground">
                          {translate(
                            locale,
                            "Your contact information is not publicly displayed. It is only used for this request and confirmed transfer.",
                            "Ваши контактные данные не публикуются. Они используются только для этого запроса и подтверждённого трансфера.",
                          )}
                        </p>
                      </div>

                      <FormNavigation
                        onBack={previousStep}
                        onNext={nextStep}
                        nextDisabled={!canGoNextFromStep3}
                        nextLabel={translate(
                          locale,
                          "Review my request",
                          "Проверить запрос",
                        )}
                        locale={locale}
                      />
                    </div>
                  ) : null}

                  {step === 4 ? (
                    <div className="mt-8 space-y-6">
                      <div className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-background/60">
                        <div className="border-b border-border/65 bg-falcon-soft-gradient p-5 sm:p-6">
                          <div className="flex items-start gap-4">
                            <div className="falcon-icon-tile-light">
                              <Route className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                                {translate(locale, "Your route", "Ваш маршрут")}
                              </p>

                              <p className="mt-2 text-lg font-extrabold tracking-tight">
                                {form.pickup_location}
                              </p>

                              <div className="my-2 flex items-center gap-2 text-xs font-bold text-falcon-ocean">
                                <ArrowRight className="h-3.5 w-3.5" />
                                {translate(
                                  locale,
                                  "Private transfer",
                                  "Частный трансфер",
                                )}
                              </div>

                              <p className="text-lg font-extrabold tracking-tight">
                                {form.dropoff_location}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-px bg-border/60 sm:grid-cols-2">
                          <ReviewItem
                            icon={CalendarDays}
                            label={translate(locale, "Pickup", "Встреча")}
                            value={formatScheduledDate(
                              form.scheduled_at,
                              locale,
                            )}
                          />

                          <ReviewItem
                            icon={Users}
                            label={translate(
                              locale,
                              "Passengers",
                              "Пассажиры",
                            )}
                            value={`${form.passengers} ${
                              Number(form.passengers) === 1
                                ? translate(
                                    locale,
                                    "passenger",
                                    "пассажир",
                                  )
                                : translate(
                                    locale,
                                    "passengers",
                                    "пассажиров",
                                  )
                            }`}
                          />

                          <ReviewItem
                            icon={Plane}
                            label={translate(
                              locale,
                              "Flight number",
                              "Номер рейса",
                            )}
                            value={
                              form.flight_number ||
                              translate(locale, "Not provided", "Не указано")
                            }
                          />

                          <ReviewItem
                            icon={UserRound}
                            label={translate(
                              locale,
                              "Passenger",
                              "Пассажир",
                            )}
                            value={form.customer_name}
                          />

                          <ReviewItem
                            icon={MessageSquareText}
                            label={translate(
                              locale,
                              "Phone or WhatsApp",
                              "Телефон или WhatsApp",
                            )}
                            value={form.phone}
                          />

                          <ReviewItem
                            icon={Mail}
                            label={translate(
                              locale,
                              "Email",
                              "Электронная почта",
                            )}
                            value={form.email}
                          />
                        </div>

                        {form.customer_note ? (
                          <div className="border-t border-border/65 bg-card p-5 sm:p-6">
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                              {translate(
                                locale,
                                "Extra request",
                                "Дополнительное пожелание",
                              )}
                            </p>
                            <p className="mt-2 text-sm leading-7">
                              {form.customer_note}
                            </p>
                          </div>
                        ) : null}
                      </div>

                      <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50 p-4 dark:border-emerald-400/15 dark:bg-emerald-400/8">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-300" />

                          <div>
                            <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
                              {translate(
                                locale,
                                "Sending this request is free",
                                "Отправка запроса бесплатна",
                              )}
                            </p>
                            <p className="mt-1 text-xs leading-6 text-emerald-700/80 dark:text-emerald-200/70">
                              {translate(
                                locale,
                                "You are not booking a driver yet. You can first compare the offers you receive.",
                                "Вы пока не бронируете водителя. Сначала можно сравнить полученные предложения.",
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                        <SecondaryButton onClick={previousStep}>
                          <ChevronLeft className="h-4 w-4" />
                          {translate(
                            locale,
                            "Edit details",
                            "Изменить данные",
                          )}
                        </SecondaryButton>

                        <PrimaryButton
                          onClick={handleSubmit}
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                              {translate(
                                locale,
                                "Sharing with drivers...",
                                "Отправляем водителям...",
                              )}
                            </>
                          ) : (
                            <>
                              {translate(
                                locale,
                                "Send transfer request",
                                "Отправить запрос",
                              )}
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </PrimaryButton>
                      </div>
                    </div>
                  ) : null}
                </div>
              </section>

              <aside className="space-y-5">
                <JourneyPreview form={form} step={step} locale={locale} />

                <div className="falcon-surface hidden p-5 lg:block">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-falcon-ocean" />
                    <p className="text-sm font-extrabold">
                      {translate(
                        locale,
                        "Why travellers use Karsila",
                        "Почему выбирают Karsila",
                      )}
                    </p>
                  </div>

                  <div className="mt-5 space-y-4">
                    <TrustPoint
                      text={translate(
                        locale,
                        "Compare several fixed offers",
                        "Сравните несколько предложений с фиксированной ценой",
                      )}
                    />
                    <TrustPoint
                      text={translate(
                        locale,
                        "Choose your preferred driver",
                        "Выберите подходящего водителя",
                      )}
                    />
                    <TrustPoint
                      text={translate(
                        locale,
                        "No customer account required",
                        "Регистрация не требуется",
                      )}
                    />
                    <TrustPoint
                      text={translate(
                        locale,
                        "Keep control of your booking",
                        "Сохраняйте контроль над бронированием",
                      )}
                    />
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>

      <style>{`
        @keyframes falconRequestReveal {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}

function getRideSubmissionError(
  locale: PublicLocale,
  code: unknown,
) {
  switch (code) {
    case "INVALID_EMAIL":
      return translate(
        locale,
        "Enter a valid email address.",
        "Введите действительный адрес электронной почты.",
      );
    case "INVALID_PASSENGERS":
      return translate(
        locale,
        "Enter a valid number of passengers.",
        "Укажите допустимое количество пассажиров.",
      );
    case "INVALID_SCHEDULED_AT":
      return translate(
        locale,
        "Enter a valid pickup date and time.",
        "Укажите действительные дату и время встречи.",
      );
    case "REQUEST_TOO_LARGE":
      return translate(
        locale,
        "The request contains too much information.",
        "Запрос содержит слишком много данных.",
      );
    case "RATE_LIMITED":
      return translate(
        locale,
        "You have sent too many requests. Please try again later.",
        "Вы отправили слишком много запросов. Повторите попытку позже.",
      );
    default:
      return translate(
        locale,
        "The transfer request could not be created. Please check your details and try again.",
        "Не удалось создать заявку на трансфер. Проверьте данные и повторите попытку.",
      );
  }
}

type LocationFieldProps = {
  id: string;
  label: string;
  helper: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

function LocationField({
  id,
  label,
  helper,
  placeholder,
  value,
  onChange,
}: LocationFieldProps) {
  return (
    <div className="falcon-route-point">
      <div className="grid gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label htmlFor={id} className="font-bold">
            {label}
          </Label>

          <span className="text-xs text-muted-foreground">{helper}</span>
        </div>

        <div className="relative">
          <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-falcon-ocean" />

          <Input
            id={id}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="h-13 rounded-xl bg-background/75 pl-11 text-sm font-semibold"
            required
          />
        </div>
      </div>
    </div>
  );
}

type FormFieldProps = {
  id: string;
  label: string;
  helper?: string;
  icon: typeof CalendarDays;
  children: React.ReactNode;
};

function FormField({
  id,
  label,
  helper,
  icon: Icon,
  children,
}: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label
          htmlFor={id}
          className="inline-flex items-center gap-2 font-bold"
        >
          <Icon className="h-4 w-4 text-falcon-ocean" />
          {label}
        </Label>

        {helper ? (
          <span className="text-xs text-muted-foreground">{helper}</span>
        ) : null}
      </div>

      {children}
    </div>
  );
}

type FormNavigationProps = {
  onBack: () => void;
  onNext: () => void;
  nextDisabled: boolean;
  nextLabel: string;
  locale: PublicLocale;
};

function FormNavigation({
  onBack,
  onNext,
  nextDisabled,
  nextLabel,
  locale,
}: FormNavigationProps) {
  return (
    <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-between">
      <SecondaryButton onClick={onBack}>
        <ChevronLeft className="h-4 w-4" />
        {translate(locale, "Back", "Назад")}
      </SecondaryButton>

      <PrimaryButton onClick={onNext} disabled={nextDisabled}>
        {nextLabel}
        <ArrowRight className="h-4 w-4" />
      </PrimaryButton>
    </div>
  );
}

type ActionButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
};

function PrimaryButton({
  children,
  onClick,
  disabled = false,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="falcon-button-primary w-full disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
  disabled = false,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="falcon-button-secondary w-full disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
    >
      {children}
    </button>
  );
}

type ReviewItemProps = {
  icon: typeof CalendarDays;
  label: string;
  value: string;
};

function ReviewItem({
  icon: Icon,
  label,
  value,
}: ReviewItemProps) {
  return (
    <div className="bg-card p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-falcon-ocean" />

        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.13em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 break-words text-sm font-bold leading-6">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

type JourneyPreviewProps = {
  form: {
    pickup_location: string;
    dropoff_location: string;
    scheduled_at: string;
    flight_number: string;
    passengers: string;
    customer_name: string;
    phone: string;
    email: string;
    customer_note: string;
  };
  step: number;
  locale: PublicLocale;
};

function JourneyPreview({
  form,
  step,
  locale,
}: JourneyPreviewProps) {
  const hasRoute =
    form.pickup_location.trim().length > 0 ||
    form.dropoff_location.trim().length > 0;

  return (
    <div className="falcon-surface-elevated overflow-hidden">
      <div className="relative h-36 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("${holidayImage}")`,
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#071c31]/90 via-[#071c31]/25 to-transparent" />

        <div className="absolute bottom-4 left-4 right-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
            <Plane className="h-3.5 w-3.5 text-amber-200" />
            {translate(locale, "Transfer preview", "Предпросмотр трансфера")}
          </div>
        </div>
      </div>

      <div className="p-5">
        {hasRoute ? (
          <div className="falcon-route-line gap-4">
            <div className="falcon-route-point">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                {translate(locale, "Pickup", "Встреча")}
              </p>
              <p className="mt-1 break-words text-sm font-extrabold">
                {form.pickup_location ||
                  translate(
                    locale,
                    "Add pickup location",
                    "Добавьте место встречи",
                  )}
              </p>
            </div>

            <div className="falcon-route-point">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                {translate(locale, "Destination", "Куда")}
              </p>
              <p className="mt-1 break-words text-sm font-extrabold">
                {form.dropoff_location ||
                  translate(
                    locale,
                    "Add destination",
                    "Добавьте пункт назначения",
                  )}
              </p>
            </div>
          </div>
        ) : (
          <div className="py-2 text-center">
            <MapPin className="mx-auto h-6 w-6 text-falcon-ocean" />
            <p className="mt-3 text-sm font-extrabold">
              {translate(
                locale,
                "Your route will appear here",
                "Здесь появится ваш маршрут",
              )}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {translate(
                locale,
                "Start by entering your pickup and destination.",
                "Сначала укажите место встречи и пункт назначения.",
              )}
            </p>
          </div>
        )}

        {step >= 2 && form.scheduled_at ? (
          <>
            <div className="my-5 falcon-divider" />

            <div className="space-y-3">
              <PreviewRow
                icon={CalendarDays}
                text={formatScheduledDate(form.scheduled_at, locale)}
              />

              <PreviewRow
                icon={Users}
                text={`${form.passengers} ${translate(
                  locale,
                  "passengers",
                  "пассажиров",
                )}`}
              />

              {form.flight_number ? (
                <PreviewRow
                  icon={Plane}
                  text={form.flight_number}
                />
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

type PreviewRowProps = {
  icon: typeof CalendarDays;
  text: string;
};

function PreviewRow({
  icon: Icon,
  text,
}: PreviewRowProps) {
  return (
    <div className="flex items-start gap-3 text-xs">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-falcon-ocean" />
      <span className="font-semibold leading-5 text-muted-foreground">
        {text}
      </span>
    </div>
  );
}

function TrustPoint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300">
        <Check className="h-3.5 w-3.5" />
      </span>
      <p className="text-xs font-semibold text-muted-foreground">
        {text}
      </p>
    </div>
  );
}

type RequestSuccessProps = {
  fullTrackingUrl: string;
  trackingUrl: string;
  copied: boolean;
  debugMessage: string | null;
  onCopy: () => void;
  locale: PublicLocale;
};

function RequestSuccess({
  fullTrackingUrl,
  trackingUrl,
  copied,
  debugMessage,
  onCopy,
  locale,
}: RequestSuccessProps) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="falcon-surface-elevated overflow-hidden">
        <div className="relative overflow-hidden bg-[#0b2944] px-6 py-12 text-center text-white sm:px-10 sm:py-16">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(235,198,119,0.22),transparent_27%),radial-gradient(circle_at_10%_100%,rgba(51,177,188,0.22),transparent_34%)]"
          />

          <div className="relative">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-200/25 bg-emerald-300/15 text-emerald-200 shadow-2xl">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
              {translate(
                locale,
                "Request successfully sent",
                "Запрос успешно отправлен",
              )}
            </p>

            <h1 className="mx-auto mt-4 max-w-2xl text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">
              {translate(
                locale,
                "Your transfer request is live.",
                "Ваш запрос на трансфер опубликован.",
              )}
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/68 sm:text-base">
              {translate(
                locale,
                "Local drivers can now review your journey and send their fixed offers.",
                "Теперь местные водители могут просмотреть поездку и отправить предложения с фиксированной ценой.",
              )}
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-8 lg:p-10">
          <div className="rounded-[1.75rem] border border-border/70 bg-background/65 p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="falcon-icon-tile-light">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-extrabold tracking-tight">
                  {translate(
                    locale,
                    "Save your private tracking link",
                    "Сохраните личную ссылку для отслеживания",
                  )}
                </h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {translate(
                    locale,
                    "You do not need an account. This private link gives you access to your request and incoming driver offers.",
                    "Аккаунт не требуется. По этой личной ссылке вы сможете открыть запрос и предложения водителей.",
                  )}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-border/70 bg-card p-4">
              <p className="break-all font-mono text-xs leading-6 text-muted-foreground">
                {fullTrackingUrl || trackingUrl}
              </p>
            </div>

            {debugMessage ? (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                {debugMessage}
              </div>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onCopy}
                className="falcon-button-secondary flex-1"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600" />
                    {translate(locale, "Link copied", "Ссылка скопирована")}
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    {translate(
                      locale,
                      "Copy private link",
                      "Скопировать личную ссылку",
                    )}
                  </>
                )}
              </button>

              <Link
                href={trackingUrl}
                className="falcon-button-primary flex-1"
              >
                {translate(locale, "Open my request", "Открыть мой запрос")}
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <SuccessStep
              number="1"
              title={translate(
                locale,
                "Drivers respond",
                "Водители отвечают",
              )}
              description={translate(
                locale,
                "Local drivers review your trip.",
                "Местные водители изучают вашу поездку.",
              )}
            />

            <SuccessStep
              number="2"
              title={translate(
                locale,
                "Compare offers",
                "Сравните предложения",
              )}
              description={translate(
                locale,
                "See each price, vehicle and message.",
                "Смотрите цену, автомобиль и сообщение водителя.",
              )}
            />

            <SuccessStep
              number="3"
              title={translate(
                locale,
                "Choose your driver",
                "Выберите водителя",
              )}
              description={translate(
                locale,
                "Confirm only when you are ready.",
                "Подтвердите выбор, когда будете готовы.",
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type SuccessStepProps = {
  number: string;
  title: string;
  description: string;
};

function SuccessStep({
  number,
  title,
  description,
}: SuccessStepProps) {
  return (
    <div className="rounded-2xl border border-border/65 bg-card/70 p-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-falcon-mist text-xs font-extrabold text-falcon-navy">
        {number}
      </span>

      <p className="mt-4 text-sm font-extrabold">{title}</p>
      <p className="mt-2 text-xs leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
