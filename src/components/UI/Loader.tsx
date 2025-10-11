// src/components/UI/Loader.tsx

import React from "react";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Spinner = React.memo<SpinnerProps>(
  ({ size = "md", className = "" }) => {
    const sizeMap = {
      sm: "h-4 w-4",
      md: "h-8 w-8",
      lg: "h-12 w-12",
    };

    return (
      <svg
        className={`animate-spin ${sizeMap[size]} ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label="Chargement en cours"
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
    );
  }
);

Spinner.displayName = "Spinner";

// Skeleton pour pré-chargement
export interface SkeletonProps {
  width?: string;
  height?: string;
  circle?: boolean;
  className?: string;
}

export const Skeleton = React.memo<SkeletonProps>(
  ({ width = "w-full", height = "h-4", circle = false, className = "" }) => {
    const baseStyles = "animate-pulse bg-gray-200";
    const shapeStyles = circle ? "rounded-full" : "rounded-lg";

    return (
      <div
        className={`${baseStyles} ${shapeStyles} ${width} ${height} ${className}`}
        aria-hidden="true"
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

// Loader full-screen avec option Lottie
export interface LoaderProps {
  text?: string;
  lottie?: React.ReactNode; // Pour intégrer Lottie plus tard
}

export const Loader = React.memo<LoaderProps>(
  ({ text = "Chargement...", lottie }) => {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
        {lottie || <Spinner size="lg" className="text-black" />}
        {text && (
          <p className="mt-6 text-base font-medium text-gray-700 animate-pulse">
            {text}
          </p>
        )}
      </div>
    );
  }
);

Loader.displayName = "Loader";
