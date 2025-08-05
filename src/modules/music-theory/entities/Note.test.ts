import { describe, expect, test } from "vitest";
import { Note } from "./Note";

describe("Note", () => {
  describe("constructor", () => {
    test("creates note with name only", () => {
      const note = new Note("C");
      expect(note.name).toBe("C");
      expect(note.octave).toBeUndefined();
      expect(note.frequency).toBeUndefined();
    });

    test("creates note with name and octave", () => {
      const note = new Note("A", 4);
      expect(note.name).toBe("A");
      expect(note.octave).toBe(4);
      expect(note.frequency).toBe(440);
    });

    test("creates note with all properties", () => {
      const note = new Note("C", 4, 261.63);
      expect(note.name).toBe("C");
      expect(note.octave).toBe(4);
      expect(note.frequency).toBe(261.63);
    });
  });

  describe("semitoneValue", () => {
    test("returns correct semitone values for natural notes", () => {
      expect(new Note("C").semitoneValue()).toBe(0);
      expect(new Note("D").semitoneValue()).toBe(2);
      expect(new Note("E").semitoneValue()).toBe(4);
      expect(new Note("F").semitoneValue()).toBe(5);
      expect(new Note("G").semitoneValue()).toBe(7);
      expect(new Note("A").semitoneValue()).toBe(9);
      expect(new Note("B").semitoneValue()).toBe(11);
    });

    test("returns correct semitone values for sharp notes", () => {
      expect(new Note("C#").semitoneValue()).toBe(1);
      expect(new Note("D#").semitoneValue()).toBe(3);
      expect(new Note("F#").semitoneValue()).toBe(6);
      expect(new Note("G#").semitoneValue()).toBe(8);
      expect(new Note("A#").semitoneValue()).toBe(10);
    });
  });

  describe("addSemitones", () => {
    test("adds semitones correctly within octave", () => {
      const c = new Note("C");
      const e = c.addSemitones(4);
      expect(e.name).toBe("E");
    });

    test("handles wrapping around octave", () => {
      const a = new Note("A");
      const c = a.addSemitones(3);
      expect(c.name).toBe("C");
    });

    test("handles negative semitones", () => {
      const e = new Note("E");
      const c = e.addSemitones(-4);
      expect(c.name).toBe("C");
    });

    test("handles large intervals", () => {
      const c = new Note("C");
      const c_octave = c.addSemitones(12);
      expect(c_octave.name).toBe("C");
    });
  });

  describe("intervalTo", () => {
    test("calculates interval to higher note", () => {
      const c = new Note("C");
      const e = new Note("E");
      expect(c.intervalTo(e)).toBe(4);
    });

    test("calculates interval to lower note", () => {
      const e = new Note("E");
      const c = new Note("C");
      expect(e.intervalTo(c)).toBe(8);
    });

    test("calculates interval to same note", () => {
      const c1 = new Note("C");
      const c2 = new Note("C");
      expect(c1.intervalTo(c2)).toBe(0);
    });
  });

  describe("toString", () => {
    test("returns string representation without octave", () => {
      const note = new Note("C#");
      expect(note.toString()).toBe("C#");
    });

    test("returns string representation with octave", () => {
      const note = new Note("A", 4);
      expect(note.toString()).toBe("A4");
    });
  });

  describe("equals", () => {
    test("returns true for equal notes", () => {
      const c1 = new Note("C", 4);
      const c2 = new Note("C", 4);
      expect(c1.equals(c2)).toBe(true);
    });

    test("returns false for different note names", () => {
      const c = new Note("C", 4);
      const d = new Note("D", 4);
      expect(c.equals(d)).toBe(false);
    });

    test("returns false for different octaves", () => {
      const c3 = new Note("C", 3);
      const c4 = new Note("C", 4);
      expect(c3.equals(c4)).toBe(false);
    });

    test("returns true when comparing notes without octaves", () => {
      const c1 = new Note("C");
      const c2 = new Note("C");
      expect(c1.equals(c2)).toBe(true);
    });
  });
});
