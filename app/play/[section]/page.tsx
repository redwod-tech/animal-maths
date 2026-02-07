import PlayScreen from "@/components/PlayScreen";
import FastMultiplyScreen from "@/components/fast-multiplication/FastMultiplyScreen";
import type { MathSection } from "@/types";

interface PlayPageProps {
  params: Promise<{ section: string }>;
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { section } = await params;

  if (section === "multiplication") {
    return <FastMultiplyScreen />;
  }

  return <PlayScreen section={section as MathSection} />;
}
