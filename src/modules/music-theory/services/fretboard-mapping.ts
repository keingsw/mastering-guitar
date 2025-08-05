import { Note } from "../entities/Note";
import type { ChordVoicing, FretboardPosition, Triad } from "../types/music";
import { getChordTones } from "./triads";

/**
 * Fretboard mapping utilities for translating chords to guitar positions
 */

// Standard guitar tuning (from 1st string to 6th string)
const STANDARD_TUNING: Note[] = [
  new Note("E"), // 1st string (high E)
  new Note("B"), // 2nd string
  new Note("G"), // 3rd string
  new Note("D"), // 4th string
  new Note("A"), // 5th string
  new Note("E"), // 6th string (low E)
];

export function getStandardTuning(): Note[] {
  return [...STANDARD_TUNING];
}

export function findNoteOnFretboard(note: Note, maxFret: number = 12): FretboardPosition[] {
  const positions: FretboardPosition[] = [];

  for (let stringIndex = 0; stringIndex < STANDARD_TUNING.length; stringIndex++) {
    const openString = STANDARD_TUNING[stringIndex];

    for (let fret = 0; fret <= maxFret; fret++) {
      const frettedNote = openString.addSemitones(fret);

      if (frettedNote.name === note.name) {
        positions.push({
          string: stringIndex + 1,
          fret,
          note: frettedNote,
        });
      }
    }
  }

  return positions;
}

export function mapTriadToFretboard(triad: Triad, maxFret: number = 12): FretboardPosition[] {
  const chordTones = getChordTones(triad);
  const positions: FretboardPosition[] = [];

  for (const chordTone of chordTones) {
    const notePositions = findNoteOnFretboard(chordTone, maxFret);

    for (const position of notePositions) {
      const mappedPosition: FretboardPosition = {
        ...position,
        isRoot: chordTone.name === triad.root.name,
        isThird: chordTone.name === triad.third.name,
        isFifth: chordTone.name === triad.fifth.name,
      };

      positions.push(mappedPosition);
    }
  }

  return positions.sort((a, b) => {
    // Sort by string first, then by fret
    if (a.string !== b.string) {
      return a.string - b.string;
    }
    return a.fret - b.fret;
  });
}

export function generateChordVoicings(triad: Triad): ChordVoicing[] {
  const allPositions = mapTriadToFretboard(triad);
  const voicings: ChordVoicing[] = [];

  // Generate basic open chord voicings (frets 0-3)
  const openPositions = allPositions.filter((p) => p.fret <= 3);
  const openVoicing = generateVoicingFromPositions(triad, openPositions, "beginner", 0);
  if (openVoicing && openVoicing.positions.length >= 3) {
    voicings.push(openVoicing);
  }

  // Generate barre chord voicings at different neck positions
  for (let neckPosition = 1; neckPosition <= 7; neckPosition++) {
    const positionsInRange = allPositions.filter((p) => p.fret >= neckPosition && p.fret <= neckPosition + 4);

    const barreVoicing = generateVoicingFromPositions(
      triad,
      positionsInRange,
      neckPosition <= 3 ? "beginner" : "intermediate",
      neckPosition,
    );

    if (barreVoicing && barreVoicing.positions.length >= 3) {
      voicings.push(barreVoicing);
    }
  }

  return voicings;
}

function generateVoicingFromPositions(
  triad: Triad,
  availablePositions: FretboardPosition[],
  difficulty: ChordVoicing["difficulty"],
  neckPosition: number,
): ChordVoicing | null {
  // Ensure we have at least one of each chord tone
  const hasRoot = availablePositions.some((p) => p.isRoot);
  const hasThird = availablePositions.some((p) => p.isThird);
  const hasFifth = availablePositions.some((p) => p.isFifth);

  if (!hasRoot || !hasThird || !hasFifth) {
    return null;
  }

  // Select positions to create a playable chord shape
  const selectedPositions: FretboardPosition[] = [];
  const usedStrings = new Set<number>();

  // Prioritize root notes on lower strings
  const rootPositions = availablePositions.filter((p) => p.isRoot && !usedStrings.has(p.string));
  if (rootPositions.length > 0) {
    const bestRoot = rootPositions.reduce((best, current) => (current.string > best.string ? current : best));
    selectedPositions.push(bestRoot);
    usedStrings.add(bestRoot.string);
  }

  // Add thirds and fifths on remaining strings
  for (const position of availablePositions) {
    if (usedStrings.has(position.string) || selectedPositions.length >= 6) {
      continue;
    }

    if ((position.isThird || position.isFifth) && selectedPositions.length < 4) {
      selectedPositions.push(position);
      usedStrings.add(position.string);
    }
  }

  if (selectedPositions.length < 3) {
    return null;
  }

  // Generate fingering based on fret positions
  const fingering = generateFingering(selectedPositions);

  return {
    triad,
    positions: selectedPositions.sort((a, b) => a.string - b.string),
    fingering,
    difficulty,
    neckPosition,
  };
}

function generateFingering(positions: FretboardPosition[]): number[] {
  const fingering: number[] = [];

  for (const position of positions) {
    if (position.fret === 0) {
      fingering.push(0);
    } else {
      const fingerNumber = Math.min(position.fret, 4);
      fingering.push(fingerNumber);
    }
  }

  return fingering;
}
