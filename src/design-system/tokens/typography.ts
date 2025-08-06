/**
 * Typography System - Optimized for Music Education
 * 
 * Designed specifically for chord names, music theory notation,
 * and educational content with excellent readability.
 */

// Font stacks optimized for different use cases
export const fontStacks = {
  // Primary font stack - excellent readability for body text
  primary: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(', '),

  // Chord notation font - optimized for musical symbols
  chord: [
    '"SF Pro Display"',
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    'sans-serif',
  ].join(', '),

  // Monospace for note names and intervals
  mono: [
    '"JetBrains Mono"',
    '"Fira Code"',
    '"SF Mono"',
    'Monaco',
    '"Cascadia Code"',
    '"Roboto Mono"',
    'Consolas',
    '"Courier New"',
    'monospace',
  ].join(', '),

  // Display font for headings and branding
  display: [
    '"Inter Display"',
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    'sans-serif',
  ].join(', '),
} as const;

// Font weights
export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

// Font sizes with fluid scaling
export const fontSizes = {
  // Small sizes for captions and fine print
  xs: {
    size: '0.75rem',    // 12px
    lineHeight: '1rem', // 16px
  },
  sm: {
    size: '0.875rem',     // 14px
    lineHeight: '1.25rem', // 20px
  },
  
  // Base size - optimized for reading
  base: {
    size: '1rem',       // 16px
    lineHeight: '1.5rem', // 24px
  },
  
  // Medium sizes for UI elements
  lg: {
    size: '1.125rem',   // 18px
    lineHeight: '1.75rem', // 28px
  },
  xl: {
    size: '1.25rem',    // 20px
    lineHeight: '1.75rem', // 28px
  },
  
  // Large sizes for headings
  '2xl': {
    size: '1.5rem',     // 24px
    lineHeight: '2rem', // 32px
  },
  '3xl': {
    size: '1.875rem',   // 30px
    lineHeight: '2.25rem', // 36px
  },
  '4xl': {
    size: '2.25rem',    // 36px
    lineHeight: '2.5rem', // 40px
  },
  
  // Extra large for display text
  '5xl': {
    size: '3rem',       // 48px
    lineHeight: '1',    // Tight line height for display
  },
  '6xl': {
    size: '3.75rem',    // 60px
    lineHeight: '1',    // Tight line height for display
  },
} as const;

// Chord-specific typography
export const chordTypography = {
  // Chord symbol styling (e.g., "Cmaj7", "F#dim")
  symbol: {
    fontSize: fontSizes['2xl'].size,
    lineHeight: fontSizes['2xl'].lineHeight,
    fontFamily: fontStacks.chord,
    fontWeight: fontWeights.semibold,
    letterSpacing: '0.025em',
  },
  
  // Individual note names (e.g., "C", "F#", "Bb")
  note: {
    fontSize: fontSizes.lg.size,
    lineHeight: fontSizes.lg.lineHeight,
    fontFamily: fontStacks.mono,
    fontWeight: fontWeights.medium,
    letterSpacing: '0.05em',
  },
  
  // Interval notation (e.g., "P5", "M3", "m7")
  interval: {
    fontSize: fontSizes.base.size,
    lineHeight: fontSizes.base.lineHeight,
    fontFamily: fontStacks.mono,
    fontWeight: fontWeights.regular,
    letterSpacing: '0.1em',
  },
  
  // Roman numeral analysis (e.g., "I", "vi", "V7")
  roman: {
    fontSize: fontSizes.lg.size,
    lineHeight: fontSizes.lg.lineHeight,
    fontFamily: fontStacks.primary,
    fontWeight: fontWeights.medium,
    letterSpacing: '0.05em',
    fontVariantCaps: 'small-caps' as const,
  },
} as const;

// Text styles for different contexts
export const textStyles = {
  // Headings
  h1: {
    fontSize: fontSizes['4xl'].size,
    lineHeight: fontSizes['4xl'].lineHeight,
    fontFamily: fontStacks.display,
    fontWeight: fontWeights.bold,
    letterSpacing: '-0.025em',
  },
  h2: {
    fontSize: fontSizes['3xl'].size,
    lineHeight: fontSizes['3xl'].lineHeight,
    fontFamily: fontStacks.display,
    fontWeight: fontWeights.semibold,
    letterSpacing: '-0.025em',
  },
  h3: {
    fontSize: fontSizes['2xl'].size,
    lineHeight: fontSizes['2xl'].lineHeight,
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
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  
  // Body text
  body: {
    fontSize: fontSizes.base.size,
    lineHeight: fontSizes.base.lineHeight,
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
  
  // UI elements
  button: {
    fontSize: fontSizes.base.size,
    lineHeight: fontSizes.base.lineHeight,
    fontFamily: fontStacks.primary,
    fontWeight: fontWeights.medium,
    letterSpacing: '0.025em',
  },
  buttonSmall: {
    fontSize: fontSizes.sm.size,
    lineHeight: fontSizes.sm.lineHeight,
    fontFamily: fontStacks.primary,
    fontWeight: fontWeights.medium,
    letterSpacing: '0.025em',
  },
  buttonLarge: {
    fontSize: fontSizes.lg.size,
    lineHeight: fontSizes.lg.lineHeight,
    fontFamily: fontStacks.primary,
    fontWeight: fontWeights.medium,
    letterSpacing: '0.025em',
  },
  
  // Labels and captions
  label: {
    fontSize: fontSizes.sm.size,
    lineHeight: fontSizes.sm.lineHeight,
    fontFamily: fontStacks.primary,
    fontWeight: fontWeights.medium,
    letterSpacing: '0.025em',
  },
  caption: {
    fontSize: fontSizes.xs.size,
    lineHeight: fontSizes.xs.lineHeight,
    fontFamily: fontStacks.primary,
    fontWeight: fontWeights.regular,
  },
  
  // Code and technical text
  code: {
    fontSize: fontSizes.sm.size,
    lineHeight: fontSizes.sm.lineHeight,
    fontFamily: fontStacks.mono,
    fontWeight: fontWeights.regular,
    letterSpacing: '0.025em',
  },
} as const;

// Responsive typography utilities
export const responsiveTypography = {
  // Scales for different screen sizes
  mobile: {
    scaleDown: 0.875, // 87.5% of desktop size
    maxLineLength: '65ch',
  },
  tablet: {
    scaleDown: 0.9375, // 93.75% of desktop size
    maxLineLength: '70ch',
  },
  desktop: {
    scaleDown: 1, // Full size
    maxLineLength: '75ch',
  },
  
  // Fluid typography for better responsive scaling
  fluid: {
    h1: 'clamp(2rem, 4vw + 1rem, 2.25rem)',
    h2: 'clamp(1.75rem, 3vw + 1rem, 1.875rem)',
    h3: 'clamp(1.5rem, 2.5vw + 1rem, 1.5rem)',
    body: 'clamp(0.875rem, 2vw + 0.5rem, 1rem)',
  },
} as const;

// Accessibility considerations
export const accessibilityFeatures = {
  // Minimum touch target sizes (iOS/Android guidelines)
  minTouchTarget: '44px',
  
  // Recommended line heights for readability
  readingLineHeight: 1.6,
  uiLineHeight: 1.4,
  
  // Letter spacing for improved readability
  improvedSpacing: {
    uppercase: '0.1em',
    smallCaps: '0.05em',
    normal: '0',
  },
  
  // Focus indicators
  focusOutline: {
    width: '2px',
    style: 'solid',
    offset: '2px',
  },
} as const;

// Type definitions
export type FontStack = keyof typeof fontStacks;
export type FontWeight = keyof typeof fontWeights;
export type FontSize = keyof typeof fontSizes;
export type TextStyle = keyof typeof textStyles;
export type ChordTypographyStyle = keyof typeof chordTypography;