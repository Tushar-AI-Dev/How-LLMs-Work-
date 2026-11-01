import React, { useState, useMemo } from 'react';
import { computeSinusoidalMatrix } from '../../services/positionalEncodingService';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Sliders, HelpCircle, Info } from 'lucide-react';

export const SinusoidalHeatmapExplorer: React.FC = () => {
  const [seqLen, setSeqLen] = useState<number>(12);
  const [dModel, setDModel] = useState<number>(16);
  const [inspectedCell, setInspectedCell] = useState<{ pos: number; dim: number; val: number } | null>({
    pos: 0,
    dim: 0,
    val: 0,
  });

  // Calculate actual mathematical sinusoidal matrix
  const matrix = useMemo(() => {
    return computeSinusoidalMatrix(seqLen, dModel);
  }, [seqLen, dModel]);

  // Color mapping: -1.0 (sky blue) to 0 (neutral) to +1.0 (warm amber/terracotta)
  const getCellBgColor = (val: number) => {
    if (val >= 0) {
      // Warm amber: alpha based on magnitude
      const alpha = Math.min(1, Math.max(0.08, val));
      return `rgba(217, 119, 6, ${alpha})`;
    } else {
      // Cool sky: alpha based on magnitude
      const alpha = Math.min(1, Math.max(0.08, Math.abs(val)));
      return `rgba(2, 132, 199, ${alpha})`;
    }
  };

  const getCellTextColor = (val: number) => {
    if (Math.abs(val) > 0.6) return '#ffffff';
    return 'currentColor';
  };

  const activePos = inspectedCell ? inspectedCell.pos : 0;
  const activeDim = inspectedCell ? inspectedCell.dim : 0;
  const activeVal = matrix[activePos]?.[activeDim] ?? 0;
  const isEvenDim = activeDim % 2 === 0;
  const denominator = Math.pow(10000, (2 * Math.floor(activeDim / 2)) / dModel);

  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-10 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ece7dc] dark:border-[#22242b] mb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            Interactive Feature · Section 04
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
            Sinusoidal Positional Encoding Heatmap Explorer
          </h3>
        </div>

        <div className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          Vaswani et al. (2017) Exact Formulation
        </div>
      </div>

      {/* Equations Card */}
      <div className="p-4 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-lg mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="text-center p-3 bg-white dark:bg-[#141518] rounded border border-[#ded7ca] dark:border-[#282a32]">
          <span className="text-[10px] font-mono uppercase text-[#78716c] block mb-1">
            Even Indices (2i): Sine Wave
          </span>
          <div className="text-xs sm:text-sm text-[#1c1917] dark:text-[#f3f4f6]">
            <LatexRenderer math="\text{PE}(pos, 2i) = \sin\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)" />
          </div>
        </div>

        <div className="text-center p-3 bg-white dark:bg-[#141518] rounded border border-[#ded7ca] dark:border-[#282a32]">
          <span className="text-[10px] font-mono uppercase text-[#78716c] block mb-1">
            Odd Indices (2i+1): Cosine Wave
          </span>
          <div className="text-xs sm:text-sm text-[#1c1917] dark:text-[#f3f4f6]">
            <LatexRenderer math="\text{PE}(pos, 2i+1) = \cos\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)" />
          </div>
        </div>
      </div>

      {/* Sliders Control Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 p-4 bg-[#faf8f5] dark:bg-[#0e0f13] rounded-lg border border-[#ded7ca] dark:border-[#282a32]">
        <div>
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-[#57534e] dark:text-[#9ca3af]">Sequence Length (L):</span>
            <span className="font-bold text-[#c2410c] dark:text-[#d97706]">{seqLen} positions</span>
          </div>
          <input
            type="range"
            min="6"
            max="24"
            step="2"
            value={seqLen}
            onChange={(e) => setSeqLen(Number(e.target.value))}
            className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-[#78716c] mt-1">
            <span>6 pos</span>
            <span>12 pos</span>
            <span>24 pos</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-[#57534e] dark:text-[#9ca3af]">Model Dimension (d_model):</span>
            <span className="font-bold text-[#c2410c] dark:text-[#d97706]">{dModel} dims</span>
          </div>
          <input
            type="range"
            min="8"
            max="32"
            step="8"
            value={dModel}
            onChange={(e) => setDModel(Number(e.target.value))}
            className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-[#78716c] mt-1">
            <span>8 dims</span>
            <span>16 dims</span>
            <span>32 dims</span>
          </div>
        </div>
      </div>

      {/* Dynamic Mathematical Heatmap Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-[#78716c] dark:text-[#9ca3af] px-1">
          <span>Heatmap: Rows = Sequence Position (pos), Columns = Dimension (i)</span>
          <span className="hidden sm:inline">Hover cell to inspect formula calculation</span>
        </div>

        <div className="border border-[#ded7ca] dark:border-[#282a32] rounded-lg overflow-x-auto bg-[#faf8f5] dark:bg-[#0a0b0e] p-3">
          <div className="min-w-[500px]">
            {/* Column Headers (Dimension Index) */}
            <div className="flex items-center gap-1 mb-1.5 text-[10px] font-mono text-[#78716c] dark:text-[#9ca3af]">
              <span className="w-12 shrink-0 text-right pr-2">Pos \ Dim</span>
              {Array.from({ length: dModel }).map((_, i) => (
                <span key={i} className="flex-1 text-center truncate">
                  {i}
                </span>
              ))}
            </div>

            {/* Rows (Positions) */}
            {matrix.map((row, posIdx) => (
              <div key={posIdx} className="flex items-center gap-1 mb-1">
                <span className="w-12 shrink-0 text-right pr-2 text-[10px] font-mono font-semibold text-[#78716c]">
                  P{posIdx}
                </span>

                {row.map((val, dimIdx) => {
                  const isSelected =
                    inspectedCell?.pos === posIdx && inspectedCell?.dim === dimIdx;

                  return (
                    <div
                      key={dimIdx}
                      onMouseEnter={() =>
                        setInspectedCell({ pos: posIdx, dim: dimIdx, val })
                      }
                      onClick={() =>
                        setInspectedCell({ pos: posIdx, dim: dimIdx, val })
                      }
                      style={{
                        backgroundColor: getCellBgColor(val),
                        color: getCellTextColor(val),
                      }}
                      className={`
                        flex-1 h-7 rounded text-[10px] font-mono font-semibold flex items-center justify-center cursor-pointer transition-transform
                        ${
                          isSelected
                            ? 'ring-2 ring-[#c2410c] dark:ring-[#d97706] scale-110 z-10 shadow-xs'
                            : 'hover:scale-105'
                        }
                      `}
                      title={`pos: ${posIdx}, dim: ${dimIdx}, value: ${val}`}
                    >
                      {val >= 0 ? `+${val.toFixed(1)}` : val.toFixed(1)}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap Spectrum Legend */}
        <div className="flex items-center justify-between text-[11px] font-mono text-[#78716c] dark:text-[#9ca3af] pt-2 px-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-[#0284c7]" />
            <span>-1.0 (Min / Negative)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-[#f4efe6] dark:bg-[#1a1c22] border border-[#ded7ca]" />
            <span>0.0 (Zero Crossing)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-[#d97706]" />
            <span>+1.0 (Max / Positive)</span>
          </div>
        </div>
      </div>

      {/* Inspected Cell Breakdown Box */}
      {inspectedCell && (
        <div className="mt-6 p-4 bg-white dark:bg-[#141518] rounded-lg border border-[#ded7ca] dark:border-[#282a32] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-[#c2410c] dark:text-[#d97706]">
              Inspected Coordinate: PE(pos = {activePos}, dim = {activeDim})
            </span>
            <span className="text-base font-bold tabular-data text-[#1c1917] dark:text-[#f3f4f6]">
              Value = {activeVal >= 0 ? `+${activeVal.toFixed(4)}` : activeVal.toFixed(4)}
            </span>
          </div>

          <div className="p-3 bg-[#faf8f5] dark:bg-[#0c0d10] rounded font-mono text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            Formula Applied: <code>{isEvenDim ? 'sin' : 'cos'}({activePos} / {denominator.toFixed(2)}) = {activeVal >= 0 ? `+${activeVal.toFixed(4)}` : activeVal.toFixed(4)}</code>
            <div className="mt-1 text-[11px] text-[#78716c]">
              {activeDim < dModel / 3
                ? "Low Dimension: High frequency oscillation. Changes rapidly with each position step."
                : activeDim > (2 * dModel) / 3
                ? "High Dimension: Low frequency oscillation. Wavelength spans hundreds of tokens, maintaining long-range drift."
                : "Mid Dimension: Intermediate harmonic scale."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
