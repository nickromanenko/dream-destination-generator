import { describe, it, expect, vi, beforeEach } from "vitest";
import { generatePosterImage, setFalClient } from "../services/image.service";
import type { ColourPalette } from "../types/destination";

const palette: ColourPalette = {
  primary: "#D4456A",
  secondary: "#2C5F2D",
  accent: "#FFD700",
  background: "#FFF5E1",
  text: "#1A1A2E",
};

describe("generatePosterImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns image URL on success", async () => {
    const mockSubscribe = vi.fn().mockResolvedValue({
      data: {
        images: [{ url: "https://fal.ai/generated/poster.jpg" }],
      },
    });
    setFalClient({ subscribe: mockSubscribe } as any);

    const url = await generatePosterImage(
      "Vintage travel poster of Kyoto",
      palette
    );
    expect(url).toBe("https://fal.ai/generated/poster.jpg");
    expect(mockSubscribe).toHaveBeenCalledOnce();
  });

  it("throws when no images returned", async () => {
    const mockSubscribe = vi.fn().mockResolvedValue({
      data: { images: [] },
    });
    setFalClient({ subscribe: mockSubscribe } as any);

    await expect(
      generatePosterImage("A poster", palette)
    ).rejects.toThrow("No image generated");
  });

  it("throws on API error", async () => {
    const mockSubscribe = vi
      .fn()
      .mockRejectedValue(new Error("fal.ai API error"));
    setFalClient({ subscribe: mockSubscribe } as any);

    await expect(
      generatePosterImage("A poster", palette)
    ).rejects.toThrow("fal.ai API error");
  });
});
