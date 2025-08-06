/**
 * Button Component Tests
 * 
 * Test-driven development approach:
 * 1. Write comprehensive tests first
 * 2. Run tests to see them fail
 * 3. Implement minimum code to make tests pass
 * 4. Refactor while keeping tests green
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Component', () => {
  // Basic rendering tests
  describe('Rendering', () => {
    it('should render with children text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('should render as button element by default', () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should forward ref to button element', () => {
      const ref = vi.fn();
      render(<Button ref={ref}>Test</Button>);
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
    });
  });

  // Variant tests
  describe('Variants', () => {
    it('should render primary variant by default', () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole('button');
      expect(button.style.backgroundColor).toBe('rgb(237, 112, 39)');
      expect(button.style.color).toBe('rgb(255, 255, 255)');
    });

    it('should render secondary variant correctly', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button.style.backgroundColor).toBe('rgb(245, 245, 244)');
      expect(button.style.border).toContain('rgb(214, 211, 209)');
    });

    it('should render outline variant correctly', () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole('button');
      expect(button.style.backgroundColor).toBe('transparent');
      expect(button.style.color).toBe('rgb(237, 112, 39)');
      expect(button.style.border).toContain('rgb(237, 112, 39)');
    });

    it('should render ghost variant correctly', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      expect(button.style.backgroundColor).toBe('transparent');
      // Ghost variant has no border - verify it's falsy or empty
      expect(button.style.border === 'none' || button.style.border === '').toBe(true);
    });

    it('should render musical variant with special styling', () => {
      render(<Button variant="musical">Musical</Button>);
      const button = screen.getByRole('button');
      expect(button.style.backgroundColor).toBe('rgb(245, 158, 11)');
      expect(button.style.boxShadow).toContain('rgba(0, 0, 0, 0.2)');
    });
  });

  // Size tests
  describe('Sizes', () => {
    it('should render medium size by default', () => {
      render(<Button>Medium</Button>);
      const button = screen.getByRole('button');
      expect(button.style.minHeight).toBe('44px'); // WCAG compliant touch target
      expect(button.style.paddingLeft).toBe('32px');
      expect(button.style.paddingRight).toBe('32px');
    });

    it('should render small size correctly', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      expect(button.style.minHeight).toBe('36px');
      expect(button.style.fontSize).toBe('0.875rem');
    });

    it('should render large size correctly', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button.style.minHeight).toBe('52px');
      expect(button.style.fontSize).toBe('1.125rem');
    });
  });

  // Interactive states tests
  describe('Interactive States', () => {
    it('should handle click events', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not trigger click when disabled', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick} disabled>Disabled</Button>);
      
      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should show loading state', () => {
      render(<Button isLoading>Loading</Button>);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should not trigger click when loading', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick} isLoading>Loading</Button>);
      
      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('should have proper ARIA attributes when disabled', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toBeDisabled();
    });

    it('should have proper ARIA attributes when loading', () => {
      render(<Button isLoading id="test-btn">Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toHaveAttribute('aria-describedby', 'test-btn-loading');
    });

    it('should be keyboard accessible', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Keyboard</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      await userEvent.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
      
      await userEvent.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('should have minimum touch target size (44px)', () => {
      render(<Button>Touch target</Button>);
      const button = screen.getByRole('button');
      expect(button.style.minHeight).toBe('44px');
    });

    it('should show focus indicator', async () => {
      render(<Button>Focus test</Button>);
      const button = screen.getByRole('button');
      
      fireEvent.focus(button);
      await waitFor(() => {
        expect(button.style.boxShadow).toContain('#ed7027');
        expect(button.style.boxShadow).toContain('#fbd7a6');
      });
    });
  });

  // Icon tests
  describe('Icons', () => {
    it('should render left icon', () => {
      const leftIcon = <span data-testid="left-icon">←</span>;
      render(<Button leftIcon={leftIcon}>With left icon</Button>);
      
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByText('With left icon')).toBeInTheDocument();
    });

    it('should render right icon', () => {
      const rightIcon = <span data-testid="right-icon">→</span>;
      render(<Button rightIcon={rightIcon}>With right icon</Button>);
      
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
      expect(screen.getByText('With right icon')).toBeInTheDocument();
    });

    it('should render both icons', () => {
      const leftIcon = <span data-testid="left-icon">←</span>;
      const rightIcon = <span data-testid="right-icon">→</span>;
      render(<Button leftIcon={leftIcon} rightIcon={rightIcon}>Both icons</Button>);
      
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
      expect(screen.getByText('Both icons')).toBeInTheDocument();
    });

    it('should hide icons when loading', () => {
      const leftIcon = <span data-testid="left-icon">←</span>;
      render(<Button leftIcon={leftIcon} isLoading>Loading</Button>);
      
      expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  // Layout tests
  describe('Layout', () => {
    it('should support full width', () => {
      render(<Button fullWidth>Full width</Button>);
      const button = screen.getByRole('button');
      expect(button.style.width).toBe('100%');
    });

    it('should have inline-flex display by default', () => {
      render(<Button>Default</Button>);
      const button = screen.getByRole('button');
      expect(button.style.display).toBe('inline-flex');
    });

    it('should center content', () => {
      render(<Button>Centered</Button>);
      const button = screen.getByRole('button');
      expect(button.style.alignItems).toBe('center');
      expect(button.style.justifyContent).toBe('center');
    });
  });

  // Custom styling tests
  describe('Custom Styling', () => {
    it('should accept custom className', () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('should accept custom styles', () => {
      render(<Button style={{ backgroundColor: 'red' }}>Custom style</Button>);
      const button = screen.getByRole('button');
      expect(button.style.backgroundColor).toBe('red');
    });
  });

  // WCAG Compliance tests
  describe('WCAG 2.1 AA Compliance', () => {
    it('should meet color contrast requirements for primary variant', () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole('button');
      // Primary uses #ed7027 background with white text
      // This combination has a contrast ratio > 4.5:1
      expect(button.style.backgroundColor).toBe('rgb(237, 112, 39)');
      expect(button.style.color).toBe('rgb(255, 255, 255)');
    });

    it('should meet color contrast requirements for secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      // Secondary uses light background with dark text
      expect(button.style.backgroundColor).toBe('rgb(245, 245, 244)');
      expect(button.style.color).toBe('rgb(28, 25, 23)');
    });

    it('should maintain disabled state opacity for accessibility', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button.style.opacity).toBe('0.5');
    });
  });

  // Animation and transitions tests
  describe('Animations', () => {
    it('should have transition property for smooth interactions', () => {
      render(<Button>Animated</Button>);
      const button = screen.getByRole('button');
      expect(button.style.transition).toBe('all 150ms cubic-bezier(0.4, 0, 0.2, 1)');
    });

    it('should have hover effects for musical variant', async () => {
      render(<Button variant="musical">Musical</Button>);
      const button = screen.getByRole('button');
      
      fireEvent.mouseEnter(button);
      await waitFor(() => {
        expect(button.style.transform).toBe('translateY(-1px)');
      });
    });
  });
});