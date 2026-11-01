import React from 'react';
import { Award, BookOpen, Sparkles, RotateCcw, ArrowRight } from 'lucide-react';
import { NavigationTab } from '../../types';

interface FinalConclusionCardProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const FinalConclusionCard: React.FC<FinalConclusionCardProps> = ({ onNavigate }) => {
  return (
    <div className="bg-gradient-to-br from-[#faf8f5] to-[#f4efe6] dark:from-[#131417] dark:to-[#0c0d10] border border-[#e6e0d4] dark:border-[#26282f] rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-sm">
      {/* Badge Icon */}
      <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#c2410c] dark:text-[#d97706]">
        <Award className="w-8 h-8" />
      </div>

      {/* Main Title & Copy */}
      <div className="max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] font-bold">
          Educational Monograph Complete
        </span>
        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] tracking-tight">
          You've explored the inside of a language model.
        </h3>
        <p className="text-base sm:text-lg text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          From raw text to tokenization, embeddings, positional encoding, self-attention, stacked transformer blocks, and finally next-token generation, you've followed the mathematical journey that makes modern artificial intelligence possible.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => onNavigate('learn')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#c2410c] dark:bg-[#d97706] text-white font-mono text-xs font-semibold hover:bg-[#9c381f] dark:hover:bg-[#b45309] transition-colors shadow-xs cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          <span>Review All Chapters</span>
        </button>

        <button
          onClick={() => onNavigate('playground')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#ece7dc] dark:border-[#282a32] bg-white dark:bg-[#1a1c22] text-[#1c1917] dark:text-[#f3f4f6] font-mono text-xs font-semibold hover:border-[#c2410c] dark:hover:border-[#d97706] transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Interactive Playground</span>
        </button>

        <button
          onClick={() => onNavigate('chapter-1')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-transparent text-[#78716c] dark:text-[#9ca3af] font-mono text-xs hover:text-[#1c1917] dark:hover:text-[#f3f4f6] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Start Journey Again</span>
        </button>
      </div>
    </div>
  );
};
