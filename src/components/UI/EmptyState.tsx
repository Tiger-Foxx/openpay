// src/components/UI/EmptyState.tsx

import React from "react";
import Lottie from "lottie-react";
import searchAnimation from "@/assets/lotties/Man looking through binoculars.json";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  animation?: "search" | "none";
}

export const EmptyState = React.memo<EmptyStateProps>(
  ({ title, description, action, animation = "search" }) => {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in">
        {/* Animation */}
        {animation === "search" && (
          <div className="w-48 h-48 mb-6">
            <Lottie
              animationData={searchAnimation}
              loop={true}
              className="w-full h-full drop-shadow-xl"
            />
          </div>
        )}

        {/* Content */}
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        {description && (
          <p className="text-gray-600 max-w-md mb-6 leading-relaxed">
            {description}
          </p>
        )}

        {/* Action */}
        {action && (
          <button
            onClick={action.onClick}
            className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 hover:shadow-medium transition-all duration-300 active:scale-95"
          >
            {action.label}
          </button>
        )}
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";
