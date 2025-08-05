import { describe, expect, test } from "vitest";
import { Note } from "../entities/Note";
import { calculateInterval, getIntervalName, invertInterval, isConsonant } from "./intervals";

describe("Interval calculations", () => {
  describe("calculateInterval", () => {
    test("calculates major third correctly", () => {
      const c = new Note("C");
      const e = new Note("E");
      const interval = calculateInterval(c, e);

      expect(interval.semitones).toBe(4);
      expect(interval.quality).toBe("major");
      expect(interval.name).toBe("major third");
    });

    test("calculates perfect fifth correctly", () => {
      const c = new Note("C");
      const g = new Note("G");
      const interval = calculateInterval(c, g);

      expect(interval.semitones).toBe(7);
      expect(interval.quality).toBe("perfect");
      expect(interval.name).toBe("perfect fifth");
    });

    test("calculates minor third correctly", () => {
      const c = new Note("C");
      const eb = new Note("D#");
      const interval = calculateInterval(c, eb);

      expect(interval.semitones).toBe(3);
      expect(interval.quality).toBe("minor");
      expect(interval.name).toBe("minor third");
    });

    test("calculates augmented fourth correctly", () => {
      const c = new Note("C");
      const fs = new Note("F#");
      const interval = calculateInterval(c, fs);

      expect(interval.semitones).toBe(6);
      expect(interval.quality).toBe("augmented");
      expect(interval.name).toBe("augmented fourth");
    });

    test("calculates diminished fifth correctly", () => {
      const c = new Note("C");
      const gb = new Note("F#");
      const interval = calculateInterval(c, gb);

      expect(interval.semitones).toBe(6);
      expect(interval.quality).toBe("augmented");
    });
  });

  describe("getIntervalName", () => {
    test("returns correct names for common intervals", () => {
      expect(getIntervalName(0)).toBe("unison");
      expect(getIntervalName(1)).toBe("minor second");
      expect(getIntervalName(2)).toBe("major second");
      expect(getIntervalName(3)).toBe("minor third");
      expect(getIntervalName(4)).toBe("major third");
      expect(getIntervalName(5)).toBe("perfect fourth");
      expect(getIntervalName(6)).toBe("augmented fourth");
      expect(getIntervalName(7)).toBe("perfect fifth");
      expect(getIntervalName(8)).toBe("minor sixth");
      expect(getIntervalName(9)).toBe("major sixth");
      expect(getIntervalName(10)).toBe("minor seventh");
      expect(getIntervalName(11)).toBe("major seventh");
      expect(getIntervalName(12)).toBe("octave");
    });

    test("handles intervals beyond octave", () => {
      expect(getIntervalName(13)).toBe("minor ninth");
      expect(getIntervalName(16)).toBe("major tenth");
      expect(getIntervalName(19)).toBe("perfect twelfth");
    });
  });

  describe("isConsonant", () => {
    test("identifies consonant intervals", () => {
      expect(isConsonant(0)).toBe(true);
      expect(isConsonant(3)).toBe(true);
      expect(isConsonant(4)).toBe(true);
      expect(isConsonant(5)).toBe(true);
      expect(isConsonant(7)).toBe(true);
      expect(isConsonant(8)).toBe(true);
      expect(isConsonant(9)).toBe(true);
      expect(isConsonant(12)).toBe(true);
    });

    test("identifies dissonant intervals", () => {
      expect(isConsonant(1)).toBe(false);
      expect(isConsonant(2)).toBe(false);
      expect(isConsonant(6)).toBe(false);
      expect(isConsonant(10)).toBe(false);
      expect(isConsonant(11)).toBe(false);
    });
  });

  describe("invertInterval", () => {
    test("inverts intervals correctly", () => {
      expect(invertInterval(1)).toBe(11);
      expect(invertInterval(2)).toBe(10);
      expect(invertInterval(3)).toBe(9);
      expect(invertInterval(4)).toBe(8);
      expect(invertInterval(5)).toBe(7);
      expect(invertInterval(6)).toBe(6);
      expect(invertInterval(7)).toBe(5);
    });

    test("handles octave inversion", () => {
      expect(invertInterval(0)).toBe(0);
      expect(invertInterval(12)).toBe(0);
    });
  });
});
