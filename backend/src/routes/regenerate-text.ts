import { Hono } from "hono";
import { generateRequestSchema } from "../utils/validators";
import { generateDestination } from "../services/claude.service";

const regenerateText = new Hono();

regenerateText.post("/regenerate-text", async (c) => {
  const body = await c.req.json();
  const parsed = generateRequestSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: parsed.error.message }, 400);
  }

  try {
    const destination = await generateDestination(parsed.data);
    return c.json({ destination });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return c.json({ error: message }, 500);
  }
});

export default regenerateText;
