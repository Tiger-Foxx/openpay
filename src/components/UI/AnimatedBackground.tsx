// src/components/UI/AnimatedBackground.tsx

import React from "react";

export const AnimatedBackground = React.memo(() => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Gradients mouvants améliorés */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-400/25 via-pink-400/25 to-transparent rounded-full blur-3xl animate-float"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-tl from-blue-400/25 via-cyan-400/25 to-transparent rounded-full blur-3xl animate-float-delayed"
        style={{ animationDelay: "1.5s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-br from-green-400/15 via-emerald-400/15 to-transparent rounded-full blur-3xl animate-float"
        style={{ animationDelay: "3s" }}
      ></div>

      {/* Particules flottantes */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
});

AnimatedBackground.displayName = "AnimatedBackground";
