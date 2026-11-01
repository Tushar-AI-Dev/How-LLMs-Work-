import React, { useState, useMemo } from 'react';
import { tokenizeTextReal, TokenDetail } from '../../services/tokenizerService';
import { RefreshCw, Copy, Check, Info, Binary, Cpu, Hash } from 'lucide-react';

const SAMPLE_PRESETS = [
  "Before a language model can process language, it must turn text into numbers.",
  "Large Language Models predict subwords autoregressively.",
  "Tokenization: 3.14159 is split into discrete mathematical tokens.",
  "Antidisestablishmentarianism is decomposed into multiple subword morphemes.",
];

const TOKEN_COLORS = [
  'bg-amber-100 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-700',
  'bg-sky-100 dark:bg-sky-950/60 text-sky-950 dark:text-sky-200 border-sky-300 dark:border-sky-700',
  'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700',
  'bg-purple-100 dark:bg-purple-950/60 text-purple-950 dark:text-purple-200 border-purple-300 dark:border-purple-700',
  'bg-rose-100 dark:bg-rose-950/60 text-rose-950 dark:text-rose-200 border-rose-300 dark:border-rose-700',
  'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-950 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700',
];

export const InteractivePlayground: React.FC = () => {
  const [inputText, setInputText] = useState(SAMPLE_PRESETS[0]);
  const [selectedTokenIdx, setSelectedTokenIdx] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);

  // Compute real pretrained BPE tokenization
  const result = useMemo(() => tokenizeTextReal(inputText), [inputText]);

  const selectedToken: TokenDetail | null =
    selectedTokenIdx !== null && selectedTokenIdx < result.tokens.length
      ? result.tokens[selectedTokenIdx]
      : result.tokens[0] || null;

  const handleCopyIds = () => {
    navigator.clipboard.writeText(JSON.stringify(result.ids));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-10 shadow-xs">
      {/* Playground Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#ece7dc] dark:border-[#22242b]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
              Live Interactive Workbench
            </span>
            <span className="text-xs text-[#a8a29e] dark:text-[#52525b]">·</span>
            <span className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
              Pretrained BPE Engine (R50K / GPT-2 & GPT-3)
            </span>
          </div>
          <h3 className="font-serif text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            Real-Time Tokenizer Playground
          </h3>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af] mr-1 hidden sm:inline">
            Presets:
          </span>
          {SAMPLE_PRESETS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setInputText(SAMPLE_PRESETS[i]);
                setSelectedTokenIdx(0);
              }}
              className={`px-2.5 py-1 text-xs font-mono rounded cursor-pointer transition-colors ${
                inputText === SAMPLE_PRESETS[i]
                  ? 'bg-[#1c1917] text-white dark:bg-[#f3f4f6] dark:text-[#111215] font-bold'
                  : 'bg-[#f4efe6] dark:bg-[#1f2127] text-[#57534e] dark:text-[#9ca3af] hover:text-[#1c1917]'
              }`}
            >
              Ex {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Editable Text Area */}
      <div className="my-6">
        <div className="flex justify-between items-center mb-2">
          <label
            htmlFor="playground-input"
            className="text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af]"
          >
            Input Natural Language (Type or edit in real-time):
          </label>
          <span className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
            {result.charCount} characters
          </span>
        </div>
        <textarea
          id="playground-input"
          rows={3}
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setSelectedTokenIdx(0);
          }}
          placeholder="Type any word, code, sentence or mathematical expression..."
          className="w-full text-sm sm:text-base font-mono p-4 bg-[#faf8f5] dark:bg-[#0c0d10] text-[#1c1917] dark:text-[#f3f4f6] border border-[#ded7ca] dark:border-[#2a2d36] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c2410c] dark:focus:ring-[#d97706] transition-colors leading-relaxed"
        />
      </div>

      {/* Token Segment Output Canvas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          <span>Decomposed Token Units (Click to inspect vocabulary entry):</span>
          <span className="font-semibold text-[#c2410c] dark:text-[#d97706]">
            {result.tokenCount} tokens
          </span>
        </div>

        <div className="p-5 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-lg min-h-[110px] flex flex-wrap items-center gap-2">
          {result.tokens.length === 0 ? (
            <span className="text-xs font-mono italic text-[#a8a29e] dark:text-[#52525b]">
              Type text in the box above to observe real-time BPE segmentation...
            </span>
          ) : (
            result.tokens.map((token, idx) => {
              const isSelected = selectedTokenIdx === idx;
              const colorClass = TOKEN_COLORS[idx % TOKEN_COLORS.length];
              const isWhitespaceOnly = /^\s+$/.test(token.text);

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedTokenIdx(idx)}
                  className={`
                    group inline-flex items-center text-xs sm:text-sm font-mono px-3 py-1.5 rounded-md transition-all cursor-pointer border
                    ${colorClass}
                    ${
                      isSelected
                        ? 'ring-2 ring-[#c2410c] dark:ring-[#d97706] shadow-sm scale-105 z-10'
                        : 'hover:scale-[1.02]'
                    }
                  `}
                >
                  <span className="font-semibold">
                    {isWhitespaceOnly ? '␣' : token.text.replace(' ', '␣')}
                  </span>
                  <span className="ml-2 text-[10px] opacity-60 tabular-data">
                    #{token.id}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Token Array of IDs */}
      <div className="mt-5 p-3.5 bg-[#f8f5ee] dark:bg-[#16171c] rounded-lg border border-[#ded7ca] dark:border-[#282a32] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="font-mono text-xs overflow-x-auto whitespace-nowrap">
          <span className="text-[#78716c] dark:text-[#9ca3af] mr-2">Token IDs Tensor:</span>
          <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
            [{result.ids.join(', ')}]
          </span>
        </div>

        <button
          onClick={handleCopyIds}
          aria-label="Copy token IDs"
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded bg-white dark:bg-[#22242c] border border-[#ded7ca] dark:border-[#323642] text-[#57534e] dark:text-[#9ca3af] hover:text-[#1c1917] dark:hover:text-white transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy IDs'}</span>
        </button>
      </div>

      {/* Selected Token Deep Inspector Deck */}
      {selectedToken && (
        <div className="mt-8 pt-6 border-t border-[#ece7dc] dark:border-[#22242b] space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
              Vocabulary Entry Inspector
            </span>
            <span className="text-xs text-[#a8a29e] dark:text-[#52525b]">·</span>
            <span className="text-xs text-[#78716c] dark:text-[#9ca3af]">
              Token #{ (selectedTokenIdx ?? 0) + 1 } of {result.tokenCount}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Card 1: Token Primitive Text */}
            <div className="p-4 bg-[#f8f5ee] dark:bg-[#191b21] rounded-lg border border-[#ded7ca] dark:border-[#282a32]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-1">
                Token String
              </span>
              <div className="text-xl font-mono font-bold text-[#1c1917] dark:text-[#f3f4f6]">
                "{selectedToken.text.replace(' ', '␣')}"
              </div>
              <p className="mt-1 text-[11px] text-[#78716c] dark:text-[#9ca3af]">
                {selectedToken.text.startsWith(' ') ? 'Includes leading whitespace' : 'No leading whitespace'}
              </p>
            </div>

            {/* Card 2: Vocabulary ID */}
            <div className="p-4 bg-[#f8f5ee] dark:bg-[#191b21] rounded-lg border border-[#ded7ca] dark:border-[#282a32]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-1">
                Vocabulary Index / ID
              </span>
              <div className="text-xl font-mono font-bold text-[#c2410c] dark:text-[#d97706] tabular-data">
                {selectedToken.id}
              </div>
              <p className="mt-1 text-[11px] text-[#78716c] dark:text-[#9ca3af]">
                Row {selectedToken.id} in Embedding Matrix
              </p>
            </div>

            {/* Card 3: UTF-8 Byte Representation */}
            <div className="p-4 bg-[#f8f5ee] dark:bg-[#191b21] rounded-lg border border-[#ded7ca] dark:border-[#282a32]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-1">
                UTF-8 Bytes
              </span>
              <div className="flex flex-wrap gap-1 font-mono text-xs text-[#1c1917] dark:text-[#f3f4f6] mt-1">
                {selectedToken.bytes.map((b, i) => (
                  <span key={i} className="px-1.5 py-0.5 bg-white dark:bg-[#22242c] rounded border border-[#ded7ca] dark:border-[#2a2d36] text-[11px]">
                    0x{b.toString(16).toUpperCase().padStart(2, '0')}
                  </span>
                ))}
              </div>
              <p className="mt-1 text-[11px] text-[#78716c] dark:text-[#9ca3af]">
                {selectedToken.byteLength} byte{selectedToken.byteLength !== 1 ? 's' : ''} in unicode encoding
              </p>
            </div>

            {/* Card 4: Compression Metric */}
            <div className="p-4 bg-[#f8f5ee] dark:bg-[#191b21] rounded-lg border border-[#ded7ca] dark:border-[#282a32]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-1">
                Compression Metric
              </span>
              <div className="text-xl font-mono font-bold text-[#1c1917] dark:text-[#f3f4f6] tabular-data">
                {result.compressionRatio} <span className="text-xs font-normal text-[#78716c]">chars/tok</span>
              </div>
              <p className="mt-1 text-[11px] text-[#78716c] dark:text-[#9ca3af]">
                Natural English averages ~4 chars/token
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
