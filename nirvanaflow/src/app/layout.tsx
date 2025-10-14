import type { Metadata } from "next";

import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});




export const metadata: Metadata = {
  title: "Nirvana flow",
  description: "Focus on what matters. Let AI handle the rest",
  icons: {
    icon: '/favicon.png',
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
        className={`${jakarta.variable}  antialiased`}
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}
