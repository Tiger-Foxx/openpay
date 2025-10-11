// src/components/UI/Card.tsx

import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  noPadding?: boolean;
}

export const Card = React.memo<CardProps>(
  ({
    hover = false,
    noPadding = false,
    children,
    className = "",
    ...props
  }) => {
    const baseStyles =
      "bg-white rounded-xl border border-gray-100 transition-all duration-200";
    const shadowStyles = "shadow-soft";
    const hoverStyles = hover
      ? "hover:shadow-medium hover:-translate-y-1 cursor-pointer"
      : "";
    const paddingStyles = noPadding ? "" : "p-6 sm:p-8";

    return (
      <div
        className={`${baseStyles} ${shadowStyles} ${hoverStyles} ${paddingStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
