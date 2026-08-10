import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") ?? incoming.get("host") ?? "localhost:3000";
  const protocol = incoming.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = new URL(`${protocol}://${host}`);
  const image = new URL("/og.png", origin).toString();
  return {
    metadataBase: origin,
    title: "Argus Security Validation — OWASP Juice Shop",
    description: "External validation documentation for Argus static analysis, dependency scanning, secret redaction and semantic-engine reliability.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "Argus Security Validation",
      description: "P0 redaction findings, benchmark results and complete detector coverage.",
      type: "website",
      images: [{ url: image, width: 1672, height: 942, alt: "Argus security validation — P0 validation failed" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Argus Security Validation",
      description: "External benchmark results and detector coverage.",
      images: [image],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
