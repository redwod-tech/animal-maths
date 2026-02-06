"use client";

import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import {
  SHOP_ITEMS,
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  getShopItemById,
} from "@/lib/constants";
import { PenguinAvatar } from "@/components/PenguinAvatar";
import { CollectionItem } from "@/components/CollectionItem";
import TokenCounter from "@/components/TokenCounter";

export default function CollectionsScreen() {
  const { session, equipItem, unequipItem } = useSession();

  const groupedCategories = CATEGORY_ORDER.map((category) => {
    const allInCategory = SHOP_ITEMS.filter((i) => i.category === category);
    const purchasedInCategory = allInCategory.filter((i) =>
      session.purchasedItems.includes(i.id)
    );
    return {
      category,
      label: CATEGORY_LABELS[category],
      total: allInCategory.length,
      purchased: purchasedInCategory,
    };
  });

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

      {/* Penguin avatar showing currently equipped items */}
      <div className="flex flex-col items-center mb-8">
        <PenguinAvatar equipped={session.equipped} size="lg" />
      </div>

      {/* My Collection title */}
      <h1 className="text-2xl font-bold text-arctic-800 mb-6">
        My Collection
      </h1>

      {/* Categories */}
      <div className="w-full max-w-2xl space-y-8">
        {groupedCategories.map(({ category, label, total, purchased }) => (
          <section key={category}>
            <div className="flex items-baseline gap-2 mb-3">
              <h2 className="text-xl font-bold text-gray-700">{label}</h2>
              <span className="text-sm text-gray-500">
                {purchased.length} of {total} collected
              </span>
            </div>

            {purchased.length === 0 ? (
              <p className="text-gray-400 italic">
                No {label.toLowerCase()} yet! Visit the Shop.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {purchased.map((item) => {
                  const isEquipped =
                    session.equipped[item.category] === item.id;
                  return (
                    <CollectionItem
                      key={item.id}
                      emoji={item.emoji}
                      name={item.name}
                      isEquipped={isEquipped}
                      onToggleEquip={() => {
                        if (isEquipped) {
                          unequipItem(item.category);
                        } else {
                          equipItem(item.id, item.category);
                        }
                      }}
                    />
                  );
                })}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Visit Shop link */}
      <Link
        href="/shop"
        className="mt-8 px-8 py-3 rounded-2xl bg-yellow-500 text-white font-bold text-lg hover:bg-yellow-600 transition-colors shadow-md"
      >
        Visit Shop
      </Link>
    </main>
  );
}
