import { describe, it, expect } from "vitest";
import { generateRequestSchema } from "@/lib/validators";

describe("generateRequestSchema", () => {
  const valid = {
    vibe: "I want a relaxing beach vacation",
    travelStyle: "relaxation",
    season: "summer",
    budgetTier: "mid-range",
  };

  it("accepts a valid request", () => {
    expect(generateRequestSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects short vibe", () => {
    expect(
      generateRequestSchema.safeParse({ ...valid, vibe: "short" }).success
    ).toBe(false);
  });

  it("rejects long vibe", () => {
    expect(
      generateRequestSchema.safeParse({ ...valid, vibe: "a".repeat(501) })
        .success
    ).toBe(false);
  });

  it("rejects invalid travel style", () => {
    expect(
      generateRequestSchema.safeParse({ ...valid, travelStyle: "extreme" })
        .success
    ).toBe(false);
  });

  it("rejects missing fields", () => {
    expect(
      generateRequestSchema.safeParse({ vibe: "long enough text" }).success
    ).toBe(false);
  });
});
