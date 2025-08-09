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

// Neck position mappings
const NECK_POSITIONS: Array<{ value: NeckPosition; label: string; fret: number; shortLabel: string }> = [
  { value: 'open', label: 'Open Position', fret: 0, shortLabel: 'Open' },
  { value: 'position-3', label: '3rd Position', fret: 3, shortLabel: '3rd' },
  { value: 'position-5', label: '5th Position', fret: 5, shortLabel: '5th' },
  { value: 'position-7', label: '7th Position', fret: 7, shortLabel: '7th' },
  { value: 'position-9', label: '9th Position', fret: 9, shortLabel: '9th' },
  { value: 'position-12', label: '12th Position', fret: 12, shortLabel: '12th' },
];

// Standard guitar tuning for fret position calculations
const STANDARD_TUNING: NoteName[] = ['E', 'A', 'D', 'G', 'B', 'E'];

/**
 * Interactive triad selection interface component for guitar chord education.
 * Features a compact control bar with maximized fretboard visualization.
 * 
 * Features:
 * - Compact controls with dropdown and button groups
 * - Large fretboard visualization (85% of component space)
 * - Optional expandable note grid for detailed selection
 * - Full keyboard navigation support
 * - Screen reader accessibility with ARIA labels
 * - WCAG 2.1 AA compliant
 */
export const TriadSelector: React.FC<TriadSelectorProps> = ({
  initialSelection = {},
  size = 'md',
  showAdvancedPositions = false,
  onChange,
  onFretClick,
  className = '',
  'aria-label': ariaLabel,
  expandedView = false,
  disabled = false,
}) => {
  // Component state
  const [selection, setSelection] = useState<TriadSelection>({
    rootNote: initialSelection.rootNote || 'C',
    quality: initialSelection.quality || 'major',
    neckPosition: initialSelection.neckPosition || 'open',
  });

  const [isCompactMode, setIsCompactMode] = useState(!expandedView);

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

  // Calculate fret positions for the current triad
  const fretPositions = useMemo((): FretPosition[] => {
    const triadNotes = calculateTriadNotes(selection.rootNote, selection.quality);
    const positions: FretPosition[] = [];
    const neckFret = NECK_POSITIONS.find(pos => pos.value === selection.neckPosition)?.fret || 0;
    
    // Search for triad notes within reasonable fret range
    const searchRange = { min: Math.max(0, neckFret - 2), max: neckFret + 5 };
    
    for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
      const openStringNote = STANDARD_TUNING[stringIndex];
      const openStringIndex = CHROMATIC_NOTES.indexOf(openStringNote);
      
      for (let fret = searchRange.min; fret <= searchRange.max; fret++) {
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
  }, [selection, calculateTriadNotes]);

  // Generate chord symbol
  const chordSymbol: ChordSymbol = useMemo(() => {
    const qualityData = TRIAD_QUALITIES.find(q => q.value === selection.quality);
    return `${selection.rootNote}${qualityData?.symbol || ''}` as ChordSymbol;
  }, [selection.rootNote, selection.quality]);

  // Handle selection changes
  const handleSelectionChange = useCallback((
    field: keyof TriadSelection,
    value: NoteName | TriadQuality | NeckPosition
  ) => {
    const newSelection = { ...selection, [field]: value };
    setSelection(newSelection);
    onChange?.(newSelection);
  }, [selection, onChange]);

  const triadNotes = useMemo(() => 
    calculateTriadNotes(selection.rootNote, selection.quality),
    [selection.rootNote, selection.quality, calculateTriadNotes]
  );

  return (
    <div 
      className={`triad-selector triad-selector--${size} ${isCompactMode ? 'triad-selector--collapsed' : ''} ${className}`}
      role="application"
      aria-label={ariaLabel || 'Triad selector with large fretboard visualization'}
    >
      {/* Compact Control Bar */}
      <div className="triad-selector__controls">
        <div className="triad-selector__control-group">
          {/* Chord Display */}
          <div className="triad-selector__chord-display">
            <span className="triad-selector__chord-symbol">{chordSymbol}</span>
            <span className="triad-selector__chord-notes">{triadNotes.join(' - ')}</span>
          </div>

          {/* Compact Selectors */}
          <div className="triad-selector__selectors">
            {/* Root Note Selector - Dropdown Style */}
            <div className="triad-selector__selector">
              <label className="triad-selector__label">Root</label>
              <select 
                className="triad-selector__select"
                value={selection.rootNote}
                onChange={(e) => handleSelectionChange('rootNote', e.target.value as NoteName)}
                aria-label="Root note"
                disabled={disabled}
              >
                {CHROMATIC_NOTES.map(note => (
                  <option key={note} value={note}>{note}</option>
                ))}
              </select>
            </div>

            {/* Quality Selector - Button Group */}
            <div className="triad-selector__selector">
              <label className="triad-selector__label">Quality</label>
              <div className="triad-selector__button-group" role="radiogroup">
                {TRIAD_QUALITIES.map(quality => (
                  <button
                    key={quality.value}
                    className={`triad-selector__button ${selection.quality === quality.value ? 'triad-selector__button--active' : ''}`}
                    onClick={() => handleSelectionChange('quality', quality.value)}
                    aria-pressed={selection.quality === quality.value}
                    aria-label={quality.label}
                    disabled={disabled}
                  >
                    {quality.shortLabel}
                  </button>
                ))}
              </div>
            </div>

            {/* Position Selector - Compact Pills */}
            <div className="triad-selector__selector">
              <label className="triad-selector__label">Position</label>
              <div className="triad-selector__pills" role="radiogroup">
                {(showAdvancedPositions ? NECK_POSITIONS : NECK_POSITIONS.slice(0, 3)).map(position => (
                  <button
                    key={position.value}
                    className={`triad-selector__pill ${selection.neckPosition === position.value ? 'triad-selector__pill--active' : ''}`}
                    onClick={() => handleSelectionChange('neckPosition', position.value)}
                    aria-pressed={selection.neckPosition === position.value}
                    aria-label={position.label}
                    disabled={disabled}
                  >
                    {position.shortLabel}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* View Toggle */}
          <button
            className="triad-selector__toggle"
            onClick={() => setIsCompactMode(!isCompactMode)}
            aria-label={isCompactMode ? 'Expand controls' : 'Collapse controls'}
            disabled={disabled}
          >
            {isCompactMode ? '⋮' : '×'}
          </button>
        </div>
      </div>

      {/* Expanded Controls (when not in compact mode) */}
      {!isCompactMode && (
        <div className="triad-selector__expanded">
          <div className="triad-selector__note-grid">
            <span className="triad-selector__expanded-label">Select Root Note:</span>
            <div className="triad-selector__notes">
              {CHROMATIC_NOTES.map(note => (
                <button
                  key={note}
                  className={`triad-selector__note ${selection.rootNote === note ? 'triad-selector__note--active' : ''}`}
                  onClick={() => handleSelectionChange('rootNote', note)}
                  aria-pressed={selection.rootNote === note}
                  disabled={disabled}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Large Fretboard Visualization */}
      <div className="triad-selector__fretboard">
        <Fretboard
          triadPositions={fretPositions}
          chord={chordSymbol}
          neckPosition={NECK_POSITIONS.find(pos => pos.value === selection.neckPosition)?.fret || 0}
          size="lg" // Always use large size for better visibility
          showNoteLabels={true}
          showFretNumbers={true}
          onFretClick={onFretClick}
          fretCount={15} // Show more frets for better context
          aria-label={`${chordSymbol} chord visualization on fretboard`}
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