// Site-wide configuration and metadata
export const siteConfig = {
  name: "Honey Foods",
  tagline: "Taste is everything",
  description:
    "Premium pastries and food items delivered fresh to your doorstep",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

  // Contact information
  contact: {
    phone: "+44 7442 932429",
    email: "honeycakesandfoods@gmail.com",
    whatsapp: "+447442932429",
    address: "Hertfordshire, UK",
  },

  // Social media links
  social: {
    instagram: "https://instagram.com/honeyfoods",
    facebook: "https://facebook.com/honeyfoods",
    twitter: "https://twitter.com/honeyfoods",
  },

  // Business hours
  businessHours: {
    weekdays: "9:00 AM - 6:00 PM",
    weekends: "10:00 AM - 4:00 PM",
  },

  // Delivery settings
  delivery: {
    defaultFee: 1500, // ₦1,500 default delivery fee
    freeDeliveryThreshold: 10000, // Free delivery for orders above ₦10,000
    estimatedTime: "30-60 minutes",
  },

  // SEO metadata
  metadata: {
    title: {
      default: "Honey Foods - Taste is everything",
      template: "%s | Honey Foods",
    },
    description:
      "Order premium pastries and food items online. Fresh, quality ingredients delivered fast to your doorstep in Lagos, Nigeria.",
    keywords: [
      "pastries",
      "food delivery",
      "Lagos bakery",
      "online food order",
      "cakes",
      "bread",
      "Honey Foods",
    ],
    authors: [{ name: "Honey Foods" }],
    creator: "Honey Foods",
    publisher: "Honey Foods",
    openGraph: {
      type: "website",
      locale: "en_NG",
      siteName: "Honey Foods",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Honey Foods - Taste is everything",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@honeyfoods",
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
