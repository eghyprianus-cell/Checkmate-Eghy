import type { Square, PieceSymbol, Color } from 'chess.js';

export type AIDifficulty = 'novice' | 'intermediate' | 'master';

export type GameMode = 'vs-ai' | 'pass-and-play';

export type PlayerSide = 'w' | 'b' | 'random';

export type BoardTheme = 'cyan' | 'sapphire' | 'arctic';

export type SoundtrackTrack = 'cyber-storm' | 'dark-ambient' | 'thunder-rain' | 'none';

export type SparkIntensity = 'high' | 'medium' | 'low';

export interface AppSettings {
  sfxVolume: number; // 0 - 100
  musicVolume: number; // 0 - 100
  soundtrack: SoundtrackTrack;
  isMuted: boolean;
  showEvalBar: boolean;
  sparkIntensity: SparkIntensity;
  soundStyle: 'electric' | 'classic';
}

export interface StormState {
  whiteEnergy: number; // 0 - 100
  blackEnergy: number; // 0 - 100
  stunnedSquare: Square | null; // Square that cannot move this turn
  stunnedColor: Color | null;
  shieldedSquare: Square | null; // Square that cannot be captured this turn
  activePowerMode: boolean; // Whether Storm powers are toggled on
}

export type TimerOption = 'none' | '1m' | '3m' | '5m' | '10m';

export interface MoveLog {
  from: Square;
  to: Square;
  san: string;
  piece: PieceSymbol;
  color: Color;
  captured?: PieceSymbol;
  isCheck?: boolean;
  isCheckmate?: boolean;
  timestamp: number;
}

export interface PlayerStats {
  whiteName: string;
  blackName: string;
  whiteTime: number; // in seconds
  blackTime: number;
  whiteCaptures: PieceSymbol[];
  blackCaptures: PieceSymbol[];
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface LightningArc {
  id: string;
  fromCoords: Coordinates;
  toCoords: Coordinates;
  color: string;
  isCapture: boolean;
  timestamp: number;
}
