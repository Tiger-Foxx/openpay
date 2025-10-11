// src/components/UI/Loading.tsx

import React from "react";
import Lottie from "lottie-react";
import foxLoaderAnimation from "@/assets/lotties/fox-loader.json";

export interface LoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export const Loading = React.memo<LoadingProps>(({ message, size = "md" }) => {
  const sizeStyles = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <Lottie
        animationData={foxLoaderAnimation}
        loop={true}
        className={`${sizeStyles[size]} drop-shadow-lg`}
      />
      {message && (
        <p className="mt-4 text-gray-600 text-center font-medium animate-pulse-slow">
          {message}
        </p>
      )}
    </div>
  );
});

Loading.displayName = "Loading";
