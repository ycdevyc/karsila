type KarsilaLogoProps = {
  className?: string;
  compact?: boolean;
  subtitle?: string;
  tone?: "dark" | "light";
};

export function KarsilaLogo({
  className = "",
  compact = false,
  subtitle,
  tone = "dark",
}: KarsilaLogoProps) {
  const light = tone === "light";

  return (
    <span
      className={`inline-flex items-center gap-3 ${className}`}
      aria-label="Karsila"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 64 64"
        className="h-10 w-10 shrink-0"
        fill="none"
      >
        <rect
          width="64"
          height="64"
          rx="17"
          fill={light ? "rgba(255,255,255,0.1)" : "#0B2944"}
          stroke={light ? "rgba(255,255,255,0.16)" : "#0B2944"}
        />
        <path
          d="M20 16V48M20 32L45 16M20 32L45 48"
          stroke="#F7F3E8"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="32.5" cy="32" r="4.25" fill="#E4C77D" />
      </svg>

      {!compact ? (
        <span>
          <span
            className={`block text-lg font-extrabold leading-none tracking-[-0.045em] ${
              light ? "text-white" : "text-[#0B2944] dark:text-white"
            }`}
          >
            Karsila
          </span>
          {subtitle ? (
            <span
              className={`mt-1 block text-[9px] font-bold uppercase tracking-[0.18em] ${
                light ? "text-white/50" : "text-muted-foreground"
              }`}
            >
              {subtitle}
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}
