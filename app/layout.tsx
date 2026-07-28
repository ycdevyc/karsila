import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://karsila.app"),

  title: {
    default: "Karsila",
    template: "%s | Karsila",
  },

  description:
    "Private airport transfers in Antalya. Compare verified local driver offers and choose the welcome ride that suits your journey.",

  keywords: [
    "Antalya Airport Transfer",
    "Karsila",
    "Karsila app",
    "VIP Transfer",
    "Airport Taxi Antalya",
    "Mercedes Vito",
  ],

  applicationName: "Karsila",

  authors: [
    {
      name: "Karsila",
    },
  ],

  openGraph: {
    title: "Karsila",
    description:
      "Compare local driver offers and choose your private Antalya airport transfer.",
    type: "website",
    locale: "en_GB",
    siteName: "Karsila",
    url: "https://karsila.app",
  },

  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
