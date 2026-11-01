import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle } from 'lucide-react';

export type TriageStatus = 'confirmed' | 'invalid' | 'cannot-reproduce' | 'uncertain';

interface StatusBadgeProps {
  status: TriageStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const norm = (status || '').toLowerCase().trim();

  let label = 'UNCERTAIN';
  let bg = 'bg-yellow-500/15 border-yellow-500/40 text-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.2)]';
  let icon = <HelpCircle className="w-3.5 h-3.5 text-yellow-400" />;

  if (norm.includes('confirm')) {
    label = 'CONFIRMED';
    bg = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]';
    icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
  } else if (norm.includes('invalid')) {
    label = 'INVALID';
    bg = 'bg-rose-500/15 border-rose-500/40 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.25)]';
    icon = <XCircle className="w-3.5 h-3.5 text-rose-400" />;
  } else if (norm.includes('reproduce') || norm.includes('cannot-reproduce')) {
    label = 'CANNOT REPRODUCE';
    bg = 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]';
    icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider gap-1',
    md: 'text-xs px-2.5 py-1 tracking-wider gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 font-semibold tracking-widest gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full font-mono font-medium border uppercase backdrop-blur-md ${bg} ${sizeClasses} ${className}`}
    >
      {showIcon && icon}
      <span>{label}</span>
    </span>
  );
};

export default StatusBadge;
