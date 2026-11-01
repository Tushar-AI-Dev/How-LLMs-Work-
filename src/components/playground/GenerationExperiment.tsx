import React, { useState } from 'react';
import {
  computeNextTokenDistribution,
  getToyModelLogits,
  TOY_PROMPTS,
  FilteringResult,
  CandidateToken,
} from '../../services/generationService';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Sliders, Play, RotateCcw, FastForward, Undo, Sparkles, Info } from 'lucide-react';

export const GenerationExperiment: React.FC = () => {
  const [currentPrompt, setCurrentPrompt] = useState<string[]>(['The', 'cat', 'slept', 'on', 'the']);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topK, setTopK] = useState<number>(5);
  const [topP, setTopP] = useState<number>(0.9);
  const [samplingMethod, setSamplingMethod] = useState<'sampling' | 'greedy'>('sampling');
  const [history, setHistory] = useState<string[][]>([]);

  // Compute distribution for current state
  const rawCandidates = getToyModelLogits(currentPrompt);
  const filteringResult: FilteringResult = computeNextTokenDistribution(rawCandidates, {
    temperature,
    topK,
    topP,
    samplingMethod,
  });

  // Step 1 token
  const handleStep = () => {
    setHistory((prev) => [...prev, [...currentPrompt]]);
    const nextTok = filteringResult.selectedToken.token;
    setCurrentPrompt((prev) => [...prev, nextTok]);
  };

  // Step 5 tokens
  const handleGenerateFive = () => {
    let promptCopy = [...currentPrompt];
    const newHistory = [...history, [...currentPrompt]];

    for (let s = 0; s < 5; s++) {
      const candidates = getToyModelLogits(promptCopy);
      const res = computeNextTokenDistribution(candidates, {
        temperature,
        topK,
        topP,
        samplingMethod,
      });
      promptCopy.push(res.selectedToken.token);
      if (res.selectedToken.token === '<EOS>') break;
    }

    setHistory(newHistory);
    setCurrentPrompt(promptCopy);
  };

  // Undo
  const handleUndo = () => {
    if (history.length > 0) {
      const last = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      setCurrentPrompt(last);
    } else if (currentPrompt.length > 2) {
      setCurrentPrompt((prev) => prev.slice(0, -1));
    }
  };

  // Reset
  const handleReset = (presetTokens: string[]) => {
    setHistory([]);
    setCurrentPrompt(presetTokens);
  };

  return (
    <div className="space-y-8">
      {/* Experiment Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#ece7dc] dark:border-[#26282f]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            <span>Experiment 06</span>
            <span>·</span>
            <span>Probabilistic Decoding</span>
          </div>
          <h2 className="text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            Autoregressive Generation & Sampling Lab
          </h2>
        </div>

        {/* Decoding Method Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-[#f4efe6] dark:bg-[#1a1c22] rounded-lg border border-[#e6e0d4] dark:border-[#26282f] text-xs font-mono">
          <button
            onClick={() => setSamplingMethod('sampling')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              samplingMethod === 'sampling'
                ? 'bg-white dark:bg-[#111215] text-[#1c1917] dark:text-[#f3f4f6] font-semibold shadow-xs'
                : 'text-[#57534e] dark:text-[#9ca3af]'
            }`}
          >
            Stochastic Sampling
          </button>
          <button
            onClick={() => setSamplingMethod('greedy')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              samplingMethod === 'greedy'
                ? 'bg-white dark:bg-[#111215] text-[#1c1917] dark:text-[#f3f4f6] font-semibold shadow-xs'
                : 'text-[#57534e] dark:text-[#9ca3af]'
            }`}
          >
            Greedy (ArgMax)
          </button>
        </div>
      </div>

      {/* Generation Workspace: Text Canvas & Stepper */}
      <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#ece7dc] dark:border-[#22242b]">
          <span className="text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] font-semibold">
            Autoregressive Sequence Accumulator:
          </span>

          {/* Stepper Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleStep}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#c2410c] hover:bg-[#9a3412] dark:bg-[#d97706] dark:hover:bg-[#b45309] text-white rounded-md text-xs font-mono font-medium transition-colors cursor-pointer shadow-xs"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Step 1 Token</span>
            </button>

            <button
              onClick={handleGenerateFive}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1c1917] hover:bg-black dark:bg-[#f3f4f6] dark:hover:bg-white text-white dark:text-[#111215] rounded-md text-xs font-mono font-medium transition-colors cursor-pointer"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>Generate 5</span>
            </button>

            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className="p-1.5 bg-[#f4efe6] dark:bg-[#1a1c22] rounded text-[#57534e] dark:text-[#9ca3af] hover:text-[#1c1917] dark:hover:text-[#f3f4f6] disabled:opacity-40 transition-colors cursor-pointer"
              title="Undo last step"
            >
              <Undo className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Sequence Pill Cloud */}
        <div className="p-4 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-lg min-h-[72px] flex flex-wrap items-center gap-2">
          {currentPrompt.map((tok, idx) => (
            <span
              key={idx}
              className={`px-2.5 py-1 rounded text-xs sm:text-sm font-mono border transition-all ${
                idx >= currentPrompt.length - (history.length > 0 ? 1 : 0) && history.length > 0
                  ? 'bg-[#c2410c] text-white border-transparent font-bold animate-pulse'
                  : 'bg-white dark:bg-[#1a1c22] text-[#1c1917] dark:text-[#f3f4f6] border-[#ded7ca] dark:border-[#282a32]'
              }`}
            >
              {tok}
            </span>
          ))}
          <span className="text-xs font-mono text-[#c2410c] dark:text-[#d97706] animate-pulse">
            ▋
          </span>
        </div>

        {/* Prompt presets */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af]">
            Prompt Seeds:
          </span>
          {TOY_PROMPTS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleReset(p.tokens)}
              className="px-2.5 py-1 rounded bg-[#f4efe6] dark:bg-[#1a1c22] text-[#57534e] dark:text-[#9ca3af] hover:text-[#1c1917] dark:hover:text-[#f3f4f6] border border-[#e6e0d4] dark:border-[#26282f] cursor-pointer text-xs"
            >
              "{p.label}"
            </button>
          ))}
        </div>
      </div>

      {/* Sampling Hyperparameters Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 bg-white dark:bg-[#141518] rounded-xl border border-[#e6e0d4] dark:border-[#26282f] text-xs font-mono">
        {/* Temperature */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-[#57534e] dark:text-[#9ca3af]">Temperature (T):</span>
            <span className="font-bold text-[#c2410c] dark:text-[#d97706] tabular-data">
              T = {temperature.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.8"
            step="0.05"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#78716c]">
            <span>0.1 (Greedy)</span>
            <span>0.7 (Standard)</span>
            <span>1.8 (Creative)</span>
          </div>
        </div>

        {/* Top-K */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-[#57534e] dark:text-[#9ca3af]">Top-K Cutoff:</span>
            <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6] tabular-data">
              K = {topK} tokens
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="8"
            step="1"
            value={topK}
            onChange={(e) => setTopK(parseInt(e.target.value))}
            className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#78716c]">
            <span>K = 1 (ArgMax)</span>
            <span>K = 5 (Balanced)</span>
            <span>K = 8 (Broad)</span>
          </div>
        </div>

        {/* Top-P */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-[#57534e] dark:text-[#9ca3af]">Top-P (Nucleus):</span>
            <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6] tabular-data">
              P = {topP.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="1.0"
            step="0.05"
            value={topP}
            onChange={(e) => setTopP(parseFloat(e.target.value))}
            className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#78716c]">
            <span>P = 0.2 (Tight)</span>
            <span>P = 0.9 (Standard)</span>
            <span>P = 1.0 (Full)</span>
          </div>
        </div>
      </div>

      {/* Live Probability Distribution Inspector */}
      <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#ece7dc] dark:border-[#22242b]">
          <div>
            <h3 className="font-serif text-lg font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              Next-Token Logits & Probabilities Distribution
            </h3>
            <p className="text-xs text-[#78716c] dark:text-[#9ca3af] mt-0.5">
              Softmax partition function: P(w_i) = exp(z_i / T) / Σ exp(z_j / T)
            </p>
          </div>

          <div className="text-xs font-mono text-[#c2410c] dark:text-[#d97706] font-bold">
            Selected: "{filteringResult.selectedToken.token}"
          </div>
        </div>

        <div className="space-y-3">
          {filteringResult.allCandidates.map((c, idx) => {
            const isRetained = filteringResult.retained.some((r) => r.token === c.token);
            const isSelected = filteringResult.selectedToken.token === c.token;
            const pct = Math.round(c.prob * 100);

            return (
              <div
                key={c.token}
                className={`p-3 rounded-lg border text-xs font-mono transition-all ${
                  isSelected
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 font-semibold'
                    : isRetained
                    ? 'bg-[#faf8f5] dark:bg-[#0c0d10] border-[#ded7ca] dark:border-[#282a32]'
                    : 'bg-stone-100/50 dark:bg-stone-900/30 border-dashed border-stone-300 dark:border-stone-800 opacity-50'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#1c1917] dark:text-[#f3f4f6]">
                      "{c.token}"
                    </span>
                    {isSelected && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#c2410c] text-white">
                        Sampled
                      </span>
                    )}
                    {!isRetained && (
                      <span className="text-[10px] text-stone-500">
                        Filtered out by Top-K/Top-P
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-[#78716c] dark:text-[#9ca3af]">
                      Raw Logit: {c.logit.toFixed(1)}
                    </span>
                    <span className="tabular-data font-bold text-[#c2410c] dark:text-[#d97706]">
                      {pct}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-[#e6e0d4] dark:bg-[#26282f] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-200 ${
                      isSelected
                        ? 'bg-[#c2410c] dark:bg-[#d97706]'
                        : isRetained
                        ? 'bg-amber-500'
                        : 'bg-stone-400 dark:bg-stone-700'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
