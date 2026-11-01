import React, { useState } from 'react';
import { LOOKUP_VOCABULARY, VocabularyEmbedding } from '../../services/embeddingService';
import { Sliders, Sparkles, HelpCircle } from 'lucide-react';

export const DimensionExplorer: React.FC = () => {
  const [selectedWordIdx, setSelectedWordIdx] = useState<number>(0); // 'cat'
  const [inspectedDim, setInspectedDim] = useState<number | null>(0);

  const active = LOOKUP_VOCABULARY[selectedWordIdx];

  // Dimension conceptual themes (illustrative latent features)
  const dimensionInterpretations = [
    { name: "Dim 1: Animacy / Living", hint: "High positive for animals/people, neutral/negative for inanimate objects" },
    { name: "Dim 2: Edibility / Nutrition", hint: "High positive for fruits/food, neutral for verbs/animals" },
    { name: "Dim 3: Physical Size / Weight", hint: "Magnitude represents physical presence or volume" },
    { name: "Dim 4: Action / Motion Dynamism", hint: "Positive for active verbs like 'run', negative for states like 'sleep'" },
    { name: "Dim 5: Domestic Companion Affinity", hint: "High for pets like 'cat' and 'dog', low for abstract concepts" },
    { name: "Dim 6: Botanical / Natural Domain", hint: "Positive for plants, fruit, and organic materials" },
    { name: "Dim 7: Syntactic Role (Noun Tendency)", hint: "Structural feature indicating syntactic distribution" },
    { name: "Dim 8: Concreteness vs Abstraction", hint: "Continuous coordinate distinguishing physical items from abstract ideas" },
  ];

  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-8 shadow-xs">
      <div className="pb-4 border-b border-[#ece7dc] dark:border-[#22242b] mb-6">
        <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
          Section 04 · Geometry
        </span>
        <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
          What Are Embedding Dimensions?
        </h3>
        <p className="mt-2 text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          A vector is simply an ordered list of coordinates: <code className="font-mono text-xs">[x₁, x₂, x₃, ..., x_d]</code>. Each dimension represents an independent axis in a high-dimensional concept space.
        </p>
      </div>

      {/* Token Selector */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af] mr-2">
          Inspect Word Vector:
        </span>
        {LOOKUP_VOCABULARY.map((v, i) => (
          <button
            key={v.word}
            onClick={() => {
              setSelectedWordIdx(i);
              setInspectedDim(0);
            }}
            className={`px-3 py-1.5 text-xs font-mono rounded cursor-pointer transition-all border ${
              selectedWordIdx === i
                ? 'bg-[#c2410c] dark:bg-[#d97706] text-white border-transparent font-bold shadow-xs'
                : 'bg-[#faf8f5] dark:bg-[#1a1c22] text-[#44403c] dark:text-[#d1d5db] border-[#ded7ca] dark:border-[#282a32] hover:border-[#c2410c]'
            }`}
          >
            "{v.word}"
          </button>
        ))}
      </div>

      {/* Vector Bar Chart & Heatmap Visualizer */}
      <div className="p-6 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
          <div>
            <span className="text-[#78716c] dark:text-[#9ca3af]">Vector for: </span>
            <strong className="text-base text-[#1c1917] dark:text-[#f3f4f6]">"{active.word}"</strong>
            <span className="ml-2 text-[#c2410c] dark:text-[#d97706]">(8 Dimensions)</span>
          </div>
          <span className="text-[#78716c] dark:text-[#9ca3af]">
            Click any dimension bar to inspect its feature role
          </span>
        </div>

        {/* Dimension Bars */}
        <div className="grid grid-cols-8 gap-2 sm:gap-3 items-end h-44 pt-4 border-b border-[#ded7ca] dark:border-[#282a32] pb-2">
          {active.vector.map((val, idx) => {
            const isSelected = inspectedDim === idx;
            const heightPercent = Math.abs(val) * 100;
            const isPositive = val >= 0;

            return (
              <div
                key={idx}
                onClick={() => setInspectedDim(idx)}
                className="flex flex-col items-center justify-end h-full cursor-pointer group"
              >
                {/* Value Label */}
                <span
                  className={`text-[10px] font-mono mb-1 tabular-data ${
                    isSelected ? 'font-bold text-[#1c1917] dark:text-[#f3f4f6]' : 'text-[#78716c] dark:text-[#9ca3af]'
                  }`}
                >
                  {isPositive ? `+${val.toFixed(2)}` : val.toFixed(2)}
                </span>

                {/* Animated Bar */}
                <div className="w-full max-w-[36px] bg-[#ece7dc] dark:bg-[#1e2028] rounded-t-md h-full flex flex-col justify-end p-0.5">
                  <div
                    className={`w-full rounded-t transition-all duration-300 ${
                      isPositive
                        ? 'bg-emerald-600 dark:bg-emerald-500'
                        : 'bg-sky-600 dark:bg-sky-500'
                    } ${isSelected ? 'ring-2 ring-[#c2410c] dark:ring-[#d97706]' : 'opacity-85 group-hover:opacity-100'}`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                {/* Dim Label */}
                <span
                  className={`text-[10px] font-mono mt-1 ${
                    isSelected ? 'font-bold text-[#c2410c] dark:text-[#d97706]' : 'text-[#78716c] dark:text-[#9ca3af]'
                  }`}
                >
                  D{idx + 1}
                </span>
              </div>
            );
          })}
        </div>

        {/* Selected Dimension Detail Card */}
        {inspectedDim !== null && (
          <div className="p-4 bg-white dark:bg-[#141518] rounded-lg border border-[#ded7ca] dark:border-[#282a32] space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6]">
                {dimensionInterpretations[inspectedDim].name}
              </span>
              <span
                className={`font-bold tabular-data ${
                  active.vector[inspectedDim] >= 0
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-sky-700 dark:text-sky-400'
                }`}
              >
                Active Coordinate: {active.vector[inspectedDim] >= 0 ? `+${active.vector[inspectedDim].toFixed(2)}` : active.vector[inspectedDim].toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
              {dimensionInterpretations[inspectedDim].hint}
            </p>
          </div>
        )}
      </div>

      {/* Polysemantic Real-World Reality Note */}
      <div className="mt-6 p-4 bg-[#f8f5ee] dark:bg-[#191b21] rounded-lg border border-[#ded7ca] dark:border-[#282a32] text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed space-y-2">
        <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6] block">
          Do Real Embedding Dimensions Have Human Labels?
        </span>
        <p>
          In educational diagrams, we often label axes with tidy human concepts like "Animacy" or "Edibility". In real language models like LLaMA 3 ($d = 4096$), dimensions are almost never purely monosemantic. Instead, they are <strong>polysemantic</strong>: multiple overlapping concepts share directions in vector space (known as superposition), allowing thousands of subtle ideas to be encoded across the continuous coordinate geometry.
        </p>
      </div>
    </div>
  );
};
