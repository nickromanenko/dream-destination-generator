/**
 * Attempts to extract a JSON object from a string that may contain
 * markdown code fences, surrounding text, or raw JSON.
 */
export function extractJSON(raw: string): unknown | null {
  if (!raw || raw.trim().length === 0) return null;

  // Try 1: Parse as plain JSON
  try {
    return JSON.parse(raw);
  } catch {
    // continue
  }

  // Try 2: Extract from markdown code fence (```json ... ``` or ``` ... ```)
  const fenceMatch = raw.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch {
      // continue
    }
  }

  // Try 3: Find first { and last matching }
  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(raw.slice(firstBrace, lastBrace + 1));
    } catch {
      // continue
    }
  }

  return null;
}
