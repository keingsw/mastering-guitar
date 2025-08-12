/**
 * TDD Test for String Mapping Bug
 *
 * Tests the specific bug reported: "5th string (A string) at fret 1 should show A# but shows C"
 * This is a focused test to verify the fix before implementing it.
 */

import { screen } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Fretboard } from "./Fretboard";

describe("String Mapping Bug Fix (TDD)", () => {
  it("5th string (A) shows correct notes - the reported bug", () => {
    render(<Fretboard fretCount={3} showNoteLabels={true} />);

    // Find the circle elements that have the aria-label
    const string5Open = screen.getByTestId("fret-position-0-5").querySelector('circle[role="button"]');
    const string5Fret1 = screen.getByTestId("fret-position-1-5").querySelector('circle[role="button"]');
    const string5Fret2 = screen.getByTestId("fret-position-2-5").querySelector('circle[role="button"]');

    // CURRENT BUG: These tests will fail because string indexing is wrong
    // String 5 (A string) should show: A, A#, B
    // But currently shows: B, C, C# (off by 3 semitones)

    expect(string5Open).toHaveAttribute("aria-label", expect.stringContaining("note A"));
    expect(string5Fret1).toHaveAttribute("aria-label", expect.stringContaining("note A#"));
    expect(string5Fret2).toHaveAttribute("aria-label", expect.stringContaining("note B"));
  });

  it("all strings show correct open string notes", () => {
    render(<Fretboard fretCount={0} showNoteLabels={true} />);

    // Standard tuning (visual order top to bottom): E B G D A E
    const string1 = screen.getByTestId("fret-position-0-1").querySelector('circle[role="button"]');
    const string2 = screen.getByTestId("fret-position-0-2").querySelector('circle[role="button"]');
    const string3 = screen.getByTestId("fret-position-0-3").querySelector('circle[role="button"]');
    const string4 = screen.getByTestId("fret-position-0-4").querySelector('circle[role="button"]');
    const string5 = screen.getByTestId("fret-position-0-5").querySelector('circle[role="button"]');
    const string6 = screen.getByTestId("fret-position-0-6").querySelector('circle[role="button"]');

    // String 1 (top) = High E
    expect(string1).toHaveAttribute("aria-label", expect.stringContaining("note E"));
    // String 2 = B
    expect(string2).toHaveAttribute("aria-label", expect.stringContaining("note B"));
    // String 3 = G
    expect(string3).toHaveAttribute("aria-label", expect.stringContaining("note G"));
    // String 4 = D
    expect(string4).toHaveAttribute("aria-label", expect.stringContaining("note D"));
    // String 5 = A (THE BUG - currently showing B)
    expect(string5).toHaveAttribute("aria-label", expect.stringContaining("note A"));
    // String 6 (bottom) = Low E
    expect(string6).toHaveAttribute("aria-label", expect.stringContaining("note E"));
  });

  it("verifies the STANDARD_TUNING array is correct", () => {
    // This test verifies our understanding of the data structure
    // STANDARD_TUNING: ['E', 'A', 'D', 'G', 'B', 'E'] represents strings 6 to 1
    // But the bug is in how we map string numbers (1-6) to array indices (0-5)

    render(<Fretboard fretCount={0} showNoteLabels={true} />);

    // EXPECTED mapping (what SHOULD happen):
    // String 1 (visual top) -> STANDARD_TUNING[5] = 'E' (high E)
    // String 2 -> STANDARD_TUNING[4] = 'B'
    // String 3 -> STANDARD_TUNING[3] = 'G'
    // String 4 -> STANDARD_TUNING[2] = 'D'
    // String 5 -> STANDARD_TUNING[1] = 'A' ← THE BUG IS HERE
    // String 6 (visual bottom) -> STANDARD_TUNING[0] = 'E' (low E)

    // The fix should be: tuning[6 - stringNumber] instead of tuning[stringIndex]

    const string5 = screen.getByTestId("fret-position-0-5").querySelector('circle[role="button"]');
    expect(string5).toHaveAttribute("aria-label", expect.stringContaining("note A"));
  });
});
