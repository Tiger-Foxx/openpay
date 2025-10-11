// src/components/Layout/Header.tsx

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Modal } from "@/components/UI/Modal";

export const Header = React.memo(() => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Detect scroll for backdrop blur effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Accueil", path: "/" },
    { name: "Trouver mon Métier", path: "/find-my-job" },
    { name: "Ajouter Salaire", path: "/add-salary" },
    { name: "Cameroun", path: "/cameroon" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Header flottant */}
      <header
        className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 ${
          isScrolled
            ? "backdrop-blur-md bg-white/95 shadow-medium"
            : "bg-white shadow-soft"
        } rounded-2xl`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Logo OpenPay */}
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              aria-label="OpenPay - Accueil"
            >
              {/* Placeholder pour logo - remplacer par <img> ou <svg> plus tard */}
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <span className="text-xl font-bold text-black hidden sm:block">
                OpenPay
              </span>
            </Link>

            {/* Navigation Desktop */}
            <nav
              className="hidden md:flex items-center gap-1"
              role="navigation"
            >
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-black"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Badge "by Fox" Desktop */}
            <a
              href="https://github.com/theTigerFox"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700"
              aria-label="Créé par Fox"
            >
              <span>by</span>
              <span className="font-bold text-black">Fox</span>
            </a>

            {/* Hamburger Menu Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Ouvrir le menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Modal */}
      <Modal
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        size="full"
        showCloseButton={false}
      >
        <div className="min-h-screen bg-white p-6 flex flex-col">
          {/* Header Modal */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <span className="text-xl font-bold text-black">OpenPay</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Fermer le menu"
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
          </div>

          {/* Navigation Mobile */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center w-full px-6 py-4 rounded-xl text-lg font-semibold transition-all min-h-[60px] ${
                  isActive(item.path)
                    ? "bg-black text-white"
                    : "bg-gray-50 text-gray-900 hover:bg-gray-100 active:scale-98"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Badge "by Fox" Mobile */}
          <a
            href="https://github.com/Tiger-Foxx"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 w-full px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-center font-medium text-gray-700 active:scale-98"
          >
            Créé par <span className="font-bold text-black">Fox</span>
          </a>
        </div>
      </Modal>
    </>
  );
});

Header.displayName = "Header";
