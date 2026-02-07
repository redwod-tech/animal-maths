"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { SECTIONS } from "@/lib/constants";
import { SectionCard } from "@/components/SectionCard";
import { PenguinAvatar } from "@/components/PenguinAvatar";
import TokenCounter from "@/components/TokenCounter";

export default function HomeScreen() {
  const { session, setUserName } = useSession();
  const [nameInput, setNameInput] = useState("");

  const handleNameSubmit = () => {
    const trimmed = nameInput.trim();
    if (trimmed) {
      setUserName(trimmed);
    }
  };

  return (
    <main className="flex min-h-dvh flex-col items-center bg-gradient-to-b from-sky-200 via-sky-100 to-white px-4 py-8">
      {/* Token counter */}
      <div className="w-full max-w-2xl flex justify-end mb-4">
        <TokenCounter tokens={session.tokens} />
      </div>

      {/* Penguin avatar */}
      <div className="flex flex-col items-center mb-8">
        <PenguinAvatar equipped={session.equipped} size="lg" />
        {session.userName ? (
          <h1 className="text-3xl font-bold text-arctic-800 mt-4">
            Welcome, {session.userName}!
          </h1>
        ) : (
          <h1 className="text-3xl font-bold text-arctic-800 mt-4">
            Animal Maths
          </h1>
        )}
      </div>

      {/* Name input for first-time users */}
      {!session.userName && (
        <div className="w-full max-w-md mb-8 flex gap-2">
          <input
            type="text"
            placeholder="What's your name?"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-arctic-200 text-lg focus:outline-none focus:border-arctic-500"
          />
          <button
            onClick={handleNameSubmit}
            className="px-6 py-3 rounded-xl bg-arctic-700 text-white font-bold text-lg hover:bg-arctic-800 transition-colors"
          >
            Go!
          </button>
        </div>
      )}

      {/* Section cards grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl mb-8">
        {SECTIONS.map((section) => {
          let subtitle: string | undefined;
          if (section.id === "multiplication" && session.multiplicationData) {
            const { bestScores } = session.multiplicationData;
            const maxSingle = Math.max(0, ...Object.values(bestScores.single));
            const best = Math.max(maxSingle, bestScores.mixed, bestScores.boss);
            if (best > 0) {
              subtitle = `Best: ${best}`;
            }
          }
          return (
            <SectionCard
              key={section.id}
              id={section.id}
              name={section.name}
              emoji={section.emoji}
              level={session.sections[section.id].level}
              subtitle={subtitle}
            />
          );
        })}
      </div>

      {/* My Collection link */}
      <Link
        href="/collections"
        className="px-8 py-3 rounded-2xl bg-arctic-600 text-white font-bold text-lg hover:bg-arctic-700 transition-colors shadow-md mb-4"
      >
        My Collection
      </Link>

      {/* Arctic Explorer link */}
      <Link
        href="/explore"
        className="px-8 py-3 rounded-2xl bg-teal-500 text-white font-bold text-lg hover:bg-teal-600 transition-colors shadow-md mb-4"
      >
        Arctic Explorer
      </Link>

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
