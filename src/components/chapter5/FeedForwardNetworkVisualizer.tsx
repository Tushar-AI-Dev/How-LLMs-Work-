import React, { useState, useMemo } from 'react';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Cpu, Zap, Database, ArrowRight, Check, Sliders } from 'lucide-react';
import {
  runFFN,
  DEFAULT_FFN_W1,
  DEFAULT_FFN_B1,
  DEFAULT_FFN_W2,
  DEFAULT_FFN_B2,
  PRESET_TRANSFORMER_VECTORS,
} from '../../services/transformerService';

export const FeedForwardNetworkVisualizer: React.FC = () => {
  const [selectedTokenIdx, setSelectedTokenIdx] = useState<number>(0);
  const [activationType, setActivationType] = useState<'relu' | 'gelu' | 'silu'>('gelu');
  const [activeStage, setActiveStage] = useState<number>(2); // 0 = input, 1 = linear, 2 = activated, 3 = output

  const inputVector = PRESET_TRANSFORMER_VECTORS[selectedTokenIdx].vector;

  const ffnResult = useMemo(() => {
    return runFFN(
      inputVector,
      DEFAULT_FFN_W1,
      DEFAULT_FFN_B1,
      DEFAULT_FFN_W2,
      DEFAULT_FFN_B2,
      activationType
    );
  }, [inputVector, activationType]);

  const stages = [
    {
      num: 1,
      name: 'Input Representation',
      dim: 'd_model = 4',
      tag: 'From Attention & Norm',
      color: 'sky',
    },
    {
      num: 2,
      name: 'Key Expansion W_1',
      dim: 'd_ff = 8 (4x Expansion)',
      tag: 'Pattern Matching Keys',
      color: 'amber',
    },
    {
      num: 3,
      name: 'Non-linear Gate σ(z)',
      dim: `Activation: ${activationType.toUpperCase()}`,
      tag: 'Thresholding & Sparsity',
      color: 'purple',
    },
    {
      num: 4,
      name: 'Value Projection W_2',
      dim: 'd_model = 4',
      tag: 'Factual Memory Readout',
      color: 'emerald',
    },
  ];

  return (
    <div className="bg-white dark:bg-[#131417] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#ece7dc] dark:border-[#22242b] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            <Cpu className="w-4 h-4" />
            <span>Interactive Computation</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            Position-Wise Feed-Forward Network (FFN / MLP)
          </h4>
        </div>

        {/* Activation Selector */}
        <div className="flex rounded-lg p-1 bg-[#faf8f5] dark:bg-[#1a1c22] border border-[#ece7dc] dark:border-[#282a32]">
          {(['relu', 'gelu', 'silu'] as const).map((act) => (
            <button
              key={act}
              onClick={() => setActivationType(act)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors uppercase cursor-pointer ${
                activationType === act
                  ? 'bg-[#1c1917] text-white dark:bg-white dark:text-[#1c1917] font-semibold shadow-xs'
                  : 'text-[#78716c] dark:text-[#9ca3af] hover:text-[#1c1917] dark:hover:text-[#f3f4f6]'
              }`}
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      {/* Governing Formula */}
      <div className="my-6 p-4 bg-[#faf8f5] dark:bg-[#181a1f] rounded-lg border border-[#ece7dc] dark:border-[#26282f] text-center">
        <LatexRenderer
          math={
            activationType === 'relu'
              ? '\\text{FFN}(\\mathbf{x}) = W_2 \\cdot \\max(0, W_1 \\mathbf{x} + \\mathbf{b}_1) + \\mathbf{b}_2'
              : activationType === 'gelu'
              ? '\\text{FFN}(\\mathbf{x}) = W_2 \\cdot \\text{GELU}(W_1 \\mathbf{x} + \\mathbf{b}_1) + \\mathbf{b}_2, \\quad \\text{GELU}(z) = z \\cdot \\Phi(z)'
              : '\\text{FFN}(\\mathbf{x}) = W_2 \\cdot \\text{SiLU}(W_1 \\mathbf{x} + \\mathbf{b}_1) + \\mathbf{b}_2, \\quad \\text{SiLU}(z) = \\frac{z}{1 + e^{-z}}'
          }
          displayMode={true}
        />
        <p className="mt-2 text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          {activationType === 'relu'
            ? 'ReLU clamps negative values strictly to zero, providing computational efficiency but susceptible to "dead neurons".'
            : activationType === 'gelu'
            ? 'GELU weights inputs by their normal cumulative probability, allowing small negative gradients and smoother optimization.'
            : 'SiLU (Swish) provides smooth self-gating, forming the core component of modern SwiGLU architectures (LLaMA, Gemma).'}
        </p>
      </div>

      {/* Token Input Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          <span>Select Input Token State:</span>
          <div className="flex gap-1.5">
            {PRESET_TRANSFORMER_VECTORS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedTokenIdx(idx)}
                className={`px-2.5 py-1 rounded border text-xs font-mono transition-colors cursor-pointer ${
                  selectedTokenIdx === idx
                    ? 'border-[#c2410c] dark:border-[#d97706] bg-amber-500/10 text-[#c2410c] dark:text-[#d97706] font-semibold'
                    : 'border-[#ece7dc] dark:border-[#282a32] bg-[#faf8f5] dark:bg-[#1a1c22] text-[#57534e] dark:text-[#9ca3af]'
                }`}
              >
                {p.name.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[11px] font-mono text-[#78716c] dark:text-[#9ca3af]">
          Parameter Count: 2 × d_model × d_ff ≈ ~66% of total LLM weights
        </div>
      </div>

      {/* Stage Progression Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {stages.map((st, idx) => (
          <button
            key={idx}
            onClick={() => setActiveStage(idx)}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              activeStage === idx
                ? 'border-[#c2410c] dark:border-[#d97706] bg-amber-500/10 shadow-xs'
                : 'border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#16171b] hover:border-[#cfc6b5]'
            }`}
          >
            <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] mb-1">
              <span>Stage 0{st.num}</span>
              {activeStage === idx && <span className="w-1.5 h-1.5 rounded-full bg-[#c2410c] dark:bg-[#d97706]" />}
            </div>
            <div className="font-semibold text-xs text-[#1c1917] dark:text-[#f3f4f6] truncate">
              {st.name}
            </div>
            <div className="text-[10px] font-mono text-[#78716c] dark:text-[#9ca3af] mt-0.5">
              {st.dim}
            </div>
          </button>
        ))}
      </div>

      {/* Interactive Stage Visualization Card */}
      <div className="p-6 rounded-xl border border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#181a1f] space-y-6">
        {/* Stage 1: Input */}
        {activeStage === 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
                  Input State (d_model = 4)
                </span>
                <p className="text-xs text-[#57534e] dark:text-[#9ca3af] mt-0.5">
                  The normalized token representation after passing through multi-head self-attention.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {ffnResult.input.map((val, idx) => (
                <div key={idx} className="p-3 bg-white dark:bg-[#1f2127] rounded-lg border border-[#ece7dc] dark:border-[#282a32] text-center">
                  <div className="text-[10px] font-mono text-[#78716c] dark:text-[#9ca3af]">dim_{idx}</div>
                  <div className="text-base font-mono font-bold text-[#1c1917] dark:text-[#f3f4f6] mt-1">
                    {val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stage 2: Expanded Linear */}
        {activeStage === 1 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
                  Pre-Activation Hidden State (z = W_1 * x + b_1)
                </span>
                <p className="text-xs text-[#57534e] dark:text-[#9ca3af] mt-0.5">
                  Each neuron in the expanded layer corresponds to a learned "Key" pattern detector.
                </p>
              </div>
              <span className="text-xs font-mono px-2 py-1 bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded">
                d_ff = 8
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ffnResult.expandedLinear.map((val, idx) => (
                <div key={idx} className="p-3 bg-white dark:bg-[#1f2127] rounded-lg border border-[#ece7dc] dark:border-[#282a32] text-center">
                  <div className="text-[10px] font-mono text-[#78716c] dark:text-[#9ca3af]">Neuron z_{idx}</div>
                  <div className={`text-base font-mono font-bold mt-1 ${val < 0 ? 'text-stone-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}
                  </div>
                  <div className="text-[9px] font-mono text-[#a8a29e] mt-0.5">
                    {val < 0 ? 'Inhibited' : 'Excited'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stage 3: Non-Linear Activation */}
        {activeStage === 2 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
                  Activated Hidden Layer a = σ(z) ({activationType.toUpperCase()})
                </span>
                <p className="text-xs text-[#57534e] dark:text-[#9ca3af] mt-0.5">
                  Non-linearity allows neural networks to approximate arbitrary functions instead of collapsing into a single linear matrix.
                </p>
              </div>
              <span className="text-xs font-mono px-2 py-1 bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded">
                Gated Sparsity
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ffnResult.activated.map((val, idx) => {
                const isZeroOrNegligible = Math.abs(val) < 0.01;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      isZeroOrNegligible
                        ? 'bg-stone-100/50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 opacity-60'
                        : 'bg-white dark:bg-[#1f2127] border-purple-300 dark:border-purple-800 ring-1 ring-purple-400/30'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-[#78716c] dark:text-[#9ca3af]">Neuron a_{idx}</div>
                    <div className="text-base font-mono font-bold text-purple-700 dark:text-purple-300 mt-1">
                      {val.toFixed(2)}
                    </div>
                    <div className="text-[9px] font-mono text-[#78716c] mt-0.5">
                      {isZeroOrNegligible ? 'Zeroed / Suppressed' : 'Active Feature'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stage 4: Projected Output */}
        {activeStage === 3 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
                  Projected FFN Output (y = W_2 * a + b_2)
                </span>
                <p className="text-xs text-[#57534e] dark:text-[#9ca3af] mt-0.5">
                  The active keys read out their associated factual values from W_2 back into the d_model residual space.
                </p>
              </div>
              <span className="text-xs font-mono px-2 py-1 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded">
                d_model = 4
              </span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {ffnResult.output.map((val, idx) => (
                <div key={idx} className="p-3 bg-white dark:bg-[#1f2127] rounded-lg border border-emerald-300 dark:border-emerald-800 text-center">
                  <div className="text-[10px] font-mono text-[#78716c] dark:text-[#9ca3af]">out_{idx}</div>
                  <div className="text-base font-mono font-bold text-emerald-700 dark:text-emerald-300 mt-1">
                    {val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Memory Bank Analogy Callout */}
      <div className="mt-6 p-4 rounded-xl border border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#181a1f] flex items-start gap-3">
        <Database className="w-5 h-5 text-[#c2410c] dark:text-[#d97706] shrink-0 mt-0.5" />
        <div className="text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6] block mb-0.5">
            Key-Value Memory Bank Interpretation (Geva et al., 2021):
          </span>
          Modern mechanistic interpretability studies show that the feed-forward network acts as an associative factual memory store. The first layer weights <LatexRenderer math="W_1" /> act as <strong>keys</strong> that match linguistic and contextual patterns, while the second layer weights <LatexRenderer math="W_2" /> act as <strong>values</strong> that retrieve factual attributes (e.g. associating "Eiffel Tower" with "Paris, France").
        </div>
      </div>
    </div>
  );
};
