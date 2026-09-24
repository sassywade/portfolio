import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import "./field-journal.css";
import { PhilipToggle } from "./philip-toggle";
import { PORTFOLIO_THEME_BOOT_SCRIPT } from "./portfolio-theme";
import { Soundscape } from "./soundscape";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");
  const protocol =
    forwardedProtocol?.split(",")[0]?.trim() ??
    (host?.startsWith("localhost") ? "http" : "https");
  const origin = host ? new URL(`${protocol}://${host}`) : undefined;
  const socialImage = origin
    ? new URL("/og.png", origin).toString()
    : "/og.png";

  return {
    metadataBase: origin,
    title: "Neel Saswade’s portfolio",
    description:
      "The portfolio of Neel Saswade, a product designer and creative partner based in San Francisco.",
    openGraph: {
      title: "Neel Saswade’s portfolio",
      description:
        "The portfolio of Neel Saswade, a product designer and creative partner based in San Francisco.",
      type: "website",
      url: origin?.toString(),
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: "Three glass activity icons from Neel Saswade’s portfolio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Neel Saswade’s portfolio",
      description:
        "The portfolio of Neel Saswade, a product designer and creative partner based in San Francisco.",
      images: [socialImage],
    },
    icons: {
      icon: [
        { url: "/lmo-square-tree.png?v=4", type: "image/png", sizes: "64x64" },
        { url: "/favicon.svg?v=4", type: "image/svg+xml" },
      ],
      shortcut: "/lmo-square-tree.png?v=4",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/lmo-square-tree.png?v=4" type="image/png" sizes="64x64" />
        <script dangerouslySetInnerHTML={{ __html: PORTFOLIO_THEME_BOOT_SCRIPT }} />
        <script defer data-domain="neelsaswade.com" src="https://plausible.io/js/script.js" />
      </head>
      <body className={`${newsreader.variable} ${geist.variable} ${geistMono.variable} antialiased`}>
        <Soundscape />
        {children}
        <PhilipToggle />
      </body>
    </html>
  );
}
