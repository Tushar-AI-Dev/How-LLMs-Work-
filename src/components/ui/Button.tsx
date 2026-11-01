import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'editorial';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  children,
  className = '',
  disabled,
  ...props
}) => {
  // Spatial math: horizontal ≈ 2x vertical padding
  const sizeStyles = {
    sm: 'text-xs py-1.5 px-3 gap-1.5',
    md: 'text-sm py-2 px-4 gap-2',
    lg: 'text-base py-2.5 px-5 gap-2.5',
  };

  const variantStyles = {
    // Primary: Deep dark stone in light mode, crisp white in dark mode. High contrast, refined.
    primary:
      'bg-[#1c1917] text-white hover:bg-[#292524] dark:bg-[#f3f4f6] dark:text-[#111215] dark:hover:bg-white shadow-xs border border-transparent',
    
    // Secondary: Subtle surface container
    secondary:
      'bg-[#f0ebe1] text-[#292524] hover:bg-[#e6e0d4] dark:bg-[#1f2127] dark:text-[#e5e7eb] dark:hover:bg-[#282a32] border border-[#e2dbce] dark:border-[#2a2d36]',
    
    // Outline: 1px hairline border with clear hover
    outline:
      'bg-transparent text-[#292524] dark:text-[#e5e7eb] border border-[#d6cfc0] dark:border-[#2d3039] hover:bg-[#f4efe6]/60 dark:hover:bg-[#1a1b20]',
    
    // Ghost: Flat with hover state
    ghost:
      'bg-transparent text-[#57534e] hover:text-[#1c1917] hover:bg-[#f4efe6]/50 dark:text-[#9ca3af] dark:hover:text-[#f3f4f6] dark:hover:bg-[#1b1c21]',
    
    // Editorial: Curatorial button with subtle terracotta/amber accent
    editorial:
      'bg-[#c2410c] text-white hover:bg-[#9a3412] dark:bg-[#d97706] dark:text-stone-950 dark:hover:bg-[#b45309] font-medium shadow-xs border border-transparent',
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium
        rounded-md transition-colors duration-150 select-none
        whitespace-nowrap shrink-0 cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c2410c] dark:focus-visible:ring-[#d97706] focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-light dark:focus-visible:ring-offset-canvas-dark
        disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
