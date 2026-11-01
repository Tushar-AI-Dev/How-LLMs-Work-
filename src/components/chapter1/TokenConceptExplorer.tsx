import React, { useState } from 'react';
import { tokenizeTextReal } from '../../services/tokenizerService';
import { Eye, Info, Sparkles, Check } from 'lucide-react';

export const TokenConceptExplorer: React.FC = () => {
  const examplePhrases = [
    { title: "Standard Words", text: "Hello world" },
    { title: "Single Long Word", text: "Tokenization" },
    { title: "Morpheme Affixes", text: "unbelievable" },
    { title: "Mixed Punctuation", text: "I love machine learning!" },
  ];

  const [activePhraseIdx, setActivePhraseIdx] = useState(0);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showIds, setShowIds] = useState(true);

  const activePhrase = examplePhrases[activePhraseIdx].text;
  const tokenResult = tokenizeTextReal(activePhrase);

  const colors = [
    'bg-amber-100 dark:bg-amber-950/50 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-700',
    'bg-sky-100 dark:bg-sky-950/50 text-sky-950 dark:text-sky-200 border-sky-300 dark:border-sky-700',
    'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700',
    'bg-purple-100 dark:bg-purple-950/50 text-purple-950 dark:text-purple-200 border-purple-300 dark:border-purple-700',
    'bg-rose-100 dark:bg-rose-950/50 text-rose-950 dark:text-rose-200 border-rose-300 dark:border-rose-700',
    'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-200 border-stone-400 dark:border-stone-600',
  ];

  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ece7dc] dark:border-[#22242b] mb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            Interactive Concept Demonstrator
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
            Token Boundaries & Morphology
          </h3>
        </div>

        {/* Toggle Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBoundaries(!showBoundaries)}
            className={`px-3 py-1 text-xs font-mono rounded cursor-pointer transition-colors border ${
              showBoundaries
                ? 'bg-[#1c1917] text-white dark:bg-[#f3f4f6] dark:text-[#111215] border-transparent font-bold'
                : 'bg-[#faf8f5] dark:bg-[#1a1c22] text-[#78716c] dark:text-[#9ca3af] border-[#ded7ca] dark:border-[#2a2d36]'
            }`}
          >
            Boundaries: {showBoundaries ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={() => setShowIds(!showIds)}
            className={`px-3 py-1 text-xs font-mono rounded cursor-pointer transition-colors border ${
              showIds
                ? 'bg-[#1c1917] text-white dark:bg-[#f3f4f6] dark:text-[#111215] border-transparent font-bold'
                : 'bg-[#faf8f5] dark:bg-[#1a1c22] text-[#78716c] dark:text-[#9ca3af] border-[#ded7ca] dark:border-[#2a2d36]'
            }`}
          >
            Token IDs: {showIds ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Preset Phrases Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {examplePhrases.map((phrase, idx) => (
          <button
            key={idx}
            onClick={() => setActivePhraseIdx(idx)}
            className={`px-3.5 py-1.5 text-xs rounded-md transition-colors font-medium cursor-pointer ${
              activePhraseIdx === idx
                ? 'bg-[#c2410c] dark:bg-[#d97706] text-white font-bold'
                : 'bg-[#f4efe6] dark:bg-[#1f2127] text-[#57534e] dark:text-[#9ca3af] hover:text-[#1c1917] dark:hover:text-[#f3f4f6]'
            }`}
          >
            {phrase.title}: <span className="font-mono font-normal">"{phrase.text}"</span>
          </button>
        ))}
      </div>

      {/* Interactive Visualization Arena */}
      <div className="p-6 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-lg text-center space-y-4">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block">
          Segmented Token Breakdown (Real Pretrained BPE Engine)
        </span>

        {/* Token Blocks */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {tokenResult.tokens.map((tok, i) => {
            const colorClass = colors[i % colors.length];
            return (
              <div
                key={i}
                className={`
                  inline-flex items-center gap-2 px-3.5 py-2 rounded-md font-mono text-sm sm:text-base font-semibold shadow-xs transition-all
                  ${showBoundaries ? colorClass : 'bg-transparent border border-transparent text-[#1c1917] dark:text-[#f3f4f6]'}
                `}
              >
                <span>{tok.text.replace(' ', '␣')}</span>
                {showIds && (
                  <span className="text-[11px] font-mono opacity-65 border-l border-current/30 pl-1.5">
                    #{tok.id}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Structural Metrics */}
        <div className="pt-3 border-t border-[#ece7dc] dark:border-[#22242b] flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          <div>
            <span>Raw text: </span>
            <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">"{activePhrase}"</span>
          </div>
          <div>
            <span>Characters: </span>
            <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">{activePhrase.length}</span>
          </div>
          <div>
            <span>Tokens: </span>
            <span className="font-semibold text-[#c2410c] dark:text-[#d97706]">{tokenResult.tokenCount}</span>
          </div>
        </div>
      </div>

      {/* Key Architectural Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
        <div className="p-4 bg-[#f8f5ee] dark:bg-[#191b21] rounded-lg border border-[#ded7ca] dark:border-[#282a32]">
          <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6] block mb-1">
            Spaces are part of tokens
          </span>
          In Byte-Pair Encoding, the leading whitespace is represented as a character symbol (often rendered as <code>␣</code> or <code>Ġ</code>). Therefore, <code>" cat"</code> and <code>"cat"</code> are completely distinct tokens with different integer IDs!
        </div>

        <div className="p-4 bg-[#f8f5ee] dark:bg-[#191b21] rounded-lg border border-[#ded7ca] dark:border-[#282a32]">
          <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6] block mb-1">
            Tokenizers are model-specific
          </span>
          Never assume all models tokenize identically. GPT-4 uses Tiktoken with 100k tokens; LLaMA 3 uses a 128k vocabulary; older models use 32k or 50k. Each vocabulary yields different subword boundaries.
        </div>
      </div>
    </div>
  );
};
