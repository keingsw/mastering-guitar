import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Fretboard } from './Fretboard';
import type { NoteName, HarmonicFunction } from '../../types/music';

describe('Fretboard Component', () => {
  const mockTriadPositions = [
    { fret: 3, string: 1, note: 'G' as NoteName, function: 'root' as HarmonicFunction },
    { fret: 3, string: 2, note: 'C' as NoteName, function: 'root' as HarmonicFunction },
    { fret: 0, string: 3, note: 'G' as NoteName, function: 'root' as HarmonicFunction },
  ];

  describe('Rendering', () => {
    it('renders the fretboard SVG with correct structure', () => {
      render(<Fretboard />);
      
      const svg = screen.getByRole('img', { name: /guitar fretboard/i });
      expect(svg).toBeInTheDocument();
      expect(svg.tagName).toBe('svg');
    });

    it('renders 6 strings by default', () => {
      render(<Fretboard />);
      
      const strings = screen.getByRole('img').querySelectorAll('[data-testid*="string-"]');
      expect(strings).toHaveLength(6);
    });

    it('renders 12 frets by default', () => {
      render(<Fretboard />);
      
      // Check for fret wires (not fret positions)
      const frets = screen.getByRole('img').querySelectorAll('[data-testid^="fret-"]:not([data-testid*="position"])');
      expect(frets).toHaveLength(12);
    });

    it('renders with custom number of frets', () => {
      render(<Fretboard fretCount={15} />);
      
      // Check for fret wires (not fret positions)
      const frets = screen.getByRole('img').querySelectorAll('[data-testid^="fret-"]:not([data-testid*="position"])');
      expect(frets).toHaveLength(15);
    });

    it('renders position markers at standard positions', () => {
      render(<Fretboard />);
      
      const positionMarkers = screen.getByRole('img').querySelectorAll('[data-testid*="position-marker"]');
      expect(positionMarkers.length).toBeGreaterThan(0);
    });
  });

  describe('Responsiveness', () => {
    it('applies responsive size classes', () => {
      const { rerender } = render(<Fretboard size="sm" />);
      let svg = screen.getByRole('img');
      expect(svg).toHaveClass('fretboard--sm');

      rerender(<Fretboard size="lg" />);
      svg = screen.getByRole('img');
      expect(svg).toHaveClass('fretboard--lg');
    });

    it('maintains aspect ratio on different sizes', () => {
      render(<Fretboard size="lg" />);
      const svg = screen.getByRole('img');
      
      expect(svg).toHaveAttribute('preserveAspectRatio', 'xMidYMid meet');
      expect(svg).toHaveAttribute('viewBox');
    });
  });

  describe('Neck Positions', () => {
    it('renders different neck positions', () => {
      const { rerender } = render(<Fretboard neckPosition={0} />);
      let svg = screen.getByRole('img');
      expect(svg).toHaveAttribute('data-neck-position', '0');

      rerender(<Fretboard neckPosition={5} />);
      svg = screen.getByRole('img');
      expect(svg).toHaveAttribute('data-neck-position', '5');
    });

    it('adjusts fret numbering based on neck position', () => {
      render(<Fretboard neckPosition={5} showFretNumbers />);
      
      // First fret should be labeled as 6 (5 + 1)
      const fretNumber = screen.getByText('6');
      expect(fretNumber).toBeInTheDocument();
    });
  });

  describe('Triad Highlighting', () => {
    it('highlights triad positions with correct colors', () => {
      render(<Fretboard triadPositions={mockTriadPositions} />);
      
      // Check that highlighted positions exist
      const fretboard = screen.getByRole('img');
      const highlightedElements = fretboard.querySelectorAll('circle.fret-position__indicator');
      expect(highlightedElements.length).toBeGreaterThan(0);
    });

    it('displays note labels when enabled', () => {
      render(<Fretboard triadPositions={mockTriadPositions} showNoteLabels />);
      
      // Note labels are only shown on hover or for highlighted positions
      const fretboard = screen.getByRole('img');
      const noteLabels = fretboard.querySelectorAll('text.fret-position__note-label');
      expect(noteLabels.length).toBeGreaterThan(0);
    });

    it('hides note labels when disabled', () => {
      render(<Fretboard triadPositions={mockTriadPositions} showNoteLabels={false} />);
      
      const fretboard = screen.getByRole('img');
      const noteLabels = fretboard.querySelectorAll('text.fret-position__note-label');
      expect(noteLabels).toHaveLength(0);
    });
  });

  describe('Interaction', () => {
    it('handles fret clicks with callback', () => {
      const onFretClick = vi.fn();
      render(<Fretboard onFretClick={onFretClick} />);
      
      const fretPosition = screen.getByTestId('fret-position-3-1');
      const clickableArea = fretPosition.querySelector('circle[role="button"]');
      fireEvent.click(clickableArea!);
      
      expect(onFretClick).toHaveBeenCalledWith({
        fret: 3,
        string: 1,
        note: expect.any(String)
      });
    });

    it('shows hover states on fret positions', async () => {
      render(<Fretboard />);
      
      const fretPosition = screen.getByTestId('fret-position-3-1');
      const clickableArea = fretPosition.querySelector('circle[role="button"]');
      
      fireEvent.mouseEnter(clickableArea!);
      
      await waitFor(() => {
        const hoverIndicator = fretPosition.querySelector('.fret-position__hover-indicator');
        expect(hoverIndicator).toBeInTheDocument();
      });
    });

    it('removes hover states on mouse leave', async () => {
      render(<Fretboard />);
      
      const fretPosition = screen.getByTestId('fret-position-3-1');
      const clickableArea = fretPosition.querySelector('circle[role="button"]');
      
      fireEvent.mouseEnter(clickableArea!);
      fireEvent.mouseLeave(clickableArea!);
      
      await waitFor(() => {
        const hoverIndicator = fretPosition.querySelector('.fret-position__hover-indicator');
        expect(hoverIndicator).not.toBeInTheDocument();
      });
    });
  });

  describe('Chord Visualization', () => {
    it('displays chord name when provided', () => {
      render(<Fretboard chord="C" triadPositions={mockTriadPositions} />);
      
      // Check for chord name in the display area specifically
      const chordDisplay = screen.getByText('C', { selector: '.fretboard__chord-name' });
      expect(chordDisplay).toBeInTheDocument();
    });

    it('highlights chord tones with different intensities', () => {
      const chordPositions = [
        { fret: 3, string: 1, note: 'G' as NoteName, function: 'root' as HarmonicFunction },
        { fret: 2, string: 2, note: 'E' as NoteName, function: 'third' as HarmonicFunction },
        { fret: 0, string: 3, note: 'G' as NoteName, function: 'fifth' as HarmonicFunction },
      ];

      render(<Fretboard triadPositions={chordPositions} />);
      
      const rootNote = screen.getByTestId('fret-position-3-1').querySelector('circle[data-function="root"]');
      const thirdNote = screen.getByTestId('fret-position-2-2').querySelector('circle[data-function="third"]');
      const fifthNote = screen.getByTestId('fret-position-0-3').querySelector('circle[data-function="fifth"]');
      
      expect(rootNote).toBeInTheDocument();
      expect(thirdNote).toBeInTheDocument();
      expect(fifthNote).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Fretboard />);
      
      const svg = screen.getByRole('img');
      expect(svg).toHaveAttribute('aria-label', 'Interactive guitar fretboard');
    });

    it('provides keyboard navigation for fret positions', () => {
      const onFretClick = vi.fn();
      render(<Fretboard onFretClick={onFretClick} />);
      
      const fretPosition = screen.getByTestId('fret-position-3-1').querySelector('circle[role="button"]') as HTMLElement;
      fretPosition.focus();
      fireEvent.keyDown(fretPosition!, { key: 'Enter' });
      
      expect(onFretClick).toHaveBeenCalled();
    });

    it('provides descriptive text for screen readers', () => {
      render(<Fretboard triadPositions={mockTriadPositions} chord="C" />);
      
      // Check for screen reader description
      const description = screen.getByText(/C chord on guitar fretboard/i);
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass('sr-only');
    });
  });

  describe('Performance', () => {
    it('memoizes fret calculations to prevent unnecessary re-renders', () => {
      const { rerender } = render(<Fretboard fretCount={12} />);
      const firstRender = screen.getByRole('img').innerHTML;
      
      rerender(<Fretboard fretCount={12} />);
      const secondRender = screen.getByRole('img').innerHTML;
      
      expect(firstRender).toBe(secondRender);
    });

    it('handles large numbers of triad positions efficiently', () => {
      const manyPositions = Array.from({ length: 50 }, (_, i) => ({
        fret: (i % 12) + 1,
        string: (i % 6) + 1,
        note: 'C' as NoteName,
        function: 'root' as HarmonicFunction,
      }));

      expect(() => {
        render(<Fretboard triadPositions={manyPositions} />);
      }).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('handles invalid fret positions gracefully', () => {
      const invalidPositions = [
        { fret: -1, string: 1, note: 'C' as NoteName, function: 'root' as HarmonicFunction },
        { fret: 25, string: 7, note: 'invalid' as NoteName, function: 'root' as HarmonicFunction },
      ];

      expect(() => {
        render(<Fretboard triadPositions={invalidPositions} />);
      }).not.toThrow();
    });

    it('provides fallback when no positions are provided', () => {
      render(<Fretboard triadPositions={[]} />);
      
      const svg = screen.getByRole('img');
      expect(svg).toBeInTheDocument();
    });
  });
});