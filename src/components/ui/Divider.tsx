import React from 'react';

interface DividerProps {
  className?: string;
  label?: string;
}

export const Divider: React.FC<DividerProps> = ({ className = '', label }) => {
  if (!label) {
    return (
      <hr
        className={`border-0 border-t border-[#e6e0d4] dark:border-[#26282f] my-8 sm:my-12 w-full ${className}`}
      />
    );
  }

  return (
    <div className={`relative flex items-center my-8 sm:my-12 w-full ${className}`}>
      <div className="grow border-t border-[#e6e0d4] dark:border-[#26282f]" />
      <span className="shrink mx-4 text-xs font-mono uppercase tracking-widest text-[#78716c] dark:text-[#71717a]">
        {label}
      </span>
      <div className="grow border-t border-[#e6e0d4] dark:border-[#26282f]" />
    </div>
  );
};
