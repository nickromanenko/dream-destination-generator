import { MessageCircle, UtensilsCrossed, Gem, Heart } from "lucide-react";
import type { InsiderTips as InsiderTipsType } from "@/lib/types";

interface InsiderTipsProps {
  tips: InsiderTipsType;
}

export function InsiderTips({ tips }: InsiderTipsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-heading font-bold text-dest-primary">
        Insider Tips
      </h3>

      {/* Local phrase */}
      <div className="bg-dest-primary/5 border border-dest-primary/10 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <MessageCircle className="w-5 h-5 text-dest-accent shrink-0 mt-0.5" />
          <div>
            <p className="font-heading text-xl font-bold text-dest-primary">
              &ldquo;{tips.localPhrase}&rdquo;
            </p>
            <p className="text-sm text-muted mt-1">
              {tips.phraseTranslation} &middot;{" "}
              <span className="italic">{tips.phrasePronunciation}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Must-try dishes */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <UtensilsCrossed className="w-4 h-4 text-dest-accent" />
          <h4 className="font-semibold text-sm uppercase tracking-wider text-foreground/60">
            Must-Try Dishes
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tips.mustTryDishes.map((dish) => (
            <div
              key={dish.name}
              className="bg-card border border-card-border rounded-xl p-4 cursor-pointer hover:border-dest-accent/40 transition-colors duration-200"
            >
              <div className="flex items-start justify-between">
                <h5 className="font-semibold text-foreground">{dish.name}</h5>
                <span className="text-xs font-medium text-muted bg-background px-2 py-0.5 rounded-full">
                  {dish.priceRange}
                </span>
              </div>
              <p className="text-sm text-muted mt-1">{dish.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Hidden gem + Cultural tip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card border border-card-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Gem className="w-4 h-4 text-dest-accent" />
            <h4 className="font-semibold text-sm uppercase tracking-wider text-foreground/60">
              Hidden Gem
            </h4>
          </div>
          <p className="text-sm text-foreground/90">{tips.hiddenGem}</p>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-dest-accent" />
            <h4 className="font-semibold text-sm uppercase tracking-wider text-foreground/60">
              Cultural Tip
            </h4>
          </div>
          <p className="text-sm text-foreground/90">{tips.culturalTip}</p>
        </div>
      </div>
    </div>
  );
}
