// src/components/UI/Button.tsx

import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.memo<ButtonProps>(
  ({
    variant = "primary",
    size = "md",
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    children,
    disabled,
    className = "",
    ...props
  }) => {
    // Variantes de style
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

    const variantStyles = {
      primary: "bg-black text-white hover:bg-gray-900 focus:ring-black",
      secondary:
        "bg-white text-black border-2 border-black hover:bg-black hover:text-white focus:ring-black",
      ghost: "bg-transparent text-black hover:bg-gray-100 focus:ring-gray-400",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };

    const sizeStyles = {
      sm: "px-4 py-2 text-sm rounded-lg min-h-[36px]",
      md: "px-6 py-3 text-base rounded-lg min-h-[44px]",
      lg: "px-8 py-4 text-lg rounded-xl min-h-[52px]",
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <button
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Chargement...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2 -ml-1">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2 -mr-1">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
