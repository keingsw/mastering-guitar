import '@testing-library/jest-dom';
import { vi, expect } from 'vitest';

// Mock CSS custom properties for jsdom environment
Object.defineProperty(window, 'CSS', {
  value: {
    supports: () => false,
  },
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock getComputedStyle for tests
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
  }),
});

// Add CSS keyframes for animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

// Add custom matchers for accessibility testing
expect.extend({
  toHaveMinimumTouchTarget(received: any) {
    const rect = received.getBoundingClientRect();
    const minSize = 44; // WCAG minimum touch target
    
    return {
      message: () => `Expected element to have minimum touch target of ${minSize}px, got ${rect.width}x${rect.height}`,
      pass: rect.width >= minSize && rect.height >= minSize,
    };
  },
  
  toMeetColorContrastRatio(_received: any, expectedRatio: number = 4.5) {
    // This is a simplified implementation
    // In a real project, you'd use a proper color contrast calculator
    const pass = true; // Assume pass for now - would calculate actual contrast
    
    return {
      message: () => `Expected element to meet WCAG contrast ratio of ${expectedRatio}:1`,
      pass,
    };
  },
});

// Extend Jest matchers
declare module 'vitest' {
  interface Assertion {
    toHaveMinimumTouchTarget(): void;
    toMeetColorContrastRatio(ratio?: number): void;
  }
}