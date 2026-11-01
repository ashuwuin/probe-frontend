import React from 'react';
import ReactBitsSpotlightCard, { SpotlightCardProps as RBSpotlightCardProps } from './reactbits/SpotlightCard/SpotlightCard';

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(0, 240, 255, 0.16)',
  ...rest
}) => {
  return (
    <ReactBitsSpotlightCard
      spotlightColor={spotlightColor}
      className={`rounded-xl border border-white/10 bg-black/40 backdrop-blur-md ${className}`}
      {...rest}
    >
      {children}
    </ReactBitsSpotlightCard>
  );
};

export default SpotlightCard;
