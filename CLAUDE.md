# CLAUDE.md - Mastering Guitar Project Context

## Project Overview
Guitar education web application with comprehensive design system implementation.

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **Testing**: Vitest with Testing Library, @vitest/ui
- **Documentation**: Storybook with accessibility addon
- **Code Quality**: Biome (linting + formatting)
- **Music Theory**: Integrated design tokens with harmonic function color coding

## Development Philosophy
- **Test-Driven Development**: Write tests first, then implement
- **Accessibility First**: WCAG 2.1 AA compliance from the start
- **Type Safety**: Strict TypeScript with music-specific validation
- **Atomic Commits**: One logical change per commit with clear intentions

## Code Quality Standards
- **TDD Approach**: Tests written before implementation (181 tests total)
- **Coverage**: Comprehensive testing for all components and edge cases
- **TypeScript**: Strict mode with --noEmit validation
- **Code Style**: Biome for consistent formatting and linting
- **Git**: Atomic commits with clear reviewer intentions

## Design System Architecture
- **Components**: Button, ChordDisplay, FretPosition (built TDD)
- **Design Tokens**: Semantic naming with music theory integration
- **Type Safety**: Strict music types with runtime dev warnings
- **Accessibility**: Dual encoding (color + shape symbols) for colorblind users

## Music Theory Integration
- **Harmonic Functions**: root (red), third (orange), fifth (blue)
- **Strict Types**: NoteName, ChordSymbol, Interval, HarmonicFunction
- **Validation**: Compile-time safety + development-mode warnings
- **Color Accessibility**: WCAG compliant with symbol fallbacks

## Development Commands
```bash
# Development
npm run dev               # Start dev server
npm test                  # Run tests in watch mode
npm run test:ui          # Interactive test interface

# Validation & CI
npm run test:coverage    # Run all tests once with coverage
npm run type-check       # TypeScript validation
npm run lint             # Code quality check
npm run build            # Production build validation

# Code Quality
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format code with Biome

# Documentation
npm run storybook        # Interactive component docs
npm run build-storybook  # Build static Storybook

# Data
npm run build:data       # Build triad database
```

## TDD Workflow (Essential Pattern)
1. **Red**: Write failing test that describes desired behavior
2. **Green**: Write minimal code to make test pass
3. **Refactor**: Improve code while keeping tests green
4. **Document**: Add Storybook stories with accessibility notes
5. **Commit**: Atomic commit with clear test-to-implementation story

## Essential Patterns
- **TDD cycle**: Always write tests before implementation
- **Use design tokens**: Never hardcode colors/spacing
- **Validate music props**: Use strict TypeScript types
- **Maintain accessibility**: Test with screen readers
- **Document in Storybook**: Include accessibility notes
- **Atomic commits**: One logical change per commit

## Quality Gates (Run Before Commit)
1. `npm run test:coverage` - All tests pass (maintain TDD coverage)
2. `npm run type-check` - No TypeScript errors  
3. `npm run lint` - Code quality standards met
4. `npm run build` - Production build succeeds