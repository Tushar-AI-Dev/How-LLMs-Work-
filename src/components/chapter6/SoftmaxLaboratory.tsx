import React, { useState, useMemo } from 'react';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Scale, CheckCircle2, RotateCcw } from 'lucide-react';
import { stableSoftmax } from '../../services/generationService';

interface CandidateInput {
  token: string;
  logit: number;
}

const INITIAL_CANDIDATES: CandidateInput[] = [
  { token: 'mat', logit: 3.5 },
  { token: 'rug', logit: 2.1 },
  { token: 'couch', logit: 1.2 },
  { token: 'roof', logit: -0.8 },
];

export const SoftmaxLaboratory: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateInput[]>(INITIAL_CANDIDATES);

  const handleLogitChange = (idx: number, val: number) => {
    const updated = [...candidates];
    updated[idx] = { ...updated[idx], logit: val };
    setCandidates(updated);
  };

  const handleReset = () => {
    setCandidates(INITIAL_CANDIDATES);
  };

  // Step-by-step calculations
  const logits = useMemo(() => candidates.map((c) => c.logit), [candidates]);
  const maxLogit = useMemo(() => Math.max(...logits), [logits]);
  const shiftedLogits = useMemo(() => logits.map((z) => z - maxLogit), [logits, maxLogit]);
  const expScores = useMemo(() => shiftedLogits.map((z) => Math.exp(z)), [shiftedLogits]);
  const sumExp = useMemo(() => expScores.reduce((a, b) => a + b, 0), [expScores]);
  const probabilities = useMemo(() => stableSoftmax(logits, 1.0), [logits]);
  const totalProbability = useMemo(
    () => probabilities.reduce((a, b) => a + b, 0),
    [probabilities]
  );

  return (
    <div className="bg-white dark:bg-[#131417] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#ece7dc] dark:border-[#22242b] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            <Scale className="w-4 h-4" />
            <span>Mathematical Transformation</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            The Softmax & Probability Laboratory
          </h4>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#ece7dc] dark:border-[#282a32] bg-[#faf8f5] dark:bg-[#1a1c22] text-xs font-mono text-[#78716c] dark:text-[#9ca3af] hover:text-[#1c1917] dark:hover:text-[#f3f4f6] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Lab</span>
        </button>
      </div>

      {/* Governing Formula */}
      <div className="my-6 p-4 bg-[#faf8f5] dark:bg-[#181a1f] rounded-lg border border-[#ece7dc] dark:border-[#26282f] text-center">
        <LatexRenderer
          math="P(w_i) = \frac{\exp(z_i)}{\sum_{j=1}^{|V|} \exp(z_j)} = \frac{\exp(z_i - \max(\mathbf{z}))}{\sum_{j=1}^{|V|} \exp(z_j - \max(\mathbf{z}))}"
          displayMode={true}
        />
        <p className="mt-2 text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          Numerically stable Softmax subtracts <LatexRenderer math="\max(\mathbf{z})" /> before exponentiation, ensuring intermediate floats never overflow.
        </p>
      </div>

      {/* Candidate Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {candidates.map((c, idx) => (
          <div
            key={c.token}
            className="p-3.5 bg-[#faf8f5] dark:bg-[#16171b] rounded-xl border border-[#ece7dc] dark:border-[#26282f] space-y-2"
          >
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6]">
                "{c.token}"
              </span>
              <span className="text-[#c2410c] dark:text-[#d97706] font-semibold">
                z = {c.logit > 0 ? `+${c.logit.toFixed(1)}` : c.logit.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min={-4.0}
              max={6.0}
              step={0.1}
              value={c.logit}
              onChange={(e) => handleLogitChange(idx, Number(e.target.value))}
              className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* Computational Breakdown Table */}
      <div className="overflow-x-auto rounded-xl border border-[#ece7dc] dark:border-[#26282f]">
        <table className="w-full text-xs font-mono text-left">
          <thead className="bg-[#f4efe6] dark:bg-[#1a1c22] border-b border-[#ece7dc] dark:border-[#26282f] text-[#57534e] dark:text-[#9ca3af]">
            <tr>
              <th className="p-3">Candidate Token</th>
              <th className="p-3 text-center">Raw Logit (z)</th>
              <th className="p-3 text-center">Shifted (z - max)</th>
              <th className="p-3 text-center">Exponent exp(z - max)</th>
              <th className="p-3 text-right">Probability P(w)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ece7dc] dark:divide-[#26282f]">
            {candidates.map((c, idx) => {
              const prob = probabilities[idx];
              const isTop = c.logit === maxLogit;

              return (
                <tr
                  key={c.token}
                  className={isTop ? 'bg-amber-500/10 font-medium' : 'hover:bg-amber-500/5'}
                >
                  <td className="p-3 font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
                    "{c.token}" {isTop && <span className="text-[10px] text-[#c2410c] dark:text-[#d97706] ml-1">(Top Choice)</span>}
                  </td>
                  <td className="p-3 text-center font-mono">
                    {c.logit > 0 ? `+${c.logit.toFixed(1)}` : c.logit.toFixed(1)}
                  </td>
                  <td className="p-3 text-center text-sky-700 dark:text-sky-400">
                    {shiftedLogits[idx].toFixed(2)}
                  </td>
                  <td className="p-3 text-center text-purple-700 dark:text-purple-400 font-medium">
                    {expScores[idx].toFixed(4)}
                  </td>
                  <td className="p-3 text-right">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {(prob * 100).toFixed(2)}%
                    </span>
                    <span className="text-[10px] text-[#78716c] dark:text-[#9ca3af] ml-1.5">
                      ({prob.toFixed(4)})
                    </span>
                  </td>
                </tr>
              );
            })}

            {/* Sum Row */}
            <tr className="bg-[#faf8f5] dark:bg-[#16171b] font-bold text-[#1c1917] dark:text-[#f3f4f6]">
              <td className="p-3">Total Sum (<LatexRenderer math="\sum" />)</td>
              <td className="p-3 text-center text-[#78716c] dark:text-[#9ca3af]">—</td>
              <td className="p-3 text-center text-[#78716c] dark:text-[#9ca3af]">—</td>
              <td className="p-3 text-center text-purple-700 dark:text-purple-400">
                {sumExp.toFixed(4)}
              </td>
              <td className="p-3 text-right text-emerald-700 dark:text-emerald-400 flex items-center justify-end gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{(totalProbability * 100).toFixed(1)}% (1.0000)</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Visual Probability Distribution Bar */}
      <div className="mt-6 space-y-2">
        <div className="flex justify-between items-center text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          <span>Normalized Categorical Distribution:</span>
          <span>Must Sum Strictly to 100%</span>
        </div>
        <div className="w-full h-8 rounded-lg overflow-hidden flex border border-[#ece7dc] dark:border-[#26282f] shadow-xs">
          {candidates.map((c, idx) => {
            const prob = probabilities[idx];
            const colors = ['bg-amber-500', 'bg-sky-500', 'bg-purple-500', 'bg-emerald-500'];
            return (
              <div
                key={c.token}
                className={`${colors[idx % colors.length]} h-full transition-all duration-200 flex items-center justify-center text-white text-[10px] font-mono font-bold truncate px-1`}
                style={{ width: `${prob * 100}%` }}
                title={`"${c.token}": ${(prob * 100).toFixed(1)}%`}
              >
                {prob > 0.08 ? `"${c.token}" ${(prob * 100).toFixed(0)}%` : ''}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
