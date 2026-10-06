import React from 'react';
import type { Color } from 'chess.js';
import { Zap, Shield, Sparkles } from 'lucide-react';

interface StormPowersProps {
  currentTurn: Color;
  whiteEnergy: number;
  blackEnergy: number;
  selectedPower: 'stun' | 'shield' | null;
  onSelectPower: (power: 'stun' | 'shield' | null) => void;
  isAI: boolean;
  activePowerMode: boolean;
  onTogglePowerMode: () => void;
}

export const StormPowers: React.FC<StormPowersProps> = ({
  currentTurn,
  whiteEnergy,
  blackEnergy,
  selectedPower,
  onSelectPower,
  isAI,
  activePowerMode,
  onTogglePowerMode,
}) => {
  const currentEnergy = currentTurn === 'w' ? whiteEnergy : blackEnergy;
  const isPlayerTurn = !isAI || currentTurn === 'w';

  if (!activePowerMode) {
    return (
      <div className="flex items-center justify-between p-3 rounded-xl bg-blue-950/20 border border-blue-900/40 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>Aturan Catur Standar FIDE aktif</span>
        </div>
        <button
          onClick={onTogglePowerMode}
          className="px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-300 text-xs font-semibold font-['Rajdhani'] transition-all cursor-pointer hover:border-cyan-400"
        >
          Aktifkan Mode Badai ⚡
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-3.5 rounded-2xl bg-gradient-to-b from-blue-950/50 to-[#061024]/80 border border-cyan-500/30 shadow-[0_0_25px_rgba(0,240,255,0.1)]">
      {/* Header & Energy Meter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_#00f0ff]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider font-['Chakra_Petch'] flex items-center gap-1.5">
              <span>Energi Badai Listrik</span>
              <span className="text-[10px] text-cyan-400 font-normal">
                ({currentTurn === 'w' ? 'Cahaya Petir' : 'Badai Malam'})
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-['Rajdhani']">
              Isi daya dengan melangkah (+10%) & memakan bidak (+25%)
            </div>
          </div>
        </div>

        <button
          onClick={onTogglePowerMode}
          className="text-[11px] text-slate-400 hover:text-cyan-300 underline underline-offset-2 transition-colors cursor-pointer font-['Rajdhani']"
        >
          Nonaktifkan
        </button>
      </div>

      {/* Electric Energy Bar */}
      <div className="relative w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-cyan-500/30 p-0.5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-sky-200 transition-all duration-300 shadow-[0_0_12px_#00f0ff]"
          style={{ width: `${Math.min(100, Math.max(0, currentEnergy))}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-end pr-2 text-[9px] font-mono font-bold text-cyan-200 pointer-events-none drop-shadow">
          {Math.floor(currentEnergy)}%
        </div>
      </div>

      {/* Power Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {/* Ability 1: Sambaran Lumpuh */}
        <button
          disabled={!isPlayerTurn || currentEnergy < 40}
          onClick={() => onSelectPower(selectedPower === 'stun' ? null : 'stun')}
          className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
            selectedPower === 'stun'
              ? 'border-amber-400 bg-amber-950/50 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
              : currentEnergy >= 40 && isPlayerTurn
              ? 'border-cyan-500/50 bg-blue-950/40 hover:bg-cyan-950/40 hover:border-cyan-400'
              : 'border-slate-800 bg-slate-900/40 opacity-40 cursor-not-allowed'
          }`}
        >
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate font-['Rajdhani']">
              Sambaran Lumpuh
            </div>
            <div className="text-[10px] text-amber-400/90 font-medium font-mono">
              40% ENERGI · Kunci Bidak Lawan
            </div>
          </div>
        </button>

        {/* Ability 2: Perisai Ionik */}
        <button
          disabled={!isPlayerTurn || currentEnergy < 50}
          onClick={() => onSelectPower(selectedPower === 'shield' ? null : 'shield')}
          className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
            selectedPower === 'shield'
              ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_15px_rgba(0,240,255,0.5)]'
              : currentEnergy >= 50 && isPlayerTurn
              ? 'border-cyan-500/50 bg-blue-950/40 hover:bg-cyan-950/40 hover:border-cyan-400'
              : 'border-slate-800 bg-slate-900/40 opacity-40 cursor-not-allowed'
          }`}
        >
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate font-['Rajdhani']">
              Perisai Ionik
            </div>
            <div className="text-[10px] text-cyan-400 font-medium font-mono">
              50% ENERGI · Kebal Ditangkap
            </div>
          </div>
        </button>
      </div>

      {selectedPower && (
        <div className="text-center py-1 text-xs text-amber-300 bg-amber-950/30 border border-amber-500/30 rounded-lg animate-pulse font-['Rajdhani']">
          {selectedPower === 'stun'
            ? '⚡ Klik bidak musuh di papan untuk melumpuhkannya!'
            : '🛡️ Klik bidak milikmu di papan untuk memberikannya pelindung ion!'}
        </div>
      )}
    </div>
  );
};
