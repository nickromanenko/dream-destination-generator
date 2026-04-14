import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import health from "./routes/health";
import generate from "./routes/generate";
import regenerateText from "./routes/regenerate-text";
import regenerateImage from "./routes/regenerate-image";

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: [
      "http://localhost:3000",
      "https://dream-destination-generator.web.app",
    ],
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

app.route("/api", health);
app.route("/api", generate);
app.route("/api", regenerateText);
app.route("/api", regenerateImage);

export default {
  port: 8080,
  fetch: app.fetch,
};
