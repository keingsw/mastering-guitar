/**
 * Chord Data Module
 *
 * Pre-computed triad database with fretboard positions and voicings.
 * Optimized for fast lookup and guitar-specific chord information.
 */

// Database types
export type {
  TriadDatabase,
  TriadDatabaseEntry,
  DatabaseTriad,
  DatabaseFretboardPosition,
  DatabaseChordVoicing,
  DatabaseLookupOptions,
} from './types/database';

// Database lookup services
export {
  getTriad,
  getTriadsByRoot,
  getTriadsByQuality,
  getVoicingsByDifficulty,
  getVoicingsByNeckPosition,
  findTriads,
  findVoicings,
  getRandomTriad,
  getCommonVoicings,
  getDatabaseStats,
  getAllTriadSymbols,
} from './services/database-lookup';
