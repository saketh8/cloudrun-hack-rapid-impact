import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rapid Impact Partner Assistant",
  description: "Generate rapid donor updates, social posts, and internal tasks from event highlights.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

