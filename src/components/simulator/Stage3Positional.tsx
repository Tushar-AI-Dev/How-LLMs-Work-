import React from 'react';
import { SimulatorForwardPass } from '../../services/simulatorEngine';
import { Crosshair, Waves, Plus, Layers } from 'lucide-react';

interface Stage3PositionalProps {
  sim: SimulatorForwardPass;
  trackedTokenIdx: number;
  onSelectToken: (idx: number) => void;
}

export const Stage3Positional: React.FC<Stage3PositionalProps> = ({
  sim,
  trackedTokenIdx,
  onSelectToken,
}) => {
  const trackedToken = sim.tokenReps[trackedTokenIdx] || sim.tokenReps[0];

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#ece7dc] dark:border-[#26282f]">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            Stage 03 of 07
          </span>
          <h3 className="text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
            Positional Encoding: Sinusoidal Vector Addition
          </h3>
        </div>
        <div className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          Tensor Shape: <strong className="text-[#c2410c] dark:text-[#d97706]">{sim.stage3.shape}</strong>
        </div>
      </div>

      {/* Vector Arithmetic Showcase for Tracked Token */}
      <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#ece7dc] dark:border-[#22242b]">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#c2410c] dark:text-[#d97706]" />
            <h4 className="font-serif text-base font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              Vector Summation Probe for Token #{trackedTokenIdx} ("{trackedToken.text}"): x₀ = e + P
            </h4>
          </div>
          <span className="text-xs font-mono text-[#c2410c] dark:text-[#d97706] font-bold">
            Pos #{trackedTokenIdx}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          {/* Vector 1: Token Embedding e */}
          <div className="p-4 bg-[#faf8f5] dark:bg-[#0c0d10] rounded-lg border border-[#ded7ca] dark:border-[#282a32] space-y-2">
            <span className="text-[11px] text-[#78716c] dark:text-[#9ca3af] block uppercase tracking-wider font-semibold">
              1. Semantic Embedding e
            </span>
            <div className="flex flex-wrap gap-1">
              {trackedToken.embedding.map((v, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 rounded text-[11px] bg-white dark:bg-[#181a20] border border-[#ded7ca] dark:border-[#282a32] tabular-data"
                >
                  {v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2)}
                </span>
              ))}
            </div>
            <span className="text-[10px] text-[#78716c] block">
              Static word meaning from lookup table
            </span>
          </div>

          {/* Vector 2: Positional Encoding P */}
          <div className="p-4 bg-[#faf8f5] dark:bg-[#0c0d10] rounded-lg border border-amber-300 dark:border-amber-800 space-y-2">
            <span className="text-[11px] text-amber-900 dark:text-amber-200 block uppercase tracking-wider font-semibold">
              2. Positional Vector P (pos = {trackedTokenIdx})
            </span>
            <div className="flex flex-wrap gap-1">
              {trackedToken.positional.map((v, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 rounded text-[11px] bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 border border-amber-200 dark:border-amber-800 tabular-data font-semibold"
                >
                  {v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2)}
                </span>
              ))}
            </div>
            <span className="text-[10px] text-amber-700 dark:text-amber-400 block">
              Calculated via sin/cos harmonics
            </span>
          </div>

          {/* Vector 3: Combined Vector x_0 */}
          <div className="p-4 bg-[#faf8f5] dark:bg-[#0c0d10] rounded-lg border border-[#c2410c] dark:border-[#d97706] space-y-2">
            <span className="text-[11px] text-[#c2410c] dark:text-[#d97706] block uppercase tracking-wider font-bold">
              3. Input Representation x₀ = e + P
            </span>
            <div className="flex flex-wrap gap-1">
              {trackedToken.inputVector.map((v, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 rounded text-[11px] bg-[#c2410c]/10 dark:bg-[#d97706]/10 text-[#c2410c] dark:text-[#d97706] border border-[#c2410c]/30 dark:border-[#d97706]/30 tabular-data font-bold"
                >
                  {v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2)}
                </span>
              ))}
            </div>
            <span className="text-[10px] text-[#c2410c] dark:text-[#d97706] block">
              Order-aware representation entering layers
            </span>
          </div>
        </div>
      </div>

      {/* Sinusoidal Heatmap Matrix */}
      <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-[#c2410c] dark:text-[#d97706]" />
            <h4 className="font-serif text-base font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              Sinusoidal Positional Encoding Heatmap P [{sim.seqLen} × {sim.dModel}]
            </h4>
          </div>
          <span className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
            Values oscillate in range [-1.0, +1.0]
          </span>
        </div>

        <div className="overflow-x-auto p-4 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#ded7ca] dark:border-[#282a32] rounded-lg">
          <div className="min-w-[400px]">
            {/* Header: Dimension pairs */}
            <div className="flex items-center mb-1 text-[10px] font-mono text-[#78716c] dark:text-[#9ca3af]">
              <div className="w-20 shrink-0 font-semibold">Position</div>
              {Array.from({ length: sim.dModel }).map((_, d) => (
                <div key={d} className="flex-1 text-center truncate">
                  {d % 2 === 0 ? `sin(d${d})` : `cos(d${d})`}
                </div>
              ))}
            </div>

            {/* Matrix Rows */}
            {sim.stage3.peMatrix.map((row, pos) => {
              const isTracked = trackedTokenIdx === pos;
              const tokenLabel = sim.tokens[pos]?.text || `pos_${pos}`;

              return (
                <div
                  key={pos}
                  onClick={() => onSelectToken(pos)}
                  className={`flex items-center gap-1 py-1 px-1 rounded cursor-pointer transition-colors ${
                    isTracked
                      ? 'bg-[#e2dbce] dark:bg-[#26282f] ring-1 ring-[#c2410c] dark:ring-[#d97706]'
                      : 'hover:bg-[#f0ebe1] dark:hover:bg-[#181a20]'
                  }`}
                >
                  <div className="w-20 shrink-0 font-mono text-xs font-semibold text-[#1c1917] dark:text-[#f3f4f6] truncate">
                    #{pos} "{tokenLabel}"
                  </div>

                  {row.map((val, dim) => {
                    const isPositive = val >= 0;
                    return (
                      <div
                        key={dim}
                        title={`Pos: ${pos}, Dim: ${dim}, Value: ${val}`}
                        className={`flex-1 h-7 rounded-xs flex items-center justify-center text-[10px] font-mono tabular-data font-semibold ${
                          isPositive
                            ? 'bg-amber-500 text-stone-900'
                            : 'bg-sky-500 text-white'
                        }`}
                        style={{ opacity: Math.max(0.3, Math.abs(val)) }}
                      >
                        {val.toFixed(1)}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
