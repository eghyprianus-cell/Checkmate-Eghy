import React, { useState } from 'react';
import { Bot, Users, Play, X, Zap } from 'lucide-react';
import type { AIDifficulty, GameMode, PlayerSide, TimerOption, BoardTheme } from '../types';

interface NewGameModalProps {
  currentMode: GameMode;
  currentDifficulty: AIDifficulty;
  currentSide: PlayerSide;
  currentTimer: TimerOption;
  currentPowerMode: boolean;
  currentTheme: BoardTheme;
  onStartGame: (config: {
    mode: GameMode;
    difficulty: AIDifficulty;
    side: PlayerSide;
    timer: TimerOption;
    powerMode: boolean;
    theme: BoardTheme;
  }) => void;
  onClose: () => void;
}

export const NewGameModal: React.FC<NewGameModalProps> = ({
  currentMode,
  currentDifficulty,
  currentSide,
  currentTimer,
  currentPowerMode,
  currentTheme,
  onStartGame,
  onClose,
}) => {
  const [mode, setMode] = useState<GameMode>(currentMode);
  const [difficulty, setDifficulty] = useState<AIDifficulty>(currentDifficulty);
  const [side, setSide] = useState<PlayerSide>(currentSide);
  const [timer, setTimer] = useState<TimerOption>(currentTimer);
  const [powerMode, setPowerMode] = useState<boolean>(currentPowerMode);
  const [theme, setTheme] = useState<BoardTheme>(currentTheme);

  const handleConfirm = () => {
    onStartGame({
      mode,
      difficulty,
      side,
      timer,
      powerMode,
      theme,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#07132c]/95 border-2 border-cyan-500/40 rounded-2xl p-5 sm:p-6 shadow-[0_0_50px_rgba(0,240,255,0.25)] text-slate-100 font-['Rajdhani']">
        {/* Glow Header bar */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-blue-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_#00f0ff]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-['Chakra_Petch'] tracking-wide">
                Mulai Pertempuran Baru
              </h2>
              <p className="text-xs text-slate-400">
                Atur konfigurasi papan catur dan tingkat lawan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-blue-900/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* 1. Mode Permainan */}
          <div>
            <label className="text-xs font-bold text-cyan-300 uppercase tracking-wider block mb-1.5">
              1. Mode Permainan
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('vs-ai')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                  mode === 'vs-ai'
                    ? 'border-cyan-400 bg-cyan-950/50 text-white shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                    : 'border-blue-950 bg-slate-900/40 text-slate-400 hover:text-white'
                }`}
              >
                <Bot className="w-4 h-4 text-cyan-400" />
                Lawan AI Petir
              </button>
              <button
                type="button"
                onClick={() => setMode('pass-and-play')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                  mode === 'pass-and-play'
                    ? 'border-cyan-400 bg-cyan-950/50 text-white shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                    : 'border-blue-950 bg-slate-900/40 text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4 text-cyan-400" />
                2 Pemain (1 Layar)
              </button>
            </div>
          </div>

          {/* 2. Pilihan Sisi (Bidak) */}
          <div>
            <label className="text-xs font-bold text-cyan-300 uppercase tracking-wider block mb-1.5">
              2. Sisi Pemain
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSide('w')}
                className={`flex flex-col items-center p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  side === 'w'
                    ? 'border-cyan-400 bg-cyan-950/50 text-white shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                    : 'border-blue-950 bg-slate-900/40 text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#00f0ff] mb-1" />
                <span>Putih (Cahaya)</span>
              </button>
              <button
                type="button"
                onClick={() => setSide('b')}
                className={`flex flex-col items-center p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  side === 'b'
                    ? 'border-cyan-400 bg-cyan-950/50 text-white shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                    : 'border-blue-950 bg-slate-900/40 text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-blue-600 shadow-[0_0_6px_#2563eb] mb-1" />
                <span>Hitam (Badai)</span>
              </button>
              <button
                type="button"
                onClick={() => setSide('random')}
                className={`flex flex-col items-center p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  side === 'random'
                    ? 'border-cyan-400 bg-cyan-950/50 text-white shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                    : 'border-blue-950 bg-slate-900/40 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-sm leading-none mb-1">🎲</span>
                <span>Acak</span>
              </button>
            </div>
          </div>

          {/* 3. Tingkat AI (jika Vs AI) */}
          {mode === 'vs-ai' && (
            <div>
              <label className="text-xs font-bold text-cyan-300 uppercase tracking-wider block mb-1.5">
                3. Tingkat Kekuatan AI
              </label>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { id: 'novice', label: 'Percikan Api', elo: '~900 ELO' },
                  { id: 'intermediate', label: 'Badai Petir', elo: '~1500 ELO' },
                  { id: 'master', label: 'Petir Abadi', elo: '~2000 ELO' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDifficulty(item.id as AIDifficulty)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      difficulty === item.id
                        ? 'border-cyan-400 bg-cyan-950/50 text-white shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                        : 'border-blue-950 bg-slate-900/40 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[10px] text-cyan-400 font-mono">{item.elo}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. Kontrol Waktu */}
          <div>
            <label className="text-xs font-bold text-cyan-300 uppercase tracking-wider block mb-1.5">
              4. Kontrol Waktu
            </label>
            <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
              {[
                { id: 'none', label: 'Bebas' },
                { id: '1m', label: '1 Menit' },
                { id: '3m', label: '3 Menit' },
                { id: '5m', label: '5 Menit' },
                { id: '10m', label: '10 Menit' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTimer(item.id as TimerOption)}
                  className={`p-2 rounded-xl border font-semibold transition-all cursor-pointer ${
                    timer === item.id
                      ? 'border-cyan-400 bg-cyan-950/50 text-cyan-200'
                      : 'border-blue-950 bg-slate-900/40 text-slate-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Variasi Tema Visual Papan */}
          <div>
            <label className="text-xs font-bold text-cyan-300 uppercase tracking-wider block mb-1.5">
              5. Variasi Nuansa Petir
            </label>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {[
                { id: 'cyan', label: 'Cyan Elektrik', color: '#00f0ff' },
                { id: 'sapphire', label: 'Safir Kobalt', color: '#3b82f6' },
                { id: 'arctic', label: 'Plasma Arktik', color: '#7dd3fc' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTheme(item.id as BoardTheme)}
                  className={`p-2 rounded-xl border font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    theme === item.id
                      ? 'border-cyan-400 bg-cyan-950/50 text-white'
                      : 'border-blue-950 bg-slate-900/40 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Mode Badai Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-blue-950/40 border border-blue-900/50">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                Mode Kekuatan Badai
              </div>
              <div className="text-[11px] text-slate-400">
                Fitur skill Sambaran Lumpuh & Perisai Ionik
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPowerMode(!powerMode)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer border ${
                powerMode ? 'bg-cyan-500 border-cyan-400' : 'bg-slate-800 border-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-slate-950 absolute top-0.5 transition-transform ${
                  powerMode ? 'translate-x-6 bg-white shadow-[0_0_8px_#00f0ff]' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center gap-3 pt-4 mt-2 border-t border-blue-900/60">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-blue-900/60 bg-blue-950/40 hover:bg-blue-900/50 text-slate-300 text-sm font-semibold cursor-pointer transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(0,240,255,0.4)] cursor-pointer transition-transform active:scale-95 font-['Chakra_Petch']"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            Mulai Permainan
          </button>
        </div>
      </div>
    </div>
  );
};
