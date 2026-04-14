"use client";

import { RefreshCw, Type, ImageIcon } from "lucide-react";

interface RegenerateButtonsProps {
  onRegenerateText: () => void;
  onRegenerateImage: () => void;
  isRegeneratingText: boolean;
  isRegeneratingImage: boolean;
}

export function RegenerateButtons({
  onRegenerateText,
  onRegenerateImage,
  isRegeneratingText,
  isRegeneratingImage,
}: RegenerateButtonsProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onRegenerateText}
        disabled={isRegeneratingText || isRegeneratingImage}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-card-border bg-card text-sm font-medium hover:bg-foreground/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
      >
        {isRegeneratingText ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <Type className="w-4 h-4" />
        )}
        {isRegeneratingText ? "Regenerating..." : "Regenerate Text"}
      </button>
      <button
        onClick={onRegenerateImage}
        disabled={isRegeneratingText || isRegeneratingImage}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-card-border bg-card text-sm font-medium hover:bg-foreground/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
      >
        {isRegeneratingImage ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <ImageIcon className="w-4 h-4" />
        )}
        {isRegeneratingImage ? "Regenerating..." : "Regenerate Image"}
      </button>
    </div>
  );
}
