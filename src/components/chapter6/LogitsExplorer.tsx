import React, { useState } from 'react';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Sliders, BarChart2, Info, RotateCcw } from 'lucide-react';

interface CandidateLogit {
  token: string;
  logit: number;
}

const DEFAULT_LOGITS: CandidateLogit[] = [
  { token: 'mat', logit: 4.8 },
  { token: 'rug', logit: 3.9 },
  { token: 'couch', logit: 2.7 },
  { token: 'floor', logit: 1.4 },
  { token: 'roof', logit: -0.8 },
  { token: 'syntax', logit: -3.2 },
];

export const LogitsExplorer: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateLogit[]>(DEFAULT_LOGITS);

  const handleLogitChange = (index: number, newLogit: number) => {
    const updated = [...candidates];
    updated[index] = { ...updated[index], logit: newLogit };
    setCandidates(updated);
  };

  const handleReset = () => {
    setCandidates(DEFAULT_LOGITS);
  };

  const maxLogit = Math.max(...candidates.map((c) => c.logit));
  const minLogit = Math.min(...candidates.map((c) => c.logit));

  return (
    <div className="bg-white dark:bg-[#131417] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#ece7dc] dark:border-[#22242b] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            <BarChart2 className="w-4 h-4" />
            <span>Interactive Unnormalized Scores</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            What Are Logits?
          </h4>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#ece7dc] dark:border-[#282a32] bg-[#faf8f5] dark:bg-[#1a1c22] text-xs font-mono text-[#78716c] dark:text-[#9ca3af] hover:text-[#1c1917] dark:hover:text-[#f3f4f6] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Logits</span>
        </button>
      </div>

      {/* Explanation Banner */}
      <div className="my-6 p-4 rounded-xl border border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#181a1f] space-y-2 text-xs sm:text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
        <p>
          Before a language model outputs probabilities, its final layer calculates <strong>logits</strong>: raw, unconstrained real numbers (<LatexRenderer math="z_i \in (-\infty, +\infty)" />). There is exactly one logit for every entry in the vocabulary.
        </p>
        <p className="font-mono text-xs text-[#1c1917] dark:text-[#f3f4f6]">
          • Positive logits (<LatexRenderer math="z_i > 0" />) indicate favorable token preference.
          <br />
          • Zero (<LatexRenderer math="z_i = 0" />) represents neutral baseline odds (<LatexRenderer math="\exp(0) = 1" />).
          <br />
          • Negative logits (<LatexRenderer math="z_i < 0" />) suppress improbable or nonsensical continuations.
        </p>
      </div>

      {/* Interactive Sliders & Chart */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          <span>Prompt Context: "The cat slept on the..."</span>
          <span>Adjust Logits Live: -6.0 to +8.0</span>
        </div>

        <div className="space-y-3">
          {candidates.map((c, idx) => {
            const isTop = c.logit === maxLogit;
            const isNegative = c.logit < 0;

            return (
              <div
                key={c.token}
                className="p-3 bg-[#faf8f5] dark:bg-[#16171b] rounded-lg border border-[#ece7dc] dark:border-[#26282f] flex flex-col sm:flex-row sm:items-center gap-3"
              >
                {/* Token Label */}
                <div className="w-24 shrink-0 flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                    isTop
                      ? 'bg-amber-500/20 text-[#c2410c] dark:text-[#d97706] border border-amber-500/30'
                      : 'bg-white dark:bg-[#1f2127] border border-[#ece7dc] dark:border-[#282a32] text-[#1c1917] dark:text-[#f3f4f6]'
                  }`}>
                    "{c.token}"
                  </span>
                </div>

                {/* Slider */}
                <div className="grow flex items-center gap-3">
                  <input
                    type="range"
                    min={-6.0}
                    max={8.0}
                    step={0.1}
                    value={c.logit}
                    onChange={(e) => handleLogitChange(idx, Number(e.target.value))}
                    className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
                  />
                  <span className="w-16 text-right font-mono text-xs font-bold text-[#1c1917] dark:text-[#f3f4f6]">
                    {c.logit > 0 ? `+${c.logit.toFixed(1)}` : c.logit.toFixed(1)}
                  </span>
                </div>

                {/* Visual Bar representation */}
                <div className="w-full sm:w-48 h-5 bg-[#e6e0d4] dark:bg-[#26282f] rounded-md overflow-hidden relative flex items-center">
                  {/* Center zero line */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#a8a29e] dark:bg-[#52525b] z-10" />

                  {/* Positive or negative bar */}
                  {isNegative ? (
                    <div
                      className="h-full bg-stone-400 dark:bg-stone-600 ml-auto transition-all duration-150"
                      style={{
                        width: `${Math.min(50, (Math.abs(c.logit) / 8) * 50)}%`,
                        marginRight: '50%',
                      }}
                    />
                  ) : (
                    <div
                      className={`h-full transition-all duration-150 ${
                        isTop ? 'bg-amber-500' : 'bg-sky-500'
                      }`}
                      style={{
                        width: `${Math.min(50, (c.logit / 8) * 50)}%`,
                        marginLeft: '50%',
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rationale Notice */}
      <div className="mt-6 p-4 rounded-xl border border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#181a1f] flex items-start gap-3">
        <Info className="w-5 h-5 text-[#c2410c] dark:text-[#d97706] shrink-0 mt-0.5" />
        <div className="text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6] block mb-0.5">
            Key Rule of Logits:
          </span>
          Logits are unconstrained dot products between the hidden state and each token's unembedding vector: <LatexRenderer math="z_i = \mathbf{w}_i^\top \mathbf{h}" />. A token whose unembedding vector aligns closely in direction with <LatexRenderer math="\mathbf{h}" /> achieves a large positive logit, while antithetical tokens produce negative logits.
        </div>
      </div>
    </div>
  );
};
