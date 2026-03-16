import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.swaadyatra.com"),
  title: {
    default: "SwaadYatra – Discover the Best Street Food in Every Indian City",
    template: "%s | SwaadYatra",
  },
  description:
    "SwaadYatra helps travelers discover the best street food spots, famous local dishes, and authentic eateries near top tourist places across India.",
  keywords:
    "best street food in India, food travel guide India, famous food spots Indian cities, street food near tourist places, authentic Indian food, food discovery platform India",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    siteName: "SwaadYatra",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://res.cloudinary.com/dinzfa92w/image/upload/f_auto,q_auto,w_1200/hero_sec_nltkkk",
        width: 1200,
        height: 630,
        alt: "SwaadYatra – Discover the Best Street Food in Every Indian City",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@swaadyatra",
    images: ["https://res.cloudinary.com/dinzfa92w/image/upload/f_auto,q_auto,w_1200/hero_sec_nltkkk"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
