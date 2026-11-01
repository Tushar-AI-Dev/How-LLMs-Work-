import React, { useState } from 'react';
import { LOOKUP_VOCABULARY, VocabularyEmbedding } from '../../services/embeddingService';
import { ArrowDown, CornerDownRight, Database, Cpu, Check, Play } from 'lucide-react';

export const EmbeddingLookupVisualizer: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number>(0); // 0 = 'cat'

  const activeEntry: VocabularyEmbedding =
    LOOKUP_VOCABULARY.find((v) => v.id === selectedId) || LOOKUP_VOCABULARY[0];

  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ece7dc] dark:border-[#22242b] mb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            Interactive Feature · Section 03
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
            The Embedding Matrix Lookup Mechanism
          </h3>
        </div>

        <div className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          Formal Operation: <code className="text-[#1c1917] dark:text-[#f3f4f6]">x = W_e[TokenID]</code>
        </div>
      </div>

      <p className="text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed mb-6">
        Select a token from the vocabulary table below to see how its integer Token ID acts as an index to retrieve its corresponding continuous row vector from the learned embedding matrix (<code className="font-mono">W_e ∈ ℝ^(6 × 8)</code>).
      </p>

      {/* Main Grid: Vocabulary Selector (Left) and Matrix Rows (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Vocabulary Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#78716c] dark:text-[#9ca3af] px-1">
            <span>Vocabulary List (|V| = 6)</span>
            <span>Token ID</span>
          </div>

          <div className="space-y-1.5">
            {LOOKUP_VOCABULARY.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`
                    w-full flex items-center justify-between p-3 rounded-md text-xs font-mono transition-all cursor-pointer border
                    ${
                      isSelected
                        ? 'bg-[#1c1917] text-white dark:bg-[#f3f4f6] dark:text-[#111215] border-transparent font-bold shadow-xs scale-[1.02]'
                        : 'bg-[#faf8f5] dark:bg-[#1a1c22] text-[#44403c] dark:text-[#d1d5db] border-[#ded7ca] dark:border-[#282a32] hover:border-[#c2410c]'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-current opacity-60" />
                    <span className="text-sm font-semibold">"{item.word}"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] opacity-75">Row #{item.id}</span>
                    <span className="font-bold tabular-data">ID: {item.id}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Embedding Matrix Table & Extraction (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex items-center justify-between text-xs font-mono text-[#78716c] dark:text-[#9ca3af] px-1">
            <span>Learned Embedding Matrix: W_e [6 rows × 8 dimensions]</span>
            <span className="text-[#c2410c] dark:text-[#d97706] font-bold">
              Active Lookup: Row {selectedId}
            </span>
          </div>

          {/* Matrix Rows Visualizer */}
          <div className="border border-[#ded7ca] dark:border-[#282a32] rounded-lg overflow-x-auto bg-[#faf8f5] dark:bg-[#0c0d10] p-3 space-y-1.5">
            {LOOKUP_VOCABULARY.map((row) => {
              const isSelected = row.id === selectedId;
              return (
                <div
                  key={row.id}
                  className={`
                    flex items-center gap-2 p-2 rounded transition-all font-mono text-xs
                    ${
                      isSelected
                        ? 'bg-[#fff7ed] dark:bg-[#23180e] border border-[#fed7aa] dark:border-[#4d3215] ring-2 ring-[#c2410c] dark:ring-[#d97706] shadow-sm'
                        : 'bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#22242b] opacity-60'
                    }
                  `}
                >
                  <span className="w-16 font-semibold text-[11px] text-[#78716c] dark:text-[#9ca3af] shrink-0">
                    Row #{row.id}
                  </span>
                  
                  {/* The 8 vector cells */}
                  <div className="grid grid-cols-8 gap-1.5 grow">
                    {row.vector.map((val, dimIdx) => (
                      <div
                        key={dimIdx}
                        className={`
                          py-1 px-1 text-center rounded text-[11px] tabular-data font-semibold
                          ${
                            isSelected
                              ? val >= 0
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300'
                                : 'bg-sky-100 dark:bg-sky-950/60 text-sky-900 dark:text-sky-300'
                              : 'bg-[#f4efe6] dark:bg-[#1d1f27] text-[#57534e] dark:text-[#9ca3af]'
                          }
                        `}
                      >
                        {val >= 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Extracted Vector Box (Animated Outcome) */}
          <div className="p-4 bg-white dark:bg-[#141518] rounded-lg border border-[#c2410c] dark:border-[#d97706] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#c2410c] dark:text-[#d97706] flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                Retrieved Vector for "{activeEntry.word}":
              </span>
              <span className="text-[#78716c] dark:text-[#9ca3af]">
                Output Vector (d = 8)
              </span>
            </div>

            <div className="p-3 bg-[#faf8f5] dark:bg-[#0c0d10] rounded font-mono text-xs sm:text-sm text-[#1c1917] dark:text-[#f3f4f6] overflow-x-auto whitespace-nowrap">
              <span className="text-[#78716c] mr-2">x =</span>
              [ {activeEntry.vector.map((v) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2))).join(', ')} ]
            </div>
          </div>
        </div>
      </div>

      {/* Explanation Panel: What Just Happened */}
      <div className="mt-8 pt-5 border-t border-[#ece7dc] dark:border-[#22242b] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
        <div className="p-3 bg-[#f8f5ee] dark:bg-[#191b21] rounded border border-[#ded7ca] dark:border-[#282a32]">
          <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6] block mb-1">
            1. Indexing, Not Computing
          </span>
          Lookup is mathematically equivalent to multiplying a one-hot vector by the matrix (<code className="font-mono">e_i · W_e</code>). In practice, PyTorch and JAX simply slice row <code>i</code> directly with $O(1)$ memory indexing.
        </div>

        <div className="p-3 bg-[#f8f5ee] dark:bg-[#191b21] rounded border border-[#ded7ca] dark:border-[#282a32]">
          <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6] block mb-1">
            2. Fixed Dimensions
          </span>
          Every token in the model is projected into a vector with the exact same number of dimensions (<code>d_model</code>). In LLaMA 3, this is 4,096 numbers; in GPT-2, it was 768.
        </div>

        <div className="p-3 bg-[#f8f5ee] dark:bg-[#191b21] rounded border border-[#ded7ca] dark:border-[#282a32]">
          <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6] block mb-1">
            3. Learned Weights
          </span>
          The values in this matrix are not hardcoded by humans. They begin as random Gaussian noise and are gradually adjusted during training through gradient descent and backpropagation.
        </div>
      </div>
    </div>
  );
};
