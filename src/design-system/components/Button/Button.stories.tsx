import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Design System/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants, sizes, and states. Fully accessible with keyboard navigation and loading states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost'],
      description: 'Visual variant of the button',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the button',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Shows loading spinner and disables interaction',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disables the button interaction',
    },
    children: {
      control: { type: 'text' },
      description: 'Button content',
    },
  },
  args: {
    onClick: () => {},
    children: 'Button',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Primary Stories
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

// Size Variants
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium Button',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

// States
export const Loading: Story = {
  args: {
    isLoading: true,
    children: 'Loading...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All three button variants side by side for comparison.',
      },
    },
  },
};

// All Sizes Showcase
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All three button sizes for size comparison.',
      },
    },
  },
};

// Interactive Examples
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <span style={{ fontSize: '1.2em', marginRight: '8px' }}>🎸</span>
        Play Chord
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with an icon using emoji or other elements.',
      },
    },
  },
};

export const LongText: Story = {
  args: {
    children: 'This is a button with a very long text content to test wrapping behavior',
    style: { maxWidth: '200px' },
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with long text content to demonstrate text wrapping.',
      },
    },
  },
};

// Accessibility Story
export const AccessibilityDemo: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '300px' }}>
      <Button>Keyboard Accessible</Button>
      <Button disabled>Disabled State (aria-disabled)</Button>
      <Button isLoading>Loading State (aria-describedby)</Button>
      <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
        All buttons support keyboard navigation (Tab, Enter, Space) and have proper ARIA attributes.
        Use Tab to navigate between buttons and press Enter or Space to activate.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates accessibility features including keyboard navigation and ARIA attributes.',
      },
    },
  },
};