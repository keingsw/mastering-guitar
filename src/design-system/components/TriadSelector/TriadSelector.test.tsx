import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TriadSelector } from "./TriadSelector";

describe("TriadSelector Component", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders the triad selector interface with horizontal header", () => {
      render(<TriadSelector />);

      // Check main component structure
      const selector = screen.getByRole("application", {
        name: /triad selector with horizontal header and maximized fretboard/i,
      });
      expect(selector).toBeInTheDocument();

      // Check horizontal header - dropdown + quality buttons
      expect(screen.getAllByRole("radiogroup")).toHaveLength(1); // Only Quality controls (no note grid)
      expect(screen.getByRole("combobox", { name: /select root note/i })).toBeInTheDocument(); // Root note dropdown
      expect(screen.getByText("Maj")).toBeInTheDocument(); // Quality button (short labels)
      expect(screen.getByText("C - E - G")).toBeInTheDocument(); // Chord display (in header)
    });

    it("renders root note dropdown with all 12 chromatic notes", () => {
      render(<TriadSelector />);

      // Find the root note dropdown
      const dropdown = screen.getByRole("combobox", { name: /select root note/i });
      expect(dropdown).toBeInTheDocument();

      // Check dropdown has all 12 options
      const options = Array.from(dropdown.querySelectorAll("option"));
      expect(options).toHaveLength(12);

      // Check for specific note options
      expect(options.find((opt) => opt.value === "C")).toBeInTheDocument();
      expect(options.find((opt) => opt.value === "C#")).toBeInTheDocument();
      expect(options.find((opt) => opt.value === "G")).toBeInTheDocument();

      // Check C is initially selected
      expect(dropdown).toHaveValue("C");
    });

    it("renders quality button grid with all four triad qualities", () => {
      render(<TriadSelector />);

      // Quality buttons use short labels in a 2x2 grid
      expect(screen.getByRole("button", { name: "Maj" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Min" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Dim" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Aug" })).toBeInTheDocument();

      // Major is initially active
      expect(screen.getByRole("button", { name: "Maj" })).toHaveAttribute("aria-pressed", "true");

      // Check short labels
      expect(screen.getByText("Maj")).toBeInTheDocument();
      expect(screen.getByText("Min")).toBeInTheDocument();
      expect(screen.getByText("Dim")).toBeInTheDocument();
      expect(screen.getByText("Aug")).toBeInTheDocument();
    });

    // Position selector removed - now shows all positions on full fretboard

    it("displays current chord symbol and notes", () => {
      render(<TriadSelector initialSelection={{ rootNote: "D", quality: "minor" }} />);

      // Check chord symbol display - now in chord-symbol class (vertical layout)
      const chordSymbol = document.querySelector(".triad-selector__chord-symbol");
      expect(chordSymbol?.textContent).toBe("Dm");
      // Check notes display - now in chord-notes class (vertical layout)
      const chordNotes = document.querySelector(".triad-selector__chord-notes");
      expect(chordNotes?.textContent).toBe("D - F - A");
    });

    // Toggle button removed - always shows minimal controls
  });

  describe("User Interactions", () => {
    it("calls onChange when root note dropdown is changed", async () => {
      const user = userEvent.setup();
      render(<TriadSelector onChange={mockOnChange} />);

      const dropdown = screen.getByRole("combobox", { name: /select root note/i });
      await user.selectOptions(dropdown, "G");

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            rootNote: "G",
            quality: "major",
            neckPosition: "open",
          }),
        );
      });
    });

    it("calls onChange when quality is changed", async () => {
      const user = userEvent.setup();
      render(<TriadSelector onChange={mockOnChange} />);

      const minorButton = screen.getByRole("button", { name: "Min" });
      await user.click(minorButton);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            rootNote: "C",
            quality: "minor",
            neckPosition: "open",
          }),
        );
      });
    });

    // Position selector removed - always passes 'open' to onChange

    it("selects root note from dropdown", async () => {
      const user = userEvent.setup();
      render(<TriadSelector onChange={mockOnChange} />);

      // Select F# from dropdown
      const dropdown = screen.getByRole("combobox", { name: /select root note/i });
      await user.selectOptions(dropdown, "F#");

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            rootNote: "F#",
            quality: "major",
            neckPosition: "open",
          }),
        );
      });
    });

    it("updates chord display when selection changes", async () => {
      const user = userEvent.setup();
      render(<TriadSelector />);

      // Initial state - use vertical layout class names
      const initialChordSymbol = document.querySelector(".triad-selector__chord-symbol");
      expect(initialChordSymbol?.textContent).toBe("C");
      const initialChordNotes = document.querySelector(".triad-selector__chord-notes");
      expect(initialChordNotes?.textContent).toBe("C - E - G");

      // Change to A minor using dropdown and button
      const dropdown = screen.getByRole("combobox", { name: /select root note/i });
      await user.selectOptions(dropdown, "A");

      const minorButton = screen.getByRole("button", { name: "Min" });
      await user.click(minorButton);

      // Check updated display
      await waitFor(() => {
        const chordSymbol = document.querySelector(".triad-selector__chord-symbol");
        expect(chordSymbol?.textContent).toBe("Am");
        const chordNotes = document.querySelector(".triad-selector__chord-notes");
        expect(chordNotes?.textContent).toBe("A - C - E");
      });
    });
  });

  describe("Initial Selection", () => {
    it("sets initial selection correctly", () => {
      render(
        <TriadSelector
          initialSelection={{
            rootNote: "E",
            quality: "minor",
            neckPosition: "position-5", // This is ignored in new UI but still accepted
          }}
        />,
      );

      // Check chord display - use vertical layout class names
      const chordSymbol = document.querySelector(".triad-selector__chord-symbol");
      expect(chordSymbol?.textContent).toBe("Em");
      const chordNotes = document.querySelector(".triad-selector__chord-notes");
      expect(chordNotes?.textContent).toBe("E - G - B");

      // Check dropdown has correct value
      const dropdown = screen.getByRole("combobox", { name: /select root note/i });
      expect(dropdown).toHaveValue("E");

      // Minor button should be active
      const minorButton = screen.getByRole("button", { name: "Min" });
      expect(minorButton).toHaveAttribute("aria-pressed", "true");

      // Position selector removed - no position buttons to check
    });

    it("handles partial initial selection", () => {
      render(
        <TriadSelector
          initialSelection={{
            rootNote: "G",
          }}
        />,
      );

      // Should use G as root with defaults for others - use vertical layout class names
      const chordSymbol = document.querySelector(".triad-selector__chord-symbol");
      expect(chordSymbol?.textContent).toBe("G");
      const chordNotes = document.querySelector(".triad-selector__chord-notes");
      expect(chordNotes?.textContent).toBe("G - B - D"); // G major
    });
  });

  describe("Disabled State", () => {
    it("disables all controls when disabled prop is true", () => {
      render(<TriadSelector disabled={true} />);

      // Root note dropdown should be disabled
      const dropdown = screen.getByRole("combobox", { name: /select root note/i });
      expect(dropdown).toBeDisabled();

      // Quality buttons should be disabled - use new names
      const qualityButtons = screen.getAllByRole("button", { name: /^(Maj|Min|Dim|Aug)$/ });
      qualityButtons.forEach((button) => {
        expect(button).toBeDisabled();
      });

      // Position selector and toggle button removed - test is complete
    });

    it("does not call onChange when disabled", async () => {
      const user = userEvent.setup();
      render(<TriadSelector onChange={mockOnChange} disabled={true} />);

      const minorButton = screen.getByRole("button", { name: "Min" });
      await user.click(minorButton);

      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels for all controls", () => {
      render(<TriadSelector />);

      // Main component
      expect(screen.getByRole("application")).toHaveAttribute("aria-label");

      // Radiogroups - now only quality row (root note is dropdown)
      const radiogroups = screen.getAllByRole("radiogroup");
      expect(radiogroups).toHaveLength(1); // Only Quality row

      // Root note dropdown has proper value
      const dropdown = screen.getByRole("combobox", { name: /select root note/i });
      expect(dropdown).toHaveValue("C");

      // Quality buttons have aria-pressed
      const majButton = screen.getByRole("button", { name: "Maj" });
      expect(majButton).toHaveAttribute("aria-pressed", "true");
    });

    it("properly indicates selected states", () => {
      render(
        <TriadSelector
          initialSelection={{
            rootNote: "D",
            quality: "diminished",
            neckPosition: "position-3", // Ignored in new UI
          }}
        />,
      );

      // Root note dropdown should have correct value
      const dropdown = screen.getByRole("combobox", { name: /select root note/i });
      expect(dropdown).toHaveValue("D");

      // Quality button should have aria-pressed - use new name
      const dimButton = screen.getByRole("button", { name: "Dim" });
      expect(dimButton).toHaveAttribute("aria-pressed", "true");

      // Position selector removed - no position buttons to check
    });

    it("supports custom aria-label", () => {
      render(<TriadSelector aria-label="Custom triad selector for practice" />);

      const selector = screen.getByRole("application");
      expect(selector).toHaveAttribute("aria-label", "Custom triad selector for practice");
    });
  });

  describe("Size Variants", () => {
    it("applies size classes correctly", () => {
      const { rerender } = render(<TriadSelector size="sm" />);
      let selector = screen.getByRole("application");
      expect(selector).toHaveClass("triad-selector--sm");

      rerender(<TriadSelector size="md" />);
      selector = screen.getByRole("application");
      expect(selector).toHaveClass("triad-selector--md");

      rerender(<TriadSelector size="lg" />);
      selector = screen.getByRole("application");
      expect(selector).toHaveClass("triad-selector--lg");
    });
  });
});
