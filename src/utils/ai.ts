import { Chess, type Square } from 'chess.js';
import type { AIDifficulty } from '../types';

// Standard Piece-Square Tables (PST) favoring center control and dynamic tactical placement
const PAWN_PST = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
  5,  5, 10, 25, 25, 10,  5,  5,
  0,  0,  0, 20, 20,  0,  0,  0,
  5, -5,-10,  0,  0,-10, -5,  5,
  5, 10, 10,-20,-20, 10, 10,  5,
  0,  0,  0,  0,  0,  0,  0,  0
];

const KNIGHT_PST = [
 -50,-40,-30,-30,-30,-30,-40,-50,
 -40,-20,  0,  0,  0,  0,-20,-40,
 -30,  0, 10, 15, 15, 10,  0,-30,
 -30,  5, 15, 20, 20, 15,  5,-30,
 -30,  0, 15, 20, 20, 15,  0,-30,
 -30,  5, 10, 15, 15, 10,  5,-30,
 -40,-20,  0,  5,  5,  0,-20,-40,
 -50,-40,-30,-30,-30,-30,-40,-50
];

const BISHOP_PST = [
 -20,-10,-10,-10,-10,-10,-10,-20,
 -10,  0,  0,  0,  0,  0,  0,-10,
 -10,  0,  5, 10, 10,  5,  0,-10,
 -10,  5,  5, 10, 10,  5,  5,-10,
 -10,  0, 10, 10, 10, 10,  0,-10,
 -10, 10, 10, 10, 10, 10, 10,-10,
 -10,  5,  0,  0,  0,  0,  5,-10,
 -20,-10,-10,-10,-10,-10,-10,-20
];

const ROOK_PST = [
  0,  0,  0,  0,  0,  0,  0,  0,
  5, 10, 10, 10, 10, 10, 10,  5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
  0,  0,  0,  5,  5,  0,  0,  0
];

const QUEEN_PST = [
 -20,-10,-10, -5, -5,-10,-10,-20,
 -10,  0,  0,  0,  0,  0,  0,-10,
 -10,  0,  5,  5,  5,  5,  0,-10,
  -5,  0,  5,  5,  5,  5,  0, -5,
   0,  0,  5,  5,  5,  5,  0, -5,
 -10,  5,  5,  5,  5,  5,  0,-10,
 -10,  0,  5,  0,  0,  0,  0,-10,
 -20,-10,-10, -5, -5,-10,-10,-20
];

const KING_PST_MID = [
 -30,-40,-40,-50,-50,-40,-40,-30,
 -30,-40,-40,-50,-50,-40,-40,-30,
 -30,-40,-40,-50,-50,-40,-40,-30,
 -30,-40,-40,-50,-50,-40,-40,-30,
 -20,-30,-30,-40,-40,-30,-30,-20,
 -10,-20,-20,-20,-20,-20,-20,-10,
  20, 20,  0,  0,  0,  0, 20, 20,
  20, 30, 10,  0,  0, 10, 30, 20
];

const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

export function evaluateBoard(game: Chess): number {
  let score = 0;
  const board = game.board();

  for (let r = 0; r < 8; r++) {
    const row = board[r];
    for (let c = 0; c < 8; c++) {
      const piece = row[c];
      if (!piece) continue;

      const val = PIECE_VALUES[piece.type] || 0;
      const isWhite = piece.color === 'w';
      const idx = isWhite ? r * 8 + c : (7 - r) * 8 + c;

      let pstBonus = 0;
      switch (piece.type) {
        case 'p': pstBonus = PAWN_PST[idx] || 0; break;
        case 'n': pstBonus = KNIGHT_PST[idx] || 0; break;
        case 'b': pstBonus = BISHOP_PST[idx] || 0; break;
        case 'r': pstBonus = ROOK_PST[idx] || 0; break;
        case 'q': pstBonus = QUEEN_PST[idx] || 0; break;
        case 'k': pstBonus = KING_PST_MID[idx] || 0; break;
      }

      const totalVal = val + pstBonus;
      if (isWhite) {
        score += totalVal;
      } else {
        score -= totalVal;
      }
    }
  }

  return score;
}

// Alpha-Beta Minimax with candidate move pruning for locked 60fps performance
function minimax(
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (depth === 0 || game.isGameOver()) {
    if (game.isCheckmate()) {
      return isMaximizing ? -100000 : 100000;
    }
    if (game.isDraw()) {
      return 0;
    }
    return evaluateBoard(game);
  }

  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return 0;

  // Move ordering: sort captures and checks first
  moves.sort((a, b) => {
    const aVal = a.captured ? PIECE_VALUES[a.captured] * 2 : 0;
    const bVal = b.captured ? PIECE_VALUES[b.captured] * 2 : 0;
    return bVal - aVal;
  });

  // Prune branching factor at deeper levels to avoid thread lockups
  const maxCandidates = depth >= 2 ? Math.min(moves.length, 14) : moves.length;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let i = 0; i < maxCandidates; i++) {
      const move = moves[i];
      game.move({ from: move.from, to: move.to, promotion: move.promotion || 'q' });
      const evalVal = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, evalVal);
      alpha = Math.max(alpha, evalVal);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < maxCandidates; i++) {
      const move = moves[i];
      game.move({ from: move.from, to: move.to, promotion: move.promotion || 'q' });
      const evalVal = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, evalVal);
      beta = Math.min(beta, evalVal);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export interface BestMoveResult {
  from: Square;
  to: Square;
  promotion?: string;
  taunt?: string;
}

const AI_TAUNTS: Record<AIDifficulty, string[]> = {
  novice: [
    'Percikan petir kecil mulai berkobar!',
    'Langkah listrik sederhana tapi gesit!',
    'Arus listrik mengalir perlahan...',
    'Awas, jangan remehkan percikan ini!',
  ],
  intermediate: [
    'Kilat menyambar pertahananmu!',
    'Arus tegangan tinggi sedang dipersiapkan!',
    'Badai biru mulai mengepung petakmu!',
    'Strategi halilintar membakar papan!',
    'Ion negatif menyatu di barisan depanmu!',
  ],
  master: [
    'Petir Abadi telah menghitung takdirmu!',
    'Kekuatan 100.000 volt menyelimuti raja!',
    'Tak ada benteng yang tahan terhadap badai ini!',
    'Skakmat adalah keniscayaan dalam pusaran badai!',
    'Hawa plasma biru membumihanguskan setiap celah!',
  ],
};

export function getAIMove(
  game: Chess,
  difficulty: AIDifficulty,
  stunnedSquare: Square | null = null,
  shieldedSquare: Square | null = null
): BestMoveResult | null {
  try {
    const searchGame = new Chess(game.fen());
    const legalMoves = searchGame.moves({ verbose: true });
    
    if (legalMoves.length === 0) return null;

    // Filter out moves from stunned square and moves capturing a shielded square
    let validMoves = legalMoves;
    if (stunnedSquare) {
      const filtered = validMoves.filter((m) => m.from !== stunnedSquare);
      if (filtered.length > 0) validMoves = filtered;
    }
    if (shieldedSquare) {
      const filtered = validMoves.filter((m) => m.to !== shieldedSquare);
      if (filtered.length > 0) validMoves = filtered;
    }

    if (validMoves.length === 0) {
      const fallback = legalMoves[0];
      return { from: fallback.from, to: fallback.to, promotion: fallback.promotion || 'q' };
    }

    const taunts = AI_TAUNTS[difficulty] || AI_TAUNTS.intermediate;
    const randomTaunt = taunts[Math.floor(Math.random() * taunts.length)];

    // 1. Novice Level: mostly simple or random with slight preference for captures
    if (difficulty === 'novice') {
      if (Math.random() < 0.4) {
        const chosen = validMoves[Math.floor(Math.random() * validMoves.length)];
        return { from: chosen.from, to: chosen.to, promotion: chosen.promotion || 'q', taunt: randomTaunt };
      }

      let bestMove = validMoves[0];
      let bestScore = searchGame.turn() === 'w' ? -Infinity : Infinity;

      for (const move of validMoves) {
        searchGame.move({ from: move.from, to: move.to, promotion: move.promotion || 'q' });
        const score = evaluateBoard(searchGame);
        searchGame.undo();
        if (searchGame.turn() === 'w' && score > bestScore) {
          bestScore = score;
          bestMove = move;
        } else if (searchGame.turn() === 'b' && score < bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
      return { from: bestMove.from, to: bestMove.to, promotion: bestMove.promotion || 'q', taunt: randomTaunt };
    }

    // 2. Intermediate Level: Depth 2 Minimax
    if (difficulty === 'intermediate') {
      let bestMove = validMoves[0];
      const isWhite = searchGame.turn() === 'w';
      let bestScore = isWhite ? -Infinity : Infinity;

      for (const move of validMoves) {
        searchGame.move({ from: move.from, to: move.to, promotion: move.promotion || 'q' });
        const score = minimax(searchGame, 2, -Infinity, Infinity, !isWhite);
        searchGame.undo();

        if (isWhite && score > bestScore) {
          bestScore = score;
          bestMove = move;
        } else if (!isWhite && score < bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }

      return { from: bestMove.from, to: bestMove.to, promotion: bestMove.promotion || 'q', taunt: randomTaunt };
    }

    // 3. Master Level: Depth 3 Minimax with Move Ordering & Pruning
    const isWhite = searchGame.turn() === 'w';
    let bestMove = validMoves[0];
    let bestScore = isWhite ? -Infinity : Infinity;

    // Prioritize captures and checks
    const sortedMoves = [...validMoves].sort((a, b) => {
      const aVal = a.captured ? PIECE_VALUES[a.captured] * 2 : 0;
      const bVal = b.captured ? PIECE_VALUES[b.captured] * 2 : 0;
      return bVal - aVal;
    });

    const candidates = sortedMoves.slice(0, 16);

    for (const move of candidates) {
      searchGame.move({ from: move.from, to: move.to, promotion: move.promotion || 'q' });
      const score = minimax(searchGame, 2, -Infinity, Infinity, !isWhite);
      searchGame.undo();

      if (isWhite && score > bestScore) {
        bestScore = score;
        bestMove = move;
      } else if (!isWhite && score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return { from: bestMove.from, to: bestMove.to, promotion: bestMove.promotion || 'q', taunt: randomTaunt };
  } catch (err) {
    console.error('getAIMove calculation fallback:', err);
    const fallbackMoves = game.moves({ verbose: true });
    if (fallbackMoves.length > 0) {
      const fb = fallbackMoves[0];
      return { from: fb.from, to: fb.to, promotion: fb.promotion || 'q' };
    }
    return null;
  }
}

export function getHintMove(game: Chess): { from: Square; to: Square } | null {
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;

  const isWhite = game.turn() === 'w';
  let bestMove = moves[0];
  let bestScore = isWhite ? -Infinity : Infinity;

  for (const move of moves) {
    game.move(move);
    const score = minimax(game, 2, -Infinity, Infinity, !isWhite);
    game.undo();

    if (isWhite && score > bestScore) {
      bestScore = score;
      bestMove = move;
    } else if (!isWhite && score < bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return { from: bestMove.from, to: bestMove.to };
}

export function calculateMaterialAdvantage(fen: string): { white: number; black: number; diff: number } {
  let whiteMaterial = 0;
  let blackMaterial = 0;

  const piecePositionPart = fen.split(' ')[0];
  for (const char of piecePositionPart) {
    const lower = char.toLowerCase();
    const val = PIECE_VALUES[lower] || 0;
    if (val === 20000 || val === 0) continue; // Skip king

    if (char === char.toUpperCase()) {
      whiteMaterial += val;
    } else {
      blackMaterial += val;
    }
  }

  return {
    white: whiteMaterial,
    black: blackMaterial,
    diff: whiteMaterial - blackMaterial, // > 0: White ahead, < 0: Black ahead
  };
}
