function playSound(path: string): void {
  const audio = new Audio(path);
  audio.play().catch(() => {
    // Silently ignore playback errors (e.g. user hasn't interacted yet)
  });
}

export function playCorrectSound(): void {
  playSound("/sounds/correct.mp3");
}

export function playWrongSound(): void {
  playSound("/sounds/wrong.mp3");
}

export function playCelebrateSound(): void {
  playSound("/sounds/celebrate.mp3");
}

export function unlockAudio(): void {
  // iOS Safari requires a user-initiated play() to unlock audio.
  // Play a silent/short audio to unlock the audio context.
  const audio = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=");
  audio.play().catch(() => {
    // Ignore errors
  });
}
