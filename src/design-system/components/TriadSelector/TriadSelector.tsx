import React, { useState, useCallback, useMemo } from 'react';
import { Fretboard } from '../Fretboard/Fretboard';
import type { FretPosition } from '../Fretboard/Fretboard';
import type { NoteName, ComponentSize, ChordSymbol, HarmonicFunction } from '../../types/music';
import './TriadSelector.css';

// Triad quality types
export type TriadQuality = 'major' | 'minor' | 'diminished' | 'augmented';

// Guitar neck position presets
export type NeckPosition = 'open' | 'position-3' | 'position-5' | 'position-7' | 'position-9' | 'position-12';

// Triad selection state interface
export interface TriadSelection {
  rootNote: NoteName;
  quality: TriadQuality;
  neckPosition: NeckPosition;
}

// Component props interface
export interface TriadSelectorProps {
  /** Initial triad selection */
  initialSelection?: Partial<TriadSelection>;
  /** Component size variant */
  size?: ComponentSize;
  /** Show advanced position options */
  showAdvancedPositions?: boolean;
  /** Callback when triad selection changes */
  onChange?: (selection: TriadSelection) => void;
  /** Callback when a fret is clicked on the chart */
  onFretClick?: (position: FretPosition) => void;
  /** Additional CSS class name */
  className?: string;
  /** ARIA label for accessibility */
  'aria-label'?: string;
  /** Start with expanded note grid visible */
  expandedView?: boolean;
  /** Disable all interactions */
  disabled?: boolean;
}

// Chromatic notes for the root note picker
const CHROMATIC_NOTES: NoteName[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

// Triad qualities with their interval structures
const TRIAD_QUALITIES: Array<{ value: TriadQuality; label: string; intervals: number[]; symbol: string; shortLabel: string }> = [
  { value: 'major', label: 'Major', intervals: [0, 4, 7], symbol: '', shortLabel: 'Maj' },
  { value: 'minor', label: 'Minor', intervals: [0, 3, 7], symbol: 'm', shortLabel: 'Min' },
  { value: 'diminished', label: 'Diminished', intervals: [0, 3, 6], symbol: 'dim', shortLabel: 'Dim' },
  { value: 'augmented', label: 'Augmented', intervals: [0, 4, 8], symbol: 'aug', shortLabel: 'Aug' },
];

// Note: NECK_POSITIONS removed as we no longer show position selector in vertical layout

// Standard guitar tuning for fret position calculations
const STANDARD_TUNING: NoteName[] = ['E', 'A', 'D', 'G', 'B', 'E'];

/**
 * Interactive triad selection interface component for guitar chord education.
 * Features a vertical control sidebar with maximized fretboard visualization.
 * 
 * Features:
 * - Vertical control sidebar on the left
 * - Maximized fretboard visualization (80%+ of component space)
 * - Vertical note grid and quality controls
 * - Full keyboard navigation support
 * - Screen reader accessibility with ARIA labels
 * - WCAG 2.1 AA compliant
 */
export const TriadSelector: React.FC<TriadSelectorProps> = ({
  initialSelection = {},
  size = 'md',
  onChange,
  onFretClick,
  className = '',
  'aria-label': ariaLabel,
  disabled = false,
}) => {
  // Component state - no position selection needed
  const [selection, setSelection] = useState<{ rootNote: NoteName; quality: TriadQuality }>({
    rootNote: initialSelection.rootNote || 'C',
    quality: initialSelection.quality || 'major',
  });

  // Remove compact mode - always show enhanced controls

  // Calculate triad notes from root note and quality
  const calculateTriadNotes = useCallback((rootNote: NoteName, quality: TriadQuality): NoteName[] => {
    const rootIndex = CHROMATIC_NOTES.indexOf(rootNote);
    const qualityData = TRIAD_QUALITIES.find(q => q.value === quality);
    
    if (!qualityData) return [rootNote];
    
    return qualityData.intervals.map(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      return CHROMATIC_NOTES[noteIndex];
    });
  }, []);

  // Calculate fret positions for the current triad across entire fretboard (0-15)
  const fretPositions = useMemo((): FretPosition[] => {
    const triadNotes = calculateTriadNotes(selection.rootNote, selection.quality);
    const positions: FretPosition[] = [];
    
    // Search entire fretboard for triad notes (0-15 frets)
    for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
      // Convert from visual string position (0-5) to tuning array index
      // String 0 (visual top) = tuning[5] (high E)
      // String 4 (5th string) = tuning[1] (A string) 
      // String 5 (visual bottom) = tuning[0] (low E)
      const tuningIndex = (6 - 1) - stringIndex;
      const openStringNote = STANDARD_TUNING[tuningIndex];
      const openStringIndex = CHROMATIC_NOTES.indexOf(openStringNote);
      
      for (let fret = 0; fret <= 15; fret++) {
        const noteIndex = (openStringIndex + fret) % 12;
        const currentNote = CHROMATIC_NOTES[noteIndex];
        
        const triadIndex = triadNotes.indexOf(currentNote);
        if (triadIndex !== -1) {
          const harmonicFunction: HarmonicFunction = 
            triadIndex === 0 ? 'root' :
            triadIndex === 1 ? 'third' : 'fifth';
          
          positions.push({
            fret,
            string: stringIndex + 1,
            note: currentNote,
            function: harmonicFunction,
          });
        }
      }
    }
    
    return positions;
  }, [selection.rootNote, selection.quality, calculateTriadNotes]);

  // Generate chord symbol
  const chordSymbol: ChordSymbol = useMemo(() => {
    const qualityData = TRIAD_QUALITIES.find(q => q.value === selection.quality);
    return `${selection.rootNote}${qualityData?.symbol || ''}` as ChordSymbol;
  }, [selection.rootNote, selection.quality]);

  // Handle selection changes
  const handleSelectionChange = useCallback((
    field: keyof typeof selection,
    value: NoteName | TriadQuality
  ) => {
    const newSelection = { ...selection, [field]: value };
    setSelection(newSelection);
    // Create full selection for onChange callback
    const fullSelection: TriadSelection = { ...newSelection, neckPosition: 'open' };
    onChange?.(fullSelection);
  }, [selection, onChange]);

  const triadNotes = useMemo(() => 
    calculateTriadNotes(selection.rootNote, selection.quality),
    [selection.rootNote, selection.quality, calculateTriadNotes]
  );

  return (
    <div 
      className={`triad-selector triad-selector--${size} triad-selector--vertical ${className}`}
      role="application"
      aria-label={ariaLabel || 'Vertical triad selector with maximized fretboard space'}
    >
      {/* Left Sidebar Controls */}
      <div className="triad-selector__sidebar">
        {/* Current Chord Display */}
        <div className="triad-selector__chord-display">
          <div className="triad-selector__chord-symbol">{chordSymbol}</div>
          <div className="triad-selector__chord-notes">{triadNotes.join(' - ')}</div>
        </div>

        {/* Vertical Controls */}
        <div className="triad-selector__vertical-controls">
          {/* Root Note Selection */}
          <div className="triad-selector__control-section">
            <label className="triad-selector__section-label">Root Note</label>
            <div className="triad-selector__vertical-note-grid" role="radiogroup">
              {CHROMATIC_NOTES.map(note => (
                <button
                  key={note}
                  className={`triad-selector__vertical-note ${
                    selection.rootNote === note ? 'triad-selector__vertical-note--active' : ''
                  }`}
                  onClick={() => handleSelectionChange('rootNote', note)}
                  aria-pressed={selection.rootNote === note}
                  disabled={disabled}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>

          {/* Quality Selection */}
          <div className="triad-selector__control-section">
            <label className="triad-selector__section-label">Quality</label>
            <div className="triad-selector__vertical-quality" role="radiogroup">
              {TRIAD_QUALITIES.map(quality => (
                <button
                  key={quality.value}
                  className={`triad-selector__vertical-quality-btn ${
                    selection.quality === quality.value ? 'triad-selector__vertical-quality-btn--active' : ''
                  }`}
                  onClick={() => handleSelectionChange('quality', quality.value)}
                  aria-pressed={selection.quality === quality.value}
                  disabled={disabled}
                >
                  {quality.shortLabel}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Maximized Fretboard Area */}
      <div className="triad-selector__fretboard-area">
        <Fretboard
          triadPositions={fretPositions}
          chord={chordSymbol}
          neckPosition={0} // Always start from open position
          size="lg" // Always use large size for better visibility
          showNoteLabels={true}
          showFretNumbers={true}
          onFretClick={onFretClick}
          fretCount={15} // Show full 15-fret range
          aria-label={`${chordSymbol} chord positions across entire fretboard (0-15)`}
        />
      </div>
    </div>
  );
};

// Validation in development mode
if (process.env.NODE_ENV === 'development') {
  TriadSelector.displayName = 'TriadSelector';
}

export default TriadSelector;