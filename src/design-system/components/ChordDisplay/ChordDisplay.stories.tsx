import type { Meta, StoryObj } from '@storybook/react';
import { ChordDisplay } from './ChordDisplay';

const meta: Meta<typeof ChordDisplay> = {
  title: 'Design System/ChordDisplay',
  component: ChordDisplay,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A chord display component for showing chord symbols, notes, and intervals. Designed specifically for music education applications with clear typography and optional interactive features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    chord: {
      control: { type: 'text' },
      description: 'The chord symbol to display (e.g., "Cmaj7", "Am", "F#dim")',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'highlighted', 'muted'],
      description: 'Visual variant of the chord display',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the chord display',
    },
    showNotes: {
      control: { type: 'boolean' },
      description: 'Whether to show the chord notes below the symbol',
    },
    showIntervals: {
      control: { type: 'boolean' },
      description: 'Whether to show the chord intervals below the symbol',
    },
    notes: {
      control: { type: 'object' },
      description: 'Array of note names in the chord',
    },
    intervals: {
      control: { type: 'object' },
      description: 'Array of interval symbols (R, M3, P5, etc.)',
    },
  },
  args: {
    onClick: () => {},
    chord: 'Cmaj7',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Stories
export const Default: Story = {
  args: {
    chord: 'C',
  },
};

export const WithNotes: Story = {
  args: {
    chord: 'Cmaj7',
    notes: ['C', 'E', 'G', 'B'],
    showNotes: true,
  },
};

export const WithIntervals: Story = {
  args: {
    chord: 'Cmaj7',
    intervals: ['R', 'M3', 'P5', 'M7'],
    showIntervals: true,
  },
};

export const WithNotesAndIntervals: Story = {
  args: {
    chord: 'Cmaj7',
    notes: ['C', 'E', 'G', 'B'],
    intervals: ['R', 'M3', 'P5', 'M7'],
    showNotes: true,
    showIntervals: true,
  },
};

// Variants
export const Highlighted: Story = {
  args: {
    chord: 'Am',
    variant: 'highlighted',
    notes: ['A', 'C', 'E'],
    showNotes: true,
  },
};

export const Muted: Story = {
  args: {
    chord: 'Gdim',
    variant: 'muted',
    notes: ['G', 'B♭', 'D♭'],
    showNotes: true,
  },
};

// Sizes
export const Small: Story = {
  args: {
    chord: 'F#',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    chord: 'B♭maj7',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    chord: 'C#m7',
    size: 'lg',
  },
};

// Interactive
export const Interactive: Story = {
  args: {
    chord: 'Em',
    notes: ['E', 'G', 'B'],
    showNotes: true,
    onClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive chord that can be clicked. Hover to see the effect.',
      },
    },
  },
};

// Complex Chords Showcase
export const ComplexChords: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <ChordDisplay chord="Cmaj7" notes={['C', 'E', 'G', 'B']} showNotes />
      <ChordDisplay chord="Am7" notes={['A', 'C', 'E', 'G']} showNotes />
      <ChordDisplay chord="F#dim7" notes={['F#', 'A', 'C', 'E♭']} showNotes />
      <ChordDisplay chord="B♭sus4" notes={['B♭', 'E♭', 'F']} showNotes />
      <ChordDisplay chord="G13" notes={['G', 'B', 'D', 'F', 'A', 'C', 'E']} showNotes />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Various complex chord symbols including major 7ths, diminished, suspended, and extended chords.',
      },
    },
  },
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <ChordDisplay chord="C" variant="default" />
      <ChordDisplay chord="Am" variant="highlighted" />
      <ChordDisplay chord="F" variant="muted" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All three chord display variants for comparison.',
      },
    },
  },
};

// All Sizes Showcase
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <ChordDisplay chord="C" size="sm" />
      <ChordDisplay chord="Am" size="md" />
      <ChordDisplay chord="F" size="lg" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All three chord display sizes for size comparison.',
      },
    },
  },
};

// Guitar-Specific Chords
export const GuitarTriads: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', maxWidth: '600px' }}>
      <ChordDisplay chord="C" notes={['C', 'E', 'G']} showNotes intervals={['R', 'M3', 'P5']} showIntervals />
      <ChordDisplay chord="Am" notes={['A', 'C', 'E']} showNotes intervals={['R', 'm3', 'P5']} showIntervals />
      <ChordDisplay chord="F" notes={['F', 'A', 'C']} showNotes intervals={['R', 'M3', 'P5']} showIntervals />
      <ChordDisplay chord="G" notes={['G', 'B', 'D']} showNotes intervals={['R', 'M3', 'P5']} showIntervals />
      <ChordDisplay chord="Em" notes={['E', 'G', 'B']} showNotes intervals={['R', 'm3', 'P5']} showIntervals />
      <ChordDisplay chord="Dm" notes={['D', 'F', 'A']} showNotes intervals={['R', 'm3', 'P5']} showIntervals />
      <ChordDisplay chord="B°" notes={['B', 'D', 'F']} showNotes intervals={['R', 'm3', '♭5']} showIntervals />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common guitar triads in the key of C major, showing both notes and intervals.',
      },
    },
  },
};

// Accessibility Demo
export const AccessibilityDemo: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        <ChordDisplay chord="Cmaj7" notes={['C', 'E', 'G', 'B']} showNotes onClick={() => {}} />
        <ChordDisplay chord="Am7" notes={['A', 'C', 'E', 'G']} showNotes onClick={() => {}} />
      </div>
      <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
        Chord displays have proper ARIA labels that announce both the chord name and notes.
        Interactive chords can be navigated with keyboard (Tab, Enter, Space).
        Screen readers will announce: "Chord: Cmaj7, Notes: C, E, G, B".
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates accessibility features including ARIA labels and keyboard navigation.',
      },
    },
  },
};