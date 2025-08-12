import type React from "react";
import { chordTypography, colors, componentTokens } from "../../tokens";
import {
  type ChordSymbol,
  type ComponentSize,
  type Interval,
  isValidChordSymbol,
  isValidInterval,
  isValidNoteName,
  MusicValidationErrors,
  type NoteName,
} from "../../types/music";

export interface ChordDisplayProps {
  chord: ChordSymbol | string; // Allow string for flexibility but prefer ChordSymbol
  notes?: NoteName[];
  intervals?: Interval[];
  size?: ComponentSize;
  showNotes?: boolean;
  showIntervals?: boolean;
  variant?: "default" | "highlighted" | "muted";
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

// Helper function to format chord symbols with proper superscript styling
const formatChordSymbol = (chord: string) => {
  // Split chord into parts and create React elements
  const parts: (string | { type: "sup"; content: string })[] = [];
  let currentPart = "";

  for (let i = 0; i < chord.length; i++) {
    const char = chord[i];
    if (char === "°" || char === "#" || char === "♭" || char === "♯") {
      if (currentPart) {
        parts.push(currentPart);
        currentPart = "";
      }
      parts.push({ type: "sup", content: char });
    } else {
      currentPart += char;
    }
  }

  if (currentPart) {
    parts.push(currentPart);
  }

  return parts.map((part, index) => {
    if (typeof part === "string") {
      return part;
    }
    return <sup key={`${part.content}-${index}`}>{part.content}</sup>;
  });
};

export const ChordDisplay: React.FC<ChordDisplayProps> = ({
  chord,
  notes = [],
  intervals = [],
  size = "md",
  showNotes = false,
  showIntervals = false,
  variant = "default",
  className,
  style,
  onClick,
}) => {
  // Runtime validation for development safety
  if (process.env.NODE_ENV === "development") {
    if (!isValidChordSymbol(chord)) {
      console.warn(MusicValidationErrors.INVALID_CHORD(chord));
    }

    notes.forEach((note) => {
      if (!isValidNoteName(note)) {
        console.warn(MusicValidationErrors.INVALID_NOTE(note));
      }
    });

    intervals.forEach((interval) => {
      if (!isValidInterval(interval)) {
        console.warn(MusicValidationErrors.INVALID_INTERVAL(interval));
      }
    });
  }
  const sizeStyles = {
    sm: {
      chord: {
        fontSize: "1.25rem",
        lineHeight: "1.5rem",
      },
      notes: {
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
      },
      intervals: {
        fontSize: "0.75rem",
        lineHeight: "1rem",
      },
    },
    md: {
      chord: {
        fontSize: chordTypography.symbol.fontSize, // 1.875rem (2xl)
        lineHeight: chordTypography.symbol.lineHeight,
      },
      notes: {
        fontSize: chordTypography.note.fontSize,
        lineHeight: chordTypography.note.lineHeight,
      },
      intervals: {
        fontSize: chordTypography.interval.fontSize,
        lineHeight: chordTypography.interval.lineHeight,
      },
    },
    lg: {
      chord: {
        fontSize: "2.25rem",
        lineHeight: "2.5rem",
      },
      notes: {
        fontSize: "1.25rem",
        lineHeight: "1.75rem",
      },
      intervals: {
        fontSize: "1rem",
        lineHeight: "1.5rem",
      },
    },
  };

  const variantStyles = {
    default: {
      container: {
        backgroundColor: colors.background.primary,
        borderColor: "rgba(55, 53, 47, 0.16)",
        color: colors.text.primary,
      },
      chord: {
        color: colors.text.primary,
      },
      notes: {
        color: colors.text.secondary,
      },
      intervals: {
        color: colors.text.tertiary,
      },
    },
    highlighted: {
      container: {
        backgroundColor: "rgba(35, 131, 226, 0.08)",
        borderColor: "rgba(35, 131, 226, 0.24)",
        color: colors.text.primary,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      },
      chord: {
        color: colors.primary[700],
      },
      notes: {
        color: colors.primary[600],
      },
      intervals: {
        color: colors.primary[500],
      },
    },
    muted: {
      container: {
        backgroundColor: colors.background.secondary,
        borderColor: "rgba(55, 53, 47, 0.09)",
        color: colors.text.tertiary,
      },
      chord: {
        color: colors.text.tertiary,
      },
      notes: {
        color: colors.text.tertiary,
        opacity: componentTokens.opacity[70],
      },
      intervals: {
        color: colors.text.tertiary,
        opacity: componentTokens.opacity[60],
      },
    },
  };

  const currentColors = variantStyles[variant];

  const containerStyles: React.CSSProperties = {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    borderRadius: "6px",
    border: "1px solid",
    transition: "all 0.15s ease",
    cursor: onClick ? "pointer" : "default",
    minWidth: "100px",
    gap: "8px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
    ...currentColors.container,
  };

  const chordStyles: React.CSSProperties = {
    ...sizeStyles[size].chord,
    ...currentColors.chord,
    margin: 0,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',
    fontWeight: 600,
    letterSpacing: "-0.01em",
    textAlign: "center",
  };

  // Add styles for superscript elements
  const superscriptCSS = `
    .chord-display sup {
      font-size: 0.6em;
      vertical-align: super;
      line-height: 0;
    }
  `;

  const notesStyles: React.CSSProperties = {
    ...sizeStyles[size].notes,
    ...currentColors.notes,
    margin: 0,
    fontFamily: chordTypography.note.fontFamily, // JetBrains Mono
    letterSpacing: chordTypography.note.letterSpacing,
    textAlign: "center",
  };

  const intervalsStyles: React.CSSProperties = {
    ...sizeStyles[size].intervals,
    ...currentColors.intervals,
    margin: 0,
    fontFamily: chordTypography.interval.fontFamily, // JetBrains Mono
    letterSpacing: chordTypography.interval.letterSpacing,
    textAlign: "center",
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
      e.currentTarget.style.backgroundColor = "rgba(55, 53, 47, 0.06)";
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.06)";
      e.currentTarget.style.backgroundColor = currentColors.container.backgroundColor;
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <>
      <style>{superscriptCSS}</style>
      <div
        className={`chord-display ${className || ""}`}
        style={{
          ...containerStyles,
          ...style,
        }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        aria-label={onClick ? `Select ${chord} chord` : undefined}
        onKeyDown={handleKeyDown}
      >
        <div style={chordStyles} aria-label={`Chord: ${chord}`}>
          {formatChordSymbol(chord)}
        </div>

        {showNotes && notes.length > 0 && (
          <div style={notesStyles} role="status" aria-label={`Notes: ${notes.join(", ")}`}>
            {notes.join(" - ")}
          </div>
        )}

        {showIntervals && intervals.length > 0 && (
          <div style={intervalsStyles} role="status" aria-label={`Intervals: ${intervals.join(", ")}`}>
            {intervals.join(" ")}
          </div>
        )}
      </div>
    </>
  );
};
