import React from 'react';
import type { PieceSymbol, Color } from 'chess.js';

interface ChessPieceProps {
  type: PieceSymbol;
  color: Color;
  className?: string;
  isStunned?: boolean;
  isShielded?: boolean;
  isInCheck?: boolean;
}

export const ChessPiece: React.FC<ChessPieceProps> = ({
  type,
  color,
  className = '',
  isStunned = false,
  isShielded = false,
  isInCheck = false,
}) => {
  const isWhite = color === 'w';

  // Palette:
  // White: Brilliant Cyan / Azure Spark (#00f5ff, #e0f9ff, intense blue aura)
  // Black: Abyssal Midnight Thunder (#1e293b, electric violet-blue #38bdf8 accents)
  const pieceColor = isWhite ? '#e0f7ff' : '#0c1a30';
  const strokeColor = isWhite ? '#00f0ff' : '#38bdf8';
  const coreGlow = isWhite ? '#38bdf8' : '#2563eb';
  const dropShadow = isWhite
    ? 'drop-shadow(0 0 6px rgba(0, 240, 255, 0.75))'
    : 'drop-shadow(0 0 5px rgba(56, 189, 248, 0.45))';

  const renderIcon = () => {
    switch (type) {
      case 'p':
        // Pawn: Sleek aerodynamic lightning pawn with plasma head
        return (
          <g>
            <circle cx="25" cy="14" r="7.5" fill={pieceColor} stroke={strokeColor} strokeWidth="1.8" />
            {/* Plasma core highlight */}
            <circle cx="25" cy="14" r="3" fill={coreGlow} opacity="0.9" />
            <path
              d="M17 38 C17 32, 21 27, 21 21 L29 21 C29 27, 33 32, 33 38 Z"
              fill={pieceColor}
              stroke={strokeColor}
              strokeWidth="1.8"
            />
            {/* Lightning bolt emblem on body */}
            <path d="M25 24 L23 29 L26.5 29 L24.5 35" fill="none" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
            <path d="M14 42 C14 39, 36 39, 36 42 L38 45 L12 45 Z" fill={pieceColor} stroke={strokeColor} strokeWidth="1.8" />
          </g>
        );

      case 'r':
        // Rook: High-tech electrical fortress / tesla tower
        return (
          <g>
            {/* Crown battlement */}
            <path
              d="M13 14 L13 19 L17 19 L17 16 L21 16 L21 19 L29 19 L29 16 L33 16 L33 19 L37 19 L37 14 Z"
              fill={pieceColor}
              stroke={strokeColor}
              strokeWidth="1.8"
            />
            {/* Main tower */}
            <path
              d="M16 19 L17 38 L33 38 L34 19 Z"
              fill={pieceColor}
              stroke={strokeColor}
              strokeWidth="1.8"
            />
            {/* Tesla emitter vents */}
            <line x1="20" y1="25" x2="30" y2="25" stroke={strokeColor} strokeWidth="1.5" />
            <line x1="22" y1="31" x2="28" y2="31" stroke={strokeColor} strokeWidth="1.5" />
            {/* Center lightning arc */}
            <path d="M25 21 L23.5 28 L26.5 28 L25 35" fill="none" stroke={coreGlow} strokeWidth="1.5" strokeLinecap="round" />
            {/* Base */}
            <path d="M12 39 C12 38, 38 38, 38 39 L40 45 L10 45 Z" fill={pieceColor} stroke={strokeColor} strokeWidth="1.8" />
          </g>
        );

      case 'n':
        // Knight: Electric cyber stallion with crackling mane
        return (
          <g>
            <path
              d="M14 45 L36 45 C36 43, 34 38, 33 34 C36 31, 38 27, 37 20 C36 15, 33 11, 28 9 C26 7, 24 7, 23 9 C20 10, 16 13, 15 18 C14 22, 16 26, 13 28 C11 29, 12 33, 15 32 C17 31, 20 30, 23 31 C21 34, 18 38, 14 45 Z"
              fill={pieceColor}
              stroke={strokeColor}
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            {/* Glowing eye */}
            <circle cx="28" cy="14" r="1.8" fill={coreGlow} />
            {/* Lightning mane serrations */}
            <path d="M23 10 L25 15 L22 17 L25 22 L21 26 L24 30" fill="none" stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" />
            {/* Muzzle vent */}
            <circle cx="16" cy="24" r="1.2" fill={coreGlow} />
          </g>
        );

      case 'b':
        // Bishop: High-voltage plasma conduit with lightning miter
        return (
          <g>
            {/* Top spark sphere */}
            <circle cx="25" cy="8" r="3" fill={coreGlow} stroke={strokeColor} strokeWidth="1.2" />
            {/* Head miter with cut */}
            <path
              d="M25 11 C18 15, 17 25, 21 32 L29 32 C33 25, 32 15, 25 11 Z"
              fill={pieceColor}
              stroke={strokeColor}
              strokeWidth="1.8"
            />
            {/* The slit (miter cut) as a lightning bolt */}
            <path d="M22 18 L27 22 L24 24 L28 28" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
            {/* Collar */}
            <path d="M19 32 L31 32 L32 37 L18 37 Z" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
            {/* Base */}
            <path d="M13 39 C13 38, 37 38, 37 39 L39 45 L11 45 Z" fill={pieceColor} stroke={strokeColor} strokeWidth="1.8" />
          </g>
        );

      case 'q':
        // Queen: Sovereign of the storm with radiant lightning coronet
        return (
          <g>
            {/* Crown spheres */}
            <circle cx="13" cy="13" r="2.2" fill={coreGlow} stroke={strokeColor} strokeWidth="1" />
            <circle cx="19" cy="10" r="2.2" fill={coreGlow} stroke={strokeColor} strokeWidth="1" />
            <circle cx="25" cy="8" r="2.6" fill={coreGlow} stroke={strokeColor} strokeWidth="1.2" />
            <circle cx="31" cy="10" r="2.2" fill={coreGlow} stroke={strokeColor} strokeWidth="1" />
            <circle cx="37" cy="13" r="2.2" fill={coreGlow} stroke={strokeColor} strokeWidth="1" />
            {/* Crown body */}
            <path
              d="M13 15 L16 30 L34 30 L37 15 L31 22 L25 12 L19 22 Z"
              fill={pieceColor}
              stroke={strokeColor}
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            {/* Waist */}
            <path d="M17 31 L33 31 L32 38 L18 38 Z" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
            {/* Inner lightning heart */}
            <path d="M25 20 L23 25 L27 25 L24 30" fill="none" stroke={coreGlow} strokeWidth="1.6" strokeLinecap="round" />
            {/* Base */}
            <path d="M12 40 C12 39, 38 39, 38 40 L40 45 L10 45 Z" fill={pieceColor} stroke={strokeColor} strokeWidth="1.8" />
          </g>
        );

      case 'k':
        // King: Storm Emperor with the grand Thunder Cross
        return (
          <g>
            {/* Cross on top */}
            <line x1="25" y1="6" x2="25" y2="13" stroke={coreGlow} strokeWidth="2.2" strokeLinecap="round" />
            <line x1="21.5" y1="9.5" x2="28.5" y2="9.5" stroke={coreGlow} strokeWidth="2.2" strokeLinecap="round" />
            {/* Crown arched top */}
            <path
              d="M16 16 C16 13, 21 13, 25 14 C29 13, 34 13, 34 16 C36 21, 35 28, 33 32 L17 32 C15 28, 14 21, 16 16 Z"
              fill={pieceColor}
              stroke={strokeColor}
              strokeWidth="1.8"
            />
            {/* Waist */}
            <path d="M17 33 L33 33 L32 38 L18 38 Z" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" />
            {/* Imperial Lightning Sigil */}
            <path d="M25 18 L23 23 L27 23 L24 30" fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />
            {/* Base */}
            <path d="M11 40 C11 39, 39 39, 39 40 L41 45 L9 45 Z" fill={pieceColor} stroke={strokeColor} strokeWidth="1.8" />
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center select-none transition-transform duration-200 pointer-events-none ${className} ${
        isStunned ? 'brightness-75 contrast-125' : ''
      }`}
    >
      <svg
        viewBox="0 0 50 50"
        className="w-[82%] h-[82%] max-w-full max-h-full drop-shadow-md"
        style={{
          filter: isInCheck
            ? 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.9))'
            : isShielded
            ? 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.95))'
            : dropShadow,
        }}
      >
        {renderIcon()}
      </svg>

      {/* Stunned Electric Cage Effect */}
      {isStunned && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg className="w-full h-full animate-pulse opacity-85" viewBox="0 0 50 50">
            <line x1="10" y1="10" x2="40" y2="40" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
            <line x1="40" y1="10" x2="10" y2="40" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
            <circle cx="25" cy="25" r="18" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,2" />
          </svg>
        </div>
      )}

      {/* Ion Shield Forcefield Effect */}
      {isShielded && (
        <div className="absolute inset-1 rounded-full border border-cyan-400 bg-cyan-500/15 animate-ping opacity-75 pointer-events-none" />
      )}

      {/* Check Danger Flare */}
      {isInCheck && (
        <div className="absolute inset-0 rounded-full border-2 border-red-500/80 animate-pulse bg-red-500/10 pointer-events-none shadow-[0_0_15px_rgba(239,68,68,0.7)]" />
      )}
    </div>
  );
};
