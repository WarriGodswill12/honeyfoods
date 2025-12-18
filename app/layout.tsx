import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { CartProvider } from "@/store/cart-store";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
