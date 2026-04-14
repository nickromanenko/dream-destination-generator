import { CloudSun, Thermometer, Backpack } from "lucide-react";
import type { Weather } from "@/lib/types";

interface WeatherBadgeProps {
  weather: Weather;
}

export function WeatherBadge({ weather }: WeatherBadgeProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dest-primary/10 text-sm font-medium">
        <Thermometer className="w-3.5 h-3.5" />
        {weather.temperature}
      </span>
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dest-secondary/10 text-sm font-medium">
        <CloudSun className="w-3.5 h-3.5" />
        {weather.conditions}
      </span>
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dest-accent/10 text-sm font-medium">
        <Backpack className="w-3.5 h-3.5" />
        {weather.packingTip}
      </span>
    </div>
  );
}
