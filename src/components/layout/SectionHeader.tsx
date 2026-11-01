import React from 'react';

interface SectionHeaderProps {
  kicker?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  badge?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  kicker,
  title,
  description,
  align = 'left',
  className = '',
  badge,
}) => {
  return (
    <div
      className={`mb-8 sm:mb-10 ${
        align === 'center' ? 'text-center mx-auto max-w-2xl' : 'max-w-3xl'
      } ${className}`}
    >
      <div className={`flex items-center gap-3 mb-2.5 ${align === 'center' ? 'justify-center' : ''}`}>
        {kicker && (
          <span className="text-xs font-mono uppercase tracking-widest text-[#9a3412] dark:text-[#d97706] font-semibold">
            {kicker}
          </span>
        )}
        {badge}
      </div>

      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-medium tracking-tight text-[#1c1917] dark:text-[#f3f4f6] text-balance">
        {title}
      </h2>

      {description && (
        <p className="mt-3 text-base sm:text-lg text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};
