import { describe, expect, test } from "vitest";
import {
  isValidDifficultyLevel,
  isValidFretNumber,
  isValidNeckPosition,
  // VALID_DIFFICULTY_LEVELS, // Uncomment when used in tests
  isValidNoteName,
  isValidOctave,
  isValidStringNumber,
  isValidTriadQuality,
  MUSIC_CONSTANTS,
  VALID_NOTE_NAMES,
  VALID_TRIAD_QUALITIES,
} from "./music";

describe("Music Constants", () => {
  test("MUSIC_CONSTANTS contains expected values", () => {
    expect(MUSIC_CONSTANTS.A4_FREQUENCY).toBe(440);
    expect(MUSIC_CONSTANTS.SEMITONES_IN_OCTAVE).toBe(12);
    expect(MUSIC_CONSTANTS.GUITAR_STRINGS).toBe(6);
    expect(MUSIC_CONSTANTS.MAX_FRET).toBe(24);
    expect(MUSIC_CONSTANTS.MIN_FRET).toBe(0);
  });

  test("VALID_NOTE_NAMES contains all 12 chromatic notes", () => {
    expect(VALID_NOTE_NAMES).toHaveLength(12);
    expect(VALID_NOTE_NAMES).toContain("C");
    expect(VALID_NOTE_NAMES).toContain("C#");
    expect(VALID_NOTE_NAMES).toContain("G#");
    expect(VALID_NOTE_NAMES).toContain("B");
  });

  test("VALID_TRIAD_QUALITIES contains expected qualities", () => {
    expect(VALID_TRIAD_QUALITIES).toHaveLength(4);
    expect(VALID_TRIAD_QUALITIES).toContain("major");
    expect(VALID_TRIAD_QUALITIES).toContain("minor");
    expect(VALID_TRIAD_QUALITIES).toContain("diminished");
    expect(VALID_TRIAD_QUALITIES).toContain("augmented");
  });
});

describe("Validation Functions", () => {
  describe("isValidNoteName", () => {
    test("validates correct note names", () => {
      expect(isValidNoteName("C")).toBe(true);
      expect(isValidNoteName("C#")).toBe(true);
      expect(isValidNoteName("B")).toBe(true);
    });

    test("rejects invalid note names", () => {
      expect(isValidNoteName("H")).toBe(false);
      expect(isValidNoteName("C##")).toBe(false);
      expect(isValidNoteName("Db")).toBe(false);
      expect(isValidNoteName(null)).toBe(false);
      expect(isValidNoteName(undefined)).toBe(false);
      expect(isValidNoteName(123)).toBe(false);
    });
  });

  describe("isValidTriadQuality", () => {
    test("validates correct qualities", () => {
      expect(isValidTriadQuality("major")).toBe(true);
      expect(isValidTriadQuality("minor")).toBe(true);
      expect(isValidTriadQuality("diminished")).toBe(true);
      expect(isValidTriadQuality("augmented")).toBe(true);
    });

    test("rejects invalid qualities", () => {
      expect(isValidTriadQuality("seventh")).toBe(false);
      expect(isValidTriadQuality("sus4")).toBe(false);
      expect(isValidTriadQuality(null)).toBe(false);
      expect(isValidTriadQuality(undefined)).toBe(false);
      expect(isValidTriadQuality(123)).toBe(false);
    });
  });

  describe("isValidDifficultyLevel", () => {
    test("validates correct difficulty levels", () => {
      expect(isValidDifficultyLevel("beginner")).toBe(true);
      expect(isValidDifficultyLevel("intermediate")).toBe(true);
      expect(isValidDifficultyLevel("advanced")).toBe(true);
    });

    test("rejects invalid difficulty levels", () => {
      expect(isValidDifficultyLevel("expert")).toBe(false);
      expect(isValidDifficultyLevel("easy")).toBe(false);
      expect(isValidDifficultyLevel(null)).toBe(false);
      expect(isValidDifficultyLevel(undefined)).toBe(false);
      expect(isValidDifficultyLevel(123)).toBe(false);
    });
  });

  describe("isValidFretNumber", () => {
    test("validates correct fret numbers", () => {
      expect(isValidFretNumber(0)).toBe(true);
      expect(isValidFretNumber(12)).toBe(true);
      expect(isValidFretNumber(24)).toBe(true);
    });

    test("rejects invalid fret numbers", () => {
      expect(isValidFretNumber(-1)).toBe(false);
      expect(isValidFretNumber(25)).toBe(false);
      expect(isValidFretNumber(3.5)).toBe(false);
      expect(isValidFretNumber("12")).toBe(false);
      expect(isValidFretNumber(null)).toBe(false);
      expect(isValidFretNumber(undefined)).toBe(false);
    });
  });

  describe("isValidStringNumber", () => {
    test("validates correct string numbers", () => {
      expect(isValidStringNumber(1)).toBe(true);
      expect(isValidStringNumber(3)).toBe(true);
      expect(isValidStringNumber(6)).toBe(true);
    });

    test("rejects invalid string numbers", () => {
      expect(isValidStringNumber(0)).toBe(false);
      expect(isValidStringNumber(7)).toBe(false);
      expect(isValidStringNumber(-1)).toBe(false);
      expect(isValidStringNumber(3.5)).toBe(false);
      expect(isValidStringNumber("3")).toBe(false);
      expect(isValidStringNumber(null)).toBe(false);
      expect(isValidStringNumber(undefined)).toBe(false);
    });
  });

  describe("isValidOctave", () => {
    test("validates correct octave numbers", () => {
      expect(isValidOctave(0)).toBe(true);
      expect(isValidOctave(4)).toBe(true);
      expect(isValidOctave(9)).toBe(true);
    });

    test("rejects invalid octave numbers", () => {
      expect(isValidOctave(-1)).toBe(false);
      expect(isValidOctave(10)).toBe(false);
      expect(isValidOctave(4.5)).toBe(false);
      expect(isValidOctave("4")).toBe(false);
      expect(isValidOctave(null)).toBe(false);
      expect(isValidOctave(undefined)).toBe(false);
    });
  });

  describe("isValidNeckPosition", () => {
    test("validates correct neck positions", () => {
      expect(isValidNeckPosition(0)).toBe(true);
      expect(isValidNeckPosition(5)).toBe(true);
      expect(isValidNeckPosition(24)).toBe(true);
    });

    test("rejects invalid neck positions", () => {
      expect(isValidNeckPosition(-1)).toBe(false);
      expect(isValidNeckPosition(25)).toBe(false);
      expect(isValidNeckPosition(5.5)).toBe(false);
      expect(isValidNeckPosition("5")).toBe(false);
      expect(isValidNeckPosition(null)).toBe(false);
      expect(isValidNeckPosition(undefined)).toBe(false);
    });
  });
});
