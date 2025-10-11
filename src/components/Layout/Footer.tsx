// src/components/Layout/Footer.tsx

import React from "react";
import { Link } from "react-router-dom";

export const Footer = React.memo(() => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "Trouver mon Métier", path: "/find-my-job" },
    { name: "Ajouter Salaire", path: "/add-salary" },
    { name: "Cameroun", path: "/cameroon" },
  ];

  const externalLinks = [
    { name: "GitHub OpenPay", url: "https://github.com/Tiger-Foxx/openpay" },
    { name: "Salaires.dev", url: "https://salaires.dev" },
    { name: "Roadmap.sh", url: "https://roadmap.sh" },
    { name: "Fox", url: "https://github.com/Tiger-Foxx" },
  ];

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {/* Colonne 1 : Logo + Tagline */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo-pay.png"
                alt="OpenPay"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Salaires Tech en toute transparence
            </p>
            <a
              href="https://github.com/Tiger-Foxx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black transition-colors group"
            >
              <span>Créé par</span>
              <img
                src="https://avatars.githubusercontent.com/u/118616410?v=4"
                alt="Fox Avatar"
                className="w-6 h-6 rounded-full border-2 border-gray-200 group-hover:border-black transition-colors"
              />
              <span className="font-bold">Fox</span>
            </a>
          </div>

          {/* Colonne 2 : Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-black uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-black transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 : Liens Externes */}
          <div>
            <h3 className="text-sm font-semibold text-black uppercase tracking-wider mb-4">
              Liens Utiles
            </h3>
            <ul className="space-y-3">
              {externalLinks.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-black transition-colors text-sm flex items-center gap-2"
                  >
                    {link.name}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
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
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-200 my-8 sm:my-12" />

        {/* Disclaimer + Copyright */}
        <div className="space-y-4">
          {/* Disclaimer */}
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed text-center">
              <strong className="text-gray-900">Avertissement :</strong> Les
              salaires affichés sur OpenPay sont{" "}
              <span className="font-semibold">
                auto-déclarés par la communauté
              </span>
              . Nous ne pouvons garantir leur exactitude absolue. Les données
              proviennent majoritairement de{" "}
              <a
                href="https://salaires.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-black"
              >
                salaires.dev
              </a>{" "}
              (France). La communauté camerounaise grandit — participez en
              ajoutant votre salaire !
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center text-xs text-gray-500">
            <p>
              © {currentYear} OpenPay — Projet open-source par{" "}
              <a
                href="https://github.com/Tiger-Foxx"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-black hover:underline"
              >
                Fox
              </a>
            </p>
            <p className="mt-1">
              Données sous licence{" "}
              <a
                href="https://github.com/Tiger-Foxx/openpay"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-black"
              >
                MIT
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
