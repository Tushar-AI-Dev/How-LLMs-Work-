import React, { useState } from 'react';
import { SimulatorForwardPass } from '../../services/simulatorEngine';
import { Crosshair, Compass, Layers, Sliders } from 'lucide-react';

interface Stage2EmbeddingsProps {
  sim: SimulatorForwardPass;
  trackedTokenIdx: number;
  onSelectToken: (idx: number) => void;
}

export const Stage2Embeddings: React.FC<Stage2EmbeddingsProps> = ({
  sim,
  trackedTokenIdx,
  onSelectToken,
}) => {
  const trackedToken = sim.tokenReps[trackedTokenIdx] || sim.tokenReps[0];
  const [selectedDim, setSelectedDim] = useState<number>(0);

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#ece7dc] dark:border-[#26282f]">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            Stage 02 of 07
          </span>
          <h3 className="text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
            Embedding Lookup: Integers to Continuous Vectors
          </h3>
        </div>
        <div className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          Tensor Shape: <strong className="text-[#c2410c] dark:text-[#d97706]">{sim.stage2.shape}</strong>
        </div>
      </div>

      {/* Embedding Matrix Table */}
      <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] font-semibold">
            Sequence Embedding Matrix E = W_e[T] (d_model = {sim.dModel}):
          </span>
          <span className="text-xs font-mono text-[#c2410c] dark:text-[#d97706] flex items-center gap-1">
            <Crosshair className="w-3.5 h-3.5" />
            <span>Tracking Token #{trackedTokenIdx} "{trackedToken?.text}"</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-[#ece7dc] dark:border-[#26282f] text-left text-[#78716c] dark:text-[#9ca3af]">
                <th className="py-2.5 px-3">Pos</th>
                <th className="py-2.5 px-3">Token</th>
                <th className="py-2.5 px-3">ID</th>
                <th className="py-2.5 px-3">Dense Coordinates (d₀ ... d₇)</th>
                <th className="py-2.5 px-3 text-right">Magnitude ||e||</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ece7dc] dark:divide-[#26282f]">
              {sim.tokenReps.map((tok, idx) => {
                const isTracked = trackedTokenIdx === idx;
                const mag = Math.sqrt(tok.embedding.reduce((acc, v) => acc + v * v, 0)).toFixed(2);

                return (
                  <tr
                    key={idx}
                    onClick={() => onSelectToken(idx)}
                    className={`cursor-pointer transition-colors ${
                      isTracked
                        ? 'bg-[#f4efe6] dark:bg-[#1f2127] font-semibold'
                        : 'hover:bg-[#faf8f5] dark:hover:bg-[#16171b]'
                    }`}
                  >
                    <td className="py-2.5 px-3 text-[#78716c] dark:text-[#9ca3af]">
                      #{idx}
                    </td>
                    <td className="py-2.5 px-3 text-[#1c1917] dark:text-[#f3f4f6]">
                      "{tok.text}" {isTracked && <span className="text-[#c2410c] dark:text-[#d97706]">●</span>}
                    </td>
                    <td className="py-2.5 px-3 text-[#c2410c] dark:text-[#d97706]">
                      {tok.id}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {tok.embedding.map((val, d) => (
                          <span
                            key={d}
                            className={`px-1.5 py-0.5 rounded text-[11px] tabular-data ${
                              val >= 0
                                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800'
                                : 'bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 border border-sky-200 dark:border-sky-800'
                            } ${selectedDim === d ? 'ring-1 ring-[#c2410c] dark:ring-[#d97706]' : ''}`}
                          >
                            {val >= 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#57534e] dark:text-[#9ca3af] tabular-data font-semibold">
                      {mag}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tracked Token Dimension Probe */}
      <div className="p-5 bg-white dark:bg-[#141518] rounded-xl border border-[#e6e0d4] dark:border-[#26282f] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#ece7dc] dark:border-[#26282f]">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#c2410c] dark:text-[#d97706]" />
            <h4 className="font-serif text-base font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              Tracked Token Dimension Inspector: "{trackedToken.text}" (ID {trackedToken.id})
            </h4>
          </div>
          <span className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
            d_model = {sim.dModel}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5 text-xs font-mono">
          {trackedToken.embedding.map((val, dim) => (
            <div
              key={dim}
              onClick={() => setSelectedDim(dim)}
              className={`p-2.5 rounded-lg border text-center cursor-pointer transition-all ${
                selectedDim === dim
                  ? 'bg-[#1c1917] text-white dark:bg-[#f3f4f6] dark:text-[#111215] border-transparent scale-105 shadow-xs font-bold'
                  : 'bg-[#faf8f5] dark:bg-[#181a20] border-[#ded7ca] dark:border-[#282a32] text-[#1c1917] dark:text-[#f3f4f6]'
              }`}
            >
              <div className="text-[10px] text-[#78716c] dark:text-[#9ca3af] mb-1">
                dim {dim}
              </div>
              <div className="text-sm tabular-data font-semibold">
                {val >= 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
