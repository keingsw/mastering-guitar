import React, { forwardRef } from 'react';
import { colors, textStyles, componentSpacing, componentTokens } from '../../tokens';
import { ComponentSize } from '../../types/music';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'musical';
  size?: ComponentSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    leftIcon, 
    rightIcon, 
    fullWidth = false,
    disabled,
    className,
    style,
    ...props 
  }, ref) => {
    const variantStyles = {
      primary: {
        backgroundColor: colors.primary[500],
        color: colors.text.inverse,
        border: 'none',
      },
      secondary: {
        backgroundColor: colors.neutral[100],
        color: colors.text.primary,
        border: `1px solid ${colors.neutral[300]}`,
      },
      outline: {
        backgroundColor: 'transparent',
        color: colors.primary[500],
        border: `1px solid ${colors.primary[500]}`,
      },
      ghost: {
        backgroundColor: 'transparent',
        color: colors.primary[500],
        border: 'none',
      },
      musical: {
        backgroundColor: colors.theory.third.DEFAULT,
        color: colors.text.inverse,
        border: 'none',
        boxShadow: componentTokens.shadows.note,
      },
    };

    const sizeStyles = {
      sm: {
        fontSize: textStyles.buttonSmall.fontSize,
        paddingLeft: componentSpacing.button.paddingX.sm,
        paddingRight: componentSpacing.button.paddingX.sm,
        paddingTop: componentSpacing.button.paddingY.sm,
        paddingBottom: componentSpacing.button.paddingY.sm,
        minHeight: '36px',
      },
      md: {
        fontSize: textStyles.button.fontSize,
        paddingLeft: componentSpacing.button.paddingX.md,
        paddingRight: componentSpacing.button.paddingX.md,
        paddingTop: componentSpacing.button.paddingY.md,
        paddingBottom: componentSpacing.button.paddingY.md,
        minHeight: '44px',
      },
      lg: {
        fontSize: textStyles.buttonLarge.fontSize,
        paddingLeft: componentSpacing.button.paddingX.lg,
        paddingRight: componentSpacing.button.paddingX.lg,
        paddingTop: componentSpacing.button.paddingY.lg,
        paddingBottom: componentSpacing.button.paddingY.lg,
        minHeight: '52px',
      },
    };

    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: componentSpacing.button.gap,
      cursor: disabled || isLoading ? 'default' : 'pointer',
      transition: `all ${componentTokens.animation.duration.fast} ${componentTokens.animation.easing.easeInOut}`,
      textDecoration: 'none',
      position: 'relative',
      width: fullWidth ? '100%' : 'auto',
      opacity: disabled ? componentTokens.opacity[50] : componentTokens.opacity[100],
      outline: 'none',
      fontFamily: textStyles.button.fontFamily,
      fontWeight: textStyles.button.fontWeight,
      borderRadius: componentTokens.borderRadius.lg,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };

    const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
      e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.interactive.focus}, 0 0 0 4px ${colors.primary[200]}`;
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
      e.currentTarget.style.boxShadow = variantStyles[variant].boxShadow || '';
      props.onBlur?.(e);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (variant === 'musical' && !disabled && !isLoading) {
        e.currentTarget.style.transform = 'translateY(-1px)';
      }
      props.onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (variant === 'musical') {
        e.currentTarget.style.transform = '';
      }
      props.onMouseLeave?.(e);
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={className}
        style={{
          ...baseStyles,
          ...style,
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-disabled={disabled || isLoading}
        aria-describedby={isLoading ? `${props.id}-loading` : undefined}
        {...props}
      >
        {isLoading ? (
          <>
            <span 
              style={{
                width: '16px',
                height: '16px',
                border: '2px solid transparent',
                borderTop: '2px solid currentColor',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
              aria-hidden="true"
            />
            <span id={`${props.id}-loading`} style={{ position: 'absolute', left: '-9999px' }}>
              Loading...
            </span>
          </>
        ) : (
          <>
            {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
            {children}
            {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';