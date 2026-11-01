import React, { useState } from 'react';
import {
  layerNorm,
  rmsNorm,
  runFFN,
  residualAdd,
  cosineSimilarity,
  computeVectorStats,
  DEFAULT_FFN_W1,
  DEFAULT_FFN_B1,
  DEFAULT_FFN_W2,
  DEFAULT_FFN_B2,
  PRESET_TRANSFORMER_VECTORS,
} from '../../services/transformerService';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Sliders, Layers, GitCommit, Zap, Info, ShieldCheck } from 'lucide-react';

export const TransformerBlockExperiment: React.FC = () => {
  const [selectedVecIdx, setSelectedVecIdx] = useState<number>(0);
  const [normType, setNormType] = useState<'rmsnorm' | 'layernorm'>('rmsnorm');
  const [actType, setActType] = useState<'gelu' | 'silu' | 'relu'>('silu');
  const [archLayout, setArchLayout] = useState<'pre-norm' | 'post-norm'>('pre-norm');

  const activePreset = PRESET_TRANSFORMER_VECTORS[selectedVecIdx];
  const inputVec = activePreset.vector;

  // Compute Pre-Norm vs Post-Norm mathematical execution
  const normalizeVec = (vec: number[]) =>
    normType === 'rmsnorm' ? rmsNorm(vec).output : layerNorm(vec).output;

  let attnDelta: number[];
  let midResidual: number[];
  let ffnRes: ReturnType<typeof runFFN>;
  let finalOutput: number[];

  if (archLayout === 'pre-norm') {
    // Pre-Norm: x_mid = x + Attn(Norm(x)), x_out = x_mid + FFN(Norm(x_mid))
    const norm1Res = normalizeVec(inputVec);
    attnDelta = [
      Number((norm1Res[1] * 0.4).toFixed(3)),
      Number((-norm1Res[0] * 0.4).toFixed(3)),
      Number((norm1Res[3] * 0.3).toFixed(3)),
      Number((-norm1Res[2] * 0.3).toFixed(3)),
    ];
    midResidual = residualAdd(inputVec, attnDelta);
    const norm2Res = normalizeVec(midResidual);
    ffnRes = runFFN(
      norm2Res,
      DEFAULT_FFN_W1,
      DEFAULT_FFN_B1,
      DEFAULT_FFN_W2,
      DEFAULT_FFN_B2,
      actType
    );
    finalOutput = residualAdd(midResidual, ffnRes.output);
  } else {
    // Post-Norm: x_mid = Norm(x + Attn(x)), x_out = Norm(x_mid + FFN(x_mid))
    attnDelta = [
      Number((inputVec[1] * 0.4).toFixed(3)),
      Number((-inputVec[0] * 0.4).toFixed(3)),
      Number((inputVec[3] * 0.3).toFixed(3)),
      Number((-inputVec[2] * 0.3).toFixed(3)),
    ];
    midResidual = normalizeVec(residualAdd(inputVec, attnDelta));
    ffnRes = runFFN(
      midResidual,
      DEFAULT_FFN_W1,
      DEFAULT_FFN_B1,
      DEFAULT_FFN_W2,
      DEFAULT_FFN_B2,
      actType
    );
    finalOutput = normalizeVec(residualAdd(midResidual, ffnRes.output));
  }

  // Stats
  const inStats = computeVectorStats(inputVec);
  const outStats = computeVectorStats(finalOutput);
  const semanticFidelity = cosineSimilarity(inputVec, finalOutput);

  return (
    <div className="space-y-8">
      {/* Experiment Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#ece7dc] dark:border-[#26282f]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            <span>Experiment 05</span>
            <span>·</span>
            <span>Sublayer Integration</span>
          </div>
          <h2 className="text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            Complete Transformer Block Architecture
          </h2>
        </div>

        {/* Preset Vector Picker */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">Input Vector:</span>
          <select
            value={selectedVecIdx}
            onChange={(e) => setSelectedVecIdx(Number(e.target.value))}
            className="px-2.5 py-1 text-xs font-mono bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#ded7ca] dark:border-[#282a32] rounded-lg text-[#1c1917] dark:text-[#f3f4f6] cursor-pointer"
          >
            {PRESET_TRANSFORMER_VECTORS.map((v, i) => (
              <option key={i} value={i}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Architectural Configuration Knobs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-white dark:bg-[#141518] rounded-xl border border-[#e6e0d4] dark:border-[#26282f] text-xs font-mono">
        {/* Knob 1: Normalization */}
        <div>
          <span className="text-[#78716c] dark:text-[#9ca3af] block text-[11px] uppercase tracking-wider mb-2">
            1. Normalization Algorithm
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setNormType('rmsnorm')}
              className={`flex-1 py-1.5 px-2 rounded border text-center transition-colors cursor-pointer ${
                normType === 'rmsnorm'
                  ? 'bg-[#1c1917] text-white dark:bg-[#f3f4f6] dark:text-[#111215] border-transparent font-semibold'
                  : 'bg-[#faf8f5] dark:bg-[#1a1c22] text-[#57534e] dark:text-[#9ca3af] border-[#ded7ca] dark:border-[#282a32]'
              }`}
            >
              RMSNorm (LLaMA)
            </button>
            <button
              onClick={() => setNormType('layernorm')}
              className={`flex-1 py-1.5 px-2 rounded border text-center transition-colors cursor-pointer ${
                normType === 'layernorm'
                  ? 'bg-[#1c1917] text-white dark:bg-[#f3f4f6] dark:text-[#111215] border-transparent font-semibold'
                  : 'bg-[#faf8f5] dark:bg-[#1a1c22] text-[#57534e] dark:text-[#9ca3af] border-[#ded7ca] dark:border-[#282a32]'
              }`}
            >
              LayerNorm (GPT)
            </button>
          </div>
        </div>

        {/* Knob 2: FFN Activation */}
        <div>
          <span className="text-[#78716c] dark:text-[#9ca3af] block text-[11px] uppercase tracking-wider mb-2">
            2. FFN Non-Linearity
          </span>
          <div className="flex gap-1.5">
            {(['silu', 'gelu', 'relu'] as const).map((fn) => (
              <button
                key={fn}
                onClick={() => setActType(fn)}
                className={`flex-1 py-1.5 px-2 rounded border text-center uppercase transition-colors cursor-pointer ${
                  actType === fn
                    ? 'bg-[#c2410c] text-white dark:bg-[#d97706] border-transparent font-semibold'
                    : 'bg-[#faf8f5] dark:bg-[#1a1c22] text-[#57534e] dark:text-[#9ca3af] border-[#ded7ca] dark:border-[#282a32]'
                }`}
              >
                {fn}
              </button>
            ))}
          </div>
        </div>

        {/* Knob 3: Pre-Norm vs Post-Norm */}
        <div>
          <span className="text-[#78716c] dark:text-[#9ca3af] block text-[11px] uppercase tracking-wider mb-2">
            3. Block Layout Standard
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setArchLayout('pre-norm')}
              className={`flex-1 py-1.5 px-2 rounded border text-center transition-colors cursor-pointer ${
                archLayout === 'pre-norm'
                  ? 'bg-[#1c1917] text-white dark:bg-[#f3f4f6] dark:text-[#111215] border-transparent font-semibold'
                  : 'bg-[#faf8f5] dark:bg-[#1a1c22] text-[#57534e] dark:text-[#9ca3af] border-[#ded7ca] dark:border-[#282a32]'
              }`}
            >
              Pre-LN (Stable)
            </button>
            <button
              onClick={() => setArchLayout('post-norm')}
              className={`flex-1 py-1.5 px-2 rounded border text-center transition-colors cursor-pointer ${
                archLayout === 'post-norm'
                  ? 'bg-[#1c1917] text-white dark:bg-[#f3f4f6] dark:text-[#111215] border-transparent font-semibold'
                  : 'bg-[#faf8f5] dark:bg-[#1a1c22] text-[#57534e] dark:text-[#9ca3af] border-[#ded7ca] dark:border-[#282a32]'
              }`}
            >
              Post-LN (Legacy)
            </button>
          </div>
        </div>
      </div>

      {/* Layer Dataflow Pipeline Diagram */}
      <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-6">
        <h3 className="font-serif text-lg font-medium text-[#1c1917] dark:text-[#f3f4f6]">
          Execution Flow Through Layer Block
        </h3>

        <div className="space-y-4">
          {/* Stage 1: Input x */}
          <div className="p-4 bg-[#faf8f5] dark:bg-[#0c0d10] rounded-lg border border-[#ded7ca] dark:border-[#282a32] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
            <div>
              <span className="text-[11px] text-[#78716c] dark:text-[#9ca3af] block">STAGE 0: Input Residual Stream (x)</span>
              <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
                [{inputVec.map((v) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2))).join(', ')}]
              </span>
            </div>
            <div className="text-[11px] text-[#78716c] dark:text-[#9ca3af]">
              ||x|| = {inStats.l2Norm.toFixed(2)} · σ² = {inStats.variance.toFixed(2)}
            </div>
          </div>

          {/* Sublayer A: Self-Attention Branch */}
          <div className="relative pl-6 border-l-2 border-amber-400 dark:border-amber-600 space-y-3">
            <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-800 text-xs font-mono space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-amber-950 dark:text-amber-200">
                  Sublayer 1: {normType.toUpperCase()} + Multi-Head Self-Attention
                </span>
                <span className="text-[11px] text-[#78716c]">Dynamic Context Routing</span>
              </div>
              <div className="text-[#57534e] dark:text-[#9ca3af]">
                Attention Delta Δx = [{attnDelta.map((v) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2))).join(', ')}]
              </div>
            </div>

            <div className="p-3 bg-[#faf8f5] dark:bg-[#1a1c22] rounded border border-[#ded7ca] dark:border-[#282a32] font-mono text-xs flex justify-between items-center">
              <span className="text-[#78716c] dark:text-[#9ca3af]">
                Residual Accumulator 1: x_mid = x + Δx
              </span>
              <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
                [{midResidual.map((v) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2))).join(', ')}]
              </span>
            </div>
          </div>

          {/* Sublayer B: Feed-Forward Network Branch */}
          <div className="relative pl-6 border-l-2 border-emerald-400 dark:border-emerald-600 space-y-3">
            <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/20 rounded border border-emerald-200 dark:border-emerald-800 text-xs font-mono space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-emerald-950 dark:text-emerald-200">
                  Sublayer 2: {normType.toUpperCase()} + FFN ({actType.toUpperCase()} Non-Linear Projection)
                </span>
                <span className="text-[11px] text-[#78716c]">Associative Memory Bank</span>
              </div>
              <div className="text-[#57534e] dark:text-[#9ca3af]">
                FFN Delta Δx = [{ffnRes.output.map((v) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2))).join(', ')}]
              </div>
            </div>

            <div className="p-3 bg-[#faf8f5] dark:bg-[#1a1c22] rounded border border-[#c2410c]/40 dark:border-[#d97706]/40 font-mono text-xs flex justify-between items-center">
              <span className="font-semibold text-[#c2410c] dark:text-[#d97706]">
                Final Layer Output: x_(l+1) = x_mid + FFN(x_mid)
              </span>
              <span className="font-bold text-[#c2410c] dark:text-[#d97706]">
                [{finalOutput.map((v) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2))).join(', ')}]
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Residual Stream Fidelity & Gradient Health */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
        <div className="p-4 bg-white dark:bg-[#141518] rounded-xl border border-[#e6e0d4] dark:border-[#26282f] space-y-1">
          <span className="text-[#78716c] dark:text-[#9ca3af] block text-[11px]">
            Residual Stream Identity Fidelity
          </span>
          <span className="text-2xl font-bold text-[#c2410c] dark:text-[#d97706] block tabular-data">
            cos(x, x_(l+1)) = {semanticFidelity.toFixed(3)}
          </span>
          <span className="text-[10px] text-[#78716c] dark:text-[#9ca3af] block pt-1">
            High affinity proves the identity path preserves original token features across deep layers.
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-[#141518] rounded-xl border border-[#e6e0d4] dark:border-[#26282f] space-y-1">
          <span className="text-[#78716c] dark:text-[#9ca3af] block text-[11px]">
            Input L2 Norm vs Output L2 Norm
          </span>
          <span className="text-2xl font-bold text-[#1c1917] dark:text-[#f3f4f6] block tabular-data">
            {inStats.l2Norm.toFixed(2)} → {outStats.l2Norm.toFixed(2)}
          </span>
          <span className="text-[10px] text-[#78716c] dark:text-[#9ca3af] block pt-1">
            Normalization constrains magnitude explosion across consecutive blocks.
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-[#141518] rounded-xl border border-[#e6e0d4] dark:border-[#26282f] space-y-1">
          <span className="text-[#78716c] dark:text-[#9ca3af] block text-[11px]">
            Gradient Highway (dF/dx + I)
          </span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 block tabular-data">
            Stable Gradient
          </span>
          <span className="text-[10px] text-[#78716c] dark:text-[#9ca3af] block pt-1">
            The identity addition guarantees backpropagation gradients never vanish to zero.
          </span>
        </div>
      </div>
    </div>
  );
};
