import React, { useState } from 'react';
import { LatexRenderer } from '../ui/LatexRenderer';
import { GitCompare, ShieldCheck, AlertCircle, ArrowDown, Check, X } from 'lucide-react';

export const PreNormPostNormComparison: React.FC = () => {
  const [selectedArch, setSelectedArch] = useState<'prenorm' | 'postnorm'>('prenorm');

  return (
    <div className="bg-white dark:bg-[#131417] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#ece7dc] dark:border-[#22242b] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            <GitCompare className="w-4 h-4" />
            <span>Architectural Evolution</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            Pre-LayerNorm vs Post-LayerNorm
          </h4>
        </div>

        {/* Arch Selector */}
        <div className="flex rounded-lg p-1 bg-[#faf8f5] dark:bg-[#1a1c22] border border-[#ece7dc] dark:border-[#282a32]">
          <button
            onClick={() => setSelectedArch('prenorm')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
              selectedArch === 'prenorm'
                ? 'bg-[#1c1917] text-white dark:bg-white dark:text-[#1c1917] font-semibold shadow-xs'
                : 'text-[#78716c] dark:text-[#9ca3af]'
            }`}
          >
            Pre-LN (Modern Standard)
          </button>
          <button
            onClick={() => setSelectedArch('postnorm')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
              selectedArch === 'postnorm'
                ? 'bg-[#1c1917] text-white dark:bg-white dark:text-[#1c1917] font-semibold shadow-xs'
                : 'text-[#78716c] dark:text-[#9ca3af]'
            }`}
          >
            Post-LN (Original 2017)
          </button>
        </div>
      </div>

      {/* Side-by-Side Diagram & Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-6">
        {/* Pre-LN Card */}
        <div
          onClick={() => setSelectedArch('prenorm')}
          className={`p-6 rounded-xl border transition-all cursor-pointer ${
            selectedArch === 'prenorm'
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-950/10'
              : 'border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#16171b] opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-inherit">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-serif font-semibold text-base text-[#1c1917] dark:text-[#f3f4f6]">
                Pre-LayerNorm (Pre-LN)
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold">
              Industry Standard
            </span>
          </div>

          <div className="py-4 text-center">
            <LatexRenderer
              math="\mathbf{x}_{l+1} = \mathbf{x}_l + \text{Sublayer}(\text{LN}(\mathbf{x}_l))"
              displayMode={true}
            />
          </div>

          {/* Schematic Pipeline */}
          <div className="space-y-1.5 text-xs font-mono max-w-xs mx-auto my-4 text-center">
            <div className="p-2 rounded bg-stone-200/60 dark:bg-stone-800 text-[#1c1917] dark:text-[#f3f4f6] font-medium">
              x_l (Clean Residual Stream)
            </div>
            <ArrowDown className="w-3.5 h-3.5 mx-auto text-[#78716c]" />
            <div className="p-2 rounded bg-sky-100 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 text-sky-900 dark:text-sky-200">
              LayerNorm(x_l)
            </div>
            <ArrowDown className="w-3.5 h-3.5 mx-auto text-[#78716c]" />
            <div className="p-2 rounded bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200">
              Sublayer (MHA or FFN)
            </div>
            <ArrowDown className="w-3.5 h-3.5 mx-auto text-[#78716c]" />
            <div className="p-2 rounded bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-semibold">
              Residual Add: x_l + Sublayer(...)
            </div>
          </div>

          <ul className="space-y-2 text-xs text-[#57534e] dark:text-[#9ca3af] mt-4 pt-4 border-t border-inherit">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Identity shortcut remains 100% unimpeded.</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Stable training for 80+ stacked layers without divergence.</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Used by GPT-3/4, LLaMA, PaLM, Mistral, Gemma, Claude.</span>
            </li>
          </ul>
        </div>

        {/* Post-LN Card */}
        <div
          onClick={() => setSelectedArch('postnorm')}
          className={`p-6 rounded-xl border transition-all cursor-pointer ${
            selectedArch === 'postnorm'
              ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/10 dark:bg-amber-950/10'
              : 'border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#16171b] opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-inherit">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="font-serif font-semibold text-base text-[#1c1917] dark:text-[#f3f4f6]">
                Post-LayerNorm (Post-LN)
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
              Legacy (2017)
            </span>
          </div>

          <div className="py-4 text-center">
            <LatexRenderer
              math="\mathbf{x}_{l+1} = \text{LN}(\mathbf{x}_l + \text{Sublayer}(\mathbf{x}_l))"
              displayMode={true}
            />
          </div>

          {/* Schematic Pipeline */}
          <div className="space-y-1.5 text-xs font-mono max-w-xs mx-auto my-4 text-center">
            <div className="p-2 rounded bg-stone-200/60 dark:bg-stone-800 text-[#1c1917] dark:text-[#f3f4f6] font-medium">
              x_l (Input Stream)
            </div>
            <ArrowDown className="w-3.5 h-3.5 mx-auto text-[#78716c]" />
            <div className="p-2 rounded bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200">
              Sublayer (MHA or FFN)
            </div>
            <ArrowDown className="w-3.5 h-3.5 mx-auto text-[#78716c]" />
            <div className="p-2 rounded bg-stone-200/60 dark:bg-stone-800 text-[#1c1917] dark:text-[#f3f4f6]">
              Residual Add: x_l + Sublayer(x_l)
            </div>
            <ArrowDown className="w-3.5 h-3.5 mx-auto text-[#78716c]" />
            <div className="p-2 rounded bg-sky-100 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 text-sky-900 dark:text-sky-200 font-semibold">
              LayerNorm(Addition)
            </div>
          </div>

          <ul className="space-y-2 text-xs text-[#57534e] dark:text-[#9ca3af] mt-4 pt-4 border-t border-inherit">
            <li className="flex items-center gap-2">
              <X className="w-4 h-4 text-red-500 shrink-0" />
              <span>LN continuously rescales the residual highway.</span>
            </li>
            <li className="flex items-center gap-2">
              <X className="w-4 h-4 text-red-500 shrink-0" />
              <span>Gradients near early layers vanish rapidly as depth increases.</span>
            </li>
            <li className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Requires strict learning rate warmup (10,000 steps) to prevent blowup.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Analytical Comparison Table */}
      <div className="p-4 rounded-xl border border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#181a1f] text-xs font-mono space-y-3">
        <div className="font-semibold text-[#1c1917] dark:text-[#f3f4f6] text-sm">
          Why did the AI industry transition to Pre-LN?
        </div>
        <p className="text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          In 2020, Xiong et al. and Wang et al. proved mathematically that in Post-LN Transformers, the expected gradient scale for early layers decreases with depth <LatexRenderer math="\mathcal{O}(1/\sqrt{L})" />, while the gradient near the output layer remains <LatexRenderer math="\mathcal{O}(1)" />. This gradient imbalance forced early research teams to use delicate learning-rate warmup schedules. In Pre-LN, the gradient through the identity residual stream is strictly <LatexRenderer math="\mathbf{I}" />, allowing deep neural networks to be initialized and trained smoothly from step 1.
        </p>
      </div>
    </div>
  );
};
