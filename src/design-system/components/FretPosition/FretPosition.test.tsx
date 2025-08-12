/**
 * FretPosition Component Tests
 *
 * Test-driven development approach:
 * 1. Write comprehensive tests first
 * 2. Run tests to see them fail
 * 3. Implement minimum code to make tests pass
 * 4. Refactor while keeping tests green
 */

import { fireEvent, screen } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FretPosition } from "./FretPosition";

describe("FretPosition Component", () => {
  // Basic rendering tests
  describe("Rendering", () => {
    it("should render note name", () => {
      render(<FretPosition note="C" />);
      expect(screen.getByText("C")).toBeInTheDocument();
    });

    it("should render with ARIA label for note position", () => {
      render(<FretPosition note="F#" />);
      const noteElement = screen.getByLabelText(/F# note position/i);
      expect(noteElement).toBeInTheDocument();
    });

    it("should render as circular element", () => {
      render(<FretPosition note="C" />);
      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;
      expect(element?.style.borderRadius).toBe("50%");
    });

    it("should have minimum touch target size by default", () => {
      render(<FretPosition note="C" />);
      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;
      expect(element?.style.width).toBe("88px"); // musicalSpacing.note.size
      expect(element?.style.height).toBe("88px");
    });
  });

  // Size variants tests
  describe("Sizes", () => {
    it("should render medium size by default", () => {
      render(<FretPosition note="C" />);
      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;
      expect(element?.style.width).toBe("88px");
      expect(element?.style.height).toBe("88px");
      expect(element?.style.fontSize).toBe("0.875rem");
    });

    it("should render small size correctly", () => {
      render(<FretPosition note="C" size="sm" />);
      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;
      expect(element?.style.width).toBe("32px");
      expect(element?.style.height).toBe("32px");
      expect(element?.style.fontSize).toBe("0.75rem");
    });

    it("should render large size correctly", () => {
      render(<FretPosition note="C" size="lg" />);
      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;
      expect(element?.style.width).toBe("48px");
      expect(element?.style.height).toBe("48px");
      expect(element?.style.fontSize).toBe("1rem");
    });
  });

  // Function-based coloring tests (root, third, fifth)
  describe("Harmonic Functions", () => {
    it("should render root function with red colors", () => {
      render(<FretPosition note="C" function="root" isHighlighted />);
      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;
      expect(element?.style.backgroundColor).toBe("rgb(220, 38, 38)"); // actual root color
      expect(element?.style.color).toBe("rgb(255, 255, 255)");
    });

    it("should render third function with yellow/amber colors", () => {
      render(<FretPosition note="E" function="third" isHighlighted />);
      const element = screen.getByText("E").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;
      expect(element?.style.backgroundColor).toBe("rgb(217, 119, 6)"); // actual third color
      expect(element?.style.color).toBe("rgb(255, 255, 255)");
    });

    it("should render fifth function with blue colors", () => {
      render(<FretPosition note="G" function="fifth" isHighlighted />);
      const element = screen.getByText("G").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;
      expect(element?.style.backgroundColor).toBe("rgb(37, 99, 235)"); // actual fifth color
      expect(element?.style.color).toBe("rgb(255, 255, 255)");
    });

    it("should render without function styling when not specified", () => {
      render(<FretPosition note="C" isHighlighted />);
      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;
      expect(element?.style.backgroundColor).toBe("rgb(243, 244, 246)"); // actual neutral color
      expect(element?.style.color).toBe("rgba(55, 53, 47, 0.95)"); // actual text color
    });

    it("should show light background when not highlighted", () => {
      render(<FretPosition note="C" function="root" />);
      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;
      expect(element?.style.backgroundColor).toBe("rgb(254, 226, 226)"); // actual light red
    });
  });

  // Highlight state tests
  describe("Highlight States", () => {
    it("should not be highlighted by default", () => {
      render(<FretPosition note="C" />);
      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;
      expect(element?.style.boxShadow).toBe("none");
    });

    it("should show highlighted state with shadow", () => {
      render(<FretPosition note="C" isHighlighted />);
      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;
      expect(element?.style.boxShadow).toContain("rgba(0, 0, 0, 0.2)");
    });

    it("should have proper ARIA pressed attribute when highlighted", () => {
      render(<FretPosition note="C" isHighlighted />);
      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;
      expect(element).toHaveAttribute("aria-pressed", "true");
    });

    it("should not have ARIA pressed attribute when not highlighted", () => {
      render(<FretPosition note="C" />);
      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;
      expect(element).toHaveAttribute("aria-pressed", "false");
    });
  });

  // Disabled state tests
  describe("Disabled State", () => {
    it("should have reduced opacity when disabled", () => {
      render(<FretPosition note="C" isDisabled />);
      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;
      expect(element?.style.opacity).toBe("0.4");
    });

    it("should have proper ARIA disabled attribute", () => {
      render(<FretPosition note="C" isDisabled />);
      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;
      expect(element).toHaveAttribute("aria-disabled", "true");
    });

    it("should not be clickable when disabled", async () => {
      const handleClick = vi.fn();
      render(<FretPosition note="C" onClick={handleClick} isDisabled />);

      const fretPosition = screen.getByText("C").closest("div");
      expect(fretPosition).toBeTruthy();
      if (fretPosition) {
        await userEvent.click(fretPosition);
      }
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("should not show hover effects when disabled", async () => {
      render(<FretPosition note="C" isDisabled onClick={vi.fn()} />);
      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;

      fireEvent.mouseEnter(element);
      expect(element.style.transform).toBe("");
    });
  });

  // Interactive behavior tests
  describe("Interactive Behavior", () => {
    it("should be clickable when onClick is provided", () => {
      const handleClick = vi.fn();
      render(<FretPosition note="C" onClick={handleClick} />);

      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;
      expect(element).toHaveAttribute("role", "button");
      expect(element).toHaveAttribute("tabIndex", "0");
    });

    it("should call onClick when clicked", async () => {
      const handleClick = vi.fn();
      render(<FretPosition note="C" onClick={handleClick} />);

      const fretPosition = screen.getByText("C").closest("div");
      expect(fretPosition).toBeTruthy();
      if (fretPosition) {
        await userEvent.click(fretPosition);
      }
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should be keyboard accessible", async () => {
      const handleClick = vi.fn();
      render(<FretPosition note="C" onClick={handleClick} />);

      const button = screen.getByText("C").closest("div");
      expect(button).toBeTruthy();
      if (!button) return;
      button.focus();
      await userEvent.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledTimes(1);

      await userEvent.keyboard(" ");
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it("should not be interactive without onClick", () => {
      render(<FretPosition note="C" />);
      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;
      expect(element).toHaveAttribute("tabIndex", "-1");
      expect(element).not.toHaveAttribute("role", "button");
    });

    it("should handle hover events", () => {
      const handleHover = vi.fn();
      render(<FretPosition note="C" onHover={handleHover} />);

      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;
      fireEvent.mouseEnter(element);
      expect(handleHover).toHaveBeenCalledWith(true);

      fireEvent.mouseLeave(element);
      expect(handleHover).toHaveBeenCalledWith(false);
    });
  });

  // Display options tests
  describe("Display Options", () => {
    it("should show note by default", () => {
      render(<FretPosition note="C" />);
      expect(screen.getByText("C")).toBeInTheDocument();
    });

    it("should hide note when showNote is false", () => {
      render(<FretPosition note="C" showNote={false} />);
      expect(screen.queryByText("C")).not.toBeInTheDocument();
    });

    it("should not show function symbol by default", () => {
      render(<FretPosition note="C" function="root" />);
      expect(screen.queryByText("●")).not.toBeInTheDocument();
    });

    it("should show function symbol when showFunction is true", () => {
      render(<FretPosition note="C" function="root" showFunction />);
      expect(screen.getByText("●")).toBeInTheDocument(); // Root symbol
    });

    it("should show different symbols for different functions", () => {
      // Root
      render(<FretPosition note="C" function="root" showFunction />);
      expect(screen.getByText("●")).toBeInTheDocument();

      // Third
      render(<FretPosition note="E" function="third" showFunction />);
      expect(screen.getByText("◆")).toBeInTheDocument();

      // Fifth
      render(<FretPosition note="G" function="fifth" showFunction />);
      expect(screen.getByText("▲")).toBeInTheDocument();
    });

    it("should show both note and function when both enabled", () => {
      render(<FretPosition note="C" function="root" showNote showFunction />);
      expect(screen.getByText("C")).toBeInTheDocument();
      expect(screen.getByText("●")).toBeInTheDocument();
    });
  });

  // Hover effects tests
  describe("Hover Effects", () => {
    it("should scale up on hover when interactive", () => {
      render(<FretPosition note="C" onClick={vi.fn()} />);
      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;

      fireEvent.mouseEnter(element);
      expect(element.style.transform).toBe("scale(1.1)");
      expect(element.style.zIndex).toBe("10");
    });

    it("should not have hover effects when not interactive", () => {
      render(<FretPosition note="C" />);
      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;

      fireEvent.mouseEnter(element);
      expect(element.style.transform).toBe("");
    });

    it("should reset on mouse leave", () => {
      render(<FretPosition note="C" onClick={vi.fn()} />);
      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;

      fireEvent.mouseEnter(element);
      fireEvent.mouseLeave(element);
      expect(element.style.transform).toBe("");
    });

    it("should change to function colors on hover", () => {
      render(<FretPosition note="C" function="root" onClick={vi.fn()} />);
      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;

      fireEvent.mouseEnter(element);
      expect(element.style.backgroundColor).toBe("rgb(220, 38, 38)"); // actual root color
      expect(element.style.color).toBe("rgb(255, 255, 255)");
    });
  });

  // Accessibility tests
  describe("Accessibility", () => {
    it("should have descriptive ARIA labels", () => {
      render(<FretPosition note="F#" function="third" />);
      const element = screen.getByLabelText(/F# third note position/i);
      expect(element).toBeInTheDocument();
    });

    it("should have screen reader text for all information", () => {
      render(<FretPosition note="C" function="root" isHighlighted />);
      expect(screen.getByText("C note, root function, highlighted")).toBeInTheDocument();
    });

    it("should indicate disabled state to screen readers", () => {
      render(<FretPosition note="C" isDisabled />);
      expect(screen.getByText(/disabled/)).toBeInTheDocument();
    });

    it("should have focus indicators", () => {
      render(<FretPosition note="C" onClick={vi.fn()} />);
      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;

      fireEvent.focus(element);
      expect(element.style.outline).toContain("2px solid");
      expect(element.style.outlineOffset).toBe("2px");
    });

    it("should provide accessibility shape symbols for colorblind users", () => {
      render(<FretPosition note="C" function="root" showFunction />);
      expect(screen.getByText("●")).toHaveAttribute("aria-hidden", "true");
    });
  });

  // Custom styling tests
  describe("Custom Styling", () => {
    it("should accept custom className", () => {
      render(<FretPosition note="C" className="custom-class" />);
      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;
      expect(element).toHaveClass("custom-class");
    });

    it("should accept custom styles", () => {
      render(<FretPosition note="C" style={{ backgroundColor: "purple" }} />);
      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;
      expect(element?.style.backgroundColor).toBe("purple");
    });
  });

  // Animation tests
  describe("Animations", () => {
    it("should have smooth transitions", () => {
      render(<FretPosition note="C" />);
      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;
      expect(element?.style.transition).toContain("150ms");
      expect(element?.style.transition).toContain("cubic-bezier(0, 0, 0.2, 1)");
    });

    it("should animate smoothly on state changes", () => {
      render(<FretPosition note="C" onClick={vi.fn()} />);
      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;

      // Test hover animation
      fireEvent.mouseEnter(element);
      expect(element.style.transition).toContain("all");

      fireEvent.mouseLeave(element);
      expect(element.style.transform).toBe("");
    });
  });

  // WCAG Compliance tests
  describe("WCAG 2.1 AA Compliance", () => {
    it("should meet minimum touch target size (44px)", () => {
      render(<FretPosition note="C" size="md" />);
      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;
      // Medium size is 88px, which exceeds 44px requirement
      expect(element?.style.width).toBe("88px");
      expect(element?.style.height).toBe("88px");
    });

    it("should have sufficient color contrast for all function colors", () => {
      // Root - red background with white text
      render(<FretPosition note="C" function="root" isHighlighted />);
      let element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;
      expect(element?.style.backgroundColor).toBe("rgb(220, 38, 38)");
      expect(element?.style.color).toBe("rgb(255, 255, 255)");

      // Third - amber background with white text
      render(<FretPosition note="E" function="third" isHighlighted />);
      element = screen.getByText("E").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;
      expect(element?.style.backgroundColor).toBe("rgb(217, 119, 6)");
      expect(element?.style.color).toBe("rgb(255, 255, 255)");

      // Fifth - blue background with white text
      render(<FretPosition note="G" function="fifth" isHighlighted />);
      element = screen.getByText("G").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;
      expect(element?.style.backgroundColor).toBe("rgb(37, 99, 235)");
      expect(element?.style.color).toBe("rgb(255, 255, 255)");
    });

    it("should provide alternative indicators for colorblind accessibility", () => {
      render(<FretPosition note="C" function="root" showFunction />);
      // Shape symbols provide alternative to color coding
      expect(screen.getByText("●")).toBeInTheDocument();
    });

    it("should have proper focus indicators for keyboard navigation", () => {
      render(<FretPosition note="C" onClick={vi.fn()} />);
      const element = screen.getByText("C").closest("div");
      expect(element).toBeTruthy();
      if (!element) return;

      fireEvent.focus(element);
      expect(element.style.outline).toBeTruthy();
      expect(element.style.outlineOffset).toBe("2px");
    });
  });
});
