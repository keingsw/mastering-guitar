# CLAUDE.md - Mastering Guitar Project Context

## Project Overview
Comprehensive guitar education web application with integrated design system and practice modes for interactive chord learning.

**🔄 DOCUMENTATION-FIRST PRINCIPLE**: All code changes MUST include corresponding documentation updates in the same commit to maintain accuracy.

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
- **TDD ENFORCEMENT**: NO CODE WITHOUT TESTS FIRST - Tests written before implementation
- **Coverage**: Comprehensive testing for all components and edge cases
- **TypeScript**: Strict mode with --noEmit validation
- **Code Style**: Biome for consistent formatting and linting
- **Git**: Atomic commits with clear reviewer intentions
- **Error Boundaries**: Production-grade error handling for all practice modes
- **Performance**: Optimized re-rendering and resource cleanup

## Design System Architecture
- **Base Components**: Button, ChordDisplay, FretPosition, TriadSelector (built TDD)
- **Fretboard Component**: Extended 21-fret range with clear R/3/5 harmonic labels
- **Practice Components**: RecognitionMode, ConstructionMode, ProgressionMode, EarTrainingMode
- **Session Management**: PracticeSession orchestrator with progress tracking and scoring
- **Error Handling**: PracticeErrorBoundary with graceful fallbacks and recovery
- **Design Tokens**: Semantic naming with music theory integration
- **Type Safety**: Strict music types with runtime dev warnings
- **Accessibility**: Text-based harmonic labels (R/3/5) for better clarity than color-only

## Module Architecture
The application follows a modular architecture with clear separation of concerns:

- **`src/app/`**: Main application shell with layout, pages, contexts, and global styles
- **`src/design-system/`**: Reusable UI components, design tokens, and accessibility compliance
- **`src/modules/chord-data/`**: Chord database system with generated triad data and lookup services
- **`src/modules/music-theory/`**: Core music theory entities (Note, intervals, triads) and fretboard mapping
- **`src/modules/practice-engine/`**: Practice modes, session management, scoring, and question generation
- **`src/modules/storage/`**: Data persistence layer and storage services
- **`src/modules/ui-components/`**: Specialized UI components for practice and fretboard visualization
- **`src/shared/`**: Shared utilities, constants, types, and configuration across modules

## Project Structure
```
src/
├── app/                          # Main application shell
│   ├── components/layout/        # Layout components
│   ├── components/pages/         # Page components
│   ├── contexts/reducers/        # State management
│   ├── hooks/                    # Custom React hooks
│   └── styles/globals.css        # Global styles
├── design-system/                # Design system components
│   ├── components/               # UI components with tests & stories
│   ├── tokens/                   # Design tokens (colors, typography, spacing)
│   ├── types/music.ts            # Music-specific type definitions
│   └── wcag-compliance.test.tsx  # Accessibility validation
├── modules/
│   ├── chord-data/               # Chord database system
│   │   ├── generated/triad-database.json  # Generated chord data
│   │   ├── services/database-lookup.ts    # Runtime chord lookup
│   │   └── triads/               # Source chord definitions
│   ├── music-theory/             # Music theory core
│   │   ├── entities/Note.ts      # Note entity with chromatic support
│   │   └── services/             # Intervals, triads, fretboard mapping
│   ├── practice-engine/          # Practice system
│   │   ├── components/modes/     # Recognition, Construction, Progression, EarTraining
│   │   ├── components/PracticeSession/  # Session orchestrator
│   │   ├── components/PracticeErrorBoundary/  # Error handling
│   │   └── services/             # Question generation, scoring
│   ├── storage/                  # Data persistence
│   └── ui-components/            # Specialized UI components
├── shared/                       # Shared utilities
│   ├── constants/music.ts        # Music constants
│   ├── types/common.ts           # Common type definitions
│   └── utils/                    # Utility functions
└── stories/                      # Storybook stories and assets
```

## Music Theory Integration
- **Harmonic Functions**: Clear text labels (R, 3, 5) with colored borders for root/third/fifth
- **Strict Types**: NoteName, ChordSymbol, Interval, HarmonicFunction, TriadQuality
- **Practice Engine**: Question generation, scoring algorithms, adaptive learning
- **Audio Synthesis**: Full chromatic support (C, C#, D, D#, E, F, F#, G, G#, A, A#, B)
- **Validation**: Compile-time safety + development-mode warnings
- **Accessibility**: Text-based labels instead of color-only coding for better clarity

## Practice Modes System
- **Recognition Mode**: Visual triad identification with multiple choice interface
- **Construction Mode**: Interactive triad building using TriadSelector component
- **Progression Mode**: Timed chord progression practice with visual metronome
- **Ear Training Mode**: Audio-based triad identification with Web Audio API
- **Session Management**: Complete practice orchestration with progress tracking
- **Adaptive Learning**: Performance-based question generation and difficulty scaling
- **Comprehensive Feedback**: Educational explanations with scoring algorithms

## Data Generation System
The application uses a build-time data generation system for chord information:

- **Source**: TypeScript chord definitions in `src/modules/chord-data/triads/`
- **Generator**: `scripts/build-triad-database.ts` processes definitions into optimized JSON
- **Output**: `src/modules/chord-data/generated/triad-database.json` 
- **Lookup Service**: `src/modules/chord-data/services/database-lookup.ts` provides runtime access
- **Integration**: Practice engine uses generated data for question generation and validation
- **Build Process**: Run `npm run build:data` to regenerate after chord definition changes

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

# Data Generation
npm run build:data       # Generate triad database from chord definitions
```

## TDD Workflow (MANDATORY - NO EXCEPTIONS)
**⚠️ CRITICAL: Never write implementation code without tests first ⚠️**

1. **Red**: Write failing test that describes desired behavior FIRST
2. **Green**: Write minimal code to make test pass (and ONLY to make test pass)
3. **Refactor**: Improve code while keeping tests green
4. **Document**: Add Storybook stories with accessibility notes
5. **Update Docs**: Update CLAUDE.md and README.md if architectural changes made
6. **Commit**: Atomic commit with clear test-to-implementation story

**ENFORCEMENT**: All PRs must show test commits before implementation commits

## Documentation-Driven Development (MANDATORY)
**⚠️ CRITICAL: Always update ALL documentation alongside code changes ⚠️**

### Complete Documentation Scope
Documentation includes ALL of these forms - update ALL relevant types with every change:

#### **1. Project Documentation**
- **CLAUDE.md**: Project context, architecture, workflows, patterns
- **README.md files**: Module-specific documentation, setup guides
- **docs/ directory**: Technical specifications, API docs, guides, tutorials
- **Storybook stories**: Component documentation with examples and accessibility notes

#### **2. Code Documentation**
- **Inline comments**: Complex logic explanations, business rule clarifications
- **Type definitions**: Comprehensive TypeScript interfaces with descriptions
- **Component props**: Detailed prop descriptions with examples and defaults

#### **3. Test Documentation**
- **Test descriptions**: Clear describe() and it() descriptions explaining behavior
- **Test comments**: Context for complex test setups, edge cases, business rules
- **Test scenarios**: Comprehensive coverage documentation in test files
- **Mock explanations**: Why specific mocks are used and what they represent

### When to Update Documentation (ALL Types)
- **New Module/Component**: 
  - Update CLAUDE.md Module Architecture and Project Structure
  - Create/update module README.md
  - Add inline comments for complex logic
  - Write descriptive test descriptions
- **New Function/Method**:
  - Add inline comments for complex logic
  - Update related API documentation
  - Write clear test descriptions
- **Architectural Changes**: 
  - Update CLAUDE.md sections
  - Update relevant docs/ files
  - Update component prop descriptions
  - Update test scenario descriptions
- **New Practice Mode/Feature**: 
  - Update CLAUDE.md Practice Modes System
  - Create docs/ file if complex
  - Add Storybook stories with accessibility notes
  - Write comprehensive test descriptions
- **Bug Fixes**:
  - Add code comments explaining the fix
  - Update test descriptions to cover the bug scenario
  - Update docs if behavior changes
- **Refactoring**:
  - Update all affected code comments
  - Ensure test descriptions still match
  - Update component/function documentation

### Documentation Update Workflow
1. **Before Implementation**: Identify ALL documentation types affected by changes
2. **During Development**: Note specific updates needed for each documentation type
3. **Code Comments**: Write/update inline comments explaining complex logic as you code
4. **Test Documentation**: Write descriptive test names and comments explaining scenarios
5. **After Implementation**: Update project docs, README files, and API documentation
6. **Validation**: Verify ALL documentation matches actual implementation
7. **Commit**: Include ALL documentation updates in the same commit as code changes

## Essential Patterns
- **TDD FIRST**: NEVER write implementation without failing tests first
- **Complete Documentation SYNC**: Update ALL documentation types in same commit as code changes
  - Inline code comments for complex logic
  - Test descriptions and comments
  - Project docs (CLAUDE.md, README.md, docs/)
  - Storybook stories
- **Use design tokens**: Never hardcode colors/spacing
- **Validate music props**: Use strict TypeScript types
- **Maintain accessibility**: Test with screen readers
- **Document in Storybook**: Include accessibility notes
- **Atomic commits**: One logical change per commit (code + ALL related docs)
- **Error boundaries**: Wrap complex components with PracticeErrorBoundary
- **Performance optimization**: Use stable dependency keys and proper cleanup
- **Audio resource management**: Always cleanup audio contexts and timers
- **Self-documenting code**: Write clear inline comments and descriptive test names

## Comment Standards (MANDATORY)
**⚠️ CRITICAL: Only write comments that explain complex, non-obvious logic ⚠️**

### **Comments to AVOID** ❌
Never write comments that restate what the code already says clearly:

```typescript
// BAD: Obvious section headers
// Core Components
export { Button } from './Button';

// BAD: Obvious type descriptions  
// Triad quality types
export type TriadQuality = 'major' | 'minor';

// BAD: Obvious prop descriptions
interface Props {
  /** Component size variant */
  size?: ComponentSize;
}

// BAD: Obvious calculations
spacing: `${baseUnit * 16}px`, // 128px

// BAD: JSDoc that restates function name
/**
 * Calculate session score
 */
function calculateSessionScore() {}

// BAD: Obvious implementation details
// Generate session ID
const sessionId = useMemo(() => generateId(), []);
```

### **Comments to KEEP** ✅
Only write comments that explain WHY or complex logic that's hard to understand:

```typescript
// GOOD: Explains complex mapping logic
// Convert from visual string position (0-5) to tuning array index
// String 0 (visual top) = tuning[5] (high E)
// String 5 (visual bottom) = tuning[0] (low E)
const tuningIndex = (6 - 1) - stringIndex;

// GOOD: Explains algorithm choice
// Fisher-Yates shuffle algorithm
function shuffle<T>(array: T[]) {}

// GOOD: Explains performance optimization
// Create stable dependency key for question generation
const questionsKey = useMemo(() => 
  `${settings.mode}-${settings.difficulty}...`,
  [settings...]
);

// GOOD: Explains business rule or edge case
// Prevent double submission during network delay
if (isSubmitting) return;
```

### **Comment Standards by Type**

#### **Inline Comments**
- **Purpose**: Explain complex logic, algorithms, business rules, edge cases
- **Location**: Line above the complex code, not same line
- **Style**: Sentence case, no period unless multiple sentences

#### **Test Comments** 
- **Purpose**: Explain test scenarios, mock reasoning, complex setup
- **Focus**: WHY this test case matters, not WHAT it's testing (test name covers that)

#### **Complex Calculations**
- **Guitar-specific**: String/fret mapping, note calculations, harmonic functions
- **Performance**: Optimization explanations, caching strategies
- **Algorithms**: Non-obvious algorithm choices or implementations

### **Comment Enforcement**
- **Code Review**: Reviewers must flag obvious comments for removal
- **Quality Gate**: Comments must pass "non-obvious logic" test
- **Refactoring**: Remove comments when code becomes self-explanatory

### **Self-Documenting Principles**
1. **Clear naming** reduces need for comments
2. **Small functions** make logic obvious
3. **TypeScript types** document interfaces
4. **Descriptive test names** document behavior
5. **Comments only for complexity** that can't be simplified

## Quality Gates (Run Before Commit)
**🚫 GATE 0: TESTS FIRST - Verify tests were written before implementation**
1. `npm run test:coverage` - All tests pass (maintain TDD coverage)
2. `npm run type-check` - No TypeScript errors  
3. `npm run lint` - Code quality standards met
4. `npm run build` - Production build succeeds
5. **Complete Documentation Validation**:
   - CLAUDE.md updated to reflect architectural changes
   - Only non-obvious logic has inline comments explaining complexity
   - Test descriptions clearly explain behavior being tested
   - README.md files updated if module functionality changed
   - No obvious/redundant comments present (JSDoc, section headers, calculations)
6. Error boundaries implemented for complex components
7. Audio resources properly cleaned up (no memory leaks)
8. Performance optimizations applied (stable dependencies, memoization)

## Code Review Best Practices
### PR Structure (Atomic Commits)
- **TDD VERIFICATION**: First commit must be failing tests, second commit implementation
- **Complete Documentation SYNC**: ALL documentation types updated in same commit as related code
  - Inline code comments for complex logic explanations
  - Test descriptions and test comments
  - Project documentation (CLAUDE.md, README.md, docs/)
  - Storybook stories with accessibility notes
- **One concern per commit** - Each commit addresses a single issue or feature (including ALL related docs)
- **Clear commit messages** - Explain the "why" not just the "what"
- **Logical progression** - Commits build from foundation to advanced features
- **Reviewable scope** - Each commit can be reviewed and understood independently

### Implementation Standards
- **TDD COMPLIANCE**: All features must have tests written first
- **Complete Documentation Standards**:
  - Descriptive test names explaining the exact behavior being tested
  - Inline comments ONLY for complex, non-obvious logic (no JSDoc, no section headers)
  - Component props documented with examples and default values
  - README.md files for each major module explaining purpose and usage
- **Audio synthesis**: Full chromatic support (all 12 notes)
- **Error handling**: Graceful fallbacks with user-friendly messages
- **Performance**: Stable dependency keys, proper cleanup, memory management
- **Type safety**: Replace 'any' types with proper interfaces
- **Accessibility**: WCAG 2.1 AA compliance with keyboard navigation

### Review Priority Guidelines
1. **CRITICAL PRIORITY**: TDD compliance - Tests written before implementation
2. **CRITICAL PRIORITY**: Complete documentation sync - ALL documentation types updated
   - Inline code comments ONLY for complex, non-obvious logic
   - Test descriptions and explanations
   - Project docs (CLAUDE.md, README.md, docs/)
   - Storybook stories
3. **CRITICAL PRIORITY**: Comment standards - No obvious/redundant comments present
4. **High Priority**: Audio completeness, error handling, accessibility
5. **Medium Priority**: Performance optimization, type safety
6. **Low Priority**: Code organization, cosmetic improvements