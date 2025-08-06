# ADR-0002: Audio Playback Strategy

**Date:** 2025-08-06  
**Status:** Accepted  
**Deciders:** Development Team, UX Designer  

## Context

The application requires audio feedback for triad recognition and learning exercises. Multiple playback strategies were considered to support the educational goals of the application.

## Decision

We will implement a **sequential-then-harmony audio playback system** using real guitar samples.

### Playback Sequence:
1. **Individual Notes**: Root → 3rd → 5th (250ms intervals)
2. **Harmony**: All three notes played simultaneously  
3. **Loop Option**: Continuous repeat for memorization

### Audio Technology:
- **Real Guitar Samples**: High-quality acoustic guitar recordings
- **Web Audio API**: Low-latency playback system
- **Progressive Loading**: Optimized for mobile bandwidth
- **Fallback Strategy**: Synthesized tones if samples fail to load

## Rationale

### Why Sequential-Then-Harmony:
- **Educational Value**: Helps students identify individual chord tones
- **Theory Emphasis**: Supports analytical learning over pure recognition
- **User Preference**: Explicitly requested over individual note clicking
- **Accessibility**: Clear audio progression aids learning disabilities

### Why Real Guitar Samples:
- **Authenticity**: Matches the actual instrument being learned
- **Engagement**: More motivating than synthesized sounds
- **Quality**: Professional sample libraries available
- **User Preference**: Explicitly preferred over synthesized tones

## Alternatives Considered

1. **Click-to-Play Individual Notes**
   - Rejected: User preferred automatic sequential playback
   - Would require more complex interaction patterns

2. **Drag-to-Strum Interface**  
   - Rejected: Deemed unnecessary complexity
   - Sequential playback covers the use case

3. **Synthesized Audio Only**
   - Rejected: Lower engagement and authenticity
   - Kept as fallback for technical reliability

4. **Simultaneous Chord Playback Only**
   - Rejected: Doesn't support individual tone recognition
   - Less educational value for theory learning

## Consequences

### Positive:
- Clear educational progression from parts to whole
- High-quality, authentic audio experience  
- Supports theory-first learning approach
- Consistent with mobile-first, touch-friendly design

### Negative:
- Larger bundle size due to audio samples
- Network dependency for initial sample loading
- Potential latency issues on slower devices
- Additional complexity in audio management

### Mitigation Strategies:
- Progressive loading with compression
- Local caching after first load
- Fallback to synthesized audio
- Performance monitoring and optimization

## Implementation Notes

- Use Web Audio API for precise timing control
- Implement audio sprite technique for efficiency
- Add visual synchronization with audio playback
- Include volume controls and mute options
- Consider offline functionality with cached samples

## Success Metrics

- Audio latency < 100ms from user action
- Sample loading time < 2 seconds on 3G
- 95% successful playback across target devices
- User engagement metrics (session duration, repeat usage)