"use client";
import { Geist, Geist_Mono } from "next/font/google";
import {
  HeroUIProvider,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button
} from '@heroui/react'; // Importing components from heroui/react

import "./globals.css"
import "../input.css"
import "../output.css"
import "../../public/font/style.css"
import Header from "@/components/Header/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
/*
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};*/

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <head></head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark text-foreground bg-background `}
      >
        <HeroUIProvider>
          <Header />

          {children}

        </HeroUIProvider>

      </body>
    </html>
  );
}
