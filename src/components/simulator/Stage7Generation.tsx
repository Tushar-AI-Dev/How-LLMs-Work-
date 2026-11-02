import React from 'react';
import { SimulatorForwardPass } from '../../services/simulatorEngine';
import {
  Sparkles,
  Play,
  FastForward,
  Undo,
  Sliders,
  Info,
  Terminal,
  CheckCircle2,
  BarChart2,
} from 'lucide-react';

interface Stage7GenerationProps {
  sim: SimulatorForwardPass;
  onStepToken: () => void;
  onGenerateMultiple: (count: number) => void;
  onUndo: () => void;
  canUndo: boolean;
  temperature: number;
  onTemperatureChange: (t: number) => void;
  topK: number;
  onTopKChange: (k: number) => void;
  topP: number;
  onTopPChange: (p: number) => void;
  samplingMethod: 'greedy' | 'sampling';
  onSamplingMethodChange: (m: 'greedy' | 'sampling') => void;
}

export const Stage7Generation: React.FC<Stage7GenerationProps> = ({
  sim,
  onStepToken,
  onGenerateMultiple,
  onUndo,
  canUndo,
  temperature,
  onTemperatureChange,
  topK,
  onTopKChange,
  topP,
  onTopPChange,
  samplingMethod,
  onSamplingMethodChange,
}) => {
  const candidates = sim.stage6.candidates;
  const retainedCandidates = candidates.filter((c) => c.isRetained);
  const selectedCandidate =
    candidates.find((c) => c.token === sim.stage7.selectedToken) || candidates[0];

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#ece7dc] dark:border-[#26282f]">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            Stage 07 of 07 · Educational Demonstration
          </span>
          <h3 className="text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
            Autoregressive Generation & Next-Token Sampling Loop
          </h3>
        </div>

        <div className="text-xs font-mono flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-[#f4efe6] dark:bg-[#1f2127] border border-[#ded7ca] dark:border-[#282a32] text-[#1c1917] dark:text-[#f3f4f6]">
            Sequence: <strong>[{sim.seqLen}] → [{sim.seqLen + 1}]</strong>
          </span>
          <span className="px-2.5 py-1 rounded bg-amber-100/80 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700 font-semibold">
            Deterministic Untrained Weights (8D)
          </span>
        </div>
      </div>

      {/* Explicit Educational Demonstration Notice */}
      <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-xl p-4 sm:p-5 flex items-start gap-3">
        <Info className="w-4 h-4 text-[#c2410c] dark:text-[#d97706] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs sm:text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#1c1917] dark:text-[#f3f4f6]">
            Educational Demonstration Notice — Deterministic, Untrained Weights
          </div>
          <p>
            This stage demonstrates the mathematical mechanics of autoregressive decoding, temperature scaling, Top-<code className="font-mono">k</code> truncation, and Top-<code className="font-mono">p</code> (nucleus) sampling using the simulator's deterministic 8-dimensional educational parameters (<code className="font-mono">d_model = 8, d_ff = 16</code>) and a curated 24-token candidate pool. Because these weights were not trained on a natural language corpus, generated continuations are illustrative numerical demonstrations and do not represent meaningful pretrained LLM responses.
          </p>
        </div>
      </div>

      {/* Autoregressive Loop Sequence Workspace */}
      <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#ece7dc] dark:border-[#22242b]">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] font-semibold">
              Autoregressive Feedback Loop (Append Selected Token & Re-Run Forward Pass):
            </span>
            <p className="text-xs text-[#57534e] dark:text-[#9ca3af] mt-0.5">
              Each generation step selects 1 token from the filtered probability distribution, appends it to the context window, and recomputes Stages 01–06.
            </p>
          </div>

          {/* Step / Multi-Step / Undo Controls */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={onStepToken}
              disabled={sim.stage7.isEOS}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#c2410c] hover:bg-[#9a3412] dark:bg-[#d97706] dark:hover:bg-[#b45309] disabled:opacity-40 text-white rounded-md text-xs font-mono font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Step +1 Token</span>
            </button>

            <button
              onClick={() => onGenerateMultiple(3)}
              disabled={sim.stage7.isEOS}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1c1917] hover:bg-black dark:bg-[#f3f4f6] dark:hover:bg-white disabled:opacity-40 text-white dark:text-[#111215] rounded-md text-xs font-mono font-medium transition-colors cursor-pointer"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>Generate +3 Tokens</span>
            </button>

            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f4efe6] dark:bg-[#1a1c22] border border-[#ded7ca] dark:border-[#282a32] rounded-md text-xs font-mono text-[#57534e] dark:text-[#9ca3af] hover:text-[#1c1917] dark:hover:text-[#f3f4f6] disabled:opacity-40 transition-colors cursor-pointer"
              title="Undo last token step"
            >
              <Undo className="w-3.5 h-3.5" />
              <span>Undo Step</span>
            </button>
          </div>
        </div>

        {/* Active Context Sequence + Next Selected Candidate */}
        <div className="p-5 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#ded7ca] dark:border-[#282a32] rounded-lg space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#78716c] dark:text-[#9ca3af] pb-2 border-b border-[#ece7dc] dark:border-[#22242b]">
            <span>Current Sequence & Next Sampled Continuation:</span>
            <span>
              Selected ID: <strong className="text-[#c2410c] dark:text-[#d97706]">#{sim.stage7.selectedTokenId}</strong> · Method:{' '}
              <strong className="text-[#1c1917] dark:text-[#f3f4f6]">
                {samplingMethod === 'greedy' ? 'Greedy (ArgMax)' : 'Stochastic Sampling'}
              </strong>
            </span>
          </div>

          <div className="text-base sm:text-lg font-serif leading-relaxed text-[#1c1917] dark:text-[#f3f4f6]">
            <span>{sim.rawText}</span>
            <span className="inline-flex items-center gap-1.5 ml-1.5 px-2.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/70 text-[#c2410c] dark:text-[#d97706] border border-amber-300 dark:border-amber-700 font-mono text-sm font-semibold">
              <span>{sim.stage7.isEOS ? '<|endoftext|>' : sim.stage7.selectedTokenRaw}</span>
              <span className="text-[10px] opacity-80">#{sim.stage7.selectedTokenId}</span>
            </span>
          </div>

          {/* Tokenized Sequence Stream */}
          <div className="pt-2 border-t border-[#ece7dc] dark:border-[#22242b] space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#78716c] dark:text-[#9ca3af]">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#c2410c] dark:text-[#d97706]" />
                <span>Token Sequence Stream ({sim.tokens.length} context tokens + 1 predicted):</span>
              </span>
              <span>GPT-2 R50K BPE Token IDs</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              {sim.tokens.map((tok, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white dark:bg-[#181a20] border border-[#ded7ca] dark:border-[#282a32] text-[#1c1917] dark:text-[#f3f4f6]"
                >
                  <span>{tok.text}</span>
                  <span className="text-[10px] text-[#78716c] dark:text-[#9ca3af]">#{tok.id}</span>
                </span>
              ))}

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#c2410c] dark:bg-[#d97706] text-white font-semibold shadow-xs">
                <span>+ "{sim.stage7.selectedToken}"</span>
                <span className="text-[10px] opacity-90">#{sim.stage7.selectedTokenId}</span>
              </span>
            </div>
          </div>

          {sim.stage7.isEOS && (
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 flex items-center gap-2 text-xs font-mono text-emerald-900 dark:text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                End-of-Sequence token (&lt;|endoftext|&gt;, ID #50256) selected. In an autoregressive loop, generation terminates when EOS is sampled. Use "Undo Step" or adjust sampling parameters to continue exploring.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Sampling Parameters & Decoding Strategy Card */}
      <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#ece7dc] dark:border-[#22242b]">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#c2410c] dark:text-[#d97706]" />
            <h4 className="font-serif text-base font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              Sampling Parameters & Decoding Strategy
            </h4>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#f4efe6] dark:bg-[#1a1c22] rounded-lg border border-[#e6e0d4] dark:border-[#26282f] text-xs font-mono">
            <button
              onClick={() => onSamplingMethodChange('sampling')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                samplingMethod === 'sampling'
                  ? 'bg-white dark:bg-[#111215] text-[#1c1917] dark:text-[#f3f4f6] font-semibold shadow-xs'
                  : 'text-[#57534e] dark:text-[#9ca3af]'
              }`}
            >
              Stochastic Sampling
            </button>
            <button
              onClick={() => onSamplingMethodChange('greedy')}
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-mono">
          {/* Temperature Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[#57534e] dark:text-[#9ca3af]">Temperature (T):</span>
              <span className="font-bold text-[#c2410c] dark:text-[#d97706] tabular-data">
                {samplingMethod === 'greedy' ? 'Greedy (ArgMax)' : `T = ${temperature.toFixed(2)}`}
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.8"
              step="0.05"
              value={temperature}
              disabled={samplingMethod === 'greedy'}
              onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
              className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer disabled:opacity-40"
            />
            <div className="flex justify-between text-[10px] text-[#78716c]">
              <span>0.1 (Peaked)</span>
              <span>0.7 (Balanced)</span>
              <span>1.8 (Flat / High Entropy)</span>
            </div>
          </div>

          {/* Top-K Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[#57534e] dark:text-[#9ca3af]">Top-K Cutoff:</span>
              <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6] tabular-data">
                {samplingMethod === 'greedy' ? 'K = 1 (Greedy)' : `K = ${topK} candidates`}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="1"
              value={topK}
              disabled={samplingMethod === 'greedy'}
              onChange={(e) => onTopKChange(parseInt(e.target.value, 10))}
              className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer disabled:opacity-40"
            />
            <div className="flex justify-between text-[10px] text-[#78716c]">
              <span>K = 1</span>
              <span>K = 5</span>
              <span>K = 12</span>
            </div>
          </div>

          {/* Top-P Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[#57534e] dark:text-[#9ca3af]">Top-P (Nucleus):</span>
              <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6] tabular-data">
                {samplingMethod === 'greedy' ? 'N/A' : `P = ${topP.toFixed(2)}`}
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={topP}
              disabled={samplingMethod === 'greedy'}
              onChange={(e) => onTopPChange(parseFloat(e.target.value))}
              className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer disabled:opacity-40"
            />
            <div className="flex justify-between text-[10px] text-[#78716c]">
              <span>P = 0.20</span>
              <span>P = 0.90</span>
              <span>P = 1.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtered Candidate Pool & Sampling Inspection */}
      <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#ece7dc] dark:border-[#22242b]">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#c2410c] dark:text-[#d97706]" />
            <h4 className="font-serif text-base font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              Candidate Filtering & Token Selection Inspection
            </h4>
          </div>
          <div className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
            Retained Pool: <strong className="text-[#1c1917] dark:text-[#f3f4f6]">{retainedCandidates.length}</strong> of {candidates.length} educational candidates
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
          {candidates.slice(0, 9).map((cand, idx) => {
            const isSelected = cand.token === selectedCandidate?.token;
            const pct = (cand.prob * 100).toFixed(1);

            return (
              <div
                key={cand.id}
                className={`p-3.5 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-[#c2410c] dark:border-[#d97706] shadow-xs'
                    : cand.isRetained
                    ? 'bg-[#faf8f5] dark:bg-[#0c0d10] border-[#ded7ca] dark:border-[#282a32]'
                    : 'bg-stone-100/40 dark:bg-stone-900/20 border-dashed border-stone-300 dark:border-stone-800 opacity-45'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-[#1c1917] dark:text-[#f3f4f6]">
                      "{cand.token}"
                    </span>
                    <span className="text-[10px] text-[#78716c] dark:text-[#9ca3af]">
                      #{cand.id}
                    </span>
                  </div>
                  <span className="font-bold text-[#c2410c] dark:text-[#d97706] tabular-data">
                    {pct}%
                  </span>
                </div>

                <div className="w-full bg-[#e6e0d4] dark:bg-[#26282f] h-2 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full ${
                      isSelected
                        ? 'bg-[#c2410c] dark:bg-[#d97706]'
                        : cand.isRetained
                        ? 'bg-amber-500 dark:bg-amber-600'
                        : 'bg-stone-400 dark:bg-stone-700'
                    }`}
                    style={{ width: `${Math.min(100, Math.round(cand.prob * 100))}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#78716c] dark:text-[#9ca3af]">
                  <span>Logit: {cand.logit.toFixed(2)} (z/T: {cand.scaledLogit})</span>
                  {isSelected ? (
                    <span className="px-1.5 py-0.5 rounded bg-[#c2410c] dark:bg-[#d97706] text-white font-semibold">
                      Selected (#{idx + 1})
                    </span>
                  ) : cand.isRetained ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                      Retained
                    </span>
                  ) : (
                    <span>Filtered Out</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
