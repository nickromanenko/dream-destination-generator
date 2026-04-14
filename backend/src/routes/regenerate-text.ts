import { Hono } from "hono";
import { generateRequestSchema } from "../utils/validators";
import { generateDestination } from "../services/claude.service";

const regenerateText = new Hono();

regenerateText.post("/regenerate-text", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch (error) {
    console.error("[regenerate-text] Failed to parse request body", { error });
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  console.log("[regenerate-text] request received", { body });

  const parsed = generateRequestSchema.safeParse(body);
  if (!parsed.success) {
    console.warn("[regenerate-text] validation failed", {
      errors: parsed.error.issues,
      body,
    });
    return c.json({ error: parsed.error.message }, 400);
  }

  try {
    const destination = await generateDestination(parsed.data);
    console.log("[regenerate-text] success");
    return c.json({ destination });
  } catch (error) {
    console.error("[regenerate-text] generation failed", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return c.json({ error: message }, 500);
  }
});

export default regenerateText;
