# Guitar Triads Mastery App - Architecture Specification

## Overview

A React + Vite application for mastering guitar triads through interactive visualization, practice modes, and progress tracking. Built with TypeScript for type safety and scalable architecture.

## Core Requirements

### Functional Requirements
- **Chord Visualization**: Interactive fretboard with highlighted triad positions
- **Practice Modes**: Recognition, construction, progression, and ear training
- **Progress Tracking**: Session storage, accuracy metrics, achievement system
- **Music Theory Engine**: Note calculations, interval logic, triad generation
- **Responsive Design**: Mobile-first approach for practice accessibility

### Non-Functional Requirements
- **Performance**: <3s load time, smooth interactions (60fps)
- **Accessibility**: WCAG 2.1 AA compliance for educational tools
- **Offline Capability**: LocalStorage/IndexedDB for practice data
- **Scalability**: Extensible to other chord types and instruments
- **Browser Support**: Modern browsers with ES2020+ support

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Guitar Triads Mastery App                │
├─────────────────────────────────────────────────────────────┤
│  Presentation Layer (React Components)                     │
│  ┌─────────────────┐ ┌─────────────────┐ ┌───────────────┐ │
│  │   Fretboard     │ │  Practice Modes │ │   Progress    │ │
│  │   Component     │ │   Components    │ │  Dashboard    │ │
│  └─────────────────┘ └─────────────────┘ └───────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  State Management Layer (React Context + useReducer)       │
│  ┌─────────────────┐ ┌─────────────────┐ ┌───────────────┐ │
│  │  Music Theory   │ │  Practice State │ │  User Progress│ │
│  │    Context      │ │    Context      │ │    Context    │ │
│  └─────────────────┘ └─────────────────┘ └───────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  Business Logic Layer (Services & Utilities)               │
│  ┌─────────────────┐ ┌─────────────────┐ ┌───────────────┐ │
│  │  Music Theory   │ │  Practice Logic │ │  Storage API  │ │
│  │    Engine       │ │    Service      │ │    Service    │ │
│  └─────────────────┘ └─────────────────┘ └───────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  Data Layer (Static Data & Storage)                        │
│  ┌─────────────────┐ ┌─────────────────┐ ┌───────────────┐ │
│  │  Chord Database │ │  Fretboard Data │ │  LocalStorage │ │
│  │     (JSON)      │ │     (JSON)      │ │   IndexedDB   │ │
│  └─────────────────┘ └─────────────────┘ └───────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Core Framework
- **React 19**: Latest features including React Compiler and improved concurrent rendering
- **Vite**: Fast development server and optimized production builds
- **TypeScript**: Type safety and enhanced developer experience
- **CSS Modules + PostCSS**: Scoped styling with custom properties and modern CSS features

### State Management
- **React 19 Context + useReducer**: Built-in state management with performance optimizations
- **useState/useReducer**: Local component state management
- **TanStack Query**: Server state management (if future API integration needed)

### Music Theory & Audio
- **Tone.js**: Web Audio API wrapper for sound generation (optional)
- **Custom Music Engine**: Core music theory calculations
- **SVG**: Scalable vector graphics for fretboard visualization

### Development Tools
- **Biome**: All-in-one toolchain for linting, formatting, and code quality
- **Vitest**: Unit testing framework
- **Playwright**: End-to-end testing
- **Storybook**: Component development and documentation

## Project Structure

```
src/
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── Button/
│   │   ├── Card/
│   │   └── Select/
│   ├── fretboard/              # Fretboard-specific components
│   │   ├── Fretboard/
│   │   ├── FretboardNote/
│   │   └── FretboardPosition/
│   ├── practice/               # Practice mode components
│   │   ├── RecognitionMode/
│   │   ├── ConstructionMode/
│   │   ├── ProgressionMode/
│   │   └── PracticeTimer/
│   └── layout/                 # Layout components
│       ├── Header/
│       ├── Sidebar/
│       └── MainContent/
├── hooks/                      # Custom React hooks
│   ├── useChordCalculations.ts
│   ├── usePracticeSession.ts
│   ├── useProgressTracking.ts
│   └── useAudioPlayback.ts
├── services/                   # Business logic services
│   ├── musicTheory/
│   │   ├── Note.ts
│   │   ├── Interval.ts
│   │   ├── Triad.ts
│   │   └── FretboardMapper.ts
│   ├── practiceEngine/
│   │   ├── PracticeSessionManager.ts
│   │   ├── ScoreCalculator.ts
│   │   └── DifficultyAdjuster.ts
│   └── storage/
│       ├── LocalStorageService.ts
│       ├── IndexedDBService.ts
│       └── ProgressStorage.ts
├── contexts/                   # React Context providers
│   ├── MusicTheoryContext.tsx
│   ├── PracticeContext.tsx
│   ├── ProgressContext.tsx
│   └── reducers/
│       ├── musicTheoryReducer.ts
│       ├── practiceReducer.ts
│       └── progressReducer.ts
├── data/                       # Static data and configurations
│   ├── chords/
│   │   ├── triads.json
│   │   └── fretboardPositions.json
│   ├── scales/
│   └── tunings/
├── utils/                      # Utility functions
│   ├── constants.ts
│   ├── helpers.ts
│   └── validation.ts
├── types/                      # TypeScript type definitions
│   ├── music.ts
│   ├── practice.ts
│   ├── storage.ts
│   └── ui.ts
└── styles/                     # Global styles and themes
    ├── globals.css
    ├── variables.css
    └── components.css
```

## Core Data Models

### Music Theory Types

```typescript
// Note representation
interface Note {
  name: NoteName;
  octave?: number;
  frequency?: number;
}

type NoteName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

// Interval calculation
interface Interval {
  semitones: number;
  name: string;
  quality: 'perfect' | 'major' | 'minor' | 'augmented' | 'diminished';
}

// Triad structure
interface Triad {
  root: Note;
  third: Note;
  fifth: Note;
  quality: 'major' | 'minor' | 'diminished' | 'augmented';
  symbol: string;
}

// Fretboard position
interface FretboardPosition {
  string: number; // 1-6 (high E to low E)
  fret: number;   // 0-24
  note: Note;
  isRoot?: boolean;
  isThird?: boolean;
  isFifth?: boolean;
}

// Chord voicing on fretboard
interface ChordVoicing {
  triad: Triad;
  positions: FretboardPosition[];
  fingering: number[]; // Finger numbers (0-4)
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  neckPosition: number; // Fret position (0-12)
}
```

### Practice & Progress Types

```typescript
// Practice session data
interface PracticeSession {
  id: string;
  mode: PracticeMode;
  startTime: Date;
  endTime?: Date;
  trialsCompleted: number;
  correctAnswers: number;
  averageResponseTime: number;
  difficulty: DifficultyLevel;
}

type PracticeMode = 'recognition' | 'construction' | 'progression' | 'ear-training';
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// User progress tracking
interface UserProgress {
  userId: string;
  totalSessions: number;
  totalPracticeTime: number; // minutes
  accuracy: {
    overall: number;
    byMode: Record<PracticeMode, number>;
    byTriadType: Record<string, number>;
  };
  achievements: Achievement[];
  currentStreak: number;
  lastPracticeDate: Date;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: Date;
  type: 'accuracy' | 'streak' | 'practice-time' | 'milestone';
}
```

## Component Architecture

### Fretboard Component Hierarchy

```typescript
// Main fretboard container
<Fretboard
  voicing={selectedVoicing}
  highlightedNotes={highlightedNotes}
  onNoteClick={handleNoteClick}
  showNoteNames={showNoteNames}
  showIntervals={showIntervals}
>
  <FretboardNeck strings={6} frets={15} />
  <FretboardNotes positions={voicing.positions} />
  <FretboardMarkers positions={[3, 5, 7, 9, 12]} />
</Fretboard>

// Interactive fretboard note
<FretboardNote
  position={position}
  isHighlighted={isHighlighted}
  noteColor={noteColor}
  onClick={onNoteClick}
  showName={showNoteName}
  showInterval={showInterval}
/>
```

### Practice Mode Components

```typescript
// Recognition mode - show chord, identify type
<RecognitionMode
  currentTriad={currentTriad}
  onAnswer={handleAnswer}
  showHint={showHint}
  timeLimit={timeLimit}
>
  <Fretboard voicing={currentVoicing} />
  <AnswerOptions options={triadOptions} />
  <PracticeTimer duration={timeLimit} />
</RecognitionMode>

// Construction mode - build chord from instructions
<ConstructionMode
  targetTriad={targetTriad}
  onPositionSelect={handlePositionSelect}
  selectedPositions={selectedPositions}
>
  <Fretboard 
    onNoteClick={handleNoteClick}
    selectedPositions={selectedPositions}
    showAllNotes={true}
  />
  <InstructionPanel triad={targetTriad} />
</ConstructionMode>
```

## State Management Strategy

### Context Architecture

```typescript
// Music theory context state
interface MusicTheoryState {
  selectedRoot: Note;
  selectedTriadType: TriadType;
  currentVoicing: ChordVoicing;
  availableVoicings: ChordVoicing[];
  fretboardRange: { start: number; end: number };
}

// Music theory actions
type MusicTheoryAction = 
  | { type: 'SET_ROOT'; payload: Note }
  | { type: 'SET_TRIAD_TYPE'; payload: TriadType }
  | { type: 'SET_VOICING'; payload: ChordVoicing }
  | { type: 'CALCULATE_VOICINGS' };

// Practice context state
interface PracticeState {
  currentMode: PracticeMode;
  isActive: boolean;
  currentQuestion: Question;
  sessionStats: SessionStats;
  difficulty: DifficultyLevel;
}

// Practice actions
type PracticeAction =
  | { type: 'START_SESSION'; payload: PracticeMode }
  | { type: 'SUBMIT_ANSWER'; payload: Answer }
  | { type: 'END_SESSION' }
  | { type: 'ADJUST_DIFFICULTY' };

// Progress context state
interface ProgressState {
  userProgress: UserProgress;
  sessionHistory: PracticeSession[];
  isLoading: boolean;
}

// Progress actions  
type ProgressAction =
  | { type: 'UPDATE_PROGRESS'; payload: PracticeSession }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: Achievement }
  | { type: 'LOAD_PROGRESS_START' }
  | { type: 'LOAD_PROGRESS_SUCCESS'; payload: UserProgress };
```

## Performance Considerations

### Code Splitting
```typescript
// Lazy load practice modes
const RecognitionMode = lazy(() => import('./components/practice/RecognitionMode'));
const ConstructionMode = lazy(() => import('./components/practice/ConstructionMode'));
const ProgressionMode = lazy(() => import('./components/practice/ProgressionMode'));

// Route-based splitting
const routes = [
  { path: '/', component: lazy(() => import('./pages/Home')) },
  { path: '/practice', component: lazy(() => import('./pages/Practice')) },
  { path: '/progress', component: lazy(() => import('./pages/Progress')) },
];
```

### Optimization Strategies
- **Virtualization**: Large chord databases with react-window
- **Memoization**: React.memo for expensive chord calculations
- **Web Workers**: Music theory calculations in background thread
- **Service Worker**: Cache static chord data and app shell
- **Bundle Splitting**: Separate bundles for practice modes

## Accessibility Features

### WCAG 2.1 AA Compliance
- **Keyboard Navigation**: Full app navigation without mouse
- **Screen Reader Support**: ARIA labels for fretboard positions
- **Color Contrast**: High contrast mode for chord visualization
- **Focus Management**: Logical focus order through components
- **Alternative Text**: Audio descriptions for visual chord diagrams

### Music Education Accessibility
- **Note Name Display**: Optional note names on fretboard
- **Interval Labels**: Roman numeral and interval name options
- **Audio Feedback**: Chord playback for audio learners
- **Colorblind Support**: Pattern-based chord highlighting
- **Large Text Mode**: Adjustable font sizes for music notation

## Security & Privacy

### Data Protection
- **Local Storage Only**: All user data stored locally
- **No Tracking**: No analytics or user behavior tracking
- **Secure Defaults**: Content Security Policy headers
- **Input Validation**: Sanitize all user inputs

### Browser Security
- **CSP Headers**: Strict content security policy
- **CORS Configuration**: Proper cross-origin resource sharing
- **Dependency Scanning**: Regular security audits of npm packages

## Deployment Architecture

### Build Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react(), typescript()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          music: ['tone', './src/services/musicTheory'],
          ui: ['./src/components/ui']
        }
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }
});

// biome.json
{
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "a11y": { "useSemanticElements": "error" },
      "complexity": { "noExcessiveCognitiveComplexity": "warn" }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentSize": 2,
    "lineWidth": 100
  },
  "organizeImports": { "enabled": true },
  "files": { "ignore": ["dist/", "node_modules/"] }
}
```

### Hosting Strategy
- **Static Hosting**: Vercel, Netlify, or GitHub Pages
- **CDN**: Global content delivery for fast loading
- **Progressive Web App**: Service worker for offline capability
- **Caching Strategy**: Aggressive caching for static assets

## Extension Points

### Future Enhancements
- **Additional Chord Types**: 7th chords, extended chords, inversions
- **Multiple Instruments**: Bass guitar, ukulele, mandolin support  
- **Social Features**: Share progress, community challenges
- **Advanced Theory**: Chord progressions, modal interchange
- **Audio Integration**: Real-time pitch detection, backing tracks
- **Mobile App**: React Native conversion for native mobile experience

### Plugin Architecture
```typescript
// Extension interface for new chord types
interface ChordTypePlugin {
  name: string;
  calculatePositions: (root: Note, quality: string) => ChordVoicing[];
  getIntervals: () => Interval[];
  generateExercises: () => Exercise[];
}

// Practice mode plugin system
interface PracticeModePlugin {
  name: string;
  component: React.ComponentType<PracticeModeProps>;
  generateQuestions: (difficulty: DifficultyLevel) => Question[];
  calculateScore: (answers: Answer[]) => Score;
}
```

This architecture provides a solid foundation for a scalable guitar triads mastery application while maintaining flexibility for future enhancements and ensuring accessibility for music education.