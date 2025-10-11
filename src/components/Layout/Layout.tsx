// src/components/Layout/Layout.tsx

import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = React.memo<LayoutProps>(({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header ultra-fin */}
      <Header />

      {/* Main Content — padding-top ajusté pour header + espace */}
      <main className="flex-1 pt-20 md:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">{children}</div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
});

Layout.displayName = "Layout";
