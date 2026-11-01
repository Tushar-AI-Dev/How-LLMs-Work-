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
import { Eye, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

export const AttentionHeatmapVisualizer: React.FC = () => {
  const [isCausal, setIsCausal] = useState<boolean>(true);
  const [selectedRow, setSelectedRow] = useState<number>(2); // default row 2 ("sat")
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  // Compute Q, K, V
  const Q = matmul(MINI_X, MINI_W_Q);
  const K = matmul(MINI_X, MINI_W_K);
  const V = matmul(MINI_X, MINI_W_V);

  // Run real scaled dot-product attention
  const computation = scaledDotProductAttention(Q, K, V, isCausal);
  const { rawScores, scaledScores, maskedScores, attentionWeights } = computation;

  const activeRowIdx = hoveredCell ? hoveredCell.row : selectedRow;
  const activeColIdx = hoveredCell ? hoveredCell.col : 0;
  const activeToken = MINI_ATTENTION_SEQUENCE[activeRowIdx];
  const activeRowWeights = attentionWeights[activeRowIdx];

  // Helper color function: 0 is light/transparent, 1 is rich amber
  const getCellBg = (weight: number, isMasked: boolean) => {
    if (isMasked) {
      return 'rgba(156, 163, 175, 0.15)'; // Muted gray mask
    }
    const alpha = Math.min(1, Math.max(0.08, weight * 1.3));
    return `rgba(217, 119, 6, ${alpha})`;
  };

  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ece7dc] dark:border-[#22242b] mb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            Interactive Feature · Section 08
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
            The Attention Matrix & Causal Masking
          </h3>
        </div>

        {/* Causal Mode Toggle */}
        <div className="flex items-center gap-2 bg-[#faf8f5] dark:bg-[#1a1c22] p-1 rounded-lg border border-[#ded7ca] dark:border-[#282a32] self-start sm:self-auto">
          <button
            onClick={() => setIsCausal(true)}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
              isCausal
                ? 'bg-[#c2410c] dark:bg-[#d97706] text-white shadow-xs'
                : 'text-[#57534e] dark:text-[#9ca3af] hover:text-[#1c1917]'
            }`}
          >
            Causal Mask (LLM Decoder)
          </button>
          <button
            onClick={() => setIsCausal(false)}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
              !isCausal
                ? 'bg-[#1c1917] dark:bg-[#f3f4f6] text-white dark:text-[#111215] shadow-xs'
                : 'text-[#57534e] dark:text-[#9ca3af] hover:text-[#1c1917]'
            }`}
          >
            Non-Causal (BERT Encoder)
          </button>
        </div>
      </div>

      <p className="text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed mb-6">
        The attention matrix represents pairwise communication across all tokens. In autoregressive language models, <strong className="text-[#c2410c] dark:text-[#d97706]">causal masking</strong> sets future token scores to $-\infty$ prior to softmax so tokens cannot peek ahead into the future.
      </p>

      {/* Main Heatmap Stage */}
      <div className="p-6 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-xl space-y-6">
        
        {/* Heatmap Grid */}
        <div className="border border-[#ded7ca] dark:border-[#282a32] rounded-lg overflow-x-auto bg-white dark:bg-[#141518] p-4">
          <div className="min-w-[500px]">
            {/* Column Headers (Keys) */}
            <div className="flex items-center gap-2 mb-2 text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
              <span className="w-24 shrink-0 text-right pr-2">Query \ Key</span>
              {MINI_ATTENTION_SEQUENCE.map((tok, cIdx) => (
                <span key={cIdx} className="flex-1 text-center font-bold text-[#1c1917] dark:text-[#f3f4f6]">
                  k: "{tok}"
                </span>
              ))}
            </div>

            {/* Rows (Queries) */}
            {attentionWeights.map((row, rIdx) => {
              const isSelectedRow = selectedRow === rIdx;
              const rowSum = row.reduce((acc, w) => acc + w, 0);

              return (
                <div
                  key={rIdx}
                  onClick={() => setSelectedRow(rIdx)}
                  className={`flex items-center gap-2 py-1.5 px-1 rounded transition-colors cursor-pointer ${
                    isSelectedRow
                      ? 'bg-amber-100/60 dark:bg-amber-950/40 ring-1 ring-[#c2410c] dark:ring-[#d97706]'
                      : 'hover:bg-[#faf8f5] dark:hover:bg-[#1f2128]'
                  }`}
                >
                  {/* Row Header (Query) */}
                  <span className="w-24 shrink-0 text-right pr-2 font-mono text-xs font-bold text-[#c2410c] dark:text-[#d97706] truncate">
                    q: "{MINI_ATTENTION_SEQUENCE[rIdx]}"
                  </span>

                  {/* Cells */}
                  {row.map((weight, cIdx) => {
                    const isMasked = isCausal && cIdx > rIdx;
                    const isCellHovered =
                      hoveredCell?.row === rIdx && hoveredCell?.col === cIdx;

                    return (
                      <div
                        key={cIdx}
                        onMouseEnter={() => setHoveredCell({ row: rIdx, col: cIdx })}
                        onMouseLeave={() => setHoveredCell(null)}
                        style={{
                          backgroundColor: getCellBg(weight, isMasked),
                          color: isMasked
                            ? '#9ca3af'
                            : weight > 0.45
                            ? '#ffffff'
                            : '#1c1917',
                        }}
                        className={`
                          flex-1 h-10 rounded text-xs font-mono font-bold flex flex-col items-center justify-center transition-transform select-none
                          ${
                            isCellHovered
                              ? 'ring-2 ring-[#c2410c] dark:ring-[#d97706] scale-105 z-10 shadow-xs'
                              : ''
                          }
                          ${isMasked ? 'opacity-40 line-through' : ''}
                        `}
                      >
                        <span>{isMasked ? '0.000' : weight.toFixed(3)}</span>
                        <span className="text-[9px] opacity-80">
                          {isMasked ? 'MASKED' : `${(weight * 100).toFixed(0)}%`}
                        </span>
                      </div>
                    );
                  })}

                  {/* Row Sum */}
                  <span className="w-16 shrink-0 text-right text-[11px] font-mono font-bold text-[#78716c]">
                    ∑={rowSum.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row Attention Distribution Bar Chart */}
        <div className="p-4 bg-white dark:bg-[#141518] rounded-lg border border-[#ded7ca] dark:border-[#282a32] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2">
            <div>
              <span className="text-[#78716c]">Attention Distribution for Query: </span>
              <span className="font-bold text-[#c2410c] dark:text-[#d97706] text-sm">
                "{activeToken}" (Row {activeRowIdx})
              </span>
            </div>
            <div className="text-[11px] text-[#78716c]">
              Row represents valid probability distribution (sums to 1.0)
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1">
            {activeRowWeights.map((w, cIdx) => {
              const isMasked = isCausal && cIdx > activeRowIdx;
              return (
                <div
                  key={cIdx}
                  className="p-2 rounded bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#ded7ca] dark:border-[#282a32] text-center font-mono"
                >
                  <div className="text-[10px] text-[#78716c] truncate">
                    k: "{MINI_ATTENTION_SEQUENCE[cIdx]}"
                  </div>
                  <div
                    className={`text-sm font-bold my-1 ${
                      isMasked
                        ? 'text-gray-400 line-through'
                        : 'text-[#c2410c] dark:text-[#d97706]'
                    }`}
                  >
                    {isMasked ? '0.000' : (w * 100).toFixed(1) + '%'}
                  </div>
                  <div className="h-2 bg-[#e5e0d3] dark:bg-[#1e2026] rounded overflow-hidden">
                    <div
                      className={`h-full ${
                        isMasked
                          ? 'bg-gray-300'
                          : 'bg-[#c2410c] dark:bg-[#d97706]'
                      }`}
                      style={{ width: `${isMasked ? 0 : w * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Causal Explanation Callout */}
        <div className="p-4 bg-[#f8f5ee] dark:bg-[#191b21] rounded-lg border border-[#ded7ca] dark:border-[#282a32] text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed space-y-2">
          <div className="flex items-center gap-2 text-[#c2410c] dark:text-[#d97706] font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>Why Autoregressive LLMs Require Lower-Triangular Causal Masks</span>
          </div>
          <p>
            When generating text token-by-token (e.g., predicting word 4 given words 1–3), the model cannot cheat by attending to words that haven't been generated yet.
          </p>
          <p>
            Setting <LatexRenderer math="M_{i,j} = -\infty" /> for <LatexRenderer math="j > i" /> guarantees that <LatexRenderer math="\exp(-\infty) = 0" />, enforcing that <strong>future tokens contribute exactly 0.000 probability</strong> to the attention sum. This creates the classic lower-triangular attention pattern seen in all modern GPT-class decoders.
          </p>
        </div>
      </div>
    </div>
  );
};
