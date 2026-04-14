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

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    system: buildSystemPrompt(),
    messages: [{ role: "user", content: buildUserPrompt(req) }],
    tools: [destinationTool],
    tool_choice: { type: "tool", name: "generate_destination" },
  });

  // Try to extract from tool_use block
  const toolBlock = response.content.find((b) => b.type === "tool_use");
  if (toolBlock && toolBlock.type === "tool_use") {
    const parsed = destinationResponseSchema.safeParse(toolBlock.input);
    if (parsed.success) {
      return parsed.data;
    }
  }

  // Fallback: try to extract JSON from text blocks
  const textBlock = response.content.find((b) => b.type === "text");
  if (textBlock && textBlock.type === "text") {
    const extracted = extractJSON(textBlock.text);
    if (extracted) {
      const parsed = destinationResponseSchema.safeParse(extracted);
      if (parsed.success) {
        return parsed.data;
      }
    }
  }

  throw new Error(
    "Failed to parse destination response from Claude. No valid structured output found."
  );
}
