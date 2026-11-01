import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Layers, HelpCircle, CheckCircle2 } from 'lucide-react';
import { LatexRenderer } from './LatexRenderer';

export interface FiveQuestionsAnatomy {
  whatIsHappening: string;
  whyIsItNeeded: string;
  whatGoesIn: string;
  whatComesOut: string;
  whatToNotice: string;
}

interface TechnicalDeepDiveProps {
  title: string;
  subtitle?: string;
  formula?: string;
  tensorShapes?: {
    input?: string;
    output?: string;
    weights?: string;
  };
  anatomy: FiveQuestionsAnatomy;
  technicalNote?: string;
  defaultOpen?: boolean;
}

export const TechnicalDeepDive: React.FC<TechnicalDeepDiveProps> = ({
  title,
  subtitle = 'Technical & Mathematical Deep-Dive',
  formula,
  tensorShapes,
  anatomy,
  technicalNote,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="my-8 rounded-xl border border-[#ded7ca] dark:border-[#282a32] bg-white dark:bg-[#131417] overflow-hidden transition-all shadow-xs">
      {/* Header / Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer hover:bg-[#faf8f5] dark:hover:bg-[#18191f] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c2410c] dark:focus-visible:ring-[#d97706]"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-[#faf8f5] dark:bg-[#1a1c22] border border-[#e6e0d4] dark:border-[#26282f] text-[#c2410c] dark:text-[#d97706]">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
              {subtitle}
            </div>
            <h4 className="text-base sm:text-lg font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              {title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af] hidden sm:inline">
            {isOpen ? 'Collapse Deep-Dive' : 'Inspect Details'}
          </span>
          <div className="p-1 rounded text-[#78716c] dark:text-[#9ca3af]">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Expanded Content: Progressive Disclosure */}
      {isOpen && (
        <div className="p-5 sm:p-6 border-t border-[#ece7dc] dark:border-[#22242b] bg-[#faf8f5]/40 dark:bg-[#0c0d10]/30 space-y-6">
          {/* Formula Display if provided */}
          {formula && (
            <div className="p-4 bg-white dark:bg-[#17181d] rounded-lg border border-[#e6e0d4] dark:border-[#26282f] text-center overflow-x-auto">
              <LatexRenderer math={formula} displayMode={true} />
              {tensorShapes && (
                <div className="mt-3 pt-3 border-t border-[#ece7dc] dark:border-[#22242b] flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
                  {tensorShapes.input && (
                    <span>
                      Input:{' '}
                      <strong className="text-[#1c1917] dark:text-[#f3f4f6]">
                        {tensorShapes.input}
                      </strong>
                    </span>
                  )}
                  {tensorShapes.weights && (
                    <span>
                      Weights:{' '}
                      <strong className="text-[#1c1917] dark:text-[#f3f4f6]">
                        {tensorShapes.weights}
                      </strong>
                    </span>
                  )}
                  {tensorShapes.output && (
                    <span>
                      Output:{' '}
                      <strong className="text-[#c2410c] dark:text-[#d97706]">
                        {tensorShapes.output}
                      </strong>
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* The 5 Key Questions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            {/* Question 1: What is happening? */}
            <div className="p-4 rounded-lg bg-white dark:bg-[#16171b] border border-[#e6e0d4] dark:border-[#26282f] space-y-1.5">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] block">
                1. What is happening?
              </span>
              <p className="text-[#44403c] dark:text-[#d1d5db] leading-relaxed">
                {anatomy.whatIsHappening}
              </p>
            </div>

            {/* Question 2: Why is it needed? */}
            <div className="p-4 rounded-lg bg-white dark:bg-[#16171b] border border-[#e6e0d4] dark:border-[#26282f] space-y-1.5">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] block">
                2. Why is it needed?
              </span>
              <p className="text-[#44403c] dark:text-[#d1d5db] leading-relaxed">
                {anatomy.whyIsItNeeded}
              </p>
            </div>

            {/* Question 3: What goes into it? */}
            <div className="p-4 rounded-lg bg-white dark:bg-[#16171b] border border-[#e6e0d4] dark:border-[#26282f] space-y-1.5">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                3. What goes into it (Inputs)?
              </span>
              <p className="text-[#44403c] dark:text-[#d1d5db] leading-relaxed">
                {anatomy.whatGoesIn}
              </p>
            </div>

            {/* Question 4: What comes out? */}
            <div className="p-4 rounded-lg bg-white dark:bg-[#16171b] border border-[#e6e0d4] dark:border-[#26282f] space-y-1.5">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                4. What comes out (Outputs)?
              </span>
              <p className="text-[#44403c] dark:text-[#d1d5db] leading-relaxed">
                {anatomy.whatComesOut}
              </p>
            </div>
          </div>

          {/* Question 5: What should the learner notice? (Span Full Width) */}
          <div className="p-4 rounded-lg bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 space-y-1.5 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-amber-900 dark:text-amber-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>5. What should you notice?</span>
            </div>
            <p className="text-[#44403c] dark:text-[#d1d5db] leading-relaxed">
              {anatomy.whatToNotice}
            </p>
          </div>

          {/* Optional Technical Note */}
          {technicalNote && (
            <div className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af] pt-2 border-t border-[#ece7dc] dark:border-[#22242b] leading-relaxed">
              <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
                Scientific Note:{' '}
              </span>
              {technicalNote}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
