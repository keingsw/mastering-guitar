import type {
  TriadDatabase,
  TriadDatabaseEntry,
  DatabaseChordVoicing,
  DatabaseLookupOptions,
} from '../types/database';
import type { NoteName, TriadQuality } from '../../music-theory/types/music';
import triadDatabase from '../generated/triad-database.json';

const database = triadDatabase as TriadDatabase;

export function getTriad(root: NoteName, quality: TriadQuality): TriadDatabaseEntry | null {
  return database.triads[root]?.[quality] || null;
}

export function getTriadsByRoot(root: NoteName): TriadDatabaseEntry[] {
  return database.index.byRoot[root] || [];
}

export function getTriadsByQuality(quality: TriadQuality): TriadDatabaseEntry[] {
  return database.index.byQuality[quality] || [];
}

export function getVoicingsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): DatabaseChordVoicing[] {
  return database.index.byDifficulty[difficulty] || [];
}

export function getVoicingsByNeckPosition(position: number): DatabaseChordVoicing[] {
  return database.index.byNeckPosition[position] || [];
}

export function findTriads(options: DatabaseLookupOptions): TriadDatabaseEntry[] {
  let results: TriadDatabaseEntry[] = [];
  
  if (options.root && options.quality) {
    const triad = getTriad(options.root, options.quality);
    results = triad ? [triad] : [];
  } else if (options.root) {
    results = getTriadsByRoot(options.root);
  } else if (options.quality) {
    results = getTriadsByQuality(options.quality);
  } else {
    results = Object.values(database.triads).flatMap(rootTriads =>
      Object.values(rootTriads)
    );
  }
  
  return results;
}

export function findVoicings(options: DatabaseLookupOptions): DatabaseChordVoicing[] {
  const triads = findTriads(options);
  let voicings: DatabaseChordVoicing[] = [];
  
  for (const triad of triads) {
    voicings.push(...triad.voicings);
  }
  
  if (options.difficulty) {
    voicings = voicings.filter(v => v.difficulty === options.difficulty);
  }
  
  if (options.neckPosition !== undefined) {
    voicings = voicings.filter(v => v.neckPosition === options.neckPosition);
  }
  
  if (options.maxFrets !== undefined) {
    voicings = voicings.filter(v => 
      v.positions.every(p => p.fret <= options.maxFrets!)
    );
  }
  
  if (options.includeOpenStrings === false) {
    voicings = voicings.filter(v => 
      v.positions.every(p => p.fret > 0)
    );
  }
  
  return voicings;
}

export function getRandomTriad(options?: { quality?: TriadQuality }): TriadDatabaseEntry {
  const triads = options?.quality 
    ? getTriadsByQuality(options.quality)
    : Object.values(database.triads).flatMap(rootTriads => Object.values(rootTriads));
  
  const randomIndex = Math.floor(Math.random() * triads.length);
  return triads[randomIndex];
}

export function getCommonVoicings(root: NoteName, quality: TriadQuality): DatabaseChordVoicing[] {
  const triad = getTriad(root, quality);
  return triad?.commonVoicings || [];
}

export function getDatabaseStats() {
  return {
    ...database.stats,
    version: database.version,
    generated: database.generated,
    instrument: database.instrument,
  };
}

export function getAllTriadSymbols(): string[] {
  const symbols = new Set<string>();
  
  for (const rootTriads of Object.values(database.triads)) {
    for (const entry of Object.values(rootTriads)) {
      symbols.add(entry.triad.symbol);
    }
  }
  
  return Array.from(symbols).sort();
}