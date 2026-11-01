import React, { useEffect, useRef } from 'react';

interface FluxLinesProps {
  lineCount?: number;
  speed?: number;
  color?: string;
  secondaryColor?: string;
  magneticRadius?: number;
  magneticStrength?: number;
  opacity?: number;
  className?: string;
}

export const FluxLines: React.FC<FluxLinesProps> = ({
  lineCount = 42,
  speed = 0.0018,
  color = '#00f0ff',
  secondaryColor = '#8b5cf6',
  magneticRadius = 220,
  magneticStrength = 0.45,
  opacity = 0.45,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
    };

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    handleResize();

    // Line anchors
    interface Line {
      baseY: number;
      amplitude: number;
      frequency: number;
      phase: number;
      speedMult: number;
      colorMix: number;
    }

    const lines: Line[] = [];
    for (let i = 0; i < lineCount; i++) {
      lines.push({
        baseY: (height / (lineCount + 1)) * (i + 1),
        amplitude: 18 + Math.random() * 26,
        frequency: 0.0018 + Math.random() * 0.0025,
        phase: Math.random() * Math.PI * 2,
        speedMult: 0.6 + Math.random() * 0.8,
        colorMix: i / lineCount,
      });
    }

    let time = 0;

    const render = () => {
      time += speed;

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // Render each flux line
      lines.forEach((line) => {
        ctx.beginPath();
        const step = 14;
        let isFirst = true;

        for (let x = 0; x <= width + step; x += step) {
          // Base sinusoidal flow
          let y =
            line.baseY +
            Math.sin(x * line.frequency + time * line.speedMult + line.phase) * line.amplitude +
            Math.cos(x * line.frequency * 0.5 - time * 0.8) * (line.amplitude * 0.4);

          // Magnetic attraction / repulsion distortion toward cursor
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < magneticRadius) {
            const factor = Math.cos((dist / magneticRadius) * (Math.PI / 2));
            const force = factor * factor * (line.baseY < mouse.y ? -1 : 1) * magneticStrength * 70;
            y += force;
          }

          if (isFirst) {
            ctx.moveTo(x, y);
            isFirst = false;
          } else {
            ctx.lineTo(x, y);
          }
        }

        // Create gradient along width
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        const mix = line.colorMix;
        gradient.addColorStop(0, `${color}00`);
        gradient.addColorStop(0.2, mix < 0.5 ? color : secondaryColor);
        gradient.addColorStop(0.8, mix < 0.5 ? secondaryColor : color);
        gradient.addColorStop(1, `${secondaryColor}00`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.15;
        ctx.globalAlpha = opacity * (0.6 + Math.sin(time + line.phase) * 0.4);
        ctx.stroke();
      });

      // Subtle cursor glow node
      if (mouse.x > 0 && mouse.y > 0) {
        const glow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          magneticRadius * 0.8
        );
        glow.addColorStop(0, `${color}22`);
        glow.addColorStop(0.5, `${secondaryColor}0d`);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, magneticRadius * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [lineCount, speed, color, secondaryColor, magneticRadius, magneticStrength, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ background: 'transparent' }}
    />
  );
};

export default FluxLines;
