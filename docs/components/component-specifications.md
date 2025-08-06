# Component Specifications
## Guitar Triads Mastery Application

**Date:** 2025-08-06  
**Version:** 1.0  
**Status:** Implementation Ready  

## Component Architecture Overview

```
src/components/
├── fretboard/
│   ├── InteractiveFretboard.tsx
│   ├── FretPosition.tsx
│   ├── TheoryPanel.tsx
│   └── FretboardControls.tsx
├── browser/
│   ├── TriadBrowser.tsx
│   ├── ChordSelector.tsx
│   └── ChordDetails.tsx
├── practice/
│   ├── PracticeMode.tsx
│   ├── RecognitionChallenge.tsx
│   ├── ConstructionChallenge.tsx
│   └── ProgressionChallenge.tsx
├── dashboard/
│   ├── ProgressDashboard.tsx
│   ├── SkillBreakdown.tsx
│   ├── SessionHistory.tsx
│   └── Achievements.tsx
└── shared/
    ├── AudioPlayer.tsx
    ├── ResponsiveContainer.tsx
    └── TouchGestureHandler.tsx
```

## Core Components

### 1. InteractiveFretboard Component

#### Props Interface
```typescript
interface InteractiveFretboardProps {
  selectedChord: TriadSelection;
  displayMode: 'theory' | 'minimal' | 'practice';
  showTheoryPanel?: boolean;
  onNoteClick?: (position: FretPosition) => void;
  onPlaySequence?: () => void;
  audioEnabled?: boolean;
  responsive?: boolean;
  className?: string;
}

interface TriadSelection {
  root: Note;
  type: 'major' | 'minor' | 'diminished' | 'augmented';
  position?: number; // Specific fretboard position
  key?: KeySignature;
}

interface FretPosition {
  string: number;      // 0-5 (low E to high E)
  fret: number;        // 0-15
  note: Note;          // Note at this position
  function?: 'root' | 'third' | 'fifth';
  highlighted: boolean;
  playable: boolean;
}
```

#### State Management
```typescript
const [fretboardState, setFretboardState] = useState({
  positions: FretPosition[];
  hoverPosition: FretPosition | null;
  playingSequence: boolean;
  theoryPanelOpen: boolean;
  viewport: ViewportInfo;
});

const [audioState, setAudioState] = useState({
  isPlaying: boolean;
  currentNote: Note | null;
  volume: number;
  sequenceIndex: number;
});
```

#### Responsive Behavior
```typescript
// Desktop Layout (>1024px)
<div className="fretboard-desktop">
  <FretboardControls />
  <div className="fretboard-container">
    <HorizontalFretboard positions={positions} />
    <TheoryPanel expanded={true} />
  </div>
</div>

// Tablet Layout (768px-1024px)
<div className="fretboard-tablet">
  <FretboardControls compact />
  <div className="fretboard-tablet-layout">
    <AdaptiveFretboard orientation={orientation} />
    <CollapsibleTheoryPanel />
  </div>
</div>

// Mobile Portrait (<768px)
<div className="fretboard-mobile-portrait">
  <CompactControls />
  <ScrollableFretboard direction="vertical" />
  <BottomSheetTheoryPanel />
</div>

// Mobile Landscape (<768px landscape)
<div className="fretboard-mobile-landscape">
  <InlineControls />
  <SideBySideLayout>
    <CompactFretboard />
    <MiniTheoryPanel />
  </SideBySideLayout>
</div>
```

#### Accessibility Features
```typescript
// ARIA labels and roles
<div 
  role="application"
  aria-label="Interactive guitar fretboard"
  aria-describedby="theory-panel-description"
>
  {positions.map((position) => (
    <button
      key={`${position.string}-${position.fret}`}
      role="gridcell"
      aria-label={`String ${position.string}, Fret ${position.fret}, ${position.note.name}${position.function ? `, ${position.function}` : ''}`}
      className={`fret-position ${position.function ? `fret-position--${position.function}` : ''}`}
      onClick={() => handlePositionClick(position)}
      onKeyDown={(e) => handleKeyboardInteraction(e, position)}
      tabIndex={position.highlighted ? 0 : -1}
    >
      <span className="visually-hidden">
        {position.note.name} {position.function}
      </span>
    </button>
  ))}
</div>
```

### 2. TriadBrowser Component

#### Props Interface
```typescript
interface TriadBrowserProps {
  onTriadSelect: (triad: TriadSelection) => void;
  selectedTriad?: TriadSelection;
  filterOptions?: FilterOptions;
  displayMode: 'grid' | 'list' | 'circle';
  showPreview?: boolean;
  searchEnabled?: boolean;
}

interface FilterOptions {
  keys?: Note[];
  types?: ChordType[];
  difficulty?: number[];
  favorites?: boolean;
}
```

#### Grid Layout Implementation
```typescript
const GridLayout = ({ triads, onSelect }) => (
  <div className="triad-grid">
    {triads.map((triad) => (
      <div 
        key={`${triad.root}-${triad.type}`}
        className={`triad-card ${selectedTriad === triad ? 'selected' : ''}`}
        onClick={() => onSelect(triad)}
        role="button"
        tabIndex={0}
        aria-pressed={selectedTriad === triad}
      >
        <div className="triad-card-header">
          <h3>{triad.root.name} {triad.type}</h3>
        </div>
        <div className="triad-card-body">
          <MiniNoteDisplay notes={triad.notes} />
          <IntervalDisplay intervals={triad.intervals} />
        </div>
        <div className="triad-card-actions">
          <button onClick={(e) => handlePreview(e, triad)}>
            <PlayIcon /> Preview
          </button>
          <button onClick={(e) => handleFavorite(e, triad)}>
            <HeartIcon /> Favorite
          </button>
        </div>
      </div>
    ))}
  </div>
);
```

#### Search and Filter Implementation
```typescript
const useTriadFilter = (triads: Triad[], filters: FilterOptions) => {
  return useMemo(() => {
    return triads.filter(triad => {
      if (filters.keys && !filters.keys.includes(triad.root)) return false;
      if (filters.types && !filters.types.includes(triad.type)) return false;
      if (filters.difficulty && !isInDifficultyRange(triad, filters.difficulty)) return false;
      if (filters.favorites && !isFavorite(triad)) return false;
      return true;
    });
  }, [triads, filters]);
};

const useTriadSearch = (triads: Triad[], searchTerm: string) => {
  return useMemo(() => {
    if (!searchTerm) return triads;
    
    const term = searchTerm.toLowerCase();
    return triads.filter(triad => 
      triad.root.name.toLowerCase().includes(term) ||
      triad.type.toLowerCase().includes(term) ||
      triad.notes.some(note => note.name.toLowerCase().includes(term))
    );
  }, [triads, searchTerm]);
};
```

### 3. PracticeMode Components

#### Base PracticeMode Component
```typescript
interface PracticeModeProps {
  mode: 'recognition' | 'construction' | 'progression';
  level: number;
  onAnswer: (answer: Answer) => void;
  onComplete: (results: SessionResults) => void;
  settings: PracticeSettings;
}

interface PracticeSettings {
  audioEnabled: boolean;
  hintsEnabled: boolean;
  timeLimit?: number;
  feedbackStyle: 'immediate' | 'session-end';
}

interface Answer {
  questionId: string;
  response: any;
  timeSpent: number;
  hintsUsed: number;
}
```

#### Recognition Challenge
```typescript
const RecognitionChallenge = ({ question, onAnswer, settings }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [audioPlayed, setAudioPlayed] = useState(false);

  return (
    <div className="recognition-challenge">
      <div className="challenge-header">
        <h3>Listen and Identify</h3>
        <ProgressIndicator current={question.index} total={question.total} />
      </div>
      
      <div className="audio-section">
        <AudioPlayer 
          triad={question.triad}
          autoPlay={settings.audioEnabled}
          onPlay={() => setAudioPlayed(true)}
          showWaveform={true}
        />
        <button onClick={() => replay()}>🔄 Play Again</button>
      </div>

      <div className="options-grid">
        {question.options.map((option) => (
          <button
            key={option.id}
            className={`option-button ${selectedAnswer === option.id ? 'selected' : ''}`}
            onClick={() => setSelectedAnswer(option.id)}
            disabled={!audioPlayed && settings.requireAudioFirst}
          >
            <div className="option-content">
              <h4>{option.label}</h4>
              <div className="option-details">
                {option.notes.map(note => note.name).join(' - ')}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="challenge-actions">
        <button onClick={() => showHint()} disabled={!settings.hintsEnabled}>
          💡 Hint
        </button>
        <button 
          onClick={() => submitAnswer()}
          disabled={!selectedAnswer}
          className="primary-button"
        >
          Submit Answer
        </button>
      </div>

      {settings.hintsEnabled && (
        <TheoryHint 
          triad={question.triad}
          level={settings.hintLevel}
        />
      )}
    </div>
  );
};
```

#### Construction Challenge
```typescript
const ConstructionChallenge = ({ question, onAnswer, settings }) => {
  const [constructedTriad, setConstructedTriad] = useState<FretPosition[]>([]);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  return (
    <div className="construction-challenge">
      <div className="challenge-header">
        <h3>Build the Chord</h3>
        <div className="target-info">
          Build: <strong>{question.targetTriad.root.name} {question.targetTriad.type}</strong>
        </div>
      </div>

      <InteractiveFretboard
        selectedChord={null}
        displayMode="construction"
        onNoteClick={handleNoteSelect}
        constructedPositions={constructedTriad}
        validationFeedback={validationResult}
      />

      <div className="construction-feedback">
        <div className="selected-notes">
          Selected: {constructedTriad.map(pos => pos.note.name).join(' - ')}
        </div>
        
        {validationResult && (
          <ValidationFeedback 
            result={validationResult}
            showExplanation={settings.detailedFeedback}
          />
        )}
      </div>

      <div className="challenge-actions">
        <button onClick={() => clearConstruction()}>
          🗑️ Clear
        </button>
        <button onClick={() => validateConstruction()}>
          ✓ Check Answer
        </button>
        <button 
          onClick={() => submitConstruction()}
          disabled={!isValidTriad(constructedTriad)}
          className="primary-button"
        >
          Submit
        </button>
      </div>
    </div>
  );
};
```

### 4. ProgressDashboard Components

#### Main Dashboard Component
```typescript
interface ProgressDashboardProps {
  user: UserProfile;
  timeRange?: 'today' | 'week' | 'month' | 'all';
  view: 'overview' | 'detailed' | 'analytics';
}

const ProgressDashboard = ({ user, timeRange = 'week', view = 'overview' }) => {
  const { progress, stats, achievements } = useProgressData(user.id, timeRange);

  return (
    <div className="progress-dashboard">
      <DashboardHeader user={user} timeRange={timeRange} />
      
      <div className="dashboard-grid">
        <OverallProgress progress={progress.overall} />
        <TodaysStats stats={stats.today} />
        <RecentSessions sessions={stats.sessions} />
        <SkillBreakdown skills={progress.skills} />
        <Achievements achievements={achievements} />
      </div>

      {view === 'detailed' && <DetailedAnalytics data={stats} />}
    </div>
  );
};
```

#### Skill Breakdown Component
```typescript
const SkillBreakdown = ({ skills }) => {
  return (
    <div className="skill-breakdown">
      <h3>Skill Progress</h3>
      
      {skills.map((skill) => (
        <div key={skill.name} className="skill-item">
          <div className="skill-header">
            <span className="skill-name">{skill.name}</span>
            <span className="skill-percentage">{skill.percentage}%</span>
          </div>
          
          <div className="skill-progress-bar">
            <div 
              className="skill-progress-fill"
              style={{ width: `${skill.percentage}%` }}
              role="progressbar"
              aria-valuenow={skill.percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${skill.name} progress: ${skill.percentage}%`}
            />
          </div>
          
          <div className="skill-details">
            <small>
              Level {skill.level} • {skill.practiceTime} practice time
            </small>
          </div>
        </div>
      ))}
    </div>
  );
};
```

## Shared Components

### AudioPlayer Component
```typescript
interface AudioPlayerProps {
  triad?: Triad;
  notes?: Note[];
  sequence?: 'sequential' | 'harmony' | 'arpeggio';
  autoPlay?: boolean;
  loop?: boolean;
  onPlay?: () => void;
  onComplete?: () => void;
  showControls?: boolean;
  showWaveform?: boolean;
}

const AudioPlayer = ({ 
  triad, 
  sequence = 'sequential', 
  autoPlay = false,
  showControls = true,
  onPlay,
  onComplete
}) => {
  const { audioEngine, isLoaded } = useAudioEngine();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePlay = async () => {
    if (!isLoaded || !triad) return;
    
    setIsPlaying(true);
    onPlay?.();
    
    try {
      await audioEngine.playTriadSequence(triad, sequence);
      onComplete?.();
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div className="audio-player">
      {showControls && (
        <div className="audio-controls">
          <button 
            onClick={handlePlay}
            disabled={!isLoaded || isPlaying}
            className="play-button"
            aria-label={isPlaying ? 'Playing...' : 'Play audio'}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          
          <VolumeControl 
            volume={audioEngine.volume}
            onVolumeChange={audioEngine.setVolume}
          />
        </div>
      )}
      
      {isPlaying && (
        <div className="audio-progress" role="progressbar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      
      {!isLoaded && (
        <div className="audio-loading">
          <LoadingSpinner /> Loading audio samples...
        </div>
      )}
    </div>
  );
};
```

### ResponsiveContainer Component
```typescript
interface ResponsiveContainerProps {
  children: React.ReactNode;
  breakpoints?: Breakpoints;
  className?: string;
}

const ResponsiveContainer = ({ children, breakpoints, className }) => {
  const viewport = useResponsive();
  
  return (
    <div 
      className={`responsive-container ${className || ''}`}
      data-viewport={viewport.type}
      data-orientation={viewport.orientation}
    >
      {typeof children === 'function' 
        ? children(viewport)
        : children
      }
    </div>
  );
};

// Usage example
<ResponsiveContainer>
  {(viewport) => (
    viewport.isMobile ? (
      <MobileFretboard />
    ) : (
      <DesktopFretboard />
    )
  )}
</ResponsiveContainer>
```

## Component Integration Patterns

### Context Integration
```typescript
// Each component integrates with relevant contexts
const InteractiveFretboard = () => {
  const { selectedChord, setSelectedChord } = useChordContext();
  const { playSequence, isPlaying } = useAudioContext();
  const { colorCoding, accessibility } = useUIContext();
  const { recordInteraction } = useAnalyticsContext();

  // Component implementation using all contexts
};
```

### Error Boundaries
```typescript
const ComponentErrorBoundary = ({ children, fallback, onError }) => {
  return (
    <ErrorBoundary
      FallbackComponent={fallback || DefaultErrorFallback}
      onError={onError}
    >
      {children}
    </ErrorBoundary>
  );
};

// Wrap critical components
<ComponentErrorBoundary fallback={FretboardErrorFallback}>
  <InteractiveFretboard />
</ComponentErrorBoundary>
```

### Performance Optimization
```typescript
// Memoization for expensive components
const MemoizedFretboard = memo(InteractiveFretboard, (prevProps, nextProps) => {
  return (
    prevProps.selectedChord === nextProps.selectedChord &&
    prevProps.displayMode === nextProps.displayMode &&
    prevProps.audioEnabled === nextProps.audioEnabled
  );
});

// Virtualization for large lists
const VirtualizedTriadList = ({ triads }) => {
  return (
    <FixedSizeList
      height={400}
      itemCount={triads.length}
      itemSize={80}
      itemData={triads}
    >
      {({ index, style, data }) => (
        <div style={style}>
          <TriadListItem triad={data[index]} />
        </div>
      )}
    </FixedSizeList>
  );
};
```

---

*These component specifications provide detailed implementation guidance for building the Guitar Triads Mastery application according to established design principles and architectural decisions.*