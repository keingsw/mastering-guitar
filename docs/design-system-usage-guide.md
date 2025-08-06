# Design System Usage Guide

This comprehensive guide shows you how to use the Guitar Mastery Design System effectively in your music education applications.

## 🎯 Overview

The Guitar Mastery Design System provides three main components optimized for guitar learning applications:
- **Button**: Interactive actions and navigation
- **ChordDisplay**: Displaying chord symbols with educational information
- **FretPosition**: Interactive fret positions with harmonic function colors

## 🚀 Getting Started

### Installation & Import

```tsx
// Import individual components
import { Button, ChordDisplay, FretPosition } from '@/design-system/components';

// Import design tokens
import { colors, typography, musicalSpacing } from '@/design-system/tokens';

// Or import everything
import * from '@/design-system';
```

### Basic Example

```tsx
import React from 'react';
import { Button, ChordDisplay, FretPosition } from '@/design-system';

function GuitarLessonCard() {
  const [selectedChord, setSelectedChord] = useState('C');
  
  return (
    <div style={{ padding: '24px', backgroundColor: '#fafafa', borderRadius: '12px' }}>
      <ChordDisplay 
        chord={selectedChord} 
        notes={['C', 'E', 'G']} 
        showNotes 
      />
      
      <div style={{ display: 'flex', gap: '12px', margin: '16px 0' }}>
        <FretPosition note="C" function="root" isHighlighted />
        <FretPosition note="E" function="third" isHighlighted />
        <FretPosition note="G" function="fifth" isHighlighted />
      </div>
      
      <Button 
        variant="primary" 
        onClick={() => console.log(`Playing ${selectedChord} chord`)}
      >
        Play {selectedChord} Chord
      </Button>
    </div>
  );
}
```

## 🧩 Component Usage Patterns

### Button Component

The Button component is your go-to for all interactive actions.

#### Basic Buttons
```tsx
// Primary action (most important)
<Button variant="primary" onClick={handleSubmit}>
  Start Practice
</Button>

// Secondary action
<Button variant="secondary" onClick={handleCancel}>
  Cancel
</Button>

// Subtle action
<Button variant="ghost" onClick={handleSettings}>
  Settings
</Button>
```

#### Sizes & States
```tsx
// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>  {/* Default */}
<Button size="lg">Large</Button>

// Loading state
<Button isLoading disabled>
  Saving Progress...
</Button>

// Disabled state
<Button disabled>
  Complete Previous Lesson
</Button>
```

#### With Icons
```tsx
<Button variant="primary">
  <span style={{ marginRight: '8px' }}>🎸</span>
  Play Chord
</Button>
```

### ChordDisplay Component

Perfect for showing chord information in educational contexts.

#### Basic Chord Display
```tsx
// Simple chord symbol
<ChordDisplay chord="C" />

// With notes
<ChordDisplay 
  chord="Cmaj7" 
  notes={['C', 'E', 'G', 'B']} 
  showNotes 
/>

// With intervals
<ChordDisplay 
  chord="Am7" 
  intervals={['R', 'm3', 'P5', 'm7']} 
  showIntervals 
/>
```

#### Interactive Chord Selection
```tsx
function ChordSelector({ onChordSelect }) {
  const chords = [
    { name: 'C', notes: ['C', 'E', 'G'] },
    { name: 'Am', notes: ['A', 'C', 'E'] },
    { name: 'F', notes: ['F', 'A', 'C'] },
    { name: 'G', notes: ['G', 'B', 'D'] },
  ];

  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      {chords.map(chord => (
        <ChordDisplay
          key={chord.name}
          chord={chord.name}
          notes={chord.notes}
          showNotes
          onClick={() => onChordSelect(chord)}
          variant="highlighted"
        />
      ))}
    </div>
  );
}
```

#### Chord Progression Display
```tsx
function ChordProgression() {
  const progression = ['C', 'Am', 'F', 'G'];
  
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      {progression.map((chord, index) => (
        <React.Fragment key={chord}>
          <ChordDisplay chord={chord} size="lg" />
          {index < progression.length - 1 && (
            <span style={{ color: '#666', fontSize: '18px' }}>→</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
```

### FretPosition Component

Essential for building interactive fretboard visualizations.

#### Basic Fret Positions
```tsx
// Simple note display
<FretPosition note="C" />

// With harmonic function
<FretPosition note="C" function="root" isHighlighted />
<FretPosition note="E" function="third" isHighlighted />
<FretPosition note="G" function="fifth" isHighlighted />

// With function symbols (accessibility)
<FretPosition 
  note="C" 
  function="root" 
  showFunction 
  isHighlighted 
/>
```

#### Interactive Fretboard
```tsx
function FretboardVisualization({ chord }) {
  const [selectedNotes, setSelectedNotes] = useState(new Set());
  
  const handleNoteClick = (note) => {
    const newSelected = new Set(selectedNotes);
    if (newSelected.has(note)) {
      newSelected.delete(note);
    } else {
      newSelected.add(note);
    }
    setSelectedNotes(newSelected);
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(6, 1fr)', 
      gap: '8px',
      padding: '20px',
      backgroundColor: '#f8f8f8',
      borderRadius: '12px'
    }}>
      {chord.positions.map(position => (
        <FretPosition
          key={`${position.string}-${position.fret}`}
          note={position.note}
          function={position.function}
          isHighlighted={selectedNotes.has(position.note)}
          onClick={() => handleNoteClick(position.note)}
          showFunction
        />
      ))}
    </div>
  );
}
```

#### Scale Practice Tool
```tsx
function ScalePractice({ scale }) {
  const [currentNote, setCurrentNote] = useState(0);
  
  return (
    <div>
      <h3>C Major Scale Practice</h3>
      <div style={{ display: 'flex', gap: '8px', margin: '16px 0' }}>
        {scale.notes.map((note, index) => (
          <FretPosition
            key={note}
            note={note}
            isHighlighted={index === currentNote}
            onClick={() => setCurrentNote(index)}
            size="lg"
          />
        ))}
      </div>
      <Button 
        onClick={() => setCurrentNote((prev) => (prev + 1) % scale.notes.length)}
      >
        Next Note
      </Button>
    </div>
  );
}
```

## 🎨 Design Tokens Usage

### Using Colors
```tsx
import { colors } from '@/design-system/tokens';

// Music theory colors
const rootColor = colors.theory.root.DEFAULT;     // #ef4444
const thirdColor = colors.theory.third.DEFAULT;   // #f59e0b
const fifthColor = colors.theory.fifth.DEFAULT;   // #3b82f6

// Component with custom styling
<div style={{
  backgroundColor: colors.primary.light,
  color: colors.text.primary,
  border: `2px solid ${colors.primary.DEFAULT}`
}}>
  Custom styled element
</div>
```

### Typography System
```tsx
import { typography } from '@/design-system/tokens';

// Using font families
<h1 style={{ 
  fontFamily: typography.fontFamily.sans,
  fontSize: typography.fontSize['2xl'],
  fontWeight: typography.fontWeight.bold,
  lineHeight: typography.lineHeight.tight
}}>
  Lesson Title
</h1>

// Chord symbols with monospace
<span style={{
  fontFamily: typography.fontFamily.mono,
  fontSize: typography.fontSize.lg,
  fontWeight: typography.fontWeight.semibold
}}>
  Cmaj7
</span>
```

### Musical Spacing
```tsx
import { musicalSpacing } from '@/design-system/tokens';

// Guitar-optimized spacing
<div style={{
  display: 'grid',
  gridTemplateColumns: `repeat(6, ${musicalSpacing.note.size})`,
  gap: musicalSpacing.fret.spacing,
  padding: musicalSpacing.chord.minWidth
}}>
  {/* Fretboard grid */}
</div>
```

## ♿ Accessibility Best Practices

### Keyboard Navigation
```tsx
// Ensure all interactive elements are keyboard accessible
<div onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleAction();
  }
}}>
  // Interactive content
</div>
```

### Screen Reader Support
```tsx
// Provide descriptive labels
<FretPosition 
  note="C"
  function="root"
  aria-label="C root note position"
  isHighlighted
/>

// Use semantic HTML
<section aria-label="Chord practice area">
  <h2>Practice C Major Chord</h2>
  {/* Chord content */}
</section>
```

### Colorblind-Friendly Design
```tsx
// Always use both color and shape/symbol
<FretPosition 
  note="C" 
  function="root" 
  showFunction  // Shows ● symbol
  isHighlighted // Shows red color
/>
```

## 📱 Responsive Design

### Mobile-First Approach
```tsx
// Adjust component sizes for mobile
function ResponsiveChordDisplay({ chord, isMobile }) {
  return (
    <ChordDisplay 
      chord={chord}
      size={isMobile ? 'sm' : 'lg'}
      showNotes={!isMobile} // Hide notes on small screens
    />
  );
}
```

### Touch-Friendly Interactions
```tsx
// Use appropriate sizes for touch
<FretPosition 
  note="C"
  size="md"  // 88px - exceeds 44px touch target minimum
  onClick={handleTouch}
  onHover={handleHoverEffect}  // Works on both hover and touch
/>
```

## 🧪 Testing Your Components

### Accessibility Testing
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('chord display is keyboard accessible', async () => {
  render(
    <ChordDisplay chord="C" onClick={jest.fn()} />
  );
  
  const button = screen.getByRole('button');
  button.focus();
  
  await userEvent.keyboard('{Enter}');
  expect(handleClick).toHaveBeenCalled();
});
```

### Component Integration Testing
```tsx
test('fretboard interaction updates chord display', async () => {
  render(<GuitarLessonInterface />);
  
  // Click on C root position
  await userEvent.click(screen.getByLabelText(/C root note/));
  
  // Check that chord display updates
  expect(screen.getByText('C')).toBeInTheDocument();
});
```

## 🎯 Common Patterns

### Modal with Design System
```tsx
function ChordInfoModal({ isOpen, chord, onClose }) {
  if (!isOpen) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: componentTokens.borderRadius.lg,
        padding: '24px',
        maxWidth: '400px',
        width: '90%'
      }}>
        <h2>Chord Information</h2>
        <ChordDisplay 
          chord={chord.name} 
          notes={chord.notes} 
          intervals={chord.intervals}
          showNotes 
          showIntervals 
          size="lg"
        />
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### Loading States
```tsx
function ChordProgressionLoader({ isLoading, progression }) {
  if (isLoading) {
    return (
      <div style={{ display: 'flex', gap: '16px' }}>
        {[1, 2, 3, 4].map(i => (
          <div 
            key={i}
            style={{
              width: '120px',
              height: '80px',
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}
          />
        ))}
      </div>
    );
  }
  
  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      {progression.map(chord => (
        <ChordDisplay key={chord} chord={chord} />
      ))}
    </div>
  );
}
```

### Error States
```tsx
function ChordError({ error, onRetry }) {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#fef2f2',
      borderRadius: '8px',
      border: '1px solid #fecaca'
    }}>
      <h3 style={{ color: '#dc2626', margin: '0 0 8px 0' }}>
        Error Loading Chord
      </h3>
      <p style={{ color: '#7f1d1d', margin: '0 0 16px 0' }}>
        {error.message}
      </p>
      <Button 
        variant="secondary" 
        onClick={onRetry}
        size="sm"
      >
        Try Again
      </Button>
    </div>
  );
}
```

## 🔧 Customization

### Extending Components
```tsx
// Create a specialized chord button
function ChordButton({ chord, isActive, ...props }) {
  return (
    <Button
      variant={isActive ? 'primary' : 'secondary'}
      style={{
        minWidth: '80px',
        fontFamily: typography.fontFamily.mono,
        ...props.style
      }}
      {...props}
    >
      {chord}
    </Button>
  );
}
```

### Custom Themes
```tsx
// Create a dark theme variant
const darkTheme = {
  ...colors,
  background: {
    primary: '#1a1a1a',
    secondary: '#2d2d2d',
    tertiary: '#404040'
  },
  text: {
    primary: '#ffffff',
    secondary: '#a0a0a0'
  }
};
```

## 📈 Performance Tips

### Bundle Size Optimization
```tsx
// Import only what you need
import { Button } from '@/design-system/components/Button/Button';
// Instead of: import { Button } from '@/design-system';
```

### Memoization
```tsx
// Memoize expensive chord calculations
const MemoizedFretPosition = React.memo(FretPosition);

// Memoize complex fretboard renders
const fretboardPositions = useMemo(() => 
  calculateChordPositions(selectedChord),
  [selectedChord]
);
```

## 🚀 Advanced Usage

### Custom Hook for Chord Logic
```tsx
function useChordProgression(initialChords = []) {
  const [chords, setChords] = useState(initialChords);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const addChord = (chord) => {
    setChords([...chords, chord]);
  };
  
  const nextChord = () => {
    setCurrentIndex((prev) => (prev + 1) % chords.length);
  };
  
  const currentChord = chords[currentIndex];
  
  return {
    chords,
    currentChord,
    currentIndex,
    addChord,
    nextChord
  };
}
```

### Integration with State Management
```tsx
// Redux/Zustand store
const useGuitarStore = create((set) => ({
  selectedChord: 'C',
  highlightedNotes: new Set(),
  setChord: (chord) => set({ selectedChord: chord }),
  toggleNote: (note) => set((state) => {
    const newHighlighted = new Set(state.highlightedNotes);
    if (newHighlighted.has(note)) {
      newHighlighted.delete(note);
    } else {
      newHighlighted.add(note);
    }
    return { highlightedNotes: newHighlighted };
  })
}));
```

## 📞 Support & Resources

### Documentation Links
- **Storybook**: `npm run storybook` - Interactive component documentation
- **Source Code**: `/src/design-system/` - Component implementations
- **Tests**: Component `.test.tsx` files - Usage examples and edge cases

### Community
- **Issues**: Report bugs and feature requests
- **Discussions**: Share patterns and best practices
- **Contributing**: Guidelines for adding new components

---

*Happy coding! 🎸 Build amazing music education experiences with accessibility and usability at the forefront.*