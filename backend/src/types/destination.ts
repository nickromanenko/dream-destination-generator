export type TravelStyle =
  | "adventure"
  | "relaxation"
  | "cultural"
  | "romantic"
  | "family"
  | "solo-backpacking";

export type Season = "spring" | "summer" | "autumn" | "winter";

export type BudgetTier = "budget" | "mid-range" | "luxury";

export interface DestinationDetails {
  name: string;
  country: string;
  continent: string;
  tagline: string;
  description: string;
  bestFor: string[];
}

export interface Weather {
  temperature: string;
  conditions: string;
  packingTip: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  estimatedCost: string;
}

export interface InsiderTips {
  localPhrase: string;
  phraseTranslation: string;
  phrasePronunciation: string;
  mustTryDishes: Array<{
    name: string;
    description: string;
    priceRange: string;
  }>;
  hiddenGem: string;
  culturalTip: string;
}

export interface ColourPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface DestinationResponse {
  destination: DestinationDetails;
  weather: Weather;
  itinerary: ItineraryDay[];
  insiderTips: InsiderTips;
  imagePrompt: string;
  colourPalette: ColourPalette;
}

export interface GeneratedTrip {
  id: string;
  createdAt: string;
  request: GenerateRequest;
  destination: DestinationResponse;
  imageUrl: string | null;
}

export interface GenerateRequest {
  vibe: string;
  travelStyle: TravelStyle;
  season: Season;
  budgetTier: BudgetTier;
}

export interface RegenerateTextRequest extends GenerateRequest {}

export interface RegenerateImageRequest {
  imagePrompt: string;
  colourPalette: ColourPalette;
}
