import type { CosmeticCategory } from "@/types";
import { getShopItemById } from "@/lib/constants";

interface PenguinAvatarProps {
  equipped: Record<CosmeticCategory, string | null>;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
};

export function PenguinAvatar({ equipped, size = "md" }: PenguinAvatarProps) {
  const hatItem = equipped.hat ? getShopItemById(equipped.hat) : null;
  const scarfItem = equipped.scarf ? getShopItemById(equipped.scarf) : null;
  const bgItem = equipped.background
    ? getShopItemById(equipped.background)
    : null;

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      {/* Background overlay - behind penguin */}
      {bgItem && (
        <span
          data-testid="cosmetic-background"
          className="absolute inset-0 flex items-center justify-center text-5xl opacity-30 pointer-events-none"
        >
          {bgItem.emoji}
        </span>
      )}

      {/* Penguin image */}
      <img
        src="/images/penguin.png"
        alt="penguin avatar"
        className="relative z-10 w-full h-full object-contain drop-shadow-lg"
      />

      {/* Hat overlay - top center */}
      {hatItem && (
        <span
          data-testid="cosmetic-hat"
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 z-20 text-2xl pointer-events-none"
        >
          {hatItem.emoji}
        </span>
      )}

      {/* Scarf overlay - neck area */}
      {scarfItem && (
        <span
          data-testid="cosmetic-scarf"
          className="absolute bottom-1/4 left-1/2 -translate-x-1/2 z-20 text-xl pointer-events-none"
        >
          {scarfItem.emoji}
        </span>
      )}
    </div>
  );
}
