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

let cachedVoice: SpeechSynthesisVoice | null = null;

function getBestVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice;
  const voices = speechSynthesis.getVoices();
  // Prefer natural-sounding voices available in Chrome/Safari
  const preferred = [
    "Google US English",
    "Google UK English Female",
    "Samantha",          // macOS / iOS
    "Karen",             // macOS / iOS
    "Microsoft Zira",    // Windows
    "Microsoft Jenny",   // Windows
  ];
  for (const name of preferred) {
    const match = voices.find((v) => v.name === name);
    if (match) {
      cachedVoice = match;
      return match;
    }
  }
  // Fallback: any English voice
  const english = voices.find((v) => v.lang.startsWith("en"));
  if (english) {
    cachedVoice = english;
    return english;
  }
  return null;
}

function speakViaWebSpeech(text: string): void {
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = getBestVoice();
  if (voice) utterance.voice = voice;
  utterance.rate = 0.85;
  utterance.pitch = 1.1;
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
