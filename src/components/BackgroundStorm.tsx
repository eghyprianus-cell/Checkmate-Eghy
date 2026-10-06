import React, { useEffect, useRef } from 'react';

export const BackgroundStorm: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Ionized plasma particles floating in the room
    const particleCount = Math.min(35, Math.floor(width / 30));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.3 - Math.random() * 0.5,
      size: 1 + Math.random() * 2,
      opacity: 0.2 + Math.random() * 0.5,
      hue: Math.random() > 0.5 ? 195 : 215, // electric cyan to azure
    }));

    // Distant ambient lightning flash state
    let flashOpacity = 0;
    let nextFlashTime = performance.now() + 4000 + Math.random() * 6000;

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Trigger occasional atmospheric lightning flashes
      if (time > nextFlashTime) {
        flashOpacity = 0.22 + Math.random() * 0.18;
        nextFlashTime = time + 6000 + Math.random() * 8000;
      }

      if (flashOpacity > 0.005) {
        ctx.fillStyle = `rgba(37, 99, 235, ${flashOpacity * 0.5})`;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = `rgba(0, 240, 255, ${flashOpacity * 0.25})`;
        ctx.fillRect(0, 0, width, height);
        flashOpacity *= 0.88; // rapid decay
      }

      // Render floating ionized particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Deep atmospheric cosmic storm background layers */}
      <div className="absolute inset-0 bg-[#040814]" />
      
      {/* Radial electric aura glows */}
      <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-blue-900/15 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-cyan-900/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full bg-sky-950/20 blur-[140px] pointer-events-none" />

      {/* Grid line subtle electric matrix overlay */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
    </div>
  );
};
