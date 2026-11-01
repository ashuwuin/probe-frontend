import React from 'react';

interface ShinyTextProps {
  text: string;
  className?: string;
  speed?: number; // seconds
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  className = '',
  speed = 4,
}) => {
  return (
    <span
      className={`inline-block font-medium bg-clip-text text-transparent bg-gradient-to-r from-gray-400 via-white to-gray-400 bg-[length:200%_auto] animate-shine ${className}`}
      style={{
        animationDuration: `${speed}s`,
      }}
    >
      {text}
    </span>
  );
};

export default ShinyText;
