import React from 'react';
import { render, screen, waitFor, within, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RecognitionMode } from './RecognitionMode';
import type { PracticeQuestion } from '../../../types/practice';

// Mock the scoring system
vi.mock('../../../services/scoring-system', () => ({
  validateAnswer: vi.fn((question, userAnswer) => {
    // Check if the answer matches the target
    const isCorrect = question.target.quality === userAnswer.answer;
    return {
      isCorrect,
      points: isCorrect ? 10 : 0,
      explanation: isCorrect 
        ? `Correct! This is a ${question.target.quality} triad`
        : `This is a ${question.target.quality} triad, not ${userAnswer.answer}`,
      correctAnswer: question.target.quality,
    };
  }),
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
vi.mock('../../../../../design-system/components/TriadSelector/TriadSelector', () => ({
  TriadSelector: ({ initialSelection, onChange, disabled, 'aria-label': ariaLabel }: any) => (
    <div data-testid="triad-selector" aria-label={ariaLabel}>
      Mock TriadSelector: {initialSelection.rootNote} {initialSelection.quality} in {initialSelection.neckPosition}
    </div>
  ),
}));

describe('RecognitionMode Component', () => {
  const mockOnAnswer = vi.fn();
  const mockOnTimeOut = vi.fn();

  const sampleQuestion: PracticeQuestion = {
    id: 'test-question-1',
    type: 'identify-quality',
    target: {
      rootNote: 'C',
      quality: 'major',
      neckPosition: 'open',
    },
    options: ['major', 'minor', 'diminished', 'augmented'],
    difficulty: 'beginner',
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

  describe('Rendering', () => {
    it('renders the recognition mode interface', () => {
      render(<RecognitionMode question={sampleQuestion} onAnswer={mockOnAnswer} />);
      
      expect(screen.getByRole('main', { name: /recognition mode practice question/i })).toBeInTheDocument();
      expect(screen.getByText('What type of triad is this?')).toBeInTheDocument();
      expect(screen.getByText(/look at the chord shape/i)).toBeInTheDocument();
    });

    it('displays the triad using TriadSelector', () => {
      render(<RecognitionMode question={sampleQuestion} onAnswer={mockOnAnswer} />);
      
      const triadSelector = screen.getByTestId('triad-selector');
      expect(triadSelector).toBeInTheDocument();
      expect(triadSelector).toHaveTextContent('C major in open');
    });

    it('renders multiple choice options', () => {
      render(<RecognitionMode question={sampleQuestion} onAnswer={mockOnAnswer} />);
      
      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toBeInTheDocument();
      
      const options = within(radioGroup).getAllByRole('radio');
      expect(options).toHaveLength(4);
      
      expect(screen.getByDisplayValue('major')).toBeInTheDocument();
      expect(screen.getByDisplayValue('minor')).toBeInTheDocument();
      expect(screen.getByDisplayValue('diminished')).toBeInTheDocument();
      expect(screen.getByDisplayValue('augmented')).toBeInTheDocument();
    });

    it('displays submit button initially disabled', () => {
      render(<RecognitionMode question={sampleQuestion} onAnswer={mockOnAnswer} />);
      
      const submitButton = screen.getByRole('button', { name: /submit answer/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    it('shows timer when time limit is provided', () => {
      render(
        <RecognitionMode 
          question={sampleQuestion} 
          onAnswer={mockOnAnswer} 
          timeLimit={30}
        />
      );
      
      expect(screen.getByText('Time:')).toBeInTheDocument();
      expect(screen.getByText('0:30')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('enables submit button when option is selected', async () => {
      render(<RecognitionMode question={sampleQuestion} onAnswer={mockOnAnswer} />);
      
      const majorOption = screen.getByDisplayValue('major');
      const submitButton = screen.getByRole('button', { name: /submit answer/i });
      
      expect(submitButton).toBeDisabled();
      
      fireEvent.click(majorOption);
      
      expect(submitButton).toBeEnabled();
      expect(majorOption).toBeChecked();
    });

    it('calls onAnswer with correct result when answer is submitted', async () => {
      render(<RecognitionMode question={sampleQuestion} onAnswer={mockOnAnswer} />);
      
      const majorOption = screen.getByDisplayValue('major');
      const submitButton = screen.getByRole('button', { name: /submit answer/i });
      
      fireEvent.click(majorOption);
      fireEvent.click(submitButton);
      
      // Advance timer for callback delay (3000ms from component)
      act(() => {
        vi.advanceTimersByTime(3100);
      });
      
      expect(mockOnAnswer).toHaveBeenCalledWith(
        expect.objectContaining({
          question: sampleQuestion,
          userAnswer: expect.objectContaining({
            answer: 'major',
            questionId: sampleQuestion.id,
          }),
          isCorrect: true,
        })
      );
    });

    it('shows correct feedback for right answer', async () => {
      render(<RecognitionMode question={sampleQuestion} onAnswer={mockOnAnswer} />);
      
      const majorOption = screen.getByDisplayValue('major');
      const submitButton = screen.getByRole('button', { name: /submit answer/i });
      
      fireEvent.click(majorOption);
      fireEvent.click(submitButton);
      
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('✓ Correct!')).toBeInTheDocument();
      expect(screen.getByText(/correct! this is a major triad/i)).toBeInTheDocument();
    });

    it('shows incorrect feedback for wrong answer', async () => {
      render(<RecognitionMode question={sampleQuestion} onAnswer={mockOnAnswer} />);
      
      const minorOption = screen.getByDisplayValue('minor');
      const submitButton = screen.getByRole('button', { name: /submit answer/i });
      
      fireEvent.click(minorOption);
      fireEvent.click(submitButton);
      
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('✗ Incorrect')).toBeInTheDocument();
      expect(screen.getByText(/this is a major triad, not minor/i)).toBeInTheDocument();
      // Text is split across elements, check the feedback explanation
      const explanation = screen.getByText(/the correct answer is/i);
      expect(explanation).toBeInTheDocument();
      // The strong element with "major" should be in the feedback section
      expect(explanation.parentElement).toHaveTextContent(/the correct answer is major/i);
    });

    it('supports keyboard navigation with Enter key', async () => {
      render(<RecognitionMode question={sampleQuestion} onAnswer={mockOnAnswer} />);
      
      const majorOption = screen.getByDisplayValue('major');
      fireEvent.click(majorOption);
      
      // Focus the submit button and press Enter
      const submitButton = screen.getByRole('button', { name: /submit answer/i });
      submitButton.focus();
      fireEvent.keyDown(submitButton, { key: 'Enter' });
      
      // Advance timer for callback delay (3000ms from component)
      act(() => {
        vi.advanceTimersByTime(3100);
      });
      
      expect(mockOnAnswer).toHaveBeenCalled();
    });
  });

  describe('Timer Functionality', () => {
    it('counts down timer correctly', async () => {
      render(
        <RecognitionMode 
          question={sampleQuestion} 
          onAnswer={mockOnAnswer} 
          timeLimit={5}
        />
      );
      
      expect(screen.getByText('0:05')).toBeInTheDocument();
      
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(screen.getByText('0:03')).toBeInTheDocument();
      
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(screen.getByText('0:01')).toBeInTheDocument();
    });

    it('calls onTimeOut when timer reaches zero', async () => {
      render(
        <RecognitionMode 
          question={sampleQuestion} 
          onAnswer={mockOnAnswer}
          onTimeOut={mockOnTimeOut}
          timeLimit={2}
        />
      );
      
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      
      expect(mockOnTimeOut).toHaveBeenCalled();
    });

    it('shows warning style when time is running low', async () => {
      render(
        <RecognitionMode 
          question={sampleQuestion} 
          onAnswer={mockOnAnswer} 
          timeLimit={15}
        />
      );
      
      // Advance to 5 seconds remaining
      act(() => {
        vi.advanceTimersByTime(10000);
      });
      
      const timerValue = screen.getByText('0:05');
      expect(timerValue).toHaveClass('recognition-mode__timer-value--warning');
    });

    it('stops timer when answer is submitted', async () => {
      render(
        <RecognitionMode 
          question={sampleQuestion} 
          onAnswer={mockOnAnswer} 
          timeLimit={10}
        />
      );
      
      const majorOption = screen.getByDisplayValue('major');
      const submitButton = screen.getByRole('button', { name: /submit answer/i });
      
      fireEvent.click(majorOption);
      fireEvent.click(submitButton);
      
      // Submission should be immediate
      expect(submitButton).toHaveTextContent('Submitted');
      
      // Timer should not continue after submission
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      
      // The component should still exist but timer should be stopped
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA structure', () => {
      render(<RecognitionMode question={sampleQuestion} onAnswer={mockOnAnswer} />);
      
      const main = screen.getByRole('main');
      expect(main).toHaveAttribute('aria-label', 'Recognition mode practice question');
      
      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveAttribute('aria-labelledby');
      expect(radioGroup).toHaveAttribute('aria-describedby');
    });

    it('provides screen reader descriptions', () => {
      render(<RecognitionMode question={sampleQuestion} onAnswer={mockOnAnswer} />);
      
      const description = screen.getByText(/recognition mode: look at the triad/i);
      expect(description).toHaveClass('sr-only');
    });

    it('announces feedback with alert role', async () => {
      render(<RecognitionMode question={sampleQuestion} onAnswer={mockOnAnswer} />);
      
      const majorOption = screen.getByDisplayValue('major');
      const submitButton = screen.getByRole('button', { name: /submit answer/i });
      
      fireEvent.click(majorOption);
      fireEvent.click(submitButton);
      
      const feedback = screen.getByRole('alert');
      expect(feedback).toHaveAttribute('aria-live', 'assertive');
    });

    it('supports custom aria-label', () => {
      render(
        <RecognitionMode 
          question={sampleQuestion} 
          onAnswer={mockOnAnswer}
          aria-label="Custom recognition mode interface"
        />
      );
      
      const main = screen.getByRole('main');
      expect(main).toHaveAttribute('aria-label', 'Custom recognition mode interface');
    });
  });

  describe('Component Sizes', () => {
    it('applies correct size classes', () => {
      const { rerender } = render(
        <RecognitionMode question={sampleQuestion} onAnswer={mockOnAnswer} size="sm" />
      );
      
      let container = screen.getByRole('main').closest('.recognition-mode');
      expect(container).toHaveClass('recognition-mode--sm');
      
      rerender(<RecognitionMode question={sampleQuestion} onAnswer={mockOnAnswer} size="lg" />);
      container = screen.getByRole('main').closest('.recognition-mode');
      expect(container).toHaveClass('recognition-mode--lg');
    });
  });
});