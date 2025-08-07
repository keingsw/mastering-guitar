import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { TriadSelector } from './TriadSelector';
import type { TriadSelection } from './TriadSelector';
import type { FretPosition } from '../Fretboard/Fretboard';
import type { NoteName } from '../../types/music';

const meta: Meta<typeof TriadSelector> = {
  title: 'Design System/TriadSelector',
  component: TriadSelector,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## Interactive Triad Selection Interface

A comprehensive React component for selecting and visualizing musical triads on guitar. Perfect for music education applications, chord learning tools, and interactive theory lessons.

### Features

- **Root Note Picker**: All 12 chromatic notes in an intuitive circular layout
- **Triad Quality Selector**: Major, minor, diminished, and augmented triad types
- **Position Chooser**: Different neck positions from open to 12th fret
- **Visual Chord Chart**: Integrated Fretboard component showing triad positions
- **Real-time Updates**: Live chord name and note display
- **Full Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **Screen Reader Support**: Comprehensive ARIA labels and descriptions
- **Responsive Design**: Works across all device sizes

### Music Theory Integration

- **Harmonic Functions**: Color-coded display of root (red), third (orange), and fifth (blue)
- **Interval Calculation**: Automatic calculation of triad intervals and chord tones
- **Position Mapping**: Intelligent fret position calculation for different neck areas
- **Chord Symbol Generation**: Dynamic chord symbol creation (C, Am, Bdim, F#aug, etc.)

### Accessibility Features

- **Keyboard Navigation**: Arrow keys navigate within each section
- **Screen Reader**: Descriptive labels for all interactive elements
- **Focus Management**: Clear focus indicators and logical tab order
- **Live Regions**: Real-time updates announced to assistive technology
- **Touch Friendly**: 48px minimum touch targets for mobile users
- **High Contrast**: Support for high contrast mode users
- **Reduced Motion**: Respects user motion preferences

### Educational Use Cases

- **Chord Learning**: Visual and auditory chord identification
- **Theory Practice**: Understanding triad construction and intervals
- **Position Work**: Learning chords in different neck positions
- **Ear Training**: Connect visual patterns with harmonic sounds
- **Composition**: Quick chord exploration and progression building

### Performance Optimizations

- Memoized fret position calculations for smooth interactions
- Efficient re-rendering with React performance hooks
- Responsive SVG graphics with minimal DOM updates
- Touch-optimized interactions for mobile devices
        `,
      },
    },
  },
  argTypes: {
    initialSelection: {
      control: 'object',
      description: 'Initial triad selection state',
      table: {
        type: { summary: 'Partial<TriadSelection>' },
      },
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Component size variant for different layouts',
    },
    showAdvancedPositions: {
      control: 'boolean',
      description: 'Show all neck positions including 7th, 9th, and 12th',
    },
    onChange: {
      action: 'selection-changed',
      description: 'Callback when triad selection changes',
      table: {
        type: { summary: '(selection: TriadSelection) => void' },
      },
    },
    onFretClick: {
      action: 'fret-clicked',
      description: 'Callback when a fret is clicked on the integrated fretboard',
      table: {
        type: { summary: '(position: FretPosition) => void' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names',
    },
    'aria-label': {
      control: 'text',
      description: 'Custom ARIA label for accessibility',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default triad selector
export const Default: Story = {
  args: {
    onChange: action('selection-changed'),
    onFretClick: action('fret-clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Default triad selector starting with C major in open position. Try selecting different root notes, qualities, and positions to see the chord chart update in real-time.',
      },
    },
  },
};

// Pre-selected G major chord
export const GMajor: Story = {
  args: {
    initialSelection: {
      rootNote: 'G',
      quality: 'major',
      neckPosition: 'open',
    },
    onChange: action('selection-changed'),
    onFretClick: action('fret-clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'G Major chord in open position showing the classic open G chord fingering with multiple root positions.',
      },
    },
  },
};

// A minor chord
export const AMinor: Story = {
  args: {
    initialSelection: {
      rootNote: 'A',
      quality: 'minor',
      neckPosition: 'open',
    },
    onChange: action('selection-changed'),
    onFretClick: action('fret-clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'A minor chord demonstrating minor triad intervals (root, minor third, perfect fifth) with the characteristic melancholy sound.',
      },
    },
  },
};

// F# diminished chord
export const FSharpDiminished: Story = {
  args: {
    initialSelection: {
      rootNote: 'F#',
      quality: 'diminished',
      neckPosition: 'position-3',
    },
    onChange: action('selection-changed'),
    onFretClick: action('fret-clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'F# diminished chord in 3rd position showing the unique interval structure of diminished triads (minor thirds stacked).',
      },
    },
  },
};

// C augmented chord
export const CAugmented: Story = {
  args: {
    initialSelection: {
      rootNote: 'C',
      quality: 'augmented',
      neckPosition: 'position-5',
    },
    onChange: action('selection-changed'),
    onFretClick: action('fret-clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'C augmented chord in 5th position demonstrating the symmetrical nature of augmented triads with their distinctive raised fifth.',
      },
    },
  },
};

// Advanced positions enabled
export const AdvancedPositions: Story = {
  args: {
    showAdvancedPositions: true,
    initialSelection: {
      rootNote: 'D',
      quality: 'major',
      neckPosition: 'position-12',
    },
    onChange: action('selection-changed'),
    onFretClick: action('fret-clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'D major chord in 12th position with advanced positions enabled, showing extended neck positions for lead guitar work.',
      },
    },
  },
};

// Small size variant
export const SmallSize: Story = {
  args: {
    size: 'sm',
    initialSelection: {
      rootNote: 'E',
      quality: 'minor',
      neckPosition: 'open',
    },
    onChange: action('selection-changed'),
    onFretClick: action('fret-clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Small size variant (75% scale) suitable for sidebar widgets, mobile layouts, or compact interfaces.',
      },
    },
  },
};

// Large size variant
export const LargeSize: Story = {
  args: {
    size: 'lg',
    initialSelection: {
      rootNote: 'B',
      quality: 'major',
      neckPosition: 'position-7',
    },
    onChange: action('selection-changed'),
    onFretClick: action('fret-clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Large size variant (125% scale) ideal for detailed instruction, desktop applications, or presentation mode.',
      },
    },
  },
};

// Interactive playground
export const Interactive: Story = {
  args: {
    showAdvancedPositions: true,
    size: 'md',
    onChange: action('selection-changed'),
    onFretClick: action('fret-clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground with all controls available. Experiment with different combinations to explore guitar chord theory.',
      },
    },
  },
};

// Accessibility demonstration
export const AccessibilityDemo: Story = {
  args: {
    'aria-label': 'Chord theory learning interface with full keyboard navigation',
    initialSelection: {
      rootNote: 'F',
      quality: 'major',
      neckPosition: 'open',
    },
    onChange: action('selection-changed'),
    onFretClick: action('fret-clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: `
Accessibility demonstration with enhanced ARIA labeling and keyboard navigation support.

**Keyboard Navigation Instructions:**
- **Tab**: Navigate between sections (Root Note, Quality, Position)
- **Arrow Keys**: Navigate within each section (Up/Down to cycle through options)
- **Enter/Space**: Select options
- **Tab**: Continue to fretboard for detailed chord exploration

**Screen Reader Features:**
- Descriptive labels for each musical element
- Live updates when selections change
- Comprehensive chord theory information
- Position and interval descriptions

**Try these keyboard sequences:**
1. Tab to Root Note section, then use Arrow Up/Down to explore notes
2. Tab to Quality section, use arrows to hear different triad types described
3. Tab to Position section to explore different neck areas
4. Tab to fretboard and explore individual fret positions
        `,
      },
    },
  },
};

// Educational sequence - major triad series
export const EducationalMajorTriads: Story = {
  args: {
    initialSelection: {
      rootNote: 'C',
      quality: 'major',
      neckPosition: 'open',
    },
    onChange: action('selection-changed'),
    onFretClick: action('fret-clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: `
Educational example focusing on major triads. Perfect for teaching major triad construction and recognition.

**Teaching Points:**
- Major triads use intervals: Root (0), Major Third (+4 semitones), Perfect Fifth (+7 semitones)
- All major triads have the same interval pattern regardless of root note
- Color coding helps identify harmonic functions: Root (red), Third (orange), Fifth (blue)
- Position changes show the same chord in different neck areas

**Suggested Exercise:**
1. Start with C major (C-E-G)
2. Try G major (G-B-D) - notice the pattern
3. Experiment with F major (F-A-C)
4. Compare open position vs 5th position fingerings
        `,
      },
    },
  },
};

// Educational sequence - minor vs major comparison
export const EducationalMinorMajorComparison: Story = {
  args: {
    initialSelection: {
      rootNote: 'A',
      quality: 'minor',
      neckPosition: 'open',
    },
    onChange: action('selection-changed'),
    onFretClick: action('fret-clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: `
Educational example for comparing minor and major triads with the same root note.

**Teaching Exercise:**
1. Current selection: A minor (A-C-E)
2. Switch quality to "Major" to hear A major (A-C#-E)
3. Notice only the third changes (C becomes C#)
4. The difference is just one semitone!

**Key Learning Points:**
- Minor third = 3 semitones from root
- Major third = 4 semitones from root
- The third determines major/minor quality
- Root and fifth remain the same in both qualities

**Try This Pattern:**
- A minor → A major → A diminished → A augmented
- Notice how each quality changes the harmonic color
        `,
      },
    },
  },
};

// Position comparison story
export const PositionComparison: Story = {
  args: {
    showAdvancedPositions: true,
    initialSelection: {
      rootNote: 'E',
      quality: 'major',
      neckPosition: 'open',
    },
    onChange: action('selection-changed'),
    onFretClick: action('fret-clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: `
Demonstration of the same chord in different neck positions. Perfect for understanding moveable chord shapes.

**Current: E Major in Open Position**

**Position Exercise:**
1. Start with open position E major
2. Try "5th Position" - same chord, different fingering
3. Try "12th Position" - octave higher, same intervals
4. Notice how the visual pattern changes but harmonic function remains

**Advanced Concept:**
Each position offers different voicing options and tonal colors while maintaining the same basic triad structure.
        `,
      },
    },
  },
};

// Custom handler example
export const CustomHandlers: Story = {
  args: {
    initialSelection: {
      rootNote: 'C',
      quality: 'major',
      neckPosition: 'open',
    },
    onChange: (selection: TriadSelection) => {
      action('selection-changed')(selection);
      console.log('Chord selected:', {
        chord: `${selection.rootNote}${selection.quality === 'major' ? '' : selection.quality}`,
        position: selection.neckPosition,
        notes: selection.rootNote, // In real app, calculate full triad
      });
    },
    onFretClick: (position: FretPosition) => {
      action('fret-clicked')(position);
      console.log('Fret clicked:', {
        location: `Fret ${position.fret}, String ${position.string}`,
        note: position.note,
        function: position.function,
      });
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with custom event handlers for integration into larger applications. Check browser console for detailed event information.',
      },
    },
  },
};