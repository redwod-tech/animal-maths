import { AudioQueue } from "@/lib/audio-queue";

const queue = new AudioQueue();

async function fetchTtsAudio(text: string): Promise<string | null> {
  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) return null;

    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

function speakViaWebSpeech(text: string): void {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  speechSynthesis.speak(utterance);
}

export async function speakText(text: string): Promise<void> {
  const url = await fetchTtsAudio(text);
  if (url) {
    queue.enqueue(url);
  } else {
    speakViaWebSpeech(text);
  }
}

export async function speakSteps(steps: string[]): Promise<void> {
  // Fetch all steps in parallel
  const results = await Promise.all(
    steps.map((step) => fetchTtsAudio(step).then((url) => ({ step, url })))
  );

  // Enqueue results sequentially, falling back for failures
  for (const { step, url } of results) {
    if (url) {
      queue.enqueue(url);
    } else {
      speakViaWebSpeech(step);
    }
  }
}

export function stopSpeaking(): void {
  queue.stop();
  if (typeof speechSynthesis !== "undefined") {
    speechSynthesis.cancel();
  }
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
