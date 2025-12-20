import type { Metadata } from "next";
import { Inter, Playfair_Display, Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { CartProvider } from "@/store/cart-store";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const brunelis = localFont({
  src: "./fonts/Brunelis-Noctelle.otf",
  variable: "--font-brunelis",
  display: "swap",
});

const tryFat = localFont({
  src: "./fonts/TRYFat-Black.ttf",
  variable: "--font-tryfat",
  display: "swap",
});

export const metadata: Metadata = {
  title: siteConfig.metadata.title,
  description: siteConfig.metadata.description,
  keywords: [...siteConfig.metadata.keywords],
  authors: [...siteConfig.metadata.authors],
  creator: siteConfig.metadata.creator,
  publisher: siteConfig.metadata.publisher,
  openGraph: {
    type: siteConfig.metadata.openGraph.type,
    locale: siteConfig.metadata.openGraph.locale,
    siteName: siteConfig.metadata.openGraph.siteName,
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    images: siteConfig.metadata.openGraph.images.map((img) => ({ ...img })),
  },
  twitter: siteConfig.metadata.twitter,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${montserrat.variable} ${brunelis.variable} ${tryFat.variable} antialiased`}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
