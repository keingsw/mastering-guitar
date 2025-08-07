import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type { ComponentSize, TriadQuality } from '../../../../../design-system/types/music';
import type { PracticeQuestion, QuestionResult, UserAnswer } from '../../../types/practice';
import { validateAnswer } from '../../../services/scoring-system';
import './EarTrainingMode.css';

export interface EarTrainingModeProps {
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

// Audio synthesis utilities
class AudioSynthesizer {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private cleanupTimer?: NodeJS.Timeout;

  constructor() {
    // Initialize on user interaction to avoid browser restrictions
  }

  private async initializeAudio(): Promise<void> {
    if (this.audioContext) return;
    
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = 0.1; // Low volume
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  async playTriad(rootNote: string, quality: TriadQuality, duration: number = 2000): Promise<void> {
    await this.initializeAudio();
    if (!this.audioContext || !this.gainNode) return;

    const noteFrequencies: Record<string, number> = {
      'C': 261.63,
      'C#': 277.18,
      'D': 293.66,
      'D#': 311.13,
      'E': 329.63,
      'F': 349.23,
      'F#': 369.99,
      'G': 392.00,
      'G#': 415.30,
      'A': 440.00,
      'A#': 466.16,
      'B': 493.88,
    };

    const rootFreq = noteFrequencies[rootNote];
    if (!rootFreq) return;

    // Calculate triad intervals
    let intervals: number[];
    switch (quality) {
      case 'major':
        intervals = [0, 4, 7]; // Root, major third, perfect fifth
        break;
      case 'minor':
        intervals = [0, 3, 7]; // Root, minor third, perfect fifth
        break;
      case 'diminished':
        intervals = [0, 3, 6]; // Root, minor third, diminished fifth
        break;
      case 'augmented':
        intervals = [0, 4, 8]; // Root, major third, augmented fifth
        break;
      default:
        intervals = [0, 4, 7];
    }

    const frequencies = intervals.map(semitones => 
      rootFreq * Math.pow(2, semitones / 12)
    );

    // Play each note of the triad
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.playFrequency(freq, duration / 3);
      }, index * 200); // Slight delay between notes
    });
  }

  private playFrequency(frequency: number, duration: number): void {
    if (!this.audioContext || !this.gainNode) return;

    const oscillator = this.audioContext.createOscillator();
    const envelope = this.audioContext.createGain();
    
    oscillator.connect(envelope);
    envelope.connect(this.gainNode);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    // Simple envelope for smoother sound
    const now = this.audioContext.currentTime;
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(0.1, now + 0.01);
    envelope.gain.exponentialRampToValueAtTime(0.001, now + duration / 1000);
    
    oscillator.start(now);
    oscillator.stop(now + duration / 1000);
  }

  cleanup(): void {
    if (this.cleanupTimer) {
      clearTimeout(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
    
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(console.warn);
      // Force cleanup after timeout to prevent memory leaks
      this.cleanupTimer = setTimeout(() => {
        this.audioContext = null;
        this.gainNode = null;
        this.cleanupTimer = undefined;
      }, 1000);
    } else {
      this.audioContext = null;
      this.gainNode = null;
    }
  }
}

/**
 * Ear Training Mode Component
 * 
 * Audio-based triad identification practice.
 * Features:
 * - Web Audio API synthesis for triad playback
 * - Multiple choice quality identification
 * - Replay functionality
 * - Volume control
 * - Accessibility for audio content
 */
export const EarTrainingMode: React.FC<EarTrainingModeProps> = ({
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
  const [feedback, setFeedback] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(timeLimit || null);
  const [startTime] = useState<Date>(new Date());
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [audioSupported, setAudioSupported] = useState(true);
  
  const synthesizerRef = useRef<AudioSynthesizer | null>(null);

  // Initialize synthesizer
  useEffect(() => {
    synthesizerRef.current = new AudioSynthesizer();
    
    // Check Web Audio API support
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) {
      setAudioSupported(false);
    }

    return () => {
      synthesizerRef.current?.cleanup();
    };
  }, []);

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

  // Available quality options for multiple choice
  const qualityOptions: TriadQuality[] = useMemo(() => {
    const baseOptions: TriadQuality[] = ['major', 'minor'];
    
    // Add advanced options based on difficulty
    if (question.difficulty === 'intermediate') {
      baseOptions.push('diminished');
    } else if (question.difficulty === 'advanced') {
      baseOptions.push('diminished', 'augmented');
    }
    
    return baseOptions;
  }, [question.difficulty]);

  // Format time display
  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Play the triad audio
  const handlePlayTriad = useCallback(async () => {
    if (isPlaying || !synthesizerRef.current || !audioSupported) return;
    
    setIsPlaying(true);
    setHasPlayedOnce(true);
    
    try {
      await synthesizerRef.current.playTriad(
        question.target.rootNote,
        question.target.quality,
        2000
      );
    } catch (error) {
      console.warn('Audio playback failed:', error);
      setAudioSupported(false);
    }
    
    // Reset playing state after duration
    setTimeout(() => {
      setIsPlaying(false);
    }, 2500);
  }, [isPlaying, question.target, audioSupported]);

  // Handle quality selection
  const handleQualitySelect = useCallback((quality: TriadQuality) => {
    if (isSubmitted) return;
    setSelectedQuality(quality);
  }, [isSubmitted]);

  // Handle answer submission
  const handleSubmit = useCallback(() => {
    if (isSubmitted || !selectedQuality) return;

    const responseTime = new Date().getTime() - startTime.getTime();
    const isCorrect = selectedQuality === question.target.quality;
    
    const userAnswer: UserAnswer = {
      questionId: question.id,
      answer: selectedQuality,
      responseTime,
      timestamp: new Date(),
      isCorrect,
    };

    const validationResult = validateAnswer(question, userAnswer);
    
    setFeedback(validationResult.explanation);
    setIsSubmitted(true);
    
    const result: QuestionResult = {
      question,
      userAnswer,
      correctAnswer: question.target.quality,
      isCorrect,
      feedback: validationResult.explanation,
      points: validationResult.points,
    };

    // Submit after a brief delay to show feedback
    setTimeout(() => {
      onAnswer(result);
    }, 1500);
  }, [question, selectedQuality, startTime, onAnswer, isSubmitted]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isSubmitted) return;
      
      if (event.key === 'Enter' && selectedQuality) {
        event.preventDefault();
        handleSubmit();
      } else if (event.key === ' ') {
        event.preventDefault();
        handlePlayTriad();
      } else if (event.key >= '1' && event.key <= '4') {
        const index = parseInt(event.key) - 1;
        if (index < qualityOptions.length) {
          handleQualitySelect(qualityOptions[index]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSubmit, handlePlayTriad, handleQualitySelect, selectedQuality, isSubmitted, qualityOptions]);

  // Timer warning threshold
  const isTimeWarning = timeRemaining !== null && timeRemaining <= 5;

  return (
    <div 
      className={`ear-training-mode ear-training-mode--${size} ${className}`}
      role="main"
      aria-label={ariaLabel || 'Ear training mode practice question'}
    >
      {/* Screen reader description */}
      <div className="sr-only">
        Ear training mode: Listen to the triad and identify its quality. 
        Use the play button or spacebar to hear the audio. Select your answer from the options.
      </div>

      {/* Timer (if enabled) */}
      {timeLimit && timeRemaining !== null && (
        <div className="ear-training-mode__timer">
          <span className="ear-training-mode__timer-label">Time:</span>
          <span 
            className={`ear-training-mode__timer-value ${
              isTimeWarning ? 'ear-training-mode__timer-value--warning' : ''
            }`}
          >
            {formatTime(timeRemaining)}
          </span>
        </div>
      )}

      {/* Instructions */}
      <div className="ear-training-mode__instructions">
        <h2 className="ear-training-mode__question">Listen and Identify</h2>
        <p className="ear-training-mode__description">
          {question.instructions || 'Listen to the triad and identify its quality. You can replay the audio as many times as needed.'}
        </p>
      </div>

      {/* Audio controls */}
      <div className="ear-training-mode__audio-controls">
        {audioSupported ? (
          <button
            type="button"
            onClick={handlePlayTriad}
            disabled={isPlaying}
            className={`ear-training-mode__play-button ${
              isPlaying ? 'ear-training-mode__play-button--playing' : ''
            } ${
              hasPlayedOnce ? 'ear-training-mode__play-button--played' : ''
            }`}
            aria-describedby="audio-instructions"
          >
            {isPlaying ? (
              <>
                <span className="ear-training-mode__play-icon">🔊</span>
                Playing...
              </>
            ) : (
              <>
                <span className="ear-training-mode__play-icon">🔊</span>
                {hasPlayedOnce ? 'Play Again' : 'Play Triad'}
              </>
            )}
          </button>
        ) : (
          <div className="ear-training-mode__audio-fallback">
            <div className="ear-training-mode__fallback-icon">🔇</div>
            <div className="ear-training-mode__fallback-text">
              <strong>Audio not available</strong><br />
              Web Audio API is not supported in this browser.
              <br />
              <small>Target: {question.target.rootNote} {question.target.quality}</small>
            </div>
          </div>
        )}
      </div>

      {/* Quality options */}
      <div className="ear-training-mode__options">
        <div className="ear-training-mode__options-label">
          What quality do you hear?
        </div>
        <div className="ear-training-mode__quality-grid">
          {qualityOptions.map((quality, index) => (
            <button
              key={quality}
              type="button"
              onClick={() => handleQualitySelect(quality)}
              disabled={isSubmitted}
              className={`ear-training-mode__quality-option ${
                selectedQuality === quality ? 'ear-training-mode__quality-option--selected' : ''
              } ${
                isSubmitted && quality === question.target.quality 
                  ? 'ear-training-mode__quality-option--correct' 
                  : ''
              } ${
                isSubmitted && selectedQuality === quality && quality !== question.target.quality
                  ? 'ear-training-mode__quality-option--incorrect'
                  : ''
              }`}
              aria-label={`Select ${quality} quality. Keyboard shortcut: ${index + 1}`}
            >
              <span className="ear-training-mode__quality-name">{quality}</span>
              <span className="ear-training-mode__quality-shortcut">{index + 1}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Submit button */}
      <div className="ear-training-mode__actions">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitted || !selectedQuality}
          className={`ear-training-mode__submit-button ${
            selectedQuality ? 'ear-training-mode__submit-button--ready' : ''
          } ${
            isSubmitted ? 'ear-training-mode__submit-button--submitted' : ''
          }`}
        >
          {isSubmitted ? 'Submitted' : 'Submit Answer'}
        </button>
      </div>

      {/* Feedback */}
      {feedback && (
        <div 
          className={`ear-training-mode__feedback ${
            selectedQuality === question.target.quality 
              ? 'ear-training-mode__feedback--correct' 
              : 'ear-training-mode__feedback--incorrect'
          }`}
          role="alert"
          aria-live="assertive"
        >
          <div className="ear-training-mode__feedback-header">
            {selectedQuality === question.target.quality ? (
              <span className="ear-training-mode__feedback-icon">✓ Correct!</span>
            ) : (
              <span className="ear-training-mode__feedback-icon">✗ Incorrect</span>
            )}
          </div>
          <div className="ear-training-mode__feedback-text">
            {feedback}
          </div>
          {selectedQuality !== question.target.quality && (
            <div className="ear-training-mode__correct-answer">
              The correct answer was: <strong>{question.target.quality}</strong>
            </div>
          )}
        </div>
      )}

      {/* Hidden instructions for screen readers */}
      <div id="audio-instructions" className="sr-only">
        Click to play the triad audio, or press spacebar. 
        Use number keys 1-{qualityOptions.length} to select quality options.
        Press Enter to submit your answer when ready.
        {timeLimit && ` Time limit: ${timeLimit} seconds.`}
      </div>
    </div>
  );
};

// Validation in development mode
if (process.env.NODE_ENV === 'development') {
  EarTrainingMode.displayName = 'EarTrainingMode';
}

export default EarTrainingMode;