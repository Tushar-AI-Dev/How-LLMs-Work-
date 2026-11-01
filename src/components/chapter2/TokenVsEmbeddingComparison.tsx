import React from 'react';
import { Hash, Layers, Check, X } from 'lucide-react';

export const TokenVsEmbeddingComparison: React.FC = () => {
  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-8 shadow-xs">
      <div className="pb-4 border-b border-[#ece7dc] dark:border-[#22242b] mb-6">
        <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
          Section 07 · Core Principles
        </span>
        <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
          Important Distinction: Token ID vs. Embedding
        </h3>
        <p className="mt-2 text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          Students of machine learning frequently conflate Token IDs with Embeddings. They serve entirely distinct architectural functions.
        </p>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Token ID */}
        <div className="p-5 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#ded7ca] dark:border-[#282a32] rounded-lg space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#78716c] dark:text-[#9ca3af]">
            <Hash className="w-4 h-4 text-[#78716c]" />
            <span>TOKEN ID</span>
          </div>

          <div className="p-3 bg-white dark:bg-[#16171c] rounded border border-[#ded7ca] dark:border-[#282a32] font-mono text-sm font-bold text-[#1c1917] dark:text-[#f3f4f6]">
            Discrete Integer (e.g. 3797)
          </div>

          <ul className="space-y-2.5 text-xs text-[#57534e] dark:text-[#9ca3af]">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#78716c] mt-1.5 shrink-0" />
              <span><strong>Nature:</strong> A discrete scalar index in the vocabulary list.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#78716c] mt-1.5 shrink-0" />
              <span><strong>Semantic value:</strong> None. It has no angle, magnitude, or distance.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#78716c] mt-1.5 shrink-0" />
              <span><strong>Differentiability:</strong> Non-differentiable. Cannot compute gradients on integers.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#78716c] mt-1.5 shrink-0" />
              <span><strong>Function:</strong> Acts as a key to look up a row in the embedding matrix.</span>
            </li>
          </ul>
        </div>

        {/* Right Column: Embedding Vector */}
        <div className="p-5 bg-[#fffaf5] dark:bg-[#1c1611] border border-[#fed7aa] dark:border-[#4d3215] rounded-lg space-y-4 ring-1 ring-[#c2410c]/20">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#c2410c] dark:text-[#d97706]">
            <Layers className="w-4 h-4 text-[#c2410c] dark:text-[#d97706]" />
            <span>EMBEDDING VECTOR</span>
          </div>

          <div className="p-3 bg-white dark:bg-[#16171c] rounded border border-[#fed7aa] dark:border-[#4d3215] font-mono text-sm font-bold text-[#c2410c] dark:text-[#d97706] truncate">
            Dense Array [0.72, -0.48, ..., +0.64] ∈ ℝ⁴⁰⁹⁶
          </div>

          <ul className="space-y-2.5 text-xs text-[#57534e] dark:text-[#9ca3af]">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c2410c] dark:bg-[#d97706] mt-1.5 shrink-0" />
              <span><strong>Nature:</strong> Continuous high-dimensional geometric coordinates.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c2410c] dark:bg-[#d97706] mt-1.5 shrink-0" />
              <span><strong>Semantic value:</strong> High. Dot products and angles capture conceptual similarity.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c2410c] dark:bg-[#d97706] mt-1.5 shrink-0" />
              <span><strong>Differentiability:</strong> Fully differentiable. Can be continuously updated via backprop.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c2410c] dark:bg-[#d97706] mt-1.5 shrink-0" />
              <span><strong>Function:</strong> The actual continuous activation passed to transformer layers.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
