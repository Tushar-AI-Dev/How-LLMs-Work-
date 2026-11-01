import React, { useState } from 'react';
import { ArrowRight, Cpu, FileText, Binary, Check } from 'lucide-react';

export const TextToTokensHero: React.FC = () => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Exact sample sentence from the brief
  const rawText = "The cat is sleeping.";
  const tokens = [
    { text: "The", id: 464, color: "bg-amber-100 dark:bg-amber-950/50 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-700" },
    { text: " cat", id: 3797, color: "bg-sky-100 dark:bg-sky-950/50 text-sky-950 dark:text-sky-200 border-sky-300 dark:border-sky-700" },
    { text: " is", id: 318, color: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700" },
    { text: " sleeping", id: 5633, color: "bg-purple-100 dark:bg-purple-950/50 text-purple-950 dark:text-purple-200 border-purple-300 dark:border-purple-700" },
    { text: ".", id: 13, color: "bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-200 border-stone-400 dark:border-stone-600" },
  ];

  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-8 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-[#ece7dc] dark:border-[#22242b] mb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            Fundamental Conversion Pipeline
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
            The Three-Stage Transformation
          </h3>
        </div>

        {/* Step Selector Controls */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((step) => (
            <button
              key={step}
              onClick={() => setActiveStep(step as any)}
              className={`
                px-2.5 py-1 text-xs font-mono rounded transition-colors cursor-pointer border
                ${
                  activeStep === step
                    ? 'bg-[#1c1917] text-white dark:bg-[#f3f4f6] dark:text-[#111215] border-transparent font-bold'
                    : 'bg-[#faf8f5] dark:bg-[#1a1c22] text-[#78716c] dark:text-[#9ca3af] border-[#ded7ca] dark:border-[#2a2d36]'
                }
              `}
            >
              Step {step}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Pipeline Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        {/* Step 1: Raw Text */}
        <div
          onClick={() => setActiveStep(1)}
          className={`p-5 rounded-lg border transition-all cursor-pointer ${
            activeStep === 1
              ? 'border-[#c2410c] dark:border-[#d97706] bg-[#fffaf5] dark:bg-[#1f1a14] ring-1 ring-[#c2410c]/30'
              : 'border-[#e6e0d4] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#0e0f12] opacity-80'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono text-[#78716c] dark:text-[#9ca3af] mb-3">
            <span className="font-bold text-[#c2410c] dark:text-[#d97706]">01. RAW TEXT</span>
            <span>Human Interface</span>
          </div>
          <div className="p-3 bg-white dark:bg-[#16171c] border border-[#ded7ca] dark:border-[#26282f] rounded font-serif text-lg text-[#1c1917] dark:text-[#f3f4f6]">
            "{rawText}"
          </div>
          <p className="mt-3 text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            Continuous sequence of 20 UTF-8 characters. The computer does not understand the concept of "cat" or "sleep".
          </p>
        </div>

        {/* Step 2: Tokens */}
        <div
          onClick={() => setActiveStep(2)}
          className={`p-5 rounded-lg border transition-all cursor-pointer ${
            activeStep === 2
              ? 'border-[#c2410c] dark:border-[#d97706] bg-[#fffaf5] dark:bg-[#1f1a14] ring-1 ring-[#c2410c]/30'
              : 'border-[#e6e0d4] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#0e0f12] opacity-80'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono text-[#78716c] dark:text-[#9ca3af] mb-3">
            <span className="font-bold text-[#c2410c] dark:text-[#d97706]">02. TOKENS</span>
            <span>Vocabulary Units</span>
          </div>
          <div className="p-2 bg-white dark:bg-[#16171c] border border-[#ded7ca] dark:border-[#26282f] rounded flex flex-wrap gap-1">
            {tokens.map((t, i) => (
              <span
                key={i}
                className={`text-xs font-mono px-2 py-0.5 rounded border ${t.color}`}
              >
                {t.text.replace(' ', '␣')}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            Decomposed into 5 discrete subword tokens. Leading whitespaces (␣) are preserved as part of the token string.
          </p>
        </div>

        {/* Step 3: Token IDs */}
        <div
          onClick={() => setActiveStep(3)}
          className={`p-5 rounded-lg border transition-all cursor-pointer ${
            activeStep === 3
              ? 'border-[#c2410c] dark:border-[#d97706] bg-[#fffaf5] dark:bg-[#1f1a14] ring-1 ring-[#c2410c]/30'
              : 'border-[#e6e0d4] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#0e0f12] opacity-80'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono text-[#78716c] dark:text-[#9ca3af] mb-3">
            <span className="font-bold text-[#c2410c] dark:text-[#d97706]">03. TOKEN IDS</span>
            <span>Mathematical Inputs</span>
          </div>
          <div className="p-2.5 bg-white dark:bg-[#16171c] border border-[#ded7ca] dark:border-[#26282f] rounded font-mono text-xs text-[#c2410c] dark:text-[#d97706] font-semibold flex flex-wrap gap-1.5">
            [464, 3797, 318, 5633, 13]
          </div>
          <p className="mt-3 text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            Mapped to integer row indices in the embedding table. These integers are what the neural network actually computes.
          </p>
        </div>
      </div>

      {/* Explanatory Callout Banner */}
      <div className="mt-6 pt-4 border-t border-[#ece7dc] dark:border-[#22242b] flex items-center justify-between text-xs text-[#78716c] dark:text-[#9ca3af]">
        <span>Formula: <code>Text → [Token₁, Token₂, ...] → [ID₁, ID₂, ...] ∈ ℕᴸ</code></span>
        <span className="font-mono text-[11px] text-[#c2410c] dark:text-[#d97706]">GPT-2 Pretrained Encoding</span>
      </div>
    </div>
  );
};
