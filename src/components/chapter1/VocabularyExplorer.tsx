import React, { useState, useMemo } from 'react';
import { lookupTokenInVocabulary, vocabularySize } from '../../services/tokenizerService';
import { Search, BookOpen, Layers, ShieldCheck, Sparkles } from 'lucide-react';

const CURATED_EXPLORER_SAMPLES = [
  { word: "the", desc: "Most frequent English word" },
  { word: "learning", desc: "Common noun / participle verb" },
  { word: "algorithm", desc: "Technical term merged into single token" },
  { word: "quantum", desc: "Single dictionary token" },
  { word: "ing", desc: "Suffix subword" },
  { word: "pre", desc: "Prefix subword" },
  { word: "<|endoftext|>", desc: "Special stream delimiter token" },
];

export const VocabularyExplorer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('learning');

  const searchResults = useMemo(() => {
    return lookupTokenInVocabulary(searchQuery);
  }, [searchQuery]);

  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-8 shadow-xs">
      <div className="pb-4 border-b border-[#ece7dc] dark:border-[#22242b] mb-6">
        <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
          Section 06
        </span>
        <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
          What is a Vocabulary?
        </h3>
        <p className="mt-2 text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          The vocabulary (<code className="font-mono">V</code>) is the complete set of unique tokens a model is capable of reading and generating. It is constructed once before model training and remains strictly fixed.
        </p>
      </div>

      {/* Vocabulary Size Comparison Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3 bg-[#faf8f5] dark:bg-[#181a20] rounded border border-[#ded7ca] dark:border-[#26282f]">
          <span className="text-[10px] font-mono uppercase text-[#78716c] dark:text-[#9ca3af] block">
            GPT-2 / GPT-3
          </span>
          <span className="text-lg font-mono font-bold text-[#1c1917] dark:text-[#f3f4f6]">
            50,257
          </span>
          <span className="text-[10px] text-[#78716c] block">Tokens in V</span>
        </div>

        <div className="p-3 bg-[#faf8f5] dark:bg-[#181a20] rounded border border-[#ded7ca] dark:border-[#26282f]">
          <span className="text-[10px] font-mono uppercase text-[#78716c] dark:text-[#9ca3af] block">
            LLaMA 1 & 2
          </span>
          <span className="text-lg font-mono font-bold text-[#1c1917] dark:text-[#f3f4f6]">
            32,000
          </span>
          <span className="text-[10px] text-[#78716c] block">Tokens in V</span>
        </div>

        <div className="p-3 bg-[#faf8f5] dark:bg-[#181a20] rounded border border-[#c2410c]/30 dark:border-[#d97706]/30">
          <span className="text-[10px] font-mono uppercase text-[#c2410c] dark:text-[#d97706] block font-semibold">
            LLaMA 3
          </span>
          <span className="text-lg font-mono font-bold text-[#c2410c] dark:text-[#d97706]">
            128,256
          </span>
          <span className="text-[10px] text-[#78716c] block">Tokens in V</span>
        </div>

        <div className="p-3 bg-[#faf8f5] dark:bg-[#181a20] rounded border border-[#ded7ca] dark:border-[#26282f]">
          <span className="text-[10px] font-mono uppercase text-[#78716c] dark:text-[#9ca3af] block">
            Gemma 2
          </span>
          <span className="text-lg font-mono font-bold text-[#1c1917] dark:text-[#f3f4f6]">
            256,000
          </span>
          <span className="text-[10px] text-[#78716c] block">Tokens in V</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="vocab-search"
            className="block text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] mb-1.5"
          >
            Search Pretrained Vocabulary:
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716c] dark:text-[#9ca3af]" />
            <input
              id="vocab-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search a word, stem, or token (e.g. attention, ing, cat, code)..."
              className="w-full text-sm font-mono pl-10 pr-4 py-2.5 bg-[#faf8f5] dark:bg-[#0c0d10] text-[#1c1917] dark:text-[#f3f4f6] border border-[#ded7ca] dark:border-[#2a2d36] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c2410c] dark:focus:ring-[#d97706] transition-colors"
            />
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <span className="text-[#78716c] dark:text-[#9ca3af] mr-1">Quick lookups:</span>
          {CURATED_EXPLORER_SAMPLES.map((s) => (
            <button
              key={s.word}
              onClick={() => setSearchQuery(s.word)}
              className="px-2 py-0.5 rounded bg-[#f4efe6] dark:bg-[#1e2026] text-[#57534e] dark:text-[#a1a1aa] hover:text-[#1c1917] dark:hover:text-white transition-colors cursor-pointer"
            >
              {s.word}
            </button>
          ))}
        </div>

        {/* Results Deck */}
        <div className="mt-4 p-4 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-lg">
          <div className="flex justify-between items-center text-xs font-mono text-[#78716c] dark:text-[#9ca3af] mb-3">
            <span>Vocabulary Query Match:</span>
            <span>{searchResults.length} candidate token{searchResults.length !== 1 ? 's' : ''}</span>
          </div>

          {searchResults.length === 0 ? (
            <div className="text-center py-6 text-xs font-mono text-[#a8a29e] dark:text-[#52525b]">
              Type a word above to inspect its vocabulary token entry...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {searchResults.map((t) => (
                <div
                  key={t.id}
                  className="p-3 bg-white dark:bg-[#141518] rounded border border-[#ded7ca] dark:border-[#282a32] flex items-center justify-between"
                >
                  <div>
                    <div className="font-mono text-sm font-bold text-[#1c1917] dark:text-[#f3f4f6]">
                      "{t.text.replace(' ', '␣')}"
                    </div>
                    <span className="text-[11px] text-[#78716c] dark:text-[#9ca3af]">
                      {t.text.startsWith(' ') ? 'Prefixed with whitespace' : 'Standalone / subword'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-mono font-bold text-[#c2410c] dark:text-[#d97706] tabular-data">
                      ID: {t.id}
                    </span>
                    <span className="block text-[10px] font-mono text-[#78716c] dark:text-[#9ca3af]">
                      {t.byteLength} byte{t.byteLength !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
