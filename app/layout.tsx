
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SplashScreen from "./components/splash-screen";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "DentX24",
  title: {
    default: "DentX24 | Your Smile, Our Priority",
    template: "%s | DentX24",
  },
  description:
    "Discover trusted dental care, find dentists, and manage your dental appointments with DentX24.",
  icons: {
    icon: [
      { url: "/dentx24-logo.png", type: "image/png" },
    ],
    apple: [
      { url: "/dentx24-logo.png", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#087ca7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SplashScreen />
        {children}
      </body>
    </html>
  );
}
