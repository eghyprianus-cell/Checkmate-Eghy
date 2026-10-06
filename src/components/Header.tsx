import React from 'react';
import { Zap, HelpCircle, Clock, Settings } from 'lucide-react';
import type { TimerOption } from '../types';

interface HeaderProps {
  timerOption: TimerOption;
  onSetTimerOption: (opt: TimerOption) => void;
  onOpenRules: () => void;
  onOpenNewGame: () => void;
  onOpenSettings: () => void;
  inCheck: boolean;
  turn: 'w' | 'b';
}

export const Header: React.FC<HeaderProps> = ({
  timerOption,
  onSetTimerOption,
  onOpenRules,
  onOpenNewGame,
  onOpenSettings,
  inCheck,
  turn,
}) => {
  return (
    <header className="relative z-20 w-full border-b border-cyan-500/20 bg-[#050b1a]/90 backdrop-blur-md px-4 py-3">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 shadow-[0_0_20px_#00f0ff] border border-cyan-300">
            <Zap className="w-6 h-6 text-slate-950 fill-white" />
            <div className="absolute inset-0 rounded-xl bg-cyan-400/20 animate-pulse pointer-events-none" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-sky-300 to-blue-400 font-['Chakra_Petch'] tracking-wide">
                PETIR BIRU CHESS
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-widest bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                AZURE THUNDER
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-['Rajdhani'] font-medium">
              Medan Tempur Catur Halilintar Elektrik
            </p>
          </div>
        </div>

        {/* Turn & Status Indicator Banner */}
        <div className="flex items-center gap-2">
          {inCheck && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500 text-red-200 text-xs font-bold font-['Chakra_Petch'] animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.7)]">
              <Zap className="w-3.5 h-3.5 text-red-400 fill-red-400" />
              <span>SKAK / CHECK!</span>
            </div>
          )}

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-cyan-500/30 text-xs text-slate-300 font-['Rajdhani']">
            <span
              className={`w-2 h-2 rounded-full ${
                turn === 'w' ? 'bg-cyan-400 shadow-[0_0_6px_#00f0ff]' : 'bg-blue-600 shadow-[0_0_6px_#2563eb]'
              }`}
            />
            <span className="font-semibold text-white">
              {turn === 'w' ? 'Cahaya Petir (Putih)' : 'Badai Malam (Hitam)'}
            </span>
          </div>

          {/* Timer Selector */}
          <div className="flex items-center gap-1 bg-slate-900/80 border border-blue-900/60 rounded-lg p-0.5">
            <Clock className="w-3.5 h-3.5 ml-1.5 text-cyan-400 shrink-0" />
            <select
              value={timerOption}
              onChange={(e) => onSetTimerOption(e.target.value as TimerOption)}
              aria-label="Pilih Waktu Permainan"
              className="bg-transparent text-xs text-slate-200 font-['Rajdhani'] font-semibold pr-2 py-1 outline-none cursor-pointer"
            >
              <option value="none" className="bg-[#071126] text-slate-200">Tanpa Timer</option>
              <option value="1m" className="bg-[#071126] text-slate-200">1 Menit (Bullet)</option>
              <option value="3m" className="bg-[#071126] text-slate-200">3 Menit (Blitz)</option>
              <option value="5m" className="bg-[#071126] text-slate-200">5 Menit (Rapid)</option>
              <option value="10m" className="bg-[#071126] text-slate-200">10 Menit (Klasik)</option>
            </select>
          </div>

          {/* New Game Button */}
          <button
            onClick={onOpenNewGame}
            aria-label="Mulai Pertempuran Baru"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-[0_0_12px_rgba(0,240,255,0.35)] transition-all cursor-pointer font-['Chakra_Petch'] active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>Game Baru</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            aria-label="Pengaturan Game & Soundtrack"
            title="Pengaturan & Musik Latar"
            className="flex items-center gap-1 p-2 rounded-lg border border-blue-900/60 bg-blue-950/50 hover:bg-cyan-950/50 hover:border-cyan-400 text-slate-300 hover:text-cyan-200 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Help Button */}
          <button
            onClick={onOpenRules}
            aria-label="Panduan Petir Biru"
            title="Panduan Bermain"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-blue-900/60 bg-blue-950/50 hover:bg-cyan-950/50 hover:border-cyan-400 text-slate-300 hover:text-cyan-200 text-xs font-semibold font-['Rajdhani'] transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Panduan</span>
          </button>
        </div>
      </div>
    </header>
  );
};
