import Anthropic from "@anthropic-ai/sdk";
import type { GenerateRequest, DestinationResponse } from "../types/destination";
import {
  buildSystemPrompt,
  buildUserPrompt,
  destinationTool,
} from "../prompts/destination.prompt";
import { destinationResponseSchema } from "../utils/validators";
import { extractJSON } from "../utils/json-parser";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

/** For testing: inject a mock client */
export function setClient(mockClient: Anthropic) {
  client = mockClient;
}

export async function generateDestination(
  req: GenerateRequest
): Promise<DestinationResponse> {
  const anthropic = getClient();

  console.log("[claude] generateDestination start", {
    travelStyle: req.travelStyle,
    season: req.season,
    budgetTier: req.budgetTier,
    vibeLength: req.vibe.length,
  });

  let response: Awaited<ReturnType<typeof anthropic.messages.create>>;
  try {
    response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      system: buildSystemPrompt(),
      messages: [{ role: "user", content: buildUserPrompt(req) }],
      tools: [destinationTool],
      tool_choice: { type: "tool", name: "generate_destination" },
    });
  } catch (error) {
    console.error("[claude] API call failed", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }

  console.log("[claude] API response received", {
    stopReason: response.stop_reason,
    contentTypes: response.content.map((b) => b.type),
    usage: response.usage,
  });

  // Merge all tool_use blocks — Claude sometimes splits fields across multiple calls
  const toolBlocks = response.content.filter((b) => b.type === "tool_use");
  if (toolBlocks.length > 0) {
    const merged = toolBlocks.reduce((acc, block) => {
      if (block.type === "tool_use" && block.input && typeof block.input === "object") {
        return { ...acc, ...(block.input as Record<string, unknown>) };
      }
      return acc;
    }, {} as Record<string, unknown>);

    console.log("[claude] merged tool_use blocks", {
      blockCount: toolBlocks.length,
      mergedKeys: Object.keys(merged),
    });

    const parsed = destinationResponseSchema.safeParse(merged);
    if (parsed.success) {
      console.log("[claude] tool_use parsed successfully");
      return parsed.data;
    }
    console.warn("[claude] tool_use Zod validation failed", {
      errors: parsed.error.issues,
      input: JSON.stringify(merged).slice(0, 500),
    });
  }

  // Fallback: try to extract JSON from text blocks
  const textBlock = response.content.find((b) => b.type === "text");
  if (textBlock && textBlock.type === "text") {
    console.log("[claude] attempting text fallback extraction");
    const extracted = extractJSON(textBlock.text);
    if (extracted) {
      const parsed = destinationResponseSchema.safeParse(extracted);
      if (parsed.success) {
        console.log("[claude] text fallback parsed successfully");
        return parsed.data;
      }
      console.warn("[claude] text fallback Zod validation failed", {
        errors: parsed.error.issues,
      });
    } else {
      console.warn("[claude] no JSON found in text block", {
        textPreview: textBlock.text.slice(0, 300),
      });
    }
  }

  console.error("[claude] all parsing strategies failed", {
    contentTypes: response.content.map((b) => b.type),
    stopReason: response.stop_reason,
  });

  throw new Error(
    "Failed to parse destination response from Claude. No valid structured output found."
  );
}
