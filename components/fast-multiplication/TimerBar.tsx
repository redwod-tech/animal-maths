"use client";

interface TimerBarProps {
  timeRemaining: number;
  totalTime: number;
}

export function TimerBar({ timeRemaining, totalTime }: TimerBarProps) {
  const pct = Math.max(0, (timeRemaining / totalTime) * 100);
  const color =
    pct > 50 ? "bg-green-500" : pct > 25 ? "bg-yellow-400" : "bg-red-500";

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <div className="h-4 flex-1 bg-gray-200 rounded-full overflow-hidden mr-3">
          <div
            data-testid="timer-bar"
            className={`h-full ${color} transition-all duration-200 rounded-full`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-lg font-bold text-gray-700 min-w-[3rem] text-right">
          {timeRemaining}s
        </span>
      </div>
    </div>
  );
}
