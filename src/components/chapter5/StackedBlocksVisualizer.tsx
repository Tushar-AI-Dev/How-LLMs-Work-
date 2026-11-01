import React, { useState } from 'react';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Layers, Sliders, Sparkles, Compass, CheckCircle } from 'lucide-react';

interface LayerDepthInfo {
  layer: number;
  stageName: string;
  focusArea: string;
  linguisticAbstraction: string;
  attentionPattern: string;
  vectorStateExample: {
    it: string;
    tired: string;
    cross: string;
  };
}

const DEPTH_STAGES: LayerDepthInfo[] = [
  {
    layer: 0,
    stageName: 'Input Embeddings + Positional',
    focusArea: 'Context-free Lexical Space',
    linguisticAbstraction: 'Static token vectors from learned lookup table plus position offset.',
    attentionPattern: 'No cross-token interaction yet. Tokens are isolated coordinates.',
    vectorStateExample: {
      it: 'Generic third-person singular neuter pronoun (neutral reference vector).',
      tired: 'Physiological exhaustion state / fatigue dictionary definition.',
      cross: 'Action verb "to traverse from one side to the other".',
    },
  },
  {
    layer: 4,
    stageName: 'Early Blocks (Layers 1–6)',
    focusArea: 'Local Syntax & Phrase Structure',
    linguisticAbstraction: 'Detects adjacent token groupings: "didn\'t cross", "the animal", "was tired".',
    attentionPattern: 'Heads attend strongly to adjacent previous tokens and syntactic heads.',
    vectorStateExample: {
      it: 'Marked as syntactic subject of the subordinate clause ("it was...").',
      tired: 'Bound to preceding copula "was" as a predicative adjective phrase.',
      cross: 'Bound with negation auxiliary "didn\'t", inverting verb polarity to negated action.',
    },
  },
  {
    layer: 14,
    stageName: 'Middle Blocks (Layers 7–18)',
    focusArea: 'Coreference Resolution & Dependencies',
    linguisticAbstraction: 'Resolves ambiguous references. Attention heads map "it" directly to "animal".',
    attentionPattern: 'Long-range attention links "it" (token 9) with "animal" (token 2).',
    vectorStateExample: {
      it: 'Merged representation: 78% weight shifted toward "animal" animate entity vector.',
      tired: 'Connected to clause conjunction "because", establishing condition for inaction.',
      cross: 'Linked to destination "street" as transitive direct object of attempted action.',
    },
  },
  {
    layer: 24,
    stageName: 'Upper-Middle Blocks (Layers 19–26)',
    focusArea: 'World Knowledge & Common Sense Reasoning',
    linguisticAbstraction: 'FFN memory keys retrieve physical world priors: tired entities seek rest, avoiding exertion.',
    attentionPattern: 'Causal semantic heads bind the negation "didn\'t cross" directly to the causal reason "tired".',
    vectorStateExample: {
      it: 'Fully contextualized as the weary, animate animal unable to cross the street.',
      tired: 'Activated factual world-state: physical exhaustion directly explains inability to move.',
      cross: 'Annotated with causal barrier: failed physical action attributed to exhaustion.',
    },
  },
  {
    layer: 32,
    stageName: 'Final Blocks (Layers 27–32)',
    focusArea: 'Output Prediction & Logits Conditioning',
    linguisticAbstraction: 'Representation shifts toward predicting plausible continuation tokens.',
    attentionPattern: 'Final token vectors maximize alignment with candidate next-token unembedding vectors.',
    vectorStateExample: {
      it: 'Informs downstream tokens of ongoing animal referent.',
      tired: 'Strong linear projection toward punctuation (".") or continuation conjunctions ("and").',
      cross: 'Integrated into holistic narrative representation of sequence.',
    },
  },
];

export const StackedBlocksVisualizer: React.FC = () => {
  const [selectedStageIdx, setSelectedStageIdx] = useState<number>(2); // Default to middle blocks
  const [selectedToken, setSelectedToken] = useState<'it' | 'tired' | 'cross'>('it');

  const currentStage = DEPTH_STAGES[selectedStageIdx];

  return (
    <div className="bg-white dark:bg-[#131417] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#ece7dc] dark:border-[#22242b] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            <Layers className="w-4 h-4" />
            <span>Depth Representation Evolution</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            Stacking 32 Transformer Blocks
          </h4>
        </div>

        {/* Token Probe Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">Probe Token:</span>
          <div className="flex rounded-lg p-1 bg-[#faf8f5] dark:bg-[#1a1c22] border border-[#ece7dc] dark:border-[#282a32]">
            {(['it', 'tired', 'cross'] as const).map((tok) => (
              <button
                key={tok}
                onClick={() => setSelectedToken(tok)}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  selectedToken === tok
                    ? 'bg-[#1c1917] text-white dark:bg-white dark:text-[#1c1917] font-semibold shadow-xs'
                    : 'text-[#78716c] dark:text-[#9ca3af] hover:text-[#1c1917]'
                }`}
              >
                "{tok}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Context Sentence with Highlighted Token */}
      <div className="my-6 p-4 rounded-xl border border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#181a1f] flex flex-wrap items-center justify-center gap-1.5 text-sm sm:text-base font-serif">
        <span className="text-[#57534e] dark:text-[#9ca3af]">"The animal didn't</span>
        <span className={selectedToken === 'cross' ? 'px-1.5 py-0.5 rounded bg-amber-500/20 text-[#c2410c] dark:text-[#d97706] font-bold underline' : ''}>
          cross
        </span>
        <span className="text-[#57534e] dark:text-[#9ca3af]">the street because</span>
        <span className={selectedToken === 'it' ? 'px-1.5 py-0.5 rounded bg-amber-500/20 text-[#c2410c] dark:text-[#d97706] font-bold underline' : ''}>
          it
        </span>
        <span className="text-[#57534e] dark:text-[#9ca3af]">was</span>
        <span className={selectedToken === 'tired' ? 'px-1.5 py-0.5 rounded bg-amber-500/20 text-[#c2410c] dark:text-[#d97706] font-bold underline' : ''}>
          tired.
        </span>
        <span className="text-[#57534e] dark:text-[#9ca3af]">"</span>
      </div>

      {/* Layer Depth Slider / Selector */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-[#78716c] dark:text-[#9ca3af] uppercase tracking-wider">
            Network Depth Progression (32 Layers)
          </span>
          <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
            {currentStage.stageName}
          </span>
        </div>

        {/* Stage Buttons */}
        <div className="grid grid-cols-5 gap-2">
          {DEPTH_STAGES.map((st, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedStageIdx(idx)}
              className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                selectedStageIdx === idx
                  ? 'border-[#c2410c] dark:border-[#d97706] bg-amber-500/10 text-[#1c1917] dark:text-[#f3f4f6] font-semibold'
                  : 'border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#1a1c22] text-[#78716c] dark:text-[#9ca3af] hover:border-[#cfc6b5]'
              }`}
            >
              <div className="text-[10px] font-mono opacity-80">
                {st.layer === 0 ? 'L0' : `L${st.layer}`}
              </div>
              <div className="text-xs font-medium truncate mt-0.5">
                {st.layer === 0 ? 'Input' : st.layer === 32 ? 'Final' : `Layer ${st.layer}`}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Stage Representation Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-xl border border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#181a1f]">
        <div className="lg:col-span-7 space-y-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
              Cognitive Stage Focus: {currentStage.focusArea}
            </span>
            <p className="text-sm text-[#1c1917] dark:text-[#f3f4f6] mt-1 leading-relaxed">
              {currentStage.linguisticAbstraction}
            </p>
          </div>

          <div className="p-3 bg-white dark:bg-[#15161a] rounded-lg border border-[#ece7dc] dark:border-[#26282f] text-xs font-mono space-y-1">
            <span className="text-[#a8a29e] dark:text-[#6b7280] block text-[11px]">ATTENTION BEHAVIOR</span>
            <p className="text-[#57534e] dark:text-[#d1d5db]">{currentStage.attentionPattern}</p>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white dark:bg-[#15161a] p-4 rounded-xl border border-[#ece7dc] dark:border-[#26282f] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono border-b border-[#ece7dc] dark:border-[#26282f] pb-2 mb-3">
              <span className="text-[#78716c] dark:text-[#9ca3af]">Vector State Probe</span>
              <span className="font-bold text-[#c2410c] dark:text-[#d97706]">"{selectedToken}"</span>
            </div>
            <p className="text-xs text-[#1c1917] dark:text-[#f3f4f6] leading-relaxed">
              {currentStage.vectorStateExample[selectedToken]}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#ece7dc] dark:border-[#26282f] flex items-center justify-between text-[11px] font-mono text-[#78716c] dark:text-[#9ca3af]">
            <span>Layer Index: {currentStage.layer}/32</span>
            <span>Residual State Norm: Stabilized</span>
          </div>
        </div>
      </div>
    </div>
  );
};
