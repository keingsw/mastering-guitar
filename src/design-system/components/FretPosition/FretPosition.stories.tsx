import type { Meta, StoryObj } from "@storybook/react";
import { FretPosition } from "./FretPosition";

const meta: Meta<typeof FretPosition> = {
  title: "Design System/FretPosition",
  component: FretPosition,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A fret position component for displaying notes on a guitar fretboard. Shows harmonic functions with color coding and shape symbols for accessibility. Fully interactive with hover and focus states.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    note: {
      control: { type: "text" },
      description: 'The note name to display (e.g., "C", "F#", "Bb")',
    },
    function: {
      control: { type: "select" },
      options: ["root", "third", "fifth"],
      description: "Harmonic function of the note (determines color)",
    },
    isHighlighted: {
      control: { type: "boolean" },
      description: "Whether the position is highlighted/active",
    },
    isDisabled: {
      control: { type: "boolean" },
      description: "Whether the position is disabled",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "Size of the fret position",
    },
    showNote: {
      control: { type: "boolean" },
      description: "Whether to show the note name",
    },
    showFunction: {
      control: { type: "boolean" },
      description: "Whether to show the function symbol (●◆▲)",
    },
  },
  args: {
    onClick: () => {},
    onHover: () => {},
    note: "C",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Stories
export const Default: Story = {
  args: {
    note: "C",
  },
};

export const Root: Story = {
  args: {
    note: "C",
    function: "root",
    isHighlighted: true,
  },
};

export const Third: Story = {
  args: {
    note: "E",
    function: "third",
    isHighlighted: true,
  },
};

export const Fifth: Story = {
  args: {
    note: "G",
    function: "fifth",
    isHighlighted: true,
  },
};

// Highlighted vs Unhighlighted
export const Highlighted: Story = {
  args: {
    note: "A",
    function: "root",
    isHighlighted: true,
  },
};

export const Unhighlighted: Story = {
  args: {
    note: "A",
    function: "root",
    isHighlighted: false,
  },
};

// Sizes
export const Small: Story = {
  args: {
    note: "F#",
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    note: "Bb",
    size: "md",
  },
};

export const Large: Story = {
  args: {
    note: "C#",
    size: "lg",
  },
};

// Display Options
export const WithFunctionSymbol: Story = {
  args: {
    note: "C",
    function: "root",
    showFunction: true,
    isHighlighted: true,
  },
};

export const HiddenNote: Story = {
  args: {
    note: "G",
    function: "fifth",
    showNote: false,
    showFunction: true,
    isHighlighted: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Fret position with note hidden, showing only the function symbol.",
      },
    },
  },
};

export const NoteAndSymbol: Story = {
  args: {
    note: "E",
    function: "third",
    showNote: true,
    showFunction: true,
    isHighlighted: true,
  },
};

// States
export const Interactive: Story = {
  args: {
    note: "D",
    function: "root",
    onClick: () => {},
    onHover: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Interactive fret position. Hover to see scale effect and click to trigger action.",
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    note: "F",
    function: "third",
    isDisabled: true,
    onClick: () => {},
  },
};

// Function Colors Showcase
export const AllFunctions: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <FretPosition note="C" function="root" isHighlighted />
        <div style={{ fontSize: "12px", marginTop: "8px", color: "#666" }}>Root</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <FretPosition note="E" function="third" isHighlighted />
        <div style={{ fontSize: "12px", marginTop: "8px", color: "#666" }}>Third</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <FretPosition note="G" function="fifth" isHighlighted />
        <div style={{ fontSize: "12px", marginTop: "8px", color: "#666" }}>Fifth</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <FretPosition note="A" isHighlighted />
        <div style={{ fontSize: "12px", marginTop: "8px", color: "#666" }}>Default</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All harmonic function colors: root (red), third (amber), fifth (blue), and default (neutral).",
      },
    },
  },
};

// Function Symbols Showcase
export const AllSymbols: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <FretPosition note="C" function="root" showFunction isHighlighted />
        <div style={{ fontSize: "12px", marginTop: "8px", color: "#666" }}>● Root</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <FretPosition note="E" function="third" showFunction isHighlighted />
        <div style={{ fontSize: "12px", marginTop: "8px", color: "#666" }}>◆ Third</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <FretPosition note="G" function="fifth" showFunction isHighlighted />
        <div style={{ fontSize: "12px", marginTop: "8px", color: "#666" }}>▲ Fifth</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Function symbols provide colorblind-accessible alternatives to color coding.",
      },
    },
  },
};

// All Sizes Showcase
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <FretPosition note="C" size="sm" function="root" isHighlighted />
        <div style={{ fontSize: "12px", marginTop: "8px", color: "#666" }}>Small (32px)</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <FretPosition note="E" size="md" function="third" isHighlighted />
        <div style={{ fontSize: "12px", marginTop: "8px", color: "#666" }}>Medium (88px)</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <FretPosition note="G" size="lg" function="fifth" isHighlighted />
        <div style={{ fontSize: "12px", marginTop: "8px", color: "#666" }}>Large (48px)</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All three sizes showing touch target dimensions. Medium size exceeds WCAG 44px requirement.",
      },
    },
  },
};

// Guitar Chord Example
export const CMajorTriad: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "#fafafa",
        borderRadius: "8px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <FretPosition note="C" function="root" showFunction isHighlighted onClick={() => {}} />
        <div style={{ fontSize: "12px", marginTop: "4px", color: "#666" }}>C</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <FretPosition note="E" function="third" showFunction isHighlighted onClick={() => {}} />
        <div style={{ fontSize: "12px", marginTop: "4px", color: "#666" }}>E</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <FretPosition note="G" function="fifth" showFunction isHighlighted onClick={() => {}} />
        <div style={{ fontSize: "12px", marginTop: "4px", color: "#666" }}>G</div>
      </div>
      <div style={{ marginLeft: "16px", fontSize: "14px", color: "#333" }}>
        <strong>C Major Triad</strong>
        <br />
        <span style={{ fontSize: "12px", color: "#666" }}>Root - Major Third - Perfect Fifth</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Example of how fret positions work together to display a chord on the fretboard.",
      },
    },
  },
};

// Accessibility Demo
export const AccessibilityDemo: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "400px" }}>
      <div style={{ display: "flex", gap: "16px" }}>
        <FretPosition note="C" function="root" showFunction isHighlighted onClick={() => {}} />
        <FretPosition note="E" function="third" showFunction isHighlighted onClick={() => {}} />
        <FretPosition note="G" function="fifth" showFunction isHighlighted onClick={() => {}} />
      </div>
      <div style={{ fontSize: "14px", color: "#666", lineHeight: "1.5" }}>
        <strong>Accessibility Features:</strong>
        <ul style={{ margin: "8px 0", paddingLeft: "16px" }}>
          <li>ARIA labels: "C root note position"</li>
          <li>Screen reader text: "C note, root function, highlighted"</li>
          <li>Keyboard navigation with Tab, Enter, Space</li>
          <li>Focus indicators with visible outline</li>
          <li>Shape symbols for colorblind users</li>
          <li>Touch targets ≥44px (medium size)</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Comprehensive accessibility features including ARIA labels, keyboard navigation, and colorblind support.",
      },
    },
  },
};

// Sharp and Flat Notes
export const AccidentalNotes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <FretPosition note="F#" function="root" isHighlighted />
      <FretPosition note="Bb" function="third" isHighlighted />
      <FretPosition note="C#" function="fifth" isHighlighted />
      <FretPosition note="Gb" />
      <FretPosition note="D#" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Fret positions displaying sharp and flat note names with proper typography.",
      },
    },
  },
};
