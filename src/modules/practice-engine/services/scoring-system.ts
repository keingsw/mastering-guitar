/**
 * Scoring system for practice sessions
 * Handles validation, scoring, and feedback generation
 */

import type { TriadSelection } from "../../../design-system/components/TriadSelector/TriadSelector";
import type { TriadQuality } from "../../../design-system/types/music";
import type {
  DifficultyLevel,
  PracticeQuestion,
  QuestionResult,
  SessionScore,
  UserAnswer,
  ValidationResult,
} from "../types/practice";
import { SCORING } from "../types/practice";

/**
 * Validate a user's answer against the correct answer
 */
export function validateAnswer(question: PracticeQuestion, userAnswer: UserAnswer): ValidationResult {
  const { type, target } = question;
  const { answer, responseTime } = userAnswer;

  switch (type) {
    case "identify-quality":
      return validateRecognitionAnswer(target.quality, answer as TriadQuality, responseTime);

    case "build-triad":
      return validateConstructionAnswer(target, answer as TriadSelection, responseTime);

    case "chord-progression":
      return validateProgressionAnswer(target, answer as TriadSelection, responseTime);

    case "hear-quality":
      return validateEarTrainingAnswer(target.quality, answer as TriadQuality, responseTime);

    default:
      return {
        isCorrect: false,
        feedback: "Unknown question type",
        correctAnswer: target,
        points: 0,
      };
  }
}

/**
 * Validate recognition mode answer (identify quality)
 */
function validateRecognitionAnswer(
  correctQuality: TriadQuality,
  userQuality: TriadQuality,
  responseTime: number,
): ValidationResult {
  const isCorrect = correctQuality === userQuality;

  if (isCorrect) {
    const points = calculatePoints(SCORING.BASE_POINTS, responseTime, "beginner", true);
    return {
      isCorrect: true,
      feedback: `Correct! This is a ${correctQuality} triad.`,
      correctAnswer: correctQuality,
      explanation: getQualityExplanation(correctQuality),
      points,
    };
  } else {
    // Check for partial credit (similar qualities)
    const partialCredit = getPartialCredit(correctQuality, userQuality);

    return {
      isCorrect: false,
      feedback: `Incorrect. This is a ${correctQuality} triad, not ${userQuality}.`,
      correctAnswer: correctQuality,
      explanation: getQualityExplanation(correctQuality),
      points: Math.floor(SCORING.BASE_POINTS * partialCredit),
      partialCredit,
    };
  }
}

/**
 * Validate construction mode answer (build triad)
 */
function validateConstructionAnswer(
  correctTriad: TriadSelection,
  userTriad: TriadSelection,
  responseTime: number,
): ValidationResult {
  const rootMatch = correctTriad.rootNote === userTriad.rootNote;
  const qualityMatch = correctTriad.quality === userTriad.quality;
  const positionMatch = correctTriad.neckPosition === userTriad.neckPosition;

  const isCorrect = rootMatch && qualityMatch && positionMatch;

  if (isCorrect) {
    const points = calculatePoints(SCORING.BASE_POINTS, responseTime, "beginner", true);
    return {
      isCorrect: true,
      feedback: "Perfect! You built the triad correctly.",
      correctAnswer: correctTriad,
      points,
    };
  } else {
    // Calculate partial credit
    let partialCredit = 0;
    let feedback = "Not quite right. ";

    if (rootMatch) {
      partialCredit += SCORING.PARTIAL_CREDIT.CORRECT_ROOT;
      feedback += "Root note is correct. ";
    } else {
      feedback += `Root should be ${correctTriad.rootNote}, not ${userTriad.rootNote}. `;
    }

    if (qualityMatch) {
      partialCredit += SCORING.PARTIAL_CREDIT.CLOSE_QUALITY;
      feedback += "Quality is correct. ";
    } else {
      feedback += `Quality should be ${correctTriad.quality}, not ${userTriad.quality}. `;
    }

    if (positionMatch) {
      partialCredit += SCORING.PARTIAL_CREDIT.CORRECT_POSITION;
      feedback += "Position is correct.";
    } else {
      feedback += `Position should be ${correctTriad.neckPosition}, not ${userTriad.neckPosition}.`;
    }

    const points = Math.floor(SCORING.BASE_POINTS * partialCredit);

    return {
      isCorrect: false,
      feedback,
      correctAnswer: correctTriad,
      points,
      partialCredit,
    };
  }
}

/**
 * Validate progression mode answer
 */
function validateProgressionAnswer(
  correctTriad: TriadSelection,
  userTriad: TriadSelection,
  responseTime: number,
): ValidationResult {
  // For now, treat progression like construction
  // Future: handle full progression sequences
  return validateConstructionAnswer(correctTriad, userTriad, responseTime);
}

/**
 * Validate ear training mode answer
 */
function validateEarTrainingAnswer(
  correctQuality: TriadQuality,
  userQuality: TriadQuality,
  responseTime: number,
): ValidationResult {
  const isCorrect = correctQuality === userQuality;

  if (isCorrect) {
    const points = calculatePoints(SCORING.BASE_POINTS, responseTime, "beginner", true, 1.2); // Bonus for ear training
    return {
      isCorrect: true,
      feedback: `Excellent ear! This is indeed a ${correctQuality} triad.`,
      correctAnswer: correctQuality,
      explanation: getAuralExplanation(correctQuality),
      points,
    };
  } else {
    const partialCredit = getPartialCredit(correctQuality, userQuality);

    return {
      isCorrect: false,
      feedback: `Close! This triad is ${correctQuality}, which ${getAuralComparison(correctQuality, userQuality)}.`,
      correctAnswer: correctQuality,
      explanation: getAuralExplanation(correctQuality),
      points: Math.floor(SCORING.BASE_POINTS * partialCredit * 0.5), // Reduced partial credit for ear training
      partialCredit,
    };
  }
}

/**
 * Calculate points based on correctness, speed, and difficulty
 */
function calculatePoints(
  basePoints: number,
  responseTime: number,
  difficulty: DifficultyLevel,
  isCorrect: boolean,
  bonus: number = 1.0,
): number {
  if (!isCorrect) return 0;

  // Apply difficulty multiplier
  const difficultyMultiplier = SCORING.DIFFICULTY_MULTIPLIERS[difficulty];
  let points = basePoints * difficultyMultiplier;

  // Apply speed bonus (faster responses get more points)
  const maxSpeedBonusTime = 5000; // 5 seconds
  if (responseTime < maxSpeedBonusTime) {
    const speedBonus = (1 - responseTime / maxSpeedBonusTime) * SCORING.SPEED_BONUS_MAX;
    points += speedBonus;
  }

  // Apply any additional bonus
  points *= bonus;

  return Math.floor(points);
}

/**
 * Calculate session score from individual question results
 */
export function calculateSessionScore(
  results: QuestionResult[],
  difficulty: DifficultyLevel,
  totalTime: number,
): SessionScore {
  const totalQuestions = results.length;
  const correctAnswers = results.filter((r) => r.isCorrect).length;
  const accuracy = totalQuestions > 0 ? correctAnswers / totalQuestions : 0;

  const totalPoints = results.reduce((sum, result) => sum + result.points, 0);
  const totalResponseTime = results.reduce((sum, result) => sum + result.userAnswer.responseTime, 0);
  const averageResponseTime = totalQuestions > 0 ? totalResponseTime / totalQuestions : 0;

  // Calculate streak
  let streak = 0;
  let maxStreak = 0;
  let currentStreak = 0;

  for (const result of results) {
    if (result.isCorrect) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  streak = currentStreak;

  return {
    totalQuestions,
    correctAnswers,
    accuracy,
    totalTime,
    averageResponseTime,
    streak,
    maxStreak,
    points: totalPoints,
    difficulty,
  };
}

/**
 * Get partial credit for similar qualities
 */
function getPartialCredit(correct: TriadQuality, user: TriadQuality): number {
  if (correct === user) return 1.0;

  // Similar qualities get partial credit
  const similarPairs: [TriadQuality, TriadQuality][] = [
    ["major", "minor"],
    ["minor", "diminished"],
    ["major", "augmented"],
  ];

  for (const [a, b] of similarPairs) {
    if ((correct === a && user === b) || (correct === b && user === a)) {
      return SCORING.PARTIAL_CREDIT.CLOSE_QUALITY;
    }
  }

  return 0;
}

/**
 * Get explanation for a triad quality
 */
function getQualityExplanation(quality: TriadQuality): string {
  switch (quality) {
    case "major":
      return "Major triads have a bright, happy sound created by the major third interval (4 semitones from root).";
    case "minor":
      return "Minor triads have a darker, sadder sound created by the minor third interval (3 semitones from root).";
    case "diminished":
      return "Diminished triads have a tense, unstable sound with both minor third and tritone intervals.";
    case "augmented":
      return "Augmented triads have a mysterious, floating sound created by the augmented fifth interval.";
    default:
      return `This is a ${quality} triad.`;
  }
}

/**
 * Get aural explanation for ear training
 */
function getAuralExplanation(quality: TriadQuality): string {
  switch (quality) {
    case "major":
      return "Major triads sound bright and stable. Listen for the uplifting quality.";
    case "minor":
      return "Minor triads sound darker and more melancholic. Notice the lowered third.";
    case "diminished":
      return "Diminished triads sound tense and want to resolve. Both the third and fifth are lowered.";
    case "augmented":
      return "Augmented triads sound dreamy and unresolved. The raised fifth creates the floating quality.";
    default:
      return `Listen for the characteristic sound of ${quality} triads.`;
  }
}

/**
 * Get comparison between qualities for ear training feedback
 */
function getAuralComparison(correct: TriadQuality, user: TriadQuality): string {
  if (correct === "major" && user === "minor") {
    return "sounds brighter than the minor quality you selected";
  } else if (correct === "minor" && user === "major") {
    return "sounds darker than the major quality you selected";
  } else if (correct === "diminished") {
    return "has that characteristic tension and instability";
  } else if (correct === "augmented") {
    return "has that floating, unresolved quality";
  } else {
    return `has the characteristic ${correct} sound`;
  }
}

/**
 * Generate question result from validation
 */
export function createQuestionResult(
  question: PracticeQuestion,
  userAnswer: UserAnswer,
  validation: ValidationResult,
): QuestionResult {
  return {
    question,
    userAnswer: {
      ...userAnswer,
      isCorrect: validation.isCorrect,
    },
    correctAnswer: validation.correctAnswer,
    isCorrect: validation.isCorrect,
    feedback: validation.feedback,
    points: validation.points,
  };
}

/**
 * Calculate streak multiplier for scoring
 */
export function calculateStreakMultiplier(streak: number): number {
  if (streak < 3) return 1.0;
  return Math.min(2.0, 1.0 + (streak - 2) * 0.1);
}

/**
 * Apply streak bonus to points
 */
export function applyStreakBonus(points: number, streak: number): number {
  const multiplier = calculateStreakMultiplier(streak);
  return Math.floor(points * multiplier);
}
