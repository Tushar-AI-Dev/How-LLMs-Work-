import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

import { LatexRenderer } from './LatexRenderer';

interface MathBlockProps {
  formula: string;
  label?: string;
  description?: string;
  variables?: { symbol: string; meaning: string }[];
  className?: string;
}

export const MathBlock: React.FC<MathBlockProps> = ({
  formula,
  label,
  description,
  variables,
  className = '',
}) => {
  return (
    <div
      className={`
        border border-[#e6e0d4] dark:border-[#26282f]
        bg-white dark:bg-[#131417]
        rounded-lg p-5 sm:p-6 my-6
        ${className}
      `}
    >
      {label && (
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#ece7dc] dark:border-[#22242b]">
          <span className="text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af]">
            {label}
          </span>
          <span className="text-xs text-[#a8a29e] dark:text-[#52525b] font-mono">Formal Definition</span>
        </div>
      )}

      {/* Formula Presentation using KaTeX */}
      <div className="py-4 text-center overflow-x-auto">
        <div className="inline-block text-base sm:text-lg md:text-xl text-[#1c1917] dark:text-[#f3f4f6] px-4 py-2 bg-[#faf8f5] dark:bg-[#181a1f] rounded border border-[#ece7dc] dark:border-[#282b33]">
          <LatexRenderer math={formula} displayMode={true} />
        </div>
      </div>

      {description && (
        <p className="mt-3 text-xs sm:text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed text-center max-w-xl mx-auto">
          {description}
        </p>
      )}

      {variables && variables.length > 0 && (
        <div className="mt-5 pt-4 border-t border-[#ece7dc] dark:border-[#22242b]">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#a8a29e] dark:text-[#6b7280] mb-2.5">
            Tensor & Variable Notation
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {variables.map((v, idx) => (
              <div key={idx} className="flex items-baseline gap-2">
                <span className="font-mono font-medium text-[#c2410c] dark:text-[#d97706] shrink-0">
                  {v.symbol}
                </span>
                <span className="text-[#57534e] dark:text-[#9ca3af] truncate">
                  {v.meaning}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface CodeBlockProps {
  code: string;
  language?: string;
  caption?: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'python',
  caption,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`
        border border-[#e6e0d4] dark:border-[#26282f]
        bg-[#111215] text-[#e5e7eb]
        rounded-lg overflow-hidden my-6
        ${className}
      `}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-[#181a1f] border-b border-[#26282f] text-xs font-mono text-[#9ca3af]">
        <span>{caption || language}</span>
        <button
          onClick={handleCopy}
          aria-label="Copy code snippet"
          className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-[#9ca3af] hover:text-white hover:bg-[#26282f] transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-[#f3f4f6]">
        <code>{code}</code>
      </pre>
    </div>
  );
};
