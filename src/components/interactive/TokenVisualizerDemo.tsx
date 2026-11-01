import React, { useState, useMemo } from 'react';
import { Sparkles, Terminal, Cpu, Info, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface SimulatedToken {
  id: number;
  text: string;
  bytes: number[];
  isSubword: boolean;
  colorIndex: number;
}

const PRESET_SENTENCES = [
  'Transformers predict tokens autoregressively.',
  'Attention is all you need for sequence models.',
  'Tokenization maps human prose into integer tensors.',
  'Rotary Position Embeddings rotate query vectors.',
];

// Color palette for token highlights: restrained, editorial, WCAG compliant
const TOKEN_COLORS = [
  {
    bg: 'bg-amber-100/70 dark:bg-amber-950/40',
    border: 'border-amber-300 dark:border-amber-700/60',
    text: 'text-amber-950 dark:text-amber-200',
    selectedBg: 'bg-amber-200 dark:bg-amber-900/60',
  },
  {
    bg: 'bg-sky-100/70 dark:bg-sky-950/40',
    border: 'border-sky-300 dark:border-sky-700/60',
    text: 'text-sky-950 dark:text-sky-200',
    selectedBg: 'bg-sky-200 dark:bg-sky-900/60',
  },
  {
    bg: 'bg-emerald-100/70 dark:bg-emerald-950/40',
    border: 'border-emerald-300 dark:border-emerald-700/60',
    text: 'text-emerald-950 dark:text-emerald-200',
    selectedBg: 'bg-emerald-200 dark:bg-emerald-900/60',
  },
  {
    bg: 'bg-rose-100/70 dark:bg-rose-950/40',
    border: 'border-rose-300 dark:border-rose-700/60',
    text: 'text-rose-950 dark:text-rose-200',
    selectedBg: 'bg-rose-200 dark:bg-rose-900/60',
  },
  {
    bg: 'bg-purple-100/70 dark:bg-purple-950/40',
    border: 'border-purple-300 dark:border-purple-700/60',
    text: 'text-purple-950 dark:text-purple-200',
    selectedBg: 'bg-purple-200 dark:bg-purple-900/60',
  },
  {
    bg: 'bg-stone-200/70 dark:bg-stone-800/60',
    border: 'border-stone-400 dark:border-stone-600',
    text: 'text-stone-900 dark:text-stone-100',
    selectedBg: 'bg-stone-300 dark:bg-stone-700',
  },
];

// Hash function to generate deterministic pseudo-token IDs
function hashToken(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash % 98000) + 1024;
}

// Byte-Pair Subword segmenter simulation
function tokenizeText(text: string): SimulatedToken[] {
  if (!text) return [];

  // Match words, spaces, punctuations, and split long terms into realistic BPE subwords
  const words = text.match(/([A-Z]?[a-z]+|[A-Z]+|\d+|[^\s\w]|\s+)/g) || [];
  const tokens: SimulatedToken[] = [];
  let colorCounter = 0;

  for (const part of words) {
    // If it's a long word, split into realistic subword stems
    if (part.length > 7 && !/^\s+$/.test(part)) {
      const splitPoint = Math.floor(part.length / 2);
      const sub1 = part.slice(0, splitPoint);
      const sub2 = part.slice(splitPoint);

      tokens.push({
        id: hashToken(sub1),
        text: sub1,
        bytes: Array.from(new TextEncoder().encode(sub1)),
        isSubword: true,
        colorIndex: colorCounter++ % TOKEN_COLORS.length,
      });

      tokens.push({
        id: hashToken(sub2),
        text: sub2,
        bytes: Array.from(new TextEncoder().encode(sub2)),
        isSubword: true,
        colorIndex: colorCounter++ % TOKEN_COLORS.length,
      });
    } else {
      tokens.push({
        id: hashToken(part),
        text: part,
        bytes: Array.from(new TextEncoder().encode(part)),
        isSubword: false,
        colorIndex: colorCounter++ % TOKEN_COLORS.length,
      });
    }
  }

  return tokens;
}

export const TokenVisualizerDemo: React.FC = () => {
  const [inputText, setInputText] = useState(PRESET_SENTENCES[0]);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number | null>(0);

  const tokens = useMemo(() => tokenizeText(inputText), [inputText]);

  const selectedToken =
    selectedTokenIndex !== null && selectedTokenIndex < tokens.length
      ? tokens[selectedTokenIndex]
      : tokens[0] || null;

  const charCount = inputText.length;
  const tokenCount = tokens.length;
  const compressionRatio = tokenCount > 0 ? (charCount / tokenCount).toFixed(2) : '0';

  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-lg p-5 sm:p-7 shadow-xs">
      {/* Header with Title and Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#ece7dc] dark:border-[#22242b]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9a3412] dark:text-[#d97706] font-semibold">
              Interactive Stage
            </span>
            <span className="text-xs text-[#a8a29e] dark:text-[#52525b]">·</span>
            <span className="text-xs text-[#78716c] dark:text-[#9ca3af]">Subword Segmentation</span>
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            Real-Time Token Decomposition
          </h3>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-[#78716c] dark:text-[#9ca3af] mr-1 hidden sm:inline">
            Presets:
          </span>
          {PRESET_SENTENCES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(preset);
                setSelectedTokenIndex(0);
              }}
              className={`
                text-xs px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer
                ${
                  inputText === preset
                    ? 'bg-[#1c1917] text-white dark:bg-[#f3f4f6] dark:text-[#111215] font-medium'
                    : 'bg-[#f4efe6] text-[#57534e] hover:text-[#1c1917] hover:bg-[#eae3d5] dark:bg-[#1f2127] dark:text-[#9ca3af] dark:hover:text-[#f3f4f6]'
                }
              `}
            >
              Preset {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <div className="my-5">
        <label
          htmlFor="interactive-text-input"
          className="block text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] mb-2"
        >
          Input Sentence (Type or edit freely):
        </label>
        <textarea
          id="interactive-text-input"
          rows={2}
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setSelectedTokenIndex(0);
          }}
          className="w-full text-sm font-mono p-3 bg-[#faf8f5] dark:bg-[#0e0f12] text-[#1c1917] dark:text-[#f3f4f6] border border-[#e2dbce] dark:border-[#2a2d36] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c2410c] dark:focus:ring-[#d97706] transition-colors resize-none leading-relaxed"
          placeholder="Type any sentence to inspect how subword tokenization segments it..."
        />
      </div>

      {/* Token Stage: Visual token chips */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          <span>Decomposed Subword Tokens (Click any token to inspect):</span>
          <span>{tokens.length} discrete tokens</span>
        </div>

        <div className="p-4 bg-[#faf8f5] dark:bg-[#0f1013] border border-[#e6e0d4] dark:border-[#26282f] rounded-md min-h-[90px] flex flex-wrap items-center gap-1.5">
          {tokens.length === 0 ? (
            <span className="text-xs text-[#a8a29e] dark:text-[#52525b] font-mono italic">
              Type text above to observe real-time token segmentation...
            </span>
          ) : (
            tokens.map((token, index) => {
              const color = TOKEN_COLORS[token.colorIndex];
              const isSelected = selectedTokenIndex === index;
              const isWhitespace = /^\s+$/.test(token.text);

              return (
                <button
                  key={index}
                  onClick={() => setSelectedTokenIndex(index)}
                  className={`
                    group inline-flex items-center text-xs font-mono px-2 py-1 rounded transition-all cursor-pointer
                    border ${color.border} ${isSelected ? color.selectedBg : color.bg} ${color.text}
                    ${isSelected ? 'ring-2 ring-[#c2410c] dark:ring-[#d97706] shadow-xs scale-105' : 'hover:scale-[1.02]'}
                  `}
                  title={`Token #${index + 1}: ID ${token.id}`}
                >
                  <span className="font-semibold">
                    {isWhitespace ? '␣' : token.text}
                  </span>
                  <span className="ml-1.5 opacity-60 text-[10px] tabular-data">
                    #{token.id}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Inspection Deck: Two-zone responsive breakdown */}
      {selectedToken && (
        <div className="mt-6 pt-5 border-t border-[#ece7dc] dark:border-[#22242b] grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Col 1: Selected Token Details */}
          <div className="p-4 bg-[#f8f5ee] dark:bg-[#191b21] rounded-md border border-[#e6e0d4] dark:border-[#26282f]">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-1">
              Active Token Primitive
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-mono font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
                {/^\s+$/.test(selectedToken.text) ? '[Whitespace]' : `"${selectedToken.text}"`}
              </span>
              <span className="text-xs font-mono text-[#c2410c] dark:text-[#d97706]">
                ID: {selectedToken.id}
              </span>
            </div>
            <div className="mt-2 text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
              Mapped into embedding row <code className="font-mono text-[#1c1917] dark:text-[#f3f4f6]">W_e[{selectedToken.id}]</code>
            </div>
          </div>

          {/* Col 2: UTF-8 Byte Representation */}
          <div className="p-4 bg-[#f8f5ee] dark:bg-[#191b21] rounded-md border border-[#e6e0d4] dark:border-[#26282f]">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-1">
              UTF-8 Byte Sequence
            </span>
            <div className="font-mono text-xs text-[#1c1917] dark:text-[#f3f4f6] flex flex-wrap gap-1.5 mt-1">
              {selectedToken.bytes.map((b, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 bg-white dark:bg-[#22252e] border border-[#dcd4c6] dark:border-[#323642] rounded text-[11px]"
                >
                  0x{b.toString(16).toUpperCase().padStart(2, '0')}
                </span>
              ))}
            </div>
            <div className="mt-2 text-xs text-[#78716c] dark:text-[#9ca3af]">
              {selectedToken.bytes.length} byte{selectedToken.bytes.length !== 1 ? 's' : ''} in vocabulary lookup
            </div>
          </div>

          {/* Col 3: Sequence Compression Metrics */}
          <div className="p-4 bg-[#f8f5ee] dark:bg-[#191b21] rounded-md border border-[#e6e0d4] dark:border-[#26282f]">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-1">
              Compression Metrics
            </span>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div>
                <span className="text-xs text-[#78716c] dark:text-[#9ca3af] block">Efficiency:</span>
                <span className="text-base font-mono font-medium text-[#1c1917] dark:text-[#f3f4f6]">
                  {compressionRatio} <span className="text-xs font-normal text-[#78716c] dark:text-[#9ca3af]">ch/tok</span>
                </span>
              </div>
              <div>
                <span className="text-xs text-[#78716c] dark:text-[#9ca3af] block">Input Tensor:</span>
                <span className="text-base font-mono font-medium text-[#1c1917] dark:text-[#f3f4f6]">
                  [1, {tokenCount}]
                </span>
              </div>
            </div>
            <div className="mt-2 text-xs text-[#78716c] dark:text-[#9ca3af]">
              Ready for positional injection
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
