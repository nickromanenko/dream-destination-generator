import { z } from "zod";

export const generateRequestSchema = z.object({
  vibe: z.string().min(10, "Please describe your vibe in at least 10 characters").max(500, "Please keep your description under 500 characters"),
  travelStyle: z.enum([
    "adventure",
    "relaxation",
    "cultural",
    "romantic",
    "family",
    "solo-backpacking",
  ]),
  season: z.enum(["spring", "summer", "autumn", "winter"]),
  budgetTier: z.enum(["budget", "mid-range", "luxury"]),
});
