import React, { useState } from 'react';
import { LatexRenderer } from '../ui/LatexRenderer';
import { ChevronDown, ChevronUp, Terminal, Cpu, Info, Check } from 'lucide-react';
import { SimulatorForwardPass } from '../../services/simulatorEngine';

interface ScientificInspectorProps {
  currentStage: number;
  sim: SimulatorForwardPass;
  trackedTokenIdx: number;
}

export const ScientificInspector: React.FC<ScientificInspectorProps> = ({
  currentStage,
  sim,
  trackedTokenIdx,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const trackedToken = sim.tokenReps[trackedTokenIdx] || sim.tokenReps[0];

  // Stage-specific inspector content
  const stageData = [
    {
      stage: 1,
      operation: 'Byte-Pair Encoding (BPE) & Integer Vocabulary Mapping',
      formula: 'V_{new} = V \\cup \\{ (t_i, t_j) \\mid \\arg\\max \\text{freq}(t_i, t_j) \\}',
      inShape: `Arbitrary UTF-8 String (${sim.rawText.length} chars)`,
      outShape: `[seq_len = ${sim.seqLen}]`,
      params: 'Vocab size |V| = 50,257 · R50K Byte-Pair Encoding',
      explanation:
        'Continuous natural language characters are decomposed into discrete, reusable subword units based on empirical corpus frequency. Each unit is mapped to a static non-negative integer ID.',
      rawValues: `Token ID array: [${sim.tokens.map((t) => t.id).join(', ')}]`,
      trackedDetails: `Tracked Token "${trackedToken?.text}": ID = ${trackedToken?.id}, UTF-8 Bytes = [${trackedToken?.bytes?.join(', ')}] (${trackedToken?.byteLength} bytes)`,
    },
    {
      stage: 2,
      operation: 'Table Lookup Projection into Latent Manifold',
      formula: '\\mathbf{e}_i = W_e[t_i], \\quad W_e \\in \\mathbb{R}^{|V| \\times d_{\\text{model}}}',
      inShape: `[seq_len = ${sim.seqLen}]`,
      outShape: `[seq_len = ${sim.seqLen}, d_{model} = ${sim.dModel}]`,
      params: `d_model = ${sim.dModel} · Educational Normalized Embedding Table`,
      explanation:
        'Each integer token ID indexes a unique continuous row in the learned embedding matrix. This projects discrete symbols into a dense geometric space where angle and distance reflect conceptual relationships.',
      rawValues: `Tracked Vector e_{${trackedTokenIdx}} = [${trackedToken?.embedding?.map((v) => (v >= 0 ? `+${v.toFixed(3)}` : v.toFixed(3))).join(', ')}]`,
      trackedDetails: `Vector norm ||e|| = ${(Math.sqrt(trackedToken?.embedding?.reduce((acc, v) => acc + v * v, 0) || 1)).toFixed(3)}`,
    },
    {
      stage: 3,
      operation: 'Sinusoidal Positional Encoding & Vector Summation',
      formula: '\\mathbf{x}_0 = \\mathbf{e} + P, \\quad P_{(pos, 2i)} = \\sin\\left(\\frac{pos}{10000^{2i/d}}\\right), \\quad P_{(pos, 2i+1)} = \\cos\\left(\\frac{pos}{10000^{2i/d}}\\right)',
      inShape: `[seq_len = ${sim.seqLen}, d_{model} = ${sim.dModel}]`,
      outShape: `[seq_len = ${sim.seqLen}, d_{model} = ${sim.dModel}]`,
      params: 'Sinusoidal harmonic frequencies · 10000 base wavelength progression',
      explanation:
        'Self-attention has zero intrinsic spatial awareness. Geometric sinusoidal waves with exponentially increasing wavelengths are added to each token vector to encode its absolute sequence index.',
      rawValues: `Combined Vector x_0[${trackedTokenIdx}] = [${trackedToken?.inputVector?.map((v) => (v >= 0 ? `+${v.toFixed(3)}` : v.toFixed(3))).join(', ')}]`,
      trackedDetails: `PE Vector P[${trackedTokenIdx}] = [${trackedToken?.positional?.map((v) => (v >= 0 ? `+${v.toFixed(3)}` : v.toFixed(3))).join(', ')}]`,
    },
    {
      stage: 4,
      operation: 'Scaled Dot-Product Self-Attention with Causal Masking',
      formula: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{QK^T}{\\sqrt{d_k}} + M \\right) V',
      inShape: `[seq_len = ${sim.seqLen}, d_{model} = ${sim.dModel}]`,
      outShape: `[seq_len = ${sim.seqLen}, d_{model} = ${sim.dModel}]`,
      params: `d_k = ${sim.stage4.d_k} · Scaling factor 1/√d_k = 0.354 · Lower-triangular Causal Mask M`,
      explanation:
        'Every token broadcasts Query, Key, and Value projections. Dot products compute pairwise compatibility scores, scaled to avoid softmax saturation. Causal masking forces future tokens to -∞ before softmax.',
      rawValues: `Attention Weights Row [${trackedTokenIdx}]: [${(sim.stage4.attentionWeights[trackedTokenIdx] || []).map((w) => w.toFixed(3)).join(', ')}]`,
      trackedDetails: `Context-Aggregated Vector z[${trackedTokenIdx}] = [${trackedToken?.attendedVector?.map((v) => (v >= 0 ? `+${v.toFixed(3)}` : v.toFixed(3))).join(', ')}]`,
    },
    {
      stage: 5,
      operation: 'Pre-Norm Transformer Block (RMSNorm + Attention + FFN)',
      formula: '\\mathbf{x}_{l+1} = \\mathbf{x}_{mid} + \\text{FFN}(\\text{RMSNorm}(\\mathbf{x}_{mid})), \\quad \\mathbf{x}_{mid} = \\mathbf{x}_l + \\text{Attn}(\\text{RMSNorm}(\\mathbf{x}_l))',
      inShape: `[seq_len = ${sim.seqLen}, d_{model} = ${sim.dModel}]`,
      outShape: `[seq_len = ${sim.seqLen}, d_{model} = ${sim.dModel}]`,
      params: 'Pre-RMSNorm (root-mean-square scaling) · SiLU non-linearity · d_ff = 16',
      explanation:
        'Pre-RMSNorm scales activation magnitudes without mean-centering before each sublayer. Residual connections provide an uninterrupted identity highway where Attention and FFN outputs are accumulated.',
      rawValues: `Final Hidden x_out[${trackedTokenIdx}] = [${trackedToken?.finalHidden?.map((v) => (v >= 0 ? `+${v.toFixed(3)}` : v.toFixed(3))).join(', ')}]`,
      trackedDetails: `FFN Output Contribution Δx = [${trackedToken?.ffnVector?.map((v) => (v >= 0 ? `+${v.toFixed(3)}` : v.toFixed(3))).join(', ')}]`,
    },
    {
      stage: 6,
      operation: 'Language Modeling Head & Temperature Logits Projection',
      formula: 'P(w_i) = \\frac{\\exp(z_i / T)}{\\sum_{j=1}^{24} \\exp(z_j / T)}, \\quad \\mathbf{z} = W_u \\cdot \\mathbf{h}_{last}',
      inShape: `[d_{model} = ${sim.dModel}] (at sequence index ${sim.stage6.predictionIndex})`,
      outShape: `[candidate_subset = ${sim.stage6.candidates.length} of 50,257 GPT-2 tokens]`,
      params: `Temperature T = ${sim.stage6.temperature} · Top-K = ${sim.stage6.topK} · Top-P = ${sim.stage6.topP}`,
      explanation:
        'The final hidden state of the last token is multiplied by the weight-tied unembedding rows of a curated 24-token candidate subset (out of 50,257 GPT-2 tokens). Softmax probabilities are normalized over this 24-candidate educational pool.',
      rawValues: `Top Candidate: "${sim.stage6.candidates[0]?.token}" (Prob: ${(sim.stage6.candidates[0]?.prob * 100).toFixed(1)}%, Logit: ${sim.stage6.candidates[0]?.logit})`,
      trackedDetails: `Prediction position token: "${sim.tokens[sim.stage6.predictionIndex]?.text}"`,
    },
    {
      stage: 7,
      operation: 'Autoregressive Decoding & Context Loop',
      formula: 't_{next} \\sim P(w \\mid w_{<t}), \\quad \\mathbf{S}_{new} = [\\mathbf{S}, t_{next}]',
      inShape: `[seq_len = ${sim.seqLen}]`,
      outShape: `[seq_len = ${sim.seqLen + 1}]`,
      params: `Sampling: ${sim.stage7.samplingMethod.toUpperCase()}`,
      explanation:
        'The selected token is sampled and appended to the text buffer. In the next iteration, the entire Transformer forward pass runs again on the updated sequence, predicting subsequent tokens autoregressively.',
      rawValues: `Selected Token: "${sim.stage7.selectedToken}"`,
      trackedDetails: `Updated Sequence: "${sim.stage7.updatedText}"`,
    },
  ];

  const currentInfo = stageData[currentStage - 1] || stageData[0];

  return (
    <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl overflow-hidden transition-all shadow-xs">
      {/* Inspector Header Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-[#faf8f5] dark:hover:bg-[#1a1c22] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-[#c2410c] dark:text-[#d97706]" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#1c1917] dark:text-[#f3f4f6]">
            Scientific Inspector · Stage 0{currentStage}: {currentInfo.operation.split('&')[0]}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af] hidden sm:inline">
            {currentInfo.inShape} → {currentInfo.outShape}
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-[#78716c]" /> : <ChevronDown className="w-4 h-4 text-[#78716c]" />}
        </div>
      </button>

      {/* Inspector Body */}
      {isOpen && (
        <div className="p-5 border-t border-[#ece7dc] dark:border-[#22242b] space-y-4 text-xs font-mono bg-[#faf8f5]/50 dark:bg-[#0c0d10]/40">
          {/* Formula & Tensor Shapes */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-7 p-3 bg-white dark:bg-[#141518] rounded-lg border border-[#ded7ca] dark:border-[#282a32] overflow-x-auto text-xs sm:text-sm text-[#1c1917] dark:text-[#f3f4f6]">
              <LatexRenderer math={currentInfo.formula} displayMode={true} />
            </div>

            <div className="md:col-span-5 space-y-2 p-3 bg-white dark:bg-[#141518] rounded-lg border border-[#ded7ca] dark:border-[#282a32]">
              <div className="flex justify-between">
                <span className="text-[#78716c] dark:text-[#9ca3af]">Input Tensor:</span>
                <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">{currentInfo.inShape}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716c] dark:text-[#9ca3af]">Output Tensor:</span>
                <span className="font-semibold text-[#c2410c] dark:text-[#d97706]">{currentInfo.outShape}</span>
              </div>
              <div className="flex justify-between border-t border-[#ece7dc] dark:border-[#26282f] pt-1.5 text-[11px]">
                <span className="text-[#78716c] dark:text-[#9ca3af]">Parameters:</span>
                <span className="text-[#57534e] dark:text-[#9ca3af] truncate">{currentInfo.params}</span>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="p-3 bg-white dark:bg-[#141518] rounded-lg border border-[#ded7ca] dark:border-[#282a32] text-xs font-sans text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            <div className="font-mono text-[11px] font-semibold text-[#1c1917] dark:text-[#f3f4f6] uppercase tracking-wider mb-1">
              Physical & Mathematical Interpretation:
            </div>
            {currentInfo.explanation}
          </div>

          {/* Intermediate Numerical Values Probe */}
          <div className="p-3 bg-white dark:bg-[#141518] rounded-lg border border-[#ded7ca] dark:border-[#282a32] space-y-1.5 font-mono text-[11px]">
            <div className="text-[10px] uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] font-semibold">
              Live Intermediate Tensor Coordinates:
            </div>
            <div className="text-[#1c1917] dark:text-[#f3f4f6] overflow-x-auto whitespace-pre-wrap">
              {currentInfo.rawValues}
            </div>
            <div className="text-[#c2410c] dark:text-[#d97706] pt-1 border-t border-[#ece7dc] dark:border-[#26282f]">
              Target Token [#{trackedTokenIdx}]: {currentInfo.trackedDetails}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
