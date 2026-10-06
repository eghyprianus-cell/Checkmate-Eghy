import React from 'react';
import type { PieceSymbol, Color } from 'chess.js';
import { ChessPiece } from './ChessPieces';

interface PromotionModalProps {
  color: Color;
  onSelect: (piece: PieceSymbol) => void;
  onCancel?: () => void;
}

export const PromotionModal: React.FC<PromotionModalProps> = ({
  color,
  onSelect,
}) => {
  const pieces: { type: PieceSymbol; label: string; desc: string }[] = [
    { type: 'q', label: 'Ratu Badai (Queen)', desc: 'Kekuatan Halilintar Tertinggi' },
    { type: 'r', label: 'Benteng Tesla (Rook)', desc: 'Menara Peluncur Petir Lurus' },
    { type: 'b', label: 'Uskup Plasma (Bishop)', desc: 'Sorotan Busur Diagonal' },
    { type: 'n', label: 'Kuda Kilat (Knight)', desc: 'Lompatan Listrik Zig-zag' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0a152d]/95 border border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,240,255,0.25)] text-center">
        {/* Electric decorative borders */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#00f0ff]" />
        
        <div className="flex items-center justify-center gap-2 mb-2 text-cyan-400 text-sm font-semibold tracking-wider uppercase font-['Rajdhani']">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          Evolusi Energi Bidak
        </div>

        <h3 className="text-2xl font-bold text-white tracking-wide font-['Chakra_Petch'] mb-1">
          Promosi Pion Halilintar
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Pionmu telah menembus pertahanan lawan. Pilih wujud energi barumu!
        </p>

        <div className="grid grid-cols-2 gap-3">
          {pieces.map((item) => (
            <button
              key={item.type}
              onClick={() => onSelect(item.type)}
              className="group relative flex flex-col items-center justify-center p-4 rounded-xl border border-blue-900/60 bg-blue-950/40 hover:bg-cyan-950/40 hover:border-cyan-400 transition-all duration-200 active:scale-95 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.25)]"
            >
              <div className="w-16 h-16 mb-2 transition-transform duration-200 group-hover:scale-110">
                <ChessPiece type={item.type} color={color} />
              </div>
              <span className="font-semibold text-sm text-cyan-200 group-hover:text-cyan-100 font-['Rajdhani']">
                {item.label}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                {item.desc}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
