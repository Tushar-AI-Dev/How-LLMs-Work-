import React, { useState } from 'react';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Target, ArrowRight, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getToyModelLogits, stableSoftmax } from '../../services/generationService';

export const GreedyDecodingVisualizer: React.FC = () => {
  const [tokens, setTokens] = useState<string[]>(['The', 'cat', 'slept', 'on', 'the']);

  const currentLogits = getToyModelLogits(tokens);
  const logitsArr = currentLogits.map((c) => c.logit);
  const probsArr = stableSoftmax(logitsArr, 1.0);

  const candidatesWithProbs = currentLogits.map((c, i) => ({
    token: c.token,
    logit: c.logit,
    prob: probsArr[i],
  })).sort((a, b) => b.prob - a.prob);

  const greedyChoice = candidatesWithProbs[0];

  const handleAppendGreedy = () => {
    if (tokens.length >= 12 || greedyChoice.token === '<EOS>') return;
    setTokens([...tokens, greedyChoice.token]);
  };

  const handleReset = () => {
    setTokens(['The', 'cat', 'slept', 'on', 'the']);
  };

  return (
    <div className="bg-white dark:bg-[#131417] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#ece7dc] dark:border-[#22242b] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            <Target className="w-4 h-4" />
            <span>Deterministic Decoding</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            Greedy Decoding (Argmax Selection)
          </h4>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#ece7dc] dark:border-[#282a32] bg-[#faf8f5] dark:bg-[#1a1c22] text-xs font-mono text-[#78716c] dark:text-[#9ca3af] hover:text-[#1c1917] dark:hover:text-[#f3f4f6] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Prompt</span>
        </button>
      </div>

      {/* Mathematical Rule */}
      <div className="my-6 p-4 bg-[#faf8f5] dark:bg-[#181a1f] rounded-lg border border-[#ece7dc] dark:border-[#26282f] text-center">
        <LatexRenderer
          math="w_{t+1} = \arg\max_{w \in V} P(w \mid w_{1}, \dots, w_t) = \arg\max_{w \in V} z_w"
          displayMode={true}
        />
        <p className="mt-2 text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          Always commits to the single candidate with highest probability. Purely deterministic.
        </p>
      </div>

      {/* Current Sequence Display */}
      <div className="mb-6 p-4 rounded-xl border border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#16171b]">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-2">
          Current Context Sequence:
        </span>
        <div className="flex flex-wrap items-center gap-1.5 font-serif text-base sm:text-lg">
          {tokens.map((tok, idx) => (
            <span
              key={idx}
              className={`px-2 py-0.5 rounded text-[#1c1917] dark:text-[#f3f4f6] ${
                idx >= 5
                  ? 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 border border-emerald-500/30 font-semibold'
                  : 'bg-stone-200/60 dark:bg-stone-800'
              }`}
            >
              {tok}
            </span>
          ))}
          <span className="inline-block w-2 h-5 bg-[#c2410c] dark:bg-[#d97706] animate-pulse ml-1" />
        </div>
      </div>

      {/* Candidate Breakdown & Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Candidates List (7 cols) */}
        <div className="lg:col-span-7 space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-1">
            Predicted Distribution for Next Position:
          </span>
          <div className="space-y-1.5">
            {candidatesWithProbs.slice(0, 5).map((c, idx) => {
              const isGreedy = idx === 0;
              return (
                <div
                  key={c.token}
                  className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between transition-colors ${
                    isGreedy
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 ring-1 ring-emerald-500'
                      : 'border-[#ece7dc] dark:border-[#26282f] bg-white dark:bg-[#1a1c22] text-[#57534e] dark:text-[#9ca3af]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{idx + 1}.</span>
                    <span className="font-semibold text-sm">"{c.token}"</span>
                    {isGreedy && (
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-emerald-500 text-white rounded">
                        Greedy Choice
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#a8a29e] dark:text-[#6b7280]">z = {c.logit.toFixed(1)}</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">
                      {(c.prob * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button & Explainer (5 cols) */}
        <div className="lg:col-span-5 p-5 bg-[#faf8f5] dark:bg-[#181a1f] rounded-xl border border-[#ece7dc] dark:border-[#26282f] space-y-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block">
              Deterministic Step
            </span>
            <div className="text-lg font-serif font-bold text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
              Append "{greedyChoice.token}"
            </div>
            <p className="text-xs text-[#57534e] dark:text-[#9ca3af] mt-1 leading-relaxed">
              Greedy decoding will always pick "{greedyChoice.token}" with 100% certainty regardless of how many times you run it.
            </p>
          </div>

          <button
            onClick={handleAppendGreedy}
            disabled={tokens.length >= 12 || greedyChoice.token === '<EOS>'}
            className="w-full py-2.5 px-4 rounded-lg bg-[#1c1917] dark:bg-white text-white dark:text-[#1c1917] font-mono text-xs font-semibold hover:bg-stone-800 dark:hover:bg-stone-100 transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
          >
            <span>Execute Greedy Step</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-[#1c1917] dark:text-[#fef3c7] space-y-1">
            <span className="font-semibold block flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              The Repetition Trap:
            </span>
            <p className="leading-relaxed opacity-90">
              Because greedy decoding cannot explore lower-probability alternatives, it easily gets trapped in repetitive loops (e.g. "I think that that that...").
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
