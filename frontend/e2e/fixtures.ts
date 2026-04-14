import type { Page } from "@playwright/test";

export const mockDestination = {
  destination: {
    name: "Kyoto",
    country: "Japan",
    continent: "Asia",
    tagline: "Where tradition meets tranquility",
    description:
      "A city of ancient temples, zen gardens, and timeless culture nestled among forested hills.",
    bestFor: ["couples", "culture lovers", "photographers"],
  },
  weather: {
    temperature: "15-22°C",
    conditions: "Mild with cherry blossoms",
    packingTip: "Bring layers and a light rain jacket",
  },
  itinerary: [
    {
      day: 1,
      title: "Temples & Tea",
      morning: "Visit Kinkaku-ji (Golden Pavilion) at dawn",
      afternoon: "Tea ceremony in Gion district",
      evening: "Dinner at Nishiki Market stalls",
      estimatedCost: "$80-120",
    },
    {
      day: 2,
      title: "Arashiyama & Bamboo",
      morning: "Walk through the bamboo grove",
      afternoon: "Tenryu-ji garden and boat ride",
      evening: "Kaiseki dinner in Arashiyama",
      estimatedCost: "$100-150",
    },
  ],
  insiderTips: {
    localPhrase: "Sumimasen",
    phraseTranslation: "Excuse me / Sorry",
    phrasePronunciation: "soo-mee-mah-sen",
    mustTryDishes: [
      {
        name: "Yudofu",
        description: "Delicate hot tofu simmered in kombu broth",
        priceRange: "$10-15",
      },
      {
        name: "Matcha parfait",
        description: "Layered green tea ice cream and red bean",
        priceRange: "$8-12",
      },
    ],
    hiddenGem: "Fushimi Inari at 5am before the crowds arrive",
    culturalTip: "Always bow slightly when greeting locals",
  },
  imagePrompt:
    "Vintage travel poster of Kyoto Japan, golden pavilion reflected in still water, cherry blossoms, art deco style",
  colourPalette: {
    primary: "#8B1A1A",
    secondary: "#2C5F2D",
    accent: "#FFD700",
    background: "#FFF5E1",
    text: "#1A1A2E",
  },
};

export const mockImageUrl = "https://fal.media/files/mock-kyoto-poster.jpg";

/** Build a mock SSE stream response body */
function buildSSEStream(destination: typeof mockDestination, imageUrl: string): string {
  const tripId = "test-trip-id-123";
  const createdAt = "2026-01-01T00:00:00.000Z";
  const request = {
    vibe: "Ancient temples and peaceful gardens",
    travelStyle: "cultural",
    season: "spring",
    budgetTier: "mid-range",
  };

  const events = [
    `event: status\ndata: ${JSON.stringify({ type: "status", message: "Analyzing your travel vibe..." })}\n\n`,
    `event: text_complete\ndata: ${JSON.stringify({ type: "text_complete", message: "Destination found!", data: { id: tripId, createdAt, request, destination, imageUrl: null } })}\n\n`,
    `event: status\ndata: ${JSON.stringify({ type: "status", message: "Creating your travel poster..." })}\n\n`,
    `event: image_complete\ndata: ${JSON.stringify({ type: "image_complete", message: "Poster ready!", data: { imageUrl } })}\n\n`,
    `event: done\ndata: ${JSON.stringify({ type: "done", message: "Complete", data: { id: tripId, createdAt, request, destination, imageUrl } })}\n\n`,
  ];

  return events.join("");
}

/** Intercept all backend API calls with mock responses */
export async function mockApiRoutes(page: Page) {
  const apiBase = "http://localhost:8080";

  // SSE generate endpoint
  await page.route(`${apiBase}/api/generate`, async (route) => {
    await route.fulfill({
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Access-Control-Allow-Origin": "*",
      },
      body: buildSSEStream(mockDestination, mockImageUrl),
    });
  });

  // Regenerate text endpoint
  await page.route(`${apiBase}/api/regenerate-text`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ destination: mockDestination }),
    });
  });

  // Regenerate image endpoint
  await page.route(`${apiBase}/api/regenerate-image`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ imageUrl: mockImageUrl }),
    });
  });

  // Block the poster image itself to avoid external requests
  await page.route("https://fal.media/**", (route) => route.abort());
}

/** Fill and submit the generator form */
export async function fillAndSubmitForm(page: Page) {
  await page.locator("#vibe").fill("Ancient temples and peaceful gardens in spring");
  await page.locator("#travelStyle").selectOption("cultural");
  await page.locator("#season").selectOption("spring");
  await page.locator("#budgetTier").selectOption("mid-range");
  await page.getByRole("button", { name: /generate my dream/i }).click();
}
