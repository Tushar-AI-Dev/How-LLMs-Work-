import React from 'react';
import { SimulatorForwardPass } from '../../services/simulatorEngine';
import { Sparkles, BarChart2, Sliders, ArrowRight } from 'lucide-react';

interface Stage6PredictionProps {
  sim: SimulatorForwardPass;
  onAdvanceToGeneration: () => void;
}

export const Stage6Prediction: React.FC<Stage6PredictionProps> = ({
  sim,
  onAdvanceToGeneration,
}) => {
  const lastToken = sim.tokens[sim.stage6.predictionIndex];
  const candidates = sim.stage6.candidates;

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#ece7dc] dark:border-[#26282f]">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            Stage 06 of 07
          </span>
          <h3 className="text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
            Next-Token Prediction: Unembedding Head & Softmax
          </h3>
        </div>
        <div className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          Vocab Distribution: <strong className="text-[#c2410c] dark:text-[#d97706]">{sim.stage6.shape}</strong>
        </div>
      </div>

      {/* Unembedding Head Linear Projection Showcase */}
      <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#ece7dc] dark:border-[#22242b]">
          <div>
            <h4 className="font-serif text-sm font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              Prediction Anchor: Last Hidden State h_{'{' + sim.stage6.predictionIndex + '}'} at token "{lastToken?.text}"
            </h4>
            <span className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
              Position #{sim.stage6.predictionIndex} projects into vocabulary space: z = W_u · h_last
            </span>
          </div>

          <div className="text-xs font-mono text-[#c2410c] dark:text-[#d97706] font-semibold">
            Temperature T = {sim.stage6.temperature}
          </div>
        </div>

        <div className="p-3 bg-[#faf8f5] dark:bg-[#0c0d10] rounded border border-[#ded7ca] dark:border-[#282a32] text-xs font-mono text-[#1c1917] dark:text-[#f3f4f6] overflow-x-auto">
          <span className="text-[#78716c] dark:text-[#9ca3af]">h_last = </span>
          <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
            [{sim.stage6.lastHiddenVector.map((v) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2))).join(', ')}]
          </span>
        </div>

        <p className="text-xs text-[#78716c] dark:text-[#9ca3af] leading-relaxed">
          <strong className="text-[#1c1917] dark:text-[#f3f4f6]">Scientific Scope Note:</strong> While the tokenizer uses the full 50,257-token GPT-2 vocabulary, this educational LM head evaluates and normalizes probabilities across a curated <strong>24-token candidate subset</strong> using weight-tied deterministic educational vectors (<code className="font-mono">W_u = W_e^T</code>) so every logit and softmax step can be inspected directly.
        </p>
      </div>

      {/* Top Candidate Distribution Bar Chart */}
      <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-[#ece7dc] dark:border-[#22242b]">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#c2410c] dark:text-[#d97706]" />
            <h4 className="font-serif text-base font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              Next-Token Softmax Probabilities: P(w_i) = exp(z_i / T) / Σ exp(z_j / T)
            </h4>
          </div>
          <button
            onClick={onAdvanceToGeneration}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#c2410c] hover:bg-[#9a3412] dark:bg-[#d97706] dark:hover:bg-[#b45309] text-white rounded text-xs font-mono font-medium transition-colors cursor-pointer"
          >
            <span>Proceed to Sampling</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {candidates.slice(0, 8).map((cand, idx) => {
            const pct = Math.round(cand.prob * 100);
            const isTop = idx === 0;

            return (
              <div
                key={cand.token}
                className={`p-3 rounded-lg border text-xs font-mono transition-all ${
                  isTop
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 font-semibold'
                    : cand.isRetained
                    ? 'bg-[#faf8f5] dark:bg-[#0c0d10] border-[#ded7ca] dark:border-[#282a32]'
                    : 'bg-stone-100/40 dark:bg-stone-900/20 border-dashed border-stone-300 dark:border-stone-800 opacity-40'
                }`}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#1c1917] dark:text-[#f3f4f6]">
                      "{cand.token}"
                    </span>
                    <span className="text-[10px] font-mono text-[#78716c] dark:text-[#9ca3af] bg-[#e6e0d4]/60 dark:bg-[#22242b] px-1 py-0.5 rounded">
                      ID #{cand.id}
                    </span>
                    {isTop && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#c2410c] dark:bg-[#d97706] text-white">
                        ArgMax Top Pick
                      </span>
                    )}
                    {!cand.isRetained && (
                      <span className="text-[10px] text-stone-500">
                        Truncated by Top-K/Top-P
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-[#78716c] dark:text-[#9ca3af]">
                      Logit: {cand.logit.toFixed(2)} (scaled: {cand.scaledLogit})
                    </span>
                    <span className="tabular-data font-bold text-[#c2410c] dark:text-[#d97706] text-sm">
                      {pct}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-[#e6e0d4] dark:bg-[#26282f] h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isTop
                        ? 'bg-[#c2410c] dark:bg-[#d97706]'
                        : cand.isRetained
                        ? 'bg-amber-500 dark:bg-amber-600'
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
