import type { NoteName } from "../types/music";
import { MUSIC_CONSTANTS, VALID_NOTE_NAMES } from "@shared/constants/music";

/**
 * Note class representing a musical note with methods for interval calculations
 */
export class Note {
  private static readonly SEMITONE_MAP: Record<NoteName, number> = {
    C: 0,
    "C#": 1,
    D: 2,
    "D#": 3,
    E: 4,
    F: 5,
    "F#": 6,
    G: 7,
    "G#": 8,
    A: 9,
    "A#": 10,
    B: 11,
  };

  private static readonly NOTE_NAMES: NoteName[] = [...VALID_NOTE_NAMES];

  // Standard tuning frequencies (A4 = 440Hz reference)
  private static readonly A4_FREQUENCY = MUSIC_CONSTANTS.A4_FREQUENCY;
  private static readonly A4_SEMITONE_VALUE = 9 + 4 * MUSIC_CONSTANTS.SEMITONES_IN_OCTAVE; // A in 4th octave

  public readonly name: NoteName;
  public readonly octave?: number;
  public readonly frequency?: number;

  constructor(name: NoteName, octave?: number, frequency?: number) {
    this.name = name;
    this.octave = octave;

    if (frequency !== undefined) {
      this.frequency = frequency;
    } else if (octave !== undefined) {
      this.frequency = this.calculateFrequency(name, octave);
    }
  }

  public semitoneValue(): number {
    return Note.SEMITONE_MAP[this.name];
  }

  public addSemitones(semitones: number): Note {
    const currentSemitone = this.semitoneValue();
    const newSemitone = (((currentSemitone + semitones) % MUSIC_CONSTANTS.SEMITONES_IN_OCTAVE) + MUSIC_CONSTANTS.SEMITONES_IN_OCTAVE) % MUSIC_CONSTANTS.SEMITONES_IN_OCTAVE;
    const newNoteName = Note.NOTE_NAMES[newSemitone];

    // Calculate new octave if this note has an octave
    let newOctave: number | undefined;
    if (this.octave !== undefined) {
      const octaveChange = Math.floor((currentSemitone + semitones) / MUSIC_CONSTANTS.SEMITONES_IN_OCTAVE);
      newOctave = this.octave + octaveChange;
    }

    return new Note(newNoteName, newOctave);
  }

  public intervalTo(other: Note): number {
    const thisSemitone = this.semitoneValue();
    const otherSemitone = other.semitoneValue();

    if (otherSemitone >= thisSemitone) {
      return otherSemitone - thisSemitone;
    }
    return MUSIC_CONSTANTS.SEMITONES_IN_OCTAVE + otherSemitone - thisSemitone;
  }

  public equals(other: Note): boolean {
    if (this.name !== other.name) return false;

    // If both have octaves, compare them
    if (this.octave !== undefined && other.octave !== undefined) {
      return this.octave === other.octave;
    }

    // If neither has octave, consider them equal
    if (this.octave === undefined && other.octave === undefined) {
      return true;
    }

    // If only one has octave, consider them different
    return false;
  }

  public toString(): string {
    return this.octave !== undefined ? `${this.name}${this.octave}` : this.name;
  }

  private calculateFrequency(name: NoteName, octave: number): number {
    const noteSemitone = Note.SEMITONE_MAP[name];
    const totalSemitones = noteSemitone + octave * MUSIC_CONSTANTS.SEMITONES_IN_OCTAVE;
    const semitoneDifference = totalSemitones - Note.A4_SEMITONE_VALUE;

    return Note.A4_FREQUENCY * 2 ** (semitoneDifference / MUSIC_CONSTANTS.SEMITONES_IN_OCTAVE);
  }
}
