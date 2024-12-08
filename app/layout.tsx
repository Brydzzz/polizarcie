import Snackbars from "@/components/snackbars/snackbars-container.component";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Providers from "./providers";
export const metadata: Metadata = {
  title: "Poliżarcie",
  description: "Masz na coś ochotę?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <head>
        <Script src="https://kit.fontawesome.com/5073129f1e.js" />
      </head>
      <body>
        <Providers>
          {children}
          <Snackbars />
        </Providers>
      </body>
    </html>
  );
}
