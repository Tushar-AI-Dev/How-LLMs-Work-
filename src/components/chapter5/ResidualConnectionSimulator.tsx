import React, { useState, useMemo } from 'react';
import { LatexRenderer } from '../ui/LatexRenderer';
import { GitFork, ToggleLeft, ToggleRight, Sparkles, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import {
  residualAdd,
  cosineSimilarity,
  computeVectorStats,
  PRESET_TRANSFORMER_VECTORS,
} from '../../services/transformerService';

export const ResidualConnectionSimulator: React.FC = () => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [useResidual, setUseResidual] = useState<boolean>(true);
  const [sublayerIntensity, setSublayerIntensity] = useState<number>(0.8);
  const [sublayerType, setSublayerType] = useState<'refinement' | 'orthogonal' | 'adversarial'>('refinement');

  const baseVector = PRESET_TRANSFORMER_VECTORS[selectedPresetIndex].vector;

  // Generate sublayer transformation F(x) based on mode and intensity
  const sublayerOutput = useMemo(() => {
    switch (sublayerType) {
      case 'refinement':
        // Small semantic tweak: adds contextual nuances
        return baseVector.map((v, i) => (i % 2 === 0 ? 0.35 : -0.25) * sublayerIntensity);
      case 'orthogonal':
        // Orthogonal subspace rotation
        return [-baseVector[1], baseVector[0], -baseVector[3], baseVector[2]].map(
          (v) => v * 0.7 * sublayerIntensity
        );
      case 'adversarial':
        // High magnitude conflicting perturbation
        return baseVector.map((v) => -v * 1.2 * sublayerIntensity);
    }
  }, [baseVector, sublayerType, sublayerIntensity]);

  // Resulting representation
  const finalVector = useMemo(() => {
    if (useResidual) {
      return residualAdd(baseVector, sublayerOutput);
    } else {
      return [...sublayerOutput];
    }
  }, [baseVector, sublayerOutput, useResidual]);

  const similarityToBase = useMemo(() => {
    return cosineSimilarity(baseVector, finalVector);
  }, [baseVector, finalVector]);

  const statsBase = useMemo(() => computeVectorStats(baseVector), [baseVector]);
  const statsFinal = useMemo(() => computeVectorStats(finalVector), [finalVector]);

  return (
    <div className="bg-white dark:bg-[#131417] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#ece7dc] dark:border-[#22242b] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            <GitFork className="w-4 h-4" />
            <span>Interactive Simulator</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            The Residual Connection (Identity Stream)
          </h4>
        </div>

        {/* Residual Toggle Switch */}
        <button
          onClick={() => setUseResidual(!useResidual)}
          className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer ${
            useResidual
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 shadow-xs'
              : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200'
          }`}
        >
          {useResidual ? (
            <>
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Residual Connection: ENABLED</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span>Residual Connection: DISABLED</span>
            </>
          )}
        </button>
      </div>

      {/* Equation Banner */}
      <div className="my-6 p-4 bg-[#faf8f5] dark:bg-[#181a1f] rounded-lg border border-[#ece7dc] dark:border-[#26282f]">
        <div className="text-center">
          <LatexRenderer
            math={
              useResidual
                ? '\\mathbf{y} = \\mathbf{x} + \\mathcal{F}(\\mathbf{x}) \\implies \\frac{\\partial \\mathbf{y}}{\\partial \\mathbf{x}} = \\mathbf{I} + \\frac{\\partial \\mathcal{F}(\\mathbf{x})}{\\partial \\mathbf{x}}'
                : '\\mathbf{y} = \\mathcal{F}(\\mathbf{x}) \\implies \\frac{\\partial \\mathbf{y}}{\\partial \\mathbf{x}} = \\frac{\\partial \\mathcal{F}(\\mathbf{x})}{\\partial \\mathbf{x}}'
            }
            displayMode={true}
          />
        </div>
        <p className="text-center text-xs text-[#78716c] dark:text-[#9ca3af] mt-2 font-mono">
          {useResidual
            ? 'The identity matrix I acts as an unattenuated gradient highway directly back to earlier layers.'
            : 'Without identity addition, gradients attenuate multiplicatively: (dF_L/dx)...(dF_1/dx) -> vanishing gradient.'}
        </p>
      </div>

      {/* Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Token Vector Presets */}
        <div>
          <label className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-1.5">
            Input Token State x
          </label>
          <select
            value={selectedPresetIndex}
            onChange={(e) => setSelectedPresetIndex(Number(e.target.value))}
            className="w-full text-xs font-mono p-2 bg-[#faf8f5] dark:bg-[#1a1c22] border border-[#ece7dc] dark:border-[#282a32] rounded-lg text-[#1c1917] dark:text-[#f3f4f6]"
          >
            {PRESET_TRANSFORMER_VECTORS.map((preset, idx) => (
              <option key={idx} value={idx}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sublayer Transformation Mode */}
        <div>
          <label className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-1.5">
            Sublayer Function F(x) Mode
          </label>
          <div className="grid grid-cols-3 gap-1">
            {(['refinement', 'orthogonal', 'adversarial'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSublayerType(mode)}
                className={`text-[11px] font-mono py-2 px-1 rounded border transition-colors capitalize cursor-pointer ${
                  sublayerType === mode
                    ? 'bg-[#1c1917] text-white dark:bg-white dark:text-[#1c1917] border-transparent font-medium'
                    : 'bg-[#faf8f5] dark:bg-[#1a1c22] border-[#ece7dc] dark:border-[#282a32] text-[#57534e] dark:text-[#9ca3af]'
                }`}
              >
                {mode === 'refinement' ? 'Nuance' : mode === 'orthogonal' ? 'Rotate' : 'Perturb'}
              </button>
            ))}
          </div>
        </div>

        {/* Sublayer Transformation Magnitude */}
        <div>
          <div className="flex justify-between items-center mb-1.5 text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af]">
            <span>Transformation Weight</span>
            <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
              {sublayerIntensity.toFixed(2)}x
            </span>
          </div>
          <input
            type="range"
            min={0.1}
            max={2.0}
            step={0.1}
            value={sublayerIntensity}
            onChange={(e) => setSublayerIntensity(Number(e.target.value))}
            className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
          />
        </div>
      </div>

      {/* Visual Vector Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Input Vector x */}
        <div className="p-4 rounded-xl border border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#16171b] space-y-3">
          <div className="flex items-center justify-between border-b border-[#ece7dc] dark:border-[#26282f] pb-2">
            <span className="text-xs font-mono font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
              Input Vector x
            </span>
            <span className="text-[10px] font-mono text-[#78716c] dark:text-[#9ca3af]">
              ||x|| = {statsBase.l2Norm.toFixed(2)}
            </span>
          </div>
          <div className="space-y-2">
            {baseVector.map((val, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-[#78716c] dark:text-[#9ca3af]">dim_{idx}</span>
                  <span className="font-medium">{val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}</span>
                </div>
                <div className="w-full bg-[#e6e0d4] dark:bg-[#282a32] h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-sky-500 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (Math.abs(val) / 6) * 100)}%`,
                      marginLeft: val < 0 ? '0' : 'auto',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sublayer Transformation F(x) */}
        <div className="p-4 rounded-xl border border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#16171b] space-y-3">
          <div className="flex items-center justify-between border-b border-[#ece7dc] dark:border-[#26282f] pb-2">
            <span className="text-xs font-mono font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
              Sublayer Delta F(x)
            </span>
            <span className="text-[10px] font-mono text-[#78716c] dark:text-[#9ca3af]">
              Computed Residual
            </span>
          </div>
          <div className="space-y-2">
            {sublayerOutput.map((val, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-[#78716c] dark:text-[#9ca3af]">dim_{idx}</span>
                  <span className="font-medium text-amber-600 dark:text-amber-400">
                    {val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-[#e6e0d4] dark:bg-[#282a32] h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (Math.abs(val) / 6) * 100)}%`,
                      marginLeft: val < 0 ? '0' : 'auto',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final Representation y */}
        <div
          className={`p-4 rounded-xl border space-y-3 transition-colors ${
            useResidual
              ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20'
              : 'border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20'
          }`}
        >
          <div className="flex items-center justify-between border-b border-inherit pb-2">
            <span className="text-xs font-mono font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
              {useResidual ? 'Output y = x + F(x)' : 'Output y = F(x)'}
            </span>
            <span className="text-[10px] font-mono text-[#78716c] dark:text-[#9ca3af]">
              ||y|| = {statsFinal.l2Norm.toFixed(2)}
            </span>
          </div>
          <div className="space-y-2">
            {finalVector.map((val, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-[#78716c] dark:text-[#9ca3af]">dim_{idx}</span>
                  <span className="font-medium text-emerald-700 dark:text-emerald-300">
                    {val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-[#e6e0d4] dark:bg-[#282a32] h-2 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      useResidual ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                    style={{
                      width: `${Math.min(100, (Math.abs(val) / 6) * 100)}%`,
                      marginLeft: val < 0 ? '0' : 'auto',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Semantic Fidelity Meter */}
      <div className="mt-6 p-4 rounded-xl border border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#181a1f] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block">
            Base Semantic Retention (Cosine Similarity cos(x, y))
          </span>
          <div className="text-2xl font-serif font-bold text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
            {(similarityToBase * 100).toFixed(1)}%
            <span className="text-xs font-mono font-normal ml-2 text-[#78716c] dark:text-[#9ca3af]">
              (similarity = {similarityToBase.toFixed(4)})
            </span>
          </div>
        </div>

        <div className="text-xs text-[#57534e] dark:text-[#9ca3af] max-w-md leading-relaxed">
          {useResidual ? (
            <span className="text-emerald-700 dark:text-emerald-300 font-medium">
              High semantic retention: The base identity is preserved in the residual stream, while F(x) smoothly injects local contextual refinement without destroying earlier learned facts.
            </span>
          ) : (
            <span className="text-red-700 dark:text-red-300 font-medium">
              Representation collapse: Without the identity shortcut, the vector direction is violently overwritten by F(x). Through dozens of stacked layers, all initial semantic signal is erased.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
