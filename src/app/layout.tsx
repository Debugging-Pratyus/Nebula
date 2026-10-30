import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEBULA | Enter the Universe",
  description:
    "An immersive, interactive 3D universe explorer. Travel between worlds, one planet at a time.",
};

export const viewport: Viewport = {
  themeColor: "#03040a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
