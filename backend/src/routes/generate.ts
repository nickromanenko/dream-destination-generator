import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { nanoid } from "nanoid";
import { generateRequestSchema } from "../utils/validators";
import { generateDestination } from "../services/claude.service";
import { generatePosterImage } from "../services/image.service";
import type { SSEEvent } from "../types/api";

const generate = new Hono();

generate.post("/generate", (c) => {
  return streamSSE(c, async (stream) => {
    const body = await c.req.json();
    const parsed = generateRequestSchema.safeParse(body);

    if (!parsed.success) {
      await stream.writeSSE({
        event: "error",
        data: JSON.stringify({
          type: "error",
          message: "Invalid request: " + parsed.error.message,
        } satisfies SSEEvent),
      });
      return;
    }

    const request = parsed.data;

    try {
      // Step 1: Generate destination with Claude
      await stream.writeSSE({
        event: "status",
        data: JSON.stringify({
          type: "status",
          message: "Analyzing your travel vibe...",
        } satisfies SSEEvent),
      });

      const destination = await generateDestination(request);

      const tripId = nanoid();
      const createdAt = new Date().toISOString();

      await stream.writeSSE({
        event: "text_complete",
        data: JSON.stringify({
          type: "text_complete",
          message: "Destination found!",
          data: { id: tripId, createdAt, request, destination, imageUrl: null },
        } satisfies SSEEvent),
      });

      // Step 2: Generate poster image
      await stream.writeSSE({
        event: "status",
        data: JSON.stringify({
          type: "status",
          message: "Creating your travel poster...",
        } satisfies SSEEvent),
      });

      let imageUrl: string | null = null;
      try {
        imageUrl = await generatePosterImage(
          destination.imagePrompt,
          destination.colourPalette
        );
      } catch (error) {
        console.error("[generate] image generation failed, continuing without image", {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
      }

      if (imageUrl) {
        await stream.writeSSE({
          event: "image_complete",
          data: JSON.stringify({
            type: "image_complete",
            message: "Poster ready!",
            data: { imageUrl },
          } satisfies SSEEvent),
        });
      }

      // Step 3: Done
      await stream.writeSSE({
        event: "done",
        data: JSON.stringify({
          type: "done",
          message: "Complete",
          data: { id: tripId, createdAt, request, destination, imageUrl },
        } satisfies SSEEvent),
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      await stream.writeSSE({
        event: "error",
        data: JSON.stringify({
          type: "error",
          message: `Generation failed: ${message}`,
        } satisfies SSEEvent),
      });
    }
  });
});

export default generate;
