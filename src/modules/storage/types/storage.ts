/**
 * Storage types for data persistence
 */

export type { PracticeSession } from "@practice-engine/types/practice";

export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: Date;
  type: "accuracy" | "streak" | "practice-time" | "milestone";
}

export interface UserProgress {
  userId: string;
  totalSessions: number;
  totalPracticeTime: number; // minutes
  accuracy: {
    overall: number;
    byMode: Record<string, number>;
    byTriadType: Record<string, number>;
  };
  achievements: Achievement[];
  currentStreak: number;
  lastPracticeDate: Date;
}
