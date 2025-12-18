// Honey Foods Brand Guidelines
// Colors, typography, and design tokens

export const brandColors = {
  // Primary brand colors
  honeyGold: "#E0A81F",
  charcoalBlack: "#2B2B2B",
  warmOrange: "#E06A1F",
  softCream: "#FAFAF8",

  // Semantic colors
  primary: "#E0A81F",
  secondary: "#E06A1F",
  accent: "#2B2B2B",
  background: "#FAFAF8",
  foreground: "#2B2B2B",

  // Status colors
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",

  // Neutral colors
  white: "#FFFFFF",
  black: "#000000",
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
} as const;

export const brandTypography = {
  fonts: {
    heading: "'Poppins', system-ui, -apple-system, sans-serif",
    body: "'Inter', system-ui, -apple-system, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },

  sizes: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
    "6xl": "3.75rem", // 60px
  },

  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export const brandSpacing = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
  "2xl": "3rem", // 48px
  "3xl": "4rem", // 64px
} as const;

export const brandRadius = {
  none: "0",
  sm: "0.375rem", // 6px
  md: "0.5rem", // 8px
  lg: "0.75rem", // 12px
  xl: "1rem", // 16px
  "2xl": "1.5rem", // 24px
  full: "9999px",
} as const;

export const brandShadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
} as const;

// Design principles for reference
export const designPrinciples = {
  layout: "Minimal, clean, no clutter",
  imagery: "Large food photography, high quality",
  buttons: "Rounded, prominent with honey gold background",
  mobile: "Mobile-first approach",
  animations: "Subtle, no flashy or distracting effects",
} as const;

// Usage guidelines
export const colorUsage = {
  buttons: {
    primary: brandColors.honeyGold,
    hover: brandColors.warmOrange,
    text: brandColors.white,
  },
  prices: {
    color: brandColors.warmOrange,
    weight: brandTypography.weights.bold,
  },
  text: {
    primary: brandColors.charcoalBlack,
    secondary: brandColors.gray[600],
    muted: brandColors.gray[500],
  },
  backgrounds: {
    page: brandColors.softCream,
    card: brandColors.white,
    subtle: brandColors.gray[50],
  },
} as const;

export type BrandColors = typeof brandColors;
export type BrandTypography = typeof brandTypography;

// Default export for convenience
export const brand = {
  name: "Honey Foods",
  tagline: "Taste is everything",
  colors: brandColors,
  typography: brandTypography,
  spacing: brandSpacing,
  radius: brandRadius,
  shadows: brandShadows,
  contact: {
    email: "hello@honeyfoods.com",
    phone: "+234 XXX XXX XXXX",
    whatsapp: "+234XXXXXXXXXX",
    address: "Lagos, Nigeria",
  },
  social: {
    instagram: "https://instagram.com/honeyfoods",
    facebook: "https://facebook.com/honeyfoods",
    twitter: "https://twitter.com/honeyfoods",
  },
} as const;
