import type { GenerateRequest, BudgetTier } from "../types/destination";
import type { Tool } from "@anthropic-ai/sdk/resources/messages";

export function buildSystemPrompt(): string {
  return `You are a world-class travel consultant with encyclopedic knowledge of destinations worldwide. You generate detailed, accurate, and inspiring travel recommendations.

Your suggestions are specific and practical — not generic. You always suggest real places, with real dishes, real phrases in the local language, and realistic costs.

The image prompt you generate should describe a vintage-style travel poster with bold colours, clean illustration style, and the destination's most iconic landmark or scene. Be very descriptive about the composition, colours, and artistic style.

The colour palette you generate should be inspired by the destination — its landscapes, architecture, or culture. Ensure good contrast between background and text colours.`;
}

export function buildUserPrompt(req: GenerateRequest): string {
  const days = budgetToDays(req.budgetTier);
  return `Generate a dream travel destination based on these preferences:

Travel vibe: "${req.vibe}"
Style: ${req.travelStyle}
Season: ${req.season}
Budget: ${req.budgetTier}

Create a complete destination package with a ${days}-day itinerary appropriate for the ${req.season} season and ${req.budgetTier} budget level.`;
}

function budgetToDays(budget: BudgetTier): number {
  switch (budget) {
    case "budget":
      return 3;
    case "mid-range":
      return 4;
    case "luxury":
      return 5;
  }
}

export const destinationTool: Tool = {
  name: "generate_destination",
  description:
    "Generate a complete travel destination recommendation with all details.",
  input_schema: {
    type: "object" as const,
    properties: {
      destination: {
        type: "object",
        properties: {
          name: { type: "string", description: "Destination city/region name" },
          country: { type: "string" },
          continent: { type: "string" },
          tagline: {
            type: "string",
            description: "Short catchy tagline for the destination",
          },
          description: {
            type: "string",
            description: "2-3 sentence description",
          },
          bestFor: {
            type: "array",
            items: { type: "string" },
            description: "Types of travelers this is best for",
          },
        },
        required: [
          "name",
          "country",
          "continent",
          "tagline",
          "description",
          "bestFor",
        ],
      },
      weather: {
        type: "object",
        properties: {
          temperature: {
            type: "string",
            description: "Temperature range e.g. 22-28°C",
          },
          conditions: { type: "string" },
          packingTip: { type: "string" },
        },
        required: ["temperature", "conditions", "packingTip"],
      },
      itinerary: {
        type: "array",
        items: {
          type: "object",
          properties: {
            day: { type: "number" },
            title: { type: "string", description: "Day theme title" },
            morning: { type: "string" },
            afternoon: { type: "string" },
            evening: { type: "string" },
            estimatedCost: { type: "string", description: "e.g. $45-60" },
          },
          required: [
            "day",
            "title",
            "morning",
            "afternoon",
            "evening",
            "estimatedCost",
          ],
        },
      },
      insiderTips: {
        type: "object",
        properties: {
          localPhrase: {
            type: "string",
            description: "A useful phrase in the local language",
          },
          phraseTranslation: { type: "string" },
          phrasePronunciation: { type: "string" },
          mustTryDishes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                priceRange: { type: "string" },
              },
              required: ["name", "description", "priceRange"],
            },
          },
          hiddenGem: {
            type: "string",
            description: "A local secret spot or experience",
          },
          culturalTip: {
            type: "string",
            description: "Etiquette or cultural advice",
          },
        },
        required: [
          "localPhrase",
          "phraseTranslation",
          "phrasePronunciation",
          "mustTryDishes",
          "hiddenGem",
          "culturalTip",
        ],
      },
      imagePrompt: {
        type: "string",
        description:
          "Detailed prompt for generating a vintage-style travel poster image",
      },
      colourPalette: {
        type: "object",
        properties: {
          primary: { type: "string", description: "Hex colour" },
          secondary: { type: "string", description: "Hex colour" },
          accent: { type: "string", description: "Hex colour" },
          background: { type: "string", description: "Hex colour" },
          text: { type: "string", description: "Hex colour" },
        },
        required: ["primary", "secondary", "accent", "background", "text"],
      },
    },
    required: [
      "destination",
      "weather",
      "itinerary",
      "insiderTips",
      "imagePrompt",
      "colourPalette",
    ],
  },
};
