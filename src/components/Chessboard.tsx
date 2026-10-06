import React from 'react';
import type { Chess, Square, PieceSymbol, Color } from 'chess.js';
import { ChessPiece } from './ChessPieces';
import type { StormState, BoardTheme } from '../types';

interface ChessboardProps {
  game: Chess;
  isFlipped: boolean;
  selectedSquare: Square | null;
  validDestinations: Square[];
  lastMove: { from: Square; to: Square } | null;
  hintMove: { from: Square; to: Square } | null;
  stormState: StormState;
  boardTheme?: BoardTheme;
  onSquareClick: (sq: Square) => void;
  onDropMove?: (from: Square, to: Square) => void;
  boardContainerRef: React.RefObject<HTMLDivElement | null>;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export const Chessboard: React.FC<ChessboardProps> = ({
  game,
  isFlipped,
  selectedSquare,
  validDestinations,
  lastMove,
  hintMove,
  stormState,
  boardTheme = 'cyan',
  onSquareClick,
  onDropMove,
  boardContainerRef,
}) => {
  const ranks = isFlipped ? [...RANKS].reverse() : RANKS;
  const files = isFlipped ? [...FILES].reverse() : FILES;

  const inCheck = game.inCheck();
  const turn = game.turn();

  // Find King square for check warning
  let checkKingSquare: Square | null = null;
  if (inCheck) {
    const board = game.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p.type === 'k' && p.color === turn) {
          checkKingSquare = `${String.fromCharCode(97 + c)}${8 - r}` as Square;
        }
      }
    }
  }

  // Color theme palettes
  const getThemeColors = (isLight: boolean) => {
    switch (boardTheme) {
      case 'sapphire':
        return isLight ? 'bg-[#122856]' : 'bg-[#08122c]';
      case 'arctic':
        return isLight ? 'bg-[#153450]' : 'bg-[#09182a]';
      case 'cyan':
      default:
        return isLight ? 'bg-[#0f244a]' : 'bg-[#060e22]';
    }
  };

  const handleDragStart = (e: React.DragEvent, square: Square) => {
    const piece = game.get(square);
    if (!piece || piece.color !== game.turn()) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', square);
    e.dataTransfer.effectAllowed = 'move';
    onSquareClick(square);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetSquare: Square) => {
    e.preventDefault();
    const fromSquare = e.dataTransfer.getData('text/plain') as Square;
    if (fromSquare && onDropMove && fromSquare !== targetSquare) {
      onDropMove(fromSquare, targetSquare);
    }
  };

  return (
    <div
      ref={boardContainerRef}
      className="relative aspect-square w-full max-w-[620px] mx-auto select-none rounded-2xl p-2 sm:p-3 bg-gradient-to-b from-[#091a3e] via-[#050d20] to-[#040817] border-2 border-cyan-500/40 shadow-[0_0_50px_rgba(0,240,255,0.2)] transition-all duration-300"
    >
      {/* Outer lightning circuit accents */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none border border-cyan-400/20 shadow-[inset_0_0_20px_rgba(0,240,255,0.15)]" />

      {/* 4 Corner Electric Rune Accents */}
      <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
      <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
      <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
      <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

      {/* Grid container */}
      <div className="w-full h-full grid grid-cols-8 grid-rows-8 rounded-xl overflow-hidden border border-blue-900/60 shadow-inner">
        {ranks.map((rank, rankIdx) =>
          files.map((file, fileIdx) => {
            const square = `${file}${rank}` as Square;
            const piece = game.get(square);
            const isLight = (fileIdx + rankIdx) % 2 === 0;

            const isSelected = selectedSquare === square;
            const isValidDest = validDestinations.includes(square);
            const isLastMoveFrom = lastMove?.from === square;
            const isLastMoveTo = lastMove?.to === square;
            const isHint = hintMove?.from === square || hintMove?.to === square;
            const isCheckSquare = checkKingSquare === square;
            const isStunned = stormState.stunnedSquare === square;
            const isShielded = stormState.shieldedSquare === square;

            // Highlight backgrounds
            let bgClass = getThemeColors(isLight);
            if (isSelected) {
              bgClass = 'bg-cyan-900/75 shadow-[inset_0_0_18px_#00f0ff]';
            } else if (isLastMoveFrom || isLastMoveTo) {
              bgClass = isLight ? 'bg-blue-900/65' : 'bg-blue-950/85';
            }

            return (
              <div
                key={square}
                onClick={() => onSquareClick(square)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, square)}
                data-square={square}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSquareClick(square);
                  }
                }}
                aria-label={`Petak ${square}${piece ? ` berisi ${piece.color === 'w' ? 'putih' : 'hitam'} ${piece.type}` : ''}`}
                className={`relative w-full h-full flex items-center justify-center p-0.5 transition-colors duration-150 cursor-pointer ${bgClass} focus:outline-none`}
              >
                {/* Last move indicator tint */}
                {(isLastMoveFrom || isLastMoveTo) && (
                  <div className="absolute inset-0 bg-cyan-400/10 pointer-events-none border border-cyan-400/25" />
                )}

                {/* Selected square electric frame */}
                {isSelected && (
                  <div className="absolute inset-0 border-2 border-cyan-300 shadow-[0_0_14px_#00f0ff] pointer-events-none z-10 animate-pulse" />
                )}

                {/* Hint highlight */}
                {isHint && (
                  <div className="absolute inset-0 border-2 border-amber-400 shadow-[0_0_14px_#fbbf24] pointer-events-none z-10 animate-ping opacity-75" />
                )}

                {/* Move destination marker */}
                {isValidDest && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    {piece ? (
                      // Capture target marker: red/cyan targeting ring
                      <div className="w-[82%] h-[82%] rounded-full border-2 border-cyan-400/80 bg-red-500/20 shadow-[0_0_12px_rgba(0,240,255,0.6)] animate-pulse" />
                    ) : (
                      // Move destination marker: soft glowing plasma bead
                      <div className="w-3.5 h-3.5 rounded-full bg-cyan-400/80 shadow-[0_0_10px_#00f0ff] animate-pulse" />
                    )}
                  </div>
                )}

                {/* Piece representation with Drag & Drop capability */}
                {piece && (
                  <div
                    draggable={piece.color === game.turn()}
                    onDragStart={(e) => handleDragStart(e, square)}
                    className={`relative w-full h-full flex items-center justify-center z-10 ${
                      piece.color === game.turn() ? 'cursor-grab active:cursor-grabbing hover:scale-105 transition-transform' : ''
                    }`}
                  >
                    <ChessPiece
                      type={piece.type as PieceSymbol}
                      color={piece.color as Color}
                      isStunned={isStunned}
                      isShielded={isShielded}
                      isInCheck={isCheckSquare}
                    />
                  </div>
                )}

                {/* Board Rank Label (on left-most column) */}
                {fileIdx === 0 && (
                  <span className="absolute top-0.5 left-1 text-[9px] font-mono font-semibold text-cyan-400/50 pointer-events-none select-none">
                    {rank}
                  </span>
                )}

                {/* Board File Label (on bottom-most row) */}
                {rankIdx === 7 && (
                  <span className="absolute bottom-0.5 right-1 text-[9px] font-mono font-semibold text-cyan-400/50 pointer-events-none select-none">
                    {file}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
