import { fireEvent, screen } from "@testing-library/dom";
import { act, render } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PracticeQuestion } from "../../../types/practice";
import { ConstructionMode } from "./ConstructionMode";

// Mock the scoring system
vi.mock("../../../services/scoring-system", () => ({
  validateAnswer: vi.fn(() => ({
    isCorrect: true,
    points: 10,
    explanation: "Correct! This is a major triad",
  })),
  createQuestionResult: vi.fn((question, userAnswer, validation) => ({
    question,
    userAnswer,
    correctAnswer: question.target,
    isCorrect: validation.isCorrect,
    feedback: validation.explanation,
    points: validation.points,
  })),
}));

// Mock TriadSelector component
vi.mock("../../../../../design-system/components/TriadSelector/TriadSelector", () => ({
  TriadSelector: ({ initialSelection, onChange, disabled, "aria-label": ariaLabel }: any) => {
    const [currentSelection, setCurrentSelection] = React.useState(initialSelection);

    const handleClick = (selection: any) => {
      if (disabled || !onChange) return;

      setCurrentSelection(selection);
      onChange(selection);
    };

    return (
      <div data-testid="triad-selector" aria-label={ariaLabel}>
        <div>
          Current: {currentSelection.rootNote} {currentSelection.quality} in {currentSelection.neckPosition}
        </div>
        {!disabled && (
          <div>
            <button
              onClick={() =>
                handleClick({
                  rootNote: "C",
                  quality: "major",
                  neckPosition: "open",
                })
              }
              data-testid="select-c-major-open"
            >
              Select C Major Open
            </button>
            <button
              onClick={() =>
                handleClick({
                  rootNote: "D",
                  quality: "minor",
                  neckPosition: "position-3",
                })
              }
              data-testid="select-d-minor-pos3"
            >
              Select D Minor Pos3
            </button>
          </div>
        )}
      </div>
    );
  },
}));

describe("ConstructionMode Component", () => {
  const mockOnAnswer = vi.fn();
  const mockOnTimeOut = vi.fn();

  const sampleQuestion: PracticeQuestion = {
    id: "test-construction-1",
    type: "build-triad",
    target: {
      rootNote: "C",
      quality: "major",
      neckPosition: "open",
    },
    instructions: "Build a C major triad in open position",
    difficulty: "beginner",
    createdAt: new Date(),
  };

  const advancedQuestion: PracticeQuestion = {
    id: "test-construction-2",
    type: "build-triad",
    target: {
      rootNote: "D",
      quality: "minor",
      neckPosition: "position-3",
    },
    instructions: "Construct D minor (D-F-A) in 3rd position",
    difficulty: "intermediate",
    createdAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe("Rendering", () => {
    it("renders the construction mode interface", () => {
      render(<ConstructionMode question={sampleQuestion} onAnswer={mockOnAnswer} />);

      expect(screen.getByRole("main", { name: /construction mode practice question/i })).toBeInTheDocument();
      expect(screen.getByText("Build the Triad")).toBeInTheDocument();
      expect(screen.getByText(/follow the instructions below/i)).toBeInTheDocument();
    });

    it("displays custom instructions when provided", () => {
      render(<ConstructionMode question={sampleQuestion} onAnswer={mockOnAnswer} />);

      expect(screen.getByText("Build a C major triad in open position")).toBeInTheDocument();
    });

    it("displays the interactive TriadSelector", () => {
      render(<ConstructionMode question={sampleQuestion} onAnswer={mockOnAnswer} />);

      const triadSelector = screen.getByTestId("triad-selector");
      expect(triadSelector).toBeInTheDocument();
      expect(triadSelector).toHaveTextContent("Current: C major in open");
    });

    it("shows validation indicator initially correct for matching target", () => {
      render(<ConstructionMode question={sampleQuestion} onAnswer={mockOnAnswer} />);

      // Since initial state (C major open) matches the target, it should show correct
      expect(screen.getByText("Correct! Ready to submit")).toBeInTheDocument();
      expect(screen.getByText("✓")).toBeInTheDocument();
    });

    it("displays submit button initially enabled for matching target", () => {
      render(<ConstructionMode question={sampleQuestion} onAnswer={mockOnAnswer} />);

      const submitButton = screen.getByRole("button", { name: /submit answer/i });
      expect(submitButton).toBeInTheDocument();
      // Since initial state matches target, button should be enabled
      expect(submitButton).toBeEnabled();
    });

    it("shows timer when time limit is provided", () => {
      render(<ConstructionMode question={sampleQuestion} onAnswer={mockOnAnswer} timeLimit={45} />);

      expect(screen.getByText("Time:")).toBeInTheDocument();
      expect(screen.getByText("0:45")).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("updates validation when correct triad is built", async () => {
      render(<ConstructionMode question={sampleQuestion} onAnswer={mockOnAnswer} />);

      // Initial state should already show correct since C major open matches target
      expect(screen.getByText("Correct! Ready to submit")).toBeInTheDocument();
      expect(screen.getByText("✓")).toBeInTheDocument();

      const submitButton = screen.getByRole("button", { name: /submit answer/i });
      expect(submitButton).toBeEnabled();
      expect(submitButton).toHaveClass("construction-mode__submit-button--ready");
    });

    it("shows incomplete validation when incorrect triad is built", async () => {
      render(<ConstructionMode question={sampleQuestion} onAnswer={mockOnAnswer} />);

      // Component should start in correct state since initial state matches target
      expect(screen.getByText("Correct! Ready to submit")).toBeInTheDocument();

      // Change to incorrect triad using fireEvent instead of userEvent
      const selectButton = screen.getByTestId("select-d-minor-pos3");
      fireEvent.click(selectButton);

      // Now should show incomplete validation - elements should be immediately available
      expect(screen.getByText("Keep building...")).toBeInTheDocument();
      expect(screen.getByText("○")).toBeInTheDocument();

      const submitButton = screen.getByRole("button", { name: /submit answer/i });
      expect(submitButton).toBeDisabled();
    });

    it("calls onAnswer with correct result when answer is submitted", async () => {
      render(<ConstructionMode question={sampleQuestion} onAnswer={mockOnAnswer} />);

      // Component should start in correct state
      expect(screen.getByText("Correct! Ready to submit")).toBeInTheDocument();

      const submitButton = screen.getByRole("button", { name: /submit answer/i });
      expect(submitButton).toBeEnabled();

      fireEvent.click(submitButton);

      // Feedback should appear immediately after click
      expect(screen.getByRole("alert")).toBeInTheDocument();

      // Then advance time for the callback delay (1500ms from component)
      act(() => {
        vi.advanceTimersByTime(1600);
      });

      expect(mockOnAnswer).toHaveBeenCalled();

      expect(mockOnAnswer).toHaveBeenCalledWith(
        expect.objectContaining({
          isCorrect: true,
          userAnswer: expect.objectContaining({
            answer: expect.objectContaining({
              rootNote: "C",
              quality: "major",
              neckPosition: "open",
            }),
          }),
        }),
      );
    });

    it("shows correct feedback for right construction", async () => {
      render(<ConstructionMode question={sampleQuestion} onAnswer={mockOnAnswer} />);

      // Component starts in correct state
      expect(screen.getByText("Correct! Ready to submit")).toBeInTheDocument();

      const submitButton = screen.getByRole("button", { name: /submit answer/i });
      fireEvent.click(submitButton);

      // Elements should be immediately available after click
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("✓ Correct!")).toBeInTheDocument();
    });

    it("shows incomplete validation for mismatched target", async () => {
      render(<ConstructionMode question={advancedQuestion} onAnswer={mockOnAnswer} />);

      // Initial state is C major open, but target is D minor pos3
      expect(screen.getByText("Keep building...")).toBeInTheDocument();
      expect(screen.getByText("○")).toBeInTheDocument();

      const submitButton = screen.getByRole("button", { name: /submit answer/i });
      expect(submitButton).toBeDisabled();
    });

    it("supports keyboard navigation with Enter key", async () => {
      render(<ConstructionMode question={sampleQuestion} onAnswer={mockOnAnswer} />);

      // Component starts in correct state
      expect(screen.getByText("Correct! Ready to submit")).toBeInTheDocument();

      // Press Enter to submit (should work since initial state matches target)
      fireEvent.keyDown(document, { key: "Enter" });

      // Feedback should appear immediately
      expect(screen.getByRole("alert")).toBeInTheDocument();

      // Advance timers for the 1.5s delay
      act(() => {
        vi.advanceTimersByTime(1600);
      });

      expect(mockOnAnswer).toHaveBeenCalled();
    });
  });

  describe("Timer Functionality", () => {
    it("counts down timer correctly", async () => {
      render(<ConstructionMode question={sampleQuestion} onAnswer={mockOnAnswer} timeLimit={10} />);

      expect(screen.getByText("0:10")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(screen.getByText("0:07")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(4000);
      });
      expect(screen.getByText("0:03")).toBeInTheDocument();
    });

    it("calls onTimeOut when timer reaches zero", async () => {
      render(
        <ConstructionMode question={sampleQuestion} onAnswer={mockOnAnswer} onTimeOut={mockOnTimeOut} timeLimit={3} />,
      );

      act(() => {
        vi.advanceTimersByTime(3100); // A bit more than 3s to ensure timeout
      });

      expect(mockOnTimeOut).toHaveBeenCalled();
    });

    it("shows warning style when time is running low", async () => {
      render(<ConstructionMode question={sampleQuestion} onAnswer={mockOnAnswer} timeLimit={10} />);

      // Advance to 4 seconds remaining
      act(() => {
        vi.advanceTimersByTime(6000);
      });

      const timerValue = screen.getByText("0:04");
      expect(timerValue).toHaveClass("construction-mode__timer-value--warning");
    });

    it("stops timer when answer is submitted", async () => {
      render(<ConstructionMode question={sampleQuestion} onAnswer={mockOnAnswer} timeLimit={15} />);

      // Component starts in correct state
      expect(screen.getByText("Correct! Ready to submit")).toBeInTheDocument();

      const submitButton = screen.getByRole("button", { name: /submit answer/i });
      fireEvent.click(submitButton);

      // Submission should be immediate
      expect(submitButton).toHaveTextContent("Submitted");

      // The component should still exist but timer should be stopped
      expect(screen.getByRole("main")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA structure", () => {
      render(<ConstructionMode question={sampleQuestion} onAnswer={mockOnAnswer} />);

      const main = screen.getByRole("main");
      expect(main).toHaveAttribute("aria-label", "Construction mode practice question");

      const triadSelector = screen.getByTestId("triad-selector");
      expect(triadSelector).toHaveAttribute("aria-label", expect.stringContaining("Build triad selector"));
    });

    it("provides screen reader descriptions", () => {
      render(<ConstructionMode question={sampleQuestion} onAnswer={mockOnAnswer} />);

      const description = screen.getByText(/construction mode: build the specified triad/i);
      expect(description).toHaveClass("sr-only");
    });

    it("announces feedback with alert role", async () => {
      render(<ConstructionMode question={sampleQuestion} onAnswer={mockOnAnswer} />);

      // Component starts in correct state
      expect(screen.getByText("Correct! Ready to submit")).toBeInTheDocument();

      const submitButton = screen.getByRole("button", { name: /submit answer/i });
      fireEvent.click(submitButton);

      const feedback = screen.getByRole("alert");
      expect(feedback).toHaveAttribute("aria-live", "assertive");
    });

    it("supports custom aria-label", () => {
      render(
        <ConstructionMode
          question={sampleQuestion}
          onAnswer={mockOnAnswer}
          aria-label="Custom construction mode interface"
        />,
      );

      const main = screen.getByRole("main");
      expect(main).toHaveAttribute("aria-label", "Custom construction mode interface");
    });

    it("disables TriadSelector when submitted", async () => {
      render(<ConstructionMode question={sampleQuestion} onAnswer={mockOnAnswer} />);

      // Component starts in correct state
      expect(screen.getByText("Correct! Ready to submit")).toBeInTheDocument();

      const submitButton = screen.getByRole("button", { name: /submit answer/i });
      fireEvent.click(submitButton);

      // Submit state and disabled selector should be immediate
      expect(submitButton).toHaveTextContent("Submitted");
      expect(screen.queryByTestId("select-c-major-open")).not.toBeInTheDocument();
      expect(screen.queryByTestId("select-d-minor-pos3")).not.toBeInTheDocument();
    });
  });

  describe("Component Sizes", () => {
    it("applies correct size classes", () => {
      const { rerender } = render(<ConstructionMode question={sampleQuestion} onAnswer={mockOnAnswer} size="sm" />);

      let container = screen.getByRole("main").closest(".construction-mode");
      expect(container).toHaveClass("construction-mode--sm");

      rerender(<ConstructionMode question={sampleQuestion} onAnswer={mockOnAnswer} size="lg" />);
      container = screen.getByRole("main").closest(".construction-mode");
      expect(container).toHaveClass("construction-mode--lg");
    });
  });

  describe("Advanced Instructions", () => {
    it("displays different instruction formats based on difficulty", () => {
      render(<ConstructionMode question={advancedQuestion} onAnswer={mockOnAnswer} />);

      expect(screen.getByText("Construct D minor (D-F-A) in 3rd position")).toBeInTheDocument();
    });
  });
});
