"use client";

import { useState, useCallback, useEffect } from "react";
import type { GeneratedTrip } from "@/lib/types";

const STORAGE_KEY = "dream-destinations-saved";
const MAX_TRIPS = 20;

function loadTrips(): GeneratedTrip[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function persistTrips(trips: GeneratedTrip[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  } catch {
    // localStorage may be full
  }
}

export function useSavedTrips() {
  const [savedTrips, setSavedTrips] = useState<GeneratedTrip[]>([]);

  useEffect(() => {
    setSavedTrips(loadTrips());
  }, []);

  const saveTrip = useCallback((trip: GeneratedTrip) => {
    setSavedTrips((prev) => {
      // Don't save duplicates
      if (prev.some((t) => t.id === trip.id)) return prev;
      const updated = [trip, ...prev].slice(0, MAX_TRIPS);
      persistTrips(updated);
      return updated;
    });
  }, []);

  const deleteTrip = useCallback((id: string) => {
    setSavedTrips((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      persistTrips(updated);
      return updated;
    });
  }, []);

  return { savedTrips, saveTrip, deleteTrip };
}
