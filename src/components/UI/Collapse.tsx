// src/components/UI/Collapse.tsx

import React, { useState, useRef, useEffect } from "react";

export interface CollapseProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const Collapse = React.memo<CollapseProps>(
  ({ title, children, defaultOpen = false, className = "" }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState(0);

    useEffect(() => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    }, [children]);

    return (
      <div
        className={`border border-gray-200 rounded-xl overflow-hidden ${className}`}
      >
        {/* Header - Touch-friendly 44px min */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black min-h-[44px]"
          aria-expanded={isOpen}
        >
          <span className="font-semibold text-black text-base">{title}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Content avec animation height */}
        <div
          style={{
            height: isOpen ? `${contentHeight}px` : "0px",
          }}
          className="overflow-hidden transition-all duration-300 ease-in-out"
        >
          <div ref={contentRef} className="px-6 py-4 bg-gray-50 text-gray-700">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

Collapse.displayName = "Collapse";
