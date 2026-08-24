import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export function generateMetadata(): Metadata {
  const origin = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://naresh-fd.github.io/argus-security-validation-docs/");
  const image = new URL("/og-reference-style.png", origin).toString();

  return {
    metadataBase: origin,
    title: "Argus Security Scanner - Local-first SAST",
    description: "Argus documentation: 168 static security detectors, dynamic OSV advisories, OWASP coverage, taint tracking, IaC scanning and CI enforcement.",
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
