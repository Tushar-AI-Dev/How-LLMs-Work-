import React, { useState } from 'react';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Layers, ArrowDown, Cpu, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

interface SublayerInfo {
  id: string;
  name: string;
  category: 'norm' | 'attention' | 'residual' | 'ffn';
  equation: string;
  description: string;
  dimensionFlow: string;
  keyInsight: string;
}

const SUBLAYERS: SublayerInfo[] = [
  {
    id: 'input',
    name: 'Input Representation x_l',
    category: 'residual',
    equation: '\\mathbf{x}_l \\in \\mathbb{R}^{B \\times L \\times d_{\\text{model}}}',
    description: 'The token hidden state vectors entering layer l from the previous layer (or initial embedding + positional encoding at layer 0).',
    dimensionFlow: 'd_model = 4096',
    keyInsight: 'Acts as the central residual stream "bus" where information persists across all layers.'
  },
  {
    id: 'norm1',
    name: 'RMSNorm / LayerNorm 1',
    category: 'norm',
    equation: '\\bar{\\mathbf{x}} = \\text{RMSNorm}(\\mathbf{x}_l) = \\frac{\\mathbf{x}_l}{\\text{RMS}(\\mathbf{x}_l)} \\odot \\boldsymbol{\\gamma}_1',
    description: 'Stabilizes activation variance across feature dimensions before self-attention. Pre-LN normalizes the input to the sublayer rather than the residual stream.',
    dimensionFlow: 'd_model -> d_model',
    keyInsight: 'Prevents activation blowup and guarantees bounded inputs into attention projection weights.'
  },
  {
    id: 'mha',
    name: 'Multi-Head Self-Attention',
    category: 'attention',
    equation: '\\text{MHA}(\\bar{\\mathbf{x}}) = W_O \\left[ \\text{head}_1; \\dots; \\text{head}_h \\right]',
    description: 'Tokens exchange contextual information through Query-Key-Value interactions across multiple independent subspace heads.',
    dimensionFlow: 'd_model -> h x d_k -> d_model',
    keyInsight: 'Allows tokens to route information dynamically based on sequence relationships and context.'
  },
  {
    id: 'res1',
    name: 'Residual Connection 1',
    category: 'residual',
    equation: '\\mathbf{x}_l^{\\prime} = \\mathbf{x}_l + \\text{MHA}(\\text{RMSNorm}(\\mathbf{x}_l))',
    description: 'Element-wise vector addition between the input stream and the attention output. The original identity representation is preserved.',
    dimensionFlow: 'd_model + d_model -> d_model',
    keyInsight: 'Creates an unobstructed identity gradient highway, preventing gradient vanishing across 80+ layers.'
  },
  {
    id: 'norm2',
    name: 'RMSNorm / LayerNorm 2',
    category: 'norm',
    equation: '\\bar{\\mathbf{x}}^{\\prime} = \\text{RMSNorm}(\\mathbf{x}_l^{\\prime}) = \\frac{\\mathbf{x}_l^{\\prime}}{\\text{RMS}(\\mathbf{x}_l^{\\prime})} \\odot \\boldsymbol{\\gamma}_2',
    description: 'Normalizes the updated residual state prior to the high-capacity Feed-Forward Network expansion.',
    dimensionFlow: 'd_model -> d_model',
    keyInsight: 'Ensures numerical stability before the 4x or 8/3x dimensional expansion in the MLP.'
  },
  {
    id: 'ffn',
    name: 'Feed-Forward Network (FFN / SwiGLU)',
    category: 'ffn',
    equation: '\\text{FFN}(\\bar{\\mathbf{x}}^{\\prime}) = W_2 \\cdot \\sigma(W_1 \\bar{\\mathbf{x}}^{\\prime})',
    description: 'Position-wise multi-layer perceptron. Expands feature dimension by 4x, applies non-linear activation (GELU or SwiGLU), and projects back to d_model.',
    dimensionFlow: 'd_model -> 4 x d_model -> d_model',
    keyInsight: 'Operates on each token independently, functioning as a learned associative factual memory store.'
  },
  {
    id: 'res2',
    name: 'Residual Connection 2',
    category: 'residual',
    equation: '\\mathbf{x}_{l+1} = \\mathbf{x}_l^{\\prime} + \\text{FFN}(\\text{RMSNorm}(\\mathbf{x}_l^{\\prime}))',
    description: 'Adds the enriched FFN features back into the residual stream, producing the final block output vector passed to layer l+1.',
    dimensionFlow: 'd_model + d_model -> d_model',
    keyInsight: 'Each layer computes only an incremental delta (residual) to refine the token state.'
  }
];

export const TransformerBlockDiagram: React.FC = () => {
  const [selectedSublayerId, setSelectedSublayerId] = useState<string>('mha');
  const [animatingStep, setAnimatingStep] = useState<number | null>(null);

  const selectedSublayer = SUBLAYERS.find((s) => s.id === selectedSublayerId) || SUBLAYERS[0];

  const handleRunPulse = () => {
    let step = 0;
    setAnimatingStep(step);
    const interval = setInterval(() => {
      step++;
      if (step >= SUBLAYERS.length) {
        clearInterval(interval);
        setAnimatingStep(null);
      } else {
        setAnimatingStep(step);
        setSelectedSublayerId(SUBLAYERS[step].id);
      }
    }, 600);
  };

  const getSublayerColor = (category: SublayerInfo['category']) => {
    switch (category) {
      case 'norm':
        return 'border-sky-300 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200';
      case 'attention':
        return 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200';
      case 'ffn':
        return 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200';
      case 'residual':
        return 'border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-200';
    }
  };

  return (
    <div className="bg-white dark:bg-[#131417] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#ece7dc] dark:border-[#22242b] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            <Layers className="w-4 h-4" />
            <span>Interactive Architecture Map</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            Anatomy of a Modern Transformer Block (Pre-LN)
          </h4>
        </div>
        <button
          onClick={handleRunPulse}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#c2410c] dark:bg-[#d97706] text-white text-xs font-mono font-medium hover:bg-[#9c381f] dark:hover:bg-[#b45309] transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simulate Forward Pass</span>
        </button>
      </div>

      {/* Main Grid: Flow Diagram on Left, Inspector Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-start">
        {/* Flow Diagram Column (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center space-y-2 py-2">
          {SUBLAYERS.map((sublayer, idx) => {
            const isSelected = selectedSublayerId === sublayer.id;
            const isPulseActive = animatingStep === idx;

            return (
              <React.Fragment key={sublayer.id}>
                <div
                  onClick={() => setSelectedSublayerId(sublayer.id)}
                  className={`w-full max-w-sm p-3.5 rounded-lg border text-left cursor-pointer transition-all duration-200 relative ${
                    getSublayerColor(sublayer.category)
                  } ${
                    isSelected
                      ? 'ring-2 ring-[#c2410c] dark:ring-[#d97706] shadow-sm -translate-y-0.5'
                      : 'hover:opacity-90'
                  } ${isPulseActive ? 'ring-4 ring-amber-400 scale-[1.02] shadow-md' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider opacity-70">
                      Step 0{idx + 1} · {sublayer.category.toUpperCase()}
                    </span>
                    <span className="text-[11px] font-mono opacity-80">{sublayer.dimensionFlow}</span>
                  </div>
                  <div className="font-semibold text-sm mt-0.5 flex items-center justify-between">
                    <span>{sublayer.name}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-0.5 text-[#c2410c] dark:text-[#d97706]' : 'opacity-40'}`} />
                  </div>
                </div>

                {idx < SUBLAYERS.length - 1 && (
                  <div className="flex flex-col items-center py-0.5">
                    <ArrowDown className={`w-3.5 h-3.5 transition-colors ${animatingStep === idx ? 'text-[#c2410c] dark:text-[#d97706] scale-125' : 'text-[#a8a29e] dark:text-[#52525b]'}`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Deep Dive Inspector Column (7 cols) */}
        <div className="lg:col-span-7 bg-[#faf8f5] dark:bg-[#181a1f] border border-[#ece7dc] dark:border-[#26282f] rounded-xl p-6 lg:p-7 space-y-6">
          <div className="flex items-center justify-between border-b border-[#ece7dc] dark:border-[#26282f] pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
                Sublayer Diagnostic Inspection
              </span>
              <h5 className="text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
                {selectedSublayer.name}
              </h5>
            </div>
            <div className="px-3 py-1 rounded bg-[#ece7dc] dark:bg-[#26282f] font-mono text-xs text-[#57534e] dark:text-[#d1d5db]">
              {selectedSublayer.category.toUpperCase()}
            </div>
          </div>

          {/* Mathematical Formulation */}
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-2">
              Mathematical Formulation:
            </span>
            <div className="p-4 bg-white dark:bg-[#121316] rounded-lg border border-[#e6e0d4] dark:border-[#22242b] overflow-x-auto text-center">
              <LatexRenderer math={selectedSublayer.equation} displayMode={true} />
            </div>
          </div>

          {/* Prose Description */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block">
              Functional Mechanism:
            </span>
            <p className="text-sm text-[#57534e] dark:text-[#d1d5db] leading-relaxed">
              {selectedSublayer.description}
            </p>
          </div>

          {/* Key Insight Box */}
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[#1c1917] dark:text-[#fef3c7] text-xs sm:text-sm flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Architectural Insight</span>
              <p className="leading-relaxed opacity-90">{selectedSublayer.keyInsight}</p>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#ece7dc] dark:border-[#26282f] text-xs font-mono">
            <div>
              <span className="text-[#a8a29e] dark:text-[#6b7280] block text-[11px]">DIMENSIONAL TRANSITION</span>
              <span className="font-medium text-[#1c1917] dark:text-[#f3f4f6]">{selectedSublayer.dimensionFlow}</span>
            </div>
            <div>
              <span className="text-[#a8a29e] dark:text-[#6b7280] block text-[11px]">EXECUTION ORDER</span>
              <span className="font-medium text-[#1c1917] dark:text-[#f3f4f6]">
                Stage {SUBLAYERS.findIndex((s) => s.id === selectedSublayerId) + 1} of 7
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
