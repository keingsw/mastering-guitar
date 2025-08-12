import type { NeckPosition, TriadSelection } from "../../../design-system/components/TriadSelector/TriadSelector";
import type { TriadQuality } from "../../../design-system/types/music";

export type PracticeMode = "recognition" | "construction" | "progression" | "ear-training";

export type QuestionType = "identify-quality" | "build-triad" | "chord-progression" | "ear-training" | "hear-quality";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export interface PracticeSettings {
  mode: PracticeMode;
  difficulty: DifficultyLevel;
  questionCount: number;
  timeLimit?: number; // seconds per question
  includePositions: NeckPosition[];
  includeQualities: TriadQuality[];
  enableAudio: boolean;
}

export interface PracticeQuestion {
  id: string;
  type: QuestionType;
  target: TriadSelection;
  options?: string[]; // Multiple choice options for recognition mode
  instructions?: string; // Text instructions for construction mode
  progression?: TriadSelection[]; // Chord progression for progression mode
  tempo?: number; // BPM for progression mode
  audioEnabled?: boolean;
  difficulty: DifficultyLevel;
  createdAt: Date;
}

// User's answer to a question
export interface UserAnswer {
  questionId: string;
  answer: TriadSelection | TriadQuality | string;
  responseTime: number; // milliseconds
  timestamp: Date;
  isCorrect?: boolean; // Set after validation
}

export interface QuestionResult {
  question: PracticeQuestion;
  userAnswer: UserAnswer;
  correctAnswer: TriadSelection | TriadQuality;
  isCorrect: boolean;
  feedback: string;
  points: number;
}

// Session scoring
export interface SessionScore {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number; // 0-1
  totalTime: number; // milliseconds
  averageResponseTime: number; // milliseconds
  streak: number; // current correct streak
  maxStreak: number; // best streak in session
  points: number;
  difficulty: DifficultyLevel;
}

// Complete practice session
export interface PracticeSession {
  id: string;
  userId?: string; // Optional user ID for future user accounts
  settings: PracticeSettings;
  questions: PracticeQuestion[];
  answers: UserAnswer[];
  results: QuestionResult[];
  currentQuestionIndex: number;
  score: SessionScore;
  status: "active" | "completed" | "paused";
  startTime: Date;
  endTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Session statistics and progress tracking
export interface SessionStats {
  totalSessions: number;
  totalTime: number; // milliseconds
  averageAccuracy: number;
  bestStreak: number;
  improvementRate: number; // percentage change in accuracy
  strengthsByMode: Record<PracticeMode, number>; // accuracy by mode
  weaknessesByQuality: Record<TriadQuality, number>; // accuracy by quality
  practiceHistory: PracticeSession[];
}

// Practice question generator options
export interface QuestionGeneratorOptions {
  difficulty: DifficultyLevel;
  mode: PracticeMode;
  count: number;
  includeQualities: TriadQuality[];
  includePositions: NeckPosition[];
  avoidRepeats?: boolean;
  focusWeakAreas?: boolean;
  previousResults?: QuestionResult[];
}

// Audio playback options for ear training
export interface AudioOptions {
  volume: number; // 0-1
  tempo: number; // BPM for progression mode
  noteOrder: "simultaneous" | "ascending" | "descending";
  repeatCount: number;
  timbreName: "sine" | "triangle" | "sawtooth" | "square";
}

// Practice mode configuration
export interface PracticeModeConfig {
  name: string;
  description: string;
  questionTypes: QuestionType[];
  defaultSettings: Partial<PracticeSettings>;
  difficultyProgression: {
    beginner: Partial<PracticeSettings>;
    intermediate: Partial<PracticeSettings>;
    advanced: Partial<PracticeSettings>;
  };
  scoringWeights: {
    accuracy: number;
    speed: number;
    streak: number;
  };
}

// Validation result for practice answers
export interface ValidationResult {
  isCorrect: boolean;
  feedback: string;
  correctAnswer: TriadSelection | TriadQuality;
  explanation?: string;
  points: number;
  partialCredit?: number; // For construction mode partial matches
}

// Progress indicators
export interface ProgressIndicator {
  current: number;
  total: number;
  percentage: number;
  timeRemaining?: number;
  questionsRemaining: number;
}

// Default configurations for each practice mode
export const PRACTICE_MODE_CONFIGS: Record<PracticeMode, PracticeModeConfig> = {
  recognition: {
    name: "Recognition Mode",
    description: "See triad on fretboard, identify the quality",
    questionTypes: ["identify-quality"],
    defaultSettings: {
      questionCount: 10,
      timeLimit: 15,
      includeQualities: ["major", "minor"],
      includePositions: ["open", "position-3", "position-5"],
    },
    difficultyProgression: {
      beginner: {
        questionCount: 5,
        timeLimit: 30,
        includeQualities: ["major", "minor"],
        includePositions: ["open"],
      },
      intermediate: {
        questionCount: 10,
        timeLimit: 15,
        includeQualities: ["major", "minor", "diminished"],
        includePositions: ["open", "position-3", "position-5"],
      },
      advanced: {
        questionCount: 15,
        timeLimit: 10,
        includeQualities: ["major", "minor", "diminished", "augmented"],
        includePositions: ["open", "position-3", "position-5", "position-7"],
      },
    },
    scoringWeights: { accuracy: 0.6, speed: 0.3, streak: 0.1 },
  },
  construction: {
    name: "Construction Mode",
    description: "Build triads from written instructions",
    questionTypes: ["build-triad"],
    defaultSettings: {
      questionCount: 8,
      timeLimit: 30,
      includeQualities: ["major", "minor"],
      includePositions: ["open", "position-3"],
    },
    difficultyProgression: {
      beginner: {
        questionCount: 5,
        timeLimit: 45,
        includeQualities: ["major", "minor"],
        includePositions: ["open"],
      },
      intermediate: {
        questionCount: 8,
        timeLimit: 30,
        includeQualities: ["major", "minor", "diminished"],
        includePositions: ["open", "position-3", "position-5"],
      },
      advanced: {
        questionCount: 12,
        timeLimit: 20,
        includeQualities: ["major", "minor", "diminished", "augmented"],
        includePositions: ["open", "position-3", "position-5", "position-7"],
      },
    },
    scoringWeights: { accuracy: 0.7, speed: 0.2, streak: 0.1 },
  },
  progression: {
    name: "Progression Mode",
    description: "Practice chord changes and progressions",
    questionTypes: ["chord-progression"],
    defaultSettings: {
      questionCount: 6,
      timeLimit: 60,
      includeQualities: ["major", "minor"],
      includePositions: ["open"],
    },
    difficultyProgression: {
      beginner: {
        questionCount: 3,
        timeLimit: 90,
        includeQualities: ["major", "minor"],
        includePositions: ["open"],
      },
      intermediate: {
        questionCount: 6,
        timeLimit: 60,
        includeQualities: ["major", "minor"],
        includePositions: ["open", "position-3"],
      },
      advanced: {
        questionCount: 8,
        timeLimit: 45,
        includeQualities: ["major", "minor", "diminished"],
        includePositions: ["open", "position-3", "position-5"],
      },
    },
    scoringWeights: { accuracy: 0.5, speed: 0.4, streak: 0.1 },
  },
  "ear-training": {
    name: "Ear Training Mode",
    description: "Identify triad quality by listening",
    questionTypes: ["hear-quality"],
    defaultSettings: {
      questionCount: 8,
      timeLimit: 20,
      includeQualities: ["major", "minor"],
      enableAudio: true,
    },
    difficultyProgression: {
      beginner: {
        questionCount: 5,
        timeLimit: 30,
        includeQualities: ["major", "minor"],
      },
      intermediate: {
        questionCount: 8,
        timeLimit: 20,
        includeQualities: ["major", "minor", "diminished"],
      },
      advanced: {
        questionCount: 12,
        timeLimit: 15,
        includeQualities: ["major", "minor", "diminished", "augmented"],
      },
    },
    scoringWeights: { accuracy: 0.8, speed: 0.1, streak: 0.1 },
  },
} as const;

// Scoring constants
export const SCORING = {
  BASE_POINTS: 100,
  SPEED_BONUS_MAX: 50,
  STREAK_MULTIPLIER: 1.1,
  DIFFICULTY_MULTIPLIERS: {
    beginner: 1.0,
    intermediate: 1.5,
    advanced: 2.0,
  },
  PARTIAL_CREDIT: {
    CORRECT_ROOT: 0.3,
    CORRECT_POSITION: 0.2,
    CLOSE_QUALITY: 0.1,
  },
} as const;

// Common chord progressions for progression mode
export const COMMON_PROGRESSIONS = {
  beginner: [
    {
      name: "I-V-vi-IV",
      chords: [
        { rootNote: "C", quality: "major" },
        { rootNote: "G", quality: "major" },
        { rootNote: "A", quality: "minor" },
        { rootNote: "F", quality: "major" },
      ],
    },
    {
      name: "vi-IV-I-V",
      chords: [
        { rootNote: "A", quality: "minor" },
        { rootNote: "F", quality: "major" },
        { rootNote: "C", quality: "major" },
        { rootNote: "G", quality: "major" },
      ],
    },
  ],
  intermediate: [
    {
      name: "ii-V-I",
      chords: [
        { rootNote: "D", quality: "minor" },
        { rootNote: "G", quality: "major" },
        { rootNote: "C", quality: "major" },
      ],
    },
    {
      name: "I-vi-ii-V",
      chords: [
        { rootNote: "C", quality: "major" },
        { rootNote: "A", quality: "minor" },
        { rootNote: "D", quality: "minor" },
        { rootNote: "G", quality: "major" },
      ],
    },
  ],
  advanced: [
    {
      name: "Circle of Fifths",
      chords: [
        { rootNote: "C", quality: "major" },
        { rootNote: "A", quality: "minor" },
        { rootNote: "D", quality: "minor" },
        { rootNote: "G", quality: "major" },
        { rootNote: "E", quality: "minor" },
      ],
    },
  ],
} as const;
