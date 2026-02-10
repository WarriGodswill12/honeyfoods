import type { Metadata } from "next";
import { Inter, Playfair_Display, Montserrat, Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { CartProvider } from "@/store/cart-store";
import { ConvexClientProvider } from "@/components/shared/convex-provider";
import { Toaster } from "sonner";

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

const poppins = Poppins({
  variable: "--font-poppins",
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

const stay = localFont({
  src: "./fonts/Stay.otf",
  variable: "--font-stay",
  display: "swap",
});

const refind = localFont({
  src: "./fonts/Refind.otf",
  variable: "--font-refind",
  display: "swap",
});

const aveburg = localFont({
  src: "./fonts/aveburg-grande-demo.ttf",
  variable: "--font-aveburg",
  display: "swap",
});

const belarin = localFont({
  src: "./fonts/belarin-regular.ttf",
  variable: "--font-belarin",
  display: "swap",
});

const blokna = localFont({
  src: "./fonts/blokna-regular-demo.ttf",
  variable: "--font-blokna",
  display: "swap",
});

const fedro = localFont({
  src: "./fonts/fedro-light-italic.ttf",
  variable: "--font-fedro",
  display: "swap",
});

const regalorn = localFont({
  src: "./fonts/regalorn-demo-regular.ttf",
  variable: "--font-regalorn",
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
        className={`${inter.variable} ${playfair.variable} ${montserrat.variable} ${poppins.variable} ${brunelis.variable} ${tryFat.variable} ${stay.variable} ${refind.variable} ${aveburg.variable} ${belarin.variable} ${blokna.variable} ${fedro.variable} ${regalorn.variable} antialiased`}
      >
        <ConvexClientProvider>
          <CartProvider>{children}</CartProvider>
        </ConvexClientProvider>
        <Toaster position="bottom-center" richColors />
      </body>
    </html>
  );
}
