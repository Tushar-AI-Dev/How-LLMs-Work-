import React from 'react';
import { SimulatorForwardPass } from '../../services/simulatorEngine';
import { Crosshair, Hash, Binary, Layers } from 'lucide-react';

interface Stage1TokenizationProps {
  sim: SimulatorForwardPass;
  trackedTokenIdx: number;
  onSelectToken: (idx: number) => void;
}

export const Stage1Tokenization: React.FC<Stage1TokenizationProps> = ({
  sim,
  trackedTokenIdx,
  onSelectToken,
}) => {
  const tokenColors = [
    'bg-amber-100 dark:bg-amber-950/50 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-700',
    'bg-sky-100 dark:bg-sky-950/50 text-sky-950 dark:text-sky-200 border-sky-300 dark:border-sky-700',
    'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700',
    'bg-purple-100 dark:bg-purple-950/50 text-purple-950 dark:text-purple-200 border-purple-300 dark:border-purple-700',
    'bg-rose-100 dark:bg-rose-950/50 text-rose-950 dark:text-rose-200 border-rose-300 dark:border-rose-700',
    'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700',
  ];

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#ece7dc] dark:border-[#26282f]">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            Stage 01 of 07
          </span>
          <h3 className="text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
            Tokenization: Text to Discrete Integers
          </h3>
        </div>
        <div className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          Tensor Shape: <strong className="text-[#c2410c] dark:text-[#d97706]">{sim.stage1.shape}</strong>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 bg-white dark:bg-[#141518] rounded-lg border border-[#e6e0d4] dark:border-[#26282f]">
          <span className="text-[#78716c] dark:text-[#9ca3af] block">Characters</span>
          <span className="text-xl font-bold text-[#1c1917] dark:text-[#f3f4f6] mt-0.5 block tabular-data">
            {sim.stage1.charCount}
          </span>
          <span className="text-[10px] text-[#a8a29e] dark:text-[#6b7280]">Raw characters</span>
        </div>

        <div className="p-3 bg-white dark:bg-[#141518] rounded-lg border border-[#e6e0d4] dark:border-[#26282f]">
          <span className="text-[#78716c] dark:text-[#9ca3af] block">Discrete Tokens</span>
          <span className="text-xl font-bold text-[#c2410c] dark:text-[#d97706] mt-0.5 block tabular-data">
            {sim.stage1.tokenCount}
          </span>
          <span className="text-[10px] text-[#a8a29e] dark:text-[#6b7280]">Vocabulary items</span>
        </div>

        <div className="p-3 bg-white dark:bg-[#141518] rounded-lg border border-[#e6e0d4] dark:border-[#26282f]">
          <span className="text-[#78716c] dark:text-[#9ca3af] block">Compression</span>
          <span className="text-xl font-bold text-[#1c1917] dark:text-[#f3f4f6] mt-0.5 block tabular-data">
            {sim.stage1.compressionRatio}:1
          </span>
          <span className="text-[10px] text-[#a8a29e] dark:text-[#6b7280]">Chars per token</span>
        </div>

        <div className="p-3 bg-white dark:bg-[#141518] rounded-lg border border-[#e6e0d4] dark:border-[#26282f]">
          <span className="text-[#78716c] dark:text-[#9ca3af] block">Vocab Capacity</span>
          <span className="text-xl font-bold text-[#1c1917] dark:text-[#f3f4f6] mt-0.5 block tabular-data">
            50,257
          </span>
          <span className="text-[10px] text-[#a8a29e] dark:text-[#6b7280]">R50K BPE Dict</span>
        </div>
      </div>

      {/* Interactive Token Sequence Grid */}
      <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] font-semibold">
            Tokenized Sequence (Click any token to track throughout the pipeline):
          </span>
          <span className="text-xs font-mono text-[#c2410c] dark:text-[#d97706] flex items-center gap-1">
            <Crosshair className="w-3.5 h-3.5" />
            <span>Tracking Token #{trackedTokenIdx}</span>
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5 p-4 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#ded7ca] dark:border-[#282a32] rounded-lg items-center min-h-[64px]">
          {sim.tokens.map((tok, idx) => {
            const isTracked = trackedTokenIdx === idx;
            const colorClass = tokenColors[idx % tokenColors.length];

            return (
              <button
                key={idx}
                onClick={() => onSelectToken(idx)}
                className={`px-3 py-1.5 rounded-md border text-xs sm:text-sm font-mono font-medium transition-all cursor-pointer flex items-center gap-2 ${colorClass} ${
                  isTracked
                    ? 'ring-2 ring-[#c2410c] dark:ring-[#d97706] scale-105 shadow-sm font-bold'
                    : 'hover:opacity-90'
                }`}
              >
                <span>{tok.text === ' ' ? '␣' : tok.text}</span>
                <span className="text-[10px] opacity-75 font-mono">#{tok.id}</span>
                {isTracked && <span className="text-[10px] text-[#c2410c] dark:text-[#d97706]">●</span>}
              </button>
            );
          })}
        </div>

        {/* Integer Tensor Output */}
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-2 font-semibold">
            Input Tensor Fed to Embedding Layer:
          </span>
          <div className="p-3 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#ded7ca] dark:border-[#282a32] rounded-lg font-mono text-xs text-[#1c1917] dark:text-[#f3f4f6] overflow-x-auto flex items-center gap-2">
            <span className="text-[#78716c] dark:text-[#9ca3af]">T = </span>
            <span className="text-[#c2410c] dark:text-[#d97706] font-bold">
              [{sim.tokens.map((t) => t.id).join(', ')}]
            </span>
            <span className="text-[#78716c] dark:text-[#9ca3af] text-[11px] ml-2">
              (shape: [{sim.seqLen}])
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
