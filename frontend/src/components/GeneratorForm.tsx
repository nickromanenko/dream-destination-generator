"use client";

import { useState } from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import type { GenerateRequest, TravelStyle, Season, BudgetTier } from "@/lib/types";

const TRAVEL_STYLES: { value: TravelStyle; label: string }[] = [
  { value: "adventure", label: "Adventure" },
  { value: "relaxation", label: "Relaxation" },
  { value: "cultural", label: "Cultural" },
  { value: "romantic", label: "Romantic" },
  { value: "family", label: "Family" },
  { value: "solo-backpacking", label: "Solo Backpacking" },
];

const SEASONS: { value: Season; label: string }[] = [
  { value: "spring", label: "Spring" },
  { value: "summer", label: "Summer" },
  { value: "autumn", label: "Autumn" },
  { value: "winter", label: "Winter" },
];

const BUDGET_TIERS: { value: BudgetTier; label: string }[] = [
  { value: "budget", label: "Budget" },
  { value: "mid-range", label: "Mid-Range" },
  { value: "luxury", label: "Luxury" },
];

interface GeneratorFormProps {
  onSubmit: (request: GenerateRequest) => void;
  isGenerating: boolean;
}

export function GeneratorForm({ onSubmit, isGenerating }: GeneratorFormProps) {
  const [vibe, setVibe] = useState("");
  const [travelStyle, setTravelStyle] = useState<TravelStyle | "">("");
  const [season, setSeason] = useState<Season | "">("");
  const [budgetTier, setBudgetTier] = useState<BudgetTier | "">("");

  const isValid =
    vibe.length >= 10 && travelStyle !== "" && season !== "" && budgetTier !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isGenerating) return;
    onSubmit({
      vibe,
      travelStyle: travelStyle as TravelStyle,
      season: season as Season,
      budgetTier: budgetTier as BudgetTier,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="vibe"
          className="block text-sm font-medium text-foreground/80 mb-2"
        >
          Describe your dream travel vibe
        </label>
        <textarea
          id="vibe"
          value={vibe}
          onChange={(e) => setVibe(e.target.value)}
          placeholder="I want to wander through ancient cobblestone streets, sip coffee at hidden cafés, and watch the sunset over terracotta rooftops..."
          rows={4}
          maxLength={500}
          className="w-full px-4 py-3 rounded-xl border border-card-border bg-card text-foreground placeholder:text-muted resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
        />
        <div className="mt-1 text-xs text-muted text-right">
          {vibe.length}/500
          {vibe.length > 0 && vibe.length < 10 && (
            <span className="text-red-500 ml-2">
              At least 10 characters needed
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SelectField
          id="travelStyle"
          label="Travel Style"
          value={travelStyle}
          onChange={(v) => setTravelStyle(v as TravelStyle)}
          options={TRAVEL_STYLES}
          placeholder="Choose style..."
        />
        <SelectField
          id="season"
          label="Season"
          value={season}
          onChange={(v) => setSeason(v as Season)}
          options={SEASONS}
          placeholder="Choose season..."
        />
        <SelectField
          id="budgetTier"
          label="Budget"
          value={budgetTier}
          onChange={(v) => setBudgetTier(v as BudgetTier)}
          options={BUDGET_TIERS}
          placeholder="Choose budget..."
        />
      </div>

      <button
        type="submit"
        disabled={!isValid || isGenerating}
        className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-accent hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
      >
        <Sparkles className="w-5 h-5" />
        {isGenerating ? "Generating..." : "Generate My Dream Destination"}
      </button>
    </form>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-foreground/80 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-card-border bg-card text-foreground appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
      </div>
    </div>
  );
}
