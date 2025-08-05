import type { Note } from "../entities/Note";
import type { Interval, IntervalQuality } from "../types/music";

/**
 * Interval calculation utilities for music theory
 */

// Interval names by semitone distance
const INTERVAL_NAMES: Record<number, string> = {
  0: "unison",
  1: "minor second",
  2: "major second",
  3: "minor third",
  4: "major third",
  5: "perfect fourth",
  6: "augmented fourth", // or diminished fifth
  7: "perfect fifth",
  8: "minor sixth",
  9: "major sixth",
  10: "minor seventh",
  11: "major seventh",
  12: "octave",
  13: "minor ninth",
  14: "major ninth",
  15: "minor tenth",
  16: "major tenth",
  17: "perfect eleventh",
  18: "augmented eleventh",
  19: "perfect twelfth",
  20: "minor thirteenth",
  21: "major thirteenth",
};

// Interval qualities by semitone distance
const INTERVAL_QUALITIES: Record<number, IntervalQuality> = {
  0: "perfect", // unison
  1: "minor", // minor second
  2: "major", // major second
  3: "minor", // minor third
  4: "major", // major third
  5: "perfect", // perfect fourth
  6: "augmented", // augmented fourth
  7: "perfect", // perfect fifth
  8: "minor", // minor sixth
  9: "major", // major sixth
  10: "minor", // minor seventh
  11: "major", // major seventh
  12: "perfect", // octave
};

// Consonant intervals (generally pleasing to the ear)
const CONSONANT_INTERVALS = new Set([0, 3, 4, 5, 7, 8, 9, 12]);

export function calculateInterval(from: Note, to: Note): Interval {
  const semitones = from.intervalTo(to);
  const name = getIntervalName(semitones);
  const quality = getIntervalQuality(semitones);

  return {
    semitones,
    name,
    quality,
  };
}

export function getIntervalName(semitones: number): string {
  const normalizedSemitones = ((semitones % 12) + 12) % 12;

  if (semitones >= 12) {
    // Handle compound intervals (beyond octave)
    const octaves = Math.floor(semitones / 12);
    const remainingSemitones = semitones % 12;

    if (remainingSemitones === 0) {
      return octaves === 1 ? "octave" : `${octaves} octaves`;
    }

    return INTERVAL_NAMES[semitones] || `compound ${INTERVAL_NAMES[remainingSemitones]}`;
  }

  return INTERVAL_NAMES[normalizedSemitones] || "unknown interval";
}

export function getIntervalQuality(semitones: number): IntervalQuality {
  const normalizedSemitones = ((semitones % 12) + 12) % 12;
  return INTERVAL_QUALITIES[normalizedSemitones] || "major";
}

export function isConsonant(semitones: number): boolean {
  const normalizedSemitones = ((semitones % 12) + 12) % 12;
  return CONSONANT_INTERVALS.has(normalizedSemitones);
}

/**
 * Invert an interval (turn it upside down)
 * Example: major third (4 semitones) inverts to minor sixth (8 semitones)
 */
export function invertInterval(semitones: number): number {
  const normalizedSemitones = ((semitones % 12) + 12) % 12;

  if (normalizedSemitones === 0 || normalizedSemitones === 12) {
    return 0; // unison and octave invert to unison
  }

  return 12 - normalizedSemitones;
}

export function getAllIntervals(): Interval[] {
  return Array.from({ length: 12 }, (_, semitones) => ({
    semitones,
    name: getIntervalName(semitones),
    quality: getIntervalQuality(semitones),
  }));
}
