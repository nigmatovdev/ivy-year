import type { Metadata } from "next";
import "./globals.css";

const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "https://admin.ivyonaire.com";

export const metadata: Metadata = {
  metadataBase: new URL(adminUrl),
  title: {
    default: "Admin Dashboard | Ivyonaire",
    template: "%s | Ivyonaire Admin",
  },
  description: "Ivyonaire Admin Dashboard - Manage student progress and academic tracking",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
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
        <meta name="theme-color" content="#1f3a2e" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}
