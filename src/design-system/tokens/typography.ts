/**
 * Typography System - Notion-Inspired Design Language
 *
 * Clean, readable typography system based on Notion's design principles.
 * Optimized for music education content with excellent accessibility.
 */

// Font stacks - Notion's signature typography
export const fontStacks = {
  // Primary font stack - Notion's system fonts
  primary: ["-apple-system", "BlinkMacSystemFont", '"Segoe UI"', '"Helvetica Neue"', "sans-serif"].join(", "),

  // Chord notation font - clean system fonts
  chord: ["-apple-system", "BlinkMacSystemFont", '"Segoe UI"', '"Helvetica Neue"', "sans-serif"].join(", "),

  // Monospace for note names and intervals - Notion style
  mono: [
    '"SFMono-Regular"',
    "Monaco",
    '"Cascadia Code"',
    '"Roboto Mono"',
    "Consolas",
    '"Courier New"',
    "monospace",
  ].join(", "),

  // Display font for headings - same as primary for consistency
  display: ["-apple-system", "BlinkMacSystemFont", '"Segoe UI"', '"Helvetica Neue"', "sans-serif"].join(", "),
} as const;

// Font weights - Notion's weight scale
export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

// Font sizes with fluid scaling
export const fontSizes = {
  // Small sizes for captions and fine print
  xs: {
    size: "0.75rem", // 12px
    lineHeight: "1rem", // 16px
  },
  sm: {
    size: "0.875rem", // 14px
    lineHeight: "1.25rem", // 20px
  },

  // Base size - optimized for reading
  base: {
    size: "1rem", // 16px
    lineHeight: "1.5rem", // 24px
  },

  // Medium sizes for UI elements
  lg: {
    size: "1.125rem", // 18px
    lineHeight: "1.75rem", // 28px
  },
  xl: {
    size: "1.25rem", // 20px
    lineHeight: "1.75rem", // 28px
  },

  // Large sizes for headings
  "2xl": {
    size: "1.5rem", // 24px
    lineHeight: "2rem", // 32px
  },
  "3xl": {
    size: "1.875rem", // 30px
    lineHeight: "2.25rem", // 36px
  },
  "4xl": {
    size: "2.25rem", // 36px
    lineHeight: "2.5rem", // 40px
  },

  // Extra large for display text
  "5xl": {
    size: "3rem", // 48px
    lineHeight: "1", // Tight line height for display
  },
  "6xl": {
    size: "3.75rem", // 60px
    lineHeight: "1", // Tight line height for display
  },
} as const;

// Chord-specific typography
export const chordTypography = {
  // Chord symbol styling (e.g., "Cmaj7", "F#dim")
  symbol: {
    fontSize: fontSizes["2xl"].size,
    lineHeight: fontSizes["2xl"].lineHeight,
    fontFamily: fontStacks.chord,
    fontWeight: fontWeights.semibold,
    letterSpacing: "0.025em",
  },

  // Individual note names (e.g., "C", "F#", "Bb")
  note: {
    fontSize: fontSizes.lg.size,
    lineHeight: fontSizes.lg.lineHeight,
    fontFamily: fontStacks.mono,
    fontWeight: fontWeights.medium,
    letterSpacing: "0.05em",
  },

  // Interval notation (e.g., "P5", "M3", "m7")
  interval: {
    fontSize: fontSizes.base.size,
    lineHeight: fontSizes.base.lineHeight,
    fontFamily: fontStacks.mono,
    fontWeight: fontWeights.regular,
    letterSpacing: "0.1em",
  },

  // Roman numeral analysis (e.g., "I", "vi", "V7")
  roman: {
    fontSize: fontSizes.lg.size,
    lineHeight: fontSizes.lg.lineHeight,
    fontFamily: fontStacks.primary,
    fontWeight: fontWeights.medium,
    letterSpacing: "0.05em",
    fontVariantCaps: "small-caps" as const,
  },
} as const;

// Text styles - Notion's hierarchy
export const textStyles = {
  // Headings - Notion style
  h1: {
    fontSize: fontSizes["3xl"].size,
    lineHeight: fontSizes["3xl"].lineHeight,
    fontFamily: fontStacks.display,
    fontWeight: fontWeights.bold,
    letterSpacing: "-0.01em",
  },
  h2: {
    fontSize: fontSizes["2xl"].size,
    lineHeight: fontSizes["2xl"].lineHeight,
    fontFamily: fontStacks.display,
    fontWeight: fontWeights.semibold,
    letterSpacing: "-0.01em",
  },
  h3: {
    fontSize: fontSizes.xl.size,
    lineHeight: fontSizes.xl.lineHeight,
    fontFamily: fontStacks.primary,
    fontWeight: fontWeights.semibold,
  },
  h4: {
    fontSize: fontSizes.xl.size,
    lineHeight: fontSizes.xl.lineHeight,
    fontFamily: fontStacks.primary,
    fontWeight: fontWeights.medium,
  },
  h5: {
    fontSize: fontSizes.lg.size,
    lineHeight: fontSizes.lg.lineHeight,
    fontFamily: fontStacks.primary,
    fontWeight: fontWeights.medium,
  },
  h6: {
    fontSize: fontSizes.base.size,
    lineHeight: fontSizes.base.lineHeight,
    fontFamily: fontStacks.primary,
    fontWeight: fontWeights.semibold,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },

  // Body text - Notion's clean body style
  body: {
    fontSize: "14px",
    lineHeight: "20px",
    fontFamily: fontStacks.primary,
    fontWeight: fontWeights.regular,
  },
  bodyLarge: {
    fontSize: fontSizes.lg.size,
    lineHeight: fontSizes.lg.lineHeight,
    fontFamily: fontStacks.primary,
    fontWeight: fontWeights.regular,
  },
  bodySmall: {
    fontSize: fontSizes.sm.size,
    lineHeight: fontSizes.sm.lineHeight,
    fontFamily: fontStacks.primary,
    fontWeight: fontWeights.regular,
  },

  // UI elements - Notion button styles
  button: {
    fontSize: "14px",
    lineHeight: "20px",
    fontFamily: fontStacks.primary,
    fontWeight: fontWeights.regular,
    letterSpacing: "0",
  },
  buttonSmall: {
    fontSize: "12px",
    lineHeight: "16px",
    fontFamily: fontStacks.primary,
    fontWeight: fontWeights.regular,
    letterSpacing: "0",
  },
  buttonLarge: {
    fontSize: fontSizes.lg.size,
    lineHeight: fontSizes.lg.lineHeight,
    fontFamily: fontStacks.primary,
    fontWeight: fontWeights.medium,
    letterSpacing: "0.025em",
  },

  // Labels and captions - Notion style
  label: {
    fontSize: "12px",
    lineHeight: "16px",
    fontFamily: fontStacks.primary,
    fontWeight: fontWeights.medium,
    letterSpacing: "0",
  },
  caption: {
    fontSize: "11px",
    lineHeight: "14px",
    fontFamily: fontStacks.primary,
    fontWeight: fontWeights.regular,
  },

  // Code and technical text
  code: {
    fontSize: fontSizes.sm.size,
    lineHeight: fontSizes.sm.lineHeight,
    fontFamily: fontStacks.mono,
    fontWeight: fontWeights.regular,
    letterSpacing: "0.025em",
  },
} as const;

// Notion design system spacing
export const notionSpacing = {
  // Standard spacing scale
  xs: "2px",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "20px",
  "3xl": "24px",
  "4xl": "32px",
  "5xl": "40px",
  "6xl": "48px",
} as const;

// Responsive typography utilities
export const responsiveTypography = {
  // Notion-style responsive scaling
  mobile: {
    fontSize: "14px",
    lineHeight: "20px",
    maxLineLength: "60ch",
  },
  desktop: {
    fontSize: "14px",
    lineHeight: "20px",
    maxLineLength: "65ch",
  },
} as const;

// Accessibility considerations
export const accessibilityFeatures = {
  // Minimum touch target sizes (iOS/Android guidelines)
  minTouchTarget: "44px",

  // Recommended line heights for readability
  readingLineHeight: 1.6,
  uiLineHeight: 1.4,

  // Letter spacing for improved readability
  improvedSpacing: {
    uppercase: "0.1em",
    smallCaps: "0.05em",
    normal: "0",
  },

  // Focus indicators
  focusOutline: {
    width: "2px",
    style: "solid",
    offset: "2px",
  },
} as const;

// Type definitions
export type FontStack = keyof typeof fontStacks;
export type FontWeight = keyof typeof fontWeights;
export type FontSize = keyof typeof fontSizes;
export type TextStyle = keyof typeof textStyles;
export type ChordTypographyStyle = keyof typeof chordTypography;
