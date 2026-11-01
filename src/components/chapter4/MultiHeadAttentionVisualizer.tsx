import React, { useState } from 'react';
import {
  MULTI_HEAD_SAMPLES,
  MINI_ATTENTION_SEQUENCE,
  AttentionHeadData,
} from '../../services/attentionService';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Network, Layers, GitMerge, HelpCircle, Check } from 'lucide-react';

export const MultiHeadAttentionVisualizer: React.FC = () => {
  const [activeHeadId, setActiveHeadId] = useState<number>(1);

  const activeHead =
    MULTI_HEAD_SAMPLES.find((h) => h.id === activeHeadId) || MULTI_HEAD_SAMPLES[0];

  const getCellBg = (weight: number) => {
    const alpha = Math.min(1, Math.max(0.08, weight * 1.3));
    if (activeHeadId === 1) return `rgba(194, 65, 12, ${alpha})`; // Terracotta
    if (activeHeadId === 2) return `rgba(2, 132, 199, ${alpha})`; // Sky blue
    if (activeHeadId === 3) return `rgba(16, 185, 129, ${alpha})`; // Emerald
    return `rgba(168, 85, 247, ${alpha})`; // Purple
  };

  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-8 shadow-xs">
      <div className="pb-4 border-b border-[#ece7dc] dark:border-[#22242b] mb-6">
        <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
          Section 10 · Parallel Representation Subspaces
        </span>
        <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
          Multi-Head Attention: Attending to Multiple Relationships Simultaneously
        </h3>
        <p className="mt-2 text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          A single attention head can only construct one set of weights per token. But language is multi-faceted: a word simultaneously has grammatical roles, semantic references, and local neighborhood relationships. <strong>Multi-Head Attention</strong> runs multiple independent attention calculations in parallel.
        </p>
      </div>

      {/* Head Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {MULTI_HEAD_SAMPLES.map((head) => {
          const isSelected = activeHeadId === head.id;
          return (
            <button
              key={head.id}
              onClick={() => setActiveHeadId(head.id)}
              className={`p-3 rounded-lg text-left text-xs font-mono border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#1c1917] dark:bg-[#f3f4f6] text-white dark:text-[#111215] border-transparent shadow-xs ring-2 ring-[#c2410c] dark:ring-[#d97706]'
                  : 'bg-[#faf8f5] dark:bg-[#1a1c22] text-[#44403c] dark:text-[#d1d5db] border-[#ded7ca] dark:border-[#282a32] hover:border-[#c2410c]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold">Head {head.id}</span>
                <span className="text-[10px] opacity-75">Subspace</span>
              </div>
              <div className="font-sans text-[11px] truncate">{head.linguisticRole}</div>
            </button>
          );
        })}
      </div>

      {/* Active Head Detailed Stage */}
      <div className="p-6 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-[#ded7ca] dark:border-[#282a32]">
          <div>
            <h4 className="font-serif text-lg font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              {activeHead.name}
            </h4>
            <p className="text-xs text-[#57534e] dark:text-[#9ca3af] mt-1">
              {activeHead.description}
            </p>
          </div>

          <div className="text-xs font-mono px-2.5 py-1 rounded bg-white dark:bg-[#16171c] border border-[#ded7ca] dark:border-[#282a32] text-[#1c1917] dark:text-[#f3f4f6] self-start">
            head_dim = d_model / h = 4 / 4 = 1
          </div>
        </div>

        {/* Head Attention Matrix */}
        <div className="border border-[#ded7ca] dark:border-[#282a32] rounded-lg overflow-x-auto bg-white dark:bg-[#141518] p-4">
          <div className="min-w-[480px]">
            {/* Column Headers */}
            <div className="flex items-center gap-2 mb-2 text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
              <span className="w-20 shrink-0 text-right pr-2">q \ k</span>
              {MINI_ATTENTION_SEQUENCE.map((tok, cIdx) => (
                <span key={cIdx} className="flex-1 text-center font-bold text-[#1c1917] dark:text-[#f3f4f6]">
                  "{tok}"
                </span>
              ))}
            </div>

            {/* Rows */}
            {activeHead.matrix.map((row, rIdx) => (
              <div key={rIdx} className="flex items-center gap-2 py-1 px-1">
                <span className="w-20 shrink-0 text-right pr-2 font-mono text-xs font-bold text-[#c2410c] dark:text-[#d97706] truncate">
                  "{MINI_ATTENTION_SEQUENCE[rIdx]}"
                </span>

                {row.map((weight, cIdx) => (
                  <div
                    key={cIdx}
                    style={{
                      backgroundColor: getCellBg(weight),
                      color: weight > 0.45 ? '#ffffff' : '#1c1917',
                    }}
                    className="flex-1 h-8 rounded text-xs font-mono font-bold flex items-center justify-center select-none"
                  >
                    {(weight * 100).toFixed(0)}%
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Concatenation and Output Projection (W_O) */}
        <div className="p-4 bg-white dark:bg-[#141518] rounded-lg border border-[#ded7ca] dark:border-[#282a32] space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1c1917] dark:text-[#f3f4f6]">
            <GitMerge className="w-4 h-4 text-[#c2410c] dark:text-[#d97706]" />
            <span>Concatenation & Output Projection (W_O)</span>
          </div>

          <div className="p-3 bg-[#faf8f5] dark:bg-[#0c0d10] rounded text-xs font-mono text-center text-[#1c1917] dark:text-[#f3f4f6] overflow-x-auto whitespace-nowrap">
            <LatexRenderer
              math="\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \text{head}_2, \text{head}_3, \text{head}_4) W_O"
              displayMode={true}
            />
          </div>

          <p className="text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            After each of the 4 heads computes its own output vector, the results are concatenated horizontally: <LatexRenderer math="[\mathbf{head}_1; \mathbf{head}_2; \mathbf{head}_3; \mathbf{head}_4]" />. Finally, multiplying by the output projection matrix <code className="font-mono">W_O</code> mixes all four representation subspaces back into the unified model dimension <code className="font-mono">d_model</code>.
          </p>

          <div className="text-[11px] font-mono text-[#78716c] dark:text-[#9ca3af] pt-1">
            *Note: While linguistic labels (syntax, co-reference, locality) are helpful mental models, in actual pretrained transformers, attention heads learn distributed representations that frequently blend multiple features simultaneously.
          </div>
        </div>
      </div>
    </div>
  );
};
