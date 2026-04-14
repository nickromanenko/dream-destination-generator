import { Hono } from "hono";
import { regenerateImageRequestSchema } from "../utils/validators";
import { generatePosterImage } from "../services/image.service";

const regenerateImage = new Hono();

regenerateImage.post("/regenerate-image", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch (error) {
    console.error("[regenerate-image] Failed to parse request body", { error });
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  console.log("[regenerate-image] request received");

  const parsed = regenerateImageRequestSchema.safeParse(body);
  if (!parsed.success) {
    console.warn("[regenerate-image] validation failed", {
      errors: parsed.error.issues,
    });
    return c.json({ error: parsed.error.message }, 400);
  }

  try {
    const imageUrl = await generatePosterImage(
      parsed.data.imagePrompt,
      parsed.data.colourPalette
    );
    console.log("[regenerate-image] success", { imageUrl });
    return c.json({ imageUrl });
  } catch (error) {
    console.error("[regenerate-image] generation failed", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return c.json({ error: message }, 500);
  }
});

export default regenerateImage;
