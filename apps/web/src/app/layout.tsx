import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Magnetio",
  description: "Self-hosted torrent streaming platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
