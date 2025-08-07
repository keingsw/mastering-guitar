import React, { useState, useCallback, useMemo } from 'react';
import { RecognitionMode } from '../modes/RecognitionMode/RecognitionMode';
import { ConstructionMode } from '../modes/ConstructionMode/ConstructionMode';
import { ProgressionMode } from '../modes/ProgressionMode/ProgressionMode';
import { EarTrainingMode } from '../modes/EarTrainingMode/EarTrainingMode';
import { PracticeErrorBoundary } from '../PracticeErrorBoundary';
import type { ComponentSize } from '../../../../design-system/types/music';
import type { 
  PracticeSession as PracticeSessionType,
  PracticeSettings,
  QuestionResult,
  ProgressIndicator
} from '../../types/practice';
import { PracticeQuestionGenerator } from '../../services/practice-generator';
import { calculateSessionScore } from '../../services/scoring-system';
import './PracticeSession.css';

export interface PracticeSessionProps {
  /** Practice session settings */
  settings: PracticeSettings;
  /** Component size variant */
  size?: ComponentSize;
  /** Callback when session is completed */
  onComplete: (session: PracticeSessionType) => void;
  /** Callback when session is paused */
  onPause?: (session: PracticeSessionType) => void;
  /** Additional CSS class name */
  className?: string;
  /** ARIA label for accessibility */
  'aria-label'?: string;
}

/**
 * Practice Session Component
 * 
 * Orchestrates practice questions and manages session state.
 * Features:
 * - Multiple practice modes support
 * - Progress tracking and scoring
 * - Question generation and validation
 * - Session persistence capabilities
 * - Accessibility compliance
 */
export const PracticeSession: React.FC<PracticeSessionProps> = ({
  settings,
  size = 'md',
  onComplete,
  onPause,
  className = '',
  'aria-label': ariaLabel,
}) => {
  // Generate session ID
  const sessionId = useMemo(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, []);
  
  // Create stable dependency key for question generation
  const questionsKey = useMemo(() => 
    `${settings.mode}-${settings.difficulty}-${settings.questionCount}-${settings.includeQualities.join(',')}-${settings.includePositions.join(',')}`, 
    [settings.mode, settings.difficulty, settings.questionCount, settings.includeQualities, settings.includePositions]
  );

  // Generate questions for the session (only when key configuration changes)
  const questions = useMemo(() => {
    return PracticeQuestionGenerator.generateQuestions({
      difficulty: settings.difficulty,
      mode: settings.mode,
      count: settings.questionCount,
      includeQualities: settings.includeQualities,
      includePositions: settings.includePositions,
    });
  }, [questionsKey, settings.difficulty, settings.mode, settings.questionCount, settings.includeQualities, settings.includePositions]);

  // Session state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionResult[]>([]);
  const [sessionStartTime] = useState<Date>(new Date());
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Current question
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex >= questions.length - 1;

  // Progress calculation
  const progress: ProgressIndicator = useMemo(() => ({
    current: currentQuestionIndex + 1,
    total: questions.length,
    percentage: Math.round(((currentQuestionIndex + 1) / questions.length) * 100),
    questionsRemaining: questions.length - (currentQuestionIndex + 1),
  }), [currentQuestionIndex, questions.length]);

  // Handle answer submission
  const handleAnswer = useCallback((result: QuestionResult) => {
    const newAnswers = [...answers, result];
    setAnswers(newAnswers);

    if (isLastQuestion) {
      // Session completed
      const endTime = new Date();
      const totalTime = endTime.getTime() - sessionStartTime.getTime();
      const score = calculateSessionScore(newAnswers, settings.difficulty, totalTime);
      
      const completedSession: PracticeSessionType = {
        id: sessionId,
        settings,
        questions,
        answers: newAnswers.map(r => r.userAnswer),
        results: newAnswers,
        currentQuestionIndex: questions.length,
        score,
        status: 'completed',
        startTime: sessionStartTime,
        endTime,
        createdAt: sessionStartTime,
        updatedAt: endTime,
      };

      setIsCompleted(true);
      onComplete(completedSession);
    } else {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [answers, isLastQuestion, sessionId, settings, questions, sessionStartTime, onComplete]);

  // Handle pause
  const handlePause = useCallback(() => {
    if (isPaused || isCompleted) return;

    const pausedSession: PracticeSessionType = {
      id: sessionId,
      settings,
      questions,
      answers: answers.map(r => r.userAnswer),
      results: answers,
      currentQuestionIndex,
      score: calculateSessionScore(answers, settings.difficulty, Date.now() - sessionStartTime.getTime()),
      status: 'paused',
      startTime: sessionStartTime,
      createdAt: sessionStartTime,
      updatedAt: new Date(),
    };

    setIsPaused(true);
    onPause?.(pausedSession);
  }, [isPaused, isCompleted, sessionId, settings, questions, answers, currentQuestionIndex, sessionStartTime, onPause]);

  // Session completion screen
  if (isCompleted) {
    const finalScore = calculateSessionScore(answers, settings.difficulty, Date.now() - sessionStartTime.getTime());
    
    return (
      <div className={`practice-session practice-session--completed ${className}`}>
        <div className="practice-session__completion">
          <h2 className="practice-session__completion-title">Session Complete!</h2>
          <div className="practice-session__completion-stats">
            <div className="practice-session__stat">
              <span className="practice-session__stat-label">Accuracy</span>
              <span className="practice-session__stat-value">{Math.round(finalScore.accuracy * 100)}%</span>
            </div>
            <div className="practice-session__stat">
              <span className="practice-session__stat-label">Points</span>
              <span className="practice-session__stat-value">{finalScore.points}</span>
            </div>
            <div className="practice-session__stat">
              <span className="practice-session__stat-label">Best Streak</span>
              <span className="practice-session__stat-value">{finalScore.maxStreak}</span>
            </div>
            <div className="practice-session__stat">
              <span className="practice-session__stat-label">Avg Response</span>
              <span className="practice-session__stat-value">{(finalScore.averageResponseTime / 1000).toFixed(1)}s</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main session interface
  return (
    <div 
      className={`practice-session practice-session--${size} ${className}`}
      role="main"
      aria-label={ariaLabel || `${settings.mode} practice session`}
    >
      {/* Session header */}
      <div className="practice-session__header">
        <div className="practice-session__info">
          <h1 className="practice-session__title">
            {settings.mode.charAt(0).toUpperCase() + settings.mode.slice(1)} Mode
          </h1>
          <p className="practice-session__difficulty">
            Difficulty: <span className="practice-session__difficulty-value">{settings.difficulty}</span>
          </p>
        </div>

        <div className="practice-session__controls">
          <button
            type="button"
            onClick={handlePause}
            className="practice-session__pause-button"
            disabled={isPaused || isCompleted}
          >
            Pause Session
          </button>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="practice-session__progress">
        <div className="practice-session__progress-bar">
          <div 
            className="practice-session__progress-fill"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        <div className="practice-session__progress-text">
          Question {progress.current} of {progress.total} ({progress.percentage}%)
        </div>
      </div>

      {/* Current score */}
      {answers.length > 0 && (
        <div className="practice-session__current-score">
          <div className="practice-session__score-item">
            <span className="practice-session__score-label">Correct:</span>
            <span className="practice-session__score-value">{answers.filter(a => a.isCorrect).length}/{answers.length}</span>
          </div>
          <div className="practice-session__score-item">
            <span className="practice-session__score-label">Points:</span>
            <span className="practice-session__score-value">{answers.reduce((sum, a) => sum + a.points, 0)}</span>
          </div>
        </div>
      )}

      {/* Practice mode component */}
      {currentQuestion && settings.mode === 'recognition' && (
        <PracticeErrorBoundary
          onError={(error, errorInfo) => {
            console.error('Recognition Mode error:', error, errorInfo);
          }}
        >
          <RecognitionMode
            question={currentQuestion}
            size={size}
            timeLimit={settings.timeLimit}
            onAnswer={handleAnswer}
            className="practice-session__mode"
          />
        </PracticeErrorBoundary>
      )}

      {currentQuestion && settings.mode === 'construction' && (
        <PracticeErrorBoundary
          onError={(error, errorInfo) => {
            console.error('Construction Mode error:', error, errorInfo);
          }}
        >
          <ConstructionMode
            question={currentQuestion}
            size={size}
            timeLimit={settings.timeLimit}
            onAnswer={handleAnswer}
            className="practice-session__mode"
          />
        </PracticeErrorBoundary>
      )}

      {currentQuestion && settings.mode === 'progression' && (
        <PracticeErrorBoundary
          onError={(error, errorInfo) => {
            console.error('Progression Mode error:', error, errorInfo);
          }}
        >
          <ProgressionMode
            question={currentQuestion}
            size={size}
            timeLimit={settings.timeLimit}
            onAnswer={handleAnswer}
            className="practice-session__mode"
          />
        </PracticeErrorBoundary>
      )}

      {currentQuestion && settings.mode === 'ear-training' && (
        <PracticeErrorBoundary
          onError={(error, errorInfo) => {
            console.error('Ear Training Mode error:', error, errorInfo);
          }}
        >
          <EarTrainingMode
            question={currentQuestion}
            size={size}
            timeLimit={settings.timeLimit}
            onAnswer={handleAnswer}
            className="practice-session__mode"
          />
        </PracticeErrorBoundary>
      )}

      {/* Placeholder for future modes */}
      {currentQuestion && !['recognition', 'construction', 'progression', 'ear-training'].includes(settings.mode) && (
        <div className="practice-session__placeholder">
          <h3>Coming Soon: {settings.mode} mode</h3>
          <p>This practice mode is under development.</p>
          <button 
            onClick={() => handleAnswer({
              question: currentQuestion,
              userAnswer: {
                questionId: currentQuestion.id,
                answer: 'major',
                responseTime: 1000,
                timestamp: new Date(),
                isCorrect: true,
              },
              correctAnswer: 'major',
              isCorrect: true,
              feedback: 'Placeholder result',
              points: 100,
            })}
            className="practice-session__skip-button"
          >
            Skip Question (Demo)
          </button>
        </div>
      )}
    </div>
  );
};

// Validation in development mode
if (process.env.NODE_ENV === 'development') {
  PracticeSession.displayName = 'PracticeSession';
}

export default PracticeSession;