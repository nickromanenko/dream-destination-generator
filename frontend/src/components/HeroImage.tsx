"use client";

import Image from "next/image";
import type { ColourPalette } from "@/lib/types";

interface HeroImageProps {
  imageUrl: string | null;
  destinationName: string;
  palette: ColourPalette;
  isLoading?: boolean;
}

export function HeroImage({
  imageUrl,
  destinationName,
  palette,
  isLoading,
}: HeroImageProps) {
  if (isLoading || !imageUrl) {
    return (
      <div
        className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary}, ${palette.accent})`,
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 animate-shimmer opacity-30" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white/60 text-lg font-heading font-semibold text-center px-6">
            {isLoading
              ? "Creating your travel poster..."
              : destinationName}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden group">
      <Image
        src={imageUrl}
        alt={`Travel poster for ${destinationName}`}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
    </div>
  );
}
