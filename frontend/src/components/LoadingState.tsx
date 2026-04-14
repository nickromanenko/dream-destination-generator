"use client";

import { Globe, Plane, Camera, MapPin, Check } from "lucide-react";
import type { GenerationStatus } from "@/hooks/useGenerateDestination";

interface LoadingStateProps {
  status: GenerationStatus;
  statusMessage: string;
}

const STEPS = [
  { icon: Globe, label: "Analyzing your travel vibe", key: "generating" },
  { icon: MapPin, label: "Finding your dream destination", key: "text_complete" },
  { icon: Camera, label: "Creating your travel poster", key: "generating_image" },
];

export function LoadingState({ status, statusMessage }: LoadingStateProps) {
  const currentStepIndex =
    status === "generating"
      ? 0
      : status === "text_complete"
        ? 1
        : status === "generating_image"
          ? 2
          : 0;

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
      {/* Animated plane */}
      <div className="relative mb-10">
        <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center">
          <Plane className="w-10 h-10 text-accent animate-pulse-glow" />
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-accent/20 animate-ping" />
      </div>

      {/* Status message */}
      <p className="text-lg font-medium text-foreground mb-8">{statusMessage}</p>

      {/* Progress steps */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        {STEPS.map((step, index) => {
          const isComplete = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const Icon = step.icon;

          return (
            <div
              key={step.key}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isComplete
                  ? "bg-green-500/10 text-green-600 dark:text-green-400"
                  : isCurrent
                    ? "bg-accent/10 text-accent"
                    : "bg-card text-muted"
              }`}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                {isComplete ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon
                    className={`w-5 h-5 ${isCurrent ? "animate-pulse-glow" : ""}`}
                  />
                )}
              </div>
              <span className="text-sm font-medium">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
