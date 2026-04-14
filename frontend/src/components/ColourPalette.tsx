import type { ColourPalette as ColourPaletteType } from "@/lib/types";
import { getContrastColour } from "@/lib/colour-utils";

interface ColourPaletteProps {
  palette: ColourPaletteType;
}

export function ColourPalette({ palette }: ColourPaletteProps) {
  const colours = [
    { name: "Primary", hex: palette.primary },
    { name: "Secondary", hex: palette.secondary },
    { name: "Accent", hex: palette.accent },
    { name: "Background", hex: palette.background },
    { name: "Text", hex: palette.text },
  ];

  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-2">
        Colour Palette
      </h4>
      <div className="flex rounded-xl overflow-hidden h-10">
        {colours.map((colour) => (
          <div
            key={colour.name}
            className="flex-1 flex items-center justify-center cursor-pointer group relative"
            style={{ backgroundColor: colour.hex }}
            title={`${colour.name}: ${colour.hex}`}
          >
            <span
              className="text-[10px] font-mono font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ color: getContrastColour(colour.hex) }}
            >
              {colour.hex}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
