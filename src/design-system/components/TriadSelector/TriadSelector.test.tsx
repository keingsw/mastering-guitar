import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TriadSelector } from './TriadSelector';

describe('TriadSelector Component', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the triad selector interface with vertical controls', () => {
      render(<TriadSelector />);
      
      // Check main component structure
      const selector = screen.getByRole('application', { name: /vertical triad selector with maximized fretboard space/i });
      expect(selector).toBeInTheDocument();

      // Check vertical control sections
      expect(screen.getAllByRole('radiogroup')).toHaveLength(2); // Note grid, Quality controls
      expect(screen.getByText('Maj')).toBeInTheDocument(); // Quality button (short labels)
      expect(screen.getByText('C - E - G')).toBeInTheDocument(); // Chord formula display
    });

    it('renders note grid with all 12 chromatic notes', () => {
      render(<TriadSelector />);
      
      // Find the note grid (no longer needs specific name, just find the radiogroup with notes)
      const noteButtons = screen.getAllByRole('button', { name: /^[A-G]#?$/ }); // Match note names
      expect(noteButtons).toHaveLength(12);
      
      // Check for specific notes
      expect(screen.getByRole('button', { name: 'C' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'C#' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'G' })).toBeInTheDocument();
      
      // Check C is initially active
      expect(screen.getByRole('button', { name: 'C' })).toHaveAttribute('aria-pressed', 'true');
    });

    it('renders quality button group with all four triad qualities', () => {
      render(<TriadSelector />);
      
      // Quality buttons use short labels now
      expect(screen.getByRole('button', { name: 'Maj' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Min' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Dim' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Aug' })).toBeInTheDocument();
      
      // Major is initially active
      expect(screen.getByRole('button', { name: 'Maj' })).toHaveAttribute('aria-pressed', 'true');
      
      // Check short labels
      expect(screen.getByText('Maj')).toBeInTheDocument();
      expect(screen.getByText('Min')).toBeInTheDocument();
      expect(screen.getByText('Dim')).toBeInTheDocument();
      expect(screen.getByText('Aug')).toBeInTheDocument();
    });

    // Position selector removed - now shows all positions on full fretboard

    it('displays current chord symbol and notes', () => {
      render(<TriadSelector initialSelection={{ rootNote: 'D', quality: 'minor' }} />);
      
      // Check chord symbol display - now in chord-symbol class (vertical layout)
      const chordSymbol = document.querySelector('.triad-selector__chord-symbol');
      expect(chordSymbol?.textContent).toBe('Dm');
      // Check notes display - now in chord-notes class (vertical layout)
      const chordNotes = document.querySelector('.triad-selector__chord-notes');
      expect(chordNotes?.textContent).toBe('D - F - A');
    });

    // Toggle button removed - always shows minimal controls
  });

  describe('User Interactions', () => {
    it('calls onChange when root note is changed', async () => {
      const user = userEvent.setup();
      render(<TriadSelector onChange={mockOnChange} />);
      
      const gNoteButton = screen.getByRole('button', { name: 'G' });
      await user.click(gNoteButton);
      
      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            rootNote: 'G',
            quality: 'major',
            neckPosition: 'open'
          })
        );
      });
    });

    it('calls onChange when quality is changed', async () => {
      const user = userEvent.setup();
      render(<TriadSelector onChange={mockOnChange} />);
      
      const minorButton = screen.getByRole('button', { name: 'Min' });
      await user.click(minorButton);
      
      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            rootNote: 'C',
            quality: 'minor',
            neckPosition: 'open'
          })
        );
      });
    });

    // Position selector removed - always passes 'open' to onChange

    it('selects root note from note grid', async () => {
      const user = userEvent.setup();
      render(<TriadSelector onChange={mockOnChange} />);
      
      // Click on F# in the grid (always visible now)
      const fSharpButton = screen.getByRole('button', { name: 'F#' });
      await user.click(fSharpButton);
      
      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            rootNote: 'F#',
            quality: 'major',
            neckPosition: 'open'
          })
        );
      });
    });

    it('updates chord display when selection changes', async () => {
      const user = userEvent.setup();
      render(<TriadSelector />);
      
      // Initial state - use vertical layout class names
      const initialChordSymbol = document.querySelector('.triad-selector__chord-symbol');
      expect(initialChordSymbol?.textContent).toBe('C');
      const initialChordNotes = document.querySelector('.triad-selector__chord-notes');
      expect(initialChordNotes?.textContent).toBe('C - E - G');
      
      // Change to A minor using new interface
      const aButton = screen.getByRole('button', { name: 'A' });
      await user.click(aButton);
      
      const minorButton = screen.getByRole('button', { name: 'Min' });
      await user.click(minorButton);
      
      // Check updated display
      await waitFor(() => {
        const chordSymbol = document.querySelector('.triad-selector__chord-symbol');
        expect(chordSymbol?.textContent).toBe('Am');
        const chordNotes = document.querySelector('.triad-selector__chord-notes');
        expect(chordNotes?.textContent).toBe('A - C - E');
      });
    });
  });

  describe('Initial Selection', () => {
    it('sets initial selection correctly', () => {
      render(
        <TriadSelector 
          initialSelection={{
            rootNote: 'E',
            quality: 'minor',
            neckPosition: 'position-5' // This is ignored in new UI but still accepted
          }}
        />
      );
      
      // Check chord display - use vertical layout class names
      const chordSymbol = document.querySelector('.triad-selector__chord-symbol');
      expect(chordSymbol?.textContent).toBe('Em');
      const chordNotes = document.querySelector('.triad-selector__chord-notes');
      expect(chordNotes?.textContent).toBe('E - G - B');
      
      // Check note button is active
      const eButton = screen.getByRole('button', { name: 'E' });
      expect(eButton).toHaveAttribute('aria-pressed', 'true');
      
      // Minor button should be active
      const minorButton = screen.getByRole('button', { name: 'Min' });
      expect(minorButton).toHaveAttribute('aria-pressed', 'true');
      
      // Position selector removed - no position buttons to check
    });

    it('handles partial initial selection', () => {
      render(
        <TriadSelector 
          initialSelection={{
            rootNote: 'G'
          }}
        />
      );
      
      // Should use G as root with defaults for others - use vertical layout class names
      const chordSymbol = document.querySelector('.triad-selector__chord-symbol');
      expect(chordSymbol?.textContent).toBe('G');
      const chordNotes = document.querySelector('.triad-selector__chord-notes');
      expect(chordNotes?.textContent).toBe('G - B - D'); // G major
    });
  });

  describe('Disabled State', () => {
    it('disables all controls when disabled prop is true', () => {
      render(<TriadSelector disabled={true} />);
      
      // Note buttons should be disabled
      const noteButtons = screen.getAllByRole('button', { name: /^[A-G]#?$/ });
      noteButtons.forEach(button => {
        expect(button).toBeDisabled();
      });
      
      // Quality buttons should be disabled - use new names
      const qualityButtons = screen.getAllByRole('button', { name: /^(Maj|Min|Dim|Aug)$/ });
      qualityButtons.forEach(button => {
        expect(button).toBeDisabled();
      });
      
      // Position selector and toggle button removed - test is complete
    });

    it('does not call onChange when disabled', async () => {
      const user = userEvent.setup();
      render(<TriadSelector onChange={mockOnChange} disabled={true} />);
      
      const minorButton = screen.getByRole('button', { name: 'Min' });
      await user.click(minorButton);
      
      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for all controls', () => {
      render(<TriadSelector />);
      
      // Main component
      expect(screen.getByRole('application')).toHaveAttribute('aria-label');
      
      // Radiogroups - now only note grid and quality row
      const radiogroups = screen.getAllByRole('radiogroup');
      expect(radiogroups).toHaveLength(2); // Note grid and Quality row
      
      // Note buttons have aria-pressed
      const cButton = screen.getByRole('button', { name: 'C' });
      expect(cButton).toHaveAttribute('aria-pressed', 'true');
      
      // Quality buttons have aria-pressed
      const majButton = screen.getByRole('button', { name: 'Maj' });
      expect(majButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('properly indicates selected states', () => {
      render(
        <TriadSelector 
          initialSelection={{
            rootNote: 'D',
            quality: 'diminished',
            neckPosition: 'position-3' // Ignored in new UI
          }}
        />
      );
      
      // Note button should have aria-pressed
      const dButton = screen.getByRole('button', { name: 'D' });
      expect(dButton).toHaveAttribute('aria-pressed', 'true');
      
      // Quality button should have aria-pressed - use new name
      const dimButton = screen.getByRole('button', { name: 'Dim' });
      expect(dimButton).toHaveAttribute('aria-pressed', 'true');
      
      // Position selector removed - no position buttons to check
    });

    it('supports custom aria-label', () => {
      render(<TriadSelector aria-label="Custom triad selector for practice" />);
      
      const selector = screen.getByRole('application');
      expect(selector).toHaveAttribute('aria-label', 'Custom triad selector for practice');
    });
  });

  describe('Size Variants', () => {
    it('applies size classes correctly', () => {
      const { rerender } = render(<TriadSelector size="sm" />);
      let selector = screen.getByRole('application');
      expect(selector).toHaveClass('triad-selector--sm');
      
      rerender(<TriadSelector size="md" />);
      selector = screen.getByRole('application');
      expect(selector).toHaveClass('triad-selector--md');
      
      rerender(<TriadSelector size="lg" />);
      selector = screen.getByRole('application');
      expect(selector).toHaveClass('triad-selector--lg');
    });
  });
});