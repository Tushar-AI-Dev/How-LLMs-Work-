import React, { useState, useMemo } from 'react';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Flame, Sliders, Info, Sparkles, AlertCircle } from 'lucide-react';
import { stableSoftmax, scaleLogits } from '../../services/generationService';

interface CandidateTokenSpec {
  token: string;
  logit: number;
}

const CANDIDATES: CandidateTokenSpec[] = [
  { token: 'mat', logit: 4.8 },
  { token: 'rug', logit: 3.8 },
  { token: 'couch', logit: 2.9 },
  { token: 'floor', logit: 2.1 },
  { token: 'roof', logit: 0.5 },
  { token: 'moon', logit: -1.2 },
];

export const TemperatureSimulator: React.FC = () => {
  const [temperature, setTemperature] = useState<number>(0.7);

  const rawLogits = useMemo(() => CANDIDATES.map((c) => c.logit), []);
  const scaledLogits = useMemo(() => scaleLogits(rawLogits, temperature), [rawLogits, temperature]);
  const probabilities = useMemo(() => stableSoftmax(rawLogits, temperature), [rawLogits, temperature]);

  const maxProb = Math.max(...probabilities);

  const getTemperatureInterpretation = (t: number) => {
    if (t <= 0.3) {
      return {
        label: 'Near-Greedy / Hyper-Focused',
        badgeColor: 'bg-sky-500/20 text-sky-800 dark:text-sky-300 border-sky-400',
        desc: 'Sharpens the distribution dramatically. The top logit absorbs almost 100% of the probability mass, leaving virtually no room for alternative choices.',
      };
    } else if (t <= 0.8) {
      return {
        label: 'Balanced & Coherent (LLM Default)',
        badgeColor: 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-400',
        desc: 'Retains strong semantic discipline while allowing plausible synonyms and syntactic diversity to occasionally be sampled.',
      };
    } else if (t <= 1.2) {
      return {
        label: 'Neutral Softmax (T = 1.0)',
        badgeColor: 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-400',
        desc: 'Unscaled standard mathematical softmax directly representing the raw cross-entropy model training distribution.',
      };
    } else {
      return {
        label: 'High Entropy / Chaotic',
        badgeColor: 'bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-400',
        desc: 'Flattens all probabilities toward a uniform distribution. Extremely improbable tokens suddenly receive substantial probability, increasing hallucinations and incoherence.',
      };
    }
  };

  const interpretation = getTemperatureInterpretation(temperature);

  return (
    <div className="bg-white dark:bg-[#131417] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#ece7dc] dark:border-[#22242b] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            <Flame className="w-4 h-4" />
            <span>Entropy Calibration</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            The Temperature Simulator
          </h4>
        </div>

        {/* Temperature Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">Current T:</span>
          <span className="font-mono text-base font-bold px-2.5 py-1 rounded bg-[#faf8f5] dark:bg-[#1a1c22] border border-[#ece7dc] dark:border-[#282a32] text-[#c2410c] dark:text-[#d97706]">
            {temperature.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Governing Equation */}
      <div className="my-6 p-4 bg-[#faf8f5] dark:bg-[#181a1f] rounded-lg border border-[#ece7dc] dark:border-[#26282f] text-center">
        <LatexRenderer
          math="P(w_i) = \frac{\exp(z_i / T)}{\sum_{j=1}^{|V|} \exp(z_j / T)}, \quad T \in (0, \infty)"
          displayMode={true}
        />
        <p className="mt-2 text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          Temperature scales logits prior to exponentiation. It does not alter the model weights or change the ranking of candidates.
        </p>
      </div>

      {/* Interactive Controls & Presets */}
      <div className="p-5 rounded-xl border border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#16171b] space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-mono font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
            Adjust Temperature Slider:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'Low (0.2)', val: 0.2 },
              { label: 'Balanced (0.7)', val: 0.7 },
              { label: 'Neutral (1.0)', val: 1.0 },
              { label: 'High (2.0)', val: 2.0 },
            ].map((p) => (
              <button
                key={p.val}
                onClick={() => setTemperature(p.val)}
                className={`px-2.5 py-1 rounded text-xs font-mono border transition-colors cursor-pointer ${
                  temperature === p.val
                    ? 'border-[#c2410c] dark:border-[#d97706] bg-amber-500/10 text-[#c2410c] dark:text-[#d97706] font-bold'
                    : 'border-[#ece7dc] dark:border-[#282a32] bg-white dark:bg-[#1a1c22] text-[#57534e] dark:text-[#9ca3af]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <input
          type="range"
          min={0.05}
          max={2.5}
          step={0.05}
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
          className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
        />

        {/* Dynamic Interpretation Banner */}
        <div className={`p-3 rounded-lg border text-xs leading-relaxed ${interpretation.badgeColor}`}>
          <span className="font-bold block mb-0.5">{interpretation.label}</span>
          <p>{interpretation.desc}</p>
        </div>
      </div>

      {/* Visual Probability Distribution Comparison */}
      <div className="space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block">
          Calculated Probabilities Under T = {temperature.toFixed(2)}:
        </span>

        <div className="space-y-2">
          {CANDIDATES.map((c, idx) => {
            const prob = probabilities[idx];
            const isHighest = prob === maxProb;

            return (
              <div
                key={c.token}
                className="p-3 bg-[#faf8f5] dark:bg-[#16171b] rounded-lg border border-[#ece7dc] dark:border-[#26282f] flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div className="w-24 shrink-0 font-mono text-xs font-bold text-[#1c1917] dark:text-[#f3f4f6]">
                  "{c.token}"
                </div>

                {/* Bar */}
                <div className="grow bg-[#e6e0d4] dark:bg-[#282a32] h-6 rounded-md overflow-hidden relative flex items-center">
                  <div
                    className={`h-full transition-all duration-200 ${
                      isHighest
                        ? 'bg-amber-500'
                        : 'bg-stone-400 dark:bg-stone-600'
                    }`}
                    style={{ width: `${prob * 100}%` }}
                  />
                  <span className="absolute right-3 font-mono text-xs font-bold text-[#1c1917] dark:text-[#f3f4f6]">
                    {(prob * 100).toFixed(2)}%
                  </span>
                </div>

                <div className="w-24 shrink-0 text-right font-mono text-[11px] text-[#78716c] dark:text-[#9ca3af]">
                  z/T = {scaledLogits[idx].toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Critical Educational Disclaimers */}
      <div className="mt-6 p-4 rounded-xl border border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#181a1f] space-y-2 text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
        <div className="flex items-center gap-1.5 font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
          <AlertCircle className="w-4 h-4 text-[#c2410c] dark:text-[#d97706]" />
          <span>Crucial Educational Realities About Temperature:</span>
        </div>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Temperature is not "creativity":</strong> Higher temperature does not make an LLM more intelligent; it simply forces the sampler to choose tokens the model considered unlikely or ungrammatical.
          </li>
          <li>
            <strong>The rank order never flips:</strong> If logit A &gt; logit B, then under any positive temperature T &gt; 0, probability A is strictly greater than probability B.
          </li>
          <li>
            <strong>As T &rarr; 0:</strong> The distribution converges to a one-hot Dirac delta distribution on the argmax (equivalent to greedy decoding).
          </li>
        </ul>
      </div>
    </div>
  );
};
