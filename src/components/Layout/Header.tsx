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
    { name: "Ajouter mon Salaire", path: "/add-salary" },
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
              className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
              aria-label="OpenPay - Accueil"
            >
              <img
                src="/logo-pay.png"
                alt="OpenPay"
                className="h-9 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
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

            {/* Avatar Fox Desktop */}
            <a
              href="https://github.com/Tiger-Foxx"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 hover:opacity-80 transition-opacity group"
              aria-label="Créé par Fox"
            >
              <img
                src="https://avatars.githubusercontent.com/u/118616410?v=4"
                alt="Fox"
                className="w-9 h-9 rounded-full border-2 border-gray-200 group-hover:border-black transition-all duration-300 group-hover:scale-110"
              />
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
        <div className="flex flex-col h-full max-h-screen py-6">
          {/* Header Modal */}
          <div className="flex items-center justify-between px-6 mb-6 shrink-0">
            <div className="flex items-center gap-2">
              <img
                src="/logo-pay.png"
                alt="OpenPay"
                className="h-10 w-auto object-contain"
              />
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
          <nav className="px-6 space-y-2 flex-shrink-0">
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

          {/* Badge "by Fox" Mobile - Fixed at bottom */}
          <div className="mt-auto px-6 pt-6 shrink-0">
            <a
              href="https://github.com/Tiger-Foxx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors font-medium text-gray-700 active:scale-98 min-h-[60px]"
            >
              Créé par <span className="font-bold text-black ml-1">Fox</span>
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
});

Header.displayName = "Header";
