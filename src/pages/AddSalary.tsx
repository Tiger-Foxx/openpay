// src/pages/AddSalary.tsx

import React, { useState, useMemo } from "react";
import { Button } from "@/components/UI/Button";
import { Card } from "@/components/UI/Card";
import { Salary } from "@/models/salary";
import { addSalary } from "@/services/supabaseService";
import { config } from "@/config";
import { FileText, Building2, Briefcase, MapPin, Globe2, DollarSign, Award, Clock, Wifi } from "lucide-react";
import Lottie from "lottie-react";
import profileAnimation from "@/assets/lotties/Profile Avatar of Young Boy.json";

// Types pour les pays
type Country = {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
};

const countries: Country[] = [
  { code: "CM", name: "Cameroun", flag: "🇨🇲", currency: "FCFA", currencySymbol: "FCFA" },
  { code: "FR", name: "France", flag: "🇫🇷", currency: "EUR", currencySymbol: "€" },
  { code: "OTHER", name: "Autre", flag: "🌍", currency: "EUR", currencySymbol: "€" },
];

export const AddSalary = React.memo(() => {
  const [formData, setFormData] = useState<Partial<Salary>>({
    company: "",
    title: "",
    location: "",
    compensation: undefined,
    level: undefined,
    company_xp: undefined,
    total_xp: undefined,
    country: "Cameroun", // Par défaut Cameroun
    remote: undefined,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculer la devise en fonction du pays sélectionné
  const selectedCountry = useMemo(() => {
    return countries.find(c => c.name === formData.country) || countries[0];
  }, [formData.country]);

  const handleChange = (field: keyof Salary, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!formData.company?.trim()) {
      setError("Le nom de l'entreprise est obligatoire");
      return;
    }
    if (!formData.title?.trim()) {
      setError("Le titre du poste est obligatoire");
      return;
    }
    if (!formData.location?.trim()) {
      setError("La localisation est obligatoire");
      return;
    }
    if (!formData.compensation || formData.compensation <= 0) {
      setError("Le salaire doit être supérieur à 0");
      return;
    }

    if (!config.supabase.enabled) {
      setError(
        "Supabase est désactivé. Impossible d'ajouter un salaire pour le moment."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const newSalary: Omit<Salary, "id"> = {
        company: formData.company.trim(),
        title: formData.title.trim(),
        location: formData.location.trim(),
        compensation: formData.compensation,
        date: new Date().toISOString(),
        level: formData.level || null,
        company_xp: formData.company_xp || null,
        total_xp: formData.total_xp || null,
        country: formData.country || "Cameroun",
        remote: formData.remote || null,
        source: "supabase",
      };

      await addSalary(newSalary);
      setSuccess(true);

      // Reset form
      setFormData({
        company: "",
        title: "",
        location: "",
        compensation: undefined,
        level: undefined,
        company_xp: undefined,
        total_xp: undefined,
        country: "Cameroun",
        remote: undefined,
      });

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("[AddSalary] Erreur:", err);
      setError("Une erreur est survenue lors de l'ajout. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header avec Lottie */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Left: Lottie Animation */}
        <div className="flex justify-center md:block">
          <Lottie
            animationData={profileAnimation}
            loop={true}
            className="w-full max-w-[200px] md:max-w-xs mx-auto drop-shadow-2xl"
          />
        </div>

        {/* Right: Text */}
        <div className="text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
            <FileText className="h-8 w-8 text-gray-900" />
            <h1 className="text-3xl sm:text-4xl font-bold text-black">
              Ajouter mon Salaire
            </h1>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Contribuez à la transparence salariale en ajoutant votre salaire de
            manière <strong>anonyme</strong>. Vos données aideront la communauté
            tech (principalement dev pour le moment).
          </p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="px-6 py-4 bg-green-50 border border-green-200 rounded-xl text-green-800 animate-slide-up">
          <p className="font-semibold mb-1">✅ Salaire ajouté avec succès !</p>
          <p className="text-sm">
            Merci pour votre contribution à la communauté.
          </p>
        </div>
      )}

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Entreprise */}
          <div>
            <label
              htmlFor="company"
              className="block text-sm font-semibold text-black mb-2 flex items-center gap-2"
            >
              <Building2 className="h-4 w-4" />
              Entreprise <span className="text-red-500">*</span>
            </label>
            <input
              id="company"
              type="text"
              value={formData.company || ""}
              onChange={(e) => handleChange("company", e.target.value)}
              placeholder="Ex: Google, Startup Tech..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 transition-all hover:border-gray-400"
              required
            />
          </div>

          {/* Titre du poste */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-black mb-2 flex items-center gap-2"
            >
              <Briefcase className="h-4 w-4" />
              Titre du Poste <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={formData.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Ex: Développeur Full Stack, DevOps Engineer..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 transition-all hover:border-gray-400"
              required
            />
          </div>

          {/* Localisation */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-semibold text-black mb-2 flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              Localisation <span className="text-red-500">*</span>
            </label>
            <input
              id="location"
              type="text"
              value={formData.location || ""}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="Ex: Douala, Yaoundé, Paris..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 transition-all hover:border-gray-400"
              required
            />
          </div>

          {/* Pays - Version Modernisée */}
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-semibold text-black mb-2 flex items-center gap-2"
            >
              <Globe2 className="h-4 w-4" />
              Pays <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="country"
                value={formData.country || "Cameroun"}
                onChange={(e) => handleChange("country", e.target.value)}
                className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 transition-all appearance-none bg-white cursor-pointer hover:border-gray-400 text-base font-medium"
                style={{ backgroundImage: 'none' }}
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-2xl">
                {selectedCountry.flag}
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              💡 La devise s'adaptera automatiquement selon votre sélection
            </p>
          </div>

          {/* Salaire - Avec devise dynamique */}
          <div>
            <label
              htmlFor="compensation"
              className="block text-sm font-semibold text-black mb-2 flex items-center gap-2"
            >
              <DollarSign className="h-4 w-4" />
              Salaire Annuel Brut ({selectedCountry.currencySymbol}) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="compensation"
                type="number"
                min="0"
                value={formData.compensation || ""}
                onChange={(e) =>
                  handleChange("compensation", parseInt(e.target.value))
                }
                placeholder={selectedCountry.code === "CM" ? "Ex: 12000000" : "Ex: 45000"}
                className="w-full px-4 py-3 pr-20 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 transition-all text-lg font-semibold"
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-100 px-3 py-1 rounded-lg text-sm font-bold text-gray-700 border border-gray-300">
                {selectedCountry.currencySymbol}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {selectedCountry.code === "CM" 
                ? "💼 Montant en Francs CFA (FCFA)" 
                : "💼 Montant en Euros (€)"}
            </p>
          </div>

          {/* Niveau */}
          <div>
            <label
              htmlFor="level"
              className="block text-sm font-semibold text-black mb-2 flex items-center gap-2"
            >
              <Award className="h-4 w-4" />
              Niveau (optionnel)
            </label>
            <div className="relative">
              <select
                id="level"
                value={formData.level || ""}
                onChange={(e) =>
                  handleChange("level", e.target.value || undefined)
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 transition-all appearance-none bg-white cursor-pointer hover:border-gray-400"
              >
                <option value="">-- Sélectionner --</option>
                <option value="Junior">🌱 Junior</option>
                <option value="Mid">💼 Mid</option>
                <option value="Senior">🎯 Senior</option>
                <option value="Lead">👑 Lead</option>
                <option value="Principal">⭐ Principal</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Expérience Entreprise */}
          <div>
            <label
              htmlFor="company_xp"
              className="block text-sm font-semibold text-black mb-2 flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Années d'Expérience dans l'Entreprise (optionnel)
            </label>
            <input
              id="company_xp"
              type="number"
              min="0"
              value={formData.company_xp || ""}
              onChange={(e) =>
                handleChange(
                  "company_xp",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              placeholder="Ex: 2"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 transition-all hover:border-gray-400"
            />
          </div>

          {/* Expérience Totale */}
          <div>
            <label
              htmlFor="total_xp"
              className="block text-sm font-semibold text-black mb-2 flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Années d'Expérience Totale (optionnel)
            </label>
            <input
              id="total_xp"
              type="number"
              min="0"
              value={formData.total_xp || ""}
              onChange={(e) =>
                handleChange(
                  "total_xp",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              placeholder="Ex: 5"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 transition-all hover:border-gray-400"
            />
          </div>

          {/* Remote */}
          <div>
            <label
              htmlFor="remote"
              className="block text-sm font-semibold text-black mb-2 flex items-center gap-2"
            >
              <Wifi className="h-4 w-4" />
              Télétravail (optionnel)
            </label>
            <div className="relative">
              <select
                id="remote"
                value={formData.remote?.variant || ""}
                onChange={(e) => {
                  const variant = e.target.value;
                  if (variant === "") {
                    handleChange("remote", undefined);
                  } else {
                    handleChange("remote", {
                      variant: variant as "none" | "partial" | "full",
                    });
                  }
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 transition-all appearance-none bg-white cursor-pointer hover:border-gray-400"
              >
                <option value="">-- Sélectionner --</option>
                <option value="none">🏢 Présentiel</option>
                <option value="partial">🔄 Hybride</option>
                <option value="full">🏠 100% Remote</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
          >
            Ajouter mon Salaire
          </Button>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 text-center">
            En soumettant ce formulaire, vous acceptez que vos données soient
            ajoutées de manière <strong>anonyme</strong> à la base communautaire
            OpenPay.
          </p>
        </form>
      </Card>
    </div>
  );
});

AddSalary.displayName = "AddSalary";
