import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSavedTrips } from "@/hooks/useSavedTrips";
import type { GeneratedTrip } from "@/lib/types";

const mockTrip: GeneratedTrip = {
  id: "test-1",
  createdAt: "2024-01-01T00:00:00Z",
  request: {
    vibe: "Beach vacation",
    travelStyle: "relaxation",
    season: "summer",
    budgetTier: "mid-range",
  },
  destination: {
    destination: {
      name: "Bali",
      country: "Indonesia",
      continent: "Asia",
      tagline: "Island of the Gods",
      description: "A tropical paradise.",
      bestFor: ["couples"],
    },
    weather: {
      temperature: "28-32°C",
      conditions: "Tropical",
      packingTip: "Sunscreen",
    },
    itinerary: [
      {
        day: 1,
        title: "Beach Day",
        morning: "Surf",
        afternoon: "Relax",
        evening: "Sunset dinner",
        estimatedCost: "$50",
      },
    ],
    insiderTips: {
      localPhrase: "Terima kasih",
      phraseTranslation: "Thank you",
      phrasePronunciation: "teh-ree-mah kah-see",
      mustTryDishes: [
        { name: "Nasi Goreng", description: "Fried rice", priceRange: "$3-5" },
      ],
      hiddenGem: "Hidden waterfall",
      culturalTip: "Remove shoes",
    },
    imagePrompt: "Travel poster of Bali",
    colourPalette: {
      primary: "#1A5F2D",
      secondary: "#2C5F2D",
      accent: "#FFD700",
      background: "#FFF5E1",
      text: "#1A1A2E",
    },
  },
  imageUrl: null,
};

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("useSavedTrips", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it("starts with empty trips", () => {
    const { result } = renderHook(() => useSavedTrips());
    expect(result.current.savedTrips).toEqual([]);
  });

  it("saves a trip", () => {
    const { result } = renderHook(() => useSavedTrips());

    act(() => {
      result.current.saveTrip(mockTrip);
    });

    expect(result.current.savedTrips).toHaveLength(1);
    expect(result.current.savedTrips[0].id).toBe("test-1");
  });

  it("does not save duplicate trips", () => {
    const { result } = renderHook(() => useSavedTrips());

    act(() => {
      result.current.saveTrip(mockTrip);
      result.current.saveTrip(mockTrip);
    });

    expect(result.current.savedTrips).toHaveLength(1);
  });

  it("deletes a trip", () => {
    const { result } = renderHook(() => useSavedTrips());

    act(() => {
      result.current.saveTrip(mockTrip);
    });

    act(() => {
      result.current.deleteTrip("test-1");
    });

    expect(result.current.savedTrips).toHaveLength(0);
  });

  it("limits to 20 trips", () => {
    const { result } = renderHook(() => useSavedTrips());

    act(() => {
      for (let i = 0; i < 25; i++) {
        result.current.saveTrip({ ...mockTrip, id: `trip-${i}` });
      }
    });

    expect(result.current.savedTrips.length).toBeLessThanOrEqual(20);
  });

  it("persists to localStorage", () => {
    const { result } = renderHook(() => useSavedTrips());

    act(() => {
      result.current.saveTrip(mockTrip);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "dream-destinations-saved",
      expect.any(String)
    );
  });
});
