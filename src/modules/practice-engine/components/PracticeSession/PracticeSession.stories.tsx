import type { Meta, StoryObj } from "@storybook/react";
import type { PracticeSettings } from "../../types/practice";
import { PracticeSession } from "./PracticeSession";

const meta: Meta<typeof PracticeSession> = {
  title: "Practice Engine/PracticeSession",
  component: PracticeSession,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
## Practice Session Component

The Practice Session component orchestrates multiple practice modes for guitar chord education.

### Features

- **Recognition Mode**: Show triad, identify quality
- **Construction Mode**: Build triad from instructions (Coming Soon)
- **Progression Mode**: Practice chord changes (Coming Soon) 
- **Ear Training Mode**: Audio-based identification (Coming Soon)
- **Progress Tracking**: Visual progress and scoring
- **Session Management**: Pause, resume, and completion handling
- **Accessibility**: Full WCAG 2.1 AA compliance

### Practice Modes

**Recognition Mode** (Available Now)
- Displays a triad visually on the fretboard
- User selects the correct quality from multiple choice options
- Real-time feedback with educational explanations
- Scoring based on accuracy and response time

**Other Modes** (In Development)
- Construction Mode: Build triads from written instructions
- Progression Mode: Practice common chord progressions
- Ear Training Mode: Audio-based triad identification

### Educational Benefits

- **Visual Learning**: See chord shapes and fretboard positions
- **Theory Integration**: Connect visual patterns with harmonic concepts
- **Progressive Difficulty**: Beginner to advanced skill levels
- **Immediate Feedback**: Learn from mistakes with explanations
- **Performance Tracking**: Monitor improvement over time
        `,
      },
    },
  },
  argTypes: {
    settings: {
      control: "object",
      description: "Practice session configuration and settings",
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
      description: "Component size variant",
    },
    onComplete: {
      action: "session-completed",
      description: "Callback when practice session is completed",
    },
    onPause: {
      action: "session-paused",
      description: "Callback when practice session is paused",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default settings for stories
const defaultSettings: PracticeSettings = {
  mode: "recognition",
  difficulty: "beginner",
  questionCount: 5,
  timeLimit: 30,
  includePositions: ["open", "position-3"],
  includeQualities: ["major", "minor"],
  enableAudio: false,
};

// Basic recognition mode session
export const RecognitionModeBasic: Story = {
  args: {
    settings: defaultSettings,
    onComplete: (results) => console.log("session-completed", results),
    onPause: () => console.log("session-paused"),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Basic Recognition Mode session with beginner settings. Shows 5 questions focusing on major and minor triads in open and 3rd positions.",
      },
    },
  },
};

// Intermediate recognition mode
export const RecognitionModeIntermediate: Story = {
  args: {
    settings: {
      ...defaultSettings,
      difficulty: "intermediate",
      questionCount: 8,
      timeLimit: 20,
      includePositions: ["open", "position-3", "position-5"],
      includeQualities: ["major", "minor", "diminished"],
    },
    onComplete: (results) => console.log("session-completed", results),
    onPause: () => console.log("session-paused"),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Intermediate Recognition Mode with more positions and triad qualities. Includes diminished triads and shorter time limits.",
      },
    },
  },
};

// Advanced recognition mode
export const RecognitionModeAdvanced: Story = {
  args: {
    settings: {
      ...defaultSettings,
      difficulty: "advanced",
      questionCount: 12,
      timeLimit: 15,
      includePositions: ["open", "position-3", "position-5", "position-7"],
      includeQualities: ["major", "minor", "diminished", "augmented"],
    },
    onComplete: (results) => console.log("session-completed", results),
    onPause: () => console.log("session-paused"),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Advanced Recognition Mode with all triad qualities and multiple positions. Challenging time limits and comprehensive chord knowledge required.",
      },
    },
  },
};

// Quick practice session
export const QuickPractice: Story = {
  args: {
    settings: {
      ...defaultSettings,
      questionCount: 3,
      timeLimit: 45,
      includePositions: ["open"],
      includeQualities: ["major", "minor"],
    },
    onComplete: (results) => console.log("session-completed", results),
    onPause: () => console.log("session-paused"),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Quick 3-question practice session perfect for a brief warm-up or skill check. Focuses on fundamental major/minor recognition.",
      },
    },
  },
};

// No time limit session
export const NoTimeLimit: Story = {
  args: {
    settings: {
      ...defaultSettings,
      timeLimit: undefined,
      questionCount: 6,
      includeQualities: ["major", "minor", "diminished"],
    },
    onComplete: (results) => console.log("session-completed", results),
    onPause: () => console.log("session-paused"),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Practice session without time pressure. Take your time to analyze each triad and learn at your own pace.",
      },
    },
  },
};

// Small size for mobile/compact layouts
export const SmallSize: Story = {
  args: {
    settings: defaultSettings,
    size: "sm",
    onComplete: (results) => console.log("session-completed", results),
    onPause: () => console.log("session-paused"),
  },
  parameters: {
    docs: {
      description: {
        story: "Small size variant (85% scale) suitable for mobile devices or compact interface layouts.",
      },
    },
  },
};

// Large size for detailed instruction
export const LargeSize: Story = {
  args: {
    settings: {
      ...defaultSettings,
      difficulty: "intermediate",
    },
    size: "lg",
    onComplete: (results) => console.log("session-completed", results),
    onPause: () => console.log("session-paused"),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Large size variant (115% scale) ideal for detailed instruction, presentations, or desktop applications.",
      },
    },
  },
};

// Construction mode placeholder
export const ConstructionModePlaceholder: Story = {
  args: {
    settings: {
      mode: "construction",
      difficulty: "beginner",
      questionCount: 5,
      timeLimit: 45,
      includePositions: ["open"],
      includeQualities: ["major", "minor"],
      enableAudio: false,
    },
    onComplete: (results) => console.log("session-completed", results),
    onPause: () => console.log("session-paused"),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Placeholder for Construction Mode (under development). Shows the session structure for building triads from instructions.",
      },
    },
  },
};

// Progression mode placeholder
export const ProgressionModePlaceholder: Story = {
  args: {
    settings: {
      mode: "progression",
      difficulty: "beginner",
      questionCount: 4,
      timeLimit: 60,
      includePositions: ["open"],
      includeQualities: ["major", "minor"],
      enableAudio: false,
    },
    onComplete: (results) => console.log("session-completed", results),
    onPause: () => console.log("session-paused"),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Placeholder for Progression Mode (under development). Will feature common chord progressions and timing practice.",
      },
    },
  },
};

// Ear training mode placeholder
export const EarTrainingModePlaceholder: Story = {
  args: {
    settings: {
      mode: "ear-training",
      difficulty: "beginner",
      questionCount: 6,
      timeLimit: 25,
      includePositions: ["open"],
      includeQualities: ["major", "minor"],
      enableAudio: true,
    },
    onComplete: (results) => console.log("session-completed", results),
    onPause: () => console.log("session-paused"),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Placeholder for Ear Training Mode (under development). Will feature audio-based triad identification using Web Audio API.",
      },
    },
  },
};

// Educational progression example
export const EducationalProgression: Story = {
  args: {
    settings: {
      ...defaultSettings,
      difficulty: "beginner",
      questionCount: 4,
      timeLimit: 40,
      includePositions: ["open"],
      includeQualities: ["major", "minor"],
    },
    onComplete: (results) => console.log("session-completed", results),
    onPause: () => console.log("session-paused"),
  },
  parameters: {
    docs: {
      description: {
        story: `
Educational example for teaching triad recognition fundamentals.

**Teaching Sequence:**
1. Start with basic major vs minor recognition
2. Use longer time limits for careful analysis
3. Focus on open position for visual clarity
4. Provide immediate feedback with explanations

**Learning Objectives:**
- Distinguish between major and minor triads visually
- Understand harmonic function color coding
- Connect fretboard positions to chord quality
- Build confidence with successful completion
        `,
      },
    },
  },
};
