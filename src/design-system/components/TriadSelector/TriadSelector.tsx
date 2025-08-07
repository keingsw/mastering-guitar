import React, { useState, useCallback, useMemo, useRef } from 'react';
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
}

// Chromatic notes for the root note picker
const CHROMATIC_NOTES: NoteName[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

// Triad qualities with their interval structures
const TRIAD_QUALITIES: Array<{ value: TriadQuality; label: string; intervals: number[]; symbol: string }> = [
  { value: 'major', label: 'Major', intervals: [0, 4, 7], symbol: '' },
  { value: 'minor', label: 'Minor', intervals: [0, 3, 7], symbol: 'm' },
  { value: 'diminished', label: 'Diminished', intervals: [0, 3, 6], symbol: 'dim' },
  { value: 'augmented', label: 'Augmented', intervals: [0, 4, 8], symbol: 'aug' },
];

// Neck position mappings
const NECK_POSITIONS: Array<{ value: NeckPosition; label: string; fret: number }> = [
  { value: 'open', label: 'Open Position', fret: 0 },
  { value: 'position-3', label: '3rd Position', fret: 3 },
  { value: 'position-5', label: '5th Position', fret: 5 },
  { value: 'position-7', label: '7th Position', fret: 7 },
  { value: 'position-9', label: '9th Position', fret: 9 },
  { value: 'position-12', label: '12th Position', fret: 12 },
];

// Standard guitar tuning for fret position calculations
const STANDARD_TUNING: NoteName[] = ['E', 'A', 'D', 'G', 'B', 'E'];

/**
 * Interactive triad selection interface component for guitar chord education.
 * 
 * Features:
 * - Root note picker with all 12 chromatic notes
 * - Triad quality selector (major, minor, diminished, augmented)
 * - Position chooser for different neck positions
 * - Visual chord chart display using Fretboard component
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
}) => {
  // Component state
  const [selection, setSelection] = useState<TriadSelection>({
    rootNote: initialSelection.rootNote || 'C',
    quality: initialSelection.quality || 'major',
    neckPosition: initialSelection.neckPosition || 'open',
  });

  // Refs for keyboard navigation
  const rootNoteRef = useRef<HTMLFieldSetElement>(null);
  const qualityRef = useRef<HTMLFieldSetElement>(null);
  const positionRef = useRef<HTMLFieldSetElement>(null);

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
    
    // Search for triad notes within reasonable fret range (4 frets around position)
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

  // Keyboard navigation handlers
  const handleKeyDown = useCallback((event: React.KeyboardEvent, field: keyof TriadSelection) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      
      let currentIndex: number;
      let options: readonly any[];
      
      switch (field) {
        case 'rootNote':
          options = CHROMATIC_NOTES;
          currentIndex = CHROMATIC_NOTES.indexOf(selection.rootNote);
          break;
        case 'quality':
          options = TRIAD_QUALITIES;
          currentIndex = TRIAD_QUALITIES.findIndex(q => q.value === selection.quality);
          break;
        case 'neckPosition':
          options = showAdvancedPositions ? NECK_POSITIONS : NECK_POSITIONS.slice(0, 3);
          currentIndex = options.findIndex((pos: any) => pos.value === selection.neckPosition);
          break;
        default:
          return;
      }
      
      const direction = event.key === 'ArrowUp' ? -1 : 1;
      const newIndex = (currentIndex + direction + options.length) % options.length;
      
      if (field === 'rootNote') {
        handleSelectionChange('rootNote', options[newIndex] as NoteName);
      } else if (field === 'quality') {
        handleSelectionChange('quality', (options[newIndex] as any).value);
      } else if (field === 'neckPosition') {
        handleSelectionChange('neckPosition', (options[newIndex] as any).value);
      }
    }
  }, [selection, handleSelectionChange, showAdvancedPositions]);

  // Component ID for ARIA relationships
  const componentId = useMemo(() => `triad-selector-${Math.random().toString(36).substr(2, 9)}`, []);

  return (
    <div 
      className={`triad-selector triad-selector--${size} ${className}`}
      role="application"
      aria-label={ariaLabel || 'Triad selector interface for guitar chords'}
    >
      {/* Screen reader description */}
      <div id={`${componentId}-description`} className="sr-only">
        Interactive triad selector with root note picker, quality selector, and position chooser.
        Use arrow keys to navigate options within each section.
        Current selection: {chordSymbol} in {NECK_POSITIONS.find(pos => pos.value === selection.neckPosition)?.label}.
      </div>

      <div className="triad-selector__controls" aria-describedby={`${componentId}-description`}>
        {/* Root Note Picker */}
        <fieldset 
          ref={rootNoteRef}
          className="triad-selector__section"
          onKeyDown={(e) => handleKeyDown(e, 'rootNote')}
        >
          <legend className="triad-selector__legend">Root Note</legend>
          <div className="triad-selector__options triad-selector__options--notes" role="radiogroup">
            {CHROMATIC_NOTES.map((note, index) => (
              <label 
                key={note}
                className={`triad-selector__option ${selection.rootNote === note ? 'triad-selector__option--selected' : ''}`}
              >
                <input
                  type="radio"
                  name={`${componentId}-root-note`}
                  value={note}
                  checked={selection.rootNote === note}
                  onChange={() => handleSelectionChange('rootNote', note)}
                  className="triad-selector__radio"
                  aria-describedby={`${componentId}-root-note-${index}-description`}
                />
                <span className="triad-selector__label">{note}</span>
                <span id={`${componentId}-root-note-${index}-description`} className="sr-only">
                  {note} {note.includes('#') ? 'sharp' : ''} note
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Triad Quality Selector */}
        <fieldset 
          ref={qualityRef}
          className="triad-selector__section"
          onKeyDown={(e) => handleKeyDown(e, 'quality')}
        >
          <legend className="triad-selector__legend">Triad Quality</legend>
          <div className="triad-selector__options triad-selector__options--qualities" role="radiogroup">
            {TRIAD_QUALITIES.map((quality) => (
              <label 
                key={quality.value}
                className={`triad-selector__option ${selection.quality === quality.value ? 'triad-selector__option--selected' : ''}`}
              >
                <input
                  type="radio"
                  name={`${componentId}-quality`}
                  value={quality.value}
                  checked={selection.quality === quality.value}
                  onChange={() => handleSelectionChange('quality', quality.value)}
                  className="triad-selector__radio"
                  aria-describedby={`${componentId}-quality-${quality.value}-description`}
                />
                <span className="triad-selector__label">{quality.label}</span>
                <span id={`${componentId}-quality-${quality.value}-description`} className="sr-only">
                  {quality.label} triad with intervals: {quality.intervals.join(', ')} semitones
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Position Chooser */}
        <fieldset 
          ref={positionRef}
          className="triad-selector__section"
          onKeyDown={(e) => handleKeyDown(e, 'neckPosition')}
        >
          <legend className="triad-selector__legend">Neck Position</legend>
          <div className="triad-selector__options triad-selector__options--positions" role="radiogroup">
            {(showAdvancedPositions ? NECK_POSITIONS : NECK_POSITIONS.slice(0, 3)).map((position) => (
              <label 
                key={position.value}
                className={`triad-selector__option ${selection.neckPosition === position.value ? 'triad-selector__option--selected' : ''}`}
              >
                <input
                  type="radio"
                  name={`${componentId}-position`}
                  value={position.value}
                  checked={selection.neckPosition === position.value}
                  onChange={() => handleSelectionChange('neckPosition', position.value)}
                  className="triad-selector__radio"
                  aria-describedby={`${componentId}-position-${position.value}-description`}
                />
                <span className="triad-selector__label">{position.label}</span>
                <span id={`${componentId}-position-${position.value}-description`} className="sr-only">
                  {position.label} starting at fret {position.fret}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Current Selection Display */}
      <div className="triad-selector__current" aria-live="polite" aria-atomic="true">
        <h3 className="triad-selector__current-title">Current Selection:</h3>
        <p className="triad-selector__current-chord">
          <strong>{chordSymbol}</strong> chord in {NECK_POSITIONS.find(pos => pos.value === selection.neckPosition)?.label}
        </p>
        <p className="triad-selector__current-notes">
          Notes: {calculateTriadNotes(selection.rootNote, selection.quality).join(' - ')}
        </p>
      </div>

      {/* Visual Chord Chart */}
      <div className="triad-selector__chart">
        <h3 className="triad-selector__chart-title">Chord Chart</h3>
        <Fretboard
          triadPositions={fretPositions}
          chord={chordSymbol}
          neckPosition={NECK_POSITIONS.find(pos => pos.value === selection.neckPosition)?.fret || 0}
          size={size}
          showNoteLabels={true}
          showFretNumbers={true}
          onFretClick={onFretClick}
          aria-label={`${chordSymbol} chord chart showing triad positions`}
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