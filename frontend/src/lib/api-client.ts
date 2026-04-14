import type {
  GenerateRequest,
  DestinationResponse,
  SSEEvent,
  ColourPalette,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface SSEHandlers {
  onStatus: (message: string) => void;
  onTextComplete: (event: SSEEvent) => void;
  onImageComplete: (event: SSEEvent) => void;
  onDone: (event: SSEEvent) => void;
  onError: (message: string) => void;
}

function parseSSEEvent(eventStr: string): SSEEvent | null {
  const lines = eventStr.split("\n");
  let data = "";

  for (const line of lines) {
    if (line.startsWith("data: ")) {
      data += line.slice(6);
    }
  }

  if (!data) return null;

  try {
    return JSON.parse(data) as SSEEvent;
  } catch {
    return null;
  }
}

export function connectGenerateSSE(
  req: GenerateRequest,
  handlers: SSEHandlers
): () => void {
  const controller = new AbortController();

  (async () => {
    try {
      const response = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        handlers.onError("Failed to connect to server");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop()!;

        for (const eventStr of events) {
          const event = parseSSEEvent(eventStr);
          if (!event) continue;

          switch (event.type) {
            case "status":
              handlers.onStatus(event.message);
              break;
            case "text_complete":
              handlers.onTextComplete(event);
              break;
            case "image_complete":
              handlers.onImageComplete(event);
              break;
            case "done":
              handlers.onDone(event);
              break;
            case "error":
              handlers.onError(event.message);
              break;
          }
        }
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        handlers.onError("Connection lost. Please try again.");
      }
    }
  })();

  return () => controller.abort();
}

export async function regenerateText(
  req: GenerateRequest
): Promise<DestinationResponse> {
  const response = await fetch(`${API_URL}/api/regenerate-text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to regenerate text");
  }

  const data = await response.json();
  return data.destination;
}

export async function regenerateImage(
  imagePrompt: string,
  colourPalette: ColourPalette
): Promise<string> {
  const response = await fetch(`${API_URL}/api/regenerate-image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imagePrompt, colourPalette }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to regenerate image");
  }

  const data = await response.json();
  return data.imageUrl;
}
