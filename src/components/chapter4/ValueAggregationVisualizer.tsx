import React, { useState } from 'react';
import {
  MINI_ATTENTION_SEQUENCE,
  MINI_X,
  MINI_W_Q,
  MINI_W_K,
  MINI_W_V,
  scaledDotProductAttention,
  matmul,
} from '../../services/attentionService';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Layers, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';

export const ValueAggregationVisualizer: React.FC = () => {
  const [selectedQueryIdx, setSelectedQueryIdx] = useState<number>(2); // default "sat"
  const [isCausal, setIsCausal] = useState<boolean>(true);

  // Compute actual Q, K, V
  const Q = matmul(MINI_X, MINI_W_Q);
  const K = matmul(MINI_X, MINI_W_K);
  const V = matmul(MINI_X, MINI_W_V);

  const { attentionWeights, output } = scaledDotProductAttention(Q, K, V, isCausal);

  const queryToken = MINI_ATTENTION_SEQUENCE[selectedQueryIdx];
  const queryWeights = attentionWeights[selectedQueryIdx];
  const queryOutput = output[selectedQueryIdx];

  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-8 shadow-xs">
      <div className="pb-4 border-b border-[#ece7dc] dark:border-[#22242b] mb-6">
        <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
          Section 09 · Information Aggregation
        </span>
        <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
          Attention Output: Linearly Combining Value Vectors
        </h3>
        <p className="mt-2 text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          Softmax weights <LatexRenderer math="\alpha_{i, j}" /> are not just numbers—they act as a dynamic recipe. The final attention output vector <LatexRenderer math="\mathbf{o}_i" /> is constructed as a <strong>weighted average</strong> of all available Value vectors <LatexRenderer math="\mathbf{v}_j" />.
        </p>
      </div>

      {/* Equation Card */}
      <div className="p-4 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-lg mb-6 text-center text-xs sm:text-sm text-[#1c1917] dark:text-[#f3f4f6]">
        <LatexRenderer
          math="\mathbf{o}_i = \sum_{j=1}^N \alpha_{i, j} \mathbf{v}_j = \alpha_{i,1}\mathbf{v}_1 + \alpha_{i,2}\mathbf{v}_2 + \dots + \alpha_{i,N}\mathbf{v}_N"
          displayMode={true}
        />
      </div>

      {/* Interactive Query Token Selector */}
      <div className="p-6 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="block text-xs font-mono uppercase text-[#78716c] dark:text-[#9ca3af] mb-1.5 font-semibold">
              Select Output Token to Synthesize:
            </label>
            <div className="flex flex-wrap gap-2">
              {MINI_ATTENTION_SEQUENCE.map((tok, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedQueryIdx(idx)}
                  className={`px-3 py-1.5 text-xs font-mono rounded cursor-pointer transition-all border ${
                    selectedQueryIdx === idx
                      ? 'bg-[#c2410c] dark:bg-[#d97706] text-white border-transparent font-bold shadow-xs'
                      : 'bg-white dark:bg-[#16171c] text-[#44403c] dark:text-[#d1d5db] border-[#ded7ca] dark:border-[#282a32] hover:border-[#c2410c]'
                  }`}
                >
                  Output: "{tok}" (Pos {idx})
                </button>
              ))}
            </div>
          </div>

          {/* Mask mode toggle */}
          <button
            onClick={() => setIsCausal(!isCausal)}
            className="px-3 py-1.5 text-xs font-mono rounded bg-white dark:bg-[#141518] border border-[#ded7ca] dark:border-[#282a32] text-[#57534e] dark:text-[#9ca3af] hover:text-[#1c1917] cursor-pointer self-start sm:self-auto"
          >
            Mode: {isCausal ? 'Causal Mask (Default)' : 'Unmasked (Bidirectional)'}
          </button>
        </div>

        {/* Linear Combination Breakdown Table */}
        <div className="border border-[#ded7ca] dark:border-[#282a32] rounded-lg overflow-x-auto bg-white dark:bg-[#141518] p-4">
          <div className="min-w-[560px] space-y-3">
            <div className="grid grid-cols-12 text-xs font-mono text-[#78716c] dark:text-[#9ca3af] pb-2 border-b border-[#ece7dc] dark:border-[#22242b]">
              <span className="col-span-3">Source Token</span>
              <span className="col-span-2 text-right">Attention Weight (α)</span>
              <span className="col-span-1 text-center">×</span>
              <span className="col-span-3">Value Vector (v_j)</span>
              <span className="col-span-3 text-right">Weighted Contribution</span>
            </div>

            {MINI_ATTENTION_SEQUENCE.map((srcTok, jIdx) => {
              const weight = queryWeights[jIdx];
              const isMasked = isCausal && jIdx > selectedQueryIdx;
              const valVec = V[jIdx];
              const weightedContribution = valVec.map((v) => v * weight);

              return (
                <div
                  key={jIdx}
                  className={`grid grid-cols-12 items-center py-2 border-b border-[#f4efe6] dark:border-[#1e2026] text-xs font-mono ${
                    isMasked ? 'opacity-40 line-through' : ''
                  }`}
                >
                  {/* Source Token */}
                  <div className="col-span-3 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-[#f4efe6] dark:bg-[#1e2026] text-[10px]">
                      Pos {jIdx}
                    </span>
                    <span className="font-serif font-bold text-sm text-[#1c1917] dark:text-[#f3f4f6]">
                      "{srcTok}"
                    </span>
                  </div>

                  {/* Weight */}
                  <div className="col-span-2 text-right font-bold tabular-data text-[#c2410c] dark:text-[#d97706]">
                    {isMasked ? '0.000 (0%)' : `${weight.toFixed(3)} (${(weight * 100).toFixed(1)}%)`}
                  </div>

                  {/* Multiply */}
                  <div className="col-span-1 text-center text-[#78716c]">×</div>

                  {/* Value Vector */}
                  <div className="col-span-3 text-xs font-mono text-[#57534e] dark:text-[#9ca3af] truncate">
                    [{valVec.map((v) => v.toFixed(1)).join(', ')}]
                  </div>

                  {/* Weighted Contribution Vector */}
                  <div className="col-span-3 text-right font-bold tabular-data text-[#1c1917] dark:text-[#f3f4f6]">
                    [{weightedContribution.map((c) => (c >= 0 ? `+${c.toFixed(2)}` : c.toFixed(2))).join(', ')}]
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Final Synthesized Output Vector */}
        <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-lg border border-emerald-300 dark:border-emerald-700/60 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2 text-emerald-900 dark:text-emerald-200">
            <span className="font-bold">
              Final Context-Aware Vector o("{queryToken}"):
            </span>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
              Shape: (1 × 4) · Element-wise Sum
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 font-mono text-xs">
            {queryOutput.map((val, dimIdx) => (
              <div
                key={dimIdx}
                className="p-2.5 rounded bg-white dark:bg-[#141518] border border-emerald-200 dark:border-emerald-800 text-center font-bold text-emerald-950 dark:text-emerald-100 shadow-xs"
              >
                <div className="text-[9px] text-[#78716c] font-normal mb-0.5">Dim {dimIdx}</div>
                <div className="text-sm">{val >= 0 ? `+${val.toFixed(3)}` : val.toFixed(3)}</div>
              </div>
            ))}
          </div>

          <p className="text-xs text-emerald-900/80 dark:text-emerald-300/80 pt-1 leading-relaxed">
            Notice how the output for <strong className="font-serif">"{queryToken}"</strong> is no longer just its isolated input embedding—it has absorbed information from other tokens according to their attention weights!
          </p>
        </div>
      </div>
    </div>
  );
};
