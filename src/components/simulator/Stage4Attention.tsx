import React from 'react';
import { SimulatorForwardPass } from '../../services/simulatorEngine';
import { Eye, Shield, Crosshair, ArrowDownRight, Layers } from 'lucide-react';

interface Stage4AttentionProps {
  sim: SimulatorForwardPass;
  trackedTokenIdx: number;
  onSelectToken: (idx: number) => void;
}

export const Stage4Attention: React.FC<Stage4AttentionProps> = ({
  sim,
  trackedTokenIdx,
  onSelectToken,
}) => {
  const trackedToken = sim.tokenReps[trackedTokenIdx] || sim.tokenReps[0];
  const queryWeights = sim.stage4.attentionWeights[trackedTokenIdx] || [];

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#ece7dc] dark:border-[#26282f]">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            Stage 04 of 07
          </span>
          <h3 className="text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
            Causal Self-Attention: Dynamic Information Routing
          </h3>
        </div>
        <div className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          Tensor Shape: <strong className="text-[#c2410c] dark:text-[#d97706]">{sim.stage4.shape}</strong>
        </div>
      </div>

      {/* Projections Q, K, V Summary for Tracked Token */}
      <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#ece7dc] dark:border-[#26282f]">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#c2410c] dark:text-[#d97706]" />
            <h4 className="font-serif text-sm font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              Tri-Projection Vectors for Tracked Token #{trackedTokenIdx} ("{trackedToken.text}")
            </h4>
          </div>
          <span className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
            d_k = {sim.stage4.d_k} · √d_k = 2.83
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 bg-[#faf8f5] dark:bg-[#0c0d10] rounded border border-[#ded7ca] dark:border-[#282a32] space-y-1">
            <span className="text-[11px] text-[#c2410c] dark:text-[#d97706] font-semibold block">
              Query Vector q_{'{' + trackedTokenIdx + '}'} = x₀ · W_Q
            </span>
            <div className="text-[#1c1917] dark:text-[#f3f4f6] truncate">
              [{trackedToken.qVector.map((v) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2))).join(', ')}]
            </div>
            <span className="text-[10px] text-[#78716c] block">"What am I looking for?"</span>
          </div>

          <div className="p-3 bg-[#faf8f5] dark:bg-[#0c0d10] rounded border border-[#ded7ca] dark:border-[#282a32] space-y-1">
            <span className="text-[11px] text-sky-700 dark:text-sky-400 font-semibold block">
              Key Vector k_{'{' + trackedTokenIdx + '}'} = x₀ · W_K
            </span>
            <div className="text-[#1c1917] dark:text-[#f3f4f6] truncate">
              [{trackedToken.kVector.map((v) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2))).join(', ')}]
            </div>
            <span className="text-[10px] text-[#78716c] block">"What information do I offer?"</span>
          </div>

          <div className="p-3 bg-[#faf8f5] dark:bg-[#0c0d10] rounded border border-[#ded7ca] dark:border-[#282a32] space-y-1">
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold block">
              Value Vector v_{'{' + trackedTokenIdx + '}'} = x₀ · W_V
            </span>
            <div className="text-[#1c1917] dark:text-[#f3f4f6] truncate">
              [{trackedToken.vVector.map((v) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2))).join(', ')}]
            </div>
            <span className="text-[10px] text-[#78716c] block">"The actual content to broadcast"</span>
          </div>
        </div>
      </div>

      {/* Two-Column Stage: Left Heatmap Matrix, Right Active Query Attention Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Causal Attention Heatmap Matrix (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-base font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              Causal Attention Weights Matrix [{sim.seqLen} × {sim.seqLen}]
            </h4>
            <span className="text-[11px] font-mono text-[#78716c] dark:text-[#9ca3af]">
              Softmax((QK^T / √d_k) + M)
            </span>
          </div>

          <div className="overflow-x-auto p-4 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#ded7ca] dark:border-[#282a32] rounded-lg">
            <div className="min-w-[340px]">
              {/* Header: Key Tokens */}
              <div className="flex items-center mb-1 text-[11px] font-mono text-[#78716c] dark:text-[#9ca3af]">
                <div className="w-20 shrink-0 font-semibold text-center">Q \ K</div>
                {sim.tokens.map((t, j) => (
                  <div key={j} className="flex-1 text-center font-medium truncate">
                    "{t.text}"
                  </div>
                ))}
              </div>

              {/* Rows: Query Tokens */}
              {sim.stage4.attentionWeights.map((row, i) => {
                const isTrackedRow = trackedTokenIdx === i;

                return (
                  <div
                    key={i}
                    onClick={() => onSelectToken(i)}
                    className={`flex items-center gap-1 py-1 px-1 rounded cursor-pointer transition-colors ${
                      isTrackedRow
                        ? 'bg-[#e2dbce] dark:bg-[#26282f] ring-1 ring-[#c2410c] dark:ring-[#d97706]'
                        : 'hover:bg-[#f0ebe1] dark:hover:bg-[#181a20]'
                    }`}
                  >
                    <div className="w-20 shrink-0 font-mono text-xs font-semibold text-[#1c1917] dark:text-[#f3f4f6] truncate">
                      #{i} "{sim.tokens[i]?.text}"
                    </div>

                    {row.map((weight, j) => {
                      const isFuture = j > i;

                      return (
                        <div
                          key={j}
                          title={`Q: "${sim.tokens[i]?.text}", K: "${sim.tokens[j]?.text}", Attention: ${isFuture ? 'Masked (-∞)' : weight.toFixed(3)}`}
                          className={`flex-1 h-8 rounded flex items-center justify-center text-[11px] font-mono tabular-data font-semibold ${
                            isFuture
                              ? 'bg-stone-200/40 dark:bg-stone-800/20 text-[#a8a29e] dark:text-[#52525b] border border-dashed border-stone-300 dark:border-stone-800'
                              : weight > 0.4
                              ? 'bg-[#c2410c] text-white shadow-xs'
                              : weight > 0.2
                              ? 'bg-amber-400 dark:bg-amber-600 text-stone-900 font-bold'
                              : 'bg-amber-100 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200'
                          }`}
                        >
                          {isFuture ? '0.00' : weight.toFixed(2)}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#57534e] dark:text-[#9ca3af]">
            <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Upper triangle is strictly masked with -∞ to prevent future token information leakage.</span>
          </div>
        </div>

        {/* Right: Active Query Attention Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#ece7dc] dark:border-[#26282f]">
            <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
              Query Attention Distribution
            </span>
            <span className="text-xs font-mono text-[#1c1917] dark:text-[#f3f4f6]">
              Token #{trackedTokenIdx}: <strong>"{trackedToken.text}"</strong>
            </span>
          </div>

          <div className="space-y-2">
            {sim.tokens.map((t, j) => {
              const w = queryWeights[j] || 0;
              const isFuture = j > trackedTokenIdx;
              const pct = Math.round(w * 100);

              return (
                <div key={j} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#1c1917] dark:text-[#f3f4f6]">
                      "{t.text}" #{j}
                    </span>
                    <span className="tabular-data font-semibold text-[#c2410c] dark:text-[#d97706]">
                      {isFuture ? 'Masked (-∞)' : `${pct}% (${w.toFixed(3)})`}
                    </span>
                  </div>

                  <div className="w-full bg-[#f0ebe1] dark:bg-[#1f2127] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-200 ${
                        isFuture
                          ? 'bg-transparent'
                          : w > 0.4
                          ? 'bg-[#c2410c] dark:bg-[#d97706]'
                          : 'bg-amber-400 dark:bg-amber-600'
                      }`}
                      style={{ width: isFuture ? '0%' : `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Context Aggregated Output Vector */}
          <div className="pt-3 border-t border-[#ece7dc] dark:border-[#26282f] space-y-1.5 text-xs font-mono">
            <span className="text-[11px] font-semibold text-[#78716c] dark:text-[#9ca3af] block">
              Context Vector z_{'{' + trackedTokenIdx + '}'} = Σ α_{'{ij}'} v_j:
            </span>
            <div className="p-2.5 bg-[#faf8f5] dark:bg-[#0c0d10] rounded border border-[#ded7ca] dark:border-[#282a32] text-[#1c1917] dark:text-[#f3f4f6]">
              [{trackedToken.attendedVector.map((v) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2))).join(', ')}]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
