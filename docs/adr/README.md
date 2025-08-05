# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records for the Guitar Triads Mastery application.

## What are ADRs?

Architecture Decision Records (ADRs) are documents that capture important architectural decisions made during the development of a project, along with their context and consequences.

## ADR Format

Each ADR follows this structure:
- **Status**: Proposed, Accepted, Deprecated, Superseded
- **Context**: The situation that led to the decision
- **Decision**: What was decided
- **Rationale**: Why this decision was made
- **Consequences**: What becomes easier or more difficult

## Current ADRs

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [001](./001-single-repo-modular-architecture.md) | Single Repository with Modular Architecture | Accepted | 2024-08-04 |

## Creating New ADRs

When making significant architectural decisions:

1. Create a new ADR file: `XXX-brief-title.md`
2. Use the next sequential number
3. Follow the established format
4. Update this README with the new entry
5. Link to related ADRs if applicable

## ADR Lifecycle

- **Proposed**: Under discussion
- **Accepted**: Decision made and implemented
- **Deprecated**: No longer recommended
- **Superseded**: Replaced by a newer ADR