import React, { useState } from 'react';
import { MINI_ATTENTION_SEQUENCE, MINI_X, MINI_W_Q, MINI_W_K, MINI_W_V, matmul, dot } from '../../services/attentionService';
import { Search, Tag, Database, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';

export const QkvConceptExplorer: React.FC = () => {
  const [selectedTokenIdx, setSelectedTokenIdx] = useState<number>(1); // default "cat"
  const [compareKeyIdx, setCompareKeyIdx] = useState<number>(2); // default "sat"

  // Compute Q, K, V matrices dynamically
  const Q = matmul(MINI_X, MINI_W_Q);
  const K = matmul(MINI_X, MINI_W_K);
  const V = matmul(MINI_X, MINI_W_V);

  const selectedToken = MINI_ATTENTION_SEQUENCE[selectedTokenIdx];
  const queryVector = Q[selectedTokenIdx];
  const keyVector = K[compareKeyIdx];
  const valueVector = V[compareKeyIdx];

  const rawDotProduct = dot(queryVector, keyVector);

  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-8 shadow-xs">
      <div className="pb-4 border-b border-[#ece7dc] dark:border-[#22242b] mb-6">
        <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
          Section 04 · The Triad
        </span>
        <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
          Query, Key, and Value: The Mathematical Roles
        </h3>
        <p className="mt-2 text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          How do tokens communicate without chaos? The Transformer assigns each token three distinct continuous vector representations derived via linear projections: <strong>Query</strong>, <strong>Key</strong>, and <strong>Value</strong>.
        </p>
      </div>

      {/* The 3 Core Roles Definition Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* QUERY */}
        <div className="p-4 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#ded7ca] dark:border-[#282a32] rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#c2410c] dark:text-[#d97706]">
            <Search className="w-4 h-4" />
            <span>1. QUERY (Q)</span>
          </div>
          <h4 className="font-serif text-sm font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
            "What information am I seeking?"
          </h4>
          <p className="text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            The active query sent by the token currently being processed. It asks: <em>"Which contextual traits do I need to disambiguate myself?"</em>
          </p>
        </div>

        {/* KEY */}
        <div className="p-4 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#ded7ca] dark:border-[#282a32] rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0284c7]">
            <Tag className="w-4 h-4" />
            <span>2. KEY (K)</span>
          </div>
          <h4 className="font-serif text-sm font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
            "What traits do I advertise?"
          </h4>
          <p className="text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            The public tag broadcasted by every token. If a token's Key matches another token's Query, their dot product produces a high attention score.
          </p>
        </div>

        {/* VALUE */}
        <div className="p-4 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#ded7ca] dark:border-[#282a32] rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            <Database className="w-4 h-4" />
            <span>3. VALUE (V)</span>
          </div>
          <h4 className="font-serif text-sm font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
            "What content will I transmit?"
          </h4>
          <p className="text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            The actual semantic payload. Once attention weights are calculated, the model takes a weighted sum of these Value vectors to produce the output.
          </p>
        </div>
      </div>

      {/* Interactive QKV Inspector */}
      <div className="p-6 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#ded7ca] dark:border-[#282a32]">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1c1917] dark:text-[#f3f4f6]">
            Interactive QKV Inspector: 4-Token Sequence
          </span>
          <span className="text-[11px] font-mono text-[#78716c]">
            d_k = 4 dimensions (illustrative)
          </span>
        </div>

        {/* Token Selector Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[#78716c] dark:text-[#9ca3af] mb-1.5 font-semibold">
              Select Query Token (The Seeker):
            </label>
            <div className="flex flex-wrap gap-2">
              {MINI_ATTENTION_SEQUENCE.map((tok, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTokenIdx(idx)}
                  className={`px-3 py-1.5 text-xs font-mono rounded cursor-pointer transition-all border ${
                    selectedTokenIdx === idx
                      ? 'bg-[#c2410c] dark:bg-[#d97706] text-white border-transparent font-bold shadow-xs'
                      : 'bg-white dark:bg-[#16171c] text-[#44403c] dark:text-[#d1d5db] border-[#ded7ca] dark:border-[#282a32] hover:border-[#c2410c]'
                  }`}
                >
                  q: "{tok}" (Pos {idx})
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#78716c] dark:text-[#9ca3af] mb-1.5 font-semibold">
              Compare with Candidate Key Token:
            </label>
            <div className="flex flex-wrap gap-2">
              {MINI_ATTENTION_SEQUENCE.map((tok, idx) => (
                <button
                  key={idx}
                  onClick={() => setCompareKeyIdx(idx)}
                  className={`px-3 py-1.5 text-xs font-mono rounded cursor-pointer transition-all border ${
                    compareKeyIdx === idx
                      ? 'bg-[#0284c7] text-white border-transparent font-bold shadow-xs'
                      : 'bg-white dark:bg-[#16171c] text-[#44403c] dark:text-[#d1d5db] border-[#ded7ca] dark:border-[#282a32] hover:border-[#0284c7]'
                  }`}
                >
                  k: "{tok}" (Pos {idx})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Vector Display Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Query Vector */}
          <div className="p-4 bg-white dark:bg-[#141518] rounded-lg border border-amber-300 dark:border-amber-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#c2410c] dark:text-[#d97706]">
                Query q("{MINI_ATTENTION_SEQUENCE[selectedTokenIdx]}")
              </span>
              <span className="text-[10px] text-[#78716c]">X[{selectedTokenIdx}] · W_Q</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 font-mono text-xs">
              {queryVector.map((val, i) => (
                <div
                  key={i}
                  className="p-1.5 rounded bg-amber-50 dark:bg-amber-950/40 text-center font-semibold text-[#1c1917] dark:text-[#f3f4f6]"
                >
                  <div className="text-[9px] text-[#78716c]">d{i}</div>
                  {val.toFixed(2)}
                </div>
              ))}
            </div>
          </div>

          {/* Key Vector */}
          <div className="p-4 bg-white dark:bg-[#141518] rounded-lg border border-sky-300 dark:border-sky-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#0284c7]">
                Key k("{MINI_ATTENTION_SEQUENCE[compareKeyIdx]}")
              </span>
              <span className="text-[10px] text-[#78716c]">X[{compareKeyIdx}] · W_K</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 font-mono text-xs">
              {keyVector.map((val, i) => (
                <div
                  key={i}
                  className="p-1.5 rounded bg-sky-50 dark:bg-sky-950/40 text-center font-semibold text-[#1c1917] dark:text-[#f3f4f6]"
                >
                  <div className="text-[9px] text-[#78716c]">d{i}</div>
                  {val.toFixed(2)}
                </div>
              ))}
            </div>
          </div>

          {/* Value Vector */}
          <div className="p-4 bg-white dark:bg-[#141518] rounded-lg border border-emerald-300 dark:border-emerald-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                Value v("{MINI_ATTENTION_SEQUENCE[compareKeyIdx]}")
              </span>
              <span className="text-[10px] text-[#78716c]">X[{compareKeyIdx}] · W_V</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 font-mono text-xs">
              {valueVector.map((val, i) => (
                <div
                  key={i}
                  className="p-1.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-center font-semibold text-[#1c1917] dark:text-[#f3f4f6]"
                >
                  <div className="text-[9px] text-[#78716c]">d{i}</div>
                  {val.toFixed(2)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pairwise Alignment Score */}
        <div className="p-4 bg-white dark:bg-[#141518] rounded-lg border border-[#ded7ca] dark:border-[#282a32] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div>
            <span className="text-[#78716c] dark:text-[#9ca3af]">Alignment Dot Product: </span>
            <code className="text-[#1c1917] dark:text-[#f3f4f6] font-bold">
              q · k = ({queryVector.map((q, i) => `${q.toFixed(2)} × ${keyVector[i].toFixed(2)}`).join(' + ')})
            </code>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#78716c]">Raw Score:</span>
            <span className={`text-base font-bold tabular-data ${rawDotProduct >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {rawDotProduct >= 0 ? `+${rawDotProduct.toFixed(3)}` : rawDotProduct.toFixed(3)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
