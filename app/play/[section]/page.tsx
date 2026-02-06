import PlayScreen from "@/components/PlayScreen";
import type { MathSection } from "@/types";

interface PlayPageProps {
  params: Promise<{ section: string }>;
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { section } = await params;
  return <PlayScreen section={section as MathSection} />;
}
