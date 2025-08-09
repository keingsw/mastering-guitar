/**
 * Integration Tests - TriadSelector and Fretboard
 * 
 * These tests verify that the TriadSelector and Fretboard components
 * work correctly together, specifically testing note calculations
 * and position highlighting across different neck positions.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TriadSelector } from './TriadSelector/TriadSelector';

describe('TriadSelector + Fretboard Integration (TDD)', () => {
  describe('C Major Triad in Open Position', () => {
    it('highlights only C, E, and G notes on the fretboard', () => {
      render(
        <TriadSelector 
          initialSelection={{
            rootNote: 'C',
            quality: 'major',
            neckPosition: 'open'
          }}
        />
      );

      // Check that fretboard shows C major chord positions
      const fretboard = screen.getByLabelText(/fretboard visualization/i);
      expect(fretboard).toBeInTheDocument();
      
      // Look for highlighted positions (colored circles)
      const highlightedPositions = fretboard.querySelectorAll('circle.fret-position__indicator');
      expect(highlightedPositions.length).toBeGreaterThan(0);
      
      // Each highlighted position should correspond to C, E, or G
      const expectedTriadNotes = ['C', 'E', 'G'];
      highlightedPositions.forEach(circle => {
        const position = circle.closest('[data-testid^="fret-position-"]');
        expect(position).toBeInTheDocument();
        
        // The note should be one of the triad notes
        const noteLabel = position?.querySelector('.fret-position__note-label');
        if (noteLabel) {
          const noteText = noteLabel.textContent;
          expect(expectedTriadNotes).toContain(noteText);
        }
      });
    });

    it('calculates correct fret positions for C major in open position', () => {
      const onFretClick = vi.fn();
      render(
        <TriadSelector 
          initialSelection={{
            rootNote: 'C',
            quality: 'major',
            neckPosition: 'open'
          }}
          onFretClick={onFretClick}
        />
      );

      // Test specific known positions for C major in open position
      // String 3 (D), fret 2 should be E (third) - D + 2 semitones = E
      const ePosition = screen.getByTestId('fret-position-2-3');
      const eClickable = ePosition?.querySelector('circle[role="button"]');
      if (eClickable) {
        fireEvent.click(eClickable);
        expect(onFretClick).toHaveBeenCalledWith(expect.objectContaining({
          note: 'E',
          function: 'third'
        }));
      }

      // String 4 (G), fret 0 should be G (fifth)
      const gPosition = screen.getByTestId('fret-position-0-4');
      const gClickable = gPosition?.querySelector('circle[role="button"]');
      if (gClickable) {
        fireEvent.click(gClickable);
        expect(onFretClick).toHaveBeenCalledWith(expect.objectContaining({
          note: 'G',
          function: 'fifth'
        }));
      }
    });
  });

  describe('C Major Triad in 3rd Position', () => {
    it('highlights correct positions in 3rd position without double offset', () => {
      render(
        <TriadSelector 
          initialSelection={{
            rootNote: 'C',
            quality: 'major',
            neckPosition: 'position-3'
          }}
        />
      );

      // The chord display should show C (not incorrect notes)
      expect(screen.getByText('C - E - G')).toBeInTheDocument();
      
      // Fretboard should highlight the correct positions for C major in 3rd position
      const fretboard = screen.getByLabelText(/fretboard visualization/i);
      const highlightedPositions = fretboard.querySelectorAll('circle.fret-position__indicator');
      
      expect(highlightedPositions.length).toBeGreaterThan(0);
      
      // Should NOT highlight A# or D# (the bug we're fixing)
      const wrongNotes = ['A#', 'D#', 'F#'];
      const noteLabels = fretboard.querySelectorAll('.fret-position__note-label');
      noteLabels.forEach(label => {
        // Only check highlighted notes (those with colored circles)
        const position = label.closest('[data-testid^="fret-position-"]');
        const hasHighlight = position?.querySelector('.fret-position__indicator');
        
        if (hasHighlight) {
          const noteText = label.textContent;
          expect(wrongNotes).not.toContain(noteText);
          expect(['C', 'E', 'G']).toContain(noteText);
        }
      });
    });
    
    it('TriadSelector and Fretboard agree on note calculations', () => {
      const onFretClick = vi.fn();
      render(
        <TriadSelector 
          initialSelection={{
            rootNote: 'C',
            quality: 'major',
            neckPosition: 'position-3'
          }}
          onFretClick={onFretClick}
        />
      );

      // Click on highlighted positions and verify they return correct notes
      const fretboard = screen.getByLabelText(/fretboard visualization/i);
      const highlightedPositions = fretboard.querySelectorAll('circle.fret-position__indicator');
      
      // Test at least one highlighted position
      if (highlightedPositions.length > 0) {
        const firstHighlight = highlightedPositions[0];
        const clickableArea = firstHighlight.closest('[data-testid^="fret-position-"]')
          ?.querySelector('circle[role="button"]');
        
        if (clickableArea) {
          fireEvent.click(clickableArea);
          
          // The callback should return one of the triad notes
          expect(onFretClick).toHaveBeenCalledWith(
            expect.objectContaining({
              note: expect.stringMatching(/^(C|E|G)$/)
            })
          );
        }
      }
    });
  });

  describe('Note Calculation Consistency', () => {
    it('maintains consistent note calculations across different neck positions', () => {
      // Test that the same fret/string combination returns predictable notes
      // regardless of neck position (within the display range)
      
      const positions = [
        { neckPosition: 'open', expectedNotes: ['C', 'E', 'G'] },
        { neckPosition: 'position-3', expectedNotes: ['C', 'E', 'G'] },
        { neckPosition: 'position-5', expectedNotes: ['C', 'E', 'G'] }
      ];

      positions.forEach(({ neckPosition, expectedNotes }) => {
        render(
          <TriadSelector 
            initialSelection={{
              rootNote: 'C',
              quality: 'major',
              neckPosition: neckPosition as any
            }}
          />
        );

        // Should always display the same chord notes
        expect(screen.getByText('C - E - G')).toBeInTheDocument();
        
        // Clean up for next render
        document.body.innerHTML = '';
      });
    });

    it('different triads show different notes correctly', () => {
      const triads = [
        { quality: 'major', expectedNotes: ['C', 'E', 'G'] },
        { quality: 'minor', expectedNotes: ['C', 'D#', 'G'] },  // D# = Eb (minor third)
        { quality: 'diminished', expectedNotes: ['C', 'D#', 'F#'] }, // D# = Eb, F# = Gb
        { quality: 'augmented', expectedNotes: ['C', 'E', 'G#'] }  // G# = Ab (augmented fifth)
      ];

      triads.forEach(({ quality, expectedNotes }) => {
        render(
          <TriadSelector 
            initialSelection={{
              rootNote: 'C',
              quality: quality as any,
              neckPosition: 'open'
            }}
          />
        );

        // Should display the correct chord notes
        expect(screen.getByText(expectedNotes.join(' - '))).toBeInTheDocument();
        
        // Clean up for next render
        document.body.innerHTML = '';
      });
    });
  });
});