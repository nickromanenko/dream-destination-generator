import { Sunrise, Sun, Moon, DollarSign } from "lucide-react";
import type { ItineraryDay } from "@/lib/types";

interface ItineraryTimelineProps {
  itinerary: ItineraryDay[];
}

export function ItineraryTimeline({ itinerary }: ItineraryTimelineProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-heading font-bold text-dest-primary">
        Your Itinerary
      </h3>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-dest-accent/30" />

        <div className="space-y-6">
          {itinerary.map((day, index) => (
            <div
              key={day.day}
              className="relative pl-14 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
            >
              {/* Timeline dot */}
              <div
                className="absolute left-4 top-1 w-5 h-5 rounded-full border-2 border-dest-accent flex items-center justify-center text-[10px] font-bold"
                style={{
                  backgroundColor: "var(--dest-accent)",
                  color: "var(--dest-background)",
                }}
              >
                {day.day}
              </div>

              <div className="bg-card border border-card-border rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-lg">
                    Day {day.day}: {day.title}
                  </h4>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-muted bg-background px-2 py-1 rounded-full">
                    <DollarSign className="w-3 h-3" />
                    {day.estimatedCost}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="flex gap-2">
                    <Sunrise className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-foreground/60 text-xs uppercase tracking-wider">
                        Morning
                      </span>
                      <p className="text-foreground/90">{day.morning}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Sun className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-foreground/60 text-xs uppercase tracking-wider">
                        Afternoon
                      </span>
                      <p className="text-foreground/90">{day.afternoon}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Moon className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-foreground/60 text-xs uppercase tracking-wider">
                        Evening
                      </span>
                      <p className="text-foreground/90">{day.evening}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
