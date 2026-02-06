export function speakText(text: string): void {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  speechSynthesis.speak(utterance);
}

export function speakSteps(steps: string[]): void {
  for (const step of steps) {
    speakText(step);
  }
}

export function stopSpeaking(): void {
  speechSynthesis.cancel();
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
