import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://magneti0.vercel.app/";

const siteTitle = "MagnetIO | Stream Movies & TV Series from Torrents";
const siteDescription =
  "MagnetIO is a lightweight, self-hostable, peer-to-peer web media streaming platform for movies and TV series. It discovers torrent streams through Torrentio and plays them directly in your browser.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | MagnetIO",
  },
  applicationName: "MagnetIO",
  description: siteDescription,
  keywords: [
    "Magneti0",
    "MagnetI0",
    "MagnetIO",
    "Magnetio",
    "Magnet",
    "torrent streaming",
    "peer-to-peer streaming",
    "P2P streaming",
    "WebTorrent",
    "Torrentio",
    "magnet links",
    "stream movies",
    "stream TV series",
    "self-hosted media server",
    "Cinemeta",
    "IMDb",
  ],
  authors: [
    {
      name: "MagnetIO contributors",
      url: "https://github.com/abneeeees/",
    },
  ],
  creator: "abneeeees",
  publisher: "MagnetIO",
  category: "entertainment",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/logo.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/favicon.ico",
    apple: [{ url: "/logo.png", type: "image/png", sizes: "512x512" }],
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "MagnetIO",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "MagnetIO logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-[#0b0c10] text-[#e6e8ec]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
