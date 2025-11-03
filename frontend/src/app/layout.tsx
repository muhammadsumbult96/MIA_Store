import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/providers/AuthProvider";
import { CartProvider } from "@/hooks/useCart";
import { TranslationProvider } from "@/hooks/useTranslation";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "MÍA - E-Commerce Platform",
  description: "High-performance e-commerce platform with modern design",
  keywords: ["e-commerce", "shopping", "online store"],
  authors: [{ name: "MÍA Team" }],
  openGraph: {
    title: "MÍA - E-Commerce Platform",
    description: "High-performance e-commerce platform with modern design",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="antialiased">
        <TranslationProvider>
          <AuthProvider>
            <CartProvider>{children}</CartProvider>
          </AuthProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}

