/**
 * Music Theory Module
 *
 * Core music theory engine for guitar triads mastery.
 * Provides Note, Interval, and Triad calculations with fretboard mapping.
 */

// Entities
export { Note } from "./entities/Note";
export {
  findNoteOnFretboard,
  generateChordVoicings,
  getStandardTuning,
  mapTriadToFretboard,
} from "./services/fretboard-mapping";

// Services
export {
  calculateInterval,
  getAllIntervals,
  getIntervalName,
  invertInterval,
  isConsonant,
} from "./services/intervals";

export {
  generateTriad,
  getAllTriadQualities,
  getAllTriads,
  getChordTones,
  getTriadPattern,
  identifyTriad,
} from "./services/triads";
// Types
export type {
  ChordVoicing,
  FretboardPosition,
  INote,
  Interval,
  IntervalQuality,
  NoteName,
  Triad,
  TriadQuality,
} from "./types/music";
