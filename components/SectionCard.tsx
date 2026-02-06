import Link from "next/link";

export interface SectionCardProps {
  id: string;
  name: string;
  emoji: string;
  level: number;
}

export function SectionCard({ id, name, emoji, level }: SectionCardProps) {
  return (
    <Link
      href={`/play/${id}`}
      className="block bg-white rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 p-6 text-center"
    >
      <span className="text-5xl block mb-3">{emoji}</span>
      <h3 className="text-xl font-bold text-gray-800 mb-1">{name}</h3>
      <p className="text-sm text-gray-500">Level {level}</p>
    </Link>
  );
}
