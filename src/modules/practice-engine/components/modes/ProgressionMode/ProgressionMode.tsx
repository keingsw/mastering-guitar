import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChordDisplay } from "../../../../../design-system/components/ChordDisplay/ChordDisplay";
import type { ComponentSize } from "../../../../../design-system/types/music";
import { validateAnswer } from "../../../services/scoring-system";
import type { PracticeQuestion, QuestionResult, UserAnswer } from "../../../types/practice";
import "./ProgressionMode.css";

export interface ProgressionModeProps {
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
  "aria-label"?: string;
}

/**
 * Progression Mode Component
 *
 * Practice chord progressions and transitions.
 * Features:
 * - Sequential chord progression display
 * - Timing-based progression practice
 * - Multiple progression patterns (I-V-vi-IV, ii-V-I, etc.)
 * - Visual metronome and beat tracking
 * - Progress tracking through progression
 */
export const ProgressionMode: React.FC<ProgressionModeProps> = ({
  question,
  size = "md",
  timeLimit,
  onAnswer,
  onTimeOut,
  className = "",
  "aria-label": ariaLabel,
}) => {
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(timeLimit || null);
  const [startTime] = useState<Date>(new Date());
  const [beatCount, setBeatCount] = useState(0);

  // Extract progression from question
  const progression = useMemo(() => {
    if (question.type === "chord-progression" && question.progression) {
      return question.progression;
    }
    // Default progression if not specified
    return [
      { rootNote: "C", quality: "major", neckPosition: "open" },
      { rootNote: "A", quality: "minor", neckPosition: "open" },
      { rootNote: "F", quality: "major", neckPosition: "open" },
      { rootNote: "G", quality: "major", neckPosition: "open" },
    ];
  }, [question]);

  const currentChord = progression[currentChordIndex];

  // Timer functionality
  useEffect(() => {
    if (!timeLimit || !isPlaying || isCompleted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
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
  }, [timeLimit, isPlaying, isCompleted, onTimeOut]);

  // Progression timing (auto-advance every 4 beats/2 seconds)
  useEffect(() => {
    if (!isPlaying || isCompleted) return;

    const progressionTimer = setInterval(() => {
      setBeatCount((prev) => {
        const newBeat = prev + 1;
        if (newBeat % 4 === 0) {
          // Every 4 beats (2 seconds)
          setCurrentChordIndex((current) => {
            if (current < progression.length - 1) {
              return current + 1;
            } else {
              // Progression completed
              setIsCompleted(true);
              setIsPlaying(false);
              handleProgressionComplete();
              return current;
            }
          });
        }
        return newBeat;
      });
    }, 500); // 120 BPM (500ms per beat)

    return () => clearInterval(progressionTimer);
  }, [isPlaying, isCompleted, progression.length]);

  // Format time display
  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  // Handle progression completion
  const handleProgressionComplete = useCallback(() => {
    const responseTime = new Date().getTime() - startTime.getTime();

    const userAnswer: UserAnswer = {
      questionId: question.id,
      answer: "completed",
      responseTime,
      timestamp: new Date(),
      isCorrect: true, // Successfully completed the progression
    };

    const validationResult = validateAnswer(question, userAnswer);

    const result: QuestionResult = {
      question,
      userAnswer,
      correctAnswer: question.target,
      isCorrect: true,
      feedback: validationResult.explanation || "",
      points: validationResult.points,
    };

    // Submit after a brief delay to show completion
    setTimeout(() => {
      onAnswer(result);
    }, 2000);
  }, [question, startTime, onAnswer]);

  // Start/stop progression
  const handlePlayToggle = useCallback(() => {
    if (isCompleted) return;
    setIsPlaying((prev) => !prev);
    if (!isPlaying) {
      setBeatCount(0);
      setCurrentChordIndex(0);
    }
  }, [isPlaying, isCompleted]);

  // Reset progression
  const handleReset = useCallback(() => {
    setCurrentChordIndex(0);
    setIsPlaying(false);
    setIsCompleted(false);
    setBeatCount(0);
  }, []);

  // Skip to specific chord
  const handleChordSkip = useCallback(
    (index: number) => {
      if (isPlaying || isCompleted) return;
      setCurrentChordIndex(index);
    },
    [isPlaying, isCompleted],
  );

  // Get progression pattern name
  const getProgressionName = useCallback(() => {
    const pattern = progression.map((chord) => `${chord.rootNote}${chord.quality === "minor" ? "m" : ""}`).join("-");

    // Common progression patterns
    const commonPatterns: Record<string, string> = {
      "C-Am-F-G": "I-vi-IV-V (Pop Progression)",
      "C-F-Am-G": "I-IV-vi-V",
      "Am-F-C-G": "vi-IV-I-V",
      "Dm-G-C": "ii-V-I (Jazz)",
    };

    return commonPatterns[pattern] || `${pattern} Progression`;
  }, [progression]);

  // Beat indicator classes
  const getBeatIndicatorClass = useCallback(
    (beat: number) => {
      const currentBeat = (beatCount % 4) + 1;
      return `progression-mode__beat ${beat === currentBeat && isPlaying ? "progression-mode__beat--active" : ""} ${
        beat === 1 ? "progression-mode__beat--strong" : ""
      }`;
    },
    [beatCount, isPlaying],
  );

  // Timer warning threshold
  const isTimeWarning = timeRemaining !== null && timeRemaining <= 10;

  return (
    <div
      className={`progression-mode progression-mode--${size} ${className}`}
      role="main"
      aria-label={ariaLabel || "Progression mode practice question"}
    >
      {/* Screen reader description */}
      <div className="sr-only">
        Progression mode: Practice chord progressions and transitions. Follow along with the progression and maintain
        steady timing.
      </div>

      {/* Timer (if enabled) */}
      {timeLimit && timeRemaining !== null && (
        <div className="progression-mode__timer">
          <span className="progression-mode__timer-label">Time:</span>
          <span
            className={`progression-mode__timer-value ${isTimeWarning ? "progression-mode__timer-value--warning" : ""}`}
          >
            {formatTime(timeRemaining)}
          </span>
        </div>
      )}

      {/* Instructions */}
      <div className="progression-mode__instructions">
        <h2 className="progression-mode__question">Practice Chord Progression</h2>
        <p className="progression-mode__description">
          {question.instructions ||
            `Practice the ${getProgressionName()} progression. Follow the timing and chord changes.`}
        </p>
        <div className="progression-mode__pattern-name">{getProgressionName()}</div>
      </div>

      {/* Progression overview */}
      <div className="progression-mode__overview">
        <div className="progression-mode__chord-sequence">
          {progression.map((chord, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleChordSkip(index)}
              disabled={isPlaying || isCompleted}
              className={`progression-mode__chord-button ${
                index === currentChordIndex ? "progression-mode__chord-button--current" : ""
              } ${index < currentChordIndex ? "progression-mode__chord-button--completed" : ""}`}
              aria-label={`Chord ${index + 1}: ${chord.rootNote} ${chord.quality}`}
            >
              <span className="progression-mode__chord-number">{index + 1}</span>
              <span className="progression-mode__chord-name">
                {chord.rootNote}
                {chord.quality === "minor" ? "m" : ""}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Current chord display */}
      <div className="progression-mode__current-chord">
        <div className="progression-mode__chord-info">
          <div className="progression-mode__chord-counter">
            Chord {currentChordIndex + 1} of {progression.length}
          </div>
          <div className="progression-mode__chord-name-large">
            {currentChord.rootNote} {currentChord.quality === "minor" ? "minor" : "major"}
          </div>
        </div>

        <div className="progression-mode__chord-visual">
          <ChordDisplay
            chord={`${currentChord.rootNote}${currentChord.quality === "major" ? "" : "m"}`}
            size={size}
            showNotes={false}
            aria-label={`Current chord: ${currentChord.rootNote} ${currentChord.quality}`}
          />
        </div>
      </div>

      {/* Beat indicator */}
      {isPlaying && (
        <div className="progression-mode__beat-indicator">
          <div className="progression-mode__beat-label">Beat:</div>
          <div className="progression-mode__beats">
            {[1, 2, 3, 4].map((beat) => (
              <div key={beat} className={getBeatIndicatorClass(beat)} aria-label={`Beat ${beat}`} />
            ))}
          </div>
          <div className="progression-mode__tempo">120 BPM</div>
        </div>
      )}

      {/* Controls */}
      <div className="progression-mode__controls">
        <button
          type="button"
          onClick={handlePlayToggle}
          disabled={isCompleted}
          className={`progression-mode__play-button ${isPlaying ? "progression-mode__play-button--playing" : ""} ${
            isCompleted ? "progression-mode__play-button--completed" : ""
          }`}
        >
          {isCompleted ? "✓ Completed" : isPlaying ? "⏸ Pause" : "▶ Start Progression"}
        </button>

        <button
          type="button"
          onClick={handleReset}
          disabled={!isCompleted && currentChordIndex === 0 && !isPlaying}
          className="progression-mode__reset-button"
        >
          🔄 Reset
        </button>
      </div>

      {/* Completion message */}
      {isCompleted && (
        <div className="progression-mode__completion" role="alert" aria-live="assertive">
          <div className="progression-mode__completion-header">
            <span className="progression-mode__completion-icon">🎉</span>
            <span>Progression Completed!</span>
          </div>
          <div className="progression-mode__completion-text">
            Great job practicing the {getProgressionName()}. You maintained the timing through all {progression.length}{" "}
            chords.
          </div>
        </div>
      )}

      {/* Hidden instructions for screen readers */}
      <div id="progression-mode-instructions" className="sr-only">
        Progression mode practice question. Use the controls to start and stop the progression. Follow along with the
        chord changes and maintain steady timing.
        {timeLimit && ` Time limit: ${timeLimit} seconds.`}
      </div>
    </div>
  );
};

// Validation in development mode
if (process.env.NODE_ENV === "development") {
  ProgressionMode.displayName = "ProgressionMode";
}

export default ProgressionMode;
