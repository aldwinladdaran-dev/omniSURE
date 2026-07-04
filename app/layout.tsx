import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";

export const metadata = {
  title: "Omnisure",
  description: "Your Insurance Advisory Operating System",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
