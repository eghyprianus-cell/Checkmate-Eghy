import React, { useRef, useEffect } from 'react';
import type { Color, PieceSymbol } from 'chess.js';
import type { AIDifficulty, GameMode, MoveLog } from '../types';
import { ChessPiece } from './ChessPieces';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Undo2, 
  Lightbulb, 
  ArrowLeftRight, 
  Bot, 
  Users, 
  Sparkles,
  Zap,
  Flag,
  Handshake,
  PlusCircle
} from 'lucide-react';

interface GameSidebarProps {
  gameMode: GameMode;
  onSetGameMode: (mode: GameMode) => void;
  difficulty: AIDifficulty;
  onSetDifficulty: (diff: AIDifficulty) => void;
  moveHistory: MoveLog[];
  turn: Color;
  whiteTime: number;
  blackTime: number;
  timerMode: string;
  materialDiff: number;
  whiteCaptures: PieceSymbol[];
  blackCaptures: PieceSymbol[];
  aiTaunt: string | null;
  isMuted: boolean;
  onToggleMute: () => void;
  onUndo: () => void;
  onRestart: () => void;
  onHint: () => void;
  onFlipBoard: () => void;
  onResign: () => void;
  onOfferDraw: () => void;
  onOpenNewGame: () => void;
  isFlipped: boolean;
  canUndo: boolean;
  isAIThinking?: boolean;
}

export const GameSidebar: React.FC<GameSidebarProps> = ({
  gameMode,
  onSetGameMode,
  difficulty,
  onSetDifficulty,
  moveHistory,
  turn,
  whiteTime,
  blackTime,
  timerMode,
  materialDiff,
  whiteCaptures,
  blackCaptures,
  aiTaunt,
  isMuted,
  onToggleMute,
  onUndo,
  onRestart,
  onHint,
  onFlipBoard,
  onResign,
  onOfferDraw,
  onOpenNewGame,
  isFlipped,
  canUndo,
  isAIThinking = false,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moveHistory]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // Group moves into pairs (White move, Black move)
  const pairedMoves: { num: number; white?: MoveLog; black?: MoveLog }[] = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    pairedMoves.push({
      num: Math.floor(i / 2) + 1,
      white: moveHistory[i],
      black: moveHistory[i + 1],
    });
  }

  return (
    <div className="flex flex-col h-full gap-3 text-slate-200">
      {/* Top Header Controls: Mode & Mute */}
      <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-blue-950/40 border border-blue-900/60">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-lg border border-blue-900/40">
          <button
            onClick={() => onSetGameMode('vs-ai')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer font-['Rajdhani'] ${
              gameMode === 'vs-ai'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            Lawan AI
          </button>
          <button
            onClick={() => onSetGameMode('pass-and-play')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer font-['Rajdhani'] ${
              gameMode === 'pass-and-play'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            2 Pemain
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
            className="p-2 rounded-lg border border-blue-900/60 bg-blue-950/60 hover:bg-blue-900/50 hover:border-cyan-400 text-slate-300 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
          <button
            onClick={onFlipBoard}
            aria-label="Balik Papan"
            title="Balik Perspektif Papan"
            className={`p-2 rounded-lg border border-blue-900/60 bg-blue-950/60 hover:bg-blue-900/50 hover:border-cyan-400 transition-colors cursor-pointer ${
              isFlipped ? 'text-cyan-400 border-cyan-500/50' : 'text-slate-300'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Difficulty selector (when playing AI) */}
      {gameMode === 'vs-ai' && (
        <div className="flex items-center justify-between p-2 rounded-xl bg-blue-950/30 border border-blue-900/50 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-['Rajdhani']">
            Tingkat Kesulitan:
          </span>
          <div className="flex items-center gap-1">
            {(['novice', 'intermediate', 'master'] as AIDifficulty[]).map((level) => {
              const label =
                level === 'novice' ? 'Percikan' : level === 'intermediate' ? 'Badai' : 'Petir Abadi';
              const isSelected = difficulty === level;
              return (
                <button
                  key={level}
                  onClick={() => onSetDifficulty(level)}
                  className={`px-2 py-0.5 text-[11px] font-bold rounded font-['Rajdhani'] transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_8px_#00f0ff]'
                      : 'text-slate-400 hover:text-cyan-300 bg-slate-900/50'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Thinking or Speech Bubble */}
      {gameMode === 'vs-ai' && (
        isAIThinking ? (
          <div className="relative p-2.5 rounded-xl bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-400/60 shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center gap-2.5 animate-pulse">
            <div className="p-1.5 rounded-lg bg-cyan-400/30 text-cyan-200 shrink-0">
              <Zap className="w-4 h-4 fill-cyan-300 animate-bounce" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-cyan-300 font-['Rajdhani'] tracking-wider flex items-center gap-1.5">
                <span>AI Sedang Berpikir</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <div className="text-xs text-white font-medium font-['Chakra_Petch'] leading-snug">
                Mengkalkulasi busur halilintar terbaik...
              </div>
            </div>
          </div>
        ) : aiTaunt ? (
          <div className="relative p-2.5 rounded-xl bg-gradient-to-r from-blue-950/80 to-slate-900/80 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.15)] flex items-start gap-2.5 animate-in fade-in duration-200">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 shrink-0 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-cyan-400 font-['Rajdhani'] tracking-wider">
                Resonansi Halilintar AI
              </div>
              <div className="text-xs text-white/95 italic font-['Chakra_Petch'] leading-snug">
                &ldquo;{aiTaunt}&rdquo;
              </div>
            </div>
          </div>
        ) : null
      )}

      {/* Timers & Players Status */}
      <div className="grid grid-cols-2 gap-2">
        {/* White / Azure Player */}
        <div
          className={`p-2.5 rounded-xl border transition-all duration-200 ${
            turn === 'w'
              ? 'bg-blue-950/80 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
              : 'bg-slate-900/60 border-blue-950'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff]" />
              <span className="text-xs font-bold text-white font-['Rajdhani']">
                Cahaya Petir (Putih)
              </span>
            </div>
            {materialDiff > 0 && (
              <span className="text-[10px] font-bold text-cyan-400 font-mono">
                +{materialDiff / 100}
              </span>
            )}
          </div>

          {/* Captured pieces */}
          <div className="flex items-center gap-0.5 h-5 overflow-hidden">
            {whiteCaptures.map((p, idx) => (
              <div key={idx} className="w-4 h-4 shrink-0 opacity-85">
                <ChessPiece type={p} color="b" />
              </div>
            ))}
          </div>

          {timerMode !== 'none' && (
            <div className={`mt-1 font-mono text-base font-bold ${turn === 'w' ? 'text-cyan-300' : 'text-slate-400'}`}>
              {formatTime(whiteTime)}
            </div>
          )}
        </div>

        {/* Black / Midnight Player */}
        <div
          className={`p-2.5 rounded-xl border transition-all duration-200 ${
            turn === 'b'
              ? 'bg-blue-950/80 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
              : 'bg-slate-900/60 border-blue-950'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-[0_0_6px_#2563eb]" />
              <span className="text-xs font-bold text-white font-['Rajdhani']">
                Badai Malam (Hitam)
              </span>
            </div>
            {materialDiff < 0 && (
              <span className="text-[10px] font-bold text-cyan-400 font-mono">
                +{Math.abs(materialDiff) / 100}
              </span>
            )}
          </div>

          {/* Captured pieces */}
          <div className="flex items-center gap-0.5 h-5 overflow-hidden">
            {blackCaptures.map((p, idx) => (
              <div key={idx} className="w-4 h-4 shrink-0 opacity-85">
                <ChessPiece type={p} color="w" />
              </div>
            ))}
          </div>

          {timerMode !== 'none' && (
            <div className={`mt-1 font-mono text-base font-bold ${turn === 'b' ? 'text-cyan-300' : 'text-slate-400'}`}>
              {formatTime(blackTime)}
            </div>
          )}
        </div>
      </div>

      {/* Move History Log */}
      <div className="flex-1 flex flex-col min-h-[140px] max-h-[220px] rounded-xl bg-slate-950/60 border border-blue-950 overflow-hidden">
        <div className="flex items-center justify-between px-3 py-1.5 bg-blue-950/50 border-b border-blue-950 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-['Rajdhani']">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Riwayat Sambaran</span>
          </div>
          <span>{moveHistory.length} Langkah</span>
        </div>

        <div ref={scrollRef} className="flex-1 p-2 overflow-y-auto font-mono text-xs space-y-1">
          {pairedMoves.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 italic text-[11px] font-['Rajdhani']">
              Papan siap. Sambaran pertama menanti.
            </div>
          ) : (
            pairedMoves.map((pair) => (
              <div
                key={pair.num}
                className="grid grid-cols-[30px_1fr_1fr] items-center gap-1 py-0.5 px-1.5 rounded hover:bg-blue-950/40 text-[11px]"
              >
                <span className="text-slate-500 font-semibold">{pair.num}.</span>
                <span className="text-cyan-300 font-medium">
                  {pair.white?.san}
                  {pair.white?.isCheck && <span className="text-red-400 font-bold ml-0.5">+</span>}
                </span>
                <span className="text-blue-300 font-medium">
                  {pair.black ? (
                    <>
                      {pair.black.san}
                      {pair.black.isCheck && <span className="text-red-400 font-bold ml-0.5">+</span>}
                    </>
                  ) : (
                    '-'
                  )}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Primary Actions: Hint, Undo, New Game */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onHint}
          className="flex flex-col items-center justify-center py-2 px-2 rounded-xl bg-blue-950/40 border border-blue-900/60 hover:bg-cyan-950/40 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer font-['Rajdhani'] font-semibold text-xs active:scale-95"
          title="Tampilkan Kilatan Langkah Terbaik"
        >
          <Lightbulb className="w-4 h-4 mb-0.5 text-cyan-400" />
          <span>Petunjuk</span>
        </button>

        <button
          disabled={!canUndo}
          onClick={onUndo}
          className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl border font-['Rajdhani'] font-semibold text-xs transition-all ${
            canUndo
              ? 'bg-blue-950/40 border-blue-900/60 hover:bg-blue-900/40 hover:border-cyan-400 text-slate-300 cursor-pointer active:scale-95'
              : 'bg-slate-950/40 border-slate-900 text-slate-600 cursor-not-allowed'
          }`}
          title="Tarik Kembali Langkah Terakhir"
        >
          <Undo2 className="w-4 h-4 mb-0.5" />
          <span>Tarik</span>
        </button>

        <button
          onClick={onOpenNewGame}
          className="flex flex-col items-center justify-center py-2 px-2 rounded-xl bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/50 hover:border-cyan-300 text-cyan-200 transition-all cursor-pointer font-['Rajdhani'] font-semibold text-xs active:scale-95 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
          title="Konfigurasi Pertandingan Baru"
        >
          <PlusCircle className="w-4 h-4 mb-0.5 text-cyan-300" />
          <span>Game Baru</span>
        </button>
      </div>

      {/* Secondary Actions: Offer Draw, Resign */}
      <div className="grid grid-cols-2 gap-2 pt-0.5">
        <button
          onClick={onOfferDraw}
          className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-blue-950/30 border border-blue-900/50 hover:bg-blue-900/40 hover:border-blue-700 text-slate-400 hover:text-slate-200 text-xs font-semibold font-['Rajdhani'] transition-colors cursor-pointer"
          title="Tawarkan Hasil Remis"
        >
          <Handshake className="w-3.5 h-3.5" />
          <span>Tawar Remis</span>
        </button>

        <button
          onClick={onResign}
          className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-red-950/20 border border-red-950 hover:bg-red-950/40 hover:border-red-800 text-red-400/80 hover:text-red-300 text-xs font-semibold font-['Rajdhani'] transition-colors cursor-pointer"
          title="Menyerah pada Giliran Ini"
        >
          <Flag className="w-3.5 h-3.5" />
          <span>Menyerah</span>
        </button>
      </div>
    </div>
  );
};
