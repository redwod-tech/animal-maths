"use client";

export interface ShopItemProps {
  id: string;
  name: string;
  cost: number;
  emoji: string;
  isPurchased: boolean;
  isEquipped: boolean;
  canAfford: boolean;
  onBuy: () => void;
  onEquip: () => void;
}

export function ShopItem({
  name,
  cost,
  emoji,
  isPurchased,
  isEquipped,
  canAfford,
  onBuy,
  onEquip,
}: ShopItemProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center gap-2">
      <span className="text-4xl">{emoji}</span>
      <h3 className="text-lg font-bold text-gray-800">{name}</h3>
      <p className="text-sm font-semibold text-yellow-600">{cost} tokens</p>

      {isPurchased && isEquipped && (
        <span className="min-h-12 flex items-center text-sm font-semibold text-aurora-green">
          Wearing
        </span>
      )}

      {isPurchased && !isEquipped && (
        <button
          onClick={onEquip}
          className="min-h-12 px-6 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors"
        >
          Wear
        </button>
      )}

      {!isPurchased && (
        <button
          onClick={canAfford ? onBuy : undefined}
          disabled={!canAfford}
          className={`min-h-12 px-6 py-2 rounded-xl font-bold transition-colors ${
            canAfford
              ? "bg-yellow-500 text-white hover:bg-yellow-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Buy
        </button>
      )}
    </div>
  );
}
