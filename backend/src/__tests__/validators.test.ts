import { describe, it, expect } from "vitest";
import {
  generateRequestSchema,
  destinationResponseSchema,
  regenerateImageRequestSchema,
} from "../utils/validators";

describe("generateRequestSchema", () => {
  const validRequest = {
    vibe: "I want to relax on a sunny beach with cocktails",
    travelStyle: "relaxation",
    season: "summer",
    budgetTier: "mid-range",
  };

  it("accepts a valid request", () => {
    const result = generateRequestSchema.safeParse(validRequest);
    expect(result.success).toBe(true);
  });

  it("rejects vibe shorter than 10 characters", () => {
    const result = generateRequestSchema.safeParse({
      ...validRequest,
      vibe: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects vibe longer than 500 characters", () => {
    const result = generateRequestSchema.safeParse({
      ...validRequest,
      vibe: "a".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid travel style", () => {
    const result = generateRequestSchema.safeParse({
      ...validRequest,
      travelStyle: "extreme",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid season", () => {
    const result = generateRequestSchema.safeParse({
      ...validRequest,
      season: "monsoon",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid budget tier", () => {
    const result = generateRequestSchema.safeParse({
      ...validRequest,
      budgetTier: "free",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing fields", () => {
    const result = generateRequestSchema.safeParse({ vibe: "some text here enough" });
    expect(result.success).toBe(false);
  });
});

describe("destinationResponseSchema", () => {
  const validResponse = {
    destination: {
      name: "Kyoto",
      country: "Japan",
      continent: "Asia",
      tagline: "Where tradition meets tranquility",
      description: "A city of temples and zen gardens.",
      bestFor: ["couples", "photographers"],
    },
    weather: {
      temperature: "15-22°C",
      conditions: "Mild with cherry blossoms",
      packingTip: "Bring layers",
    },
    itinerary: [
      {
        day: 1,
        title: "Temples & Tea",
        morning: "Visit Kinkaku-ji",
        afternoon: "Tea ceremony in Gion",
        evening: "Dinner at Nishiki Market",
        estimatedCost: "$80-120",
      },
    ],
    insiderTips: {
      localPhrase: "Konnichiwa",
      phraseTranslation: "Hello",
      phrasePronunciation: "koh-nee-chee-wah",
      mustTryDishes: [
        {
          name: "Yudofu",
          description: "Hot tofu in kombu broth",
          priceRange: "$10-15",
        },
      ],
      hiddenGem: "The bamboo grove at dawn",
      culturalTip: "Bow when greeting",
    },
    imagePrompt:
      "Vintage travel poster of Kyoto with cherry blossoms and pagoda",
    colourPalette: {
      primary: "#D4456A",
      secondary: "#2C5F2D",
      accent: "#FFD700",
      background: "#FFF5E1",
      text: "#1A1A2E",
    },
  };

  it("accepts a valid destination response", () => {
    const result = destinationResponseSchema.safeParse(validResponse);
    expect(result.success).toBe(true);
  });

  it("rejects response with missing destination fields", () => {
    const result = destinationResponseSchema.safeParse({
      ...validResponse,
      destination: { name: "Kyoto" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects response with empty itinerary", () => {
    const result = destinationResponseSchema.safeParse({
      ...validResponse,
      itinerary: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects response with missing colour palette fields", () => {
    const result = destinationResponseSchema.safeParse({
      ...validResponse,
      colourPalette: { primary: "#D4456A" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects completely invalid input", () => {
    const result = destinationResponseSchema.safeParse("not an object");
    expect(result.success).toBe(false);
  });

  it("rejects null input", () => {
    const result = destinationResponseSchema.safeParse(null);
    expect(result.success).toBe(false);
  });
});

describe("regenerateImageRequestSchema", () => {
  it("accepts valid image regeneration request", () => {
    const result = regenerateImageRequestSchema.safeParse({
      imagePrompt: "A vintage travel poster of Paris",
      colourPalette: {
        primary: "#1A1A2E",
        secondary: "#16213E",
        accent: "#E94560",
        background: "#F5F5F5",
        text: "#1A1A2E",
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty image prompt", () => {
    const result = regenerateImageRequestSchema.safeParse({
      imagePrompt: "",
      colourPalette: {
        primary: "#1A1A2E",
        secondary: "#16213E",
        accent: "#E94560",
        background: "#F5F5F5",
        text: "#1A1A2E",
      },
    });
    expect(result.success).toBe(false);
  });
});
