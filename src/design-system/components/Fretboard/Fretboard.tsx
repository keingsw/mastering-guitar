import React, { useState, useCallback, useMemo } from 'react';
import { colors } from '../../tokens/colors';
import type { NoteName, HarmonicFunction, ComponentSize, ChordSymbol } from '../../types/music';
import './Fretboard.css';

// Standard guitar tuning (6th string to 1st string)
const STANDARD_TUNING: NoteName[] = ['E', 'A', 'D', 'G', 'B', 'E'];

// Chromatic note sequence for fret calculations
const CHROMATIC_NOTES: NoteName[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

// Standard position markers (frets with dots) - extended to 24th fret
const POSITION_MARKERS = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
const DOUBLE_MARKERS = [12, 24];

export interface FretPosition {
  fret: number;
  string: number; // 1-indexed (1 = high E, 6 = low E)
  note: NoteName;
  function?: HarmonicFunction;
}

export interface FretboardProps {
  /** Number of frets to display */
  fretCount?: number;
  /** Number of strings (typically 6 for guitar) */
  stringCount?: number;
  /** Starting fret position (for neck position changes) */
  neckPosition?: number;
  /** Highlighted triad positions */
  triadPositions?: FretPosition[];
  /** Current chord being displayed */
  chord?: ChordSymbol | string;
  /** Show note names on fret positions */
  showNoteLabels?: boolean;
  /** Show fret numbers */
  showFretNumbers?: boolean;
  /** Component size variant */
  size?: ComponentSize;
  /** Custom tuning (defaults to standard tuning) */
  tuning?: NoteName[];
  /** Callback when a fret is clicked */
  onFretClick?: (position: FretPosition) => void;
  /** Additional CSS class name */
  className?: string;
  /** ARIA label for accessibility */
  'aria-label'?: string;
}

/**
 * Interactive SVG guitar fretboard component with clickable frets,
 * triad highlighting, multiple neck positions, and chord visualization.
 * 
 * Features:
 * - Clickable fret positions with hover states
 * - Harmonic function color coding (root, third, fifth)
 * - Multiple neck positions (0-12th fret and beyond)
 * - Responsive design with size variants
 * - WCAG 2.1 AA accessible
 * - Note labeling and chord visualization
 */
export const Fretboard: React.FC<FretboardProps> = ({
  fretCount = 21,
  stringCount = 6,
  neckPosition = 0,
  triadPositions = [],
  chord,
  showNoteLabels = true,
  showFretNumbers = true,
  size = 'md',
  tuning = STANDARD_TUNING,
  onFretClick,
  className = '',
  'aria-label': ariaLabel,
}) => {
  const [hoveredPosition, setHoveredPosition] = useState<string | null>(null);

  // Calculate note at specific fret position
  const calculateNote = useCallback((stringIndex: number, fret: number): NoteName => {
    // Convert from visual string position (0-5) to tuning array index
    // String 0 (visual top) = tuning[5] (high E)
    // String 4 (5th string) = tuning[1] (A string) 
    // String 5 (visual bottom) = tuning[0] (low E)
    const tuningIndex = (stringCount - 1) - stringIndex;
    const openStringNote = tuning[tuningIndex];
    const openStringIndex = CHROMATIC_NOTES.indexOf(openStringNote);
    const noteIndex = (openStringIndex + fret) % 12;
    return CHROMATIC_NOTES[noteIndex];
  }, [tuning, stringCount]);

  // Memoized fret positions for performance
  const fretPositions = useMemo(() => {
    const positions: Array<{ fret: number; string: number; note: NoteName; id: string }> = [];
    
    for (let stringIndex = 0; stringIndex < stringCount; stringIndex++) {
      for (let fret = 0; fret <= fretCount; fret++) {
        const note = calculateNote(stringIndex, fret);
        const stringNum = stringIndex + 1;
        const id = `fret-position-${fret}-${stringNum}`;
        
        positions.push({ fret, string: stringNum, note, id });
      }
    }
    
    return positions;
  }, [fretCount, stringCount, calculateNote]);

  // Find triad position for a specific fret/string combination
  const getTriadFunction = useCallback((fret: number, string: number): HarmonicFunction | null => {
    const position = triadPositions.find(pos => 
      pos.fret === fret && pos.string === string
    );
    return position?.function || null;
  }, [triadPositions]);

  // Handle fret click
  const handleFretClick = useCallback((fret: number, string: number) => {
    if (!onFretClick) return;

    const note = calculateNote(string - 1, fret);
    const harmonicFunction = getTriadFunction(fret, string);
    
    onFretClick({
      fret,
      string,
      note,
      function: harmonicFunction || undefined
    });
  }, [onFretClick, calculateNote, getTriadFunction]);

  // Handle keyboard interaction
  const handleKeyDown = useCallback((event: React.KeyboardEvent, fret: number, string: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleFretClick(fret, string);
    }
  }, [handleFretClick]);

  // SVG dimensions and layout calculations
  const fretWidth = 50; // Fixed narrower width to fit 21 frets comfortably
  const stringSpacing = 20;
  const fretboardWidth = fretCount * fretWidth + 100;
  const fretboardHeight = (stringCount - 1) * stringSpacing + 80;
  const nutWidth = 8;

  // Size-based scaling
  const sizeScale = {
    sm: 0.75,
    md: 1,
    lg: 1.25
  }[size];

  const scaledWidth = fretboardWidth * sizeScale;
  const scaledHeight = fretboardHeight * sizeScale;

  // Get color for harmonic function
  const getFunctionColor = (func: HarmonicFunction): string => {
    switch (func) {
      case 'root':
        return colors.theory.root.DEFAULT;
      case 'third':
        return colors.theory.third.DEFAULT;
      case 'fifth':
        return colors.theory.fifth.DEFAULT;
      default:
        return colors.neutral[400];
    }
  };

  // Get shape for harmonic function (for accessibility and better UX)
  const getFunctionShape = (func: HarmonicFunction): 'circle' | 'triangle' | 'diamond' => {
    switch (func) {
      case 'root':
        return 'circle';
      case 'third':
        return 'triangle';
      case 'fifth':
        return 'diamond';
      default:
        return 'circle';
    }
  };

  // Get text label for harmonic function (new intuitive approach)
  const getFunctionLabel = (func: HarmonicFunction): string => {
    switch (func) {
      case 'root':
        return 'R';
      case 'third':
        return '3';
      case 'fifth':
        return '5';
      default:
        return '';
    }
  };

  const fretboardId = `fretboard-${Math.random().toString(36).substr(2, 9)}`;
  const descriptionId = `${fretboardId}-description`;

  return (
    <div className={`fretboard-container fretboard-container--${size} ${className}`}>
      {/* Screen reader description */}
      <div id={descriptionId} className="sr-only">
        {chord ? `${chord} chord on guitar fretboard` : 'Interactive guitar fretboard'} 
        with {fretCount} frets. 
        {triadPositions.length > 0 && `Showing ${triadPositions.length} highlighted positions.`}
        Use tab to navigate fret positions and enter to select.
      </div>

      {/* Chord display */}
      {chord && (
        <div className="fretboard__chord-display">
          <span className="fretboard__chord-name">{chord}</span>
        </div>
      )}

      {/* Main SVG fretboard */}
      <svg
        className={`fretboard fretboard--${size}`}
        width={scaledWidth}
        height={scaledHeight}
        viewBox={`0 0 ${fretboardWidth} ${fretboardHeight}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-labelledby={descriptionId}
        aria-label={ariaLabel || 'Interactive guitar fretboard'}
        data-neck-position={neckPosition}
      >
        <defs>
          {/* Gradient for fretboard background */}
          <linearGradient id="fretboardGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.background.fretboard} stopOpacity="0.9" />
            <stop offset="100%" stopColor={colors.background.fretboard} stopOpacity="0.7" />
          </linearGradient>

          {/* Drop shadow filter */}
          <filter id="dropShadow">
            <feDropShadow dx="1" dy="1" stdDeviation="1" stopOpacity="0.3" />
          </filter>
        </defs>

        {/* Fretboard background */}
        <rect
          x="40"
          y="20"
          width={fretCount * fretWidth + 20}
          height={(stringCount - 1) * stringSpacing + 20}
          fill="url(#fretboardGradient)"
          rx="4"
          filter="url(#dropShadow)"
        />

        {/* Nut (zero fret) */}
        <rect
          x="40"
          y="20"
          width={nutWidth}
          height={(stringCount - 1) * stringSpacing + 20}
          fill={colors.neutral[800]}
        />

        {/* Fret wires */}
        {Array.from({ length: fretCount }, (_, i) => (
          <line
            key={`fret-${i + 1}`}
            data-testid={`fret-${i + 1}`}
            x1={40 + nutWidth + (i + 1) * fretWidth}
            y1="20"
            x2={40 + nutWidth + (i + 1) * fretWidth}
            y2={20 + (stringCount - 1) * stringSpacing + 20}
            stroke={colors.neutral[600]}
            strokeWidth="2"
          />
        ))}

        {/* Strings */}
        {Array.from({ length: stringCount }, (_, i) => (
          <line
            key={`string-${i + 1}`}
            data-testid={`string-${i + 1}`}
            x1="40"
            y1={30 + i * stringSpacing}
            x2={40 + nutWidth + fretCount * fretWidth + 20}
            y2={30 + i * stringSpacing}
            stroke={colors.background.strings}
            strokeWidth={i < 2 ? "1" : "2"} // Thinner high strings
          />
        ))}

        {/* Position markers */}
        {POSITION_MARKERS.filter(fret => fret <= fretCount + neckPosition && fret > neckPosition).map(fret => {
          const adjustedFret = fret - neckPosition;
          const isDouble = DOUBLE_MARKERS.includes(fret);
          const centerX = 40 + nutWidth + adjustedFret * fretWidth - fretWidth / 2;
          const centerY = 30 + ((stringCount - 1) * stringSpacing) / 2;

          return isDouble ? (
            <g key={`marker-${fret}`} data-testid={`position-marker-${fret}`}>
              <circle
                cx={centerX}
                cy={centerY - 6}
                r="4"
                fill={colors.neutral[300]}
              />
              <circle
                cx={centerX}
                cy={centerY + 6}
                r="4"
                fill={colors.neutral[300]}
              />
            </g>
          ) : (
            <circle
              key={`marker-${fret}`}
              data-testid={`position-marker-${fret}`}
              cx={centerX}
              cy={centerY}
              r="4"
              fill={colors.neutral[300]}
            />
          );
        })}

        {/* Fret numbers */}
        {showFretNumbers && Array.from({ length: fretCount }, (_, i) => {
          const fretNumber = i + 1 + neckPosition;
          return (
            <text
              key={`fret-number-${i + 1}`}
              x={40 + nutWidth + (i + 1) * fretWidth - fretWidth / 2}
              y="15"
              textAnchor="middle"
              fontSize="12"
              fill={colors.text.secondary}
              className="fretboard__fret-number"
            >
              {fretNumber}
            </text>
          );
        })}

        {/* Clickable fret positions */}
        {fretPositions.map(({ fret, string, note, id }) => {
          const x = 40 + nutWidth + fret * fretWidth - fretWidth / 2;
          const y = 30 + (string - 1) * stringSpacing;
          const harmonicFunction = getTriadFunction(fret, string);
          const isHovered = hoveredPosition === id;
          const isHighlighted = harmonicFunction !== null;

          return (
            <g key={id} data-testid={id}>
              {/* Clickable area */}
              <circle
                cx={x}
                cy={y}
                r="8"
                fill="transparent"
                className={`fret-position ${isHovered ? 'fret-position--hover' : ''}`}
                data-function={harmonicFunction}
                tabIndex={0}
                role="button"
                aria-label={`Fret ${fret}, string ${string}, note ${note}${harmonicFunction ? `, ${harmonicFunction}` : ''}`}
                onMouseEnter={() => setHoveredPosition(id)}
                onMouseLeave={() => setHoveredPosition(null)}
                onClick={() => handleFretClick(fret, string)}
                onKeyDown={(e) => handleKeyDown(e, fret, string)}
              />

              {/* Enhanced visual indicator for highlighted positions */}
              {isHighlighted && (
                <g className="fret-position__indicator" pointerEvents="none">
                  {/* Background circle with function color */}
                  <circle
                    cx={x}
                    cy={y}
                    r="8"
                    fill={colors.background.primary}
                    stroke={getFunctionColor(harmonicFunction!)}
                    strokeWidth="2"
                    opacity="0.95"
                  />
                  
                  {/* Harmonic function label - clear but not too large */}
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="10"
                    fontWeight="bold"
                    fill={colors.text.primary}
                    className="fret-position__function-label"
                  >
                    {getFunctionLabel(harmonicFunction!)}
                  </text>
                </g>
              )}

              {/* Hover feedback */}
              {isHovered && (
                <circle
                  cx={x}
                  cy={y}
                  r="10"
                  fill={colors.interactive.hover}
                  className="fret-position__hover-indicator"
                  pointerEvents="none"
                />
              )}

              {/* Note labels on hover for all positions */}
              {showNoteLabels && isHovered && (
                <g pointerEvents="none">
                  {/* Subtle background */}
                  <rect
                    x={x - 8}
                    y={y - 6}
                    width="16"
                    height="12"
                    rx="2"
                    fill={colors.background.secondary}
                    fillOpacity="0.8"
                  />
                  
                  {/* Note name on hover */}
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="11"
                    fontWeight="500"
                    fill={colors.text.secondary}
                    className="fret-position__note-label fret-position__note-label--hover"
                  >
                    {note}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Validation in development mode
if (process.env.NODE_ENV === 'development') {
  Fretboard.displayName = 'Fretboard';
}

export default Fretboard;