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
  const image = new URL("/og-reference-style.png", origin).toString();

  return {
    metadataBase: origin,
    title: "Argus Security Scanner - Local-first SAST",
    description: "Product documentation for Argus: local-first static analysis, taint tracking, IaC scanning, OSV advisories, local AI triage and CI enforcement.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "Argus - Security risks, found where your code lives",
      description: "Local-first application security for JavaScript, TypeScript, React, Java and Python.",
      type: "website",
      images: [{ url: image, width: 1672, height: 942, alt: "Argus local-first application security scanner" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Argus - Security risks, found where your code lives",
      description: "Local-first static analysis, taint tracking, IaC, dependency scanning and CI enforcement.",
      images: [image],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
