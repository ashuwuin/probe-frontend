import React, { useEffect, useState, useRef } from 'react';

interface TechTextProps {
  text: string;
  speed?: number;
  scrambleSpeed?: number;
  maxIterations?: number;
  characters?: string;
  className?: string;
  glowColor?: string;
  animateOnHover?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  autoStart?: boolean;
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@*&^%$!?/\\|<>[]{}~+=:;';

export const TechText: React.FC<TechTextProps> = ({
  text,
  speed = 40,
  scrambleSpeed = 30,
  maxIterations = 14,
  characters = DEFAULT_CHARS,
  className = '',
  glowColor = '#00f0ff',
  animateOnHover = true,
  revealDirection = 'start',
  autoStart = true,
}) => {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isScrambling, setIsScrambling] = useState<boolean>(false);
  const iterationRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startScramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsScrambling(true);
    iterationRef.current = 0;

    const length = text.length;
    const resolvedIndices = new Set<number>();

    intervalRef.current = setInterval(() => {
      iterationRef.current += 1;

      // Determine how many characters should be solved by now
      const progress = iterationRef.current / maxIterations;
      const solvedCount = Math.floor(progress * length);

      // Scramble string
      const scrambled = text
        .split('')
        .map((char, index) => {
          if (char === ' ' || char === '/' || char === '-') return char;

          let shouldSolve = false;
          if (revealDirection === 'start') {
            shouldSolve = index < solvedCount;
          } else if (revealDirection === 'end') {
            shouldSolve = index >= length - solvedCount;
          } else {
            const mid = Math.floor(length / 2);
            shouldSolve = Math.abs(index - mid) <= solvedCount / 2;
          }

          if (shouldSolve || iterationRef.current >= maxIterations) {
            return char;
          }

          const randomChar = characters[Math.floor(Math.random() * characters.length)];
          return randomChar;
        })
        .join('');

      setDisplayText(scrambled);

      if (iterationRef.current >= maxIterations) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, scrambleSpeed);
  };

  useEffect(() => {
    if (autoStart) {
      startScramble();
    } else {
      setDisplayText(text);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (animateOnHover && !isScrambling) {
      startScramble();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={startScramble}
      className={`inline-block font-mono tracking-wider cursor-pointer select-none transition-all duration-300 ${className}`}
      style={{
        textShadow: isScrambling || isHovered
          ? `0 0 12px ${glowColor}, 0 0 24px ${glowColor}66`
          : `0 0 6px ${glowColor}44`,
      }}
      title="Click to re-decrypt"
    >
      {displayText}
      {isScrambling && (
        <span className="inline-block w-2.5 h-5 ml-1 bg-cyan-400 animate-pulse align-middle" />
      )}
    </span>
  );
};

export default TechText;
