import React from 'react';
import { ArrowRight, Layers, Shuffle, Sparkles, Network } from 'lucide-react';

export const SelfAttentionConcept: React.FC = () => {
  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-8 shadow-xs">
      <div className="pb-4 border-b border-[#ece7dc] dark:border-[#22242b] mb-6">
        <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
          Section 03 · Core Intuition
        </span>
        <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
          What Is Self-Attention?
        </h3>
        <p className="mt-2 text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          In human language, the meaning of a word is profoundly malleable. A word like <strong className="text-[#1c1917] dark:text-[#f3f4f6]">"bank"</strong> means something completely different when neighboring tokens include <em>"river and muddy water"</em> versus <em>"deposit and interest rate"</em>.
        </p>
      </div>

      {/* The Fundamental Shift: Static to Contextual */}
      <div className="p-6 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-xl space-y-6">
        <div className="text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] font-semibold">
          The Information Flow Pipeline
        </div>

        {/* Visual Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Step 1: Input Representations */}
          <div className="p-4 bg-white dark:bg-[#141518] border border-[#ded7ca] dark:border-[#282a32] rounded-lg space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#78716c]">Stage 01</span>
              <span className="px-2 py-0.5 rounded bg-[#f4efe6] dark:bg-[#1f2128] text-[10px] text-[#57534e] dark:text-[#9ca3af]">
                Chapters 01–03
              </span>
            </div>
            <h4 className="font-serif text-base font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
              Input Representations
            </h4>
            <p className="text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
              Token Embedding + Positional Encoding. Each token holds its static dictionary meaning and position coordinate, but possesses <strong>zero awareness</strong> of its neighbors.
            </p>
            <div className="p-2 bg-[#faf8f5] dark:bg-[#0c0d10] rounded text-[11px] font-mono text-[#c2410c] dark:text-[#d97706]">
              Isolated Vectors: x₁, x₂, ..., x_n
            </div>
          </div>

          {/* Step 2: Self-Attention Exchange */}
          <div className="p-4 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/60 rounded-lg space-y-2 relative">
            <div className="flex items-center justify-between text-xs font-mono text-amber-800 dark:text-amber-300">
              <span>Stage 02</span>
              <span className="px-2 py-0.5 rounded bg-amber-200/60 dark:bg-amber-900/60 text-[10px] font-bold">
                Chapter 04 Core
              </span>
            </div>
            <h4 className="font-serif text-base font-semibold text-amber-950 dark:text-amber-100 flex items-center gap-1.5">
              <Network className="w-4 h-4 text-[#c2410c] dark:text-[#d97706]" />
              <span>Self-Attention Operation</span>
            </h4>
            <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
              Every token interrogates every other token simultaneously. Dot products compute pairwise relevance scores, creating dynamic contextual bridges.
            </p>
            <div className="p-2 bg-white/80 dark:bg-[#141518] rounded text-[11px] font-mono font-semibold text-amber-900 dark:text-amber-200">
              Pairwise Dot Products & Softmax
            </div>
          </div>

          {/* Step 3: Context-Aware Representations */}
          <div className="p-4 bg-white dark:bg-[#141518] border border-[#ded7ca] dark:border-[#282a32] rounded-lg space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#78716c]">Stage 03</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold">
                Output
              </span>
            </div>
            <h4 className="font-serif text-base font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
              Contextual Representations
            </h4>
            <p className="text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
              The vector for "it" now contains features absorbed from "animal". The vector for "bank" is infused with financial or geological traits from its surrounding sentence.
            </p>
            <div className="p-2 bg-[#faf8f5] dark:bg-[#0c0d10] rounded text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
              Contextual Vectors: z₁, z₂, ..., z_n
            </div>
          </div>
        </div>

        {/* Why Is It Called "Self"-Attention? */}
        <div className="mt-4 p-4 bg-white dark:bg-[#141518] rounded-lg border border-[#ded7ca] dark:border-[#282a32] text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed space-y-2">
          <div className="font-bold text-[#1c1917] dark:text-[#f3f4f6] text-sm">
            Why is it called "Self"-Attention?
          </div>
          <p>
            In older encoder-decoder translation models, an <em>encoder</em> attended to an English source sentence while a <em>decoder</em> attended across to generate French words (known as <strong>cross-attention</strong>).
          </p>
          <p>
            In modern autoregressive LLMs (like GPT, Claude, and LLaMA), attention happens entirely <em>within the same sequence</em>: the tokens of a sentence attend to the other tokens of the <strong>exact same sentence</strong> to resolve their own meanings. Hence the term <strong>self-attention</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
