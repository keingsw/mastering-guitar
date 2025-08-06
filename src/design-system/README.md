# Guitar Mastery Design System

A comprehensive, accessible design system built specifically for music education applications, with a focus on guitar learning and chord mastery.

## 🚀 Quick Start

```tsx
import { Button, ChordDisplay, FretPosition } from '@/design-system';

function MyGuitarApp() {
  return (
    <div>
      <ChordDisplay chord="Cmaj7" notes={['C', 'E', 'G', 'B']} showNotes />
      <FretPosition note="C" function="root" isHighlighted />
      <Button onClick={() => console.log('Play chord!')}>
        Play Chord
      </Button>
    </div>
  );
}
```

## 📚 Documentation

- **Storybook**: Run `npm run storybook` for interactive component documentation
- **Components**: Each component has comprehensive stories and API documentation
- **Accessibility**: WCAG 2.1 AA compliant with extensive accessibility testing
- **Design Tokens**: Consistent color, typography, and spacing system

## 🧩 Components

### Button
Versatile button component with three variants (primary, secondary, ghost), three sizes, and loading states.

**Features:**
- 🎨 Multiple variants and sizes
- ♿ Full keyboard and screen reader support
- 🔄 Loading states with spinner
- 📱 Touch-friendly (44px+ targets)

### ChordDisplay
Display chord symbols with optional notes and intervals for music education.

**Features:**
- 🎼 Chord symbols with proper music typography
- 📝 Optional notes and intervals display
- 🎯 Three variants (default, highlighted, muted)
- ♿ Semantic markup with ARIA labels

### FretPosition
Interactive fret positions with harmonic function color coding.

**Features:**
- 🎸 Guitar-specific design (88px optimal spacing)
- 🌈 Color-coded harmonic functions (root, third, fifth)
- 🔶 Shape symbols for colorblind accessibility
- 👆 Interactive with hover and focus states

## 🎨 Design Tokens

### Colors
- **Primary**: Warm orange (`#ed7027`) inspired by guitar wood
- **Theory Functions**: Root (red), Third (amber), Fifth (blue)
- **Neutrals**: Comprehensive grayscale palette
- **WCAG AA**: All combinations meet 4.5:1 contrast ratio

### Typography
- **Sans-serif**: Inter - Clean, modern UI font
- **Monospace**: JetBrains Mono - For chord symbols and code
- **Scale**: 12px to 48px with consistent line heights

### Spacing
- **Musical Spacing**: Guitar-optimized dimensions (88px note spacing)
- **Base Unit**: 8px grid system
- **Touch Targets**: Minimum 44px for accessibility

## ♿ Accessibility

### WCAG 2.1 AA Compliance
- ✅ Color contrast ratios exceed 4.5:1
- ✅ Touch targets meet 44px minimum
- ✅ Keyboard navigation for all interactive elements
- ✅ Screen reader support with ARIA labels
- ✅ Focus management with visible indicators

### Colorblind Support
- 🔴 Root function: Red color + ● circle symbol
- 🟡 Third function: Amber color + ◆ diamond symbol
- 🔵 Fifth function: Blue color + ▲ triangle symbol

### Keyboard Navigation
- **Tab**: Navigate between interactive elements
- **Enter/Space**: Activate buttons and interactive components
- **Visual Focus**: Clear focus indicators on all elements

## 🧪 Testing

### Comprehensive Test Coverage
- **145+ Tests**: Unit tests for all components
- **WCAG Compliance**: Automated accessibility validation
- **User Interactions**: Event handling and keyboard navigation
- **Visual Regression**: Storybook visual testing

### Test Commands
```bash
npm test                 # Run all tests
npm run test:coverage    # Generate coverage report
npm run test:ui          # Run tests with UI
npm run storybook        # Launch Storybook documentation
```

## 📁 File Structure

```
src/design-system/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── Button.stories.tsx
│   ├── ChordDisplay/
│   │   ├── ChordDisplay.tsx
│   │   ├── ChordDisplay.test.tsx
│   │   └── ChordDisplay.stories.tsx
│   ├── FretPosition/
│   │   ├── FretPosition.tsx
│   │   ├── FretPosition.test.tsx
│   │   └── FretPosition.stories.tsx
│   └── index.ts
├── tokens.ts              # Design tokens and theme
├── wcag-compliance.test.tsx  # Accessibility validation
├── tokens.stories.tsx     # Design tokens documentation
├── DesignSystem.mdx       # Overview documentation
├── Accessibility.mdx      # Accessibility guide
└── README.md              # This file
```

## 🛠️ Development

### Adding New Components

1. **Test-Driven Development**: Write tests first
   ```bash
   # Create component test file
   touch src/design-system/components/NewComponent/NewComponent.test.tsx
   ```

2. **Implement Component**: Follow existing patterns
   ```tsx
   // Use design tokens
   import { colors, componentTokens } from '../../tokens';
   
   // Include ARIA attributes
   <div
     role="button"
     aria-label="Descriptive label"
     tabIndex={0}
   >
   ```

3. **Create Stories**: Document with Storybook
   ```tsx
   // NewComponent.stories.tsx
   export default {
     title: 'Design System/NewComponent',
     component: NewComponent,
     tags: ['autodocs'],
   };
   ```

### Design System Principles

1. **Consistency**: Use existing design tokens
2. **Accessibility**: Include ARIA labels and keyboard support
3. **Testing**: Comprehensive test coverage
4. **Documentation**: Storybook stories with examples

## 🚢 Deployment

### Storybook Deployment
```bash
npm run build-storybook    # Build static Storybook
# Deploy dist-storybook/ to your hosting service
```

### Component Library
The design system can be extracted into a separate npm package:

```json
{
  "name": "@yourorg/guitar-design-system",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "dependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  }
}
```

## 📈 Performance

- **Bundle Size**: Optimized component exports
- **Tree Shaking**: Import only what you use
- **No Runtime Dependencies**: Pure React components
- **CSS-in-JS**: Scoped styles with no external stylesheets

## 🤝 Contributing

1. **Follow Existing Patterns**: Match established component structure
2. **Test Coverage**: Maintain >90% test coverage
3. **Accessibility**: All components must be WCAG AA compliant
4. **Documentation**: Include Storybook stories and API docs
5. **Performance**: Consider bundle size and runtime performance

## 📄 License

MIT License - Built for education and open source contribution.

---

*Crafted with ❤️ for music education and accessibility*