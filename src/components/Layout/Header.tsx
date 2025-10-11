// src/components/Layout/Header.tsx

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Modal } from "@/components/UI/Modal";

export const Header = React.memo(() => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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
      {/* Header ultra-fin avec glassmorphism */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-xl shadow-soft border-b border-gray-100"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo OpenPay */}
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-70 transition-opacity group"
              aria-label="OpenPay - Accueil"
            >
              <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <span className="text-lg font-bold text-black hidden sm:block">
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
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? "text-black"
                      : "text-gray-600 hover:text-black hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                  {isActive(item.path) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full"></span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Badge "by Fox" Desktop */}
            <a
              href="https://github.com/theTigerFox"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 text-xs font-medium text-gray-700 hover:text-black group"
              aria-label="Créé par Fox"
            >
              <span>by</span>
              <span className="font-bold">Fox</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>

            {/* Hamburger Menu Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Ouvrir le menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-black"
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
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
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
                className={`flex items-center w-full px-6 py-4 rounded-2xl text-lg font-semibold transition-all min-h-[60px] ${
                  isActive(item.path)
                    ? "bg-black text-white shadow-medium"
                    : "bg-gray-50 text-gray-900 hover:bg-gray-100 active:scale-98"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Badge "by Fox" Mobile */}
          <a
            href="https://github.com/theTigerFox"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors text-center font-medium text-gray-700 active:scale-98"
          >
            Créé par <span className="font-bold text-black">Fox</span>
          </a>
        </div>
      </Modal>
    </>
  );
});

Header.displayName = "Header";
