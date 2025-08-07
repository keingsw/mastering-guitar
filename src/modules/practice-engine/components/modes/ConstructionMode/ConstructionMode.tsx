import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { TriadSelector } from '../../../../../design-system/components/TriadSelector/TriadSelector';
import type { TriadSelection } from '../../../../../design-system/components/TriadSelector/TriadSelector';
import type { ComponentSize } from '../../../../../design-system/types/music';
import type { PracticeQuestion, QuestionResult, UserAnswer } from '../../../types/practice';
import { validateAnswer } from '../../../services/scoring-system';
import './ConstructionMode.css';

export interface ConstructionModeProps {
  /** The practice question to answer */
  question: PracticeQuestion;
  /** Component size variant */
  size?: ComponentSize;
  /** Time limit in seconds (optional) */
  timeLimit?: number;
  /** Callback when answer is submitted */
  onAnswer: (result: QuestionResult) => void;
  /** Callback when time runs out (optional) */
  onTimeOut?: () => void;
  /** Additional CSS class name */
  className?: string;
  /** ARIA label for accessibility */
  'aria-label'?: string;
}

/**
 * Construction Mode Component
 * 
 * Presents written instructions and allows users to build triads.
 * Features:
 * - Clear construction instructions
 * - Interactive TriadSelector for building triads
 * - Real-time validation feedback
 * - Timer functionality (optional)
 * - Accessibility compliance
 */
export const ConstructionMode: React.FC<ConstructionModeProps> = ({
  question,
  size = 'md',
  timeLimit,
  onAnswer,
  onTimeOut,
  className = '',
  'aria-label': ariaLabel,
}) => {
  const [selectedTriad, setSelectedTriad] = useState<TriadSelection>({
    rootNote: 'C',
    quality: 'major',
    neckPosition: 'open',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(timeLimit || null);
  const [startTime] = useState<Date>(new Date());

  // Timer functionality
  useEffect(() => {
    if (!timeLimit || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          if (prev !== null && onTimeOut) {
            onTimeOut();
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLimit, isSubmitted, onTimeOut]);

  // Format time display
  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Check if current selection matches target
  const isCorrectSelection = useMemo(() => {
    return selectedTriad.rootNote === question.target.rootNote &&
           selectedTriad.quality === question.target.quality &&
           selectedTriad.neckPosition === question.target.neckPosition;
  }, [selectedTriad, question.target]);

  // Handle triad selection change
  const handleTriadChange = useCallback((newSelection: TriadSelection) => {
    if (isSubmitted) return;
    setSelectedTriad(newSelection);
  }, [isSubmitted]);

  // Handle answer submission
  const handleSubmit = useCallback(() => {
    if (isSubmitted) return;

    const responseTime = new Date().getTime() - startTime.getTime();
    
    const userAnswer: UserAnswer = {
      questionId: question.id,
      answer: selectedTriad,
      responseTime,
      timestamp: new Date(),
      isCorrect: isCorrectSelection,
    };

    const validationResult = validateAnswer(question, userAnswer);
    
    setFeedback(validationResult.explanation);
    setIsSubmitted(true);
    
    const result: QuestionResult = {
      question,
      userAnswer,
      correctAnswer: question.target,
      isCorrect: isCorrectSelection,
      feedback: validationResult.explanation,
      points: validationResult.points,
    };

    // Submit after a brief delay to show feedback
    setTimeout(() => {
      onAnswer(result);
    }, 1500);
  }, [question, selectedTriad, isCorrectSelection, startTime, onAnswer, isSubmitted]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !isSubmitted && isCorrectSelection) {
        event.preventDefault();
        handleSubmit();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSubmit, isSubmitted, isCorrectSelection]);

  // Timer warning threshold
  const isTimeWarning = timeRemaining !== null && timeRemaining <= 5;

  return (
    <div 
      className={`construction-mode construction-mode--${size} ${className}`}
      role="main"
      aria-label={ariaLabel || 'Construction mode practice question'}
    >
      {/* Screen reader description */}
      <div className="sr-only">
        Construction mode: Build the specified triad using the interactive selector. 
        Read the instructions carefully and construct the requested chord.
      </div>

      {/* Timer (if enabled) */}
      {timeLimit && timeRemaining !== null && (
        <div className="construction-mode__timer">
          <span className="construction-mode__timer-label">Time:</span>
          <span 
            className={`construction-mode__timer-value ${
              isTimeWarning ? 'construction-mode__timer-value--warning' : ''
            }`}
          >
            {formatTime(timeRemaining)}
          </span>
        </div>
      )}

      {/* Instructions */}
      <div className="construction-mode__instructions">
        <h2 className="construction-mode__question">Build the Triad</h2>
        <p className="construction-mode__description">
          Follow the instructions below and use the selector to build the correct triad:
        </p>
        <div className="construction-mode__target-instructions">
          {question.instructions || `Build a ${question.target.rootNote} ${question.target.quality} triad in ${question.target.neckPosition}`}
        </div>
      </div>

      {/* Interactive Triad Selector */}
      <div className="construction-mode__selector">
        <TriadSelector
          initialSelection={selectedTriad}
          onSelectionChange={handleTriadChange}
          size={size}
          aria-label={`Build triad selector - Current: ${selectedTriad.rootNote} ${selectedTriad.quality} in ${selectedTriad.neckPosition}`}
          disabled={isSubmitted}
        />
      </div>

      {/* Validation indicator */}
      {!isSubmitted && (
        <div className="construction-mode__validation">
          <div className={`construction-mode__validation-indicator ${
            isCorrectSelection ? 'construction-mode__validation-indicator--correct' : 'construction-mode__validation-indicator--incomplete'
          }`}>
            {isCorrectSelection ? (
              <>
                <span className="construction-mode__validation-icon">✓</span>
                <span>Correct! Ready to submit</span>
              </>
            ) : (
              <>
                <span className="construction-mode__validation-icon">○</span>
                <span>Keep building...</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Submit button */}
      <div className="construction-mode__actions">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitted || !isCorrectSelection}
          className={`construction-mode__submit-button ${
            isCorrectSelection ? 'construction-mode__submit-button--ready' : ''
          } ${
            isSubmitted ? 'construction-mode__submit-button--submitted' : ''
          }`}
          aria-describedby="construction-mode-instructions"
        >
          {isSubmitted ? 'Submitted' : 'Submit Answer'}
        </button>
      </div>

      {/* Feedback */}
      {feedback && (
        <div 
          className={`construction-mode__feedback ${
            isCorrectSelection ? 'construction-mode__feedback--correct' : 'construction-mode__feedback--incorrect'
          }`}
          role="alert"
          aria-live="assertive"
        >
          <div className="construction-mode__feedback-header">
            {isCorrectSelection ? (
              <span className="construction-mode__feedback-icon">✓ Correct!</span>
            ) : (
              <span className="construction-mode__feedback-icon">✗ Incorrect</span>
            )}
          </div>
          <div className="construction-mode__feedback-text">
            {feedback}
          </div>
        </div>
      )}

      {/* Hidden instructions for screen readers */}
      <div id="construction-mode-instructions" className="sr-only">
        Construction mode practice question. Use the triad selector to build the requested chord. 
        Press Enter to submit your answer when ready.
        {timeLimit && ` Time limit: ${timeLimit} seconds.`}
      </div>
    </div>
  );
};

// Validation in development mode
if (process.env.NODE_ENV === 'development') {
  ConstructionMode.displayName = 'ConstructionMode';
}

export default ConstructionMode;