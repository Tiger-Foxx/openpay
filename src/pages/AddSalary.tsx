// src/pages/AddSalary.tsx

import React, { useState } from "react";
import { Button } from "@/components/UI/Button";
import { Card } from "@/components/UI/Card";
import { Salary } from "@/models/salary";
import { addSalary } from "@/services/supabaseService";
import { config } from "@/config";

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
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-black mb-4">
          Ajouter mon Salaire
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Contribuez à la transparence salariale en ajoutant votre salaire de
          manière <strong>anonyme</strong>. Vos données aideront la communauté
          tech (principalement dev pour le moment).
        </p>
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
              className="block text-sm font-semibold text-black mb-2"
            >
              Entreprise <span className="text-red-500">*</span>
            </label>
            <input
              id="company"
              type="text"
              value={formData.company || ""}
              onChange={(e) => handleChange("company", e.target.value)}
              placeholder="Ex: Google, Startup Tech..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
              required
            />
          </div>

          {/* Titre du poste */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-black mb-2"
            >
              Titre du Poste <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={formData.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Ex: Développeur Full Stack, DevOps Engineer..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
              required
            />
          </div>

          {/* Localisation */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-semibold text-black mb-2"
            >
              Localisation <span className="text-red-500">*</span>
            </label>
            <input
              id="location"
              type="text"
              value={formData.location || ""}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="Ex: Douala, Yaoundé, Paris..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
              required
            />
          </div>

          {/* Pays */}
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-semibold text-black mb-2"
            >
              Pays <span className="text-red-500">*</span>
            </label>
            <select
              id="country"
              value={formData.country || "Cameroun"}
              onChange={(e) => handleChange("country", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
            >
              <option value="Cameroun">Cameroun</option>
              <option value="France">France</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          {/* Salaire */}
          <div>
            <label
              htmlFor="compensation"
              className="block text-sm font-semibold text-black mb-2"
            >
              Salaire Annuel Brut (€) <span className="text-red-500">*</span>
            </label>
            <input
              id="compensation"
              type="number"
              min="0"
              value={formData.compensation || ""}
              onChange={(e) =>
                handleChange("compensation", parseInt(e.target.value))
              }
              placeholder="Ex: 45000"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
              required
            />
          </div>

          {/* Niveau */}
          <div>
            <label
              htmlFor="level"
              className="block text-sm font-semibold text-black mb-2"
            >
              Niveau (optionnel)
            </label>
            <select
              id="level"
              value={formData.level || ""}
              onChange={(e) =>
                handleChange("level", e.target.value || undefined)
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
            >
              <option value="">-- Sélectionner --</option>
              <option value="Junior">Junior</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead</option>
              <option value="Principal">Principal</option>
            </select>
          </div>

          {/* Expérience Entreprise */}
          <div>
            <label
              htmlFor="company_xp"
              className="block text-sm font-semibold text-black mb-2"
            >
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
            />
          </div>

          {/* Expérience Totale */}
          <div>
            <label
              htmlFor="total_xp"
              className="block text-sm font-semibold text-black mb-2"
            >
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
            />
          </div>

          {/* Remote */}
          <div>
            <label
              htmlFor="remote"
              className="block text-sm font-semibold text-black mb-2"
            >
              Télétravail (optionnel)
            </label>
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
            >
              <option value="">-- Sélectionner --</option>
              <option value="none">Présentiel</option>
              <option value="partial">Hybride</option>
              <option value="full">100% Remote</option>
            </select>
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
