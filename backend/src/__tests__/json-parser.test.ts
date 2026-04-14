import { describe, it, expect } from "vitest";
import { extractJSON } from "../utils/json-parser";

describe("extractJSON", () => {
  it("parses a plain JSON string", () => {
    const input = '{"name": "Kyoto"}';
    expect(extractJSON(input)).toEqual({ name: "Kyoto" });
  });

  it("extracts JSON from markdown code fence", () => {
    const input = 'Here is the result:\n```json\n{"name": "Kyoto"}\n```\nDone.';
    expect(extractJSON(input)).toEqual({ name: "Kyoto" });
  });

  it("extracts JSON from unlabeled code fence", () => {
    const input = '```\n{"name": "Kyoto"}\n```';
    expect(extractJSON(input)).toEqual({ name: "Kyoto" });
  });

  it("extracts JSON object from surrounding text", () => {
    const input = 'The destination is {"name": "Kyoto"} as shown.';
    expect(extractJSON(input)).toEqual({ name: "Kyoto" });
  });

  it("handles nested JSON objects", () => {
    const input = '{"destination": {"name": "Kyoto", "country": "Japan"}}';
    expect(extractJSON(input)).toEqual({
      destination: { name: "Kyoto", country: "Japan" },
    });
  });

  it("returns null for empty string", () => {
    expect(extractJSON("")).toBeNull();
  });

  it("returns null for non-JSON text", () => {
    expect(extractJSON("This is just plain text with no JSON")).toBeNull();
  });

  it("returns null for HTML content", () => {
    expect(extractJSON("<html><body>No JSON here</body></html>")).toBeNull();
  });

  it("returns null for truncated JSON", () => {
    expect(extractJSON('{"name": "Kyoto", "country":')).toBeNull();
  });
});
