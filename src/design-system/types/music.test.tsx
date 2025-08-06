/**
 * Tests for music type validation utilities
 */

import { describe, it, expect } from 'vitest';
import { 
  isValidNoteName, 
  isValidChordSymbol, 
  isValidInterval, 
  normalizeNoteName,
  MusicValidationErrors 
} from './music';

describe('Music Type Validation', () => {
  describe('Note Name Validation', () => {
    it('should accept valid natural notes', () => {
      const validNaturalNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
      validNaturalNotes.forEach(note => {
        expect(isValidNoteName(note)).toBe(true);
      });
    });

    it('should accept valid sharp notes', () => {
      const validSharpNotes = ['C#', 'D#', 'F#', 'G#', 'A#'];
      validSharpNotes.forEach(note => {
        expect(isValidNoteName(note)).toBe(true);
      });
    });

    it('should accept valid flat notes', () => {
      const validFlatNotes = ['Db', 'Eb', 'Gb', 'Ab', 'Bb'];
      validFlatNotes.forEach(note => {
        expect(isValidNoteName(note)).toBe(true);
      });
    });

    it('should reject invalid note names', () => {
      const invalidNotes = ['H', 'X', 'C##', 'Dbb', 'invalid', '', '123'];
      invalidNotes.forEach(note => {
        expect(isValidNoteName(note)).toBe(false);
      });
    });

    it('should normalize enharmonic equivalents', () => {
      expect(normalizeNoteName('Db')).toBe('C#');
      expect(normalizeNoteName('Eb')).toBe('D#');
      expect(normalizeNoteName('Gb')).toBe('F#');
      expect(normalizeNoteName('Ab')).toBe('G#');
      expect(normalizeNoteName('Bb')).toBe('A#');
      
      // Should not change non-enharmonic notes
      expect(normalizeNoteName('C')).toBe('C');
      expect(normalizeNoteName('F#')).toBe('F#');
    });
  });

  describe('Chord Symbol Validation', () => {
    it('should accept valid major chords', () => {
      const validMajorChords = ['C', 'Cmaj', 'Cmajor', 'F#', 'Bbmaj'];
      validMajorChords.forEach(chord => {
        expect(isValidChordSymbol(chord)).toBe(true);
      });
    });

    it('should accept valid minor chords', () => {
      const validMinorChords = ['Am', 'Amin', 'Aminor', 'C#m', 'Bbmin'];
      validMinorChords.forEach(chord => {
        expect(isValidChordSymbol(chord)).toBe(true);
      });
    });

    it('should accept valid diminished chords', () => {
      const validDimChords = ['Bdim', 'F#dim', 'C°', 'A#°'];
      validDimChords.forEach(chord => {
        expect(isValidChordSymbol(chord)).toBe(true);
      });
    });

    it('should accept valid seventh chords', () => {
      const validSeventhChords = ['C7', 'Cmaj7', 'Am7', 'F#dim7', 'Baug7'];
      validSeventhChords.forEach(chord => {
        expect(isValidChordSymbol(chord)).toBe(true);
      });
    });

    it('should accept valid suspended chords', () => {
      const validSusChords = ['Csus2', 'Fsus4', 'G#sus2', 'Bbsus4'];
      validSusChords.forEach(chord => {
        expect(isValidChordSymbol(chord)).toBe(true);
      });
    });

    it('should accept valid extended chords', () => {
      const validExtendedChords = ['C9', 'Fmaj9', 'Am9', 'G11', 'D13'];
      validExtendedChords.forEach(chord => {
        expect(isValidChordSymbol(chord)).toBe(true);
      });
    });

    it('should reject invalid chord symbols', () => {
      const invalidChords = ['H7', 'Cxyz', '123', 'C#####', 'invalid', ''];
      invalidChords.forEach(chord => {
        expect(isValidChordSymbol(chord)).toBe(false);
      });
    });
  });

  describe('Interval Validation', () => {
    it('should accept valid intervals', () => {
      const validIntervals = ['R', 'm2', 'M2', 'm3', 'M3', 'P4', 'TT', 'P5', 'm6', 'M6', 'm7', 'M7', 'P8'];
      validIntervals.forEach(interval => {
        expect(isValidInterval(interval)).toBe(true);
      });
    });

    it('should reject invalid intervals', () => {
      const invalidIntervals = ['X', 'invalid', '123', '', 'P1', 'm4', 'M4'];
      invalidIntervals.forEach(interval => {
        expect(isValidInterval(interval)).toBe(false);
      });
    });
  });

  describe('Error Messages', () => {
    it('should provide helpful error messages for invalid notes', () => {
      const errorMessage = MusicValidationErrors.INVALID_NOTE('X');
      expect(errorMessage).toContain('Invalid note name: "X"');
      expect(errorMessage).toContain('Must be one of: C, C#, Db');
    });

    it('should provide helpful error messages for invalid chords', () => {
      const errorMessage = MusicValidationErrors.INVALID_CHORD('Invalid');
      expect(errorMessage).toContain('Invalid chord symbol: "Invalid"');
      expect(errorMessage).toContain('Must follow pattern');
    });

    it('should provide helpful error messages for invalid intervals', () => {
      const errorMessage = MusicValidationErrors.INVALID_INTERVAL('X');
      expect(errorMessage).toContain('Invalid interval: "X"');
      expect(errorMessage).toContain('Must be one of: R, m2, M2');
    });

    it('should provide helpful error messages for invalid functions', () => {
      const errorMessage = MusicValidationErrors.INVALID_FUNCTION('invalid');
      expect(errorMessage).toContain('Invalid harmonic function: "invalid"');
      expect(errorMessage).toContain('Must be one of: root, third, fifth');
    });
  });
});