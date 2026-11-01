import React, { useState, useMemo } from 'react';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Sliders, Activity, Scale, Check, Info } from 'lucide-react';
import {
  layerNorm,
  rmsNorm,
  computeVectorStats,
  PRESET_TRANSFORMER_VECTORS,
} from '../../services/transformerService';

export const LayerNormLaboratory: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<number>(1); // default to high variance preset
  const [normMode, setNormMode] = useState<'layernorm' | 'rmsnorm'>('layernorm');
  const [gamma, setGamma] = useState<number>(1.2);
  const [beta, setBeta] = useState<number>(0.2);
  const [customVector, setCustomVector] = useState<number[]>([4.85, -2.91, 0.45, -6.12]);

  const activeVector = customVector;

  const vectorStats = useMemo(() => computeVectorStats(activeVector), [activeVector]);

  const gammaArr = useMemo(() => new Array(activeVector.length).fill(gamma), [activeVector.length, gamma]);
  const betaArr = useMemo(() => new Array(activeVector.length).fill(beta), [activeVector.length, beta]);

  const lnResult = useMemo(
    () => layerNorm(activeVector, gammaArr, betaArr),
    [activeVector, gammaArr, betaArr]
  );

  const rmsResult = useMemo(
    () => rmsNorm(activeVector, gammaArr),
    [activeVector, gammaArr]
  );

  const handlePresetSelect = (idx: number) => {
    setSelectedPreset(idx);
    setCustomVector([...PRESET_TRANSFORMER_VECTORS[idx].vector]);
  };

  const handleSliderChange = (dimIdx: number, val: number) => {
    const updated = [...customVector];
    updated[dimIdx] = val;
    setCustomVector(updated);
  };

  return (
    <div className="bg-white dark:bg-[#131417] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#ece7dc] dark:border-[#22242b] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            <Scale className="w-4 h-4" />
            <span>Interactive Mathematics Laboratory</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            Layer Normalization vs RMSNorm
          </h4>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex rounded-lg p-1 bg-[#faf8f5] dark:bg-[#1a1c22] border border-[#ece7dc] dark:border-[#282a32]">
          <button
            onClick={() => setNormMode('layernorm')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
              normMode === 'layernorm'
                ? 'bg-[#1c1917] text-white dark:bg-white dark:text-[#1c1917] font-semibold shadow-xs'
                : 'text-[#78716c] dark:text-[#9ca3af] hover:text-[#1c1917] dark:hover:text-[#f3f4f6]'
            }`}
          >
            LayerNorm (Standard)
          </button>
          <button
            onClick={() => setNormMode('rmsnorm')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
              normMode === 'rmsnorm'
                ? 'bg-[#1c1917] text-white dark:bg-white dark:text-[#1c1917] font-semibold shadow-xs'
                : 'text-[#78716c] dark:text-[#9ca3af] hover:text-[#1c1917] dark:hover:text-[#f3f4f6]'
            }`}
          >
            RMSNorm (LLaMA / Mistral)
          </button>
        </div>
      </div>

      {/* Formula Display */}
      <div className="my-6 p-4 bg-[#faf8f5] dark:bg-[#181a1f] rounded-lg border border-[#ece7dc] dark:border-[#26282f] text-center">
        {normMode === 'layernorm' ? (
          <div>
            <LatexRenderer
              math="\text{LN}(\mathbf{x}) = \boldsymbol{\gamma} \odot \frac{\mathbf{x} - \mu}{\sqrt{\sigma^2 + \epsilon}} + \boldsymbol{\beta}, \quad \mu = \frac{1}{d}\sum_{i=1}^d x_i, \quad \sigma^2 = \frac{1}{d}\sum_{i=1}^d (x_i - \mu)^2"
              displayMode={true}
            />
            <p className="mt-2 text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
              Standardizes features to zero mean (<LatexRenderer math="\mu = 0" />) and unit variance (<LatexRenderer math="\sigma = 1" />), then applies learnable scale <LatexRenderer math="\boldsymbol{\gamma}" /> and bias <LatexRenderer math="\boldsymbol{\beta}" />.
            </p>
          </div>
        ) : (
          <div>
            <LatexRenderer
              math="\text{RMSNorm}(\mathbf{x}) = \boldsymbol{\gamma} \odot \frac{\mathbf{x}}{\text{RMS}(\mathbf{x})}, \quad \text{RMS}(\mathbf{x}) = \sqrt{\frac{1}{d}\sum_{i=1}^d x_i^2 + \epsilon}"
              displayMode={true}
            />
            <p className="mt-2 text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
              Omits mean subtraction entirely. Scales by the root-mean-square norm alone, saving ~30% computational latency while maintaining identical perplexity.
            </p>
          </div>
        )}
      </div>

      {/* Preset Tokens Selector */}
      <div className="mb-6">
        <label className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-2">
          Select Input Vector Archetype:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESET_TRANSFORMER_VECTORS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetSelect(idx)}
              className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                selectedPreset === idx
                  ? 'border-[#c2410c] dark:border-[#d97706] bg-amber-500/10 text-[#1c1917] dark:text-[#f3f4f6] font-medium'
                  : 'border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#1a1c22] text-[#57534e] dark:text-[#9ca3af]'
              }`}
            >
              <div className="font-mono font-semibold">{p.name.split(' ')[1]}</div>
              <div className="text-[10px] opacity-75 truncate">{p.name.split('(')[1]?.replace(')', '')}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Vector Sliders (Adjust Dimensions Live) */}
      <div className="p-4 bg-[#faf8f5] dark:bg-[#16171b] rounded-xl border border-[#ece7dc] dark:border-[#26282f] mb-6">
        <div className="flex items-center justify-between mb-3 text-xs font-mono">
          <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
            Interactive Dimension Sliders (Input Vector x)
          </span>
          <span className="text-[#78716c] dark:text-[#9ca3af]">d_model = 4</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {activeVector.map((val, idx) => (
            <div key={idx} className="space-y-1.5 bg-white dark:bg-[#1f2127] p-3 rounded-lg border border-[#ece7dc] dark:border-[#282a32]">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#78716c] dark:text-[#9ca3af]">x[{idx}]</span>
                <span className="font-semibold">{val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={-8.0}
                max={8.0}
                step={0.1}
                value={val}
                onChange={(e) => handleSliderChange(idx, Number(e.target.value))}
                className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Affine Parameters Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl border border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#181a1f]">
          <div className="flex justify-between items-center text-xs font-mono mb-2">
            <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
              Gain Scale Parameter (<LatexRenderer math="\gamma" />)
            </span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">{gamma.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={3.0}
            step={0.05}
            value={gamma}
            onChange={(e) => setGamma(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <span className="text-[10px] text-[#78716c] dark:text-[#9ca3af] font-mono block mt-1">
            Re-scales feature amplitude dynamically during training.
          </span>
        </div>

        {normMode === 'layernorm' ? (
          <div className="p-4 rounded-xl border border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#181a1f]">
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
                Bias Shift Parameter (<LatexRenderer math="\beta" />)
              </span>
              <span className="text-sky-600 dark:text-sky-400 font-bold">
                {beta > 0 ? `+${beta.toFixed(2)}` : beta.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={-2.0}
              max={2.0}
              step={0.05}
              value={beta}
              onChange={(e) => setBeta(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <span className="text-[10px] text-[#78716c] dark:text-[#9ca3af] font-mono block mt-1">
              Shifts baseline activation centering. (Omitted in RMSNorm).
            </span>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5]/50 dark:bg-[#181a1f]/50 flex items-center justify-center text-center p-3">
            <span className="text-xs font-mono text-[#a8a29e] dark:text-[#6b7280]">
              Bias parameter <LatexRenderer math="\beta" /> is removed in RMSNorm for parameter and memory efficiency.
            </span>
          </div>
        )}
      </div>

      {/* Step-by-Step Computational Table */}
      <div className="overflow-x-auto rounded-xl border border-[#ece7dc] dark:border-[#26282f]">
        <table className="w-full text-xs font-mono text-left">
          <thead className="bg-[#f4efe6] dark:bg-[#1a1c22] border-b border-[#ece7dc] dark:border-[#26282f] text-[#57534e] dark:text-[#9ca3af]">
            <tr>
              <th className="p-3">Component</th>
              <th className="p-3 text-center">dim_0</th>
              <th className="p-3 text-center">dim_1</th>
              <th className="p-3 text-center">dim_2</th>
              <th className="p-3 text-center">dim_3</th>
              <th className="p-3 text-right">Summary Metric</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ece7dc] dark:divide-[#26282f]">
            {/* Raw Input */}
            <tr className="hover:bg-amber-500/5 transition-colors">
              <td className="p-3 font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
                1. Raw Input Vector (x)
              </td>
              {activeVector.map((v, i) => (
                <td key={i} className="p-3 text-center font-medium">
                  {v.toFixed(2)}
                </td>
              ))}
              <td className="p-3 text-right text-[#78716c] dark:text-[#9ca3af]">
                Mean: {vectorStats.mean.toFixed(2)} | Var: {vectorStats.variance.toFixed(2)}
              </td>
            </tr>

            {normMode === 'layernorm' && (
              <>
                {/* Zero-Centered */}
                <tr className="hover:bg-amber-500/5 transition-colors bg-[#faf8f5]/50 dark:bg-[#16171b]/50">
                  <td className="p-3 text-[#57534e] dark:text-[#9ca3af]">
                    2. Zero-Centered (x - μ)
                  </td>
                  {lnResult.centered.map((v, i) => (
                    <td key={i} className="p-3 text-center text-sky-700 dark:text-sky-400">
                      {v.toFixed(2)}
                    </td>
                  ))}
                  <td className="p-3 text-right text-sky-700 dark:text-sky-400">
                    Mean = 0.00 (Centered)
                  </td>
                </tr>

                {/* Standardized */}
                <tr className="hover:bg-amber-500/5 transition-colors">
                  <td className="p-3 text-[#57534e] dark:text-[#9ca3af]">
                    3. Standardized ((x - μ) / σ)
                  </td>
                  {lnResult.standardized.map((v, i) => (
                    <td key={i} className="p-3 text-center font-medium">
                      {v.toFixed(2)}
                    </td>
                  ))}
                  <td className="p-3 text-right text-[#78716c] dark:text-[#9ca3af]">
                    Variance = 1.00 (Unit Var)
                  </td>
                </tr>
              </>
            )}

            {normMode === 'rmsnorm' && (
              <tr className="hover:bg-amber-500/5 transition-colors bg-[#faf8f5]/50 dark:bg-[#16171b]/50">
                <td className="p-3 text-[#57534e] dark:text-[#9ca3af]">
                  2. Scaled by RMS (x / RMS(x))
                </td>
                {rmsResult.output.map((v, i) => (
                  <td key={i} className="p-3 text-center font-medium text-amber-700 dark:text-amber-400">
                    {(v / gamma).toFixed(2)}
                  </td>
                ))}
                <td className="p-3 text-right text-amber-700 dark:text-amber-400">
                  RMS = {rmsResult.rms.toFixed(2)}
                </td>
              </tr>
            )}

            {/* Final Normalized Output */}
            <tr className="bg-emerald-500/10 font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
              <td className="p-3 text-emerald-800 dark:text-emerald-300">
                Final Output Vector (y)
              </td>
              {(normMode === 'layernorm' ? lnResult.output : rmsResult.output).map((v, i) => (
                <td key={i} className="p-3 text-center text-emerald-700 dark:text-emerald-300">
                  {v.toFixed(2)}
                </td>
              ))}
              <td className="p-3 text-right text-emerald-700 dark:text-emerald-300">
                Bounded & Stabilized
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Engineering Takeaway */}
      <div className="mt-6 p-4 rounded-xl border border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#181a1f] flex items-start gap-3">
        <Info className="w-5 h-5 text-[#c2410c] dark:text-[#d97706] shrink-0 mt-0.5" />
        <div className="text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6] block mb-0.5">
            Why Layer Normalization is Preferred Over Batch Normalization in Transformers:
          </span>
          Batch Normalization computes statistics across different sequence samples in a mini-batch, creating a hard dependency on batch size and failing on variable sentence lengths or single-token streaming generation. Layer Normalization operates strictly across the hidden dimension of each token independently, making inference perfectly deterministic whether generating 1 token or 1,000,000 tokens in parallel.
        </div>
      </div>
    </div>
  );
};
