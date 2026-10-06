import React from 'react';

interface EvalBarProps {
  scoreCentipawns: number; // Positive = White ahead, Negative = Black ahead
  isFlipped: boolean;
  isCheckmate?: boolean;
  turn: 'w' | 'b';
}

export const EvalBar: React.FC<EvalBarProps> = ({
  scoreCentipawns,
  isFlipped,
  isCheckmate = false,
  turn,
}) => {
  // Convert score to percentage (0% to 100% white advantage)
  // Standard sigmoid mapping: 50% + 50% * (2 / (1 + exp(-0.004 * score)) - 1)
  let whitePercent = 50;

  if (isCheckmate) {
    whitePercent = turn === 'w' ? 0 : 100;
  } else {
    // Sigmoid curve around centipawns
    const val = scoreCentipawns / 100; // in pawns
    const clamped = Math.max(-12, Math.min(12, val));
    whitePercent = 50 + (clamped / 12) * 45;
    whitePercent = Math.max(5, Math.min(95, whitePercent));
  }

  // Display label
  const pawnScore = (scoreCentipawns / 100).toFixed(1);
  const displayScore = isCheckmate
    ? turn === 'w'
      ? '-M'
      : '+M'
    : scoreCentipawns > 0
    ? `+${pawnScore}`
    : `${pawnScore}`;

  // If flipped, invert bar percentage
  const heightPercent = isFlipped ? 100 - whitePercent : whitePercent;

  return (
    <div
      className="hidden md:flex flex-col items-center justify-between w-6 sm:w-7 h-full min-h-[420px] max-h-[620px] rounded-full p-0.5 bg-[#050c1e] border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.15)] relative overflow-hidden select-none"
      title={`Evaluasi Posisi: ${displayScore}`}
    >
      {/* Top half (Midnight Storm / Black) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#09152e] to-[#040817]" />

      {/* Bottom half (Azure Lightning / White) */}
      <div
        className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-cyan-400 via-sky-300 to-blue-500 transition-all duration-500 ease-out shadow-[0_0_15px_#00f0ff]"
        style={{ height: `${heightPercent}%` }}
      />

      {/* Center divider line */}
      <div className="absolute top-1/2 inset-x-0 h-0.5 bg-cyan-200/40 pointer-events-none -translate-y-1/2 z-10" />

      {/* Score label badge (positioned near middle or top/bottom) */}
      <div className="relative z-20 my-auto px-1 py-0.5 rounded bg-black/75 border border-cyan-400/40 backdrop-blur-sm shadow-md">
        <span className="text-[10px] font-mono font-bold text-cyan-200">
          {displayScore}
        </span>
      </div>
    </div>
  );
};
