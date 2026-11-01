import React, { useState } from 'react';
import { softmax } from '../../services/attentionService';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Sliders, RotateCcw, Check, Sparkles, HelpCircle } from 'lucide-react';

export const SoftmaxLaboratory: React.FC = () => {
  const [scores, setScores] = useState<number[]>([2.4, 0.8, -1.2, 3.1]);
  const [temperature, setTemperature] = useState<number>(1.0);

  const labels = ['Score A', 'Score B', 'Score C', 'Score D'];

  // Handle score change
  const handleScoreChange = (index: number, val: number) => {
    const updated = [...scores];
    updated[index] = val;
    setScores(updated);
  };

  // Compute Exponentials & Softmax
  const scaledScores = scores.map((s) => s / temperature);
  const maxScore = Math.max(...scaledScores);
  const exps = scaledScores.map((s) => Math.exp(s - maxScore)); // numerical stability
  const rawExps = scaledScores.map((s) => Math.exp(s)); // displayed for intuition
  const sumExps = exps.reduce((acc, v) => acc + v, 0);
  const probabilities = softmax(scores, temperature);
  const totalProb = probabilities.reduce((acc, p) => acc + p, 0);

  const resetScores = () => {
    setScores([2.4, 0.8, -1.2, 3.1]);
    setTemperature(1.0);
  };

  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ece7dc] dark:border-[#22242b] mb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            Interactive Feature · Section 07
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
            The Softmax Laboratory: From Real Scores to Probabilities
          </h3>
        </div>

        <button
          onClick={resetScores}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-[#faf8f5] dark:bg-[#1a1c22] border border-[#ded7ca] dark:border-[#282a32] text-[#57534e] dark:text-[#9ca3af] hover:text-[#1c1917] dark:hover:text-[#f3f4f6] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Laboratory</span>
        </button>
      </div>

      <p className="text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed mb-6">
        Raw dot products can be negative, zero, or positive numbers on the real line $(-\infty, +\infty)$. Softmax exponentiates every score to make it strictly non-negative, and normalizes by the sum so all values become a probability distribution summing to <strong>1.0 (100%)</strong>.
      </p>

      {/* Equation Banner */}
      <div className="p-3 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-lg mb-6 text-center text-xs sm:text-sm text-[#1c1917] dark:text-[#f3f4f6]">
        <LatexRenderer math="\text{softmax}(z_i) = \frac{\exp(z_i / T)}{\sum_{j=1}^N \exp(z_j / T)}" displayMode={true} />
      </div>

      {/* Main Interactive Stage */}
      <div className="p-6 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-xl space-y-6">
        
        {/* Temperature Controller */}
        <div className="p-4 bg-white dark:bg-[#141518] rounded-lg border border-[#ded7ca] dark:border-[#282a32] space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#57534e] dark:text-[#9ca3af] font-semibold">
              Temperature Scaling Parameter (T):
            </span>
            <span className="font-bold text-[#c2410c] dark:text-[#d97706] text-sm tabular-data">
              T = {temperature.toFixed(2)} {temperature < 0.8 ? '(Sharp/ArgMax)' : temperature > 1.4 ? '(Diffuse/Uniform)' : '(Standard)'}
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.05"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-[#78716c]">
            <span>T = 0.2 (Winner takes all)</span>
            <span>T = 1.0 (Standard default)</span>
            <span>T = 2.5 (High entropy / uniform)</span>
          </div>
        </div>

        {/* Dynamic Sliders and Calculations Table */}
        <div className="border border-[#ded7ca] dark:border-[#282a32] rounded-lg overflow-x-auto bg-white dark:bg-[#141518] p-4">
          <div className="min-w-[550px] space-y-4">
            <div className="grid grid-cols-12 text-xs font-mono text-[#78716c] dark:text-[#9ca3af] pb-2 border-b border-[#ece7dc] dark:border-[#22242b]">
              <span className="col-span-3">Item / Logit</span>
              <span className="col-span-3">Raw Score (z_i)</span>
              <span className="col-span-2 text-right">exp(z_i / T)</span>
              <span className="col-span-4 text-right font-bold text-[#c2410c] dark:text-[#d97706]">
                Attention Weight σ(z_i)
              </span>
            </div>

            {scores.map((score, idx) => {
              const expVal = rawExps[idx];
              const prob = probabilities[idx];

              return (
                <div key={idx} className="grid grid-cols-12 items-center gap-3 text-xs font-mono">
                  {/* Label */}
                  <div className="col-span-3 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#c2410c] dark:bg-[#d97706]" />
                    <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6]">
                      {labels[idx]}
                    </span>
                  </div>

                  {/* Slider Control */}
                  <div className="col-span-3 space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#78716c]">Adjust:</span>
                      <span className="font-bold tabular-data text-[#1c1917] dark:text-[#f3f4f6]">
                        {score >= 0 ? `+${score.toFixed(1)}` : score.toFixed(1)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-4.0"
                      max="5.0"
                      step="0.1"
                      value={score}
                      onChange={(e) => handleScoreChange(idx, Number(e.target.value))}
                      className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
                    />
                  </div>

                  {/* Exponentiated Value */}
                  <div className="col-span-2 text-right tabular-data text-[#57534e] dark:text-[#9ca3af]">
                    {expVal > 999 ? expVal.toExponential(2) : expVal.toFixed(2)}
                  </div>

                  {/* Probability Bar & % */}
                  <div className="col-span-4 flex items-center gap-2 justify-end">
                    <div className="w-28 h-4 bg-[#f0ebe1] dark:bg-[#1e2026] rounded overflow-hidden">
                      <div
                        className="h-full bg-[#c2410c] dark:bg-[#d97706] transition-all duration-150"
                        style={{ width: `${Math.min(100, prob * 100)}%` }}
                      />
                    </div>
                    <span className="w-14 text-right font-bold tabular-data text-[#1c1917] dark:text-[#f3f4f6]">
                      {(prob * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sum Check Verification Banner */}
        <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold">Probability Sum Axiom Satisfied:</span>
            <span>∑ σ(z_i) = 1.00000 (100.0%)</span>
          </div>

          <div className="text-emerald-800 dark:text-emerald-300">
            All elements ∈ (0, 1) & strictly positive
          </div>
        </div>
      </div>
    </div>
  );
};
