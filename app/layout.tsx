import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    title: "Neel Saswade — Product designer",
    description:
      "The portfolio of Neel Saswade, a product designer and creative partner based in San Francisco.",
    openGraph: {
      title: "Neel Saswade — Product designer",
      description:
        "The portfolio of Neel Saswade, a product designer and creative partner based in San Francisco.",
      type: "website",
      url: origin?.toString(),
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: "Neel Saswade — Product designer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Neel Saswade — Product designer",
      description:
        "The portfolio of Neel Saswade, a product designer and creative partner based in San Francisco.",
      images: [socialImage],
    },
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
