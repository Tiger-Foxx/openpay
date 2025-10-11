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

      {/* Main Content — padding-top ajusté pour header de 56px */}
      <main className="flex-1 pt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">{children}</div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
});

Layout.displayName = "Layout";
