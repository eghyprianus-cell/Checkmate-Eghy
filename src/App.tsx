/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Chess, type Square, type PieceSymbol } from 'chess.js';
import { BackgroundStorm } from './components/BackgroundStorm';
import { Header } from './components/Header';
import { Chessboard } from './components/Chessboard';
import { LightningCanvas } from './components/LightningCanvas';
import { GameSidebar } from './components/GameSidebar';
import { StormPowers } from './components/StormPowers';
import { PromotionModal } from './components/PromotionModal';
import { GameOverModal } from './components/GameOverModal';
import { RulesModal } from './components/RulesModal';
import { NewGameModal } from './components/NewGameModal';
import { SettingsModal } from './components/SettingsModal';
import { EvalBar } from './components/EvalBar';
import { sounds } from './utils/audio';
import { getAIMove, getHintMove, calculateMaterialAdvantage, evaluateBoard } from './utils/ai';
import type { AIDifficulty, GameMode, LightningArc, MoveLog, StormState, TimerOption, PlayerSide, BoardTheme, AppSettings } from './types';

export default function App() {
  // Game engine state
  const [game, setGame] = useState<Chess>(() => new Chess());
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [playerSide, setPlayerSide] = useState<'w' | 'b'>('w');
  const [boardTheme, setBoardTheme] = useState<BoardTheme>('cyan');
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validDestinations, setValidDestinations] = useState<Square[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [hintMove, setHintMove] = useState<{ from: Square; to: Square } | null>(null);

  // Storm powers state
  const [stormState, setStormState] = useState<StormState>({
    whiteEnergy: 20,
    blackEnergy: 20,
    stunnedSquare: null,
    stunnedColor: null,
    shieldedSquare: null,
    activePowerMode: true,
  });
  const [selectedPower, setSelectedPower] = useState<'stun' | 'shield' | null>(null);

  // Lightning arcs for canvas animation
  const [activeArcs, setActiveArcs] = useState<LightningArc[]>([]);
  const boardContainerRef = useRef<HTMLDivElement | null>(null);

  // Promotion state
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null);

  // Game mode & AI
  const [gameMode, setGameMode] = useState<GameMode>('vs-ai');
  const [difficulty, setDifficulty] = useState<AIDifficulty>('intermediate');
  const [aiTaunt, setAiTaunt] = useState<string | null>('Medan tempur halilintar telah aktif!');
  const [isAIThinking, setIsAIThinking] = useState<boolean>(false);
  const isAIThinkingRef = useRef<boolean>(false);

  // Settings & Audio State
  const [settings, setSettings] = useState<AppSettings>(() => {
    const defaultSettings: AppSettings = {
      sfxVolume: 80,
      musicVolume: 50,
      soundtrack: 'cyber-storm',
      isMuted: false,
      showEvalBar: true,
      sparkIntensity: 'high',
      soundStyle: 'electric',
    };
    try {
      const saved = localStorage.getItem('petir_chess_settings');
      if (saved) return { ...defaultSettings, ...JSON.parse(saved) };
    } catch {}
    return defaultSettings;
  });

  const [showRules, setShowRules] = useState<boolean>(false);
  const [showNewGameModal, setShowNewGameModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // Synchronize audio settings and soundtrack with audio engine
  useEffect(() => {
    sounds.setSfxVolume(settings.sfxVolume);
    sounds.setMusicVolume(settings.musicVolume);
    sounds.setMuted(settings.isMuted);
    sounds.setSoundtrack(settings.soundtrack);
    try {
      localStorage.setItem('petir_chess_settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // History & Captures
  const [moveHistory, setMoveHistory] = useState<MoveLog[]>([]);
  const [whiteCaptures, setWhiteCaptures] = useState<PieceSymbol[]>([]);
  const [blackCaptures, setBlackCaptures] = useState<PieceSymbol[]>([]);
  const [gameStartTime, setGameStartTime] = useState<number>(() => Date.now());

  // Game over state
  const [gameOver, setGameOver] = useState<{
    isOver: boolean;
    winner: 'w' | 'b' | 'draw' | null;
    reason: string;
  }>({
    isOver: false,
    winner: null,
    reason: '',
  });

  // Timers
  const [timerOption, setTimerOption] = useState<TimerOption>('none');
  const [whiteTime, setWhiteTime] = useState<number>(300);
  const [blackTime, setBlackTime] = useState<number>(300);

  // Reset timers when timerOption changes
  useEffect(() => {
    let seconds = 300;
    if (timerOption === '1m') seconds = 60;
    if (timerOption === '3m') seconds = 180;
    if (timerOption === '5m') seconds = 300;
    if (timerOption === '10m') seconds = 600;
    setWhiteTime(seconds);
    setBlackTime(seconds);
  }, [timerOption]);

  // Timer countdown loop
  useEffect(() => {
    if (timerOption === 'none' || gameOver.isOver) return;

    const interval = setInterval(() => {
      const turn = game.turn();
      if (turn === 'w') {
        setWhiteTime((prev) => {
          if (prev <= 1) {
            handleTimeout('w');
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime((prev) => {
          if (prev <= 1) {
            handleTimeout('b');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerOption, gameOver.isOver, game]);

  const handleTimeout = (loser: 'w' | 'b') => {
    sounds.playCheckmate();
    setGameOver({
      isOver: true,
      winner: loser === 'w' ? 'b' : 'w',
      reason: `Waktu ${loser === 'w' ? 'Cahaya Petir' : 'Badai Malam'} telah habis!`,
    });
  };

  // Calculate pixel coordinates for a square
  const getSquareCoordinates = useCallback((square: Square): { x: number; y: number } | null => {
    if (!boardContainerRef.current) return null;
    const boardEl = boardContainerRef.current;
    const squareEl = boardEl.querySelector(`[data-square="${square}"]`);
    if (!squareEl) return null;

    const boardRect = boardEl.getBoundingClientRect();
    const sqRect = squareEl.getBoundingClientRect();

    return {
      x: sqRect.left + sqRect.width / 2 - boardRect.left,
      y: sqRect.top + sqRect.height / 2 - boardRect.top,
    };
  }, []);

  // Fire a lightning arc visual effect between two squares
  const triggerLightningArc = useCallback((from: Square, to: Square, isCapture: boolean) => {
    const fromCoords = getSquareCoordinates(from);
    const toCoords = getSquareCoordinates(to);

    if (fromCoords && toCoords) {
      const arc: LightningArc = {
        id: `arc-${Date.now()}-${Math.random()}`,
        fromCoords,
        toCoords,
        color: isCapture ? '#ffffff' : '#00f0ff',
        isCapture,
        timestamp: Date.now(),
      };
      setActiveArcs((prev) => [...prev, arc]);
    }
  }, [getSquareCoordinates]);

  // Check Game State (Checkmate, Stalemate, Draw)
  const verifyGameOver = useCallback((currentGame: Chess) => {
    if (currentGame.isCheckmate()) {
      sounds.playCheckmate();
      const winner = currentGame.turn() === 'w' ? 'b' : 'w';
      setGameOver({
        isOver: true,
        winner,
        reason: 'Skakmat! Raja terjepit dalam amukan badai petir mutlak.',
      });
      return true;
    }
    if (currentGame.isDraw()) {
      let reason = 'Pertempuran berakhir remis.';
      if (currentGame.isStalemate()) reason = 'Paten / Stalemate: Tidak ada langkah legal yang tersisa.';
      else if (currentGame.isThreefoldRepetition()) reason = 'Remis karena pengulangan posisi 3 kali.';
      else if (currentGame.isInsufficientMaterial()) reason = 'Remis karena materi tidak mencukupi untuk skakmat.';
      setGameOver({
        isOver: true,
        winner: 'draw',
        reason,
      });
      return true;
    }
    return false;
  }, []);

  // Execute Move
  const executeMove = useCallback((from: Square, to: Square, promotionPiece?: PieceSymbol) => {
    try {
      // Check if target is protected by Ion Shield
      if (stormState.shieldedSquare === to) {
        sounds.playInvalid();
        setAiTaunt('🛡️ Bidak ini dilindungi Perisai Ionik! Tidak dapat ditangkap!');
        return false;
      }

      // Check if piece attempting to move is stunned
      if (stormState.stunnedSquare === from) {
        sounds.playInvalid();
        setAiTaunt('⚡ Bidak ini sedang lumpuh akibat sengatan petir!');
        return false;
      }

      const turnBefore = game.turn();
      const targetPiece = game.get(to);
      const isCapture = !!targetPiece;

      // Execute in chess engine
      const moveResult = game.move({
        from,
        to,
        promotion: promotionPiece || 'q',
      });

      if (!moveResult) {
        sounds.playInvalid();
        return false;
      }

      // Audio & Lightning Visuals
      if (isCapture) {
        sounds.playCapture();
        if (targetPiece) {
          if (turnBefore === 'w') {
            setWhiteCaptures((prev) => [...prev, targetPiece.type]);
          } else {
            setBlackCaptures((prev) => [...prev, targetPiece.type]);
          }
        }
      } else {
        sounds.playMove(settings.soundStyle);
      }

      // Fire lightning arc on canvas
      triggerLightningArc(from, to, isCapture);

      // Check for check status
      const isNowInCheck = game.inCheck();
      if (isNowInCheck && !game.isCheckmate()) {
        sounds.playCheck();
      }

      // Update Move Log
      const logEntry: MoveLog = {
        from,
        to,
        san: moveResult.san,
        piece: moveResult.piece,
        color: moveResult.color,
        captured: moveResult.captured,
        isCheck: isNowInCheck,
        isCheckmate: game.isCheckmate(),
        timestamp: Date.now(),
      };
      setMoveHistory((prev) => [...prev, logEntry]);
      setLastMove({ from, to });
      setSelectedSquare(null);
      setValidDestinations([]);
      setHintMove(null);

      // Update Storm Powers State
      setStormState((prev) => {
        const energyGain = isCapture ? 25 : 10;
        let whiteE = prev.whiteEnergy;
        let blackE = prev.blackEnergy;

        if (turnBefore === 'w') {
          whiteE = Math.min(100, whiteE + energyGain);
        } else {
          blackE = Math.min(100, blackE + energyGain);
        }

        // Clean up expired shields or stuns if their duration ended
        const nextStun = prev.stunnedColor === turnBefore ? null : prev.stunnedSquare;
        const nextStunColor = prev.stunnedColor === turnBefore ? null : prev.stunnedColor;

        return {
          ...prev,
          whiteEnergy: whiteE,
          blackEnergy: blackE,
          stunnedSquare: nextStun,
          stunnedColor: nextStunColor,
          shieldedSquare: null,
        };
      });

      // Update game instance state
      setGame(new Chess(game.fen()));

      // Check Game Over
      verifyGameOver(game);
      return true;
    } catch {
      sounds.playInvalid();
      return false;
    }
  }, [game, stormState, triggerLightningArc, verifyGameOver]);

  // Check if it's currently AI's turn
  const isAITurn = gameMode === 'vs-ai' && game.turn() !== playerSide && !gameOver.isOver;

  // AI Move Runner
  useEffect(() => {
    if (!isAITurn) {
      isAIThinkingRef.current = false;
      setIsAIThinking(false);
      return;
    }

    if (isAIThinkingRef.current) return;
    isAIThinkingRef.current = true;
    setIsAIThinking(true);

    const thinkTime = 380 + Math.random() * 320;

    const timer = setTimeout(() => {
      try {
        const aiMove = getAIMove(
          game,
          difficulty,
          stormState.stunnedSquare,
          stormState.shieldedSquare
        );

        if (aiMove) {
          executeMove(aiMove.from, aiMove.to, (aiMove.promotion as PieceSymbol) || 'q');
          if (aiMove.taunt) {
            setAiTaunt(aiMove.taunt);
          }
        }
      } catch (err) {
        console.error('Error executing AI move:', err);
      } finally {
        isAIThinkingRef.current = false;
        setIsAIThinking(false);
      }
    }, thinkTime);

    return () => {
      clearTimeout(timer);
    };
  }, [
    game,
    isAITurn,
    difficulty,
    stormState.stunnedSquare,
    stormState.shieldedSquare,
    executeMove,
  ]);

  // Handle Square Clicks
  const handleSquareClick = (square: Square) => {
    if (gameOver.isOver) return;

    // 1. If currently in Storm Power selection mode:
    if (selectedPower && stormState.activePowerMode) {
      const piece = game.get(square);

      if (selectedPower === 'stun') {
        if (piece && piece.color !== game.turn() && piece.type !== 'k') {
          sounds.playStormPower();
          setStormState((prev) => ({
            ...prev,
            stunnedSquare: square,
            stunnedColor: piece.color,
            whiteEnergy: game.turn() === 'w' ? prev.whiteEnergy - 40 : prev.whiteEnergy,
            blackEnergy: game.turn() === 'b' ? prev.blackEnergy - 40 : prev.blackEnergy,
          }));
          setSelectedPower(null);
          setAiTaunt(`⚡ Bidak ${piece.type.toUpperCase()} di ${square} tersengat kelumpuhan!`);
        } else {
          sounds.playInvalid();
        }
        return;
      }

      if (selectedPower === 'shield') {
        if (piece && piece.color === game.turn()) {
          sounds.playStormPower();
          setStormState((prev) => ({
            ...prev,
            shieldedSquare: square,
            whiteEnergy: game.turn() === 'w' ? prev.whiteEnergy - 50 : prev.whiteEnergy,
            blackEnergy: game.turn() === 'b' ? prev.blackEnergy - 50 : prev.blackEnergy,
          }));
          setSelectedPower(null);
          setAiTaunt(`🛡️ Bidak di ${square} diselimuti Perisai Ionik!`);
        } else {
          sounds.playInvalid();
        }
        return;
      }
    }

    // 2. Normal Chess Move Handling
    const pieceOnSquare = game.get(square);

    // If square is stunned, alert player
    if (stormState.stunnedSquare === square && pieceOnSquare?.color === game.turn()) {
      sounds.playInvalid();
      setAiTaunt('⚡ Bidak ini sedang lumpuh karena sambaran petir!');
      return;
    }

    // If selecting valid move destination
    if (selectedSquare && validDestinations.includes(square)) {
      const piece = game.get(selectedSquare);
      const isPawn = piece?.type === 'p';
      const isPromotionRank = (piece?.color === 'w' && square[1] === '8') || (piece?.color === 'b' && square[1] === '1');

      if (isPawn && isPromotionRank) {
        setPendingPromotion({ from: selectedSquare, to: square });
        return;
      }

      executeMove(selectedSquare, square);
      return;
    }

    // Selecting own piece to move
    if (pieceOnSquare && pieceOnSquare.color === game.turn()) {
      if (isAITurn) return;

      sounds.playSelect();
      setSelectedSquare(square);

      const legalMoves = game.moves({ square, verbose: true });
      const destinations = legalMoves.map((m) => m.to);
      setValidDestinations(destinations);
      return;
    }

    // Deselect if clicking elsewhere
    setSelectedSquare(null);
    setValidDestinations([]);
  };

  // Drag and Drop move execution
  const handleDropMove = (from: Square, to: Square) => {
    if (gameOver.isOver || isAITurn) return;

    const piece = game.get(from);
    if (!piece || piece.color !== game.turn()) return;

    // Validate if move is in legal moves
    const legalMoves = game.moves({ square: from, verbose: true });
    const isLegal = legalMoves.some((m) => m.to === to);
    if (!isLegal) {
      sounds.playInvalid();
      return;
    }

    const isPawn = piece.type === 'p';
    const isPromotionRank = (piece.color === 'w' && to[1] === '8') || (piece.color === 'b' && to[1] === '1');

    if (isPawn && isPromotionRank) {
      setPendingPromotion({ from, to });
      return;
    }

    executeMove(from, to);
  };

  // Promotion choice selected
  const handlePromotionSelect = (promotedPiece: PieceSymbol) => {
    if (pendingPromotion) {
      executeMove(pendingPromotion.from, pendingPromotion.to, promotedPiece);
      setPendingPromotion(null);
    }
  };

  // Hint / Flash best move
  const handleHint = () => {
    sounds.playSelect();
    const hint = getHintMove(game);
    if (hint) {
      setHintMove(hint);
      setAiTaunt(`Kilatan petir menyinari langkah: ${hint.from} ➔ ${hint.to}`);
      setTimeout(() => setHintMove(null), 3000);
    }
  };

  // Undo Move
  const handleUndo = () => {
    if (moveHistory.length === 0 || gameOver.isOver) return;

    sounds.playSelect();
    const stepsToUndo = gameMode === 'vs-ai' ? 2 : 1;

    for (let i = 0; i < stepsToUndo; i++) {
      game.undo();
    }

    setGame(new Chess(game.fen()));
    setMoveHistory((prev) => prev.slice(0, Math.max(0, prev.length - stepsToUndo)));
    setSelectedSquare(null);
    setValidDestinations([]);
    setLastMove(null);
    setHintMove(null);
  };

  // Resign match
  const handleResign = () => {
    if (gameOver.isOver) return;
    sounds.playCheckmate();
    const currentTurn = game.turn();
    const winner = currentTurn === 'w' ? 'b' : 'w';
    setGameOver({
      isOver: true,
      winner,
      reason: `${currentTurn === 'w' ? 'Cahaya Petir' : 'Badai Malam'} telah menyerahkan bendera badai.`,
    });
  };

  // Offer draw
  const handleOfferDraw = () => {
    if (gameOver.isOver) return;
    sounds.playSelect();

    if (gameMode === 'vs-ai') {
      const evalScore = evaluateBoard(game);
      const isNearEqual = Math.abs(evalScore) < 180;

      if (isNearEqual) {
        sounds.playCheckmate();
        setGameOver({
          isOver: true,
          winner: 'draw',
          reason: 'AI menerima tawaran remis: Kedua badai mencapai resonansi seimbang!',
        });
      } else {
        setAiTaunt('⚡ Posisi petirku terlalu perkasa untuk menerima remis! Bertarunglah!');
      }
    } else {
      sounds.playCheckmate();
      setGameOver({
        isOver: true,
        winner: 'draw',
        reason: 'Kesepakatan damai: Kedua pemain menyetujui hasil remis.',
      });
    }
  };

  // Start new configured game
  const handleStartConfiguredGame = (config: {
    mode: GameMode;
    difficulty: AIDifficulty;
    side: PlayerSide;
    timer: TimerOption;
    powerMode: boolean;
    theme: BoardTheme;
  }) => {
    sounds.playSelect();
    const newG = new Chess();
    setGame(newG);
    setGameMode(config.mode);
    setDifficulty(config.difficulty);
    setTimerOption(config.timer);
    setBoardTheme(config.theme);

    const actualSide: 'w' | 'b' = config.side === 'random' ? (Math.random() > 0.5 ? 'w' : 'b') : config.side;
    setPlayerSide(actualSide);
    setIsFlipped(actualSide === 'b');

    setSelectedSquare(null);
    setValidDestinations([]);
    setLastMove(null);
    setHintMove(null);
    setPendingPromotion(null);
    setActiveArcs([]);
    setMoveHistory([]);
    setWhiteCaptures([]);
    setBlackCaptures([]);
    setGameStartTime(Date.now());
    setGameOver({ isOver: false, winner: null, reason: '' });
    setStormState({
      whiteEnergy: 20,
      blackEnergy: 20,
      stunnedSquare: null,
      stunnedColor: null,
      shieldedSquare: null,
      activePowerMode: config.powerMode,
    });
    setSelectedPower(null);
    setAiTaunt(
      actualSide === 'b' && config.mode === 'vs-ai'
        ? '⚡ Badai AI mengambil langkah pertama sebagai Cahaya Petir!'
        : '⚡ Pertempuran badai baru dimulai!'
    );

    let seconds = 300;
    if (config.timer === '1m') seconds = 60;
    if (config.timer === '3m') seconds = 180;
    if (config.timer === '5m') seconds = 300;
    if (config.timer === '10m') seconds = 600;
    setWhiteTime(seconds);
    setBlackTime(seconds);
  };

  // Restart match quickly
  const handleQuickRestart = () => {
    handleStartConfiguredGame({
      mode: gameMode,
      difficulty,
      side: playerSide,
      timer: timerOption,
      powerMode: stormState.activePowerMode,
      theme: boardTheme,
    });
  };

  // Mute Toggle linked to settings
  const handleToggleMute = () => {
    setSettings((prev) => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const handleUpdateSettings = (newPartial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newPartial }));
  };

  const handleResetSettings = () => {
    const defaultSettings: AppSettings = {
      sfxVolume: 80,
      musicVolume: 50,
      soundtrack: 'cyber-storm',
      isMuted: false,
      showEvalBar: true,
      sparkIntensity: 'high',
      soundStyle: 'electric',
    };
    setSettings(defaultSettings);
  };

  // Memoized material evaluation difference (only recalculates on board move)
  const materialDiff = useMemo(() => calculateMaterialAdvantage(game.fen()).diff, [game]);

  // Memoized positional evaluation score for EvalBar
  const evalScore = useMemo(() => evaluateBoard(game), [game]);

  // Memoized coordinates of King in check for warning pulse
  const inCheck = game.inCheck();
  const checkCoord = useMemo(() => {
    if (!inCheck) return null;
    const board = game.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p.type === 'k' && p.color === game.turn()) {
          const sq = `${String.fromCharCode(97 + c)}${8 - r}` as Square;
          return getSquareCoordinates(sq);
        }
      }
    }
    return null;
  }, [game, inCheck, getSquareCoordinates]);

  // Calculate formatted game duration
  const elapsedSecs = Math.floor((Date.now() - gameStartTime) / 1000);
  const durationStr = `${Math.floor(elapsedSecs / 60)}m ${elapsedSecs % 60}s`;

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#040814] text-slate-100 font-['Inter'] antialiased selection:bg-cyan-500 selection:text-slate-950">
      {/* Background Animated Thunderstorm Atmosphere */}
      <BackgroundStorm />

      {/* Header Bar */}
      <Header
        timerOption={timerOption}
        onSetTimerOption={setTimerOption}
        onOpenRules={() => setShowRules(true)}
        onOpenNewGame={() => setShowNewGameModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        inCheck={inCheck}
        turn={game.turn()}
      />

      {/* Main Chess Arena */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto p-3 sm:p-4 md:p-6 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          
          {/* Left Column: Chessboard with EvalBar & Storm Powers */}
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex items-center justify-center gap-3 w-full">
              {/* Live Position Evaluation Bar (configurable in settings) */}
              {settings.showEvalBar && (
                <EvalBar
                  scoreCentipawns={evalScore}
                  isFlipped={isFlipped}
                  isCheckmate={game.isCheckmate()}
                  turn={game.turn()}
                />
              )}

              {/* The Chessboard Container with Lightning Overlay */}
              <div className="relative w-full max-w-[620px] mx-auto">
                <Chessboard
                  game={game}
                  isFlipped={isFlipped}
                  selectedSquare={selectedSquare}
                  validDestinations={validDestinations}
                  lastMove={lastMove}
                  hintMove={hintMove}
                  stormState={stormState}
                  boardTheme={boardTheme}
                  onSquareClick={handleSquareClick}
                  onDropMove={handleDropMove}
                  boardContainerRef={boardContainerRef}
                />

                {/* Dynamic Lightning Bolt Canvas Overlay */}
                <LightningCanvas
                  activeArcs={activeArcs}
                  onArcComplete={(id) => setActiveArcs((prev) => prev.filter((a) => a.id !== id))}
                  checkSquareCoord={checkCoord}
                  sparkIntensity={settings.sparkIntensity}
                />
              </div>
            </div>

            {/* Storm Powers Bar */}
            <div className="w-full max-w-[620px]">
              <StormPowers
                currentTurn={game.turn()}
                whiteEnergy={stormState.whiteEnergy}
                blackEnergy={stormState.blackEnergy}
                selectedPower={selectedPower}
                onSelectPower={setSelectedPower}
                isAI={gameMode === 'vs-ai'}
                activePowerMode={stormState.activePowerMode}
                onTogglePowerMode={() =>
                  setStormState((prev) => ({ ...prev, activePowerMode: !prev.activePowerMode }))
                }
              />
            </div>
          </div>

          {/* Right Column: Battle Dashboard & Controls */}
          <div className="w-full">
            <div className="rounded-2xl p-4 bg-[#061129]/80 backdrop-blur-md border border-cyan-500/25 shadow-[0_0_30px_rgba(0,240,255,0.12)]">
              <GameSidebar
                gameMode={gameMode}
                onSetGameMode={setGameMode}
                difficulty={difficulty}
                onSetDifficulty={setDifficulty}
                moveHistory={moveHistory}
                turn={game.turn()}
                whiteTime={whiteTime}
                blackTime={blackTime}
                timerMode={timerOption}
                materialDiff={materialDiff}
                whiteCaptures={whiteCaptures}
                blackCaptures={blackCaptures}
                aiTaunt={aiTaunt}
                isMuted={settings.isMuted}
                onToggleMute={handleToggleMute}
                onUndo={handleUndo}
                onRestart={handleQuickRestart}
                onHint={handleHint}
                onFlipBoard={() => setIsFlipped(!isFlipped)}
                onResign={handleResign}
                onOfferDraw={handleOfferDraw}
                onOpenNewGame={() => setShowNewGameModal(true)}
                isFlipped={isFlipped}
                canUndo={moveHistory.length > 0}
                isAIThinking={isAIThinking}
              />
            </div>
          </div>

        </div>
      </main>

      {/* Promotion Choice Modal */}
      {pendingPromotion && (
        <PromotionModal
          color={game.turn()}
          onSelect={handlePromotionSelect}
        />
      )}

      {/* Game Over Celebration Modal */}
      {gameOver.isOver && (
        <GameOverModal
          winner={gameOver.winner}
          reason={gameOver.reason}
          moveCount={moveHistory.length}
          gameDuration={durationStr}
          onRematch={handleQuickRestart}
          onClose={() => setGameOver((prev) => ({ ...prev, isOver: false }))}
          isAI={gameMode === 'vs-ai'}
        />
      )}

      {/* Rules / Tutorial Guide Modal */}
      {showRules && (
        <RulesModal onClose={() => setShowRules(false)} />
      )}

      {/* New Game Setup Modal */}
      {showNewGameModal && (
        <NewGameModal
          currentMode={gameMode}
          currentDifficulty={difficulty}
          currentSide={playerSide}
          currentTimer={timerOption}
          currentPowerMode={stormState.activePowerMode}
          currentTheme={boardTheme}
          onStartGame={handleStartConfiguredGame}
          onClose={() => setShowNewGameModal(false)}
        />
      )}

      {/* Game Settings & Soundtrack Modal */}
      {showSettingsModal && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onResetSettings={handleResetSettings}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
}
