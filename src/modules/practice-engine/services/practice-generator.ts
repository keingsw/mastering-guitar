/**
 * Practice question generator service
 * Creates randomized questions for different practice modes
 */

import type { NoteName, TriadQuality } from '../../../design-system/types/music';
import type { TriadSelection, NeckPosition } from '../../../design-system/components/TriadSelector/TriadSelector';
import type { 
  PracticeQuestion, 
  QuestionGeneratorOptions, 
  DifficultyLevel,
  PracticeMode,
  QuestionType
} from '../types/practice';
import { COMMON_PROGRESSIONS } from '../types/practice';

// Available note names for random generation
const ALL_NOTES: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Available triad qualities
const ALL_QUALITIES: TriadQuality[] = ['major', 'minor', 'diminished', 'augmented'];

// Available positions
const ALL_POSITIONS: NeckPosition[] = ['open', 'position-3', 'position-5', 'position-7', 'position-9', 'position-12'];

/**
 * Generate a unique ID for practice questions
 */
function generateQuestionId(): string {
  return `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Pick a random element from an array
 */
function randomPick<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate multiple choice options for recognition mode
 */
function generateMultipleChoiceOptions(correctAnswer: TriadQuality, allQualities: TriadQuality[]): string[] {
  const options = [correctAnswer];
  const otherQualities = allQualities.filter(q => q !== correctAnswer);
  
  // Add 3 random other qualities (or all if less than 3)
  const additionalOptions = shuffle(otherQualities).slice(0, 3);
  options.push(...additionalOptions);
  
  return shuffle(options);
}

/**
 * Generate a random triad selection
 */
function generateRandomTriad(
  includeQualities: TriadQuality[], 
  includePositions: NeckPosition[]
): TriadSelection {
  return {
    rootNote: randomPick(ALL_NOTES),
    quality: randomPick(includeQualities),
    neckPosition: randomPick(includePositions),
  };
}

/**
 * Generate recognition mode questions
 */
function generateRecognitionQuestion(
  difficulty: DifficultyLevel,
  includeQualities: TriadQuality[],
  includePositions: NeckPosition[]
): PracticeQuestion {
  const target = generateRandomTriad(includeQualities, includePositions);
  const options = generateMultipleChoiceOptions(target.quality, includeQualities);
  
  return {
    id: generateQuestionId(),
    type: 'identify-quality',
    target,
    options,
    difficulty,
    createdAt: new Date(),
  };
}

/**
 * Generate construction mode questions
 */
function generateConstructionQuestion(
  difficulty: DifficultyLevel,
  includeQualities: TriadQuality[],
  includePositions: NeckPosition[]
): PracticeQuestion {
  const target = generateRandomTriad(includeQualities, includePositions);
  
  // Generate instructions based on difficulty
  let instructions: string;
  const qualityName = target.quality === 'major' ? '' : target.quality;
  const positionName = target.neckPosition === 'open' ? 'open position' : 
    target.neckPosition.replace('position-', '') + 'th position';
  
  switch (difficulty) {
    case 'beginner':
      instructions = `Build a ${target.rootNote}${qualityName} triad in ${positionName}`;
      break;
    case 'intermediate':
      instructions = `Construct ${target.rootNote}${qualityName} (${target.rootNote}-${getTriadNotes(target).join('-')}) in ${positionName}`;
      break;
    case 'advanced':
      const intervals = getTriadIntervals(target.quality);
      instructions = `Build ${target.rootNote}${qualityName} using intervals ${intervals} in ${positionName}`;
      break;
    default:
      instructions = `Build a ${target.rootNote}${qualityName} triad`;
  }
  
  return {
    id: generateQuestionId(),
    type: 'build-triad',
    target,
    instructions,
    difficulty,
    createdAt: new Date(),
  };
}

/**
 * Generate progression mode questions
 */
function generateProgressionQuestion(
  difficulty: DifficultyLevel,
  includeQualities: TriadQuality[],
  includePositions: NeckPosition[]
): PracticeQuestion {
  // For now, generate a simple 2-chord progression
  // Future: Use COMMON_PROGRESSIONS constant
  const chord1 = generateRandomTriad(includeQualities, includePositions);
  const chord2 = generateRandomTriad(includeQualities, includePositions);
  
  // Store progression in target (we'll expand this structure later)
  const target = chord1; // Primary chord for this question
  
  const progressionName = `${chord1.rootNote}${chord1.quality === 'major' ? '' : chord1.quality} - ${chord2.rootNote}${chord2.quality === 'major' ? '' : chord2.quality}`;
  const instructions = `Play this chord progression: ${progressionName}`;
  
  return {
    id: generateQuestionId(),
    type: 'chord-progression',
    progression: [chord1, chord2],
    target,
    instructions,
    difficulty,
    createdAt: new Date(),
  };
}

/**
 * Generate ear training mode questions
 */
function generateEarTrainingQuestion(
  difficulty: DifficultyLevel,
  includeQualities: TriadQuality[]
): PracticeQuestion {
  // For ear training, position doesn't matter as much
  const target = generateRandomTriad(includeQualities, ['open']);
  const options = generateMultipleChoiceOptions(target.quality, includeQualities);
  
  return {
    id: generateQuestionId(),
    type: 'ear-training',
    target,
    options,
    audioEnabled: true,
    difficulty,
    createdAt: new Date(),
  };
}

/**
 * Get triad notes from a triad selection
 */
function getTriadNotes(triad: TriadSelection): NoteName[] {
  const rootIndex = ALL_NOTES.indexOf(triad.rootNote);
  let intervals: number[];
  
  switch (triad.quality) {
    case 'major':
      intervals = [0, 4, 7];
      break;
    case 'minor':
      intervals = [0, 3, 7];
      break;
    case 'diminished':
      intervals = [0, 3, 6];
      break;
    case 'augmented':
      intervals = [0, 4, 8];
      break;
    default:
      intervals = [0, 4, 7];
  }
  
  return intervals.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    return ALL_NOTES[noteIndex];
  });
}

/**
 * Get triad intervals description
 */
function getTriadIntervals(quality: TriadQuality): string {
  switch (quality) {
    case 'major':
      return 'R-M3-P5';
    case 'minor':
      return 'R-m3-P5';
    case 'diminished':
      return 'R-m3-TT';
    case 'augmented':
      return 'R-M3-+5';
    default:
      return 'R-M3-P5';
  }
}

/**
 * Main question generator function
 */
export class PracticeQuestionGenerator {
  /**
   * Generate practice questions based on options
   */
  static generateQuestions(options: QuestionGeneratorOptions): PracticeQuestion[] {
    const questions: PracticeQuestion[] = [];
    
    for (let i = 0; i < options.count; i++) {
      let question: PracticeQuestion;
      
      switch (options.mode) {
        case 'recognition':
          question = generateRecognitionQuestion(
            options.difficulty,
            options.includeQualities,
            options.includePositions
          );
          break;
          
        case 'construction':
          question = generateConstructionQuestion(
            options.difficulty,
            options.includeQualities,
            options.includePositions
          );
          break;
          
        case 'progression':
          question = generateProgressionQuestion(
            options.difficulty,
            options.includeQualities,
            options.includePositions
          );
          break;
          
        case 'ear-training':
          question = generateEarTrainingQuestion(
            options.difficulty,
            options.includeQualities
          );
          break;
          
        default:
          throw new Error(`Unsupported practice mode: ${options.mode}`);
      }
      
      questions.push(question);
    }
    
    // Avoid repeats if requested
    if (options.avoidRepeats) {
      return removeDuplicateQuestions(questions);
    }
    
    return questions;
  }
  
  /**
   * Generate a single question for a specific mode
   */
  static generateSingleQuestion(
    mode: PracticeMode,
    difficulty: DifficultyLevel,
    includeQualities: TriadQuality[],
    includePositions: NeckPosition[]
  ): PracticeQuestion {
    const options: QuestionGeneratorOptions = {
      difficulty,
      mode,
      count: 1,
      includeQualities,
      includePositions,
    };
    
    return this.generateQuestions(options)[0];
  }
  
  /**
   * Generate adaptive questions based on previous results
   */
  static generateAdaptiveQuestions(options: QuestionGeneratorOptions): PracticeQuestion[] {
    if (!options.focusWeakAreas || !options.previousResults) {
      return this.generateQuestions(options);
    }
    
    // Analyze previous results to identify weak areas
    const weakQualities = identifyWeakQualities(options.previousResults);
    const adaptedOptions = {
      ...options,
      includeQualities: weakQualities.length > 0 ? weakQualities : options.includeQualities,
    };
    
    return this.generateQuestions(adaptedOptions);
  }
}

/**
 * Remove duplicate questions based on target triad
 */
function removeDuplicateQuestions(questions: PracticeQuestion[]): PracticeQuestion[] {
  const seen = new Set<string>();
  return questions.filter(question => {
    const key = `${question.target.rootNote}-${question.target.quality}-${question.target.neckPosition}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Identify weak areas from previous results
 */
function identifyWeakQualities(results: any[]): TriadQuality[] {
  // This would analyze results and return qualities with lower accuracy
  // For now, return empty array (use all qualities)
  return [];
}

/**
 * Utility functions for external use
 */
export const PracticeUtils = {
  generateRandomTriad,
  getTriadNotes,
  getTriadIntervals,
  generateMultipleChoiceOptions,
  ALL_NOTES,
  ALL_QUALITIES,
  ALL_POSITIONS,
};