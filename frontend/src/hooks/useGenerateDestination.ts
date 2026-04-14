"use client";

import { useState, useCallback, useRef } from "react";
import type {
  GenerateRequest,
  GeneratedTrip,
  DestinationResponse,
} from "@/lib/types";
import {
  connectGenerateSSE,
  regenerateText as apiRegenerateText,
  regenerateImage as apiRegenerateImage,
} from "@/lib/api-client";

export type GenerationStatus =
  | "idle"
  | "generating"
  | "text_complete"
  | "generating_image"
  | "done"
  | "error";

interface GenerateState {
  status: GenerationStatus;
  statusMessage: string;
  trip: GeneratedTrip | null;
  isRegeneratingText: boolean;
  isRegeneratingImage: boolean;
  error: string | null;
}

export function useGenerateDestination() {
  const [state, setState] = useState<GenerateState>({
    status: "idle",
    statusMessage: "",
    trip: null,
    isRegeneratingText: false,
    isRegeneratingImage: false,
    error: null,
  });

  const abortRef = useRef<(() => void) | null>(null);
  const requestRef = useRef<GenerateRequest | null>(null);

  const generate = useCallback((req: GenerateRequest) => {
    // Abort any existing connection
    abortRef.current?.();
    requestRef.current = req;

    setState({
      status: "generating",
      statusMessage: "Starting...",
      trip: null,
      isRegeneratingText: false,
      isRegeneratingImage: false,
      error: null,
    });

    const abort = connectGenerateSSE(req, {
      onStatus: (message) => {
        setState((prev) => ({ ...prev, statusMessage: message }));
      },
      onTextComplete: (event) => {
        setState((prev) => ({
          ...prev,
          status: "text_complete",
          statusMessage: "Creating your travel poster...",
          trip: event.data as GeneratedTrip,
        }));
      },
      onImageComplete: (event) => {
        setState((prev) => ({
          ...prev,
          status: "generating_image",
          trip: prev.trip
            ? { ...prev.trip, imageUrl: event.data?.imageUrl ?? null }
            : null,
        }));
      },
      onDone: (event) => {
        setState((prev) => ({
          ...prev,
          status: "done",
          statusMessage: "",
          trip: event.data as GeneratedTrip,
        }));
      },
      onError: (message) => {
        setState((prev) => ({
          ...prev,
          status: "error",
          statusMessage: "",
          error: message,
        }));
      },
    });

    abortRef.current = abort;
  }, []);

  const regenerateText = useCallback(async () => {
    if (!requestRef.current || !state.trip) return;

    setState((prev) => ({ ...prev, isRegeneratingText: true, error: null }));

    try {
      const destination = await apiRegenerateText(requestRef.current);
      setState((prev) => ({
        ...prev,
        isRegeneratingText: false,
        trip: prev.trip ? { ...prev.trip, destination } : null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isRegeneratingText: false,
        error:
          error instanceof Error ? error.message : "Failed to regenerate text",
      }));
    }
  }, [state.trip]);

  const regenerateImage = useCallback(async () => {
    if (!state.trip) return;

    setState((prev) => ({ ...prev, isRegeneratingImage: true, error: null }));

    try {
      const imageUrl = await apiRegenerateImage(
        state.trip.destination.imagePrompt,
        state.trip.destination.colourPalette
      );
      setState((prev) => ({
        ...prev,
        isRegeneratingImage: false,
        trip: prev.trip ? { ...prev.trip, imageUrl } : null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isRegeneratingImage: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to regenerate image",
      }));
    }
  }, [state.trip]);

  const reset = useCallback(() => {
    abortRef.current?.();
    setState({
      status: "idle",
      statusMessage: "",
      trip: null,
      isRegeneratingText: false,
      isRegeneratingImage: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    generate,
    regenerateText,
    regenerateImage,
    reset,
  };
}
