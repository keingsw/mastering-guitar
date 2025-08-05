# ADR-001: Single Repository with Modular Architecture

## Status
**Accepted** - 2024-08-04

## Context
We need to decide on the repository structure for the Guitar Triads Mastery application. The main considerations are:

1. **Current Scope**: Single React 19 application for guitar triad learning
2. **Future Extensibility**: Potential expansion to other instruments, mobile apps, or backend services
3. **Development Velocity**: Need for rapid iteration and MVP development
4. **Team Size**: Initially small team/solo development
5. **Complexity Management**: Balance between over-engineering and future flexibility

### Options Considered

#### Option 1: Simple Single Repository
- All code in traditional React app structure
- Fastest to start, but harder to extract modules later
- Risk of tight coupling between concerns

#### Option 2: Monorepo with Turbo
- Separate packages for music-theory, ui-components, practice-engine
- Clean separation but added complexity
- Overhead for single application development

#### Option 3: Single Repository with Modular Architecture
- Clear module boundaries within single repo
- Easy migration path to monorepo when needed
- Balance of simplicity and future flexibility

## Decision
We will use **Option 3: Single Repository with Modular Architecture**.

## Rationale

### Advantages
1. **MVP-Friendly**: Faster initial development without workspace complexity
2. **Clear Boundaries**: Well-defined modules that could become packages later
3. **Migration Ready**: Structure designed for easy monorepo extraction
4. **Debugging Simplicity**: All code in one place for easier troubleshooting
5. **Deployment Simplicity**: Single build and deployment pipeline

### Architecture Principles
- **Module Isolation**: Each module exports a clean public API via `index.ts`
- **Dependency Direction**: Modules depend on shared types, not on each other directly
- **Future-Proof**: Structure mirrors potential monorepo package organization
- **Clear Responsibilities**: Each module has a single, well-defined purpose

## Implementation

### Module Structure
```
src/
├── modules/                    # Future monorepo packages
│   ├── music-theory/          # Core music calculations
│   ├── ui-components/         # Reusable UI components  
│   ├── practice-engine/       # Practice logic and modes
│   ├── chord-data/            # Static chord databases
│   └── storage/               # Data persistence layer
├── app/                       # Application-specific code
├── shared/                    # Cross-cutting utilities
└── main.tsx                   # Entry point
```

### Module Boundaries
Each module follows these rules:
- **Public API**: Clean interface exported through `index.ts`
- **Internal Implementation**: Private to the module
- **Type Safety**: Strong TypeScript interfaces between modules
- **No Circular Dependencies**: Clear dependency hierarchy

### Technology Stack
- **React 19**: Latest features and performance optimizations
- **Vite**: Fast development and optimized builds
- **TypeScript**: Type safety across all modules
- **Biome**: Unified linting, formatting, and code quality
- **CSS Modules + PostCSS**: Scoped styling with modern CSS
- **React Context + useReducer**: Built-in state management

## Migration Path

### When to Consider Monorepo Migration
- Multiple applications (mobile, desktop, different instruments)
- Multiple teams working on different modules
- Need for independent deployment cycles
- Publishing modules as standalone packages

### Migration Triggers
- **Team Growth**: >3 developers working on different areas
- **Multi-Platform**: Adding React Native, Electron, or backend
- **Reusability**: Need to share music-theory engine with other projects
- **Independent Releases**: Different release cycles for different modules

### Migration Process
1. Extract modules to separate packages
2. Set up Turbo workspace configuration
3. Update import paths to use package names
4. Configure cross-package dependencies
5. Update build and deployment pipelines

## Consequences

### Positive
- **Fast MVP Development**: No workspace overhead
- **Clear Architecture**: Well-defined module boundaries
- **Easy Debugging**: Single codebase for troubleshooting
- **Future Flexibility**: Easy migration path when needed
- **Team Onboarding**: Simpler structure for new contributors

### Negative
- **Manual Discipline Required**: Need to maintain module boundaries
- **Import Path Length**: Longer relative imports across modules
- **Build Coupling**: All modules build together (could be positive for MVP)

### Risks & Mitigations
- **Risk**: Developers might ignore module boundaries
  - **Mitigation**: ESLint rules, code review guidelines, clear documentation
- **Risk**: Modules become tightly coupled over time
  - **Mitigation**: Regular architecture reviews, interface-first design

## Alternatives Considered

### Rejected: Immediate Monorepo
- **Reason**: Adds complexity without immediate benefit
- **Cost**: Slower initial development, more configuration overhead
- **Benefit**: Would provide cleaner separation but unnecessary for MVP

### Rejected: Traditional React Structure
- **Reason**: Makes future modularization difficult
- **Cost**: Technical debt when scaling
- **Benefit**: Simplest to start but highest refactoring cost later

## Success Metrics
- **Development Velocity**: Time to implement features compared to baseline
- **Code Quality**: Module coupling metrics, dependency analysis
- **Migration Readiness**: Effort required to extract modules when needed
- **Developer Experience**: Onboarding time, debugging efficiency

## Review Date
**Next Review**: 2024-11-04 (3 months)
**Trigger for Earlier Review**: Addition of second application or 3+ team members

---

**Authors**: Development Team  
**Reviewers**: Architecture Team  
**Last Updated**: 2024-08-04