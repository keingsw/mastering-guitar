import {
  isValidDifficultyLevel,
  isValidNeckPosition,
  isValidNoteName,
  isValidTriadQuality,
} from "@shared/constants/music";
import type { NoteName, TriadQuality } from "../../music-theory/types/music";
import triadDatabase from "../generated/triad-database.json";
import type { DatabaseChordVoicing, DatabaseLookupOptions, TriadDatabase, TriadDatabaseEntry } from "../types/database";

const database = triadDatabase as TriadDatabase;

function logDatabaseError(operation: string, error: unknown): void {
  console.error(`Database operation '${operation}' failed:`, error);
}

function logValidationError(operation: string, param: string, value: unknown): void {
  console.error(`Validation failed in '${operation}': Invalid ${param}:`, value);
}

export function getTriad(root: NoteName, quality: TriadQuality): TriadDatabaseEntry | null {
  if (!isValidNoteName(root)) {
    logValidationError("getTriad", "root", root);
    return null;
  }

  if (!isValidTriadQuality(quality)) {
    logValidationError("getTriad", "quality", quality);
    return null;
  }

  try {
    return database.triads[root]?.[quality] || null;
  } catch (error) {
    logDatabaseError("getTriad", error);
    return null;
  }
}

export function getTriadsByRoot(root: NoteName): TriadDatabaseEntry[] {
  if (!isValidNoteName(root)) {
    logValidationError("getTriadsByRoot", "root", root);
    return [];
  }

  try {
    return database.index.byRoot[root] || [];
  } catch (error) {
    logDatabaseError("getTriadsByRoot", error);
    return [];
  }
}

export function getTriadsByQuality(quality: TriadQuality): TriadDatabaseEntry[] {
  if (!isValidTriadQuality(quality)) {
    logValidationError("getTriadsByQuality", "quality", quality);
    return [];
  }

  try {
    return database.index.byQuality[quality] || [];
  } catch (error) {
    logDatabaseError("getTriadsByQuality", error);
    return [];
  }
}

export function getVoicingsByDifficulty(difficulty: "beginner" | "intermediate" | "advanced"): DatabaseChordVoicing[] {
  if (!isValidDifficultyLevel(difficulty)) {
    logValidationError("getVoicingsByDifficulty", "difficulty", difficulty);
    return [];
  }

  try {
    return database.index.byDifficulty[difficulty] || [];
  } catch (error) {
    logDatabaseError("getVoicingsByDifficulty", error);
    return [];
  }
}

export function getVoicingsByNeckPosition(position: number): DatabaseChordVoicing[] {
  if (!isValidNeckPosition(position)) {
    logValidationError("getVoicingsByNeckPosition", "position", position);
    return [];
  }

  try {
    return database.index.byNeckPosition[position] || [];
  } catch (error) {
    logDatabaseError("getVoicingsByNeckPosition", error);
    return [];
  }
}

export function findTriads(options: DatabaseLookupOptions): TriadDatabaseEntry[] {
  try {
    let results: TriadDatabaseEntry[] = [];

    if (options.root && options.quality) {
      const triad = getTriad(options.root, options.quality);
      results = triad ? [triad] : [];
    } else if (options.root) {
      results = getTriadsByRoot(options.root);
    } else if (options.quality) {
      results = getTriadsByQuality(options.quality);
    } else {
      results = Object.values(database.triads).flatMap((rootTriads) => Object.values(rootTriads));
    }

    return results;
  } catch (error) {
    logDatabaseError("findTriads", error);
    return [];
  }
}

export function findVoicings(options: DatabaseLookupOptions): DatabaseChordVoicing[] {
  try {
    const triads = findTriads(options);
    let voicings: DatabaseChordVoicing[] = [];

    for (const triad of triads) {
      voicings.push(...triad.voicings);
    }

    if (options.difficulty) {
      voicings = voicings.filter((v) => v.difficulty === options.difficulty);
    }

    if (options.neckPosition !== undefined) {
      voicings = voicings.filter((v) => v.neckPosition === options.neckPosition);
    }

    if (options.maxFrets !== undefined) {
      voicings = voicings.filter((v) => v.positions.every((p) => p.fret <= options.maxFrets!));
    }

    if (options.includeOpenStrings === false) {
      voicings = voicings.filter((v) => v.positions.every((p) => p.fret > 0));
    }

    return voicings;
  } catch (error) {
    logDatabaseError("findVoicings", error);
    return [];
  }
}

export function getRandomTriad(options?: { quality?: TriadQuality }): TriadDatabaseEntry | null {
  if (options?.quality !== undefined && !isValidTriadQuality(options.quality)) {
    logValidationError("getRandomTriad", "quality", options.quality);
    return null;
  }

  try {
    const triads = options?.quality
      ? getTriadsByQuality(options.quality)
      : Object.values(database.triads).flatMap((rootTriads) => Object.values(rootTriads));

    if (triads.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * triads.length);
    return triads[randomIndex];
  } catch (error) {
    logDatabaseError("getRandomTriad", error);
    return null;
  }
}

export function getCommonVoicings(root: NoteName, quality: TriadQuality): DatabaseChordVoicing[] {
  if (!isValidNoteName(root)) {
    logValidationError("getCommonVoicings", "root", root);
    return [];
  }

  if (!isValidTriadQuality(quality)) {
    logValidationError("getCommonVoicings", "quality", quality);
    return [];
  }

  try {
    const triad = getTriad(root, quality);
    return triad?.commonVoicings || [];
  } catch (error) {
    logDatabaseError("getCommonVoicings", error);
    return [];
  }
}

export function getDatabaseStats() {
  try {
    return {
      ...database.stats,
      version: database.version,
      generated: database.generated,
      instrument: database.instrument,
    };
  } catch (error) {
    logDatabaseError("getDatabaseStats", error);
    return {
      totalTriads: 0,
      totalVoicings: 0,
      totalPositions: 0,
      voicingsByDifficulty: { beginner: 0, intermediate: 0, advanced: 0 },
      version: "unknown",
      generated: "unknown",
      instrument: "unknown",
    };
  }
}

export function getAllTriadSymbols(): string[] {
  try {
    const symbols = new Set<string>();

    for (const rootTriads of Object.values(database.triads)) {
      for (const entry of Object.values(rootTriads)) {
        symbols.add(entry.triad.symbol);
      }
    }

    return Array.from(symbols).sort();
  } catch (error) {
    logDatabaseError("getAllTriadSymbols", error);
    return [];
  }
}
