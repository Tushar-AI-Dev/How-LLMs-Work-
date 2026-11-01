import React from 'react';
import { ArrowRight, Layers, HelpCircle, AlertCircle } from 'lucide-react';

export const WhyEmbeddingsArentEnough: React.FC = () => {
  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-8 shadow-xs">
      <div className="pb-4 border-b border-[#ece7dc] dark:border-[#22242b] mb-6">
        <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
          Section 03 · Mathematical Rationale
        </span>
        <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
          Why Embeddings Alone Aren't Enough
        </h3>
        <p className="mt-2 text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          In Chapter 02, we observed that token embeddings project words into learned vectors. But look what happens when the same tokens appear in reverse order:
        </p>
      </div>

      {/* Visual Sequence Comparison */}
      <div className="space-y-4">
        {/* Sequence A */}
        <div className="p-4 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#ded7ca] dark:border-[#282a32] rounded-lg">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="font-bold text-[#c2410c] dark:text-[#d97706]">Sequence A (Dog chases):</span>
            <span className="text-[#78716c] dark:text-[#9ca3af]">Position Index → Vector</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2.5 bg-white dark:bg-[#16171c] rounded border border-[#ded7ca] dark:border-[#282a32]">
              <span className="text-[#78716c] block text-[10px]">Pos 0</span>
              <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6]">"dog"</span>
              <div className="text-[10px] text-[#78716c] truncate mt-1">E_dog = [0.68, 0.52, ...]</div>
            </div>
            <div className="p-2.5 bg-white dark:bg-[#16171c] rounded border border-[#ded7ca] dark:border-[#282a32]">
              <span className="text-[#78716c] block text-[10px]">Pos 1</span>
              <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6]">"chased"</span>
              <div className="text-[10px] text-[#78716c] truncate mt-1">E_chased = [-0.15, 0.82, ...]</div>
            </div>
            <div className="p-2.5 bg-white dark:bg-[#16171c] rounded border border-[#ded7ca] dark:border-[#282a32]">
              <span className="text-[#78716c] block text-[10px]">Pos 2</span>
              <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6]">"cat"</span>
              <div className="text-[10px] text-[#78716c] truncate mt-1">E_cat = [0.72, 0.48, ...]</div>
            </div>
          </div>
        </div>

        {/* Sequence B */}
        <div className="p-4 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#ded7ca] dark:border-[#282a32] rounded-lg">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="font-bold text-[#0284c7]">Sequence B (Cat chases):</span>
            <span className="text-[#78716c] dark:text-[#9ca3af]">Position Index → Vector</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2.5 bg-white dark:bg-[#16171c] rounded border border-[#ded7ca] dark:border-[#282a32]">
              <span className="text-[#78716c] block text-[10px]">Pos 0</span>
              <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6]">"cat"</span>
              <div className="text-[10px] text-[#78716c] truncate mt-1">E_cat = [0.72, 0.48, ...]</div>
            </div>
            <div className="p-2.5 bg-white dark:bg-[#16171c] rounded border border-[#ded7ca] dark:border-[#282a32]">
              <span className="text-[#78716c] block text-[10px]">Pos 1</span>
              <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6]">"chased"</span>
              <div className="text-[10px] text-[#78716c] truncate mt-1">E_chased = [-0.15, 0.82, ...]</div>
            </div>
            <div className="p-2.5 bg-white dark:bg-[#16171c] rounded border border-[#ded7ca] dark:border-[#282a32]">
              <span className="text-[#78716c] block text-[10px]">Pos 2</span>
              <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6]">"dog"</span>
              <div className="text-[10px] text-[#78716c] truncate mt-1">E_dog = [0.68, 0.52, ...]</div>
            </div>
          </div>
        </div>
      </div>

      {/* The Core Paradox */}
      <div className="mt-6 p-4 bg-[#f8f5ee] dark:bg-[#191b21] rounded-lg border border-[#ded7ca] dark:border-[#282a32] text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed space-y-2">
        <div className="flex items-center gap-2 text-[#c2410c] dark:text-[#d97706] font-bold">
          <AlertCircle className="w-4 h-4" />
          <span>The Identical Embedding Paradox</span>
        </div>
        <p>
          Notice that the embedding vector <code>E_dog</code> is precisely identical whether it sits at <strong>Position 0</strong> or <strong>Position 2</strong>. In other words:
          <code className="block my-1.5 p-2 bg-white dark:bg-[#141518] rounded font-mono text-[#1c1917] dark:text-[#f3f4f6]">
            EmbeddingMatrix["dog"] has no clock, no tape counter, and no sequence knowledge.
          </code>
          To resolve this, Vaswani et al. proposed adding an independent mathematical vector <code className="font-mono text-[#c2410c] dark:text-[#d97706] font-semibold">P_pos</code> directly to each token embedding before feeding it into the first attention layer.
        </p>
      </div>
    </div>
  );
};
