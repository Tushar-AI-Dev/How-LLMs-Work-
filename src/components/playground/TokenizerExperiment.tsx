import React, { useState } from 'react';
import { tokenizeTextReal, lookupTokenInVocabulary, TokenDetail } from '../../services/tokenizerService';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Search, Info, Binary, Sparkles, Hash } from 'lucide-react';

interface TokenizerExperimentProps {
  sentence: string;
  onSentenceChange: (text: string) => void;
}

export const TokenizerExperiment: React.FC<TokenizerExperimentProps> = ({
  sentence,
  onSentenceChange,
}) => {
  const result = tokenizeTextReal(sentence);
  const [selectedTokenIdx, setSelectedTokenIdx] = useState<number>(0);
  const [vocabSearch, setVocabSearch] = useState<string>('learning');

  const selectedToken: TokenDetail | undefined = result.tokens[selectedTokenIdx] || result.tokens[0];
  const searchResults = lookupTokenInVocabulary(vocabSearch);

  // Distinct pleasant palette for subword tokens
  const tokenColors = [
    'bg-amber-100 dark:bg-amber-950/50 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-700',
    'bg-sky-100 dark:bg-sky-950/50 text-sky-950 dark:text-sky-200 border-sky-300 dark:border-sky-700',
    'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700',
    'bg-purple-100 dark:bg-purple-950/50 text-purple-950 dark:text-purple-200 border-purple-300 dark:border-purple-700',
    'bg-rose-100 dark:bg-rose-950/50 text-rose-950 dark:text-rose-200 border-rose-300 dark:border-rose-700',
    'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700',
  ];

  return (
    <div className="space-y-8">
      {/* Experiment Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#ece7dc] dark:border-[#26282f]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            <span>Experiment 01</span>
            <span>·</span>
            <span>Subword Segmentation & BPE</span>
          </div>
          <h2 className="text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            Byte-Pair Encoding & Integer Mapping
          </h2>
        </div>
        <div className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          Vocab: <strong className="text-[#1c1917] dark:text-[#f3f4f6]">50,257</strong> BPE tokens (GPT-2/3 standard)
        </div>
      </div>

      {/* Numerical Metrics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 bg-white dark:bg-[#141518] rounded-lg border border-[#e6e0d4] dark:border-[#26282f]">
          <span className="text-[#78716c] dark:text-[#9ca3af] block">Characters</span>
          <span className="text-xl font-semibold text-[#1c1917] dark:text-[#f3f4f6] mt-0.5 block tabular-data">
            {result.charCount}
          </span>
          <span className="text-[10px] text-[#a8a29e] dark:text-[#6b7280]">Raw Unicode bytes</span>
        </div>

        <div className="p-3 bg-white dark:bg-[#141518] rounded-lg border border-[#e6e0d4] dark:border-[#26282f]">
          <span className="text-[#78716c] dark:text-[#9ca3af] block">Tokens Produced</span>
          <span className="text-xl font-semibold text-[#c2410c] dark:text-[#d97706] mt-0.5 block tabular-data">
            {result.tokenCount}
          </span>
          <span className="text-[10px] text-[#a8a29e] dark:text-[#6b7280]">Discrete vocabulary units</span>
        </div>

        <div className="p-3 bg-white dark:bg-[#141518] rounded-lg border border-[#e6e0d4] dark:border-[#26282f]">
          <span className="text-[#78716c] dark:text-[#9ca3af] block">Compression Ratio</span>
          <span className="text-xl font-semibold text-[#1c1917] dark:text-[#f3f4f6] mt-0.5 block tabular-data">
            {result.compressionRatio} : 1
          </span>
          <span className="text-[10px] text-[#a8a29e] dark:text-[#6b7280]">Chars per token</span>
        </div>

        <div className="p-3 bg-white dark:bg-[#141518] rounded-lg border border-[#e6e0d4] dark:border-[#26282f]">
          <span className="text-[#78716c] dark:text-[#9ca3af] block">Average Token Length</span>
          <span className="text-xl font-semibold text-[#1c1917] dark:text-[#f3f4f6] mt-0.5 block tabular-data">
            {result.tokenCount > 0 ? (result.charCount / result.tokenCount).toFixed(1) : 0}
          </span>
          <span className="text-[10px] text-[#a8a29e] dark:text-[#6b7280]">Characters per unit</span>
        </div>
      </div>

      {/* Interactive Token Inspection Grid */}
      <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] font-semibold">
              Segmented Subwords (Click to Inspect):
            </span>
            <span className="text-[11px] text-[#78716c] dark:text-[#9ca3af]">
              Notice leading spaces represented as part of token units
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5 p-4 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-lg min-h-[64px] items-center">
            {result.tokens.length === 0 ? (
              <span className="text-xs text-[#a8a29e] font-mono italic">Enter text in the bar above to generate tokens.</span>
            ) : (
              result.tokens.map((tok, idx) => {
                const isSelected = selectedTokenIdx === idx;
                const colorClass = tokenColors[idx % tokenColors.length];
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedTokenIdx(idx)}
                    className={`px-3 py-1.5 rounded-md border text-xs sm:text-sm font-mono font-medium transition-all cursor-pointer flex items-center gap-2 ${colorClass} ${
                      isSelected
                        ? 'ring-2 ring-[#c2410c] dark:ring-[#d97706] scale-105 shadow-sm'
                        : 'hover:opacity-90'
                    }`}
                  >
                    <span>{tok.text === ' ' ? '␣' : tok.text}</span>
                    <span className="text-[10px] font-mono opacity-60">#{tok.id}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Token Detail Probe */}
        {selectedToken && (
          <div className="p-4 bg-[#f8f5ee] dark:bg-[#1a1c22] border border-[#ded7ca] dark:border-[#282a32] rounded-lg space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#ece7dc] dark:border-[#26282f]">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-[#c2410c] dark:text-[#d97706]" />
                <span className="text-xs font-mono font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
                  Token Probe: Token Index [{selectedTokenIdx}]
                </span>
              </div>
              <span className="text-xs font-mono text-[#c2410c] dark:text-[#d97706] font-bold">
                ID: {selectedToken.id}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <span className="text-[#78716c] dark:text-[#9ca3af] block text-[11px]">Decoded String:</span>
                <span className="text-sm font-semibold text-[#1c1917] dark:text-[#f3f4f6] bg-white dark:bg-[#111215] px-2 py-1 rounded inline-block mt-1 border border-[#e6e0d4] dark:border-[#22242b]">
                  "{selectedToken.text}"
                </span>
              </div>

              <div>
                <span className="text-[#78716c] dark:text-[#9ca3af] block text-[11px]">UTF-8 Byte Length:</span>
                <span className="text-sm font-semibold text-[#1c1917] dark:text-[#f3f4f6] mt-1 block">
                  {selectedToken.byteLength} {selectedToken.byteLength === 1 ? 'byte' : 'bytes'}
                </span>
              </div>

              <div>
                <span className="text-[#78716c] dark:text-[#9ca3af] block text-[11px]">Raw Byte Array:</span>
                <span className="text-xs text-[#57534e] dark:text-[#9ca3af] mt-1 block">
                  [{selectedToken.bytes.join(', ')}]
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Integer Tensor Array Output */}
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] font-semibold block mb-2">
            Integer Vector Input to Embedding Layer:
          </span>
          <div className="p-3 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-lg font-mono text-xs text-[#1c1917] dark:text-[#f3f4f6] overflow-x-auto">
            <span className="text-[#78716c] dark:text-[#9ca3af]">T = </span>
            <span className="text-[#c2410c] dark:text-[#d97706] font-semibold">
              [{result.ids.join(', ')}]
            </span>
            <span className="text-[#78716c] dark:text-[#9ca3af] ml-3 text-[11px]">
              shape: [{result.ids.length}]
            </span>
          </div>
        </div>
      </div>

      {/* Vocabulary Lookup Tool */}
      <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-[#c2410c] dark:text-[#d97706]" />
          <h3 className="font-serif text-lg font-medium text-[#1c1917] dark:text-[#f3f4f6]">
            Vocabulary Lookup Explorer
          </h3>
        </div>
        <p className="text-xs text-[#57534e] dark:text-[#9ca3af]">
          Query the pre-trained BPE dictionary to test whether arbitrary words exist as monolithic tokens or decompose into multiple subwords.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={vocabSearch}
            onChange={(e) => setVocabSearch(e.target.value)}
            placeholder="Type any word (e.g., 'unbelievable', 'transformer', 'GPT')..."
            className="flex-1 px-3.5 py-2 text-xs font-mono bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#ded7ca] dark:border-[#282a32] rounded-lg text-[#1c1917] dark:text-[#f3f4f6] focus:outline-none focus:border-[#c2410c] dark:focus:border-[#d97706]"
          />
        </div>

        {searchResults.length > 0 && (
          <div className="pt-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-2">
              Matches Found in Vocabulary ({searchResults.length}):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {searchResults.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-[#faf8f5] dark:bg-[#1a1c22] rounded border border-[#ded7ca] dark:border-[#282a32] flex items-center justify-between font-mono text-xs"
                >
                  <span className="font-medium text-[#1c1917] dark:text-[#f3f4f6]">
                    "{item.text}"
                  </span>
                  <span className="text-[11px] text-[#c2410c] dark:text-[#d97706] font-semibold">
                    ID: {item.id}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Educational Mathematical Context */}
      <div className="p-4 bg-[#faf8f5] dark:bg-[#111215] border border-[#e6e0d4] dark:border-[#26282f] rounded-lg text-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
          <Info className="w-4 h-4 text-[#c2410c] dark:text-[#d97706]" />
          <span>The BPE Compression Principle</span>
        </div>
        <p className="text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          Byte-Pair Encoding iteratively merges the most frequent pairs of adjacent bytes or characters in the training corpus into a fixed dictionary $|V|$. This guarantees that common words like <em>"the"</em> or <em>"learning"</em> receive a single integer token, while rare or out-of-vocabulary words cleanly segment into subword chunks or byte fallbacks, eliminating vocabulary miss errors.
        </p>
      </div>
    </div>
  );
};
