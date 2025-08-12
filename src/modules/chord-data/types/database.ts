import type { INote, NoteName, TriadQuality } from "../../music-theory/types/music";

export interface DatabaseTriad {
  root: INote;
  third: INote;
  fifth: INote;
  quality: TriadQuality;
  symbol: string;
}

export interface DatabaseFretboardPosition {
  string: number;
  fret: number;
  note: INote;
  isRoot?: boolean;
  isThird?: boolean;
  isFifth?: boolean;
}

export interface DatabaseChordVoicing {
  triad: DatabaseTriad;
  positions: DatabaseFretboardPosition[];
  fingering: number[];
  difficulty: "beginner" | "intermediate" | "advanced";
  neckPosition: number;
  shape: string;
}

export interface TriadDatabaseEntry {
  triad: DatabaseTriad;
  fretboardPositions: DatabaseFretboardPosition[];
  voicings: DatabaseChordVoicing[];
  commonVoicings: DatabaseChordVoicing[];
}

export interface TriadDatabase {
  version: string;
  generated: string;
  instrument: string;
  tuning: INote[];
  triads: Record<NoteName, Record<TriadQuality, TriadDatabaseEntry>>;
  index: {
    byRoot: Record<NoteName, TriadDatabaseEntry[]>;
    byQuality: Record<TriadQuality, TriadDatabaseEntry[]>;
    byDifficulty: Record<"beginner" | "intermediate" | "advanced", DatabaseChordVoicing[]>;
    byNeckPosition: Record<number, DatabaseChordVoicing[]>;
  };
  stats: {
    totalTriads: number;
    totalVoicings: number;
    totalPositions: number;
    voicingsByDifficulty: Record<string, number>;
  };
}

export interface DatabaseLookupOptions {
  root?: NoteName;
  quality?: TriadQuality;
  difficulty?: "beginner" | "intermediate" | "advanced";
  neckPosition?: number;
  maxFrets?: number;
  includeOpenStrings?: boolean;
}
