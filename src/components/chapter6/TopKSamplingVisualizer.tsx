import React, { useState, useMemo } from 'react';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Filter, Check, X, Sliders, Info } from 'lucide-react';
import { applyTopK, stableSoftmax } from '../../services/generationService';

const RAW_CANDIDATES = [
  { token: 'mat', logit: 4.8 },
  { token: 'rug', logit: 4.0 },
  { token: 'couch', logit: 3.1 },
  { token: 'floor', logit: 2.2 },
  { token: 'bed', logit: 1.5 },
  { token: 'roof', logit: 0.4 },
  { token: 'moon', logit: -1.2 },
  { token: 'syntax', logit: -3.0 },
];

export const TopKSamplingVisualizer: React.FC = () => {
  const [k, setK] = useState<number>(3);

  // Compute base probabilities
  const baseCandidates = useMemo(() => {
    const logits = RAW_CANDIDATES.map((c) => c.logit);
    const probs = stableSoftmax(logits, 1.0);
    return RAW_CANDIDATES.map((c, i) => ({
      token: c.token,
      logit: c.logit,
      prob: probs[i],
    }));
  }, []);

  // Apply Top-K
  const topKResult = useMemo(() => applyTopK(baseCandidates, k), [baseCandidates, k]);

  return (
    <div className="bg-white dark:bg-[#131417] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#ece7dc] dark:border-[#22242b] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            <Filter className="w-4 h-4" />
            <span>Candidate Truncation</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            Top-K Sampling
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">Current k:</span>
          <span className="font-mono text-base font-bold px-2.5 py-1 rounded bg-[#faf8f5] dark:bg-[#1a1c22] border border-[#ece7dc] dark:border-[#282a32] text-[#c2410c] dark:text-[#d97706]">
            k = {k}
          </span>
        </div>
      </div>

      {/* Governing Formula */}
      <div className="my-6 p-4 bg-[#faf8f5] dark:bg-[#181a1f] rounded-lg border border-[#ece7dc] dark:border-[#26282f] text-center">
        <LatexRenderer
          math="V^{(k)} = \text{Top-}k(V), \quad P_{\text{renorm}}(w_i) = \frac{P(w_i)}{\sum_{w_j \in V^{(k)}} P(w_j)}"
          displayMode={true}
        />
        <p className="mt-2 text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          Truncates the vocabulary tail to exactly k tokens, setting the probability of all other tokens to zero.
        </p>
      </div>

      {/* Slider Control */}
      <div className="p-4 rounded-xl border border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#16171b] mb-6 space-y-3">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
            Select Candidate Pool Size (k):
          </span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 5, 8].map((val) => (
              <button
                key={val}
                onClick={() => setK(val)}
                className={`px-2 py-0.5 rounded text-xs font-mono border transition-colors cursor-pointer ${
                  k === val
                    ? 'border-[#c2410c] dark:border-[#d97706] bg-amber-500/10 text-[#c2410c] dark:text-[#d97706] font-bold'
                    : 'border-[#ece7dc] dark:border-[#282a32] bg-white dark:bg-[#1a1c22] text-[#57534e] dark:text-[#9ca3af]'
                }`}
              >
                k={val}
              </button>
            ))}
          </div>
        </div>

        <input
          type="range"
          min={1}
          max={8}
          step={1}
          value={k}
          onChange={(e) => setK(Number(e.target.value))}
          className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
        />

        <div className="text-[11px] font-mono text-[#78716c] dark:text-[#9ca3af] flex justify-between">
          <span>k=1 (Strict Greedy)</span>
          <span>k=8 (Full Vocabulary)</span>
        </div>
      </div>

      {/* Retained vs Excluded Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-[#78716c] dark:text-[#9ca3af] uppercase tracking-wider">
            Vocabulary Rank & Filtering:
          </span>
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
            {topKResult.retained.length} Retained · {topKResult.excluded.length} Pruned
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#ece7dc] dark:border-[#26282f]">
          <table className="w-full text-xs font-mono text-left">
            <thead className="bg-[#f4efe6] dark:bg-[#1a1c22] border-b border-[#ece7dc] dark:border-[#26282f] text-[#57534e] dark:text-[#9ca3af]">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Candidate Token</th>
                <th className="p-3 text-center">Raw Probability</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Renormalized Probability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ece7dc] dark:divide-[#26282f]">
              {baseCandidates.map((c, idx) => {
                const isRetained = idx < k;
                const renormItem = topKResult.renormalized.find((r) => r.token === c.token);

                return (
                  <tr
                    key={c.token}
                    className={`transition-colors ${
                      isRetained
                        ? 'bg-emerald-500/10 font-medium'
                        : 'bg-stone-100/50 dark:bg-stone-900/30 opacity-50'
                    }`}
                  >
                    <td className="p-3 font-mono font-bold text-[#78716c] dark:text-[#9ca3af]">
                      #{idx + 1}
                    </td>
                    <td className="p-3 font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
                      "{c.token}"
                    </td>
                    <td className="p-3 text-center text-[#57534e] dark:text-[#9ca3af]">
                      {(c.prob * 100).toFixed(2)}%
                    </td>
                    <td className="p-3 text-center">
                      {isRetained ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
                          <Check className="w-3.5 h-3.5" />
                          <span>Retained</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-stone-500 text-[11px]">
                          <X className="w-3.5 h-3.5" />
                          <span>Excluded</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {isRetained && renormItem?.filteredProb ? (
                        <span className="font-bold text-emerald-700 dark:text-emerald-300">
                          {(renormItem.filteredProb * 100).toFixed(2)}%
                        </span>
                      ) : (
                        <span className="text-stone-400">0.00%</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Structural Weakness of Top-K Callout */}
      <div className="mt-6 p-4 rounded-xl border border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#181a1f] flex items-start gap-3">
        <Info className="w-5 h-5 text-[#c2410c] dark:text-[#d97706] shrink-0 mt-0.5" />
        <div className="text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6] block mb-0.5">
            The Fixed-Boundary Flaw of Top-K:
          </span>
          Because <LatexRenderer math="k" /> is a fixed constant, it cannot adapt to changing context certainty. If a sentence has an obvious next word ("Paris is the capital of [France 99%]"), setting <LatexRenderer math="k=10" /> forces 9 completely irrational words into the candidate pool. Conversely, if 20 diverse synonyms are equally valid, <LatexRenderer math="k=10" /> prematurely discards 10 high-quality tokens. This limitation inspired <strong>Top-P (Nucleus) Sampling</strong>.
        </div>
      </div>
    </div>
  );
};
