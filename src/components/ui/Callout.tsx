import React from 'react';
import { Info, BookOpen, AlertCircle, Compass } from 'lucide-react';

interface CalloutProps {
  title?: string;
  type?: 'note' | 'concept' | 'warning' | 'curatorial';
  children: React.ReactNode;
  className?: string;
}

export const Callout: React.FC<CalloutProps> = ({
  title,
  type = 'note',
  children,
  className = '',
}) => {
  const config = {
    note: {
      icon: <Info className="w-4 h-4 text-[#0284c7] dark:text-[#38bdf8] shrink-0 mt-0.5" />,
      titleColor: 'text-[#0369a1] dark:text-[#38bdf8]',
      border: 'border-[#bae6fd] dark:border-[#1e3a5f]',
      bg: 'bg-[#f0f9ff]/70 dark:bg-[#0c1e33]/40',
    },
    concept: {
      icon: <BookOpen className="w-4 h-4 text-[#9a3412] dark:text-[#fbbf24] shrink-0 mt-0.5" />,
      titleColor: 'text-[#9a3412] dark:text-[#fbbf24]',
      border: 'border-[#fed7aa] dark:border-[#4d3319]',
      bg: 'bg-[#fff7ed]/80 dark:bg-[#281b10]/40',
    },
    warning: {
      icon: <AlertCircle className="w-4 h-4 text-[#b45309] dark:text-[#f59e0b] shrink-0 mt-0.5" />,
      titleColor: 'text-[#b45309] dark:text-[#f59e0b]',
      border: 'border-[#fde68a] dark:border-[#423114]',
      bg: 'bg-[#fefce8]/80 dark:bg-[#28210f]/40',
    },
    curatorial: {
      icon: <Compass className="w-4 h-4 text-[#57534e] dark:text-[#a1a1aa] shrink-0 mt-0.5" />,
      titleColor: 'text-[#292524] dark:text-[#f3f4f6]',
      border: 'border-[#e6e0d4] dark:border-[#2a2d36]',
      bg: 'bg-[#f5f0e6]/70 dark:bg-[#17181d]/80',
    },
  };

  const selected = config[type];

  return (
    <aside
      className={`
        border ${selected.border} ${selected.bg}
        rounded-lg p-4 sm:p-5 text-sm text-[#44403c] dark:text-[#d1d5db]
        transition-colors duration-150 my-5
        ${className}
      `}
    >
      <div className="flex items-start gap-3">
        {selected.icon}
        <div className="grow space-y-1">
          {title && (
            <h4 className={`font-semibold text-xs uppercase tracking-wider ${selected.titleColor}`}>
              {title}
            </h4>
          )}
          <div className="leading-relaxed text-sm">{children}</div>
        </div>
      </div>
    </aside>
  );
};
