import React, { useState, useMemo } from 'react';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Target, Sliders, Check, X, Sparkles, Layers } from 'lucide-react';
import { applyTopP, stableSoftmax } from '../../services/generationService';

const CONTEXT_PEAKED = [
  { token: 'France', logit: 6.5 },
  { token: 'Europe', logit: 1.8 },
  { token: 'the', logit: 0.5 },
  { token: 'fashion', logit: -0.2 },
  { token: 'coffee', logit: -1.5 },
  { token: 'quantum', logit: -3.5 },
];

const CONTEXT_FLAT = [
  { token: 'tired', logit: 3.5 },
  { token: 'sleeping', logit: 3.3 },
  { token: 'hungry', logit: 3.1 },
  { token: 'happy', logit: 2.8 },
  { token: 'curious', logit: 2.4 },
  { token: 'playful', logit: 2.0 },
];

export const TopPSamplingVisualizer: React.FC = () => {
  const [contextMode, setContextMode] = useState<'peaked' | 'flat'>('flat');
  const [p, setP] = useState<number>(0.85);

  const rawCandidates = contextMode === 'peaked' ? CONTEXT_PEAKED : CONTEXT_FLAT;

  const baseCandidates = useMemo(() => {
    const logits = rawCandidates.map((c) => c.logit);
    const probs = stableSoftmax(logits, 1.0);
    return rawCandidates.map((c, i) => ({
      token: c.token,
      logit: c.logit,
      prob: probs[i],
    })).sort((a, b) => b.prob - a.prob);
  }, [rawCandidates]);

  const topPResult = useMemo(() => applyTopP(baseCandidates, p), [baseCandidates, p]);

  return (
    <div className="bg-white dark:bg-[#131417] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#ece7dc] dark:border-[#22242b] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            <Target className="w-4 h-4" />
            <span>Dynamic Nucleus Filtering</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            Top-P (Nucleus) Sampling
          </h4>
        </div>

        {/* Distribution Context Toggle */}
        <div className="flex rounded-lg p-1 bg-[#faf8f5] dark:bg-[#1a1c22] border border-[#ece7dc] dark:border-[#282a32]">
          <button
            onClick={() => setContextMode('flat')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
              contextMode === 'flat'
                ? 'bg-[#1c1917] text-white dark:bg-white dark:text-[#1c1917] font-semibold shadow-xs'
                : 'text-[#78716c] dark:text-[#9ca3af]'
            }`}
          >
            Uncertain Context
          </button>
          <button
            onClick={() => setContextMode('peaked')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
              contextMode === 'peaked'
                ? 'bg-[#1c1917] text-white dark:bg-white dark:text-[#1c1917] font-semibold shadow-xs'
                : 'text-[#78716c] dark:text-[#9ca3af]'
            }`}
          >
            Peaked Context
          </button>
        </div>
      </div>

      {/* Governing Formula */}
      <div className="my-6 p-4 bg-[#faf8f5] dark:bg-[#181a1f] rounded-lg border border-[#ece7dc] dark:border-[#26282f] text-center">
        <LatexRenderer
          math="\sum_{w_i \in V^{(p)}} P(w_i) \ge p, \quad P_{\text{renorm}}(w_i) = \frac{P(w_i)}{\sum_{w_j \in V^{(p)}} P(w_j)}"
          displayMode={true}
        />
        <p className="mt-2 text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          Selects the minimal set of top tokens whose cumulative probability mass reaches or exceeds threshold p.
        </p>
      </div>

      {/* Threshold Slider */}
      <div className="p-4 rounded-xl border border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#16171b] mb-6 space-y-3">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
            Cumulative Threshold (p):
          </span>
          <span className="font-bold text-[#c2410c] dark:text-[#d97706] text-sm">
            p = {p.toFixed(2)} ({(p * 100).toFixed(0)}% Probability Mass)
          </span>
        </div>

        <input
          type="range"
          min={0.1}
          max={1.0}
          step={0.05}
          value={p}
          onChange={(e) => setP(Number(e.target.value))}
          className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
        />

        <div className="flex items-center justify-between text-[11px] font-mono text-[#78716c] dark:text-[#9ca3af]">
          <span>Nucleus Size: <strong className="text-[#1c1917] dark:text-[#f3f4f6]">{topPResult.retained.length} tokens</strong></span>
          <span>{contextMode === 'peaked' ? 'Prompt: "Paris is the capital of..."' : 'Prompt: "The cat was feeling..."'}</span>
        </div>
      </div>

      {/* Cumulative Probability Step-by-Step Table */}
      <div className="space-y-4">
        <div className="overflow-x-auto rounded-xl border border-[#ece7dc] dark:border-[#26282f]">
          <table className="w-full text-xs font-mono text-left">
            <thead className="bg-[#f4efe6] dark:bg-[#1a1c22] border-b border-[#ece7dc] dark:border-[#26282f] text-[#57534e] dark:text-[#9ca3af]">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Token</th>
                <th className="p-3 text-center">Probability</th>
                <th className="p-3 text-center">Cumulative Mass</th>
                <th className="p-3 text-center">Nucleus Status</th>
                <th className="p-3 text-right">Renormalized</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ece7dc] dark:divide-[#26282f]">
              {baseCandidates.map((c, idx) => {
                const isRetained = idx <= topPResult.cutoffIndex;
                const renormItem = topPResult.renormalized.find((r) => r.token === c.token);
                const runningSum = baseCandidates.slice(0, idx + 1).reduce((acc, val) => acc + val.prob, 0);

                return (
                  <tr
                    key={c.token}
                    className={`transition-colors ${
                      isRetained
                        ? 'bg-emerald-500/10 font-medium'
                        : 'bg-stone-100/50 dark:bg-stone-900/30 opacity-50'
                    }`}
                  >
                    <td className="p-3 font-bold text-[#78716c] dark:text-[#9ca3af]">
                      #{idx + 1}
                    </td>
                    <td className="p-3 font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
                      "{c.token}"
                    </td>
                    <td className="p-3 text-center text-[#57534e] dark:text-[#9ca3af]">
                      {(c.prob * 100).toFixed(2)}%
                    </td>
                    <td className="p-3 text-center font-bold text-amber-700 dark:text-amber-400">
                      {(runningSum * 100).toFixed(1)}%
                    </td>
                    <td className="p-3 text-center">
                      {isRetained ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
                          <Check className="w-3.5 h-3.5" />
                          <span>Inside Nucleus</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-stone-500 text-[11px]">
                          <X className="w-3.5 h-3.5" />
                          <span>Pruned Tail</span>
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

      {/* Dynamic Adaptation Demonstration */}
      <div className="mt-6 p-4 rounded-xl border border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#181a1f] flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#c2410c] dark:text-[#d97706] shrink-0 mt-0.5" />
        <div className="text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6] block mb-0.5">
            The Dynamic Adaptability of Nucleus Sampling:
          </span>
          Notice what happens when you toggle between <em>Peaked Context</em> and <em>Uncertain Context</em>: with the exact same <LatexRenderer math="p = 0.85" /> threshold, the nucleus automatically contracts to <strong>1 token</strong> when confidence is high, and automatically expands to <strong>4+ tokens</strong> when confidence is distributed. This dynamic flexibility is why Top-P is the preferred sampling strategy across modern LLM APIs.
        </div>
      </div>
    </div>
  );
};
