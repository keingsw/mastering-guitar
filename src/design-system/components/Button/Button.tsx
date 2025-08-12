import type React from "react";
import { forwardRef } from "react";
import { colors } from "../../tokens";
import type { ComponentSize } from "../../types/music";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "musical";
  size?: ComponentSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const variantStyles = {
      primary: {
        backgroundColor: colors.primary[500],
        color: colors.text.inverse,
        border: "none",
        boxShadow: "none",
      },
      secondary: {
        backgroundColor: colors.neutral[100],
        color: colors.text.primary,
        border: `1px solid ${colors.neutral[300]}`,
        boxShadow: "none",
      },
      outline: {
        backgroundColor: "transparent",
        color: colors.primary[500],
        border: `1px solid ${colors.primary[500]}`,
        boxShadow: "none",
      },
      ghost: {
        backgroundColor: "transparent",
        color: colors.primary[500],
        border: "none",
        boxShadow: "none",
      },
      musical: {
        backgroundColor: colors.theory.third.DEFAULT,
        color: colors.text.inverse,
        border: "none",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      },
    };

    const sizeStyles = {
      sm: {
        fontSize: "12px",
        paddingLeft: "8px",
        paddingRight: "8px",
        paddingTop: "4px",
        paddingBottom: "4px",
        minHeight: "28px",
      },
      md: {
        fontSize: "14px",
        paddingLeft: "12px",
        paddingRight: "12px",
        paddingTop: "6px",
        paddingBottom: "6px",
        minHeight: "32px",
      },
      lg: {
        fontSize: "14px",
        paddingLeft: "16px",
        paddingRight: "16px",
        paddingTop: "8px",
        paddingBottom: "8px",
        minHeight: "40px",
      },
    };

    const baseStyles: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      cursor: disabled || isLoading ? "not-allowed" : "pointer",
      transition: "all 0.15s ease",
      textDecoration: "none",
      position: "relative",
      width: fullWidth ? "100%" : "auto",
      opacity: disabled ? 0.6 : 1,
      outline: "none",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',
      fontWeight: 400,
      borderRadius: "4px",
      ...sizeStyles[size],
      ...variantStyles[variant],
    };

    const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
      e.currentTarget.style.boxShadow = "0 0 0 2px rgba(35, 131, 226, 0.3)";
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
      e.currentTarget.style.boxShadow = variantStyles[variant].boxShadow;
      props.onBlur?.(e);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !isLoading) {
        if (variant === "primary") {
          e.currentTarget.style.backgroundColor = colors.primary[600];
        } else if (variant === "secondary") {
          e.currentTarget.style.backgroundColor = "rgba(55, 53, 47, 0.06)";
          e.currentTarget.style.borderColor = "rgba(55, 53, 47, 0.24)";
        } else if (variant === "ghost") {
          e.currentTarget.style.backgroundColor = "rgba(55, 53, 47, 0.06)";
        }
      }
      props.onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !isLoading) {
        // Reset to original variant styles
        Object.assign(e.currentTarget.style, variantStyles[variant]);
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
                width: "16px",
                height: "16px",
                border: "2px solid transparent",
                borderTop: "2px solid currentColor",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
              aria-hidden="true"
            />
            <span id={`${props.id}-loading`} style={{ position: "absolute", left: "-9999px" }}>
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
  },
);

Button.displayName = "Button";
