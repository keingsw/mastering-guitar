/**
 * Common types shared across the application
 */

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export type Theme = "light" | "dark" | "system";

export interface AppConfig {
  theme: Theme;
  defaultDifficulty: "beginner" | "intermediate" | "advanced";
  autoSave: boolean;
  soundEnabled: boolean;
}
