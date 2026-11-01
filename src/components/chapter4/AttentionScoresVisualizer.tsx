import React, { useState } from 'react';
import {
  MINI_ATTENTION_SEQUENCE,
  MINI_X,
  MINI_W_Q,
  MINI_W_K,
  matmul,
  transpose,
} from '../../services/attentionService';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Scale, HelpCircle, ArrowRight, AlertTriangle } from 'lucide-react';

export const AttentionScoresVisualizer: React.FC = () => {
  const [selectedQueryIdx, setSelectedQueryIdx] = useState<number>(1); // default "cat"

  // Compute Q and K
  const Q = matmul(MINI_X, MINI_W_Q);
  const K = matmul(MINI_X, MINI_W_K);
  const KT = transpose(K);
  const rawScores = matmul(Q, KT);

  const d_k = 4;
  const sqrtDk = Math.sqrt(d_k); // 2.0

  const queryToken = MINI_ATTENTION_SEQUENCE[selectedQueryIdx];
  const queryRow = rawScores[selectedQueryIdx];

  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-8 shadow-xs">
      <div className="pb-4 border-b border-[#ece7dc] dark:border-[#22242b] mb-6">
        <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
          Section 06 · The Affinity Metric
        </span>
        <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
          Calculating Attention Scores: Why Scaling by √dₖ Is Vital
        </h3>
        <p className="mt-2 text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          To measure how strongly token <strong className="text-[#1c1917] dark:text-[#f3f4f6]">i</strong> should attend to token <strong className="text-[#1c1917] dark:text-[#f3f4f6]">j</strong>, the model computes the dot product of their respective Query and Key vectors: <code className="font-mono">q_i · k_j</code>.
        </p>
      </div>

      {/* Mathematical Formula Card */}
      <div className="p-4 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-lg mb-6 text-center space-y-2">
        <span className="text-xs font-mono uppercase text-[#78716c] block">
          Scaled Dot-Product Formula
        </span>
        <div className="text-sm sm:text-base text-[#1c1917] dark:text-[#f3f4f6]">
          <LatexRenderer math="S_{i, j} = \frac{\mathbf{q}_i \cdot \mathbf{k}_j}{\sqrt{d_k}}" displayMode={true} />
        </div>
      </div>

      {/* Interactive Query Token Selector */}
      <div className="p-6 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-xl space-y-6">
        <div>
          <label className="block text-xs font-mono uppercase text-[#78716c] dark:text-[#9ca3af] mb-1.5 font-semibold">
            Select Active Query Token:
          </label>
          <div className="flex flex-wrap gap-2">
            {MINI_ATTENTION_SEQUENCE.map((tok, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedQueryIdx(idx)}
                className={`px-3.5 py-1.5 text-xs font-mono rounded cursor-pointer transition-all border ${
                  selectedQueryIdx === idx
                    ? 'bg-[#c2410c] dark:bg-[#d97706] text-white border-transparent font-bold shadow-xs'
                    : 'bg-white dark:bg-[#16171c] text-[#44403c] dark:text-[#d1d5db] border-[#ded7ca] dark:border-[#282a32] hover:border-[#c2410c]'
                }`}
              >
                q: "{tok}" (Pos {idx})
              </button>
            ))}
          </div>
        </div>

        {/* Scores Table */}
        <div className="border border-[#ded7ca] dark:border-[#282a32] rounded-lg overflow-x-auto bg-white dark:bg-[#141518] p-4">
          <div className="min-w-[480px] space-y-3">
            <div className="grid grid-cols-5 text-xs font-mono text-[#78716c] dark:text-[#9ca3af] pb-2 border-b border-[#ece7dc] dark:border-[#22242b]">
              <span>Key Token (k_j)</span>
              <span className="text-right">Raw Dot Product (q · k)</span>
              <span className="text-center">Scale Factor (√d_k)</span>
              <span className="text-right font-bold text-[#c2410c] dark:text-[#d97706]">Scaled Score (S_ij)</span>
              <span className="text-center">Gradient Stability</span>
            </div>

            {MINI_ATTENTION_SEQUENCE.map((keyTok, kIdx) => {
              const raw = queryRow[kIdx];
              const scaled = raw / sqrtDk;

              return (
                <div
                  key={kIdx}
                  className="grid grid-cols-5 items-center text-xs font-mono py-2 border-b border-[#f4efe6] dark:border-[#1e2026] last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#f4efe6] dark:bg-[#1e2026] text-[10px]">
                      Pos {kIdx}
                    </span>
                    <span className="font-serif font-bold text-sm text-[#1c1917] dark:text-[#f3f4f6]">
                      "{keyTok}"
                    </span>
                  </div>

                  <div className="text-right font-medium tabular-data text-[#57534e] dark:text-[#9ca3af]">
                    {raw >= 0 ? `+${raw.toFixed(3)}` : raw.toFixed(3)}
                  </div>

                  <div className="text-center text-[#78716c]">
                    ÷ {sqrtDk.toFixed(1)}
                  </div>

                  <div className="text-right font-bold tabular-data text-[#c2410c] dark:text-[#d97706] text-sm">
                    {scaled >= 0 ? `+${scaled.toFixed(3)}` : scaled.toFixed(3)}
                  </div>

                  <div className="text-center">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold">
                      Normalized σ² ≈ 1
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* The Mathematical Rationale for √d_k */}
        <div className="p-4 bg-[#f8f5ee] dark:bg-[#191b21] rounded-lg border border-[#ded7ca] dark:border-[#282a32] text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed space-y-2">
          <div className="flex items-center gap-2 text-[#c2410c] dark:text-[#d97706] font-bold">
            <Scale className="w-4 h-4" />
            <span>The Vanishing Gradient Trap in Softmax</span>
          </div>
          <p>
            Assume the components of <code className="font-mono">q</code> and <code className="font-mono">k</code> are independent random variables with zero mean and variance 1. Their dot product <code className="font-mono">q · k = ∑ q_i k_i</code> has a mean of 0, but its variance scales linearly with the dimension: <strong>Var(q · k) = d_k</strong>.
          </p>
          <p>
            In modern LLMs with <code className="font-mono">d_k = 128</code>, unscaled dot products would frequently reach values like <code className="font-mono">+35</code> or <code className="font-mono">-40</code>. Passing such extreme magnitudes into Softmax pushes the probabilities into saturation regions where the derivative is practically zero (<LatexRenderer math="\frac{\partial \text{softmax}}{\partial z} \approx 0" />).
          </p>
          <p>
            By dividing by <strong className="text-[#1c1917] dark:text-[#f3f4f6]">√d_k</strong>, the model normalizes the variance back to <strong>1.0</strong>, guaranteeing healthy, non-vanishing gradient flow throughout backpropagation!
          </p>
        </div>
      </div>
    </div>
  );
};
