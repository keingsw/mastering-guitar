/**
 * Spacing System for Musical Interfaces
 * 
 * Based on 8px grid system with musical proportions inspired by
 * guitar neck measurements and fretboard geometry.
 */

// Base unit for consistent spacing (8px)
const baseUnit = 8;

// Core spacing scale - powers of the base unit
export const spacing = {
  0: '0px',
  0.5: `${baseUnit * 0.5}px`,   // 4px
  1: `${baseUnit * 1}px`,       // 8px
  1.5: `${baseUnit * 1.5}px`,   // 12px
  2: `${baseUnit * 2}px`,       // 16px
  2.5: `${baseUnit * 2.5}px`,   // 20px
  3: `${baseUnit * 3}px`,       // 24px
  3.5: `${baseUnit * 3.5}px`,   // 28px
  4: `${baseUnit * 4}px`,       // 32px
  5: `${baseUnit * 5}px`,       // 40px
  6: `${baseUnit * 6}px`,       // 48px
  7: `${baseUnit * 7}px`,       // 56px
  8: `${baseUnit * 8}px`,       // 64px
  9: `${baseUnit * 9}px`,       // 72px
  10: `${baseUnit * 10}px`,     // 80px
  11: `${baseUnit * 11}px`,     // 88px
  12: `${baseUnit * 12}px`,     // 96px
  14: `${baseUnit * 14}px`,     // 112px
  16: `${baseUnit * 16}px`,     // 128px
  20: `${baseUnit * 20}px`,     // 160px
  24: `${baseUnit * 24}px`,     // 192px
  28: `${baseUnit * 28}px`,     // 224px
  32: `${baseUnit * 32}px`,     // 256px
  36: `${baseUnit * 36}px`,     // 288px
  40: `${baseUnit * 40}px`,     // 320px
  44: `${baseUnit * 44}px`,     // 352px
  48: `${baseUnit * 48}px`,     // 384px
  52: `${baseUnit * 52}px`,     // 416px
  56: `${baseUnit * 56}px`,     // 448px
  60: `${baseUnit * 60}px`,     // 480px
  64: `${baseUnit * 64}px`,     // 512px
  72: `${baseUnit * 72}px`,     // 576px
  80: `${baseUnit * 80}px`,     // 640px
  96: `${baseUnit * 96}px`,     // 768px
} as const;

// Musical interface specific spacing
export const musicalSpacing = {
  // Fret spacing - based on guitar neck proportions
  fret: {
    height: spacing[6],        // 48px - comfortable fret height
    width: spacing[12],        // 96px - fret width for touch targets
    gap: spacing[0.5],         // 4px - gap between frets
  },
  
  // String spacing - based on guitar string intervals
  string: {
    gap: spacing[3],           // 24px - space between strings
    thickness: '2px',          // String line thickness
  },
  
  // Note positions on fretboard
  note: {
    size: spacing[11],         // 88px - note circle diameter (44px radius)
    minTouchTarget: spacing[11], // 88px - minimum for accessibility
    padding: spacing[1],       // 8px - padding inside note
  },
  
  // Chord diagram spacing
  chord: {
    diagramWidth: spacing[32],  // 256px - chord diagram width
    diagramHeight: spacing[28], // 224px - chord diagram height
    fingeringGap: spacing[2],   // 16px - gap between fingerings
  },
  
  // Practice interface spacing
  practice: {
    questionGap: spacing[6],    // 48px - space between questions
    answerGap: spacing[4],      // 32px - space between answer options
    timerMargin: spacing[5],    // 40px - timer margin
  },
} as const;

// Component-specific spacing tokens
export const componentSpacing = {
  // Button spacing
  button: {
    paddingX: {
      sm: spacing[3],     // 24px horizontal padding small
      md: spacing[4],     // 32px horizontal padding medium
      lg: spacing[6],     // 48px horizontal padding large
    },
    paddingY: {
      sm: spacing[2],     // 16px vertical padding small
      md: spacing[2.5],   // 20px vertical padding medium
      lg: spacing[3],     // 24px vertical padding large
    },
    gap: spacing[2],      // 16px gap between button elements
  },
  
  // Card spacing
  card: {
    padding: {
      sm: spacing[4],     // 32px small card padding
      md: spacing[6],     // 48px medium card padding
      lg: spacing[8],     // 64px large card padding
    },
    gap: spacing[4],      // 32px gap between cards
    borderRadius: spacing[2], // 16px border radius
  },
  
  // Form elements
  form: {
    fieldGap: spacing[4],       // 32px gap between form fields
    labelGap: spacing[1],       // 8px gap between label and input
    inputPadding: spacing[3],   // 24px input padding
    groupGap: spacing[6],       // 48px gap between form groups
  },
  
  // Navigation
  navigation: {
    itemGap: spacing[1],        // 8px gap between nav items
    sectionGap: spacing[6],     // 48px gap between nav sections
    padding: spacing[4],        // 32px navigation padding
  },
  
  // Layout containers
  layout: {
    containerPadding: {
      mobile: spacing[4],       // 32px mobile container padding
      tablet: spacing[6],       // 48px tablet container padding
      desktop: spacing[8],      // 64px desktop container padding
    },
    sectionGap: {
      sm: spacing[8],           // 64px small section gap
      md: spacing[12],          // 96px medium section gap
      lg: spacing[16],          // 128px large section gap
      xl: spacing[20],          // 160px extra large section gap
    },
    maxWidth: '1200px',         // Maximum container width
  },
} as const;

// Responsive spacing utilities
export const responsiveSpacing = {
  // Breakpoint-specific spacing multipliers
  mobile: {
    multiplier: 0.75,     // 75% of desktop spacing on mobile
    maxSpacing: spacing[16], // Cap spacing at 128px on mobile
  },
  tablet: {
    multiplier: 0.875,    // 87.5% of desktop spacing on tablet
    maxSpacing: spacing[20], // Cap spacing at 160px on tablet
  },
  desktop: {
    multiplier: 1,        // Full spacing on desktop
    maxSpacing: spacing[32], // Cap spacing at 256px on desktop
  },
} as const;

// Grid system for layout
export const grid = {
  // 12-column grid system
  columns: 12,
  gutter: spacing[6],         // 48px gutter between columns
  margin: {
    mobile: spacing[4],       // 32px margin on mobile
    tablet: spacing[6],       // 48px margin on tablet
    desktop: spacing[8],      // 64px margin on desktop
  },
  
  // Container breakpoints
  breakpoints: {
    sm: '640px',    // Small devices
    md: '768px',    // Medium devices
    lg: '1024px',   // Large devices
    xl: '1280px',   // Extra large devices
    '2xl': '1536px', // 2X large devices
  },
  
  // Flexbox utilities
  flex: {
    gap: {
      xs: spacing[1],     // 8px extra small gap
      sm: spacing[2],     // 16px small gap
      md: spacing[4],     // 32px medium gap
      lg: spacing[6],     // 48px large gap
      xl: spacing[8],     // 64px extra large gap
    },
  },
} as const;

// Accessibility spacing
export const accessibilitySpacing = {
  // Minimum spacing for touch targets
  minTouchTarget: '44px',     // iOS/Android guideline
  comfortableTouchTarget: spacing[14], // 112px for comfortable touch
  
  // Focus outline spacing
  focusOffset: spacing[0.5],  // 4px offset for focus outlines
  
  // Reading spacing
  readingGap: spacing[4],     // 32px gap between reading sections
  paragraphGap: spacing[3],   // 24px gap between paragraphs
} as const;

// Animation and transition spacing
export const animationSpacing = {
  // Slide distances
  slideDistance: {
    sm: spacing[4],       // 32px small slide
    md: spacing[8],       // 64px medium slide
    lg: spacing[16],      // 128px large slide
  },
  
  // Parallax offsets
  parallaxOffset: {
    subtle: spacing[2],   // 16px subtle parallax
    medium: spacing[6],   // 48px medium parallax
    dramatic: spacing[12], // 96px dramatic parallax
  },
} as const;

// Utility functions for dynamic spacing
export const spacingUtils = {
  // Convert spacing key to pixel value
  toPx: (key: keyof typeof spacing): number => {
    return parseInt(spacing[key]);
  },
  
  // Generate responsive spacing
  responsive: (
    mobile: keyof typeof spacing,
    tablet?: keyof typeof spacing,
    desktop?: keyof typeof spacing
  ) => ({
    mobile: spacing[mobile],
    tablet: spacing[tablet || mobile],
    desktop: spacing[desktop || tablet || mobile],
  }),
  
  // Create custom spacing from base unit
  custom: (multiplier: number): string => {
    return `${baseUnit * multiplier}px`;
  },
} as const;

// Type definitions
export type SpacingKey = keyof typeof spacing;
export type MusicalSpacingKey = keyof typeof musicalSpacing;
export type ComponentSpacingKey = keyof typeof componentSpacing;
export type ResponsiveSpacing = {
  mobile: string;
  tablet: string;
  desktop: string;
};