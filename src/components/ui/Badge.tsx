import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'accent' | 'mono' | 'muted';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
}) => {
  const variantStyles = {
    neutral: 'text-[#44403c] dark:text-[#a1a1aa] bg-[#ece7dd] dark:bg-[#1e2026] border border-[#ded7ca] dark:border-[#2b2e37]',
    accent: 'text-[#9a3412] dark:text-[#fbbf24] bg-[#ffedd5] dark:bg-[#2e2313] border border-[#fed7aa] dark:border-[#4d3618]',
    mono: 'font-mono text-xs text-[#57534e] dark:text-[#a1a1aa] bg-[#f0ebdF] dark:bg-[#1a1c22] border border-[#ded7ca] dark:border-[#282b34]',
    muted: 'text-[#78716c] dark:text-[#71717a] bg-transparent',
  };

  return (
    <span
      className={`
        inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-[4px]
        whitespace-nowrap tracking-tight
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export const MetadataLine: React.FC<{
  items: React.ReactNode[];
  separator?: string;
  className?: string;
}> = ({ items, separator = '·', className = '' }) => {
  return (
    <div className={`flex flex-wrap items-center gap-2 text-xs text-[#78716c] dark:text-[#9ca3af] ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span aria-hidden="true" className="text-[#a8a29e] dark:text-[#52525b]">{separator}</span>}
          <span>{item}</span>
        </React.Fragment>
      ))}
    </div>
  );
};
