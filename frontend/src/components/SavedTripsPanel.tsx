"use client";

import { X, Bookmark } from "lucide-react";
import type { GeneratedTrip } from "@/lib/types";
import { SavedTripCard } from "./SavedTripCard";

interface SavedTripsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  savedTrips: GeneratedTrip[];
  onLoadTrip: (trip: GeneratedTrip) => void;
  onDeleteTrip: (id: string) => void;
}

export function SavedTripsPanel({
  isOpen,
  onClose,
  savedTrips,
  onLoadTrip,
  onDeleteTrip,
}: SavedTripsPanelProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background border-l border-card-border z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-card-border">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-accent" />
            <h2 className="font-heading font-bold text-lg">Saved Trips</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-foreground/10 transition-colors duration-200 cursor-pointer"
            aria-label="Close saved trips panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-65px)]">
          {savedTrips.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bookmark className="w-10 h-10 text-muted/40 mb-3" />
              <p className="text-sm text-muted">No saved trips yet.</p>
              <p className="text-xs text-muted/60 mt-1">
                Generate a destination and save it!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {savedTrips.map((trip) => (
                <SavedTripCard
                  key={trip.id}
                  trip={trip}
                  onLoad={() => onLoadTrip(trip)}
                  onDelete={() => onDeleteTrip(trip.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
