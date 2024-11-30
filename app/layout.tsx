import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
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
    <html lang="en">
      <head>
        <Script src="https://kit.fontawesome.com/5073129f1e.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}
