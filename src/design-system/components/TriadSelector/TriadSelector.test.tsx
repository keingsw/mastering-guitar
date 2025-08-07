import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TriadSelector } from './TriadSelector';

describe('TriadSelector Component', () => {
  const mockOnChange = vi.fn();
  const mockOnFretClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the triad selector interface with all sections', () => {
      render(<TriadSelector />);
      
      // Check main component structure
      const selector = screen.getByRole('application', { name: /triad selector interface/i });
      expect(selector).toBeInTheDocument();

      // Check all three main sections
      expect(screen.getByRole('group', { name: /root note/i })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: /triad quality/i })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: /neck position/i })).toBeInTheDocument();
    });

    it('renders all 12 chromatic notes in the root note picker', () => {
      render(<TriadSelector />);
      
      const rootNoteSection = screen.getByRole('group', { name: /root note/i });
      const noteOptions = within(rootNoteSection).getAllByRole('radio');
      
      expect(noteOptions).toHaveLength(12);
      
      // Check for specific notes
      expect(within(rootNoteSection).getByDisplayValue('C')).toBeInTheDocument();
      expect(within(rootNoteSection).getByDisplayValue('C#')).toBeInTheDocument();
      expect(within(rootNoteSection).getByDisplayValue('G')).toBeInTheDocument();
    });

    it('renders all four triad qualities', () => {
      render(<TriadSelector />);
      
      const qualitySection = screen.getByRole('group', { name: /triad quality/i });
      const qualityOptions = within(qualitySection).getAllByRole('radio');
      
      expect(qualityOptions).toHaveLength(4);
      expect(within(qualitySection).getByDisplayValue('major')).toBeInTheDocument();
      expect(within(qualitySection).getByDisplayValue('minor')).toBeInTheDocument();
      expect(within(qualitySection).getByDisplayValue('diminished')).toBeInTheDocument();
      expect(within(qualitySection).getByDisplayValue('augmented')).toBeInTheDocument();
    });

    it('renders basic neck positions by default', () => {
      render(<TriadSelector />);
      
      const positionSection = screen.getByRole('group', { name: /neck position/i });
      const positionOptions = within(positionSection).getAllByRole('radio');
      
      expect(positionOptions).toHaveLength(3);
      expect(within(positionSection).getByDisplayValue('open')).toBeInTheDocument();
      expect(within(positionSection).getByDisplayValue('position-3')).toBeInTheDocument();
      expect(within(positionSection).getByDisplayValue('position-5')).toBeInTheDocument();
    });

    it('renders advanced positions when enabled', () => {
      render(<TriadSelector showAdvancedPositions />);
      
      const positionSection = screen.getByRole('group', { name: /neck position/i });
      const positionOptions = within(positionSection).getAllByRole('radio');
      
      expect(positionOptions).toHaveLength(6);
      expect(within(positionSection).getByDisplayValue('position-12')).toBeInTheDocument();
    });

    it('displays current selection information', () => {
      render(<TriadSelector />);
      
      expect(screen.getByRole('heading', { level: 3, name: /current selection/i })).toBeInTheDocument();
      
      // Use more specific selectors to avoid conflicts with screen reader text
      const currentSection = document.querySelector('.triad-selector__current');
      expect(currentSection).toBeInTheDocument();
      expect(currentSection?.textContent).toMatch(/C chord in Open Position/);
      expect(currentSection?.textContent).toMatch(/notes.*C.*E.*G/i);
    });

    it('renders integrated fretboard chart', () => {
      render(<TriadSelector />);
      
      expect(screen.getByText(/chord chart/i)).toBeInTheDocument();
      // Check for fretboard SVG element instead of img role
      const fretboard = document.querySelector('[data-testid="fretboard-svg"]') || 
                       document.querySelector('svg[aria-label*="chord chart"]');
      expect(fretboard).toBeInTheDocument();
    });
  });

  describe('Initial State', () => {
    it('uses default values when no initial selection provided', () => {
      render(<TriadSelector onChange={mockOnChange} />);
      
      // Check default selections
      const rootNoteSection = screen.getByRole('group', { name: /root note/i });
      expect(within(rootNoteSection).getByDisplayValue('C')).toBeChecked();
      
      const qualitySection = screen.getByRole('group', { name: /triad quality/i });
      expect(within(qualitySection).getByDisplayValue('major')).toBeChecked();
      
      const positionSection = screen.getByRole('group', { name: /neck position/i });
      expect(within(positionSection).getByDisplayValue('open')).toBeChecked();
    });

    it('applies initial selection when provided', () => {
      const initialSelection = {
        rootNote: 'G' as const,
        quality: 'minor' as const,
        neckPosition: 'position-5' as const,
      };

      render(<TriadSelector initialSelection={initialSelection} onChange={mockOnChange} />);
      
      const rootNoteSection = screen.getByRole('group', { name: /root note/i });
      expect(within(rootNoteSection).getByDisplayValue('G')).toBeChecked();
      
      const qualitySection = screen.getByRole('group', { name: /triad quality/i });
      expect(within(qualitySection).getByDisplayValue('minor')).toBeChecked();
      
      const positionSection = screen.getByRole('group', { name: /neck position/i });
      expect(within(positionSection).getByDisplayValue('position-5')).toBeChecked();
      
      const currentSection = document.querySelector('.triad-selector__current');
      expect(currentSection?.textContent).toMatch(/Gm chord in 5th Position/);
    });
  });

  describe('User Interactions', () => {
    it('handles root note selection changes', async () => {
      const user = userEvent.setup();
      render(<TriadSelector onChange={mockOnChange} />);
      
      const rootNoteSection = screen.getByRole('group', { name: /root note/i });
      const gNoteOption = within(rootNoteSection).getByDisplayValue('G');
      
      await user.click(gNoteOption);
      
      expect(mockOnChange).toHaveBeenCalledWith({
        rootNote: 'G',
        quality: 'major',
        neckPosition: 'open',
      });
      
      const currentSection = document.querySelector('.triad-selector__current');
      expect(currentSection?.textContent).toMatch(/G chord in Open Position/);
      expect(currentSection?.textContent).toMatch(/notes.*G.*B.*D/i);
    });

    it('handles triad quality selection changes', async () => {
      const user = userEvent.setup();
      render(<TriadSelector onChange={mockOnChange} />);
      
      const qualitySection = screen.getByRole('group', { name: /triad quality/i });
      const minorOption = within(qualitySection).getByDisplayValue('minor');
      
      await user.click(minorOption);
      
      expect(mockOnChange).toHaveBeenCalledWith({
        rootNote: 'C',
        quality: 'minor',
        neckPosition: 'open',
      });
      
      const currentSection = document.querySelector('.triad-selector__current');
      expect(currentSection?.textContent).toMatch(/Cm chord in Open Position/);
      expect(currentSection?.textContent).toMatch(/notes.*C.*D#.*G/i);
    });

    it('handles neck position selection changes', async () => {
      const user = userEvent.setup();
      render(<TriadSelector onChange={mockOnChange} />);
      
      const positionSection = screen.getByRole('group', { name: /neck position/i });
      const fifthPositionOption = within(positionSection).getByDisplayValue('position-5');
      
      await user.click(fifthPositionOption);
      
      expect(mockOnChange).toHaveBeenCalledWith({
        rootNote: 'C',
        quality: 'major',
        neckPosition: 'position-5',
      });
      
      const currentSection = document.querySelector('.triad-selector__current');
      expect(currentSection?.textContent).toMatch(/C chord in 5th Position/);
    });

    it('handles complex chord selections correctly', async () => {
      const user = userEvent.setup();
      render(<TriadSelector onChange={mockOnChange} />);
      
      // Select F# augmented
      const rootNoteSection = screen.getByRole('group', { name: /root note/i });
      await user.click(within(rootNoteSection).getByDisplayValue('F#'));
      
      const qualitySection = screen.getByRole('group', { name: /triad quality/i });
      await user.click(within(qualitySection).getByDisplayValue('augmented'));
      
      const currentSection = document.querySelector('.triad-selector__current');
      expect(currentSection?.textContent).toMatch(/F#aug chord/);
      expect(currentSection?.textContent).toMatch(/notes.*F#.*A#.*D/i); // F# augmented: F# + A# + D
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports arrow key navigation within root note picker', async () => {
      const user = userEvent.setup();
      render(<TriadSelector onChange={mockOnChange} />);
      
      const rootNoteSection = screen.getByRole('group', { name: /root note/i });
      const cNoteOption = within(rootNoteSection).getByDisplayValue('C');
      
      // Focus on C note and navigate with arrow keys
      cNoteOption.focus();
      await user.keyboard('{ArrowDown}');
      
      expect(mockOnChange).toHaveBeenCalledWith({
        rootNote: 'C#',
        quality: 'major',
        neckPosition: 'open',
      });
    });

    it('supports arrow key navigation within quality selector', async () => {
      const user = userEvent.setup();
      render(<TriadSelector onChange={mockOnChange} />);
      
      const qualitySection = screen.getByRole('group', { name: /triad quality/i });
      
      // Focus on first quality option and navigate
      const majorOption = within(qualitySection).getByDisplayValue('major');
      majorOption.focus();
      await user.keyboard('{ArrowDown}');
      
      expect(mockOnChange).toHaveBeenCalledWith({
        rootNote: 'C',
        quality: 'minor',
        neckPosition: 'open',
      });
    });

    it('wraps around when navigating past the last option', async () => {
      const user = userEvent.setup();
      render(<TriadSelector onChange={mockOnChange} />);
      
      const rootNoteSection = screen.getByRole('group', { name: /root note/i });
      const bNoteOption = within(rootNoteSection).getByDisplayValue('B');
      
      // Select B and navigate down (should wrap to C)
      await user.click(bNoteOption);
      rootNoteSection.focus();
      await user.keyboard('{ArrowDown}');
      
      expect(mockOnChange).toHaveBeenLastCalledWith({
        rootNote: 'C',
        quality: 'major',
        neckPosition: 'open',
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA structure', () => {
      render(<TriadSelector aria-label="Custom triad selector" />);
      
      const selector = screen.getByRole('application', { name: 'Custom triad selector' });
      expect(selector).toBeInTheDocument();
      expect(selector).toHaveAttribute('role', 'application');
    });

    it('provides screen reader descriptions', () => {
      render(<TriadSelector />);
      
      // Check for screen reader description
      const description = screen.getByText(/interactive triad selector with root note picker/i);
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass('sr-only');
    });

    it('has proper radiogroup roles', () => {
      render(<TriadSelector />);
      
      const rootNoteGroup = screen.getByRole('group', { name: /root note/i });
      const rootNoteRadioGroup = within(rootNoteGroup).getByRole('radiogroup');
      expect(rootNoteRadioGroup).toBeInTheDocument();
      
      const qualityGroup = screen.getByRole('group', { name: /triad quality/i });
      const qualityRadioGroup = within(qualityGroup).getByRole('radiogroup');
      expect(qualityRadioGroup).toBeInTheDocument();
    });

    it('provides descriptive labels for each option', () => {
      render(<TriadSelector />);
      
      // Check that descriptive elements exist for screen readers
      const rootNoteSection = screen.getByRole('group', { name: /root note/i });
      const cSharpInput = within(rootNoteSection).getByDisplayValue('C#');
      expect(cSharpInput).toHaveAttribute('aria-describedby');
      
      const qualitySection = screen.getByRole('group', { name: /triad quality/i });
      const majorInput = within(qualitySection).getByDisplayValue('major');
      expect(majorInput).toHaveAttribute('aria-describedby');
      
      const positionSection = screen.getByRole('group', { name: /neck position/i });
      const fifthPosInput = within(positionSection).getByDisplayValue('position-5');
      expect(fifthPosInput).toHaveAttribute('aria-describedby');
    });

    it('updates live region when selection changes', async () => {
      const user = userEvent.setup();
      render(<TriadSelector />);
      
      const liveRegion = screen.getByRole('heading', { level: 3, name: /current selection/i }).closest('div');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
      
      // Change selection and verify live region updates
      const qualitySection = screen.getByRole('group', { name: /triad quality/i });
      await user.click(within(qualitySection).getByDisplayValue('minor'));
      
      await waitFor(() => {
        const currentSection = document.querySelector('.triad-selector__current');
        expect(currentSection?.textContent).toMatch(/Cm chord in Open Position/);
      });
    });

    it('provides proper focus management', async () => {
      const user = userEvent.setup();
      render(<TriadSelector />);
      
      const rootNoteSection = screen.getByRole('group', { name: /root note/i });
      const firstNote = within(rootNoteSection).getAllByRole('radio')[0];
      
      await user.click(firstNote);
      expect(firstNote).toHaveFocus();
    });
  });

  describe('Fretboard Integration', () => {
    it('passes correct triad positions to fretboard', () => {
      render(<TriadSelector />);
      
      // Check that fretboard is rendered with triad positions
      const fretboard = document.querySelector('svg[aria-label*="C chord chart"]') ||
                       document.querySelector('[data-testid="fretboard-svg"]');
      expect(fretboard).toBeInTheDocument();
    });

    it('forwards fret click events', async () => {
      const user = userEvent.setup();
      render(<TriadSelector onFretClick={mockOnFretClick} />);
      
      // Find and click a fret position on the fretboard
      const fretPosition = screen.getByTestId('fret-position-3-1');
      const clickableArea = fretPosition.querySelector('circle[role="button"]');
      
      await user.click(clickableArea!);
      
      expect(mockOnFretClick).toHaveBeenCalledWith(
        expect.objectContaining({
          fret: 3,
          string: 1,
          note: expect.any(String),
        })
      );
    });

    it('updates fretboard when selection changes', async () => {
      const user = userEvent.setup();
      render(<TriadSelector />);
      
      // Change to G major
      const rootNoteSection = screen.getByRole('group', { name: /root note/i });
      await user.click(within(rootNoteSection).getByDisplayValue('G'));
      
      await waitFor(() => {
        const fretboard = document.querySelector('svg[aria-label*="G chord chart"]');
        expect(fretboard).toBeInTheDocument();
      });
    });
  });

  describe('Performance and Edge Cases', () => {
    it('handles rapid selection changes without errors', async () => {
      const user = userEvent.setup();
      render(<TriadSelector onChange={mockOnChange} />);
      
      const rootNoteSection = screen.getByRole('group', { name: /root note/i });
      const notes = within(rootNoteSection).getAllByRole('radio');
      
      // Click through notes (skipping C which is already selected)
      for (let i = 1; i < 5; i++) {
        await user.click(notes[i]);
      }
      
      expect(mockOnChange).toHaveBeenCalledTimes(4);
      expect(mockOnChange).toHaveBeenLastCalledWith({
        rootNote: 'E',
        quality: 'major',
        neckPosition: 'open',
      });
    });

    it('maintains component state consistency', async () => {
      const user = userEvent.setup();
      render(<TriadSelector />);
      
      // Make several changes
      const rootNoteSection = screen.getByRole('group', { name: /root note/i });
      await user.click(within(rootNoteSection).getByDisplayValue('A'));
      
      const qualitySection = screen.getByRole('group', { name: /triad quality/i });
      await user.click(within(qualitySection).getByDisplayValue('diminished'));
      
      const positionSection = screen.getByRole('group', { name: /neck position/i });
      await user.click(within(positionSection).getByDisplayValue('position-3'));
      
      // Verify final state
      const currentSection = document.querySelector('.triad-selector__current');
      expect(currentSection?.textContent).toMatch(/Adim chord in 3rd Position/);
      expect(currentSection?.textContent).toMatch(/notes.*A.*C.*D#/i); // A diminished triad
    });

    it('handles different component sizes', () => {
      const { rerender } = render(<TriadSelector size="sm" />);
      let container = screen.getByRole('application').closest('.triad-selector');
      expect(container).toHaveClass('triad-selector--sm');

      rerender(<TriadSelector size="lg" />);
      container = screen.getByRole('application').closest('.triad-selector');
      expect(container).toHaveClass('triad-selector--lg');
    });
  });
});