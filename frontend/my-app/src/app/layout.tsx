import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar/Navbar";
import HomePage from "@/app/page";
import Footer from "@/components/Footer/Footer";
import { AuthProvider } from '@/context/AuthContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bookstore",
  description: "A modern online bookstore built with Next.js, TypeScript, and Tailwind CSS. Browse and purchase your favorite books with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >


        <AuthProvider>
          <Navbar></Navbar>
          {children}
          <Footer></Footer>
        </AuthProvider>

      </body>
    </html>
  );
}
