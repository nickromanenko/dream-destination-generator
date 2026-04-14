"use client";

import type { GeneratedTrip } from "@/lib/types";
import { paletteToCSVars } from "@/lib/colour-utils";
import { HeroImage } from "./HeroImage";
import { WeatherBadge } from "./WeatherBadge";
import { ItineraryTimeline } from "./ItineraryTimeline";
import { InsiderTips } from "./InsiderTips";
import { ColourPalette } from "./ColourPalette";
import { RegenerateButtons } from "./RegenerateButtons";
import { Bookmark, MapPin, Tag } from "lucide-react";

interface DestinationCardProps {
  trip: GeneratedTrip;
  isRegeneratingText: boolean;
  isRegeneratingImage: boolean;
  onRegenerateText: () => void;
  onRegenerateImage: () => void;
  onSave: () => void;
  isSaved: boolean;
}

export function DestinationCard({
  trip,
  isRegeneratingText,
  isRegeneratingImage,
  onRegenerateText,
  onRegenerateImage,
  onSave,
  isSaved,
}: DestinationCardProps) {
  const { destination, imageUrl } = trip;
  const { colourPalette } = destination;
  const cssVars = paletteToCSVars(colourPalette);

  return (
    <div className="animate-fade-in-up" style={cssVars as React.CSSProperties}>
      {/* Action bar */}
      <div className="flex items-center justify-between mb-6">
        <RegenerateButtons
          onRegenerateText={onRegenerateText}
          onRegenerateImage={onRegenerateImage}
          isRegeneratingText={isRegeneratingText}
          isRegeneratingImage={isRegeneratingImage}
        />
        <button
          onClick={onSave}
          disabled={isSaved}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors duration-200 cursor-pointer ${
            isSaved
              ? "border-accent bg-accent/10 text-accent"
              : "border-card-border bg-card hover:bg-foreground/5"
          }`}
        >
          <Bookmark
            className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
          />
          {isSaved ? "Saved" : "Save Trip"}
        </button>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Hero image */}
        <div>
          <HeroImage
            imageUrl={imageUrl}
            destinationName={destination.destination.name}
            palette={colourPalette}
            isLoading={isRegeneratingImage}
          />
        </div>

        {/* Right: Destination info */}
        <div className="space-y-6">
          {/* Destination header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted">
              <MapPin className="w-4 h-4" />
              <span>
                {destination.destination.country} &middot;{" "}
                {destination.destination.continent}
              </span>
            </div>
            <h2
              className="text-4xl sm:text-5xl font-heading font-bold leading-tight"
              style={{ color: "var(--dest-primary)" }}
            >
              {destination.destination.name}
            </h2>
            <p
              className="text-xl font-heading italic"
              style={{ color: "var(--dest-accent)" }}
            >
              {destination.destination.tagline}
            </p>
            <p className="text-foreground/80 leading-relaxed">
              {destination.destination.description}
            </p>
          </div>

          {/* Best for tags */}
          <div className="flex flex-wrap gap-2">
            {destination.destination.bestFor.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border border-dest-accent/30"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--dest-accent) 10%, transparent)",
                  color: "var(--dest-accent)",
                }}
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Weather */}
          <WeatherBadge weather={destination.weather} />

          {/* Colour palette */}
          <ColourPalette palette={colourPalette} />
        </div>
      </div>

      {/* Itinerary */}
      <div className="mt-12">
        <ItineraryTimeline itinerary={destination.itinerary} />
      </div>

      {/* Insider Tips */}
      <div className="mt-12">
        <InsiderTips tips={destination.insiderTips} />
      </div>
    </div>
  );
}
