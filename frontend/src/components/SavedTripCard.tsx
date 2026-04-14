"use client";

import Image from "next/image";
import { X, MapPin } from "lucide-react";
import type { GeneratedTrip } from "@/lib/types";

interface SavedTripCardProps {
  trip: GeneratedTrip;
  onLoad: () => void;
  onDelete: () => void;
}

export function SavedTripCard({ trip, onLoad, onDelete }: SavedTripCardProps) {
  const { destination, imageUrl } = trip;
  const { colourPalette } = destination;

  return (
    <div
      className="relative group rounded-xl overflow-hidden border border-card-border bg-card cursor-pointer hover:border-accent/40 transition-all duration-200"
      onClick={onLoad}
    >
      {/* Thumbnail */}
      <div className="relative h-24 w-full">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={destination.destination.name}
            fill
            className="object-cover"
            sizes="200px"
            unoptimized
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${colourPalette.primary}, ${colourPalette.accent})`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Info */}
      <div className="p-3">
        <h4 className="font-heading font-bold text-sm truncate">
          {destination.destination.name}
        </h4>
        <p className="flex items-center gap-1 text-xs text-muted mt-0.5">
          <MapPin className="w-3 h-3" />
          {destination.destination.country}
        </p>
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer hover:bg-black/70"
        aria-label={`Delete ${destination.destination.name} trip`}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
