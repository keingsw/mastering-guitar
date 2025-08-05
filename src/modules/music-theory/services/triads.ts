import { Note } from "../entities/Note";
import type { NoteName, Triad, TriadQuality } from "../types/music";

/**
 * Triad generation utilities for music theory
 */

// Triad patterns defined by semitone intervals from root
const TRIAD_PATTERNS: Record<TriadQuality, number[]> = {
  major: [0, 4, 7], // Root, Major 3rd, Perfect 5th
  minor: [0, 3, 7], // Root, Minor 3rd, Perfect 5th
  diminished: [0, 3, 6], // Root, Minor 3rd, Diminished 5th
  augmented: [0, 4, 8], // Root, Major 3rd, Augmented 5th
};

// Chord symbols for each triad quality
const TRIAD_SYMBOLS: Record<TriadQuality, string> = {
  major: "", // C (no symbol for major)
  minor: "m", // Cm
  diminished: "°", // C°
  augmented: "+", // C+
};

// All 12 chromatic note names
const ALL_NOTE_NAMES: NoteName[] = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function generateTriad(root: Note, quality: TriadQuality): Triad {
  const pattern = TRIAD_PATTERNS[quality];
  const symbol = TRIAD_SYMBOLS[quality];

  const third = root.addSemitones(pattern[1]);
  const fifth = root.addSemitones(pattern[2]);

  return {
    root,
    third,
    fifth,
    quality,
    symbol: `${root.name}${symbol}`,
  };
}

export function getTriadPattern(quality: TriadQuality): number[] {
  return [...TRIAD_PATTERNS[quality]];
}

export function getAllTriads(quality: TriadQuality): Triad[] {
  return ALL_NOTE_NAMES.map((noteName) => {
    const root = new Note(noteName);
    return generateTriad(root, quality);
  });
}

export function getAllTriadQualities(): TriadQuality[] {
  return ["major", "minor", "diminished", "augmented"];
}

/**
 * Check if a set of notes forms a triad of any quality
 */
export function identifyTriad(notes: Note[]): Triad | null {
  if (notes.length !== 3) return null;

  // Sort notes by semitone value to find the most likely root
  const sortedNotes = [...notes].sort((a, b) => a.semitoneValue() - b.semitoneValue());

  // Try each note as potential root
  for (const potentialRoot of sortedNotes) {
    for (const quality of getAllTriadQualities()) {
      const generatedTriad = generateTriad(potentialRoot, quality);

      // Check if the generated triad matches our input notes
      const matchesRoot = notes.some((n) => n.name === generatedTriad.root.name);
      const matchesThird = notes.some((n) => n.name === generatedTriad.third.name);
      const matchesFifth = notes.some((n) => n.name === generatedTriad.fifth.name);

      if (matchesRoot && matchesThird && matchesFifth) {
        return {
          root: generatedTriad.root,
          third: generatedTriad.third,
          fifth: generatedTriad.fifth,
          quality: generatedTriad.quality,
          symbol: generatedTriad.symbol,
        };
      }
    }
  }

  return null;
}

export function getChordTones(triad: Triad): Note[] {
  // Convert INote interfaces back to Note class instances
  return [
    new Note(triad.root.name, triad.root.octave, triad.root.frequency),
    new Note(triad.third.name, triad.third.octave, triad.third.frequency),
    new Note(triad.fifth.name, triad.fifth.octave, triad.fifth.frequency),
  ];
}
