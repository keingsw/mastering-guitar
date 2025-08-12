/**
 * Chord Data Module
 *
 * Pre-computed triad database with fretboard positions and voicings.
 * Optimized for fast lookup and guitar-specific chord information.
 */

// Database lookup services
export {
  findTriads,
  findVoicings,
  getAllTriadSymbols,
  getCommonVoicings,
  getDatabaseStats,
  getRandomTriad,
  getTriad,
  getTriadsByQuality,
  getTriadsByRoot,
  getVoicingsByDifficulty,
  getVoicingsByNeckPosition,
} from "./services/database-lookup";
// Database types
export type {
  DatabaseChordVoicing,
  DatabaseFretboardPosition,
  DatabaseLookupOptions,
  DatabaseTriad,
  TriadDatabase,
  TriadDatabaseEntry,
} from "./types/database";
