/**
 * Test Helper Utilities Tests
 *
 * Tests for reusable test utilities to ensure they work correctly
 * and provide helpful error messages.
 */

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectElementContainer, getElementByRole, getElementContainer, queryElementContainer } from "./test-helpers";

// Test component for testing utilities
function TestComponent() {
  return (
    <div data-testid="container">
      <span>Test Text</span>
      <button type="button" aria-label="Test Button">
        Click me
      </button>
      <main>
        <p>Nested content</p>
      </main>
    </div>
  );
}

describe("Test Helper Utilities", () => {
  describe("getElementContainer", () => {
    it("should find element container successfully", () => {
      render(<TestComponent />);
      const container = getElementContainer("Test Text", "div");
      expect(container).toBeInTheDocument();
      expect(container.getAttribute("data-testid")).toBe("container");
    });

    it("should use div as default selector", () => {
      render(<TestComponent />);
      const container = getElementContainer("Test Text");
      expect(container).toBeInTheDocument();
      expect(container.tagName.toLowerCase()).toBe("div");
    });

    it("should work with different selectors", () => {
      render(<TestComponent />);
      const container = getElementContainer("Nested content", "main");
      expect(container).toBeInTheDocument();
      expect(container.tagName.toLowerCase()).toBe("main");
    });

    it("should throw descriptive error when container not found", () => {
      render(<span>Test Text</span>);
      expect(() => getElementContainer("Test Text", "section")).toThrow(
        'Container element with selector "section" not found for text "Test Text"',
      );
    });

    it("should throw error when text not found", () => {
      render(<TestComponent />);
      expect(() => getElementContainer("Nonexistent Text")).toThrow();
    });
  });

  describe("queryElementContainer", () => {
    it("should find element container successfully", () => {
      render(<TestComponent />);
      const container = queryElementContainer("Test Text", "div");
      expect(container).toBeInTheDocument();
      expect(container?.getAttribute("data-testid")).toBe("container");
    });

    it("should return null when text not found", () => {
      render(<TestComponent />);
      const container = queryElementContainer("Nonexistent Text");
      expect(container).toBeNull();
    });

    it("should return null when container not found", () => {
      render(<span>Test Text</span>);
      const container = queryElementContainer("Test Text", "section");
      expect(container).toBeNull();
    });
  });

  describe("expectElementContainer", () => {
    it("should find element container and assert existence", () => {
      render(<TestComponent />);
      const container = expectElementContainer("Test Text");
      expect(container).toBeInTheDocument();
      expect(container.getAttribute("data-testid")).toBe("container");
    });

    it("should throw descriptive error when container not found", () => {
      render(<span>Test Text</span>);
      expect(() => expectElementContainer("Test Text", "section")).toThrow(
        'Expected to find container element with selector "section" for text "Test Text", but none was found. ' +
          "This could indicate a rendering issue or incorrect test setup.",
      );
    });

    it("should throw descriptive error when text not found", () => {
      render(<TestComponent />);
      expect(() => expectElementContainer("Nonexistent Text")).toThrow(
        'Expected to find container element with selector "div" for text "Nonexistent Text", but none was found. ' +
          "This could indicate a rendering issue or incorrect test setup.",
      );
    });
  });

  describe("getElementByRole", () => {
    it("should find element by role successfully", () => {
      render(<TestComponent />);
      const button = getElementByRole("button");
      expect(button).toBeInTheDocument();
      expect(button.textContent).toBe("Click me");
    });

    it("should work with role options", () => {
      render(<TestComponent />);
      const button = getElementByRole("button", { name: "Test Button" });
      expect(button).toBeInTheDocument();
      expect(button.getAttribute("aria-label")).toBe("Test Button");
    });

    it("should provide helpful error when role not found", () => {
      render(<TestComponent />);
      expect(() => getElementByRole("nonexistent")).toThrow('Element with role "nonexistent" not found.');
    });
  });
});
