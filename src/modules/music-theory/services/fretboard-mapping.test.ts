import { describe, expect, test } from "vitest";
import { Note } from "../entities/Note";
import {
  findNoteOnFretboard,
  generateChordVoicings,
  getStandardTuning,
  mapTriadToFretboard,
} from "./fretboard-mapping";
import { generateTriad } from "./triads";

describe("Fretboard mapping", () => {
  describe("getStandardTuning", () => {
    test("returns correct standard guitar tuning", () => {
      const tuning = getStandardTuning();
      expect(tuning).toEqual([
        new Note("E"),
        new Note("B"),
        new Note("G"),
        new Note("D"),
        new Note("A"),
        new Note("E")
      ]);
    });
  });

  describe("findNoteOnFretboard", () => {
    test("finds note on open strings", () => {
      const positions = findNoteOnFretboard(new Note("E"));
      expect(positions.length).toBeGreaterThan(0);

      const openStringEs = positions.filter((p) => p.fret === 0);
      expect(openStringEs).toHaveLength(2);
      expect(openStringEs[0]).toEqual({
        string: 1,
        fret: 0,
        note: new Note("E"),
      });
      expect(openStringEs[1]).toEqual({
        string: 6,
        fret: 0,
        note: new Note("E"),
      });
    });

    test("finds note on fretted positions", () => {
      const positions = findNoteOnFretboard(new Note("C"));
      expect(positions.length).toBeGreaterThan(0);

      const firstStringC = positions.find((p) => p.string === 1 && p.fret === 8);
      expect(firstStringC).toBeDefined();
      expect(firstStringC?.note.name).toBe("C");
    });

    test("limits fret range to 12 frets by default", () => {
      const positions = findNoteOnFretboard(new Note("F#"));
      expect(positions.every((p) => p.fret <= 12)).toBe(true);
    });
  });

  describe("mapTriadToFretboard", () => {
    test("maps C major triad to fretboard", () => {
      const cMajor = generateTriad(new Note("C"), "major");
      const positions = mapTriadToFretboard(cMajor);

      expect(positions.length).toBeGreaterThan(0);

      const cPositions = positions.filter((p) => p.note.name === "C");
      const ePositions = positions.filter((p) => p.note.name === "E");
      const gPositions = positions.filter((p) => p.note.name === "G");

      expect(cPositions.length).toBeGreaterThan(0);
      expect(ePositions.length).toBeGreaterThan(0);
      expect(gPositions.length).toBeGreaterThan(0);

      const rootPosition = positions.find((p) => p.isRoot);
      const thirdPosition = positions.find((p) => p.isThird);
      const fifthPosition = positions.find((p) => p.isFifth);

      expect(rootPosition?.note.name).toBe("C");
      expect(thirdPosition?.note.name).toBe("E");
      expect(fifthPosition?.note.name).toBe("G");
    });

    test("maps minor triads correctly", () => {
      const aMinor = generateTriad(new Note("A"), "minor");
      const positions = mapTriadToFretboard(aMinor);

      const rootPositions = positions.filter((p) => p.isRoot);
      const thirdPositions = positions.filter((p) => p.isThird);
      const fifthPositions = positions.filter((p) => p.isFifth);

      expect(rootPositions.every((p) => p.note.name === "A")).toBe(true);
      expect(thirdPositions.every((p) => p.note.name === "C")).toBe(true);
      expect(fifthPositions.every((p) => p.note.name === "E")).toBe(true);
    });
  });

  describe("generateChordVoicings", () => {
    test("generates basic chord voicings for C major", () => {
      const cMajor = generateTriad(new Note("C"), "major");
      const voicings = generateChordVoicings(cMajor);

      expect(voicings.length).toBeGreaterThan(0);

      const beginnerVoicings = voicings.filter((v) => v.difficulty === "beginner");
      expect(beginnerVoicings.length).toBeGreaterThan(0);

      voicings.forEach((voicing) => {
        expect(voicing.positions.length).toBeGreaterThanOrEqual(3);
        expect(voicing.positions.length).toBeLessThanOrEqual(6);
        expect(voicing.fingering.length).toBe(voicing.positions.length);
      });
    });

    test("generates different difficulty levels", () => {
      const gMajor = generateTriad(new Note("G"), "major");
      const voicings = generateChordVoicings(gMajor);

      const difficulties = new Set(voicings.map((v) => v.difficulty));
      expect(difficulties.has("beginner")).toBe(true);
    });

    test("generates voicings across neck positions", () => {
      const dMajor = generateTriad(new Note("D"), "major");
      const voicings = generateChordVoicings(dMajor);

      const neckPositions = new Set(voicings.map((v) => v.neckPosition));
      expect(neckPositions.size).toBeGreaterThan(1);
    });

    test("assigns realistic fingering patterns", () => {
      const eMajor = generateTriad(new Note("E"), "major");
      const voicings = generateChordVoicings(eMajor);

      voicings.forEach((voicing) => {
        expect(voicing.fingering.every((f) => f >= 0 && f <= 4)).toBe(true);

        const frets = voicing.positions.map((p) => p.fret);
        const minFret = Math.min(...frets.filter((f) => f > 0));
        const maxFret = Math.max(...frets);
        expect(maxFret - minFret).toBeLessThanOrEqual(4);
      });
    });
  });
});
