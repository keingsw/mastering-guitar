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
    it('renders the triad selector interface with compact controls', () => {
      render(<TriadSelector />);
      
      // Check main component structure
      const selector = screen.getByRole('application', { name: /triad selector with large fretboard visualization/i });
      expect(selector).toBeInTheDocument();

      // Check compact control sections
      expect(screen.getByLabelText(/root note/i)).toBeInTheDocument(); // Dropdown
      expect(screen.getAllByRole('radiogroup')).toHaveLength(2); // Quality and Position groups
      expect(screen.getByText('Maj')).toBeInTheDocument(); // Quality button
    });

    it('renders root note dropdown with all 12 chromatic notes', () => {
      render(<TriadSelector />);
      
      const rootNoteSelect = screen.getByLabelText(/root note/i);
      expect(rootNoteSelect).toBeInTheDocument();
      expect(rootNoteSelect.tagName).toBe('SELECT');
      
      // Check that all options are present
      const options = within(rootNoteSelect).getAllByRole('option');
      expect(options).toHaveLength(12);
      
      // Check for specific notes
      expect(within(rootNoteSelect).getByRole('option', { name: 'C' })).toBeInTheDocument();
      expect(within(rootNoteSelect).getByRole('option', { name: 'C#' })).toBeInTheDocument();
      expect(within(rootNoteSelect).getByRole('option', { name: 'G' })).toBeInTheDocument();
    });

    it('renders quality button group with all four triad qualities', () => {
      render(<TriadSelector />);
      
      // Quality buttons are in a radiogroup
      const qualityButtons = screen.getAllByRole('button', { name: /major|minor|diminished|augmented/i });
      expect(qualityButtons).toHaveLength(4);
      
      // Check short labels
      expect(screen.getByText('Maj')).toBeInTheDocument();
      expect(screen.getByText('Min')).toBeInTheDocument();
      expect(screen.getByText('Dim')).toBeInTheDocument();
      expect(screen.getByText('Aug')).toBeInTheDocument();
    });

    it('renders position pills for neck positions', () => {
      render(<TriadSelector />);
      
      // Basic positions shown by default
      expect(screen.getByText('Open')).toBeInTheDocument();
      expect(screen.getByText('3rd')).toBeInTheDocument();
      expect(screen.getByText('5th')).toBeInTheDocument();
    });

    it('shows advanced positions when enabled', () => {
      render(<TriadSelector showAdvancedPositions={true} />);
      
      expect(screen.getByText('Open')).toBeInTheDocument();
      expect(screen.getByText('3rd')).toBeInTheDocument();
      expect(screen.getByText('5th')).toBeInTheDocument();
      expect(screen.getByText('7th')).toBeInTheDocument();
      expect(screen.getByText('9th')).toBeInTheDocument();
      expect(screen.getByText('12th')).toBeInTheDocument();
    });

    it('displays current chord symbol and notes', () => {
      render(<TriadSelector initialSelection={{ rootNote: 'D', quality: 'minor' }} />);
      
      // Check chord symbol display - use the specific class
      const chordSymbol = document.querySelector('.triad-selector__chord-symbol');
      expect(chordSymbol?.textContent).toBe('Dm');
      // Check notes display
      const chordNotes = document.querySelector('.triad-selector__chord-notes');
      expect(chordNotes?.textContent).toBe('D - F - A');
    });

    it('shows toggle button for expanded view', () => {
      render(<TriadSelector />);
      
      const toggleButton = screen.getByLabelText(/expand controls/i);
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).toHaveTextContent('⋮');
    });
  });

  describe('User Interactions', () => {
    it('calls onChange when root note is changed', async () => {
      const user = userEvent.setup();
      render(<TriadSelector onChange={mockOnChange} />);
      
      const rootNoteSelect = screen.getByLabelText(/root note/i);
      await user.selectOptions(rootNoteSelect, 'G');
      
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
      
      const minorButton = screen.getByRole('button', { name: /minor/i });
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

    it('calls onChange when position is changed', async () => {
      const user = userEvent.setup();
      render(<TriadSelector onChange={mockOnChange} />);
      
      const position3Button = screen.getByText('3rd');
      await user.click(position3Button);
      
      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            rootNote: 'C',
            quality: 'major',
            neckPosition: 'position-3'
          })
        );
      });
    });

    it('expands note grid when toggle is clicked', async () => {
      const user = userEvent.setup();
      render(<TriadSelector />);
      
      const toggleButton = screen.getByLabelText(/expand controls/i);
      await user.click(toggleButton);
      
      // Should show expanded note grid
      await waitFor(() => {
        expect(screen.getByText('Select Root Note:')).toBeInTheDocument();
      });
      
      // Should show all 12 note buttons in the expanded grid
      const noteButtons = screen.getAllByRole('button').filter(btn => 
        ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].includes(btn.textContent || '')
      );
      expect(noteButtons).toHaveLength(12);
      
      // Toggle button should now show close icon
      expect(toggleButton).toHaveTextContent('×');
    });

    it('selects root note from expanded grid', async () => {
      const user = userEvent.setup();
      render(<TriadSelector onChange={mockOnChange} expandedView={true} />);
      
      // Grid should be visible
      expect(screen.getByText('Select Root Note:')).toBeInTheDocument();
      
      // Click on F# in the grid
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
      
      // Initial state
      const initialChordSymbol = document.querySelector('.triad-selector__chord-symbol');
      expect(initialChordSymbol?.textContent).toBe('C');
      const initialChordNotes = document.querySelector('.triad-selector__chord-notes');
      expect(initialChordNotes?.textContent).toBe('C - E - G');
      
      // Change to A minor
      const rootNoteSelect = screen.getByLabelText(/root note/i);
      await user.selectOptions(rootNoteSelect, 'A');
      
      const minorButton = screen.getByRole('button', { name: /minor/i });
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
            neckPosition: 'position-5'
          }}
        />
      );
      
      // Check chord display
      const chordSymbol = document.querySelector('.triad-selector__chord-symbol');
      expect(chordSymbol?.textContent).toBe('Em');
      const chordNotes = document.querySelector('.triad-selector__chord-notes');
      expect(chordNotes?.textContent).toBe('E - G - B');
      
      // Check selections
      const rootNoteSelect = screen.getByLabelText(/root note/i) as HTMLSelectElement;
      expect(rootNoteSelect.value).toBe('E');
      
      // Minor button should be active
      const minorButton = screen.getByRole('button', { name: /minor/i });
      expect(minorButton).toHaveAttribute('aria-pressed', 'true');
      
      // 5th position should be active
      const position5Button = screen.getByText('5th');
      expect(position5Button).toHaveAttribute('aria-pressed', 'true');
    });

    it('handles partial initial selection', () => {
      render(
        <TriadSelector 
          initialSelection={{
            rootNote: 'G'
          }}
        />
      );
      
      // Should use G as root with defaults for others
      const chordSymbol = document.querySelector('.triad-selector__chord-symbol');
      expect(chordSymbol?.textContent).toBe('G');
      const chordNotes = document.querySelector('.triad-selector__chord-notes');
      expect(chordNotes?.textContent).toBe('G - B - D'); // G major
    });
  });

  describe('Disabled State', () => {
    it('disables all controls when disabled prop is true', () => {
      render(<TriadSelector disabled={true} />);
      
      // Root note select should be disabled
      const rootNoteSelect = screen.getByLabelText(/root note/i);
      expect(rootNoteSelect).toBeDisabled();
      
      // Quality buttons should be disabled
      const qualityButtons = screen.getAllByRole('button', { name: /major|minor|diminished|augmented/i });
      qualityButtons.forEach(button => {
        expect(button).toBeDisabled();
      });
      
      // Position buttons should be disabled
      const positionButtons = [
        screen.getByText('Open'),
        screen.getByText('3rd'),
        screen.getByText('5th')
      ];
      positionButtons.forEach(button => {
        expect(button).toBeDisabled();
      });
      
      // Toggle button should be disabled
      const toggleButton = screen.getByLabelText(/expand controls/i);
      expect(toggleButton).toBeDisabled();
    });

    it('does not call onChange when disabled', async () => {
      const user = userEvent.setup();
      render(<TriadSelector onChange={mockOnChange} disabled={true} />);
      
      const minorButton = screen.getByRole('button', { name: /minor/i });
      await user.click(minorButton);
      
      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for all controls', () => {
      render(<TriadSelector />);
      
      // Main component
      expect(screen.getByRole('application')).toHaveAttribute('aria-label');
      
      // Root note select
      expect(screen.getByLabelText(/root note/i)).toBeInTheDocument();
      
      // Quality buttons in radiogroup
      const radiogroups = screen.getAllByRole('radiogroup');
      expect(radiogroups).toHaveLength(2); // Quality and Position groups
      
      // Toggle button
      expect(screen.getByLabelText(/expand controls/i)).toBeInTheDocument();
    });

    it('properly indicates selected states', () => {
      render(
        <TriadSelector 
          initialSelection={{
            rootNote: 'D',
            quality: 'diminished',
            neckPosition: 'position-3'
          }}
        />
      );
      
      // Quality button should have aria-pressed
      const dimButton = screen.getByRole('button', { name: /diminished/i });
      expect(dimButton).toHaveAttribute('aria-pressed', 'true');
      
      // Position button should have aria-pressed
      const position3Button = screen.getByText('3rd');
      expect(position3Button).toHaveAttribute('aria-pressed', 'true');
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