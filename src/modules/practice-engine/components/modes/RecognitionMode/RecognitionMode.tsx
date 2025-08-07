import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { TriadSelector } from '../../../../../design-system/components/TriadSelector/TriadSelector';
import type { TriadQuality, ComponentSize } from '../../../../../design-system/types/music';
import type { PracticeQuestion, UserAnswer, QuestionResult } from '../../../types/practice';
import { validateAnswer, createQuestionResult } from '../../../services/scoring-system';
import './RecognitionMode.css';

export interface RecognitionModeProps {
  /** Current question to display */
  question: PracticeQuestion;
  /** Component size variant */
  size?: ComponentSize;
  /** Time limit for question in seconds */
  timeLimit?: number;
  /** Callback when answer is submitted */
  onAnswer: (result: QuestionResult) => void;
  /** Callback when time runs out */
  onTimeOut?: () => void;
  /** Additional CSS class name */
  className?: string;
  /** ARIA label for accessibility */
  'aria-label'?: string;
}

/**
 * Recognition Mode Component
 * 
 * Shows a triad on the fretboard and asks the user to identify the quality.
 * Features:
 * - Visual triad display using TriadSelector
 * - Multiple choice quality selection
 * - Time limit with countdown
 * - Immediate feedback on answer
 * - Keyboard navigation support
 * - WCAG 2.1 AA accessibility
 */
export const RecognitionMode: React.FC<RecognitionModeProps> = ({
  question,
  size = 'md',
  timeLimit,
  onAnswer,
  onTimeOut,
  className = '',
  'aria-label': ariaLabel,
}) => {
  const [selectedQuality, setSelectedQuality] = useState<TriadQuality | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [startTime] = useState<Date>(new Date());
  const [timeRemaining, setTimeRemaining] = useState<number>(timeLimit || 0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [result, setResult] = useState<QuestionResult | null>(null);

  // Extract question data
  const { target, options, id } = question;
  const multipleChoiceOptions = options || [];

  // Component ID for ARIA relationships
  const componentId = useMemo(() => `recognition-mode-${id}`, [id]);

  // Timer effect
  useEffect(() => {
    if (!timeLimit || isSubmitted) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLimit, isSubmitted]);

  // Handle timeout
  const handleTimeOut = useCallback(() => {
    if (isSubmitted) return;
    
    setIsSubmitted(true);
    onTimeOut?.();
    
    // Create a timeout answer
    const timeoutAnswer: UserAnswer = {
      questionId: id,
      answer: selectedQuality || 'major', // Default to major if nothing selected
      responseTime: (timeLimit || 0) * 1000,
      timestamp: new Date(),
    };

    const validation = validateAnswer(question, timeoutAnswer);
    const questionResult = createQuestionResult(question, timeoutAnswer, validation);
    
    setResult(questionResult);
    setShowFeedback(true);
    
    // Auto-advance after feedback
    setTimeout(() => {
      onAnswer(questionResult);
    }, 3000);
  }, [isSubmitted, selectedQuality, timeLimit, id, question, onAnswer, onTimeOut]);

  // Handle quality selection
  const handleQualitySelect = useCallback((quality: TriadQuality) => {
    if (isSubmitted) return;
    setSelectedQuality(quality);
  }, [isSubmitted]);

  // Handle answer submission
  const handleSubmit = useCallback(() => {
    if (!selectedQuality || isSubmitted) return;

    setIsSubmitted(true);
    const endTime = new Date();
    const responseTime = endTime.getTime() - startTime.getTime();

    const userAnswer: UserAnswer = {
      questionId: id,
      answer: selectedQuality,
      responseTime,
      timestamp: endTime,
    };

    const validation = validateAnswer(question, userAnswer);
    const questionResult = createQuestionResult(question, userAnswer, validation);
    
    setResult(questionResult);
    setShowFeedback(true);
    
    // Auto-advance after showing feedback
    setTimeout(() => {
      onAnswer(questionResult);
    }, 2000);
  }, [selectedQuality, isSubmitted, startTime, id, question, onAnswer]);

  // Handle Enter key for submission
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && selectedQuality && !isSubmitted) {
      handleSubmit();
    }
  }, [selectedQuality, isSubmitted, handleSubmit]);

  // Format time remaining
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={`recognition-mode recognition-mode--${size} ${className}`}
      role="main"
      aria-label={ariaLabel || 'Recognition mode practice question'}
      onKeyDown={handleKeyDown}
    >
      {/* Screen reader description */}
      <div id={`${componentId}-description`} className="sr-only">
        Recognition mode: Look at the triad on the fretboard and identify its quality.
        Select one of the multiple choice options and press Enter to submit.
        {timeLimit && `Time limit: ${formatTime(timeRemaining)} remaining.`}
      </div>

      {/* Timer display */}
      {timeLimit && (
        <div className="recognition-mode__timer" aria-live="polite">
          <span className="recognition-mode__timer-label">Time:</span>
          <span 
            className={`recognition-mode__timer-value ${timeRemaining <= 10 ? 'recognition-mode__timer-value--warning' : ''}`}
            aria-label={`${formatTime(timeRemaining)} remaining`}
          >
            {formatTime(timeRemaining)}
          </span>
        </div>
      )}

      {/* Question header */}
      <div className="recognition-mode__header">
        <h2 className="recognition-mode__title">What type of triad is this?</h2>
        <p className="recognition-mode__instructions">
          Look at the chord shape on the fretboard and identify the triad quality.
        </p>
      </div>

      {/* Triad display */}
      <div className="recognition-mode__triad-display">
        <TriadSelector
          initialSelection={target}
          size={size}
          onChange={() => {}} // Read-only for recognition mode
          className="recognition-mode__triad-selector"
          aria-label={`Triad to identify: chord chart in ${target.neckPosition}`}
        />
      </div>

      {/* Answer options */}
      <div 
        className="recognition-mode__options"
        role="radiogroup"
        aria-labelledby={`${componentId}-options-label`}
        aria-describedby={`${componentId}-description`}
      >
        <h3 id={`${componentId}-options-label`} className="recognition-mode__options-title">
          Choose the triad quality:
        </h3>
        
        <div className="recognition-mode__options-grid">
          {multipleChoiceOptions.map((option, index) => (
            <label 
              key={option}
              className={`recognition-mode__option ${selectedQuality === option ? 'recognition-mode__option--selected' : ''} ${isSubmitted ? 'recognition-mode__option--disabled' : ''}`}
            >
              <input
                type="radio"
                name={`${componentId}-quality`}
                value={option}
                checked={selectedQuality === option}
                onChange={() => handleQualitySelect(option as TriadQuality)}
                disabled={isSubmitted}
                className="recognition-mode__radio"
                aria-describedby={`${componentId}-option-${index}-description`}
              />
              <span className="recognition-mode__option-label">{option}</span>
              <span id={`${componentId}-option-${index}-description`} className="sr-only">
                {option} triad quality
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit button */}
      <div className="recognition-mode__actions">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selectedQuality || isSubmitted}
          className="recognition-mode__submit-button"
          aria-describedby={`${componentId}-submit-help`}
        >
          {isSubmitted ? 'Submitted' : 'Submit Answer'}
        </button>
        <p id={`${componentId}-submit-help`} className="recognition-mode__submit-help sr-only">
          {!selectedQuality ? 'Select a triad quality to enable submit' : 'Press to submit your answer'}
        </p>
      </div>

      {/* Feedback display */}
      {showFeedback && result && (
        <div 
          className={`recognition-mode__feedback ${result.isCorrect ? 'recognition-mode__feedback--correct' : 'recognition-mode__feedback--incorrect'}`}
          role="alert"
          aria-live="assertive"
        >
          <div className="recognition-mode__feedback-header">
            <span className="recognition-mode__feedback-status">
              {result.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </span>
            <span className="recognition-mode__feedback-points">
              +{result.points} points
            </span>
          </div>
          <p className="recognition-mode__feedback-message">
            {result.feedback}
          </p>
          {result.question.target.quality !== selectedQuality && (
            <p className="recognition-mode__feedback-explanation">
              The correct answer is <strong>{result.question.target.quality}</strong>.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Validation in development mode
if (process.env.NODE_ENV === 'development') {
  RecognitionMode.displayName = 'RecognitionMode';
}

export default RecognitionMode;