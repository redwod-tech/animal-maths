interface CollectionItemProps {
  emoji: string;
  name: string;
  isEquipped: boolean;
  onToggleEquip: () => void;
}

export function CollectionItem({
  emoji,
  name,
  isEquipped,
  onToggleEquip,
}: CollectionItemProps) {
  return (
    <button
      onClick={onToggleEquip}
      aria-label={isEquipped ? `Remove ${name}` : `Wear ${name}`}
      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-colors ${
        isEquipped
          ? "border-arctic-500 bg-arctic-50"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <span className="text-3xl">{emoji}</span>
      <span className="text-sm font-medium text-gray-700">{name}</span>
      {isEquipped && (
        <span className="text-xs font-bold text-arctic-600 bg-arctic-100 px-2 py-0.5 rounded-full">
          Equipped
        </span>
      )}
    </button>
  );
}
