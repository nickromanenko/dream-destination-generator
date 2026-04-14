import { describe, it, expect } from "vitest";
import {
  hexToRGB,
  hexToHSL,
  getContrastColour,
  paletteToCSVars,
} from "@/lib/colour-utils";

describe("hexToRGB", () => {
  it("converts white", () => {
    expect(hexToRGB("#FFFFFF")).toEqual({ r: 255, g: 255, b: 255 });
  });

  it("converts black", () => {
    expect(hexToRGB("#000000")).toEqual({ r: 0, g: 0, b: 0 });
  });

  it("converts a colour", () => {
    expect(hexToRGB("#D4456A")).toEqual({ r: 212, g: 69, b: 106 });
  });
});

describe("hexToHSL", () => {
  it("converts white to HSL", () => {
    const hsl = hexToHSL("#FFFFFF");
    expect(hsl.l).toBe(100);
  });

  it("converts black to HSL", () => {
    const hsl = hexToHSL("#000000");
    expect(hsl.l).toBe(0);
  });

  it("converts a saturated colour", () => {
    const hsl = hexToHSL("#FF0000");
    expect(hsl.h).toBe(0);
    expect(hsl.s).toBe(100);
    expect(hsl.l).toBe(50);
  });
});

describe("getContrastColour", () => {
  it("returns black for white background", () => {
    expect(getContrastColour("#FFFFFF")).toBe("#000000");
  });

  it("returns white for black background", () => {
    expect(getContrastColour("#000000")).toBe("#FFFFFF");
  });

  it("returns white for dark colours", () => {
    expect(getContrastColour("#1A1A2E")).toBe("#FFFFFF");
  });

  it("returns black for light colours", () => {
    expect(getContrastColour("#FFF5E1")).toBe("#000000");
  });
});

describe("paletteToCSVars", () => {
  it("generates CSS custom properties", () => {
    const result = paletteToCSVars({
      primary: "#D4456A",
      secondary: "#2C5F2D",
      accent: "#FFD700",
      background: "#FFF5E1",
      text: "#1A1A2E",
    });

    expect(result["--dest-primary"]).toBe("#D4456A");
    expect(result["--dest-secondary"]).toBe("#2C5F2D");
    expect(result["--dest-accent"]).toBe("#FFD700");
    expect(result["--dest-background"]).toBe("#FFF5E1");
    expect(result["--dest-text"]).toBe("#1A1A2E");
    expect(Object.keys(result)).toHaveLength(5);
  });
});
