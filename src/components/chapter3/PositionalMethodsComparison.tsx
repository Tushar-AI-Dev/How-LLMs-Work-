import React, { useState } from 'react';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Waves, Database, RotateCw, Check, ArrowRight } from 'lucide-react';

export const PositionalMethodsComparison: React.FC = () => {
  const [activeMethod, setActiveMethod] = useState<'sinusoidal' | 'learned' | 'rope'>('rope');

  const methods = {
    sinusoidal: {
      title: "A. Sinusoidal Positional Encoding",
      creator: "Vaswani et al. (2017) · 'Attention Is All You Need'",
      usedIn: "Original Transformer, BERT variants, Transformer-XL",
      type: "Absolute Fixed Function",
      mechanism: "Fixed sine and cosine mathematical waves added to embeddings before Layer 1.",
      advantages: "Zero learned parameters. Can theoretically interpolate between arbitrary continuous points.",
      limitations: "Absolute positions make it harder to generalize relative distance when sequences grow very long.",
      formula: "\\text{PE}(pos, 2i) = \\sin(pos / 10000^{2i/d})",
    },
    learned: {
      title: "B. Learned Positional Embeddings",
      creator: "Radford et al. (2018, 2019) · GPT & GPT-2",
      usedIn: "GPT-2, BERT, RoBERTa, original OPT",
      type: "Absolute Learned Matrix",
      mechanism: "A dedicated lookup table W_pos ∈ ℝ^(L_max × d) with trainable parameters, updated via backpropagation like normal embeddings.",
      advantages: "The model can adapt positional coordinates specifically to training data distributions.",
      limitations: "Hard context ceiling: cannot extrapolate even 1 token beyond the maximum trained sequence length L_max.",
      formula: "x = W_e[t] + W_{pos}[pos]",
    },
    rope: {
      title: "C. Rotary Position Embeddings (RoPE)",
      creator: "Su et al. (2021) · RoFormer",
      usedIn: "LLaMA 1-3, Mistral 7B, Gemma 2, DeepSeek, Qwen",
      type: "Relative Complex Rotation",
      mechanism: "Instead of adding vectors to the input, RoPE multiplies Query and Key vectors by 2D orthogonal rotation matrices inside each attention head.",
      advantages: "Relative distance naturally emerges: (R_m q)ᵀ (R_n k) = qᵀ R_{n-m} k. Enables long-context extension to 32k–128k tokens.",
      limitations: "More complex to implement across grouped-query attention (GQA) heads.",
      formula: "\\mathbf{R}_{\\Theta, m}^d = \\text{diag}(R_{\\theta_1, m}, \\dots, R_{\\theta_{d/2}, m})",
    },
  };

  const selected = methods[activeMethod];

  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-8 shadow-xs">
      <div className="pb-4 border-b border-[#ece7dc] dark:border-[#22242b] mb-6">
        <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
          Section 07 · Architectural Evolution
        </span>
        <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
          Modern Evolution: Three Generational Paradigms
        </h3>
        <p className="mt-2 text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          How positional information is injected has evolved substantially over the past decade. Different models employ completely different mathematical strategies.
        </p>
      </div>

      {/* Method Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <button
          onClick={() => setActiveMethod('sinusoidal')}
          className={`p-3.5 rounded-lg text-left text-xs font-mono border transition-all cursor-pointer ${
            activeMethod === 'sinusoidal'
              ? 'bg-[#c2410c] dark:bg-[#d97706] text-white border-transparent font-bold shadow-xs'
              : 'bg-[#faf8f5] dark:bg-[#1a1c22] text-[#44403c] dark:text-[#d1d5db] border-[#ded7ca] dark:border-[#282a32] hover:border-[#c2410c]'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Waves className="w-4 h-4" />
            <span className="font-bold">A. Sinusoidal</span>
          </div>
          <span className="text-[11px] opacity-80 font-sans block">Fixed mathematical waves</span>
        </button>

        <button
          onClick={() => setActiveMethod('learned')}
          className={`p-3.5 rounded-lg text-left text-xs font-mono border transition-all cursor-pointer ${
            activeMethod === 'learned'
              ? 'bg-[#c2410c] dark:bg-[#d97706] text-white border-transparent font-bold shadow-xs'
              : 'bg-[#faf8f5] dark:bg-[#1a1c22] text-[#44403c] dark:text-[#d1d5db] border-[#ded7ca] dark:border-[#282a32] hover:border-[#c2410c]'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-4 h-4" />
            <span className="font-bold">B. Learned Embeddings</span>
          </div>
          <span className="text-[11px] opacity-80 font-sans block">Trainable parameter lookup</span>
        </button>

        <button
          onClick={() => setActiveMethod('rope')}
          className={`p-3.5 rounded-lg text-left text-xs font-mono border transition-all cursor-pointer ${
            activeMethod === 'rope'
              ? 'bg-[#c2410c] dark:bg-[#d97706] text-white border-transparent font-bold shadow-xs'
              : 'bg-[#faf8f5] dark:bg-[#1a1c22] text-[#44403c] dark:text-[#d1d5db] border-[#ded7ca] dark:border-[#282a32] hover:border-[#c2410c]'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <RotateCw className="w-4 h-4" />
            <span className="font-bold">C. Rotary (RoPE)</span>
          </div>
          <span className="text-[11px] opacity-80 font-sans block">Modern 2D relative rotations</span>
        </button>
      </div>

      {/* Detailed Method Breakdown Card */}
      <div className="p-6 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-[#ded7ca] dark:border-[#282a32]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-bold">
              {selected.type}
            </span>
            <h4 className="font-serif text-xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
              {selected.title}
            </h4>
            <div className="text-xs text-[#78716c] dark:text-[#9ca3af] mt-1 font-mono">
              Citation: {selected.creator}
            </div>
          </div>

          <div className="text-xs font-mono px-2.5 py-1 rounded bg-white dark:bg-[#16171c] border border-[#ded7ca] dark:border-[#282a32] text-[#1c1917] dark:text-[#f3f4f6] self-start">
            Used in: {selected.usedIn}
          </div>
        </div>

        {/* Mathematical Expression */}
        <div className="p-3 bg-white dark:bg-[#141518] rounded-lg border border-[#ded7ca] dark:border-[#282a32] text-center overflow-x-auto text-xs sm:text-sm text-[#1c1917] dark:text-[#f3f4f6]">
          <LatexRenderer math={selected.formula} displayMode={true} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
          <div className="p-3 bg-white dark:bg-[#141518] rounded border border-[#ded7ca] dark:border-[#282a32] space-y-1">
            <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6] block">
              Core Mechanism
            </span>
            <p className="text-[#57534e] dark:text-[#9ca3af]">
              {selected.mechanism}
            </p>
          </div>

          <div className="p-3 bg-white dark:bg-[#141518] rounded border border-[#ded7ca] dark:border-[#282a32] space-y-1">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 block">
              Primary Advantage
            </span>
            <p className="text-[#57534e] dark:text-[#9ca3af]">
              {selected.advantages}
            </p>
          </div>
        </div>

        <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded border border-amber-200 dark:border-amber-800/60 text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
          <strong>Architectural Constraint:</strong> {selected.limitations}
        </div>
      </div>
    </div>
  );
};
