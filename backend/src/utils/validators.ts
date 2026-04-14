import { z } from "zod";

export const travelStyleSchema = z.enum([
  "adventure",
  "relaxation",
  "cultural",
  "romantic",
  "family",
  "solo-backpacking",
]);

export const seasonSchema = z.enum(["spring", "summer", "autumn", "winter"]);

export const budgetTierSchema = z.enum(["budget", "mid-range", "luxury"]);

export const generateRequestSchema = z.object({
  vibe: z.string().min(10).max(500),
  travelStyle: travelStyleSchema,
  season: seasonSchema,
  budgetTier: budgetTierSchema,
});

const destinationDetailsSchema = z.object({
  name: z.string().min(1),
  country: z.string().min(1),
  continent: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  bestFor: z.array(z.string()).min(1),
});

const weatherSchema = z.object({
  temperature: z.string().min(1),
  conditions: z.string().min(1),
  packingTip: z.string().min(1),
});

const itineraryDaySchema = z.object({
  day: z.number().int().positive(),
  title: z.string().min(1),
  morning: z.string().min(1),
  afternoon: z.string().min(1),
  evening: z.string().min(1),
  estimatedCost: z.string().min(1),
});

const mustTryDishSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceRange: z.string().min(1),
});

const insiderTipsSchema = z.object({
  localPhrase: z.string().min(1),
  phraseTranslation: z.string().min(1),
  phrasePronunciation: z.string().min(1),
  mustTryDishes: z.array(mustTryDishSchema).min(1),
  hiddenGem: z.string().min(1),
  culturalTip: z.string().min(1),
});

export const colourPaletteSchema = z.object({
  primary: z.string().min(1),
  secondary: z.string().min(1),
  accent: z.string().min(1),
  background: z.string().min(1),
  text: z.string().min(1),
});

export const destinationResponseSchema = z.object({
  destination: destinationDetailsSchema,
  weather: weatherSchema,
  itinerary: z.array(itineraryDaySchema).min(1),
  insiderTips: insiderTipsSchema,
  imagePrompt: z.string().min(1),
  colourPalette: colourPaletteSchema,
});

export const regenerateImageRequestSchema = z.object({
  imagePrompt: z.string().min(1),
  colourPalette: colourPaletteSchema,
});
