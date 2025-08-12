/**
 * Design System Tokens - Main Entry Point
 *
 * Exports all design tokens and provides utilities for component development.
 * This is the single source of truth for all design system values.
 */

import { colors } from "./colors";
import { spacing } from "./spacing";

export { type ColorPath, type ColorToken, colors, getContrastColor, wcagCompliance } from "./colors";
export {
  accessibilitySpacing,
  animationSpacing,
  type ComponentSpacingKey,
  componentSpacing,
  grid,
  type MusicalSpacingKey,
  musicalSpacing,
  type ResponsiveSpacing,
  responsiveSpacing,
  type SpacingKey,
  spacing,
  spacingUtils,
} from "./spacing";
export {
  accessibilityFeatures,
  type ChordTypographyStyle,
  chordTypography,
  type FontSize,
  type FontStack,
  type FontWeight,
  fontSizes,
  fontStacks,
  fontWeights,
  responsiveTypography,
  type TextStyle,
  textStyles,
} from "./typography";

// Component-specific tokens
export const componentTokens = {
  // Border radius scale
  borderRadius: {
    none: "0",
    xs: "2px",
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    "2xl": "20px",
    "3xl": "24px",
    full: "9999px",
  },

  // Shadow scale for depth
  shadows: {
    none: "none",
    xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",

    // Musical-specific shadows
    fretboard: "0 2px 8px rgba(139, 90, 60, 0.3)", // Warm wood shadow
    note: "0 2px 4px rgba(0, 0, 0, 0.2)", // Note position shadow
    chord: "0 4px 12px rgba(0, 0, 0, 0.15)", // Chord diagram shadow
  },

  // Z-index scale for layering
  zIndex: {
    hide: -1,
    auto: "auto",
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },

  // Animation durations and easing
  animation: {
    duration: {
      fast: "150ms",
      normal: "250ms",
      slow: "350ms",
      slower: "500ms",
    },
    easing: {
      linear: "linear",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      easeOut: "cubic-bezier(0, 0, 0.2, 1)",
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      // Musical easing for audio-visual sync
      musical: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    },
  },

  // Breakpoints for responsive design
  breakpoints: {
    xs: "480px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // Opacity scale
  opacity: {
    0: "0",
    5: "0.05",
    10: "0.1",
    20: "0.2",
    25: "0.25",
    30: "0.3",
    40: "0.4",
    50: "0.5",
    60: "0.6",
    70: "0.7",
    75: "0.75",
    80: "0.8",
    90: "0.9",
    95: "0.95",
    100: "1",
  },
} as const;

// Theme tokens for dark/light mode support
export const themeTokens = {
  light: {
    background: {
      primary: "#ffffff",
      secondary: "#fafaf9",
      tertiary: "#f5f5f4",
    },
    surface: {
      primary: "#ffffff",
      secondary: "#f5f5f4",
      elevated: "#ffffff",
    },
    border: {
      primary: "#e7e5e4",
      secondary: "#d6d3d1",
      interactive: "#a8a29e",
    },
    text: {
      primary: "#1c1917",
      secondary: "#44403c",
      tertiary: "#57534e",
      inverse: "#ffffff",
    },
  },
  dark: {
    background: {
      primary: "#0c0a09",
      secondary: "#1c1917",
      tertiary: "#292524",
    },
    surface: {
      primary: "#1c1917",
      secondary: "#292524",
      elevated: "#44403c",
    },
    border: {
      primary: "#44403c",
      secondary: "#57534e",
      interactive: "#78716c",
    },
    text: {
      primary: "#fafaf9",
      secondary: "#e7e5e4",
      tertiary: "#d6d3d1",
      inverse: "#1c1917",
    },
  },
} as const;

// Semantic tokens for consistent meaning
export const semanticTokens = {
  interactive: {
    primary: {
      default: "#ed7027",
      hover: "#de5a1b",
      active: "#b84518",
      disabled: "#e7e5e4",
    },
    secondary: {
      default: "#f5f5f4",
      hover: "#e7e5e4",
      active: "#d6d3d1",
      disabled: "#fafaf9",
    },
  },

  feedback: {
    success: {
      background: "#dcfce7",
      border: "#bbf7d0",
      text: "#166534",
      icon: "#16a34a",
    },
    warning: {
      background: "#fef3c7",
      border: "#fde68a",
      text: "#92400e",
      icon: "#d97706",
    },
    error: {
      background: "#fecaca",
      border: "#fca5a5",
      text: "#991b1b",
      icon: "#dc2626",
    },
    info: {
      background: "#dbeafe",
      border: "#93c5fd",
      text: "#1e3a8a",
      icon: "#2563eb",
    },
  },

  musical: {
    fretboard: {
      wood: "#8b5a3c",
      frets: "#c0c0c0",
      inlays: "#f5f5dc",
    },
    strings: {
      steel: "#c0c0c0",
      highlight: "#ffd700",
    },
    notes: {
      natural: "#ffffff",
      sharp: "#f0f0f0",
      flat: "#f0f0f0",
    },
  },
} as const;

// CSS Custom Properties generator
export const generateCSSCustomProperties = () => {
  const cssVars: Record<string, string> = {};

  // Generate color variables
  Object.entries(colors).forEach(([category, colorGroup]) => {
    if (typeof colorGroup === "object") {
      Object.entries(colorGroup).forEach(([shade, value]) => {
        if (typeof value === "string") {
          cssVars[`--color-${category}-${shade}`] = value;
        } else if (typeof value === "object") {
          Object.entries(value).forEach(([subShade, subValue]) => {
            cssVars[`--color-${category}-${shade}-${subShade}`] = subValue as string;
          });
        }
      });
    }
  });

  // Generate spacing variables
  Object.entries(spacing).forEach(([key, value]) => {
    cssVars[`--spacing-${key}`] = value as string;
  });

  // Generate component tokens
  Object.entries(componentTokens).forEach(([category, tokens]) => {
    if (typeof tokens === "object") {
      Object.entries(tokens).forEach(([key, value]) => {
        if (typeof value === "string") {
          cssVars[`--${category}-${key}`] = value;
        }
      });
    }
  });

  return cssVars;
};

// Utility function to create CSS custom property references
export const cssVar = (property: string, fallback?: string): string => {
  return fallback ? `var(--${property}, ${fallback})` : `var(--${property})`;
};

// Type exports
export type ComponentTokens = typeof componentTokens;
export type ThemeTokens = typeof themeTokens;
export type SemanticTokens = typeof semanticTokens;
