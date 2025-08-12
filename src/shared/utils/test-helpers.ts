/**
 * Test Helper Utilities
 *
 * Reusable utilities for testing React components with consistent patterns
 * and better error handling.
 */

import { screen } from "@testing-library/dom";

/**
 * Finds an element by text content and returns its closest container
 * Throws descriptive error if element not found or no container exists
 *
 * @param text - Text content to search for
 * @param selector - CSS selector for the container (default: "div")
 * @returns HTMLElement - The container element
 * @throws Error if element or container not found
 */
export function getElementContainer(text: string, selector: string = "div"): HTMLElement {
  const textElement = screen.getByText(text);
  const container = textElement.closest(selector);

  if (!container) {
    throw new Error(`Container element with selector "${selector}" not found for text "${text}"`);
  }

  return container as HTMLElement;
}

/**
 * Safely gets an element container without throwing
 * Returns null if element or container not found
 *
 * @param text - Text content to search for
 * @param selector - CSS selector for the container (default: "div")
 * @returns HTMLElement | null - The container element or null
 */
export function queryElementContainer(text: string, selector: string = "div"): HTMLElement | null {
  try {
    const textElement = screen.queryByText(text);
    if (!textElement) return null;

    const container = textElement.closest(selector);
    return container as HTMLElement | null;
  } catch {
    return null;
  }
}

/**
 * Gets element container and asserts it exists in tests
 * Provides better error messages than toBeTruthy()
 *
 * @param text - Text content to search for
 * @param selector - CSS selector for the container (default: "div")
 * @returns HTMLElement - The container element (guaranteed to exist)
 */
export function expectElementContainer(text: string, selector: string = "div"): HTMLElement {
  const container = queryElementContainer(text, selector);

  if (!container) {
    throw new Error(
      `Expected to find container element with selector "${selector}" for text "${text}", but none was found. ` +
        "This could indicate a rendering issue or incorrect test setup.",
    );
  }

  return container;
}

/**
 * Gets an element by role with better error handling
 *
 * @param role - ARIA role to search for
 * @param options - Additional options for getByRole
 * @returns HTMLElement - The element with the specified role
 */
export function getElementByRole(role: string, options?: object): HTMLElement {
  try {
    return screen.getByRole(role, options);
  } catch {
    throw new Error(
      `Element with role "${role}" not found. ` +
        `Available roles: ${Array.from(
          new Set(
            Array.from(document.querySelectorAll("*"))
              .map((el) => el.getAttribute("role"))
              .filter(Boolean),
          ),
        ).join(", ")}`,
    );
  }
}
