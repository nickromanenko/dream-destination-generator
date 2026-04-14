import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateDestination, setClient } from "../services/claude.service";
import type { GenerateRequest } from "../types/destination";

const validToolInput = {
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
  imagePrompt: "Vintage travel poster of Kyoto",
  colourPalette: {
    primary: "#D4456A",
    secondary: "#2C5F2D",
    accent: "#FFD700",
    background: "#FFF5E1",
    text: "#1A1A2E",
  },
};

const validRequest: GenerateRequest = {
  vibe: "I want to explore ancient temples and peaceful gardens",
  travelStyle: "cultural",
  season: "spring",
  budgetTier: "mid-range",
};

function createMockClient(createImpl: ReturnType<typeof vi.fn>) {
  return { messages: { create: createImpl } } as any;
}

describe("generateDestination", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns parsed destination from tool_use response", async () => {
    const mockCreate = vi.fn().mockResolvedValue({
      content: [
        {
          type: "tool_use",
          id: "call_1",
          name: "generate_destination",
          input: validToolInput,
        },
      ],
    });
    setClient(createMockClient(mockCreate));

    const result = await generateDestination(validRequest);
    expect(result.destination.name).toBe("Kyoto");
    expect(result.colourPalette.primary).toBe("#D4456A");
    expect(result.itinerary).toHaveLength(1);
  });

  it("throws when no tool_use block in response", async () => {
    const mockCreate = vi.fn().mockResolvedValue({
      content: [{ type: "text", text: "I cannot generate that." }],
    });
    setClient(createMockClient(mockCreate));

    await expect(generateDestination(validRequest)).rejects.toThrow();
  });

  it("throws when tool input fails validation", async () => {
    const mockCreate = vi.fn().mockResolvedValue({
      content: [
        {
          type: "tool_use",
          id: "call_1",
          name: "generate_destination",
          input: { destination: { name: "Kyoto" } },
        },
      ],
    });
    setClient(createMockClient(mockCreate));

    await expect(generateDestination(validRequest)).rejects.toThrow();
  });

  it("throws on API error", async () => {
    const mockCreate = vi
      .fn()
      .mockRejectedValue(new Error("Rate limit exceeded"));
    setClient(createMockClient(mockCreate));

    await expect(generateDestination(validRequest)).rejects.toThrow(
      "Rate limit exceeded"
    );
  });

  it("merges multiple tool_use blocks into a single response", async () => {
    // Claude sometimes splits fields across multiple tool_use calls
    const { destination, weather, itinerary, insiderTips, ...rest } = validToolInput;
    const mockCreate = vi.fn().mockResolvedValue({
      content: [
        { type: "tool_use", id: "call_1", name: "generate_destination", input: { destination } },
        { type: "tool_use", id: "call_2", name: "generate_destination", input: { weather } },
        { type: "tool_use", id: "call_3", name: "generate_destination", input: { itinerary } },
        { type: "tool_use", id: "call_4", name: "generate_destination", input: { insiderTips } },
        { type: "tool_use", id: "call_5", name: "generate_destination", input: rest },
      ],
      stop_reason: "tool_use",
    });
    setClient(createMockClient(mockCreate));

    const result = await generateDestination(validRequest);
    expect(result.destination.name).toBe("Kyoto");
    expect(result.weather.temperature).toBe("15-22°C");
    expect(result.itinerary).toHaveLength(1);
    expect(result.insiderTips.localPhrase).toBe("Konnichiwa");
    expect(result.colourPalette.primary).toBe("#D4456A");
  });

  it("falls back to text extraction when tool_use has invalid input", async () => {
    const mockCreate = vi.fn().mockResolvedValue({
      content: [
        {
          type: "tool_use",
          id: "call_1",
          name: "generate_destination",
          input: { invalid: true },
        },
        {
          type: "text",
          text: JSON.stringify(validToolInput),
        },
      ],
    });
    setClient(createMockClient(mockCreate));

    const result = await generateDestination(validRequest);
    expect(result.destination.name).toBe("Kyoto");
  });
});
