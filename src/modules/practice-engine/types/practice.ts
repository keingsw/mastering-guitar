/**
 * Practice engine types for session management and scoring
 */

export type PracticeMode = "recognition" | "construction" | "progression" | "ear-training";
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export interface Question {
  id: string;
  mode: PracticeMode;
  difficulty: DifficultyLevel;
  data: unknown; // Question-specific data
}

export interface Answer {
  questionId: string;
  response: unknown; // Answer-specific data
  responseTime: number; // milliseconds
  timestamp: Date;
}

export interface SessionStats {
  totalQuestions: number;
  correctAnswers: number;
  averageResponseTime: number;
  accuracy: number; // percentage
}

export interface PracticeSession {
  id: string;
  mode: PracticeMode;
  startTime: Date;
  endTime?: Date;
  trialsCompleted: number;
  correctAnswers: number;
  averageResponseTime: number;
  difficulty: DifficultyLevel;
  stats: SessionStats;
}
