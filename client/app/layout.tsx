import type { Metadata } from "next";
import { Manrope, Syne } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const syne = Syne({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Salvo | AI Cold Email Engine",
  description: "Highly personalized, AI-powered cold email automation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${manrope.variable} ${syne.variable} font-sans min-h-screen bg-bg-base text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
