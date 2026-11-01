import React from 'react';
import { RefreshCw, RotateCcw, Sparkles, Send } from 'lucide-react';

export const PLAYGROUND_PRESETS = [
  { id: 'cat', text: 'The cat sat on the mat.' },
  { id: 'parallel', text: 'Transformers process tokens in parallel.' },
  { id: 'generation', text: 'Language models generate text one token at a time.' },
  { id: 'coref', text: "The animal didn't cross because it was tired." },
];

interface SharedContextBarProps {
  sentence: string;
  onSentenceChange: (text: string) => void;
  tokenCount: number;
  onReset: () => void;
}

export const SharedContextBar: React.FC<SharedContextBarProps> = ({
  sentence,
  onSentenceChange,
  tokenCount,
  onReset,
}) => {
  return (
    <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#ece7dc] dark:border-[#22242b]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#c2410c] dark:bg-[#d97706] animate-pulse" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1c1917] dark:text-[#f3f4f6]">
            Shared Input Sequence
          </span>
          <span className="text-xs text-[#78716c] dark:text-[#9ca3af] hidden sm:inline">
            (Propagates across Tokenizer, Embeddings, Positional & Attention labs)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#faf8f5] dark:bg-[#1a1c22] border border-[#e6e0d4] dark:border-[#26282f] text-[#57534e] dark:text-[#9ca3af]">
            Sequence: <strong className="text-[#c2410c] dark:text-[#d97706]">{tokenCount}</strong> tokens
          </span>
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded bg-[#f4efe6] dark:bg-[#1f2127] text-[#57534e] dark:text-[#9ca3af] hover:text-[#1c1917] dark:hover:text-[#f3f4f6] transition-colors cursor-pointer"
            title="Reset to default example"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <div className="mt-3.5 space-y-3">
        {/* Custom Input */}
        <div className="relative flex items-center">
          <input
            type="text"
            value={sentence}
            onChange={(e) => onSentenceChange(e.target.value)}
            placeholder="Type any sentence to explore its internal representations..."
            className="w-full px-3.5 py-2 text-sm font-sans bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#ded7ca] dark:border-[#282a32] rounded-lg text-[#1c1917] dark:text-[#f3f4f6] focus:outline-none focus:border-[#c2410c] dark:focus:border-[#d97706] pr-20"
          />
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] mr-1">
            Presets:
          </span>
          {PLAYGROUND_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSentenceChange(preset.text)}
              className={`px-2.5 py-1 text-xs rounded transition-all cursor-pointer font-sans ${
                sentence === preset.text
                  ? 'bg-[#1c1917] text-white dark:bg-[#f3f4f6] dark:text-[#111215] font-medium shadow-xs'
                  : 'bg-[#f4efe6] dark:bg-[#1a1c22] text-[#57534e] dark:text-[#9ca3af] hover:text-[#1c1917] dark:hover:text-[#f3f4f6] border border-[#e6e0d4] dark:border-[#26282f]'
              }`}
            >
              "{preset.text.length > 32 ? preset.text.slice(0, 30) + '…' : preset.text}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
