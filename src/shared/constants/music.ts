/**
 * Music Theory Constants
 *
 * Centralized constants for music theory calculations and validation
 */

import type { NoteName, TriadQuality } from "../../modules/music-theory/types/music";

// Musical constants
export const MUSIC_CONSTANTS = {
  A4_FREQUENCY: 440,
  SEMITONES_IN_OCTAVE: 12,
  GUITAR_STRINGS: 6,
  MAX_FRET: 24,
  MIN_FRET: 0,
  MIN_OCTAVE: 0,
  MAX_OCTAVE: 9,
} as const;

// Valid note names for validation
export const VALID_NOTE_NAMES: readonly NoteName[] = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

// Valid triad qualities for validation
export const VALID_TRIAD_QUALITIES: readonly TriadQuality[] = ["major", "minor", "diminished", "augmented"] as const;

// Valid difficulty levels for validation
export const VALID_DIFFICULTY_LEVELS = ["beginner", "intermediate", "advanced"] as const;

// Validation functions
export function isValidNoteName(name: unknown): name is NoteName {
  return typeof name === "string" && VALID_NOTE_NAMES.includes(name as NoteName);
}

export function isValidTriadQuality(quality: unknown): quality is TriadQuality {
  return typeof quality === "string" && VALID_TRIAD_QUALITIES.includes(quality as TriadQuality);
}

export function isValidDifficultyLevel(difficulty: unknown): difficulty is "beginner" | "intermediate" | "advanced" {
  return typeof difficulty === "string" && (VALID_DIFFICULTY_LEVELS as readonly string[]).includes(difficulty);
}

export function isValidFretNumber(fret: unknown): fret is number {
  return (
    typeof fret === "number" &&
    Number.isInteger(fret) &&
    fret >= MUSIC_CONSTANTS.MIN_FRET &&
    fret <= MUSIC_CONSTANTS.MAX_FRET
  );
}

export function isValidStringNumber(string: unknown): string is number {
  return (
    typeof string === "number" && Number.isInteger(string) && string >= 1 && string <= MUSIC_CONSTANTS.GUITAR_STRINGS
  );
}

export function isValidOctave(octave: unknown): octave is number {
  return (
    typeof octave === "number" &&
    Number.isInteger(octave) &&
    octave >= MUSIC_CONSTANTS.MIN_OCTAVE &&
    octave <= MUSIC_CONSTANTS.MAX_OCTAVE
  );
}

export function isValidNeckPosition(position: unknown): position is number {
  return (
    typeof position === "number" && Number.isInteger(position) && position >= 0 && position <= MUSIC_CONSTANTS.MAX_FRET
  );
}
