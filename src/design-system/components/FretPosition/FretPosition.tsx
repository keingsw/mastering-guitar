import React from 'react';
import { colors, componentTokens, musicalSpacing } from '../../tokens';
import { 
  NoteName, 
  HarmonicFunction, 
  ComponentSize, 
  isValidNoteName, 
  MusicValidationErrors 
} from '../../types/music';

export interface FretPositionProps {
  note: NoteName;
  function?: HarmonicFunction;
  isHighlighted?: boolean;
  isDisabled?: boolean;
  size?: ComponentSize;
  showNote?: boolean;
  showFunction?: boolean;
  onClick?: () => void;
  onHover?: (isHovering: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const FretPosition: React.FC<FretPositionProps> = ({
  note,
  function: noteFunction,
  isHighlighted = false,
  isDisabled = false,
  size = 'md',
  showNote = true,
  showFunction = false,
  onClick,
  onHover,
  className,
  style,
}) => {
  // Runtime validation for development safety
  if (process.env.NODE_ENV === 'development') {
    if (!isValidNoteName(note)) {
      console.warn(MusicValidationErrors.INVALID_NOTE(note));
      return (
        <div 
          style={{ 
            padding: '8px', 
            backgroundColor: '#fecaca', 
            border: '1px solid #dc2626', 
            borderRadius: '4px',
            color: '#991b1b',
            fontSize: '12px'
          }}
        >
          Invalid note: {note}
        </div>
      );
    }
  }
  const sizeStyles = {
    sm: {
      width: '32px',
      height: '32px',
      fontSize: '0.75rem',
    },
    md: {
      width: musicalSpacing.note.size, // 88px
      height: musicalSpacing.note.size,
      fontSize: '0.875rem',
    },
    lg: {
      width: '48px',
      height: '48px',
      fontSize: '1rem',
    },
  };

  const functionColors = {
    root: {
      background: colors.theory.root.DEFAULT, // rgb(239, 68, 68)
      backgroundLight: colors.theory.root.light, // rgb(254, 202, 202)
      text: colors.text.inverse, // rgb(255, 255, 255)
      border: colors.theory.root.dark,
    },
    third: {
      background: colors.theory.third.DEFAULT, // rgb(245, 158, 11)
      backgroundLight: colors.theory.third.light, // rgb(254, 243, 199)
      text: colors.text.inverse, // rgb(255, 255, 255)
      border: colors.theory.third.dark,
    },
    fifth: {
      background: colors.theory.fifth.DEFAULT, // rgb(59, 130, 246)
      backgroundLight: colors.theory.fifth.light, // rgb(219, 234, 254)
      text: colors.text.inverse, // rgb(255, 255, 255)
      border: colors.theory.fifth.dark,
    },
    default: {
      background: colors.neutral[100], // rgb(245, 245, 244)
      backgroundLight: colors.neutral[50],
      text: colors.text.primary, // rgb(28, 25, 23)
      border: colors.neutral[300],
    },
  };

  const currentColors = functionColors[noteFunction || 'default'];

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    border: '2px solid',
    cursor: onClick && !isDisabled ? 'pointer' : 'default',
    transition: `all ${componentTokens.animation.duration.fast} ${componentTokens.animation.easing.easeOut}`,
    position: 'relative',
    userSelect: 'none',
    ...sizeStyles[size],
    backgroundColor: isHighlighted ? currentColors.background : currentColors.backgroundLight,
    borderColor: isHighlighted ? currentColors.border : currentColors.background,
    color: isHighlighted ? currentColors.text : (noteFunction ? colors.text.primary : currentColors.text),
    opacity: isDisabled ? componentTokens.opacity[40] : componentTokens.opacity[100],
    boxShadow: isHighlighted ? componentTokens.shadows.note : 'none', // 0 2px 4px rgba(0, 0, 0, 0.2)
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDisabled && onClick) {
      e.currentTarget.style.transform = 'scale(1.1)';
      e.currentTarget.style.backgroundColor = currentColors.background;
      e.currentTarget.style.borderColor = currentColors.border;
      e.currentTarget.style.color = currentColors.text;
      e.currentTarget.style.boxShadow = componentTokens.shadows.md;
      e.currentTarget.style.zIndex = componentTokens.zIndex.docked.toString(); // 10
    }
    onHover?.(true);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDisabled) {
      e.currentTarget.style.transform = '';
      e.currentTarget.style.backgroundColor = isHighlighted ? currentColors.background : currentColors.backgroundLight;
      e.currentTarget.style.borderColor = isHighlighted ? currentColors.border : currentColors.background;
      e.currentTarget.style.color = isHighlighted ? currentColors.text : (noteFunction ? colors.text.primary : currentColors.text);
      e.currentTarget.style.boxShadow = isHighlighted ? componentTokens.shadows.note : 'none';
      e.currentTarget.style.zIndex = '';
    }
    onHover?.(false);
  };

  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isDisabled && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!isDisabled) {
      e.currentTarget.style.outline = '2px solid rgb(237, 112, 39)'; // colors.interactive.focus
      e.currentTarget.style.outlineOffset = '2px';
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!isDisabled) {
      e.currentTarget.style.outline = '';
      e.currentTarget.style.outlineOffset = '';
    }
  };

  // Accessibility shape patterns for colorblind users
  const shapeSymbol = {
    root: '●',
    third: '◆',
    fifth: '▲',
  };

  return (
    <div
      className={className}
      style={{
        ...baseStyles,
        ...style,
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      role={onClick && !isDisabled ? 'button' : undefined}
      tabIndex={onClick && !isDisabled ? 0 : -1}
      aria-label={`${note}${noteFunction ? ` ${noteFunction}` : ''} note position`}
      aria-pressed={isHighlighted}
      aria-disabled={isDisabled}
    >
      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'inherit',
          fontWeight: 'bold',
          lineHeight: 1,
        }}
      >
        {showNote && note}
        {showFunction && noteFunction && (
          <span
            style={{
              fontSize: '0.6em',
              opacity: componentTokens.opacity[80],
              marginTop: '1px',
            }}
            aria-hidden="true"
          >
            {shapeSymbol[noteFunction]}
          </span>
        )}
      </span>
      
      {/* Screen reader text */}
      <span
        style={{
          position: 'absolute',
          left: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        {note} note
        {noteFunction && `, ${noteFunction} function`}
        {isHighlighted && ', highlighted'}
        {isDisabled && ', disabled'}
      </span>
    </div>
  );
};