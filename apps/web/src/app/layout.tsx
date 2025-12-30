import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const siteUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://ivyonaire.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ivyonaire - Premium Student Progress Tracking",
    template: "%s | Ivyonaire",
  },
  description: "Track and view student academic progress throughout the year. Monitor IELTS scores, SAT progress, portfolio projects, and international university admissions.",
  keywords: ["student progress", "academic tracking", "IELTS", "SAT", "university admissions", "education"],
  authors: [{ name: "Ivyonaire" }],
  creator: "Ivyonaire",
  publisher: "Ivyonaire",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Ivyonaire",
    title: "Ivyonaire - Premium Student Progress Tracking",
    description: "Track and view student academic progress throughout the year. Monitor IELTS scores, SAT progress, portfolio projects, and international university admissions.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Ivyonaire - Student Progress Tracking",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ivyonaire - Premium Student Progress Tracking",
    description: "Track and view student academic progress throughout the year.",
    images: [`${siteUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#1f3a2e" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="flex flex-col min-h-screen">
        <ErrorBoundary>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  );
}
