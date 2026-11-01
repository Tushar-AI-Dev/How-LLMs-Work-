import React, { useState } from 'react';
import { tokenizeTextReal } from '../../services/tokenizerService';
import { ArrowRight, Check, X, AlertCircle } from 'lucide-react';

export const SubwordVsWordComparison: React.FC = () => {
  const comparisonSamples = [
    {
      word: "unprecedented",
      context: "Common prefix + root morphemes",
      wholeWord: { tokens: ["unprecedented"], status: "in-vocab", id: 18210 },
      subword: { tokens: ["un", "pre", "cedented"], ids: [2841, 649, 39102] },
      charLevel: { count: 13 },
    },
    {
      word: "hyperinflationary",
      context: "Complex multi-morpheme economic term",
      wholeWord: { tokens: ["[UNK] (Out of Vocab)"], status: "oov", id: null },
      subword: { tokens: ["hyper", "inflation", "ary"], ids: [8912, 14201, 412] },
      charLevel: { count: 17 },
    },
    {
      word: "neuromorphic",
      context: "Scientific compound terminology",
      wholeWord: { tokens: ["[UNK] (Out of Vocab)"], status: "oov", id: null },
      subword: { tokens: ["neuro", "morphic"], ids: [34102, 19280] },
      charLevel: { count: 12 },
    },
    {
      word: "3.14159265",
      context: "Mathematical constant digits",
      wholeWord: { tokens: ["[UNK] (Unique number)"], status: "oov", id: null },
      subword: { tokens: ["3", ".", "14", "159", "265"], ids: [18, 13, 219, 9410, 8192] },
      charLevel: { count: 10 },
    },
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const active = comparisonSamples[activeIdx];

  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-8 shadow-xs">
      <div className="pb-4 border-b border-[#ece7dc] dark:border-[#22242b] mb-6">
        <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
          Section 07
        </span>
        <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
          Why Not Process Entire Words? The Subword Compromise
        </h3>
        <p className="mt-2 text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          Neither character-level nor whole-word tokenization is practical for modern large language models. Subword tokenization represents a carefully calculated engineering compromise.
        </p>
      </div>

      {/* The 3 Architectural Strategies */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Strategy 1: Character-level */}
        <div className="p-4 bg-[#faf8f5] dark:bg-[#18191f] rounded-lg border border-[#ded7ca] dark:border-[#26282f] space-y-2">
          <span className="font-mono text-xs font-bold text-[#78716c] dark:text-[#9ca3af] block">
            1. Character-Level
          </span>
          <div className="text-xs font-mono text-[#1c1917] dark:text-[#f3f4f6]">
            |V| ≈ 256 bytes
          </div>
          <p className="text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            Tiny vocabulary, zero out-of-vocabulary errors. However, sequence length explodes 4×–5×, causing the quadratic attention cost (O(L²)) to overwhelm GPU memory.
          </p>
        </div>

        {/* Strategy 2: Whole-word */}
        <div className="p-4 bg-[#faf8f5] dark:bg-[#18191f] rounded-lg border border-[#ded7ca] dark:border-[#26282f] space-y-2">
          <span className="font-mono text-xs font-bold text-[#78716c] dark:text-[#9ca3af] block">
            2. Whole-Word
          </span>
          <div className="text-xs font-mono text-[#1c1917] dark:text-[#f3f4f6]">
            |V| &gt; 1,000,000+ words
          </div>
          <p className="text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            Short sequence length, but the vocabulary explodes uncontrollably. Still fails completely on typos, new compound words, and code syntax, crashing on <code>[UNK]</code>.
          </p>
        </div>

        {/* Strategy 3: Subword (The Goldilocks Standard) */}
        <div className="p-4 bg-[#fffaf5] dark:bg-[#1f1a14] rounded-lg border border-[#c2410c] dark:border-[#d97706] space-y-2 ring-1 ring-[#c2410c]/20">
          <span className="font-mono text-xs font-bold text-[#c2410c] dark:text-[#d97706] block">
            3. Subword (BPE Standard)
          </span>
          <div className="text-xs font-mono text-[#c2410c] dark:text-[#d97706]">
            |V| ≈ 32k to 128k tokens
          </div>
          <p className="text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            Common words remain single tokens. Rare, technical, or novel words are systematically decomposed into reusable subwords or byte fallbacks without crashing.
          </p>
        </div>
      </div>

      {/* Interactive Sample Words */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af] mr-1">
            Test case word:
          </span>
          {comparisonSamples.map((sample, i) => (
            <button
              key={sample.word}
              onClick={() => setActiveIdx(i)}
              className={`px-3 py-1 text-xs font-mono rounded cursor-pointer transition-colors ${
                activeIdx === i
                  ? 'bg-[#c2410c] dark:bg-[#d97706] text-white font-bold'
                  : 'bg-[#f4efe6] dark:bg-[#1e2026] text-[#57534e] dark:text-[#9ca3af] hover:text-[#1c1917]'
              }`}
            >
              "{sample.word}"
            </button>
          ))}
        </div>

        {/* Comparative Inspection Board */}
        <div className="p-5 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-lg space-y-4">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#1c1917] dark:text-[#f3f4f6] font-bold text-sm">
              Analyzing: "{active.word}"
            </span>
            <span className="text-[#78716c] dark:text-[#9ca3af]">{active.context}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Whole Word Tokenizer Response */}
            <div className="p-4 bg-white dark:bg-[#141518] rounded border border-[#ded7ca] dark:border-[#282a32]">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="font-semibold text-[#78716c]">Whole-Word Tokenizer:</span>
                {active.wholeWord.status === 'oov' ? (
                  <span className="text-rose-600 font-bold flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> Out of Vocab
                  </span>
                ) : (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Single Token
                  </span>
                )}
              </div>
              <div className="p-2 bg-[#f4efe6] dark:bg-[#1a1c22] rounded font-mono text-xs">
                {active.wholeWord.tokens.join(', ')}
              </div>
              <p className="mt-2 text-[11px] text-[#78716c] dark:text-[#9ca3af]">
                {active.wholeWord.status === 'oov'
                  ? 'Would force the model to emit an [UNK] symbol, discarding all meaning.'
                  : 'Requires massive dictionary to include every inflected grammatical variation.'}
              </p>
            </div>

            {/* Subword BPE Tokenizer Response */}
            <div className="p-4 bg-white dark:bg-[#141518] rounded border border-[#c2410c]/40 dark:border-[#d97706]/40">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="font-semibold text-[#c2410c] dark:text-[#d97706]">Subword (BPE) Tokenizer:</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> {active.subword.tokens.length} Subwords
                </span>
              </div>
              <div className="p-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded font-mono text-xs text-amber-950 dark:text-amber-200 flex flex-wrap gap-1.5">
                {active.subword.tokens.map((sub, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 bg-white dark:bg-[#22242c] rounded border border-amber-300 dark:border-amber-700">
                    "{sub}"
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-[#78716c] dark:text-[#9ca3af]">
                Decomposed into familiar morphemes. The self-attention layers can still reconstruct semantic meaning from the parts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Honest Discussion of Subword Trade-offs */}
      <div className="mt-6 p-4 bg-[#f8f5ee] dark:bg-[#191b21] rounded-lg border border-[#ded7ca] dark:border-[#282a32] text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
        <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6] block mb-1">
          The Hidden Flaw: Arithmetic & Character Spelling
        </span>
        Subword tokenization is not universally flawless. Because words like <code>"apple"</code> and numbers like <code>"159"</code> are swallowed as monolithic token IDs, the LLM has no direct access to individual letters or digits. This is the exact root cause of why LLMs struggle to count letters in words (e.g. "How many r's in strawberry?") and make simple arithmetic errors unless prompted to reason step-by-step.
      </div>
    </div>
  );
};
