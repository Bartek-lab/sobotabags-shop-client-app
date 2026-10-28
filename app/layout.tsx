import type { Metadata } from "next";
import { Inter, Fraunces, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { PageTransition } from "@/components/shared/page-transition";
import { AuthInitializer } from "@/components/shared/auth-initializer";
import { Toaster } from "@/components/ui/sonner";
import { getAllCategories } from "@/lib/products";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KS – ręcznie robione skórzane torby premium",
  description:
    "KS to marka ręcznie robionych skórzanych toreb premium. Torby damskie i męskie szyte z najwyższej jakości skóry naturalnej w Polsce.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Best-effort: the nav shouldn't take the whole site down if shop-api is
  // briefly unreachable -- it just falls back to no category links that one
  // request.
  const categories = await getAllCategories().catch(() => []);

  return (
    <html
      lang="pl"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthInitializer />
          <Navbar categories={categories} />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <Toaster position="bottom-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
