import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";

export const metadata = {
  title: "Omnisure",
  description: "Your Insurance Advisory Operating System",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey="pk_test_Y2xldmVyLXB1cC0xMC5qbGVyay5hY2NvdW50cy5kZXYk">
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
