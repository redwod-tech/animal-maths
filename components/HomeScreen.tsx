"use client";

import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { SECTIONS } from "@/lib/constants";
import { SectionCard } from "@/components/SectionCard";
import TokenCounter from "@/components/TokenCounter";

export default function HomeScreen() {
  const { session } = useSession();

  return (
    <main className="flex min-h-dvh flex-col items-center bg-gradient-to-b from-sky-200 via-sky-100 to-white px-4 py-8">
      {/* Token counter */}
      <div className="w-full max-w-2xl flex justify-end mb-4">
        <TokenCounter tokens={session.tokens} />
      </div>

      {/* Penguin avatar */}
      <div className="flex flex-col items-center mb-8">
        <img
          src="/images/penguin.png"
          alt="penguin avatar"
          width={120}
          height={120}
          className="drop-shadow-lg"
        />
        <h1 className="text-3xl font-bold text-arctic-800 mt-4">
          Animal Maths
        </h1>
      </div>

      {/* Section cards grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl mb-8">
        {SECTIONS.map((section) => (
          <SectionCard
            key={section.id}
            id={section.id}
            name={section.name}
            emoji={section.emoji}
            level={session.sections[section.id].level}
          />
        ))}
      </div>

      {/* Shop link */}
      <Link
        href="/shop"
        className="px-8 py-3 rounded-2xl bg-yellow-500 text-white font-bold text-lg hover:bg-yellow-600 transition-colors shadow-md"
      >
        Shop
      </Link>
    </main>
  );
}
