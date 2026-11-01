import React, { useState } from 'react';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Layers, ArrowRight, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';
import { NavigationTab } from '../../types';

interface ChapterNode {
  num: string;
  tab: NavigationTab;
  title: string;
  tagline: string;
  math: string;
  tensorIO: string;
  keyTakeaway: string;
}

const CHAPTER_NODES: ChapterNode[] = [
  {
    num: '01',
    tab: 'chapter-1',
    title: 'Text to Tokens',
    tagline: 'Decomposing continuous prose into discrete vocabulary IDs.',
    math: 'V_{\\text{new}} = V \\cup \\{ (t_i, t_j) \\mid \\arg\\max \\text{freq}(t_i, t_j) \\}',
    tensorIO: 'Raw String -> [B, L] Integer IDs',
    keyTakeaway: 'Language models do not read characters or whole words; they process subword chunks tokenized by Byte-Pair Encoding.',
  },
  {
    num: '02',
    tab: 'chapter-2',
    title: 'Understanding Embeddings',
    tagline: 'Translating discrete IDs into continuous high-dimensional geometric vectors.',
    math: '\\mathbf{e}_i = \\mathbf{E}[\\text{token\\_id}_i], \\quad \\mathbf{E} \\in \\mathbb{R}^{|V| \\times d_{\\text{model}}}',
    tensorIO: '[B, L] IDs -> [B, L, d_model] Vectors',
    keyTakeaway: 'Tokens become dense points in a learned 4,096-dimensional manifold where geometric distance mirrors conceptual affinity.',
  },
  {
    num: '03',
    tab: 'chapter-3',
    title: 'Positional Encoding',
    tagline: 'Injecting order and spatial distance into order-blind embeddings.',
    math: '\\mathbf{x}_{m} = \\mathbf{R}_{\\Theta, m} \\mathbf{e}_m \\quad (\\text{RoPE 2D Plane Rotations})',
    tensorIO: '[B, L, d_model] -> [B, L, d_model] Pos-Infused',
    keyTakeaway: 'Without positional encoding, "dog chased cat" equals "cat chased dog". Complex rotary frequencies encode sequence position.',
  },
  {
    num: '04',
    tab: 'chapter-4',
    title: 'The Attention Mechanism',
    tagline: 'Allowing tokens to dynamically converse and pool context.',
    math: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{QK^\\top}{\\sqrt{d_k}} + M \\right) V',
    tensorIO: '[B, L, d_model] -> [B, L, d_model] Contextualized',
    keyTakeaway: 'Every token queries other tokens for relevant cues, routing information dynamically across long-range context.',
  },
  {
    num: '05',
    tab: 'chapter-5',
    title: 'Inside a Transformer',
    tagline: 'The structural engine of residual streams, RMSNorm, and FFN memory banks.',
    math: '\\mathbf{x}_{l+1} = \\mathbf{x}_l + \\text{MHA}(\\text{RMSNorm}(\\mathbf{x}_l)) + \\text{FFN}(\\text{RMSNorm}(\\mathbf{x}_l^{\\prime}))',
    tensorIO: 'Stacked across 32 to 80 Identical Blocks',
    keyTakeaway: 'Residual streams preserve signal through deep networks, while position-wise FFNs act as associative factual memory banks.',
  },
  {
    num: '06',
    tab: 'chapter-6',
    title: 'Next-Token Generation',
    tagline: 'Unembedding hidden states into logits, calibrating entropy, and sampling.',
    math: 'P(w_i) = \\frac{\\exp(z_i / T)}{\\sum_j \\exp(z_j / T)}, \\quad w_{t+1} \\sim P_{\\text{nucleus}}(w)',
    tensorIO: '[B, L, d_model] -> [B, |V|] Logits -> Selected Token',
    keyTakeaway: 'The model projects its final vector back to vocabulary space, filters the candidate distribution, and loops autoregressively.',
  },
];

interface CompletePipelineMapProps {
  onNavigate?: (tab: NavigationTab) => void;
}

export const CompletePipelineMap: React.FC<CompletePipelineMapProps> = ({ onNavigate }) => {
  const [selectedNum, setSelectedNum] = useState<string>('06');

  const activeNode = CHAPTER_NODES.find((n) => n.num === selectedNum) || CHAPTER_NODES[5];

  return (
    <div className="bg-white dark:bg-[#131417] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#ece7dc] dark:border-[#22242b] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            <Layers className="w-4 h-4" />
            <span>Grand Unified Architecture</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            The Complete End-To-End LLM Pipeline
          </h4>
        </div>
        <span className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          All 6 Chapters Unified
        </span>
      </div>

      {/* Nodes Map Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 my-6">
        {CHAPTER_NODES.map((node) => {
          const isSelected = selectedNum === node.num;
          return (
            <button
              key={node.num}
              onClick={() => setSelectedNum(node.num)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#c2410c] dark:border-[#d97706] bg-amber-500/10 ring-1 ring-[#c2410c] dark:ring-[#d97706] shadow-xs'
                  : 'border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#16171b] hover:border-[#cfc6b5]'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] font-mono text-[#78716c] dark:text-[#9ca3af] mb-1">
                <span className="font-bold text-[#c2410c] dark:text-[#d97706]">CH {node.num}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#c2410c] dark:bg-[#d97706]" />}
              </div>
              <div className="font-semibold text-xs text-[#1c1917] dark:text-[#f3f4f6] truncate">
                {node.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Deep-Dive Inspection Card */}
      <div className="p-6 rounded-xl border border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#181a1f] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#ece7dc] dark:border-[#26282f] gap-3">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
              Chapter {activeNode.num} Architectural Stage
            </span>
            <h5 className="text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              {activeNode.title}
            </h5>
          </div>

          {onNavigate && (
            <button
              onClick={() => onNavigate(activeNode.tab)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1f2127] border border-[#ece7dc] dark:border-[#282a32] text-xs font-mono text-[#1c1917] dark:text-[#f3f4f6] hover:text-[#c2410c] dark:hover:text-[#d97706] transition-colors cursor-pointer self-start sm:self-auto"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read Chapter {activeNode.num}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mathematical Formulation */}
        <div className="p-4 bg-white dark:bg-[#121316] rounded-xl border border-[#ece7dc] dark:border-[#26282f] text-center overflow-x-auto">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-1.5">
            Governing Formulation:
          </span>
          <LatexRenderer math={activeNode.math} displayMode={true} />
        </div>

        {/* Prose Insight & Tensor IO */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-mono">
          <div className="md:col-span-8 p-4 bg-white dark:bg-[#121316] rounded-xl border border-[#ece7dc] dark:border-[#26282f] space-y-1">
            <span className="text-[#a8a29e] dark:text-[#6b7280] block text-[11px]">CORE MENTAL MODEL</span>
            <p className="text-[#57534e] dark:text-[#d1d5db] font-sans text-xs sm:text-sm leading-relaxed">
              {activeNode.keyTakeaway}
            </p>
          </div>

          <div className="md:col-span-4 p-4 bg-white dark:bg-[#121316] rounded-xl border border-[#ece7dc] dark:border-[#26282f] space-y-1">
            <span className="text-[#a8a29e] dark:text-[#6b7280] block text-[11px]">TENSOR SHAPE EVOLUTION</span>
            <p className="text-[#1c1917] dark:text-[#f3f4f6] font-semibold text-xs mt-1">
              {activeNode.tensorIO}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
