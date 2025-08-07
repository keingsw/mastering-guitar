# CLAUDE.md - Mastering Guitar Project Context

## Project Overview
Comprehensive guitar education web application with integrated design system and practice modes for interactive chord learning.

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **Testing**: Vitest with Testing Library, @vitest/ui
- **Documentation**: Storybook with accessibility addon
- **Code Quality**: Biome (linting + formatting)
- **Music Theory**: Integrated design tokens with harmonic function color coding
- **Audio Synthesis**: Web Audio API for ear training and chord playback
- **Error Handling**: React Error Boundaries for production reliability

## Development Philosophy
- **TEST-FIRST MANDATORY**: Always write failing tests before any implementation code
- **Accessibility First**: WCAG 2.1 AA compliance from the start
- **Type Safety**: Strict TypeScript with music-specific validation
- **Atomic Commits**: One logical change per commit with clear intentions
- **Error Resilience**: Production-ready error boundaries and graceful fallbacks
- **Performance First**: Optimized rendering and memory management

## Code Quality Standards
- **TDD ENFORCEMENT**: NO CODE WITHOUT TESTS FIRST - Tests written before implementation (345+ tests total)
- **Coverage**: Comprehensive testing for all components and edge cases
- **TypeScript**: Strict mode with --noEmit validation
- **Code Style**: Biome for consistent formatting and linting
- **Git**: Atomic commits with clear reviewer intentions
- **Error Boundaries**: Production-grade error handling for all practice modes
- **Performance**: Optimized re-rendering and resource cleanup

## Design System Architecture
- **Base Components**: Button, ChordDisplay, FretPosition, TriadSelector (built TDD)
- **Practice Components**: RecognitionMode, ConstructionMode, ProgressionMode, EarTrainingMode
- **Session Management**: PracticeSession orchestrator with progress tracking and scoring
- **Error Handling**: PracticeErrorBoundary with graceful fallbacks and recovery
- **Design Tokens**: Semantic naming with music theory integration
- **Type Safety**: Strict music types with runtime dev warnings
- **Accessibility**: Dual encoding (color + shape symbols) for colorblind users

## Music Theory Integration
- **Harmonic Functions**: root (red), third (orange), fifth (blue)
- **Strict Types**: NoteName, ChordSymbol, Interval, HarmonicFunction, TriadQuality
- **Practice Engine**: Question generation, scoring algorithms, adaptive learning
- **Audio Synthesis**: Full chromatic support (C, C#, D, D#, E, F, F#, G, G#, A, A#, B)
- **Validation**: Compile-time safety + development-mode warnings
- **Color Accessibility**: WCAG compliant with symbol fallbacks

## Practice Modes System
- **Recognition Mode**: Visual triad identification with multiple choice interface
- **Construction Mode**: Interactive triad building using TriadSelector component
- **Progression Mode**: Timed chord progression practice with visual metronome
- **Ear Training Mode**: Audio-based triad identification with Web Audio API
- **Session Management**: Complete practice orchestration with progress tracking
- **Adaptive Learning**: Performance-based question generation and difficulty scaling
- **Comprehensive Feedback**: Educational explanations with scoring algorithms

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

## TDD Workflow (MANDATORY - NO EXCEPTIONS)
**⚠️ CRITICAL: Never write implementation code without tests first ⚠️**

1. **Red**: Write failing test that describes desired behavior FIRST
2. **Green**: Write minimal code to make test pass (and ONLY to make test pass)
3. **Refactor**: Improve code while keeping tests green
4. **Document**: Add Storybook stories with accessibility notes
5. **Commit**: Atomic commit with clear test-to-implementation story

**ENFORCEMENT**: All PRs must show test commits before implementation commits

## Essential Patterns
- **TDD FIRST**: NEVER write implementation without failing tests first
- **Use design tokens**: Never hardcode colors/spacing
- **Validate music props**: Use strict TypeScript types
- **Maintain accessibility**: Test with screen readers
- **Document in Storybook**: Include accessibility notes
- **Atomic commits**: One logical change per commit
- **Error boundaries**: Wrap complex components with PracticeErrorBoundary
- **Performance optimization**: Use stable dependency keys and proper cleanup
- **Audio resource management**: Always cleanup audio contexts and timers

## Quality Gates (Run Before Commit)
**🚫 GATE 0: TESTS FIRST - Verify tests were written before implementation**
1. `npm run test:coverage` - All tests pass (maintain TDD coverage)
2. `npm run type-check` - No TypeScript errors  
3. `npm run lint` - Code quality standards met
4. `npm run build` - Production build succeeds
5. Error boundaries implemented for complex components
6. Audio resources properly cleaned up (no memory leaks)
7. Performance optimizations applied (stable dependencies, memoization)

## Code Review Best Practices
### PR Structure (Atomic Commits)
- **TDD VERIFICATION**: First commit must be failing tests, second commit implementation
- **One concern per commit** - Each commit addresses a single issue or feature
- **Clear commit messages** - Explain the "why" not just the "what"
- **Logical progression** - Commits build from foundation to advanced features
- **Reviewable scope** - Each commit can be reviewed and understood independently

### Implementation Standards
- **TDD COMPLIANCE**: All features must have tests written first
- **Audio synthesis**: Full chromatic support (all 12 notes)
- **Error handling**: Graceful fallbacks with user-friendly messages
- **Performance**: Stable dependency keys, proper cleanup, memory management
- **Type safety**: Replace 'any' types with proper interfaces
- **Accessibility**: WCAG 2.1 AA compliance with keyboard navigation

### Review Priority Guidelines
1. **CRITICAL PRIORITY**: TDD compliance - Tests written before implementation
2. **High Priority**: Audio completeness, error handling, accessibility
3. **Medium Priority**: Performance optimization, type safety
4. **Low Priority**: Code organization, documentation improvements