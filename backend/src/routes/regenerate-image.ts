import { Hono } from "hono";
import { regenerateImageRequestSchema } from "../utils/validators";
import { generatePosterImage } from "../services/image.service";

const regenerateImage = new Hono();

regenerateImage.post("/regenerate-image", async (c) => {
  const body = await c.req.json();
  const parsed = regenerateImageRequestSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: parsed.error.message }, 400);
  }

  try {
    const imageUrl = await generatePosterImage(
      parsed.data.imagePrompt,
      parsed.data.colourPalette
    );
    return c.json({ imageUrl });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return c.json({ error: message }, 500);
  }
});

export default regenerateImage;
