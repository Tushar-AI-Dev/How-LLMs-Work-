import React, { useState } from 'react';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Box, Check, HelpCircle, Sparkles, Cpu, Layers } from 'lucide-react';

interface ArchFamily {
  id: 'decoder' | 'encoder' | 'encdec';
  name: string;
  tagline: string;
  representativeModels: string[];
  attentionMask: string;
  trainingObjective: string;
  primaryUseCases: string[];
  blockStructure: string;
  whyItMatters: string;
}

const ARCHITECTURES: ArchFamily[] = [
  {
    id: 'decoder',
    name: 'Decoder-Only (Causal)',
    tagline: 'The architecture powering almost all contemporary Generative LLMs.',
    representativeModels: ['GPT-4o', 'LLaMA 3', 'Mistral 7B', 'Gemma 2', 'Claude 3.5', 'DeepSeek-V3'],
    attentionMask: 'Strict Causal Mask (Lower-triangular: M_{i,j} = -\\infty \\text{ for } j > i)',
    trainingObjective: 'Autoregressive Next-Token Prediction: \\max \\sum_t \\log P(w_t \\mid w_{<t})',
    primaryUseCases: ['Conversational AI', 'In-context learning & reasoning', 'Code generation', 'Free-form creative writing'],
    blockStructure: 'Causal Self-Attention -> RMSNorm -> FFN (SwiGLU) -> Residual Highway',
    whyItMatters: 'By aligning training with generation (predicting one token at a time), decoder-only models scale with breathtaking efficiency and acquire emergent general reasoning capabilities without separate task heads.'
  },
  {
    id: 'encoder',
    name: 'Encoder-Only (Bidirectional)',
    tagline: 'Full bidirectional context for sentence comprehension and embeddings.',
    representativeModels: ['BERT', 'RoBERTa', 'DeBERTa', 'ModernBERT', 'BGE / E5 Embeddings'],
    attentionMask: 'No Masking (Full unconstrained NxN bidirectional attention matrix)',
    trainingObjective: 'Masked Language Modeling (MLM): \\max \\sum_{i \\in \\text{masked}} \\log P(w_i \\mid w_{\\setminus i})',
    primaryUseCases: ['Dense text embeddings for RAG & search', 'Sentiment analysis', 'Named Entity Recognition (NER)', 'Semantic classification'],
    blockStructure: 'Bidirectional Self-Attention -> LayerNorm -> FFN -> Residual Highway',
    whyItMatters: 'Every token can attend simultaneously to tokens before and after it. This produces richer representations for understanding tasks, but prevents autoregressive generation because it has seen the "future".'
  },
  {
    id: 'encdec',
    name: 'Encoder-Decoder (Seq2Seq)',
    tagline: 'The original 2017 architecture designed for paired input-output translation.',
    representativeModels: ['Original Vaswani Transformer (2017)', 'T5', 'BART', 'Whisper (Audio to text)'],
    attentionMask: 'Bidirectional in Encoder; Causal in Decoder + Cross-Attention from Decoder to Encoder',
    trainingObjective: 'Cross-Entropy on target sequence conditioned on source prefix: P(Y \\mid X)',
    primaryUseCases: ['Neural Machine Translation', 'Abstractive Summarization', 'Audio speech recognition', 'Data transformation'],
    blockStructure: 'Encoder Block (Bidirectional) + Decoder Block (Causal + Cross-Attention)',
    whyItMatters: 'Cross-attention allows the generating decoder to query key-value states from the frozen input sequence at every single generation step, ideal for converting input language A to output language B.'
  }
];

export const TransformerArchitecturesComparison: React.FC = () => {
  const [selectedArchId, setSelectedArchId] = useState<'decoder' | 'encoder' | 'encdec'>('decoder');

  const activeArch = ARCHITECTURES.find((a) => a.id === selectedArchId) || ARCHITECTURES[0];

  return (
    <div className="bg-white dark:bg-[#131417] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#ece7dc] dark:border-[#22242b] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            <Box className="w-4 h-4" />
            <span>Architecture Taxonomy</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            The Three Transformer Archetypes
          </h4>
        </div>

        {/* Family Selector Tabs */}
        <div className="flex rounded-lg p-1 bg-[#faf8f5] dark:bg-[#1a1c22] border border-[#ece7dc] dark:border-[#282a32]">
          {ARCHITECTURES.map((arch) => (
            <button
              key={arch.id}
              onClick={() => setSelectedArchId(arch.id)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                selectedArchId === arch.id
                  ? 'bg-[#1c1917] text-white dark:bg-white dark:text-[#1c1917] font-semibold shadow-xs'
                  : 'text-[#78716c] dark:text-[#9ca3af] hover:text-[#1c1917]'
              }`}
            >
              {arch.id === 'decoder' ? 'Decoder-Only' : arch.id === 'encoder' ? 'Encoder-Only' : 'Encoder-Decoder'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Card Details & Attention Mask Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6">
        {/* Left Column: Spec Sheet & Narrative */}
        <div className="lg:col-span-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#c2410c] dark:text-[#d97706] font-semibold uppercase tracking-wider">
              <span>{activeArch.name}</span>
            </div>
            <h5 className="text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
              {activeArch.tagline}
            </h5>
          </div>

          {/* Training Objective */}
          <div className="p-4 rounded-xl border border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#181a1f]">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-2">
              Optimization Objective:
            </span>
            <div className="text-center py-1">
              <LatexRenderer math={activeArch.trainingObjective} displayMode={true} />
            </div>
          </div>

          {/* Primary Use Cases */}
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-2">
              Primary Industrial Applications:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {activeArch.primaryUseCases.map((useCase, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-white dark:bg-[#1a1c22] rounded-lg border border-[#ece7dc] dark:border-[#26282f] flex items-center gap-2 text-xs text-[#1c1917] dark:text-[#f3f4f6]"
                >
                  <Check className="w-3.5 h-3.5 text-[#c2410c] dark:text-[#d97706] shrink-0" />
                  <span>{useCase}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Why it Matters */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-[#1c1917] dark:text-[#fef3c7] leading-relaxed">
            <span className="font-semibold block mb-1">Why this architecture succeeded:</span>
            {activeArch.whyItMatters}
          </div>
        </div>

        {/* Right Column: Visual Matrix & Representative Models */}
        <div className="lg:col-span-4 bg-[#faf8f5] dark:bg-[#181a1f] p-6 rounded-xl border border-[#ece7dc] dark:border-[#26282f] space-y-6">
          {/* Masking Matrix Schematic */}
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-2">
              Attention Mask Topology
            </span>
            <div className="p-3 bg-white dark:bg-[#121316] rounded-lg border border-[#e6e0d4] dark:border-[#22242b] text-center font-mono text-xs">
              {selectedArchId === 'decoder' && (
                <div className="space-y-1">
                  <div className="grid grid-cols-4 gap-1">
                    <div className="p-1.5 bg-amber-500 text-white rounded font-bold">1</div>
                    <div className="p-1.5 bg-stone-200 dark:bg-stone-800 text-stone-400 rounded">0</div>
                    <div className="p-1.5 bg-stone-200 dark:bg-stone-800 text-stone-400 rounded">0</div>
                    <div className="p-1.5 bg-stone-200 dark:bg-stone-800 text-stone-400 rounded">0</div>

                    <div className="p-1.5 bg-amber-500 text-white rounded font-bold">1</div>
                    <div className="p-1.5 bg-amber-500 text-white rounded font-bold">1</div>
                    <div className="p-1.5 bg-stone-200 dark:bg-stone-800 text-stone-400 rounded">0</div>
                    <div className="p-1.5 bg-stone-200 dark:bg-stone-800 text-stone-400 rounded">0</div>

                    <div className="p-1.5 bg-amber-500 text-white rounded font-bold">1</div>
                    <div className="p-1.5 bg-amber-500 text-white rounded font-bold">1</div>
                    <div className="p-1.5 bg-amber-500 text-white rounded font-bold">1</div>
                    <div className="p-1.5 bg-stone-200 dark:bg-stone-800 text-stone-400 rounded">0</div>

                    <div className="p-1.5 bg-amber-500 text-white rounded font-bold">1</div>
                    <div className="p-1.5 bg-amber-500 text-white rounded font-bold">1</div>
                    <div className="p-1.5 bg-amber-500 text-white rounded font-bold">1</div>
                    <div className="p-1.5 bg-amber-500 text-white rounded font-bold">1</div>
                  </div>
                  <span className="text-[10px] text-[#78716c] block pt-1">Causal Lower-Triangular Mask</span>
                </div>
              )}

              {selectedArchId === 'encoder' && (
                <div className="space-y-1">
                  <div className="grid grid-cols-4 gap-1">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className="p-1.5 bg-sky-500 text-white rounded font-bold">
                        1
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-[#78716c] block pt-1">Fully Bidirectional (Dense)</span>
                </div>
              )}

              {selectedArchId === 'encdec' && (
                <div className="space-y-1">
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 bg-sky-50 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-800 rounded">
                      <div className="font-semibold text-sky-900 dark:text-sky-200">Encoder</div>
                      <div className="opacity-80 mt-1">Bidirectional</div>
                    </div>
                    <div className="p-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded">
                      <div className="font-semibold text-amber-900 dark:text-amber-200">Decoder</div>
                      <div className="opacity-80 mt-1">Causal + Cross</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#78716c] block pt-1">Dual Sub-Network Stream</span>
                </div>
              )}
            </div>
          </div>

          {/* Representative Models */}
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-2">
              Representative Models
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeArch.representativeModels.map((model, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded bg-white dark:bg-[#1f2127] border border-[#ece7dc] dark:border-[#282a32] text-xs font-mono text-[#1c1917] dark:text-[#f3f4f6]"
                >
                  {model}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
