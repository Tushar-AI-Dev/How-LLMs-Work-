import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  const isInteractive = Boolean(onClick || hoverable);

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`
        bg-white dark:bg-[#141518]
        border border-[#e6e0d4] dark:border-[#26282f]
        rounded-lg p-5 sm:p-6
        transition-all duration-150
        ${
          isInteractive
            ? 'cursor-pointer hover:border-[#cfc6b5] dark:hover:border-[#3a3e49] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c2410c] dark:focus-visible:ring-[#d97706]'
            : ''
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
};
