import type { GeneratedTrip } from "./destination";

export type SSEEventType =
  | "status"
  | "text_complete"
  | "image_complete"
  | "done"
  | "error";

export interface SSEEvent {
  type: SSEEventType;
  message: string;
  data?: Partial<GeneratedTrip>;
}
