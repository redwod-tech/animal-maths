"use client";

interface NumberPadProps {
  onDigit: (digit: number) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0] as const;

const BTN_BASE =
  "min-h-16 rounded-xl text-2xl font-bold active:scale-95 transition-transform disabled:opacity-50";

export default function NumberPad({
  onDigit,
  onBackspace,
  onSubmit,
  disabled = false,
}: NumberPadProps) {
  return (
    <div className="grid grid-cols-3 gap-2 w-full max-w-sm mx-auto">
      {DIGITS.map((digit) => (
        <button
          key={digit}
          type="button"
          disabled={disabled}
          onClick={() => onDigit(digit)}
          className={`${BTN_BASE} bg-arctic-200 text-arctic-900`}
        >
          {digit}
        </button>
      ))}
      <button
        type="button"
        disabled={disabled}
        onClick={onBackspace}
        aria-label="Backspace"
        className={`${BTN_BASE} bg-arctic-200 text-arctic-900`}
      >
        ⌫
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={onSubmit}
        aria-label="Submit"
        className={`${BTN_BASE} bg-aurora-green text-arctic-900`}
      >
        ✓
      </button>
    </div>
  );
}
