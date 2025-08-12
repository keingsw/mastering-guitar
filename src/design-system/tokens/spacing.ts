const baseUnit = 8;

export const spacing = {
  0: "0px",
  0.5: `${baseUnit * 0.5}px`,
  1: `${baseUnit * 1}px`,
  1.5: `${baseUnit * 1.5}px`,
  2: `${baseUnit * 2}px`,
  2.5: `${baseUnit * 2.5}px`,
  3: `${baseUnit * 3}px`,
  3.5: `${baseUnit * 3.5}px`,
  4: `${baseUnit * 4}px`,
  5: `${baseUnit * 5}px`,
  6: `${baseUnit * 6}px`,
  7: `${baseUnit * 7}px`,
  8: `${baseUnit * 8}px`,
  9: `${baseUnit * 9}px`,
  10: `${baseUnit * 10}px`,
  11: `${baseUnit * 11}px`,
  12: `${baseUnit * 12}px`,
  14: `${baseUnit * 14}px`,
  16: `${baseUnit * 16}px`,
  20: `${baseUnit * 20}px`,
  24: `${baseUnit * 24}px`,
  28: `${baseUnit * 28}px`,
  32: `${baseUnit * 32}px`,
  36: `${baseUnit * 36}px`,
  40: `${baseUnit * 40}px`,
  44: `${baseUnit * 44}px`,
  48: `${baseUnit * 48}px`,
  52: `${baseUnit * 52}px`,
  56: `${baseUnit * 56}px`,
  60: `${baseUnit * 60}px`,
  64: `${baseUnit * 64}px`,
  72: `${baseUnit * 72}px`,
  80: `${baseUnit * 80}px`,
  96: `${baseUnit * 96}px`,
} as const;

// Musical interface specific spacing
export const musicalSpacing = {
  // Fret spacing - based on guitar neck proportions
  fret: {
    height: spacing[6], // 48px - comfortable fret height
    width: spacing[12], // 96px - fret width for touch targets
    gap: spacing[0.5], // 4px - gap between frets
  },

  // String spacing - based on guitar string intervals
  string: {
    gap: spacing[3], // 24px - space between strings
    thickness: "2px", // String line thickness
  },

  // Note positions on fretboard
  note: {
    size: spacing[11], // 88px - note circle diameter (44px radius)
    minTouchTarget: spacing[11], // 88px - minimum for accessibility
    padding: spacing[1], // 8px - padding inside note
  },

  // Chord diagram spacing
  chord: {
    diagramWidth: spacing[32], // 256px - chord diagram width
    diagramHeight: spacing[28], // 224px - chord diagram height
    fingeringGap: spacing[2], // 16px - gap between fingerings
  },

  // Practice interface spacing
  practice: {
    questionGap: spacing[6], // 48px - space between questions
    answerGap: spacing[4], // 32px - space between answer options
    timerMargin: spacing[5], // 40px - timer margin
  },
} as const;

// Component-specific spacing tokens - Notion style
export const componentSpacing = {
  // Button spacing - Notion's compact style
  button: {
    paddingX: {
      sm: spacing[1], // 8px horizontal padding small
      md: spacing[1.5], // 12px horizontal padding medium
      lg: spacing[2], // 16px horizontal padding large
    },
    paddingY: {
      sm: spacing[0.5], // 4px vertical padding small
      md: spacing[1], // 8px vertical padding medium (Notion style)
      lg: spacing[1], // 8px vertical padding large
    },
    gap: spacing[1], // 8px gap between button elements
  },

  // Card spacing - Notion's clean cards
  card: {
    padding: {
      sm: spacing[2], // 16px small card padding
      md: spacing[3], // 24px medium card padding
      lg: spacing[4], // 32px large card padding
    },
    gap: spacing[3], // 24px gap between cards
    borderRadius: spacing[1], // 8px border radius (Notion style)
  },

  // Form elements - Notion's compact forms
  form: {
    fieldGap: spacing[2.5], // 20px gap between form fields
    labelGap: spacing[1], // 8px gap between label and input
    inputPadding: spacing[1.5], // 12px input padding
    groupGap: spacing[3], // 24px gap between form groups
  },

  // Navigation
  navigation: {
    itemGap: spacing[1], // 8px gap between nav items
    sectionGap: spacing[6], // 48px gap between nav sections
    padding: spacing[4], // 32px navigation padding
  },

  // Layout containers - Notion's spacious layout
  layout: {
    containerPadding: {
      mobile: spacing[3], // 24px mobile container padding
      tablet: spacing[4], // 32px tablet container padding
      desktop: spacing[6], // 48px desktop container padding
    },
    sectionGap: {
      sm: spacing[4], // 32px small section gap
      md: spacing[6], // 48px medium section gap
      lg: spacing[8], // 64px large section gap
      xl: spacing[12], // 96px extra large section gap
    },
    maxWidth: "1200px", // Maximum container width
  },
} as const;

// Responsive spacing utilities
export const responsiveSpacing = {
  // Breakpoint-specific spacing multipliers
  mobile: {
    multiplier: 0.75, // 75% of desktop spacing on mobile
    maxSpacing: spacing[16], // Cap spacing at 128px on mobile
  },
  tablet: {
    multiplier: 0.875, // 87.5% of desktop spacing on tablet
    maxSpacing: spacing[20], // Cap spacing at 160px on tablet
  },
  desktop: {
    multiplier: 1, // Full spacing on desktop
    maxSpacing: spacing[32], // Cap spacing at 256px on desktop
  },
} as const;

// Grid system for layout
export const grid = {
  // 12-column grid system
  columns: 12,
  gutter: spacing[6], // 48px gutter between columns
  margin: {
    mobile: spacing[4], // 32px margin on mobile
    tablet: spacing[6], // 48px margin on tablet
    desktop: spacing[8], // 64px margin on desktop
  },

  // Container breakpoints
  breakpoints: {
    sm: "640px", // Small devices
    md: "768px", // Medium devices
    lg: "1024px", // Large devices
    xl: "1280px", // Extra large devices
    "2xl": "1536px", // 2X large devices
  },

  // Flexbox utilities
  flex: {
    gap: {
      xs: spacing[1], // 8px extra small gap
      sm: spacing[2], // 16px small gap
      md: spacing[4], // 32px medium gap
      lg: spacing[6], // 48px large gap
      xl: spacing[8], // 64px extra large gap
    },
  },
} as const;

// Notion design system spacing
export const notionSpacing = {
  // Notion's exact spacing values
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

// Accessibility spacing - refined for Notion style
export const accessibilitySpacing = {
  // Minimum spacing for touch targets
  minTouchTarget: "36px", // Notion's minimum touch target
  comfortableTouchTarget: "44px", // iOS/Android guideline

  // Focus outline spacing
  focusOffset: spacing[0.5], // 4px offset for focus outlines

  // Reading spacing - Notion's clean reading experience
  readingGap: spacing[3], // 24px gap between reading sections
  paragraphGap: spacing[2.5], // 20px gap between paragraphs
} as const;

// Animation and transition spacing
export const animationSpacing = {
  // Slide distances
  slideDistance: {
    sm: spacing[4], // 32px small slide
    md: spacing[8], // 64px medium slide
    lg: spacing[16], // 128px large slide
  },

  // Parallax offsets
  parallaxOffset: {
    subtle: spacing[2], // 16px subtle parallax
    medium: spacing[6], // 48px medium parallax
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
  responsive: (mobile: keyof typeof spacing, tablet?: keyof typeof spacing, desktop?: keyof typeof spacing) => ({
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
