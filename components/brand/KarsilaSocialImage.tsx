export function KarsilaSocialImage() {
  return (
    <div
      style={{
        alignItems: "center",
        background:
          "radial-gradient(circle at 82% 16%, rgba(228,199,125,0.23), transparent 24%), radial-gradient(circle at 12% 100%, rgba(47,171,183,0.2), transparent 34%), linear-gradient(135deg, #061727 0%, #0b2944 52%, #15506d 100%)",
        color: "#ffffff",
        display: "flex",
        height: "100%",
        justifyContent: "space-between",
        overflow: "hidden",
        padding: "72px 78px",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 690,
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            gap: 22,
          }}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 64 64"
            width="88"
            height="88"
            fill="none"
          >
            <rect
              width="64"
              height="64"
              rx="17"
              fill="rgba(255,255,255,0.1)"
              stroke="rgba(255,255,255,0.18)"
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

          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: 58,
                fontWeight: 800,
                letterSpacing: "-0.055em",
                lineHeight: 1,
              }}
            >
              Karsila
            </div>
            <div
              style={{
                color: "#e4c77d",
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "0.18em",
                marginTop: 10,
              }}
            >
              YOUR WELCOME RIDE IN TÜRKİYE
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 61,
            fontWeight: 800,
            letterSpacing: "-0.055em",
            lineHeight: 1.02,
            marginTop: 58,
          }}
        >
          Arrive as a guest.
          <br />
          Travel like a local.
        </div>

        <div
          style={{
            color: "rgba(255,255,255,0.68)",
            fontSize: 23,
            lineHeight: 1.45,
            marginTop: 28,
          }}
        >
          Private airport transfers with trusted local drivers.
        </div>
      </div>

      <div
        style={{
          alignItems: "center",
          display: "flex",
          height: 410,
          justifyContent: "center",
          position: "relative",
          width: 300,
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(180deg, #56c8cc 0%, #e4c77d 100%)",
            borderRadius: 999,
            height: 284,
            position: "absolute",
            width: 4,
          }}
        />

        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: 96,
            position: "relative",
          }}
        >
          {[
            ["AYT", "Antalya Airport"],
            ["01", "Your local driver"],
            ["TR", "Holiday starts"],
          ].map(([code, label]) => (
            <div
              key={code}
              style={{
                alignItems: "center",
                display: "flex",
                gap: 18,
                width: 270,
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  background: code === "01" ? "#e4c77d" : "#f7f3e8",
                  border: "6px solid #0b2944",
                  borderRadius: 999,
                  color: "#0b2944",
                  display: "flex",
                  fontSize: 16,
                  fontWeight: 800,
                  height: 58,
                  justifyContent: "center",
                  width: 58,
                }}
              >
                {code}
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.78)",
                  display: "flex",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
