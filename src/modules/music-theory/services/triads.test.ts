import { describe, expect, test } from "vitest";
import { Note } from "../entities/Note";
import { generateTriad, getAllTriads, getTriadPattern } from "./triads";

describe("Triad generation", () => {
  describe("generateTriad", () => {
    test("generates major triad correctly", () => {
      const root = new Note("C");
      const triad = generateTriad(root, "major");

      expect(triad.root.name).toBe("C");
      expect(triad.third.name).toBe("E");
      expect(triad.fifth.name).toBe("G");
      expect(triad.quality).toBe("major");
      expect(triad.symbol).toBe("C");
    });

    test("generates minor triad correctly", () => {
      const root = new Note("C");
      const triad = generateTriad(root, "minor");

      expect(triad.root.name).toBe("C");
      expect(triad.third.name).toBe("D#");
      expect(triad.fifth.name).toBe("G");
      expect(triad.quality).toBe("minor");
      expect(triad.symbol).toBe("Cm");
    });

    test("generates diminished triad correctly", () => {
      const root = new Note("C");
      const triad = generateTriad(root, "diminished");

      expect(triad.root.name).toBe("C");
      expect(triad.third.name).toBe("D#");
      expect(triad.fifth.name).toBe("F#");
      expect(triad.quality).toBe("diminished");
      expect(triad.symbol).toBe("C°");
    });

    test("generates augmented triad correctly", () => {
      const root = new Note("C");
      const triad = generateTriad(root, "augmented");

      expect(triad.root.name).toBe("C");
      expect(triad.third.name).toBe("E");
      expect(triad.fifth.name).toBe("G#");
      expect(triad.quality).toBe("augmented");
      expect(triad.symbol).toBe("C+");
    });

    test("generates triads with sharp roots", () => {
      const root = new Note("F#");
      const major = generateTriad(root, "major");

      expect(major.root.name).toBe("F#");
      expect(major.third.name).toBe("A#");
      expect(major.fifth.name).toBe("C#");
      expect(major.symbol).toBe("F#");
    });
  });

  describe("getTriadPattern", () => {
    test("returns correct semitone patterns", () => {
      expect(getTriadPattern("major")).toEqual([0, 4, 7]);
      expect(getTriadPattern("minor")).toEqual([0, 3, 7]);
      expect(getTriadPattern("diminished")).toEqual([0, 3, 6]);
      expect(getTriadPattern("augmented")).toEqual([0, 4, 8]);
    });
  });

  describe("getAllTriads", () => {
    test("generates all 12 major triads", () => {
      const majorTriads = getAllTriads("major");
      expect(majorTriads).toHaveLength(12);

      const roots = majorTriads.map((t) => t.root.name);
      expect(roots).toEqual(["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]);
    });

    test("generates all 12 minor triads", () => {
      const minorTriads = getAllTriads("minor");
      expect(minorTriads).toHaveLength(12);

      minorTriads.forEach((triad) => {
        expect(triad.quality).toBe("minor");
        expect(triad.symbol).toContain("m");
      });
    });

    test("generates all diminished triads", () => {
      const dimTriads = getAllTriads("diminished");
      expect(dimTriads).toHaveLength(12);

      dimTriads.forEach((triad) => {
        expect(triad.quality).toBe("diminished");
        expect(triad.symbol).toContain("°");
      });
    });

    test("generates all augmented triads", () => {
      const augTriads = getAllTriads("augmented");
      expect(augTriads).toHaveLength(12);

      augTriads.forEach((triad) => {
        expect(triad.quality).toBe("augmented");
        expect(triad.symbol).toContain("+");
      });
    });
  });
});
