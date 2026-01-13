import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simple Business Card",
  description: "呈現簡易的電子名片",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body>
        {children}
      </body>
    </html>
  );
}
