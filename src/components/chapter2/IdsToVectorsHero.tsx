import React, { useState } from 'react';
import { ArrowRight, Layers, Binary, ShieldAlert } from 'lucide-react';

export const IdsToVectorsHero: React.FC = () => {
  const [selectedWordIdx, setSelectedWordIdx] = useState(1); // 'cat'

  const exampleTokens = [
    {
      word: "The",
      id: 464,
      vector: [0.18, -0.42, 0.65, 0.12, -0.33, 0.77],
      role: "Determiner / grammatical anchor",
    },
    {
      word: "cat",
      id: 3797,
      vector: [0.72, 0.48, -0.31, 0.15, 0.88, -0.12],
      role: "Feline animate noun",
    },
    {
      word: "sleeps",
      id: 33140,
      vector: [-0.42, -0.55, -0.68, -0.71, 0.32, 0.81],
      role: "Intransitive state verb",
    },
    {
      word: ".",
      id: 13,
      vector: [-0.05, -0.02, 0.08, -0.04, 0.11, -0.09],
      role: "Sentence boundary punctuation",
    },
  ];

  const selected = exampleTokens[selectedWordIdx];

  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-8 shadow-xs">
      <div className="pb-4 border-b border-[#ece7dc] dark:border-[#22242b] mb-6">
        <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
          Section 02 · Conceptual Bridge
        </span>
        <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
          From Discrete IDs to Continuous Geometric Vectors
        </h3>
        <p className="mt-2 text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          In Chapter 01, we saw how raw text becomes a list of integer token IDs. But neural networks cannot perform meaningful reasoning on raw integers alone.
        </p>
      </div>

      {/* Pipeline Strip */}
      <div className="p-4 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-lg mb-6 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[500px] text-xs font-mono">
          <div className="p-2 rounded bg-white dark:bg-[#16171c] border border-[#ded7ca] dark:border-[#282a32]">
            <span className="text-[#78716c] block text-[10px]">STAGE 1</span>
            <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6]">"The cat sleeps."</span>
          </div>
          <ArrowRight className="w-4 h-4 text-[#c2410c] dark:text-[#d97706]" />
          <div className="p-2 rounded bg-white dark:bg-[#16171c] border border-[#ded7ca] dark:border-[#282a32]">
            <span className="text-[#78716c] block text-[10px]">STAGE 2</span>
            <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6]">[The, cat, sleeps, .]</span>
          </div>
          <ArrowRight className="w-4 h-4 text-[#c2410c] dark:text-[#d97706]" />
          <div className="p-2 rounded bg-white dark:bg-[#16171c] border border-[#ded7ca] dark:border-[#282a32]">
            <span className="text-[#78716c] block text-[10px]">STAGE 3</span>
            <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6]">[464, 3797, 33140, 13]</span>
          </div>
          <ArrowRight className="w-4 h-4 text-[#c2410c] dark:text-[#d97706]" />
          <div className="p-2 rounded bg-[#fff7ed] dark:bg-[#23170e] border border-[#fed7aa] dark:border-[#4d3215]">
            <span className="text-[#c2410c] dark:text-[#d97706] block text-[10px] font-bold">THIS CHAPTER</span>
            <span className="font-bold text-[#c2410c] dark:text-[#d97706]">Dense Vectors ℝᵈ</span>
          </div>
        </div>
      </div>

      {/* Interactive Token to Vector Projection */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af] mr-2">
            Select token in example sentence:
          </span>
          {exampleTokens.map((t, idx) => (
            <button
              key={t.word}
              onClick={() => setSelectedWordIdx(idx)}
              className={`px-3 py-1.5 text-xs font-mono rounded cursor-pointer transition-all border ${
                selectedWordIdx === idx
                  ? 'bg-[#c2410c] dark:bg-[#d97706] text-white border-transparent font-bold shadow-xs'
                  : 'bg-[#faf8f5] dark:bg-[#1a1c22] text-[#44403c] dark:text-[#d1d5db] border-[#ded7ca] dark:border-[#282a32] hover:border-[#c2410c]'
              }`}
            >
              "{t.word}" <span className="opacity-60 text-[10px]">#{t.id}</span>
            </button>
          ))}
        </div>

        {/* Vector Display Card */}
        <div className="p-5 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <div>
              <span className="text-[#78716c] dark:text-[#9ca3af]">Selected Token: </span>
              <strong className="text-base text-[#1c1917] dark:text-[#f3f4f6]">"{selected.word}"</strong>
              <span className="ml-2 text-[#c2410c] dark:text-[#d97706]">(ID: {selected.id})</span>
            </div>
            <div className="text-[#78716c] dark:text-[#9ca3af]">{selected.role}</div>
          </div>

          {/* Continuous Vector Dimension Slots */}
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-2">
              Illustrative 6-Dimensional Embedding Vector (E ∈ ℝ⁶):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {selected.vector.map((val, dimIdx) => (
                <div
                  key={dimIdx}
                  className="p-2.5 bg-white dark:bg-[#141518] rounded border border-[#ded7ca] dark:border-[#282a32] text-center"
                >
                  <div className="text-[10px] font-mono text-[#78716c] dark:text-[#9ca3af]">
                    Dim {dimIdx + 1}
                  </div>
                  <div
                    className={`text-sm font-mono font-bold tabular-data mt-1 ${
                      val >= 0
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-sky-700 dark:text-sky-400'
                    }`}
                  >
                    {val >= 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] font-mono text-[#78716c] dark:text-[#9ca3af] flex items-center gap-1.5 pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c2410c] dark:bg-[#d97706]" />
            <span>Note: Values shown above are illustrative educational representations, not proprietary weights.</span>
          </div>
        </div>
      </div>

      {/* Why Scalar IDs Fail */}
      <div className="mt-6 p-4 bg-[#f8f5ee] dark:bg-[#191b21] rounded-lg border border-[#ded7ca] dark:border-[#282a32] text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed space-y-2">
        <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6] block">
          Why Can't an LLM Just Use Token IDs Directly?
        </span>
        <p>
          If you fed the integer <code>3797</code> ("cat") and <code>3798</code> ("dog") into a neural network as numerical values, the network would falsely interpret them as points along a 1D number line. An ID has no angle, no length, and no geometry. By converting the single integer into a high-dimensional vector, the model gains hundreds of independent coordinates to represent nuanced relationships (e.g. animate vs inanimate, verb vs noun, singular vs plural).
        </p>
      </div>
    </div>
  );
};
