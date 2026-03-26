import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import MainLayout from "@/components/layout/MainLayout";
import { ToastProvider } from "@/components/ui/ToastNotification";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "AnimateUI - Animated Component Library & Playground",
  description:
    "A comprehensive animated UI component library with 20+ beautifully animated, reusable components and an interactive live playground.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ToastProvider>
          <MainLayout>{children}</MainLayout>
        </ToastProvider>
      </body>
    </html>
  );
}
