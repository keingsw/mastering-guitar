import React from 'react';
import { colors, chordTypography, spacing, componentTokens } from '../../tokens';
import { 
  ChordSymbol, 
  NoteName, 
  Interval,
  ComponentSize, 
  isValidChordSymbol, 
  isValidNoteName,
  isValidInterval,
  MusicValidationErrors 
} from '../../types/music';

export interface ChordDisplayProps {
  chord: ChordSymbol | string; // Allow string for flexibility but prefer ChordSymbol
  notes?: NoteName[];
  intervals?: Interval[];
  size?: ComponentSize;
  showNotes?: boolean;
  showIntervals?: boolean;
  variant?: 'default' | 'highlighted' | 'muted';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const ChordDisplay: React.FC<ChordDisplayProps> = ({
  chord,
  notes = [],
  intervals = [],
  size = 'md',
  showNotes = false,
  showIntervals = false,
  variant = 'default',
  className,
  style,
  onClick,
}) => {
  // Runtime validation for development safety
  if (process.env.NODE_ENV === 'development') {
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
        fontSize: '1.25rem',
        lineHeight: '1.5rem',
      },
      notes: {
        fontSize: '0.875rem',
        lineHeight: '1.25rem',
      },
      intervals: {
        fontSize: '0.75rem',
        lineHeight: '1rem',
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
        fontSize: '2.25rem',
        lineHeight: '2.5rem',
      },
      notes: {
        fontSize: '1.25rem',
        lineHeight: '1.75rem',
      },
      intervals: {
        fontSize: '1rem',
        lineHeight: '1.5rem',
      },
    },
  };

  const variantStyles = {
    default: {
      container: {
        backgroundColor: colors.background.tertiary, // #f5f5f4
        borderColor: colors.neutral[300],
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
        backgroundColor: colors.primary[50], // #fef7ed
        borderColor: colors.primary[300],
        color: colors.text.primary,
        boxShadow: componentTokens.shadows.chord, // 0 4px 12px rgba(0, 0, 0, 0.15)
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
        backgroundColor: colors.neutral[100], // #f5f5f4
        borderColor: colors.neutral[200],
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
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[4], // 32px
    borderRadius: componentTokens.borderRadius.lg, // 12px
    border: '1px solid',
    transition: `all ${componentTokens.animation.duration.fast} ${componentTokens.animation.easing.easeOut}`,
    cursor: onClick ? 'pointer' : 'default',
    minWidth: '120px',
    gap: spacing[2], // 16px
    ...currentColors.container,
  };

  const chordStyles: React.CSSProperties = {
    ...sizeStyles[size].chord,
    ...currentColors.chord,
    margin: 0,
    fontFamily: chordTypography.symbol.fontFamily,
    fontWeight: chordTypography.symbol.fontWeight, // 600 (semibold)
    letterSpacing: chordTypography.symbol.letterSpacing,
    textAlign: 'center',
  };

  const notesStyles: React.CSSProperties = {
    ...sizeStyles[size].notes,
    ...currentColors.notes,
    margin: 0,
    fontFamily: chordTypography.note.fontFamily, // JetBrains Mono
    letterSpacing: chordTypography.note.letterSpacing,
    textAlign: 'center',
  };

  const intervalsStyles: React.CSSProperties = {
    ...sizeStyles[size].intervals,
    ...currentColors.intervals,
    margin: 0,
    fontFamily: chordTypography.interval.fontFamily, // JetBrains Mono
    letterSpacing: chordTypography.interval.letterSpacing,
    textAlign: 'center',
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = componentTokens.shadows.md; // 0 4px 6px -1px rgba(0, 0, 0, 0.1)
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      e.currentTarget.style.transform = '';
      e.currentTarget.style.boxShadow = currentColors.container.boxShadow || '';
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={className}
      style={{
        ...containerStyles,
        ...style,
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `Select ${chord} chord` : undefined}
      onKeyDown={handleKeyDown}
    >
      <div style={chordStyles} aria-label={`Chord: ${chord}`}>
        {chord}
      </div>

      {showNotes && notes.length > 0 && (
        <div style={notesStyles} aria-label={`Notes: ${notes.join(', ')}`}>
          {notes.join(' - ')}
        </div>
      )}

      {showIntervals && intervals.length > 0 && (
        <div style={intervalsStyles} aria-label={`Intervals: ${intervals.join(', ')}`}>
          {intervals.join(' ')}
        </div>
      )}
    </div>
  );
};