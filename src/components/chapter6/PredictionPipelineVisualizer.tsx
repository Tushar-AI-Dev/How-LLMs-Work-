import React, { useState } from 'react';
import { LatexRenderer } from '../ui/LatexRenderer';
import { ArrowRight, ChevronRight, Cpu, Layers, Sparkles, Sliders } from 'lucide-react';

interface PipelineStage {
  id: string;
  name: string;
  math: string;
  shape: string;
  description: string;
  insight: string;
}

const STAGES: PipelineStage[] = [
  {
    id: 'hidden',
    name: '1. Final Hidden State',
    math: '\\mathbf{h}_L \\in \\mathbb{R}^{d_{\\text{model}}}',
    shape: 'd_model = 4096',
    description: 'The rich contextual vector emerging from the final Transformer block for the current last token in the sequence.',
    insight: 'Synthesizes all sequence syntax, long-range attention dependencies, and factual memory retrieval.',
  },
  {
    id: 'norm',
    name: '2. Final RMSNorm',
    math: '\\bar{\\mathbf{h}}_L = \\text{RMSNorm}(\\mathbf{h}_L) = \\frac{\\mathbf{h}_L}{\\text{RMS}(\\mathbf{h}_L)} \\odot \\boldsymbol{\\gamma}',
    shape: 'd_model = 4096',
    description: 'Stabilizes the final representation vector across all feature dimensions before linear unembedding projection.',
    insight: 'Guarantees consistent scale across diverse inputs, preventing wild logit swings.',
  },
  {
    id: 'unembed',
    name: '3. Unembedding Head',
    math: '\\mathbf{z} = W_U \\bar{\\mathbf{h}}_L + \\mathbf{b}_U, \\quad W_U \\in \\mathbb{R}^{|V| \\times d_{\\text{model}}}',
    shape: '|V| = 32000 to 128000',
    description: 'Linear matrix multiplication mapping the hidden vector into vocabulary space, producing raw unbounded scores called logits.',
    insight: 'In many architectures (like GPT-2 and Gemma), W_U shares weights with the input token embedding matrix (weight tying).',
  },
  {
    id: 'temp',
    name: '4. Temperature Scaling',
    math: '\\mathbf{z}^{\\prime} = \\frac{\\mathbf{z}}{T}, \\quad T > 0',
    shape: '|V| Logits',
    description: 'Divides raw logits by temperature parameter T to calibrate entropy (sharpness vs diversity).',
    insight: 'Does not alter the relative ranking of tokens, but controls how sharply probabilities peak.',
  },
  {
    id: 'softmax',
    name: '5. Softmax Normalization',
    math: 'P(w_i) = \\frac{\\exp(z_i^{\\prime})}{\\sum_{j=1}^{|V|} \\exp(z_j^{\\prime})}',
    shape: '|V| Probabilities [0, 1]',
    description: 'Exponentiates scaled logits and normalizes them into a valid categorical probability distribution summing strictly to 1.0.',
    insight: 'Turns unbounded real numbers (-inf to +inf) into positive probabilities.',
  },
  {
    id: 'sample',
    name: '6. Decoding & Selection',
    math: 'w_{t+1} \\sim P_{\\text{filtered}}(w), \\quad \\text{Top-k} / \\text{Top-p} / \\text{Greedy}',
    shape: 'Single Token ID',
    description: 'Filters the distribution using Top-k or Top-p (nucleus) and selects the next token via sampling or greedy argmax.',
    insight: 'The chosen token is appended to the prompt, and the entire cycle loops autoregressively.',
  },
];

export const PredictionPipelineVisualizer: React.FC = () => {
  const [selectedStageId, setSelectedStageId] = useState<string>('unembed');

  const activeStage = STAGES.find((s) => s.id === selectedStageId) || STAGES[2];

  return (
    <div className="bg-white dark:bg-[#131417] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#ece7dc] dark:border-[#22242b] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>End-Of-Model Pipeline</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            From Hidden Vector to the Next Token
          </h4>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#faf8f5] dark:bg-[#1a1c22] border border-[#ece7dc] dark:border-[#282a32] text-[#78716c] dark:text-[#9ca3af]">
          Vocabulary Size: <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">|V| ≈ 32k–128k</span>
        </div>
      </div>

      {/* Stage Progression Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 my-6">
        {STAGES.map((st, idx) => {
          const isSelected = selectedStageId === st.id;
          return (
            <button
              key={st.id}
              onClick={() => setSelectedStageId(st.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#c2410c] dark:border-[#d97706] bg-amber-500/10 shadow-xs'
                  : 'border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#16171b] hover:border-[#cfc6b5]'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] mb-1">
                <span>Stage 0{idx + 1}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#c2410c] dark:bg-[#d97706]" />}
              </div>
              <div className="font-semibold text-xs text-[#1c1917] dark:text-[#f3f4f6] truncate">
                {st.name.split('. ')[1]}
              </div>
              <div className="text-[10px] font-mono text-[#78716c] dark:text-[#9ca3af] mt-0.5 truncate">
                {st.shape}
              </div>
            </button>
          );
        })}
      </div>

      {/* Stage Diagnostic Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-xl border border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#181a1f]">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
              Stage Deep-Dive
            </span>
            <span className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
              Output Dimension: {activeStage.shape}
            </span>
          </div>

          <h5 className="text-xl sm:text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
            {activeStage.name}
          </h5>

          <p className="text-sm text-[#57534e] dark:text-[#d1d5db] leading-relaxed">
            {activeStage.description}
          </p>

          <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-[#1c1917] dark:text-[#fef3c7] leading-relaxed">
            <span className="font-semibold block mb-0.5">Key Architectural Role:</span>
            {activeStage.insight}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white dark:bg-[#121316] p-5 rounded-xl border border-[#ece7dc] dark:border-[#26282f] flex flex-col justify-center text-center space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block">
            Mathematical Operation:
          </span>
          <div className="p-3 bg-[#faf8f5] dark:bg-[#1a1c22] rounded-lg border border-[#ece7dc] dark:border-[#282a32] overflow-x-auto text-xs sm:text-sm">
            <LatexRenderer math={activeStage.math} displayMode={true} />
          </div>
          <span className="text-[10px] font-mono text-[#a8a29e] dark:text-[#6b7280]">
            Executed at the final sequence position L for autoregressive inference
          </span>
        </div>
      </div>
    </div>
  );
};
