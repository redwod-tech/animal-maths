export class AudioQueue {
  private queue: string[] = [];
  private current: HTMLAudioElement | null = null;
  private playing = false;

  enqueue(url: string): void {
    this.queue.push(url);
    if (!this.playing) {
      this.playNext();
    }
  }

  stop(): void {
    this.queue = [];
    if (this.current) {
      this.current.onended = null;
      this.current.onerror = null;
      this.current.pause();
      this.current = null;
    }
    this.playing = false;
  }

  clear(): void {
    this.queue = [];
  }

  private playNext(): void {
    const url = this.queue.shift();
    if (!url) {
      this.playing = false;
      this.current = null;
      return;
    }

    this.playing = true;
    const audio = new Audio(url);
    this.current = audio;

    audio.onended = () => {
      this.playNext();
    };

    audio.onerror = () => {
      this.playNext();
    };

    audio.play().catch(() => {
      this.playNext();
    });
  }
}
