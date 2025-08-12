/**
 * Strict TypeScript types for music-related components
 * Ensures type safety and prevents invalid prop values at compile time
 */

// Musical note names with enharmonic equivalents
export type NoteName =
  | "C"
  | "C#"
  | "Db"
  | "D"
  | "D#"
  | "Eb"
  | "E"
  | "F"
  | "F#"
  | "Gb"
  | "G"
  | "G#"
  | "Ab"
  | "A"
  | "A#"
  | "Bb"
  | "B";

// Common chord qualities
export type ChordQuality =
  | "maj"
  | "major"
  | "" // Major chords
  | "m"
  | "min"
  | "minor" // Minor chords
  | "dim"
  | "°" // Diminished
  | "aug"
  | "+" // Augmented
  | "sus2"
  | "sus4" // Suspended
  | "7"
  | "maj7"
  | "m7" // Sevenths
  | "dim7"
  | "aug7" // Extended diminished/augmented
  | "9"
  | "maj9"
  | "m9" // Ninths
  | "11"
  | "13"; // Extensions

// Simplified triad qualities for practice exercises
export type TriadQuality = "major" | "minor" | "diminished" | "augmented";

// Chord symbol patterns (note + quality)
export type ChordSymbol = `${NoteName}${ChordQuality}`;

// Musical intervals
export type Interval =
  | "R" // Root
  | "m2" // Minor 2nd
  | "M2" // Major 2nd
  | "m3" // Minor 3rd
  | "M3" // Major 3rd
  | "P4" // Perfect 4th
  | "TT" // Tritone
  | "b5" // Diminished 5th
  | "P5" // Perfect 5th
  | "m6" // Minor 6th
  | "M6" // Major 6th
  | "m7" // Minor 7th
  | "M7" // Major 7th
  | "P8"; // Octave

// Harmonic functions for color coding
export type HarmonicFunction = "root" | "third" | "fifth";

// Component size variants
export type ComponentSize = "sm" | "md" | "lg";

// Validation utilities
export const isValidNoteName = (note: string): note is NoteName => {
  const validNotes: NoteName[] = [
    "C",
    "C#",
    "Db",
    "D",
    "D#",
    "Eb",
    "E",
    "F",
    "F#",
    "Gb",
    "G",
    "G#",
    "Ab",
    "A",
    "A#",
    "Bb",
    "B",
  ];
  return validNotes.includes(note as NoteName);
};

export const isValidChordSymbol = (chord: string): chord is ChordSymbol => {
  // Basic chord symbol validation pattern
  const chordPattern = /^[A-G][#b]?(maj|major|m|min|minor|dim|°|aug|\+|sus[24]|7|maj7|m7|dim7|aug7|9|maj9|m9|11|13)?$/;
  return chordPattern.test(chord);
};

export const isValidInterval = (interval: string): interval is Interval => {
  const validIntervals: Interval[] = ["R", "m2", "M2", "m3", "M3", "P4", "TT", "P5", "m6", "M6", "m7", "M7", "P8"];
  return validIntervals.includes(interval as Interval);
};

// Normalize enharmonic equivalents
export const normalizeNoteName = (note: NoteName): NoteName => {
  const enharmonicMap: Record<string, NoteName> = {
    Db: "C#",
    Eb: "D#",
    Gb: "F#",
    Ab: "G#",
    Bb: "A#",
  };
  return enharmonicMap[note] || note;
};

// Error messages for invalid props
export const MusicValidationErrors = {
  INVALID_NOTE: (note: string) =>
    `Invalid note name: "${note}". Must be one of: C, C#, Db, D, D#, Eb, E, F, F#, Gb, G, G#, Ab, A, A#, Bb, B`,
  INVALID_CHORD: (chord: string) =>
    `Invalid chord symbol: "${chord}". Must follow pattern: NoteName + Quality (e.g., "Cmaj7", "Am", "F#dim")`,
  INVALID_INTERVAL: (interval: string) =>
    `Invalid interval: "${interval}". Must be one of: R, m2, M2, m3, M3, P4, TT, P5, m6, M6, m7, M7, P8`,
  INVALID_FUNCTION: (fn: string) => `Invalid harmonic function: "${fn}". Must be one of: root, third, fifth`,
} as const;

export type MusicValidationError = keyof typeof MusicValidationErrors;
