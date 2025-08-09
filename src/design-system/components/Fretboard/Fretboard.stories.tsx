import type { Meta, StoryObj } from '@storybook/react';
import { Fretboard } from './Fretboard';
import type { FretPosition } from './Fretboard';
import type { NoteName } from '../../types/music';

// Common chord positions for stories
const CMajorTriad: FretPosition[] = [
  { fret: 3, string: 6, note: 'C', function: 'root' },      // Low E string, 3rd fret
  { fret: 2, string: 5, note: 'E', function: 'third' },     // A string, 2nd fret
  { fret: 0, string: 4, note: 'G', function: 'fifth' },     // D string, open
  { fret: 1, string: 3, note: 'C', function: 'root' },      // G string, 1st fret
  { fret: 0, string: 2, note: 'E', function: 'third' },     // B string, open
  { fret: 0, string: 1, note: 'E', function: 'third' },     // High E string, open
];

const GChordPositions: FretPosition[] = [
  { fret: 3, string: 6, note: 'G', function: 'root' },      // Low E string, 3rd fret
  { fret: 2, string: 5, note: 'B', function: 'third' },     // A string, 2nd fret
  { fret: 0, string: 4, note: 'D', function: 'fifth' },     // D string, open
  { fret: 0, string: 3, note: 'G', function: 'root' },      // G string, open
  { fret: 3, string: 2, note: 'D', function: 'fifth' },     // B string, 3rd fret
  { fret: 3, string: 1, note: 'G', function: 'root' },      // High E string, 3rd fret
];

const EmChordPositions: FretPosition[] = [
  { fret: 0, string: 6, note: 'E', function: 'root' },      // Low E string, open
  { fret: 2, string: 5, note: 'B', function: 'fifth' },     // A string, 2nd fret
  { fret: 2, string: 4, note: 'E', function: 'root' },      // D string, 2nd fret
  { fret: 0, string: 3, note: 'G', function: 'third' },     // G string, open
  { fret: 0, string: 2, note: 'B', function: 'fifth' },     // B string, open
  { fret: 0, string: 1, note: 'E', function: 'root' },      // High E string, open
];

const PentatonicScale: FretPosition[] = [
  // C major pentatonic scale positions
  { fret: 8, string: 6, note: 'C', function: 'root' },
  { fret: 10, string: 6, note: 'D', function: 'root' },
  { fret: 12, string: 6, note: 'E', function: 'third' },
  { fret: 8, string: 5, note: 'F', function: 'root' },
  { fret: 10, string: 5, note: 'G', function: 'fifth' },
  { fret: 12, string: 5, note: 'A', function: 'root' },
  { fret: 9, string: 4, note: 'C', function: 'root' },
  { fret: 12, string: 4, note: 'D', function: 'root' },
  { fret: 9, string: 3, note: 'E', function: 'third' },
  { fret: 12, string: 3, note: 'G', function: 'fifth' },
  { fret: 10, string: 2, note: 'A', function: 'root' },
  { fret: 12, string: 2, note: 'C', function: 'root' },
  { fret: 8, string: 1, note: 'C', function: 'root' },
  { fret: 10, string: 1, note: 'D', function: 'root' },
  { fret: 12, string: 1, note: 'E', function: 'third' },
];

const meta: Meta<typeof Fretboard> = {
  title: 'Design System/Fretboard',
  component: Fretboard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## Interactive Guitar Fretboard

A comprehensive SVG-based guitar fretboard component with advanced interactive features for music education applications.

### Features

- **Interactive Frets**: Clickable fret positions with hover states and keyboard navigation
- **Harmonic Function Visualization**: Color-coded display of chord tones (root, third, fifth)
- **Multiple Neck Positions**: Support for different fretboard regions (open position, 5th position, etc.)
- **Responsive Design**: Scales appropriately across device sizes with size variants
- **Chord Visualization**: Display chord names and highlight chord positions
- **Accessibility**: WCAG 2.1 AA compliant with screen reader support and keyboard navigation
- **Note Labeling**: Toggle note names on/off for educational purposes

### Accessibility Features

- Full keyboard navigation support (Tab/Enter/Space)
- Screen reader descriptions for all interactive elements
- High contrast mode support
- Reduced motion preferences respected
- ARIA labels and descriptions
- Focus management and visual indicators

### Music Theory Integration

Uses the design system's music theory color palette:
- **Root notes**: Red (#ef4444) - Primary harmonic function
- **Third notes**: Orange/Amber (#f59e0b) - Determines major/minor quality
- **Fifth notes**: Blue (#3b82f6) - Provides harmonic stability

### Performance Optimizations

- Memoized fret position calculations
- Efficient SVG rendering with minimal DOM updates
- Responsive viewport scaling
- Touch-friendly interactions on mobile devices
        `,
      },
    },
  },
  argTypes: {
    fretCount: {
      control: { type: 'range', min: 3, max: 24, step: 1 },
      description: 'Number of frets to display on the fretboard',
    },
    stringCount: {
      control: { type: 'range', min: 4, max: 12, step: 1 },
      description: 'Number of strings (typically 6 for guitar, 4 for bass)',
    },
    neckPosition: {
      control: { type: 'range', min: 0, max: 12, step: 1 },
      description: 'Starting fret position (0 = open position, 5 = 5th position)',
    },
    chord: {
      control: 'text',
      description: 'Chord symbol to display above the fretboard',
    },
    showNoteLabels: {
      control: 'boolean',
      description: 'Show note names on highlighted fret positions',
    },
    showFretNumbers: {
      control: 'boolean',
      description: 'Show fret numbers above the fretboard',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Component size variant for responsive design',
    },
    onFretClick: {
      action: 'fret-clicked',
      description: 'Callback function when a fret is clicked',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default fretboard with no highlighted positions
export const Default: Story = {
  args: {
    onFretClick: (fret: number, string: number) => console.log('fret-clicked', fret, string),
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic fretboard with no highlighted positions. Click any fret position to see the interaction.',
      },
    },
  },
};

// C Major chord visualization
export const CMajorChord: Story = {
  args: {
    triadPositions: CMajorTriad,
    chord: 'C',
    showNoteLabels: true,
    onFretClick: (fret: number, string: number) => console.log('fret-clicked', fret, string),
  },
  parameters: {
    docs: {
      description: {
        story: 'C Major chord in open position with root (red), third (orange), and fifth (blue) highlighted. This demonstrates the basic open C chord fingering.',
      },
    },
  },
};

// G Major chord
export const GMajorChord: Story = {
  args: {
    triadPositions: GChordPositions,
    chord: 'G',
    showNoteLabels: true,
    onFretClick: (fret: number, string: number) => console.log('fret-clicked', fret, string),
  },
  parameters: {
    docs: {
      description: {
        story: 'G Major chord showing how different harmonic functions are distributed across the fretboard.',
      },
    },
  },
};

// E minor chord
export const EMinorChord: Story = {
  args: {
    triadPositions: EmChordPositions,
    chord: 'Em',
    showNoteLabels: true,
    onFretClick: (fret: number, string: number) => console.log('fret-clicked', fret, string),
  },
  parameters: {
    docs: {
      description: {
        story: 'E minor chord demonstrating the simplest open chord with multiple root notes highlighted.',
      },
    },
  },
};

// Different neck positions
export const FifthPosition: Story = {
  args: {
    neckPosition: 5,
    fretCount: 12,
    triadPositions: [
      { fret: 5, string: 6, note: 'A', function: 'root' },
      { fret: 7, string: 5, note: 'E', function: 'fifth' },
      { fret: 7, string: 4, note: 'A', function: 'root' },
      { fret: 6, string: 3, note: 'C#', function: 'third' },
      { fret: 5, string: 2, note: 'E', function: 'fifth' },
      { fret: 5, string: 1, note: 'A', function: 'root' },
    ],
    chord: 'A',
    showNoteLabels: true,
    onFretClick: (fret: number, string: number) => console.log('fret-clicked', fret, string),
  },
  parameters: {
    docs: {
      description: {
        story: 'A Major chord in 5th position (5th-17th frets). Notice how the fret numbers adjust to show the correct position.',
      },
    },
  },
};

// Scale pattern visualization
export const PentatonicPattern: Story = {
  args: {
    triadPositions: PentatonicScale,
    chord: 'C Pentatonic',
    showNoteLabels: true,
    fretCount: 15,
    neckPosition: 5,
    onFretClick: (fret: number, string: number) => console.log('fret-clicked', fret, string),
  },
  parameters: {
    docs: {
      description: {
        story: 'C Major pentatonic scale pattern showing how the component can display scale patterns, not just chords.',
      },
    },
  },
};

// Size variants
export const SmallSize: Story = {
  args: {
    size: 'sm',
    triadPositions: CMajorTriad,
    chord: 'C',
    showNoteLabels: true,
    onFretClick: (fret: number, string: number) => console.log('fret-clicked', fret, string),
  },
  parameters: {
    docs: {
      description: {
        story: 'Small size variant (75% scale) suitable for sidebar widgets or mobile layouts.',
      },
    },
  },
};

export const LargeSize: Story = {
  args: {
    size: 'lg',
    triadPositions: CMajorTriad,
    chord: 'C',
    showNoteLabels: true,
    onFretClick: (fret: number, string: number) => console.log('fret-clicked', fret, string),
  },
  parameters: {
    docs: {
      description: {
        story: 'Large size variant (125% scale) suitable for detailed instruction or desktop displays.',
      },
    },
  },
};

// Extended fretboard for lead guitar
export const ExtendedFretboard: Story = {
  args: {
    fretCount: 24,
    triadPositions: [
      // High position chord voicing
      { fret: 12, string: 6, note: 'E', function: 'root' },
      { fret: 14, string: 5, note: 'B', function: 'fifth' },
      { fret: 14, string: 4, note: 'E', function: 'root' },
      { fret: 13, string: 3, note: 'G#', function: 'third' },
      { fret: 12, string: 2, note: 'B', function: 'fifth' },
      { fret: 12, string: 1, note: 'E', function: 'root' },
    ],
    chord: 'E (12th Position)',
    showNoteLabels: true,
    neckPosition: 10,
    onFretClick: (fret: number, string: number) => console.log('fret-clicked', fret, string),
  },
  parameters: {
    docs: {
      description: {
        story: 'Extended 24-fret fretboard showing high-position chord voicings, useful for lead guitar and advanced techniques.',
      },
    },
  },
};

// Without note labels for cleaner appearance
export const WithoutLabels: Story = {
  args: {
    triadPositions: GMajorChord,
    chord: 'G',
    showNoteLabels: false,
    onFretClick: (fret: number, string: number) => console.log('fret-clicked', fret, string),
  },
  parameters: {
    docs: {
      description: {
        story: 'Fretboard without note labels for a cleaner appearance. Useful when you want to test knowledge or reduce visual clutter.',
      },
    },
  },
};

// Interactive playground
export const Interactive: Story = {
  args: {
    triadPositions: CMajorTriad,
    chord: 'C',
    showNoteLabels: true,
    showFretNumbers: true,
    size: 'md',
    fretCount: 12,
    neckPosition: 0,
    onFretClick: (fret: number, string: number) => console.log('fret-clicked', fret, string),
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground with all controls available. Use the controls panel to experiment with different settings.',
      },
    },
  },
};

// Accessibility demonstration
export const AccessibilityDemo: Story = {
  args: {
    triadPositions: CMajorTriad,
    chord: 'C Major',
    showNoteLabels: true,
    onFretClick: (fret: number, string: number) => console.log('fret-clicked', fret, string),
    'aria-label': 'C Major chord demonstration fretboard',
  },
  parameters: {
    docs: {
      description: {
        story: `
Accessibility demonstration story. This fretboard includes:
- Custom ARIA label
- Full keyboard navigation (try Tab/Enter)
- Screen reader descriptions
- High contrast support
- Focus management

**Keyboard Navigation:**
- Tab: Navigate between fret positions
- Enter/Space: Select fret position
- Focus indicators are visible for keyboard users
        `,
      },
    },
  },
};

// Custom tuning example (Drop D)
export const DropDTuning: Story = {
  args: {
    tuning: ['D', 'A', 'D', 'G', 'B', 'E'] as NoteName[],
    triadPositions: [
      { fret: 0, string: 6, note: 'D', function: 'root' },
      { fret: 2, string: 5, note: 'B', function: 'fifth' },
      { fret: 2, string: 4, note: 'E', function: 'root' },
      { fret: 2, string: 3, note: 'A', function: 'root' },
      { fret: 3, string: 2, note: 'D', function: 'root' },
      { fret: 2, string: 1, note: 'F#', function: 'third' },
    ],
    chord: 'D (Drop D)',
    showNoteLabels: true,
    onFretClick: (fret: number, string: number) => console.log('fret-clicked', fret, string),
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with Drop D tuning (DADGBE) showing how the component adapts to different guitar tunings.',
      },
    },
  },
};