import { useState, useEffect, useRef } from "react";

export function useGameTimer(seconds: number, isRunning: boolean) {
  const [timeRemaining, setTimeRemaining] = useState(seconds);
  const startTimeRef = useRef<number>(0);
  const durationRef = useRef(seconds);

  // Reset when seconds changes
  useEffect(() => {
    durationRef.current = seconds;
    setTimeRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!isRunning) return;

    startTimeRef.current = Date.now();
    const startVal = durationRef.current;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, Math.round(startVal - elapsed));
      setTimeRemaining(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning]);

  return { timeRemaining };
}
