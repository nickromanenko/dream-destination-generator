"use client";

import { useState, useCallback } from "react";
import { Bookmark, Compass, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GeneratorForm } from "@/components/GeneratorForm";
import { LoadingState } from "@/components/LoadingState";
import { DestinationCard } from "@/components/DestinationCard";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { SavedTripsPanel } from "@/components/SavedTripsPanel";
import { useGenerateDestination } from "@/hooks/useGenerateDestination";
import { useSavedTrips } from "@/hooks/useSavedTrips";
import type { GenerateRequest, GeneratedTrip } from "@/lib/types";

export default function Home() {
  const {
    status,
    statusMessage,
    trip,
    isRegeneratingText,
    isRegeneratingImage,
    error,
    generate,
    regenerateText,
    regenerateImage,
    reset,
  } = useGenerateDestination();

  const { savedTrips, saveTrip, deleteTrip } = useSavedTrips();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [loadedTrip, setLoadedTrip] = useState<GeneratedTrip | null>(null);

  const currentTrip = loadedTrip || trip;
  const isIdle = status === "idle" && !loadedTrip;
  const isLoading =
    status === "generating" ||
    status === "text_complete" ||
    status === "generating_image";
  const isDone = status === "done" || loadedTrip !== null;
  const isError = status === "error";

  const handleSubmit = useCallback(
    (req: GenerateRequest) => {
      setLoadedTrip(null);
      generate(req);
    },
    [generate],
  );

  const handleLoadTrip = useCallback(
    (trip: GeneratedTrip) => {
      setLoadedTrip(trip);
      reset();
      setIsPanelOpen(false);
    },
    [reset],
  );

  const handleBackToForm = useCallback(() => {
    setLoadedTrip(null);
    reset();
  }, [reset]);

  const isSaved = currentTrip
    ? savedTrips.some((t) => t.id === currentTrip.id)
    : false;

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-card-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {(isDone || isError) && (
              <button
                onClick={handleBackToForm}
                className="p-2 rounded-full hover:bg-foreground/10 transition-colors duration-200 cursor-pointer mr-1"
                aria-label="Back to form"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <Compass className="w-6 h-6 text-accent" />
            <h1 className="font-heading font-bold text-xl tracking-tight">
              Dream Destination
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPanelOpen(true)}
              className="relative p-2 rounded-full hover:bg-foreground/10 transition-colors duration-200 cursor-pointer"
              aria-label="Open saved trips"
            >
              <Bookmark className="w-5 h-5" />
              {savedTrips.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                  {savedTrips.length}
                </span>
              )}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {isIdle && (
            <div className="max-w-2xl mx-auto animate-fade-in-up">
              {/* Hero text */}
              <div className="text-center mb-10">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-4">
                  Where will your
                  <br />
                  <span className="text-accent">dreams</span> take you?
                </h2>
                <p className="text-lg text-muted max-w-lg mx-auto">
                  Describe your ideal travel vibe and let AI craft a bespoke
                  destination with a custom travel poster, itinerary, and
                  insider tips.
                </p>
              </div>

              <GeneratorForm onSubmit={handleSubmit} isGenerating={false} />
            </div>
          )}

          {isLoading && (
            <LoadingState status={status} statusMessage={statusMessage} />
          )}

          {isError && (
            <ErrorDisplay
              message={error || "An unexpected error occurred"}
              onRetry={handleBackToForm}
            />
          )}

          {isDone && currentTrip && (
            <DestinationCard
              trip={currentTrip}
              isRegeneratingText={isRegeneratingText}
              isRegeneratingImage={isRegeneratingImage}
              onRegenerateText={regenerateText}
              onRegenerateImage={regenerateImage}
              onSave={() => saveTrip(currentTrip)}
              isSaved={isSaved}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-card-border py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-xs text-muted">
          Dream Destination Generator &middot; Designed & Developed by{" "}
          <a href="mailto:nick.romanenko@gmail.com">Nick</a>
        </div>
      </footer>

      {/* Saved trips panel */}
      <SavedTripsPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        savedTrips={savedTrips}
        onLoadTrip={handleLoadTrip}
        onDeleteTrip={deleteTrip}
      />
    </>
  );
}
