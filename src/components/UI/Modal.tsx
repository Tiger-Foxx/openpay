// src/components/UI/Modal.tsx

import React, { useEffect } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "full";
  showCloseButton?: boolean;
}

export const Modal = React.memo<ModalProps>(
  ({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
    showCloseButton = true,
  }) => {
    // Gestion de l'escape key
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isOpen) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden"; // Prevent scroll
      }

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeStyles = {
      sm: "max-w-md",
      md: "max-w-2xl",
      lg: "max-w-4xl",
      full: "max-w-full mx-4",
    };

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {/* Backdrop avec blur */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Panel */}
        <div
          className={`relative bg-white rounded-2xl shadow-medium w-full ${sizeStyles[size]} animate-slide-up max-h-[90vh] overflow-hidden flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              {title && (
                <h2
                  id="modal-title"
                  className="text-xl font-semibold text-black"
                >
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 text-gray-500 hover:text-black transition-colors rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
                  aria-label="Fermer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="px-6 py-6 overflow-y-auto flex-1">{children}</div>
        </div>
      </div>
    );
  }
);

Modal.displayName = "Modal";
