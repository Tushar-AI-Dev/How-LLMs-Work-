import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'narrow' | 'wide' | 'prose';
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  size = 'default',
}) => {
  const sizeClasses = {
    // Standard publication width: ~1140px
    default: 'max-w-6xl',
    // Reading / chapter content: ~780px
    narrow: 'max-w-3xl',
    // Long-form editorial prose: 65-75ch
    prose: 'max-w-prose',
    // Full interactive workbench: ~1320px
    wide: 'max-w-7xl',
  };

  return (
    <div className={`mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-10 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
};
