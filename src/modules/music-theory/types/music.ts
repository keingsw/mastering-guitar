/**
 * Core music theory types for guitar triads
 */

export type NoteName = "C" | "C#" | "D" | "D#" | "E" | "F" | "F#" | "G" | "G#" | "A" | "A#" | "B";

export interface INote {
  name: NoteName;
  octave?: number;
  frequency?: number;
}

export type IntervalQuality = "perfect" | "major" | "minor" | "augmented" | "diminished";

export interface Interval {
  semitones: number;
  name: string;
  quality: IntervalQuality;
}

export type TriadQuality = "major" | "minor" | "diminished" | "augmented";

export interface Triad {
  root: INote;
  third: INote;
  fifth: INote;
  quality: TriadQuality;
  symbol: string;
}

export interface FretboardPosition {
  string: number; // 1-6 (high E to low E)
  fret: number; // 0-24
  note: INote;
  isRoot?: boolean;
  isThird?: boolean;
  isFifth?: boolean;
}

export interface ChordVoicing {
  triad: Triad;
  positions: FretboardPosition[];
  fingering: number[]; // Finger numbers (0-4)
  difficulty: "beginner" | "intermediate" | "advanced";
  neckPosition: number; // Fret position (0-12)
}
