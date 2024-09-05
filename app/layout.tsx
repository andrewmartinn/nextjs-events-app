import "@/styles/globals.css";

import { lexendDeca } from "@/styles/fonts";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eventify - Discover, Book, and Experience Events",
  description:
    "Eventify is your go-to platform for discovering and booking the best events near you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${lexendDeca.className} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
