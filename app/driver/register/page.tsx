"use client";

import {
  ChangeEvent,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CarFront,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  CircleX,
  Eye,
  EyeOff,
  FileCheck2,
  FileText,
  Languages,
  LoaderCircle,
  LockKeyhole,
  Luggage,
  Mail,
  MapPin,
  Phone,
  Plane,
  ShieldCheck,
  Upload,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

import { KarsilaLogo } from "@/components/brand/KarsilaLogo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const totalSteps = 5;
const uniquenessDebounceMs = 500;

const vehicleBrands = [
  "Mercedes-Benz",
  "Volkswagen",
  "Ford",
  "Renault",
  "Fiat",
  "Toyota",
  "Diğer",
];

const countries = [
  "Türkiye",
  "Hollanda",
  "Almanya",
  "Belçika",
  "Birleşik Krallık",
  "Fransa",
  "Diğer",
];

type PersonalForm = {
  fullName: string;
  phone: string;
  email: string;
  languages: string;
  password: string;
  confirmPassword: string;
};

type CompanyForm = {
  companyName: string;
  vatNumber: string;
  country: string;
  city: string;
  airportRegion: string;
};

type VehicleForm = {
  brand: string;
  model: string;
  productionYear: string;
  licensePlate: string;
  color: string;
  passengerCapacity: string;
  luggageCapacity: string;
};

type DocumentType =
  | "driver_license"
  | "commercial_driver_license"
  | "vehicle_registration"
  | "vehicle_insurance";

type DocumentFiles = Record<DocumentType, File | null>;

type WizardForm = {
  personal: PersonalForm;
  company: CompanyForm;
  vehicle: VehicleForm;
};

type UniquenessField =
  | "email"
  | "phone"
  | "licensePlate";

type UniquenessStatus =
  | "idle"
  | "checking"
  | "available"
  | "taken"
  | "error";

type UniquenessState = {
  status: UniquenessStatus;
  message: string | null;
};

type RegistrationResponse = {
  success?: boolean;
  code?: string;
  field?: string;
  message?: string;
  requestId?: string;
};

const initialForm: WizardForm = {
  personal: {
    fullName: "",
    phone: "",
    email: "",
    languages: "",
    password: "",
    confirmPassword: "",
  },
  company: {
    companyName: "",
    vatNumber: "",
    country: "Türkiye",
    city: "",
    airportRegion: "Antalya Havalimanı",
  },
  vehicle: {
    brand: "Mercedes-Benz",
    model: "",
    productionYear: "",
    licensePlate: "",
    color: "",
    passengerCapacity: "",
    luggageCapacity: "",
  },
};

const initialDocuments: DocumentFiles = {
  driver_license: null,
  commercial_driver_license: null,
  vehicle_registration: null,
  vehicle_insurance: null,
};

const documentDefinitions: Array<{
  type: DocumentType;
  title: string;
  description: string;
}> = [
  {
    type: "driver_license",
    title: "Sürücü belgesi",
    description:
      "Ön ve arka yüzü tek bir PDF veya görsel olarak yükleyin.",
  },
  {
    type: "commercial_driver_license",
    title: "Ticari sürücü belgesi",
    description:
      "Yolcu taşıma veya şoförlük belgeniz.",
  },
  {
    type: "vehicle_registration",
    title: "Araç ruhsatı",
    description:
      "Bu araca ait resmi tescil belgesi.",
  },
  {
    type: "vehicle_insurance",
    title: "Araç sigortası",
    description:
      "Geçerli ticari araç sigortası belgesi.",
  },
];

const stepDefinitions = [
  {
    number: 1,
    label: "Kişisel",
    title: "Kişisel bilgiler",
  },
  {
    number: 2,
    label: "Şirket",
    title: "Şirket bilgileri",
  },
  {
    number: 3,
    label: "Araç",
    title: "Araç bilgileri",
  },
  {
    number: 4,
    label: "Belgeler",
    title: "Doğrulama belgeleri",
  },
  {
    number: 5,
    label: "Kontrol",
    title: "Başvuruyu kontrol edin",
  },
];

export default function DriverRegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [form, setForm] =
    useState<WizardForm>(initialForm);

  const [documents, setDocuments] =
    useState<DocumentFiles>(initialDocuments);

  const [acceptedTerms, setAcceptedTerms] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [
    registrationComplete,
    setRegistrationComplete,
  ] = useState(false);

  const [
    uniquenessRevision,
    setUniquenessRevision,
  ] = useState(0);

  const emailUniqueness = useUniquenessCheck(
    "email",
    form.personal.email,
    isValidEmail(form.personal.email),
    uniquenessRevision,
  );

  const phoneUniqueness = useUniquenessCheck(
    "phone",
    form.personal.phone,
    isValidPhone(form.personal.phone),
    uniquenessRevision,
  );

  const plateUniqueness = useUniquenessCheck(
    "licensePlate",
    form.vehicle.licensePlate,
    isValidLicensePlate(
      form.vehicle.licensePlate,
    ),
    uniquenessRevision,
  );

  const progress =
    (step / totalSteps) * 100;

  const currentStepDefinition =
    stepDefinitions.find(
      (item) => item.number === step,
    ) ?? stepDefinitions[0];

  const uploadedDocumentCount = useMemo(
    () =>
      Object.values(documents).filter(Boolean)
        .length,
    [documents],
  );

  function updatePersonal(
    field: keyof PersonalForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      personal: {
        ...current.personal,
        [field]: value,
      },
    }));

    clearError();
  }

  function updateCompany(
    field: keyof CompanyForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      company: {
        ...current.company,
        [field]: value,
      },
    }));

    clearError();
  }

  function updateVehicle(
    field: keyof VehicleForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      vehicle: {
        ...current.vehicle,
        [field]: value,
      },
    }));

    clearError();
  }

  function clearError() {
    if (errorMessage) {
      setErrorMessage(null);
    }
  }

  function validateStep(
    targetStep: number,
  ) {
    if (targetStep === 1) {
      const { personal } = form;

      if (!personal.fullName.trim()) {
        return "Adınızı ve soyadınızı girin.";
      }

      if (!isValidPhone(personal.phone)) {
        return "Geçerli bir uluslararası telefon numarası girin; örneğin +90 532 123 45 67.";
      }

      if (
        phoneUniqueness.status ===
        "checking"
      ) {
        return "Karsila telefon numaranızı hâlâ kontrol ediyor.";
      }

      if (
        phoneUniqueness.status === "taken"
      ) {
        return "Bu telefon numarası zaten kayıtlı.";
      }

      if (
        phoneUniqueness.status !==
        "available"
      ) {
        return "Karsila bu telefon numarasının kullanılabilir olduğunu doğrulayamadı.";
      }

      if (!isValidEmail(personal.email)) {
        return "Geçerli bir e-posta adresi girin.";
      }

      if (
        emailUniqueness.status ===
        "checking"
      ) {
        return "Karsila e-posta adresinizi hâlâ kontrol ediyor.";
      }

      if (
        emailUniqueness.status === "taken"
      ) {
        return "Bu e-posta adresiyle kayıtlı bir hesap zaten var.";
      }

      if (
        emailUniqueness.status !==
        "available"
      ) {
        return "Karsila bu e-posta adresinin kullanılabilir olduğunu doğrulayamadı.";
      }

      if (!personal.languages.trim()) {
        return "En az bir dil girin.";
      }

      if (
        personal.password.length < 8
      ) {
        return "Şifreniz en az 8 karakter içermelidir.";
      }

      if (
        personal.password !==
        personal.confirmPassword
      ) {
        return "Şifreler eşleşmiyor.";
      }
    }

    if (targetStep === 2) {
      const { company } = form;

      if (!company.country.trim()) {
        return "Ülkenizi seçin.";
      }

      if (!company.city.trim()) {
        return "Faaliyet gösterdiğiniz şehri girin.";
      }

      if (
        !company.airportRegion.trim()
      ) {
        return "Ana havalimanı bölgenizi girin.";
      }
    }

    if (targetStep === 3) {
      const { vehicle } = form;

      if (!vehicle.brand.trim()) {
        return "Bir araç markası seçin.";
      }

      if (!vehicle.model.trim()) {
        return "Araç modelini girin.";
      }

      const year = Number(
        vehicle.productionYear,
      );

      const currentYear =
        new Date().getFullYear();

      if (
        !Number.isInteger(year) ||
        year < 1990 ||
        year > currentYear + 1
      ) {
        return "Geçerli bir araç üretim yılı girin.";
      }

      if (
        !isValidLicensePlate(
          vehicle.licensePlate,
        )
      ) {
        return "Geçerli bir araç plakası girin.";
      }

      if (
        plateUniqueness.status ===
        "checking"
      ) {
        return "Karsila araç plakasını hâlâ kontrol ediyor.";
      }

      if (
        plateUniqueness.status === "taken"
      ) {
        return "Bu araç plakası zaten kayıtlı.";
      }

      if (
        plateUniqueness.status !==
        "available"
      ) {
        return "Karsila bu araç plakasının kullanılabilir olduğunu doğrulayamadı.";
      }

      const passengerCapacity = Number(
        vehicle.passengerCapacity,
      );

      if (
        !Number.isInteger(
          passengerCapacity,
        ) ||
        passengerCapacity < 1 ||
        passengerCapacity > 100
      ) {
        return "Geçerli bir yolcu kapasitesi girin.";
      }

      const luggageCapacity = Number(
        vehicle.luggageCapacity,
      );

      if (
        !Number.isInteger(
          luggageCapacity,
        ) ||
        luggageCapacity < 0 ||
        luggageCapacity > 100
      ) {
        return "Geçerli bir bagaj kapasitesi girin.";
      }
    }

    if (targetStep === 4) {
      if (
        uploadedDocumentCount <
        documentDefinitions.length
      ) {
        return "Gerekli tüm doğrulama belgelerini yükleyin.";
      }
    }

    if (
      targetStep === 5 &&
      !acceptedTerms
    ) {
      return "Sürücü koşullarını ve gizlilik politikasını kabul edin.";
    }

    return null;
  }

  function goToNextStep() {
    const validationError =
      validateStep(step);

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage(null);

    setStep((current) =>
      Math.min(
        current + 1,
        totalSteps,
      ),
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function goToPreviousStep() {
    setErrorMessage(null);

    setStep((current) =>
      Math.max(current - 1, 1),
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function goToStep(
    targetStep: number,
  ) {
    if (targetStep >= step) {
      return;
    }

    setErrorMessage(null);
    setStep(targetStep);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleDocumentChange(
    type: DocumentType,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(file.type)
    ) {
      setErrorMessage(
        "Belgeler PDF, JPG, PNG veya WebP formatında olmalıdır.",
      );

      event.target.value = "";
      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      setErrorMessage(
        "Each document must be smaller than 10 MB.",
      );

      event.target.value = "";
      return;
    }

    if (file.size <= 0) {
      setErrorMessage(
        "Seçilen belge boş.",
      );

      event.target.value = "";
      return;
    }

    setDocuments((current) => ({
      ...current,
      [type]: file,
    }));

    setErrorMessage(null);
  }

  function removeDocument(
    type: DocumentType,
  ) {
    setDocuments((current) => ({
      ...current,
      [type]: null,
    }));

    setErrorMessage(null);
  }

  async function submitApplication() {
    const step1Error =
      validateStep(1);

    if (step1Error) {
      setStep(1);
      setErrorMessage(step1Error);
      return;
    }

    const step2Error =
      validateStep(2);

    if (step2Error) {
      setStep(2);
      setErrorMessage(step2Error);
      return;
    }

    const step3Error =
      validateStep(3);

    if (step3Error) {
      setStep(3);
      setErrorMessage(step3Error);
      return;
    }

    const step4Error =
      validateStep(4);

    if (step4Error) {
      setStep(4);
      setErrorMessage(step4Error);
      return;
    }

    const step5Error =
      validateStep(5);

    if (step5Error) {
      setErrorMessage(step5Error);
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const formData =
        new FormData();

      const normalizedLanguages =
        form.personal.languages
          .split(",")
          .map((language) =>
            language.trim(),
          )
          .filter(Boolean)
          .join(", ");

      formData.append(
        "fullName",
        form.personal.fullName.trim(),
      );

      formData.append(
        "email",
        form.personal.email
          .trim()
          .toLowerCase(),
      );

      formData.append(
        "phone",
        form.personal.phone.trim(),
      );

      formData.append(
        "languages",
        normalizedLanguages,
      );

      formData.append(
        "password",
        form.personal.password,
      );

      formData.append(
        "companyName",
        form.company.companyName.trim(),
      );

      formData.append(
        "vatNumber",
        form.company.vatNumber.trim(),
      );

      formData.append(
        "country",
        form.company.country.trim(),
      );

      formData.append(
        "city",
        form.company.city.trim(),
      );

      formData.append(
        "airportRegion",
        form.company.airportRegion.trim(),
      );

      formData.append(
        "vehicleBrand",
        form.vehicle.brand.trim(),
      );

      formData.append(
        "vehicleModel",
        form.vehicle.model.trim(),
      );

      formData.append(
        "vehicleYear",
        form.vehicle.productionYear,
      );

      formData.append(
        "licensePlate",
        form.vehicle.licensePlate.trim(),
      );

      formData.append(
        "vehicleColor",
        form.vehicle.color.trim(),
      );

      formData.append(
        "capacity",
        form.vehicle.passengerCapacity,
      );

      formData.append(
        "luggageCapacity",
        form.vehicle.luggageCapacity,
      );

      for (
        const definition
        of documentDefinitions
      ) {
        const file =
          documents[definition.type];

        if (!file) {
          throw new Error(
            `Missing required document: ${definition.title}.`,
          );
        }

        formData.append(
          definition.type,
          file,
        );
      }

      const response = await fetch(
        "/api/driver/register",
        {
          method: "POST",
          body: formData,
        },
      );

      let result:
        | RegistrationResponse
        | null = null;

      try {
        result =
          (await response.json()) as RegistrationResponse;
      } catch {
        result = null;
      }

      if (
        !response.ok ||
        !result?.success
      ) {
        const targetStep =
          getRegistrationStepForField(
            result?.field,
          );

        if (targetStep) {
          setStep(targetStep);
        }

        if (
          result?.code?.endsWith(
            "_ALREADY_EXISTS",
          )
        ) {
          setUniquenessRevision(
            (current) => current + 1,
          );
        }

        throw new Error(
          result?.message ??
            "Başvuru gönderilemedi. Hiçbir kayıt oluşturulmadı.",
        );
      }

      setRegistrationComplete(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(
        "Driver application submission failed:",
        error,
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Sürücü başvurusu gönderilemedi. Hiçbir kayıt oluşturulmadı.",
      );
    } finally {
      setLoading(false);
    }
  }

  const continueDisabled =
    loading ||
    (step === 1 &&
      (emailUniqueness.status ===
        "checking" ||
        phoneUniqueness.status ===
          "checking")) ||
    (step === 3 &&
      plateUniqueness.status ===
        "checking");

  if (registrationComplete) {
    return (
      <RegistrationSuccess
        onContinue={() => {
          router.push("/driver/login");
        }}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f5f6] dark:bg-background">
      <div className="grid min-h-screen lg:grid-cols-[minmax(360px,0.78fr)_minmax(640px,1.22fr)]">
        <RegistrationHero
          currentStep={step}
        />

        <section className="flex min-h-screen flex-col">
          <MobileHeader />

          <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-5 py-8 sm:px-8 lg:px-12 lg:py-10 xl:px-16">
            <div className="flex items-center justify-between gap-4">
              <Link
                href="/driver/login"
                className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Sürücü girişi
              </Link>

              <span className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                Adım {step} / {totalSteps}
              </span>
            </div>

            <div className="mt-8">
              <WizardProgress
                currentStep={step}
                progress={progress}
                onStepClick={goToStep}
              />
            </div>

            <div className="mt-10">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1b8295]">
                Sürücü başvurusu
              </p>

              <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl">
                {
                  currentStepDefinition.title
                }
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                {getStepDescription(step)}
              </p>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
              }}
              className="mt-9 flex flex-1 flex-col"
            >
              <div className="flex-1">
                {step === 1 ? (
                  <PersonalStep
                    value={form.personal}
                    emailUniqueness={
                      emailUniqueness
                    }
                    phoneUniqueness={
                      phoneUniqueness
                    }
                    showPassword={
                      showPassword
                    }
                    showConfirmPassword={
                      showConfirmPassword
                    }
                    disabled={loading}
                    onChange={
                      updatePersonal
                    }
                    onTogglePassword={() =>
                      setShowPassword(
                        (current) =>
                          !current,
                      )
                    }
                    onToggleConfirmPassword={() =>
                      setShowConfirmPassword(
                        (current) =>
                          !current,
                      )
                    }
                  />
                ) : null}

                {step === 2 ? (
                  <CompanyStep
                    value={form.company}
                    disabled={loading}
                    onChange={
                      updateCompany
                    }
                  />
                ) : null}

                {step === 3 ? (
                  <VehicleStep
                    value={form.vehicle}
                    plateUniqueness={
                      plateUniqueness
                    }
                    disabled={loading}
                    onChange={
                      updateVehicle
                    }
                  />
                ) : null}

                {step === 4 ? (
                  <DocumentsStep
                    documents={documents}
                    disabled={loading}
                    onChange={
                      handleDocumentChange
                    }
                    onRemove={
                      removeDocument
                    }
                  />
                ) : null}

                {step === 5 ? (
                  <ReviewStep
                    form={form}
                    documents={documents}
                    acceptedTerms={
                      acceptedTerms
                    }
                    disabled={loading}
                    onAcceptedTermsChange={
                      setAcceptedTerms
                    }
                    onEdit={setStep}
                  />
                ) : null}

                {errorMessage ? (
                  <div
                    role="alert"
                    className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300"
                  >
                    <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />

                    <span>
                      {errorMessage}
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="mt-10 flex flex-col-reverse gap-3 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={
                    goToPreviousStep
                  }
                  disabled={
                    step === 1 ||
                    loading
                  }
                  className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 text-sm font-bold transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Geri
                </button>

                {step < totalSteps ? (
                  <button
                    type="button"
                    onClick={
                      goToNextStep
                    }
                    disabled={
                      continueDisabled
                    }
                    className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0b2944] px-7 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#123a5d] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {continueDisabled &&
                    !loading ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Kontrol ediliyor...
                      </>
                    ) : (
                      <>
                        Devam et
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      void submitApplication();
                    }}
                    disabled={loading}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0b2944] px-7 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#123a5d] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {loading ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Başvuru gönderiliyor...
                      </>
                    ) : (
                      <>
                        Başvuruyu gönder
                        <BadgeCheck className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function PersonalStep({
  value,
  disabled,
  emailUniqueness,
  phoneUniqueness,
  showPassword,
  showConfirmPassword,
  onChange,
  onTogglePassword,
  onToggleConfirmPassword,
}: {
  value: PersonalForm;
  disabled: boolean;
  emailUniqueness: UniquenessState;
  phoneUniqueness: UniquenessState;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onChange: (
    field: keyof PersonalForm,
    value: string,
  ) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <FormField
        id="fullName"
        label="Ad soyad"
        icon={
          <UserRound className="h-4 w-4" />
        }
        className="sm:col-span-2"
      >
        <Input
          id="fullName"
          value={value.fullName}
          onChange={(event) =>
            onChange(
              "fullName",
              event.target.value,
            )
          }
          placeholder="Resmi adınız ve soyadınız"
          autoComplete="name"
          disabled={disabled}
          className="h-12 rounded-xl bg-background"
        />
      </FormField>

      <FormField
        id="phone"
        label="Telefon numarası"
        icon={
          <Phone className="h-4 w-4" />
        }
      >
        <Input
          id="phone"
          type="tel"
          value={value.phone}
          onChange={(event) =>
            onChange(
              "phone",
              event.target.value,
            )
          }
          placeholder="+90 532 123 45 67"
          autoComplete="tel"
          disabled={disabled}
          className={getUniqueInputClassName(
            phoneUniqueness.status,
          )}
        />

        <UniquenessMessage
          state={phoneUniqueness}
          idleMessage={
            value.phone &&
            !isValidPhone(value.phone)
              ? "Use international format, for example +90 532 123 45 67."
              : null
          }
        />
      </FormField>

      <FormField
        id="languages"
        label="Diller"
        icon={
          <Languages className="h-4 w-4" />
        }
      >
        <Input
          id="languages"
          value={value.languages}
          onChange={(event) =>
            onChange(
              "languages",
              event.target.value,
            )
          }
          placeholder="Türkçe, İngilizce, Almanca"
          disabled={disabled}
          className="h-12 rounded-xl bg-background"
        />
      </FormField>

      <FormField
        id="email"
        label="E-posta adresi"
        icon={
          <Mail className="h-4 w-4" />
        }
        className="sm:col-span-2"
      >
        <Input
          id="email"
          type="email"
          value={value.email}
          onChange={(event) =>
            onChange(
              "email",
              event.target.value,
            )
          }
          placeholder="driver@example.com"
          autoComplete="email"
          disabled={disabled}
          className={getUniqueInputClassName(
            emailUniqueness.status,
          )}
        />

        <UniquenessMessage
          state={emailUniqueness}
          idleMessage={
            value.email &&
            !isValidEmail(value.email)
              ? "Geçerli bir e-posta adresi girin."
              : null
          }
        />
      </FormField>

      <FormField
        id="password"
        label="Şifre"
        icon={
          <LockKeyhole className="h-4 w-4" />
        }
      >
        <PasswordInput
          id="password"
          value={value.password}
          visible={showPassword}
          disabled={disabled}
          placeholder="En az 8 karakter"
          onChange={(newValue) =>
            onChange(
              "password",
              newValue,
            )
          }
          onToggle={onTogglePassword}
        />
      </FormField>

      <FormField
        id="confirmPassword"
        label="Şifreyi doğrula"
        icon={
          <LockKeyhole className="h-4 w-4" />
        }
      >
        <PasswordInput
          id="confirmPassword"
          value={
            value.confirmPassword
          }
          visible={
            showConfirmPassword
          }
          disabled={disabled}
          placeholder="Şifrenizi tekrar girin"
          onChange={(newValue) =>
            onChange(
              "confirmPassword",
              newValue,
            )
          }
          onToggle={
            onToggleConfirmPassword
          }
        />
      </FormField>
    </div>
  );
}

function CompanyStep({
  value,
  disabled,
  onChange,
}: {
  value: CompanyForm;
  disabled: boolean;
  onChange: (
    field: keyof CompanyForm,
    value: string,
  ) => void;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <FormField
        id="companyName"
        label="Şirket adı"
        icon={
          <Building2 className="h-4 w-4" />
        }
        optional
        className="sm:col-span-2"
      >
        <Input
          id="companyName"
          value={value.companyName}
          onChange={(event) =>
            onChange(
              "companyName",
              event.target.value,
            )
          }
          placeholder="Kayıtlı şirket veya ticari unvan"
          autoComplete="organization"
          disabled={disabled}
          className="h-12 rounded-xl bg-background"
        />
      </FormField>

      <FormField
        id="vatNumber"
        label="Vergi numarası"
        icon={
          <BriefcaseBusiness className="h-4 w-4" />
        }
        optional
        className="sm:col-span-2"
      >
        <Input
          id="vatNumber"
          value={value.vatNumber}
          onChange={(event) =>
            onChange(
              "vatNumber",
              event.target.value,
            )
          }
          placeholder="İsteğe bağlı şirket vergi numarası"
          disabled={disabled}
          className="h-12 rounded-xl bg-background"
        />
      </FormField>

      <FormField
        id="country"
        label="Ülke"
        icon={
          <MapPin className="h-4 w-4" />
        }
      >
        <SelectField
          id="country"
          value={value.country}
          disabled={disabled}
          onChange={(newValue) =>
            onChange(
              "country",
              newValue,
            )
          }
        >
          {countries.map(
            (country) => (
              <option
                key={country}
                value={country}
              >
                {country}
              </option>
            ),
          )}
        </SelectField>
      </FormField>

      <FormField
        id="city"
        label="Faaliyet gösterilen şehir"
        icon={
          <MapPin className="h-4 w-4" />
        }
      >
        <Input
          id="city"
          value={value.city}
          onChange={(event) =>
            onChange(
              "city",
              event.target.value,
            )
          }
          placeholder="Antalya"
          autoComplete="address-level2"
          disabled={disabled}
          className="h-12 rounded-xl bg-background"
        />
      </FormField>

      <FormField
        id="airportRegion"
        label="Ana havalimanı bölgesi"
        icon={
          <Plane className="h-4 w-4" />
        }
        className="sm:col-span-2"
      >
        <Input
          id="airportRegion"
          value={value.airportRegion}
          onChange={(event) =>
            onChange(
              "airportRegion",
              event.target.value,
            )
          }
          placeholder="Antalya Havalimanı"
          disabled={disabled}
          className="h-12 rounded-xl bg-background"
        />
      </FormField>
    </div>
  );
}

function VehicleStep({
  value,
  disabled,
  plateUniqueness,
  onChange,
}: {
  value: VehicleForm;
  disabled: boolean;
  plateUniqueness: UniquenessState;
  onChange: (
    field: keyof VehicleForm,
    value: string,
  ) => void;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <FormField
        id="brand"
        label="Araç markası"
        icon={
          <CarFront className="h-4 w-4" />
        }
      >
        <SelectField
          id="brand"
          value={value.brand}
          disabled={disabled}
          onChange={(newValue) =>
            onChange(
              "brand",
              newValue,
            )
          }
        >
          {vehicleBrands.map(
            (brand) => (
              <option
                key={brand}
                value={brand}
              >
                {brand}
              </option>
            ),
          )}
        </SelectField>
      </FormField>

      <FormField
        id="model"
        label="Araç modeli"
        icon={
          <CarFront className="h-4 w-4" />
        }
      >
        <Input
          id="model"
          value={value.model}
          onChange={(event) =>
            onChange(
              "model",
              event.target.value,
            )
          }
          placeholder="V-Class"
          disabled={disabled}
          className="h-12 rounded-xl bg-background"
        />
      </FormField>

      <FormField
        id="productionYear"
        label="Üretim yılı"
        icon={
          <CarFront className="h-4 w-4" />
        }
      >
        <Input
          id="productionYear"
          type="number"
          min="1990"
          max={
            new Date().getFullYear() +
            1
          }
          value={value.productionYear}
          onChange={(event) =>
            onChange(
              "productionYear",
              event.target.value,
            )
          }
          placeholder="2024"
          disabled={disabled}
          className="h-12 rounded-xl bg-background"
        />
      </FormField>

      <FormField
        id="licensePlate"
        label="Araç plakası"
        icon={
          <CarFront className="h-4 w-4" />
        }
      >
        <Input
          id="licensePlate"
          value={value.licensePlate}
          onChange={(event) =>
            onChange(
              "licensePlate",
              event.target.value,
            )
          }
          placeholder="07 ABC 123"
          disabled={disabled}
          className={`${getUniqueInputClassName(
            plateUniqueness.status,
          )} uppercase`}
        />

        <UniquenessMessage
          state={plateUniqueness}
          idleMessage={
            value.licensePlate &&
            !isValidLicensePlate(
              value.licensePlate,
            )
              ? "Geçerli bir araç plakası girin."
              : null
          }
        />
      </FormField>

      <FormField
        id="color"
        label="Araç rengi"
        icon={
          <CarFront className="h-4 w-4" />
        }
        optional
      >
        <Input
          id="color"
          value={value.color}
          onChange={(event) =>
            onChange(
              "color",
              event.target.value,
            )
          }
          placeholder="Siyah"
          disabled={disabled}
          className="h-12 rounded-xl bg-background"
        />
      </FormField>

      <div className="hidden sm:block" />

      <FormField
        id="passengerCapacity"
        label="Yolcu kapasitesi"
        icon={
          <UsersRound className="h-4 w-4" />
        }
      >
        <Input
          id="passengerCapacity"
          type="number"
          min="1"
          max="100"
          value={
            value.passengerCapacity
          }
          onChange={(event) =>
            onChange(
              "passengerCapacity",
              event.target.value,
            )
          }
          placeholder="7"
          disabled={disabled}
          className="h-12 rounded-xl bg-background"
        />
      </FormField>

      <FormField
        id="luggageCapacity"
        label="Bagaj kapasitesi"
        icon={
          <Luggage className="h-4 w-4" />
        }
      >
        <Input
          id="luggageCapacity"
          type="number"
          min="0"
          max="100"
          value={
            value.luggageCapacity
          }
          onChange={(event) =>
            onChange(
              "luggageCapacity",
              event.target.value,
            )
          }
          placeholder="7"
          disabled={disabled}
          className="h-12 rounded-xl bg-background"
        />
      </FormField>
    </div>
  );
}

function DocumentsStep({
  documents,
  disabled,
  onChange,
  onRemove,
}: {
  documents: DocumentFiles;
  disabled: boolean;
  onChange: (
    type: DocumentType,
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  onRemove: (
    type: DocumentType,
  ) => void;
}) {
  return (
    <div>
      <div className="rounded-2xl border border-[#1b8295]/20 bg-[#1b8295]/5 p-5">
        <div className="flex items-start gap-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#1b8295]" />

          <div>
            <h2 className="text-sm font-extrabold">
              Güvenli belge işleme
            </h2>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Başvuruyu tamamlarken
              belgeler bu cihazda kalır.
              Karsila, belgeleri yalnızca
              gerekli tüm bilgiler
              doğrulandıktan ve başvurunun
              tamamı gönderildikten sonra
              yükler.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {documentDefinitions.map(
          (definition) => {
            const file =
              documents[
                definition.type
              ];

            return (
              <DocumentUpload
                key={definition.type}
                definition={
                  definition
                }
                file={file}
                disabled={disabled}
                onChange={(event) =>
                  onChange(
                    definition.type,
                    event,
                  )
                }
                onRemove={() =>
                  onRemove(
                    definition.type,
                  )
                }
              />
            );
          },
        )}
      </div>

      <p className="mt-5 text-xs leading-6 text-muted-foreground">
        Kabul edilen formatlar: PDF, JPG,
        PNG ve WebP. Her belge için
        maksimum dosya boyutu 10 MB&apos;dır.
      </p>
    </div>
  );
}

function ReviewStep({
  form,
  documents,
  acceptedTerms,
  disabled,
  onAcceptedTermsChange,
  onEdit,
}: {
  form: WizardForm;
  documents: DocumentFiles;
  acceptedTerms: boolean;
  disabled: boolean;
  onAcceptedTermsChange: (
    accepted: boolean,
  ) => void;
  onEdit: (step: number) => void;
}) {
  return (
    <div className="grid gap-5">
      <ReviewCard
        title="Kişisel bilgiler"
        icon={
          <UserRound className="h-5 w-5" />
        }
        onEdit={() => onEdit(1)}
      >
        <ReviewGrid
          items={[
            [
              "Ad soyad",
              form.personal.fullName,
            ],
            [
              "Telefon",
              form.personal.phone,
            ],
            [
              "E-posta",
              form.personal.email,
            ],
            [
              "Diller",
              form.personal.languages,
            ],
          ]}
        />
      </ReviewCard>

      <ReviewCard
        title="Şirket bilgileri"
        icon={
          <Building2 className="h-5 w-5" />
        }
        onEdit={() => onEdit(2)}
      >
        <ReviewGrid
          items={[
            [
              "Şirket",
              form.company.companyName ||
                "Belirtilmedi",
            ],
            [
              "Vergi numarası",
              form.company.vatNumber ||
                "Belirtilmedi",
            ],
            [
              "Ülke",
              form.company.country,
            ],
            [
              "Şehir",
              form.company.city,
            ],
            [
              "Havalimanı bölgesi",
              form.company
                .airportRegion,
            ],
          ]}
        />
      </ReviewCard>

      <ReviewCard
        title="Araç"
        icon={
          <CarFront className="h-5 w-5" />
        }
        onEdit={() => onEdit(3)}
      >
        <ReviewGrid
          items={[
            [
              "Araç",
              `${form.vehicle.brand} ${form.vehicle.model}`,
            ],
            [
              "Yıl",
              form.vehicle
                .productionYear,
            ],
            [
              "Araç plakası",
              form.vehicle
                .licensePlate,
            ],
            [
              "Renk",
              form.vehicle.color ||
                "Belirtilmedi",
            ],
            [
              "Yolcu",
              form.vehicle
                .passengerCapacity,
            ],
            [
              "Bagaj",
              form.vehicle
                .luggageCapacity,
            ],
          ]}
        />
      </ReviewCard>

      <ReviewCard
        title="Belgeler"
        icon={
          <FileCheck2 className="h-5 w-5" />
        }
        onEdit={() => onEdit(4)}
      >
        <div className="grid gap-2">
          {documentDefinitions.map(
            (definition) => (
              <div
                key={
                  definition.type
                }
                className="flex items-center justify-between gap-4 rounded-xl bg-muted/60 px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />

                  <span className="text-sm font-semibold">
                    {
                      definition.title
                    }
                  </span>
                </div>

                <span className="max-w-[45%] truncate text-xs text-muted-foreground">
                  {
                    documents[
                      definition.type
                    ]?.name
                  }
                </span>
              </div>
            ),
          )}
        </div>
      </ReviewCard>

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-background p-5 shadow-sm">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(event) =>
            onAcceptedTermsChange(
              event.target.checked,
            )
          }
          disabled={disabled}
          className="mt-1 h-4 w-4 rounded border-border accent-[#0b2944]"
        />

        <span className="text-sm leading-6 text-muted-foreground">
          Tüm bilgilerin doğru olduğunu
          onaylıyor ve{" "}
          <span className="font-bold text-foreground">
            sürücü koşullarını
          </span>{" "}
          ve{" "}
          <span className="font-bold text-foreground">
            gizlilik politikasını
          </span>
          {" "}kabul ediyorum.
        </span>
      </label>
    </div>
  );
}

function RegistrationHero({
  currentStep,
}: {
  currentStep: number;
}) {
  return (
    <aside className="relative hidden overflow-hidden bg-[#071c31] text-white lg:block">
      <div className="sticky top-0 flex min-h-screen flex-col px-10 py-10 xl:px-14">
        <div
          aria-hidden="true"
          className="absolute -right-36 -top-36 h-96 w-96 rounded-full bg-[#1b8295]/20 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-amber-200/10 blur-3xl"
        />

        <Link
          href="/"
          className="relative flex w-fit items-center gap-3"
        >
          <KarsilaLogo tone="light" subtitle="Sürücü ağı" />
        </Link>

        <div className="relative my-auto py-12">
          <p className="text-xs font-bold uppercase tracking-[0.19em] text-amber-200">
            Premium sürücü kaydı
          </p>

          <h2 className="mt-5 max-w-md text-4xl font-extrabold leading-[1.05] tracking-[-0.05em] xl:text-5xl">
            Antalya&apos;nın seçkin
            transfer ağına katılın.
          </h2>

          <p className="mt-5 max-w-md text-sm leading-7 text-white/60">
            Profilinizi tamamlayın,
            aracınızı kaydedin ve
            doğrulama belgelerinizi tek
            bir güvenli başvuruyla gönderin.
          </p>

          <div className="mt-10 space-y-3">
            {stepDefinitions.map(
              (item) => {
                const complete =
                  item.number <
                  currentStep;

                const active =
                  item.number ===
                  currentStep;

                return (
                  <div
                    key={item.number}
                    className={[
                      "flex items-center gap-4 rounded-2xl border px-4 py-3.5 transition",
                      active
                        ? "border-white/20 bg-white/12"
                        : "border-transparent",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold",
                        complete
                          ? "bg-emerald-400 text-[#071c31]"
                          : active
                            ? "bg-amber-200 text-[#071c31]"
                            : "bg-white/8 text-white/45",
                      ].join(" ")}
                    >
                      {complete ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        item.number
                      )}
                    </span>

                    <div>
                      <p
                        className={[
                          "text-sm font-extrabold",
                          active ||
                          complete
                            ? "text-white"
                            : "text-white/45",
                        ].join(" ")}
                      >
                        {
                          item.title
                        }
                      </p>

                      <p className="mt-0.5 text-xs text-white/35">
                        Adım{" "}
                        {
                          item.number
                        }{" "}
                        /{" "}
                        {
                          totalSteps
                        }
                      </p>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>

        <div className="relative flex items-center gap-3 text-xs text-white/45">
          <ShieldCheck className="h-4 w-4" />
          Her sürücü başvurusu manuel
          olarak incelenir.
        </div>
      </div>
    </aside>
  );
}

function MobileHeader() {
  return (
    <header className="flex h-[72px] items-center justify-between border-b border-border/65 bg-background px-5 sm:px-8 lg:hidden">
      <Link
        href="/"
        className="flex items-center gap-3"
      >
        <KarsilaLogo />
      </Link>

      <Link
        href="/driver/login"
        className="text-sm font-bold text-[#1b8295]"
      >
        Giriş yap
      </Link>
    </header>
  );
}

function WizardProgress({
  currentStep,
  progress,
  onStepClick,
}: {
  currentStep: number;
  progress: number;
  onStepClick: (
    step: number,
  ) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        {stepDefinitions.map(
          (item, index) => {
            const complete =
              item.number <
              currentStep;

            const active =
              item.number ===
              currentStep;

            return (
              <div
                key={item.number}
                className="flex flex-1 items-center"
              >
                <button
                  type="button"
                  onClick={() =>
                    onStepClick(
                      item.number,
                    )
                  }
                  disabled={
                    item.number >=
                    currentStep
                  }
                  className="group flex min-w-0 flex-col items-center gap-2 disabled:cursor-default"
                >
                  <span
                    className={[
                      "flex h-9 w-9 items-center justify-center rounded-full border text-xs font-extrabold transition",
                      complete
                        ? "border-[#0b2944] bg-[#0b2944] text-white"
                        : active
                          ? "border-[#1b8295] bg-[#1b8295]/10 text-[#1b8295]"
                          : "border-border bg-background text-muted-foreground",
                    ].join(" ")}
                  >
                    {complete ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      item.number
                    )}
                  </span>

                  <span
                    className={[
                      "hidden max-w-20 truncate text-[10px] font-bold uppercase tracking-[0.1em] sm:block",
                      active ||
                      complete
                        ? "text-foreground"
                        : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {item.label}
                  </span>
                </button>

                {index <
                stepDefinitions.length -
                  1 ? (
                  <span
                    className={[
                      "mx-2 h-px flex-1",
                      complete
                        ? "bg-[#0b2944]"
                        : "bg-border",
                    ].join(" ")}
                  />
                ) : null}
              </div>
            );
          },
        )}
      </div>

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-[#1b8295] transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}

function FormField({
  id,
  label,
  icon,
  optional = false,
  className = "",
  children,
}: {
  id: string;
  label: string;
  icon: ReactNode;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`grid gap-2 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <Label
          htmlFor={id}
          className="inline-flex items-center gap-2 font-bold"
        >
          <span className="text-[#1b8295]">
            {icon}
          </span>

          {label}
        </Label>

        {optional ? (
          <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-muted-foreground">
            İsteğe bağlı
          </span>
        ) : null}
      </div>

      {children}
    </div>
  );
}

function SelectField({
  id,
  value,
  disabled,
  onChange,
  children,
}: {
  id: string;
  value: string;
  disabled: boolean;
  onChange: (
    value: string,
  ) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="h-12 w-full appearance-none rounded-xl border border-input bg-background px-3 pr-10 text-sm outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {children}
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function PasswordInput({
  id,
  value,
  visible,
  disabled,
  placeholder,
  onChange,
  onToggle,
}: {
  id: string;
  value: string;
  visible: boolean;
  disabled: boolean;
  placeholder: string;
  onChange: (
    value: string,
  ) => void;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      <Input
        id={id}
        type={
          visible
            ? "text"
            : "password"
        }
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        placeholder={placeholder}
        autoComplete="new-password"
        disabled={disabled}
        className="h-12 rounded-xl bg-background pr-12"
      />

      <button
        type="button"
        onClick={onToggle}
        aria-label={
          visible
            ? "Şifreyi gizle"
            : "Şifreyi göster"
        }
        className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        {visible ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

function UniquenessMessage({
  state,
  idleMessage,
}: {
  state: UniquenessState;
  idleMessage?: string | null;
}) {
  if (
    state.status === "idle"
  ) {
    if (!idleMessage) {
      return null;
    }

    return (
      <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <CircleAlert className="h-3.5 w-3.5 shrink-0" />
        {idleMessage}
      </p>
    );
  }

  if (
    state.status === "checking"
  ) {
    return (
      <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <LoaderCircle className="h-3.5 w-3.5 shrink-0 animate-spin" />
        Kullanılabilirlik kontrol ediliyor...
      </p>
    );
  }

  if (
    state.status === "available"
  ) {
    return (
      <p className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
        <CircleCheck className="h-3.5 w-3.5 shrink-0" />
        {state.message ??
          "Kullanılabilir"}
      </p>
    );
  }

  if (
    state.status === "taken"
  ) {
    return (
      <p className="flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400">
        <CircleX className="h-3.5 w-3.5 shrink-0" />
        {state.message ??
          "Zaten kayıtlı"}
      </p>
    );
  }

  return (
    <p className="flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
      <CircleAlert className="h-3.5 w-3.5 shrink-0" />
      {state.message ??
        "Kullanılabilirlik kontrol edilemedi."}
    </p>
  );
}

function DocumentUpload({
  definition,
  file,
  disabled,
  onChange,
  onRemove,
}: {
  definition: {
    type: DocumentType;
    title: string;
    description: string;
  };
  file: File | null;
  disabled: boolean;
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  onRemove: () => void;
}) {
  const inputId =
    `document-${definition.type}`;

  if (file) {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-400/20 dark:bg-emerald-400/10">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
          <FileCheck2 className="h-5 w-5" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold">
            {definition.title}
          </p>

          <p className="mt-1 truncate text-xs text-muted-foreground">
            {file.name} ·{" "}
            {formatFileSize(
              file.size,
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          aria-label={`${definition.title} belgesini kaldır`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-background hover:text-foreground disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <label
      htmlFor={inputId}
      className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-border bg-background p-4 transition hover:border-[#1b8295]/60 hover:bg-[#1b8295]/5"
    >
      <input
        id={inputId}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
        disabled={disabled}
        onChange={onChange}
        className="sr-only"
      />

      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground transition group-hover:bg-[#1b8295]/10 group-hover:text-[#1b8295]">
        <Upload className="h-5 w-5" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-extrabold">
          {definition.title}
        </p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {definition.description}
        </p>
      </div>

      <span className="hidden rounded-lg border border-border bg-background px-3 py-2 text-xs font-bold sm:inline-flex">
        Dosya seç
      </span>
    </label>
  );
}

function ReviewCard({
  title,
  icon,
  onEdit,
  children,
}: {
  title: string;
  icon: ReactNode;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-background p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1b8295]/10 text-[#1b8295]">
            {icon}
          </span>

          <h2 className="font-extrabold">
            {title}
          </h2>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-bold text-[#1b8295] hover:underline"
        >
          Düzenle
        </button>
      </div>

      <div className="mt-5">
        {children}
      </div>
    </section>
  );
}

function ReviewGrid({
  items,
}: {
  items: Array<
    [string, string]
  >;
}) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {items.map(
        ([label, value]) => (
          <div key={label}>
            <dt className="text-[10px] font-bold uppercase tracking-[0.13em] text-muted-foreground">
              {label}
            </dt>

            <dd className="mt-1 text-sm font-semibold">
              {value}
            </dd>
          </div>
        ),
      )}
    </dl>
  );
}

function RegistrationSuccess({
  onContinue,
}: {
  onContinue: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f5f6] px-5 py-10 dark:bg-background">
      <section className="w-full max-w-xl overflow-hidden rounded-[2rem] border border-border/70 bg-background shadow-xl">
        <div className="bg-[#071c31] px-7 py-9 text-white sm:px-10 sm:py-11">
          <Link
            href="/"
            className="flex w-fit items-center gap-3"
          >
            <KarsilaLogo tone="light" />
          </Link>

          <span className="mt-10 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-400 text-[#071c31]">
            <BadgeCheck className="h-8 w-8" />
          </span>

          <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
            Başvuru gönderildi
          </p>

          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl">
            Karsila&apos;ya hoş geldiniz.
          </h1>

          <p className="mt-4 max-w-md text-sm leading-7 text-white/65">
            Sürücü başvurunuz, araç
            bilgileriniz ve doğrulama
            belgeleriniz başarıyla alındı.
          </p>
        </div>

        <div className="px-7 py-8 sm:px-10">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-300/20 dark:bg-amber-300/10">
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" />

              <div>
                <h2 className="text-sm font-extrabold text-amber-900 dark:text-amber-100">
                  Başvuru inceleniyor
                </h2>

                <p className="mt-1 text-sm leading-6 text-amber-800 dark:text-amber-200">
                  Kontrol paneli erişiminiz
                  etkinleştirilmeden önce
                  Karsila sürücü bilgilerinizi,
                  aracınızı ve belgelerinizi
                  inceleyecek.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onContinue}
            className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0b2944] px-5 text-sm font-bold text-white transition hover:bg-[#123a5d]"
          >
            Sürücü girişine devam et
            <ArrowRight className="h-4 w-4" />
          </button>

          <Link
            href="/"
            className="mt-5 flex items-center justify-center gap-2 text-sm font-bold text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Karsila&apos;ya dön
          </Link>
        </div>
      </section>
    </main>
  );
}

function useUniquenessCheck(
  field: UniquenessField,
  rawValue: string,
  enabled: boolean,
  revision: number,
): UniquenessState {
  const value = rawValue.trim();
  const requestKey =
    `${field}:${value}:${revision}`;
  const [result, setResult] = useState<{
    requestKey: string;
    state: UniquenessState;
  }>({
    requestKey: "",
    state: {
      status: "idle",
      message: null,
    },
  });

  useEffect(() => {
    if (!value || !enabled) {
      return;
    }

    const controller =
      new AbortController();

    const timer =
      window.setTimeout(
        async () => {
          try {
            const response =
              await fetch(
                "/api/driver/register/check",
                {
                  method: "POST",
                  headers: {
                    "Content-Type":
                      "application/json",
                  },
                  body: JSON.stringify({
                    field,
                    value,
                  }),
                  signal:
                    controller.signal,
                },
              );

            const data =
              (await response.json()) as {
                available?: boolean;
                error?: string;
              };

            if (!response.ok) {
              setResult({
                requestKey,
                state: {
                  status: "error",
                  message:
                    data.error ??
                    "Kullanılabilirlik kontrol edilemedi.",
                },
              });

              return;
            }

            if (data.available) {
              setResult({
                requestKey,
                state: {
                  status: "available",
                  message:
                    getAvailableMessage(
                      field,
                    ),
                },
              });

              return;
            }

            setResult({
              requestKey,
              state: {
                status: "taken",
                message:
                  getTakenMessage(
                    field,
                  ),
              },
            });
          } catch (error) {
            if (
              error instanceof
                DOMException &&
              error.name ===
                "AbortError"
            ) {
              return;
            }

            console.error(
              `Uniqueness check failed for ${field}:`,
              error,
            );

            setResult({
              requestKey,
              state: {
                status: "error",
                message:
                  "Karsila kullanılabilirliği kontrol edemedi. Lütfen tekrar deneyin.",
              },
            });
          }
        },
        uniquenessDebounceMs,
      );

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [field, value, enabled, requestKey]);

  if (!value || !enabled) {
    return {
      status: "idle",
      message: null,
    };
  }

  if (result.requestKey !== requestKey) {
    return {
      status: "checking",
      message: null,
    };
  }

  return result.state;
}

function getRegistrationStepForField(
  field?: string,
) {
  if (
    field === "fullName" ||
    field === "email" ||
    field === "phone" ||
    field === "languages" ||
    field === "password"
  ) {
    return 1;
  }

  if (
    field === "companyName" ||
    field === "vatNumber" ||
    field === "country" ||
    field === "city" ||
    field === "airportRegion"
  ) {
    return 2;
  }

  if (
    field === "vehicleBrand" ||
    field === "vehicleModel" ||
    field === "vehicleYear" ||
    field === "licensePlate" ||
    field === "vehicleColor" ||
    field === "capacity" ||
    field === "luggageCapacity"
  ) {
    return 3;
  }

  if (
    field === "driver_license" ||
    field === "commercial_driver_license" ||
    field === "vehicle_registration" ||
    field === "vehicle_insurance"
  ) {
    return 4;
  }

  return null;
}

function getAvailableMessage(
  field: UniquenessField,
) {
  if (field === "email") {
    return "E-posta adresi kullanılabilir.";
  }

  if (field === "phone") {
    return "Telefon numarası kullanılabilir.";
  }

  return "Araç plakası kullanılabilir.";
}

function getTakenMessage(
  field: UniquenessField,
) {
  if (field === "email") {
    return "Bu e-posta adresiyle kayıtlı bir hesap zaten var.";
  }

  if (field === "phone") {
    return "Bu telefon numarası zaten kayıtlı.";
  }

  return "Bu araç plakası zaten kayıtlı.";
}

function getUniqueInputClassName(
  status: UniquenessStatus,
) {
  const base =
    "h-12 rounded-xl bg-background";

  if (status === "available") {
    return `${base} border-emerald-400 focus-visible:ring-emerald-400`;
  }

  if (status === "taken") {
    return `${base} border-red-400 focus-visible:ring-red-400`;
  }

  if (status === "error") {
    return `${base} border-amber-400 focus-visible:ring-amber-400`;
  }

  return base;
}

function isValidEmail(
  value: string,
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value.trim(),
  );
}

function normalizePhone(
  value: string,
) {
  let normalized = value
    .trim()
    .replace(/[^0-9+]/g, "");

  if (
    normalized.startsWith("00")
  ) {
    normalized =
      `+${normalized.slice(2)}`;
  }

  return normalized;
}

function isValidPhone(
  value: string,
) {
  return /^\+[1-9][0-9]{7,14}$/.test(
    normalizePhone(value),
  );
}

function isValidLicensePlate(
  value: string,
) {
  const normalized =
    value
      .trim()
      .replace(/[^a-zA-Z0-9]/g, "");

  return normalized.length >= 4;
}

function getStepDescription(
  step: number,
) {
  switch (step) {
    case 1:
      return "Güvenli Karsila hesabınızı oluşturun. Devam etmeden önce e-posta adresiniz ve telefon numaranız kontrol edilir.";

    case 2:
      return "İşletme ve çalışma bölgesi bilgilerinizi ekleyin. Bağımsız sürücüler için şirket bilgileri isteğe bağlıdır.";

    case 3:
      return "Karsila transferlerinde kullanacağınız ana aracı kaydedin. Devam etmeden önce araç plakası kontrol edilir.";

    case 4:
      return "Karsila'nın doğrulama için ihtiyaç duyduğu belgeleri ekleyin. Başvurunun tamamını gönderene kadar hiçbir dosya yüklenmez.";

    case 5:
      return "Tüm bilgileri dikkatlice kontrol edin. Karsila başvurunuzu oluşturmadan önce her şeyi yeniden doğrular.";

    default:
      return "";
  }
}

function formatFileSize(
  bytes: number,
) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (
    bytes <
    1024 * 1024
  ) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}
