"use client";

import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { SHOP_ITEMS } from "@/lib/constants";
import { ShopItem } from "@/components/ShopItem";
import TokenCounter from "@/components/TokenCounter";
import type { CosmeticCategory } from "@/types";

const CATEGORY_LABELS: Record<CosmeticCategory, string> = {
  hat: "Hats",
  scarf: "Scarves",
  background: "Backgrounds",
};

const CATEGORY_ORDER: CosmeticCategory[] = ["hat", "scarf", "background"];

export default function ShopScreen() {
  const { session, purchaseItem, equipItem } = useSession();

  const groupedItems = CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    items: SHOP_ITEMS.filter((item) => item.category === category),
  }));

  return (
    <main className="flex min-h-dvh flex-col items-center bg-gradient-to-b from-sky-200 via-sky-100 to-white px-4 py-8">
      {/* Header with back button and token counter */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <Link
          href="/"
          className="px-4 py-2 rounded-xl bg-white shadow-md text-gray-700 font-bold hover:bg-gray-50 transition-colors"
        >
          Back
        </Link>
        <TokenCounter tokens={session.tokens} />
      </div>

      {/* Penguin preview area */}
      <div className="flex flex-col items-center mb-8">
        <img
          src="/images/penguin.png"
          alt="penguin preview"
          width={100}
          height={100}
          className="drop-shadow-lg"
        />
        <h1 className="text-2xl font-bold text-arctic-800 mt-3">Shop</h1>
      </div>

      {/* Shop items grouped by category */}
      <div className="w-full max-w-2xl space-y-8">
        {groupedItems.map(({ category, label, items }) => (
          <section key={category}>
            <h2 className="text-xl font-bold text-gray-700 mb-4">{label}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {items.map((item) => {
                const isPurchased = session.purchasedItems.includes(item.id);
                const isEquipped = session.equipped[item.category] === item.id;
                const canAfford = session.tokens >= item.cost;

                return (
                  <ShopItem
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    cost={item.cost}
                    emoji={item.emoji}
                    isPurchased={isPurchased}
                    isEquipped={isEquipped}
                    canAfford={canAfford}
                    onBuy={() => purchaseItem(item.id, item.cost)}
                    onEquip={() => equipItem(item.id, item.category)}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
