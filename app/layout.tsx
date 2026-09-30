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
  const origin = host ? new URL(`${protocol}://${host}`) : new URL("https://neelsaswade.com");
  const socialImage = new URL("/og.png", origin).toString();
  const title = "Neel Saswade’s portfolio";
  const description =
    "The portfolio of Neel Saswade, a product designer and creative partner based in San Francisco.";
  const imageAlt = "Three glass activity icons from Neel Saswade’s portfolio";

  return {
    metadataBase: origin,
    title,
    description,
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: "/",
      siteName: "Neel Saswade",
      locale: "en_US",
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: socialImage, alt: imageAlt }],
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
