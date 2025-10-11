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
      {/* Header flottant */}
      <Header />

      {/* Main Content - padding-top pour compenser header fixed */}
      <main className="flex-1 pt-24 sm:pt-28 pb-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
});

Layout.displayName = "Layout";
