import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Eye, Trophy, Zap, AlertCircle } from 'lucide-react';

interface GameOverModalProps {
  winner: 'w' | 'b' | 'draw' | null;
  reason: string;
  moveCount: number;
  gameDuration: string;
  onRematch: () => void;
  onClose: () => void;
  isAI: boolean;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  winner,
  reason,
  moveCount,
  gameDuration,
  onRematch,
  onClose,
  isAI,
}) => {
  useEffect(() => {
    if (winner && winner !== 'draw') {
      // Fire electric blue and cyan confetti celebration
      const colors = ['#00f0ff', '#38bdf8', '#2563eb', '#60a5fa', '#ffffff'];
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors,
      });

      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [winner]);

  const getTitle = () => {
    if (winner === 'draw') return 'PERTEMPURAN IMBANG';
    if (winner === 'w') {
      return isAI ? 'KEMENANGAN ANDA!' : 'CAHAYA PETIR MENANG!';
    }
    return isAI ? 'BADAI AI MENANG!' : 'BADAI MALAM MENANG!';
  };

  const getSubtitle = () => {
    if (winner === 'draw') return reason || 'Medan perang mencapai kestabilan medan statis (Remis).';
    if (winner === 'w') return reason || 'Raja lawan terkurung dalam amukan badai halilintar mutlak!';
    return reason || 'Kekuatan petir lawan berhasil meruntuhkan pertahanan kerajaanmu.';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-[#071126]/95 border-2 border-cyan-500/50 rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,240,255,0.3)] text-center">
        {/* Glow beacon */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00f0ff]" />

        {/* Icon banner */}
        <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center bg-blue-950/80 border border-cyan-400/50 shadow-[0_0_25px_rgba(0,240,255,0.4)] mb-4">
          {winner === 'draw' ? (
            <AlertCircle className="w-9 h-9 text-amber-400 animate-pulse" />
          ) : (
            <Trophy className="w-9 h-9 text-cyan-400 animate-bounce" />
          )}
        </div>

        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-sky-400 tracking-wide font-['Chakra_Petch'] mb-2">
          {getTitle()}
        </h2>

        <p className="text-xs sm:text-sm text-cyan-200/80 mb-6 font-['Rajdhani'] leading-relaxed">
          {getSubtitle()}
        </p>

        {/* Match Statistics */}
        <div className="grid grid-cols-2 gap-3 mb-6 bg-blue-950/40 border border-blue-900/50 rounded-xl p-3 text-left">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Total Langkah</div>
              <div className="text-sm font-bold text-white font-['Rajdhani']">{moveCount} Langkah</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border border-cyan-400/60 flex items-center justify-center text-[10px] text-cyan-300 font-mono">⌛</div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Durasi Pertandingan</div>
              <div className="text-sm font-bold text-white font-['Rajdhani']">{gameDuration}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-blue-800/80 bg-blue-950/50 hover:bg-blue-900/40 text-cyan-300 font-medium text-sm transition-all duration-150 cursor-pointer hover:border-cyan-400 font-['Rajdhani']"
          >
            <Eye className="w-4 h-4" />
            Lihat Papan
          </button>
          <button
            onClick={onRematch}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-150 active:scale-95 cursor-pointer font-['Chakra_Petch']"
          >
            <RotateCcw className="w-4 h-4" />
            Main Lagi
          </button>
        </div>
      </div>
    </div>
  );
};
