import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DestinationCard } from "@/components/DestinationCard";
import type { GeneratedTrip } from "@/lib/types";

const mockTrip: GeneratedTrip = {
  id: "test-1",
  createdAt: "2024-01-01T00:00:00Z",
  request: {
    vibe: "Ancient temples and gardens",
    travelStyle: "cultural",
    season: "spring",
    budgetTier: "mid-range",
  },
  destination: {
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
      hiddenGem: "Bamboo grove at dawn",
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
  },
  imageUrl: null,
};

describe("DestinationCard", () => {
  const defaultProps = {
    trip: mockTrip,
    isRegeneratingText: false,
    isRegeneratingImage: false,
    onRegenerateText: vi.fn(),
    onRegenerateImage: vi.fn(),
    onSave: vi.fn(),
    isSaved: false,
  };

  it("renders destination name", () => {
    render(<DestinationCard {...defaultProps} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Kyoto");
  });

  it("renders tagline", () => {
    render(<DestinationCard {...defaultProps} />);
    expect(
      screen.getByText("Where tradition meets tranquility")
    ).toBeInTheDocument();
  });

  it("renders country and continent", () => {
    render(<DestinationCard {...defaultProps} />);
    expect(screen.getByText(/Japan/)).toBeInTheDocument();
    expect(screen.getByText(/Asia/)).toBeInTheDocument();
  });

  it("renders itinerary day", () => {
    render(<DestinationCard {...defaultProps} />);
    expect(screen.getByText(/Temples & Tea/)).toBeInTheDocument();
    expect(screen.getByText(/Visit Kinkaku-ji/)).toBeInTheDocument();
  });

  it("renders insider tips", () => {
    render(<DestinationCard {...defaultProps} />);
    expect(screen.getByText(/Konnichiwa/)).toBeInTheDocument();
    expect(screen.getByText(/Yudofu/)).toBeInTheDocument();
  });

  it("renders weather info", () => {
    render(<DestinationCard {...defaultProps} />);
    expect(screen.getByText("15-22°C")).toBeInTheDocument();
  });

  it("renders best-for tags", () => {
    render(<DestinationCard {...defaultProps} />);
    expect(screen.getByText("couples")).toBeInTheDocument();
    expect(screen.getByText("photographers")).toBeInTheDocument();
  });

  it("shows save button when not saved", () => {
    render(<DestinationCard {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: /save trip/i })
    ).toBeInTheDocument();
  });

  it("shows saved state when saved", () => {
    render(<DestinationCard {...defaultProps} isSaved={true} />);
    expect(screen.getByRole("button", { name: /saved/i })).toBeInTheDocument();
  });
});
