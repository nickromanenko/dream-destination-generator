import { describe, it, expect, vi, beforeEach } from "vitest";
import { Hono } from "hono";

// Mock services before importing routes
vi.mock("../services/claude.service", () => ({
  generateDestination: vi.fn(),
  setClient: vi.fn(),
}));
vi.mock("../services/image.service", () => ({
  generatePosterImage: vi.fn(),
  setFalClient: vi.fn(),
}));

import generate from "../routes/generate";
import regenerateText from "../routes/regenerate-text";
import regenerateImage from "../routes/regenerate-image";
import health from "../routes/health";
import { generateDestination } from "../services/claude.service";
import { generatePosterImage } from "../services/image.service";

const validDestination = {
  destination: {
    name: "Kyoto",
    country: "Japan",
    continent: "Asia",
    tagline: "Where tradition meets tranquility",
    description: "A city of temples and zen gardens.",
    bestFor: ["couples"],
  },
  weather: {
    temperature: "15-22°C",
    conditions: "Mild",
    packingTip: "Bring layers",
  },
  itinerary: [
    {
      day: 1,
      title: "Temples",
      morning: "Visit temples",
      afternoon: "Tea ceremony",
      evening: "Dinner",
      estimatedCost: "$80",
    },
  ],
  insiderTips: {
    localPhrase: "Konnichiwa",
    phraseTranslation: "Hello",
    phrasePronunciation: "koh-nee-chee-wah",
    mustTryDishes: [
      { name: "Yudofu", description: "Tofu dish", priceRange: "$10" },
    ],
    hiddenGem: "Bamboo grove",
    culturalTip: "Bow when greeting",
  },
  imagePrompt: "Vintage poster of Kyoto",
  colourPalette: {
    primary: "#D4456A",
    secondary: "#2C5F2D",
    accent: "#FFD700",
    background: "#FFF5E1",
    text: "#1A1A2E",
  },
};

const validRequest = {
  vibe: "I want to explore ancient temples and peaceful gardens",
  travelStyle: "cultural",
  season: "spring",
  budgetTier: "mid-range",
};

describe("Health route", () => {
  it("GET /health returns ok", async () => {
    const app = new Hono();
    app.route("/api", health);

    const res = await app.request("/api/health");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe("ok");
    expect(json.timestamp).toBeDefined();
  });
});

describe("POST /api/generate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns SSE stream with valid request", async () => {
    vi.mocked(generateDestination).mockResolvedValue(validDestination);
    vi.mocked(generatePosterImage).mockResolvedValue(
      "https://fal.ai/poster.jpg"
    );

    const app = new Hono();
    app.route("/api", generate);

    const res = await app.request("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validRequest),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/event-stream");

    const text = await res.text();
    expect(text).toContain("event: status");
    expect(text).toContain("event: text_complete");
    expect(text).toContain("event: done");
    expect(text).toContain("Kyoto");
  });

  it("returns error SSE for invalid request", async () => {
    const app = new Hono();
    app.route("/api", generate);

    const res = await app.request("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vibe: "short" }),
    });

    const text = await res.text();
    expect(text).toContain("event: error");
  });
});

describe("POST /api/regenerate-text", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns destination JSON for valid request", async () => {
    vi.mocked(generateDestination).mockResolvedValue(validDestination);

    const app = new Hono();
    app.route("/api", regenerateText);

    const res = await app.request("/api/regenerate-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validRequest),
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.destination.destination.name).toBe("Kyoto");
  });

  it("returns 400 for invalid request", async () => {
    const app = new Hono();
    app.route("/api", regenerateText);

    const res = await app.request("/api/regenerate-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vibe: "short" }),
    });

    expect(res.status).toBe(400);
  });
});

describe("POST /api/regenerate-image", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns image URL for valid request", async () => {
    vi.mocked(generatePosterImage).mockResolvedValue(
      "https://fal.ai/new-poster.jpg"
    );

    const app = new Hono();
    app.route("/api", regenerateImage);

    const res = await app.request("/api/regenerate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imagePrompt: "A vintage travel poster of Paris",
        colourPalette: {
          primary: "#1A1A2E",
          secondary: "#16213E",
          accent: "#E94560",
          background: "#F5F5F5",
          text: "#1A1A2E",
        },
      }),
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.imageUrl).toBe("https://fal.ai/new-poster.jpg");
  });

  it("returns 400 for missing imagePrompt", async () => {
    const app = new Hono();
    app.route("/api", regenerateImage);

    const res = await app.request("/api/regenerate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imagePrompt: "" }),
    });

    expect(res.status).toBe(400);
  });
});
