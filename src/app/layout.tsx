import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Isang — Your AI Travel Companion",
  description:
    "Plan your next trip with Isang. Tell us your destination, budget, or travel style and we'll build a personalised itinerary.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
