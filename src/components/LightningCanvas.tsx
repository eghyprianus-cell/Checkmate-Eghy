import React, { useEffect, useRef } from 'react';
import type { LightningArc, SparkIntensity } from '../types';

// Primary ambient / burst particle
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

// Branch for the primary fractal lightning bolt
interface Branch {
  points: { x: number; y: number }[];
  alpha: number;
  width: number;
  color: string;
}

// Secondary Particle System: High-energy electric landing impact spark
interface ImpactSpark {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  color: string;
  coreColor: string;
  size: number;
  lengthMultiplier: number;
  jitter: number; // electric erratic twitch factor
}

// Secondary Particle System: Shockwave corona ring on piece touchdown
interface ImpactCorona {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
  lineWidth: number;
}

// Secondary Particle System: Ground discharge micro-arcs latching to tile
interface GroundArc {
  points: { x: number; y: number }[];
  alpha: number;
  color: string;
  width: number;
}

interface LightningCanvasProps {
  activeArcs: LightningArc[];
  onArcComplete?: (id: string) => void;
  checkSquareCoord?: { x: number; y: number } | null;
  sparkIntensity?: SparkIntensity;
}

export const LightningCanvas: React.FC<LightningCanvasProps> = ({
  activeArcs,
  onArcComplete,
  checkSquareCoord,
  sparkIntensity = 'high',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Primary systems
  const particlesRef = useRef<Particle[]>([]);
  const branchesRef = useRef<{ id: string; branches: Branch[]; startTime: number; duration: number }[]>([]);
  const processedArcsRef = useRef<Set<string>>(new Set());

  // Secondary Particle System refs (specifically for visceral landing square impacts)
  const impactSparksRef = useRef<ImpactSpark[]>([]);
  const coronasRef = useRef<ImpactCorona[]>([]);
  const groundArcsRef = useRef<GroundArc[]>([]);

  // Generate fractal jagged lightning path
  const createLightningBolt = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    depth: number = 4
  ): { x: number; y: number }[] => {
    const points: { x: number; y: number }[] = [{ x: x1, y: y1 }];

    const generateSegments = (
      p1: { x: number; y: number },
      p2: { x: number; y: number },
      currentDepth: number
    ) => {
      if (currentDepth <= 0) {
        points.push(p2);
        return;
      }

      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const length = Math.sqrt(dx * dx + dy * dy);

      // Perpendicular offset
      const normalX = -dy / (length || 1);
      const normalY = dx / (length || 1);
      const offsetScale = (length * 0.22) * (Math.random() - 0.5);

      const displacedMid = {
        x: midX + normalX * offsetScale,
        y: midY + normalY * offsetScale,
      };

      generateSegments(p1, displacedMid, currentDepth - 1);
      generateSegments(displacedMid, p2, currentDepth - 1);
    };

    generateSegments({ x: x1, y: y1 }, { x: x2, y: y2 }, depth);
    return points;
  };

  // Convert new incoming arcs to jagged branches, primary bursts, AND secondary landing impact systems
  useEffect(() => {
    activeArcs.forEach((arc) => {
      if (processedArcsRef.current.has(arc.id)) return;
      processedArcsRef.current.add(arc.id);

      const targetX = arc.toCoords.x;
      const targetY = arc.toCoords.y;

      // 1. Primary Fractal Lightning Bolt
      const mainPoints = createLightningBolt(
        arc.fromCoords.x,
        arc.fromCoords.y,
        targetX,
        targetY,
        4
      );

      const branches: Branch[] = [
        {
          points: mainPoints,
          alpha: 1.0,
          width: arc.isCapture ? 4.8 : 3.2,
          color: '#ffffff',
        },
        {
          points: mainPoints,
          alpha: 0.85,
          width: arc.isCapture ? 8.5 : 6.2,
          color: '#00f0ff',
        },
      ];

      // Add auxiliary fork branches
      const numForks = arc.isCapture ? 4 : 2;
      for (let i = 0; i < numForks; i++) {
        const forkIdx = Math.floor(Math.random() * (mainPoints.length - 2)) + 1;
        const forkStart = mainPoints[forkIdx];
        const forkAngle = Math.random() * Math.PI * 2;
        const forkDist = 30 + Math.random() * 45;
        const forkEnd = {
          x: forkStart.x + Math.cos(forkAngle) * forkDist,
          y: forkStart.y + Math.sin(forkAngle) * forkDist,
        };
        const forkPoints = createLightningBolt(forkStart.x, forkStart.y, forkEnd.x, forkEnd.y, 2);
        branches.push({
          points: forkPoints,
          alpha: 0.85,
          width: 1.8,
          color: '#38bdf8',
        });
      }

      branchesRef.current.push({
        id: arc.id,
        branches,
        startTime: performance.now(),
        duration: arc.isCapture ? 450 : 320,
      });

      // 2. Primary round burst sparks scaled by intensity setting
      const intensityFactor = sparkIntensity === 'high' ? 1.0 : sparkIntensity === 'medium' ? 0.6 : 0.25;
      const sparkCount = Math.max(3, Math.floor((arc.isCapture ? 24 : 12) * intensityFactor));
      for (let i = 0; i < sparkCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (arc.isCapture ? 2.5 : 1.5) + Math.random() * (arc.isCapture ? 5 : 3.5);
        particlesRef.current.push({
          x: targetX,
          y: targetY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.0,
          maxLife: 20 + Math.random() * 25,
          color: Math.random() > 0.4 ? '#00f0ff' : '#93c5fd',
          size: 1.5 + Math.random() * 2.5,
        });
      }

      // ========================================================
      // 3. SECONDARY PARTICLE SYSTEM: High-Energy Landing Impact Sparks
      // ========================================================
      const impactCount = Math.max(4, Math.floor((arc.isCapture ? 42 : 24) * intensityFactor));
      for (let i = 0; i < impactCount; i++) {
        const baseAngle = Math.random() * Math.PI * 2;
        const speed = (arc.isCapture ? 4.5 : 3.0) + Math.random() * (arc.isCapture ? 7.5 : 5.0);
        
        impactSparksRef.current.push({
          x: targetX,
          y: targetY,
          prevX: targetX,
          prevY: targetY,
          vx: Math.cos(baseAngle) * speed,
          vy: Math.sin(baseAngle) * speed,
          life: 1.0,
          decay: 0.025 + Math.random() * 0.035, // 30-40 frames of high-velocity life
          color: Math.random() > 0.3 ? '#00f0ff' : '#38bdf8',
          coreColor: '#ffffff',
          size: 1.8 + Math.random() * 2.2,
          lengthMultiplier: 2.5 + Math.random() * 2.0,
          jitter: 0.8 + Math.random() * 1.4,
        });
      }

      // 4. SECONDARY SYSTEM: Expanding Ionized Shockwave Corona Ring
      coronasRef.current.push({
        x: targetX,
        y: targetY,
        radius: 4,
        maxRadius: arc.isCapture ? 48 : 34,
        alpha: 0.95,
        color: arc.isCapture ? '#ffffff' : '#00f0ff',
        lineWidth: arc.isCapture ? 3.5 : 2.2,
      });

      if (arc.isCapture) {
        // Second trailing ripple for capture explosions
        coronasRef.current.push({
          x: targetX,
          y: targetY,
          radius: 2,
          maxRadius: 58,
          alpha: 0.65,
          color: '#38bdf8',
          lineWidth: 1.8,
        });
      }

      // 5. SECONDARY SYSTEM: Ground Discharge Micro-Arcs across landing tile
      const groundArcCount = arc.isCapture ? 8 : 5;
      for (let g = 0; g < groundArcCount; g++) {
        const theta = (g * (Math.PI * 2)) / groundArcCount + (Math.random() - 0.5) * 0.4;
        const length = 16 + Math.random() * (arc.isCapture ? 26 : 18);
        const arcEnd = {
          x: targetX + Math.cos(theta) * length,
          y: targetY + Math.sin(theta) * length,
        };
        const groundPoints = createLightningBolt(targetX, targetY, arcEnd.x, arcEnd.y, 2);
        groundArcsRef.current.push({
          points: groundPoints,
          alpha: 1.0,
          color: Math.random() > 0.3 ? '#ffffff' : '#00f0ff',
          width: 1.6,
        });
      }
    });
  }, [activeArcs]);

  // Main animation render loop
  useEffect(() => {
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const now = performance.now();

      ctx.clearRect(0, 0, width, height);

      // 1. Draw check warning electric vortex if present
      if (checkSquareCoord) {
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ef4444';
        const ringTime = (now % 1000) / 1000;
        const radius = 24 + Math.sin(now * 0.008) * 4;

        ctx.strokeStyle = `rgba(239, 68, 68, ${0.4 + ringTime * 0.4})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(checkSquareCoord.x, checkSquareCoord.y, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Warning spark arcs around King
        for (let i = 0; i < 4; i++) {
          const theta = ringTime * Math.PI * 2 + (i * Math.PI) / 2;
          const sx = checkSquareCoord.x + Math.cos(theta) * radius;
          const sy = checkSquareCoord.y + Math.sin(theta) * radius;
          ctx.fillStyle = '#ff7b72';
          ctx.beginPath();
          ctx.arc(sx, sy, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 2. Render primary fractal lightning bolts
      branchesRef.current = branchesRef.current.filter((item) => {
        const elapsed = now - item.startTime;
        if (elapsed > item.duration) {
          if (onArcComplete) onArcComplete(item.id);
          return false;
        }

        const progress = elapsed / item.duration;
        const fade = 1 - progress;
        const flicker = Math.random() > 0.15 ? 1 : 0.4;

        ctx.save();
        item.branches.forEach((b) => {
          ctx.strokeStyle = b.color;
          ctx.lineWidth = b.width * fade;
          ctx.globalAlpha = b.alpha * fade * flicker;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 12 * fade;

          ctx.beginPath();
          b.points.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.stroke();
        });
        ctx.restore();

        return true;
      });

      // 3. Render secondary shockwave corona rings (expanding impact ripple)
      coronasRef.current = coronasRef.current.filter((corona) => {
        corona.radius += (corona.maxRadius - corona.radius) * 0.18 + 0.5;
        corona.alpha *= 0.88;

        if (corona.alpha <= 0.04 || corona.radius >= corona.maxRadius) return false;

        ctx.save();
        ctx.globalAlpha = corona.alpha;
        ctx.strokeStyle = corona.color;
        ctx.lineWidth = corona.lineWidth * corona.alpha;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.arc(corona.x, corona.y, corona.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        return true;
      });

      // 4. Render secondary ground discharge micro-arcs
      groundArcsRef.current = groundArcsRef.current.filter((ga) => {
        ga.alpha *= 0.86;
        if (ga.alpha <= 0.04) return false;

        ctx.save();
        ctx.globalAlpha = ga.alpha;
        ctx.strokeStyle = ga.color;
        ctx.lineWidth = ga.width * ga.alpha;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ga.points.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();
        ctx.restore();

        return true;
      });

      // 5. Render primary round burst sparks
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.93;
        p.vy *= 0.93;
        p.life -= 1 / p.maxLife;

        if (p.life <= 0) return false;

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life * 0.9;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return true;
      });

      // 6. Render SECONDARY PARTICLE SYSTEM: High-Velocity Electric Streak Sparks
      // Uses additive hardware blending with double-stroke glow for silky-smooth 60+ FPS
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      impactSparksRef.current = impactSparksRef.current.filter((spark) => {
        spark.prevX = spark.x;
        spark.prevY = spark.y;

        // Apply lightweight erratic electric twitch
        spark.vx += (Math.random() - 0.5) * spark.jitter;
        spark.vy += (Math.random() - 0.5) * spark.jitter;

        // Update position
        spark.x += spark.vx;
        spark.y += spark.vy;

        // Visceral friction drag
        spark.vx *= 0.91;
        spark.vy *= 0.91;

        spark.life -= spark.decay;
        if (spark.life <= 0) return false;

        const currentAlpha = Math.max(0, Math.min(1, spark.life));

        // Draw outer electric blue glow streak (hardware additive layer)
        ctx.beginPath();
        ctx.strokeStyle = spark.color;
        ctx.lineWidth = spark.size * currentAlpha * 2.4;
        ctx.lineCap = 'round';
        ctx.globalAlpha = currentAlpha * 0.6;
        ctx.moveTo(spark.prevX, spark.prevY);
        ctx.lineTo(spark.x, spark.y);
        ctx.stroke();

        // Draw inner searing-hot pure white plasma core
        ctx.beginPath();
        ctx.strokeStyle = spark.coreColor;
        ctx.lineWidth = Math.max(0.8, spark.size * currentAlpha * 0.8);
        ctx.globalAlpha = currentAlpha;
        ctx.moveTo(spark.prevX, spark.prevY);
        ctx.lineTo(spark.x, spark.y);
        ctx.stroke();

        // Draw leading electric spark bead head
        ctx.beginPath();
        ctx.fillStyle = '#ffffff';
        ctx.arc(spark.x, spark.y, spark.size * 0.7 * currentAlpha, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [checkSquareCoord, onArcComplete]);

  // Handle canvas sizing to parent container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-30 w-full h-full"
    />
  );
};
