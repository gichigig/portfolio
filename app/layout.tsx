import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import FloatingCommandPalette from "@/components/FloatingCommandPalette";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://billy-portfolio.vercel.app"),
  title: "Billy | Software Engineer | Flutter, React, Spring Boot, Node.js",
  description:
    "Black-themed software engineering portfolio featuring secure, full-stack systems across mobile, web, and desktop.",
  openGraph: {
    title: "Billy | Software Engineer",
    description:
      "Portfolio showcasing secure product systems in real estate, hospitality, and eLearning.",
    url: "https://billy-portfolio.vercel.app",
    siteName: "Billy Portfolio",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} antialiased`}
      >
        {children}
        <FloatingCommandPalette />
      </body>
    </html>
  );
}
