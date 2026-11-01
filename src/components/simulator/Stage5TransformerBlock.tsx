import React from 'react';
import { SimulatorForwardPass } from '../../services/simulatorEngine';
import { Layers, Crosshair, ArrowDown, GitCommit, Zap, ShieldCheck } from 'lucide-react';

interface Stage5TransformerBlockProps {
  sim: SimulatorForwardPass;
  trackedTokenIdx: number;
  onSelectToken: (idx: number) => void;
}

export const Stage5TransformerBlock: React.FC<Stage5TransformerBlockProps> = ({
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
            Stage 05 of 07
          </span>
          <h3 className="text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
            Transformer Block: Residual Connections & FFN Memory
          </h3>
        </div>
        <div className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          Architecture: <strong className="text-[#c2410c] dark:text-[#d97706]">{sim.stage5.architecture}</strong>
        </div>
      </div>

      {/* Pre-Norm Layer Pipeline Architecture Flow */}
      <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#ece7dc] dark:border-[#22242b]">
          <h4 className="font-serif text-base font-medium text-[#1c1917] dark:text-[#f3f4f6]">
            Sublayer Dataflow for Tracked Token #{trackedTokenIdx} ("{trackedToken.text}")
          </h4>
          <span className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
            d_model = {sim.dModel} · d_ff = 16
          </span>
        </div>

        {/* Step-by-step pipeline */}
        <div className="space-y-3 font-mono text-xs">
          {/* Step 1: Input to block */}
          <div className="p-3.5 bg-[#faf8f5] dark:bg-[#0c0d10] rounded-lg border border-[#ded7ca] dark:border-[#282a32] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] text-[#78716c] dark:text-[#9ca3af] block">
                01. Input Residual Stream x₀
              </span>
              <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
                [{trackedToken.inputVector.map((v) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2))).join(', ')}]
              </span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-white dark:bg-[#1f2127] border border-[#ded7ca] dark:border-[#282a32]">
              shape: {sim.stage5.shapes.input}
            </span>
          </div>

          {/* Sublayer 1: Attention Residual Branch */}
          <div className="pl-6 border-l-2 border-amber-400 dark:border-amber-600 space-y-2">
            <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-800 space-y-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-semibold text-amber-950 dark:text-amber-200">
                  Pre-RMSNorm + Multi-Head Self-Attention Output Δx₁
                </span>
                <span className="text-[#78716c] dark:text-[#9ca3af]">shape: {sim.stage5.shapes.attention}</span>
              </div>
              <div className="text-[#1c1917] dark:text-[#f3f4f6] truncate">
                [{trackedToken.attendedVector.map((v) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2))).join(', ')}]
              </div>
            </div>

            <div className="p-3 bg-[#faf8f5] dark:bg-[#1a1c22] rounded border border-[#ded7ca] dark:border-[#282a32] flex justify-between items-center">
              <div>
                <span className="text-[11px] text-[#78716c] dark:text-[#9ca3af] block">
                  Residual Addition 1: x_mid = x₀ + Δx₁
                </span>
                <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
                  [{trackedToken.residual1.map((v) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2))).join(', ')}]
                </span>
              </div>
              <span className="text-[11px] text-[#78716c] dark:text-[#9ca3af]">
                {sim.stage5.shapes.residual1}
              </span>
            </div>
          </div>

          {/* Sublayer 2: FFN Residual Branch */}
          <div className="pl-6 border-l-2 border-emerald-400 dark:border-emerald-600 space-y-2">
            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded border border-emerald-200 dark:border-emerald-800 space-y-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-semibold text-emerald-950 dark:text-emerald-200">
                  Pre-RMSNorm + Feed-Forward Network Output Δx₂ (SiLU non-linearity)
                </span>
                <span className="text-[#78716c] dark:text-[#9ca3af]">shape: {sim.stage5.shapes.ffn}</span>
              </div>
              <div className="text-[#1c1917] dark:text-[#f3f4f6] truncate">
                [{trackedToken.ffnVector.map((v) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2))).join(', ')}]
              </div>
            </div>

            <div className="p-3 bg-[#faf8f5] dark:bg-[#1a1c22] rounded border border-[#c2410c] dark:border-[#d97706] flex justify-between items-center">
              <div>
                <span className="text-[11px] text-[#c2410c] dark:text-[#d97706] font-bold block">
                  Final Output Hidden State: x_final = x_mid + Δx₂
                </span>
                <span className="font-bold text-[#c2410c] dark:text-[#d97706]">
                  [{trackedToken.finalHidden.map((v) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2))).join(', ')}]
                </span>
              </div>
              <span className="text-[11px] font-semibold text-[#c2410c] dark:text-[#d97706]">
                {sim.stage5.shapes.output}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Residual Highway Health Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
        <div className="p-4 bg-white dark:bg-[#141518] rounded-xl border border-[#e6e0d4] dark:border-[#26282f] space-y-1">
          <span className="text-[#78716c] dark:text-[#9ca3af] block text-[11px]">Residual Identity Path</span>
          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 block">
            Preserved Identity
          </span>
          <p className="text-[11px] text-[#57534e] dark:text-[#9ca3af]">
            Token identity travels directly through the layer without degradation.
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-[#141518] rounded-xl border border-[#e6e0d4] dark:border-[#26282f] space-y-1">
          <span className="text-[#78716c] dark:text-[#9ca3af] block text-[11px]">Pre-Sublayer Normalization</span>
          <span className="text-lg font-bold text-[#1c1917] dark:text-[#f3f4f6] block">
            RMSNorm Active
          </span>
          <p className="text-[11px] text-[#57534e] dark:text-[#9ca3af]">
            Root-mean-square scaling (without mean-centering) bounds activation magnitudes across stacked layers.
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-[#141518] rounded-xl border border-[#e6e0d4] dark:border-[#26282f] space-y-1">
          <span className="text-[#78716c] dark:text-[#9ca3af] block text-[11px]">Feed-Forward Memory</span>
          <span className="text-lg font-bold text-[#c2410c] dark:text-[#d97706] block">
            16D Projection
          </span>
          <p className="text-[11px] text-[#57534e] dark:text-[#9ca3af]">
            Two-layer MLP injects non-linear associative factual retrieval.
          </p>
        </div>
      </div>
    </div>
  );
};
