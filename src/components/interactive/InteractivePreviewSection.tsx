import React, { useState } from 'react';
import { SectionHeader } from '../layout/SectionHeader';
import { Button } from '../ui/Button';
import { Sparkles, Sliders, Eye, RefreshCw, ArrowRight } from 'lucide-react';

export const InteractivePreviewSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tokenizer' | 'attention' | 'sampling'>('tokenizer');

  // 1. Tokenizer State
  const sampleSentences = [
    "Language models predict subwords.",
    "Attention routing operates dynamically.",
    "Positional encodings inject sequence order.",
  ];
  const [selectedSentenceIdx, setSelectedSentenceIdx] = useState(0);

  const tokenSets = [
    [
      { text: "Language", id: 24891, color: "bg-amber-100 dark:bg-amber-950/50 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-700" },
      { text: "models", id: 4981, color: "bg-sky-100 dark:bg-sky-950/50 text-sky-950 dark:text-sky-200 border-sky-300 dark:border-sky-700" },
      { text: "predict", id: 8213, color: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700" },
      { text: "sub", id: 1840, color: "bg-purple-100 dark:bg-purple-950/50 text-purple-950 dark:text-purple-200 border-purple-300 dark:border-purple-700" },
      { text: "words", id: 3912, color: "bg-rose-100 dark:bg-rose-950/50 text-rose-950 dark:text-rose-200 border-rose-300 dark:border-rose-700" },
      { text: ".", id: 13, color: "bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-200 border-stone-400 dark:border-stone-600" },
    ],
    [
      { text: "Attention", id: 31820, color: "bg-amber-100 dark:bg-amber-950/50 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-700" },
      { text: "routing", id: 14210, color: "bg-sky-100 dark:bg-sky-950/50 text-sky-950 dark:text-sky-200 border-sky-300 dark:border-sky-700" },
      { text: "operates", id: 29104, color: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700" },
      { text: "dynamically", id: 18290, color: "bg-purple-100 dark:bg-purple-950/50 text-purple-950 dark:text-purple-200 border-purple-300 dark:border-purple-700" },
      { text: ".", id: 13, color: "bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-200 border-stone-400 dark:border-stone-600" },
    ],
    [
      { text: "Positional", id: 48102, color: "bg-amber-100 dark:bg-amber-950/50 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-700" },
      { text: "encodings", id: 32184, color: "bg-sky-100 dark:bg-sky-950/50 text-sky-950 dark:text-sky-200 border-sky-300 dark:border-sky-700" },
      { text: "inject", id: 24109, color: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700" },
      { text: "sequence", id: 7412, color: "bg-purple-100 dark:bg-purple-950/50 text-purple-950 dark:text-purple-200 border-purple-300 dark:border-purple-700" },
      { text: "order", id: 1821, color: "bg-rose-100 dark:bg-rose-950/50 text-rose-950 dark:text-rose-200 border-rose-300 dark:border-rose-700" },
      { text: ".", id: 13, color: "bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-200 border-stone-400 dark:border-stone-600" },
    ]
  ];

  // 2. Attention Heatmap State
  const attentionSentence = ["The", "animal", "didn't", "cross", "the", "street", "because", "it", "was", "tired"];
  const [selectedAttentionTokenIdx, setSelectedAttentionTokenIdx] = useState<number>(7); // "it"

  // Pre-calculated realistic self-attention weights from "it" or other tokens
  const getAttentionWeights = (idx: number): number[] => {
    // If "it" is selected (idx = 7)
    if (idx === 7) {
      return [0.04, 0.58, 0.05, 0.06, 0.03, 0.04, 0.06, 0.14, 0.0, 0.0];
    }
    // If "tired" is selected (idx = 9)
    if (idx === 9) {
      return [0.02, 0.45, 0.03, 0.04, 0.02, 0.03, 0.05, 0.22, 0.04, 0.10];
    }
    // Default uniform decaying weights to earlier tokens
    return attentionSentence.map((_, i) => {
      if (i > idx) return 0; // Causal mask
      if (i === idx) return 0.35;
      return Number((0.65 / (idx || 1)).toFixed(2));
    });
  };

  const attentionWeights = getAttentionWeights(selectedAttentionTokenIdx);

  // 3. Next-Token Sampling & Temperature State
  const [temperature, setTemperature] = useState<number>(0.7);
  const baseLogits = [
    { word: "how", logit: 3.4 },
    { word: "what", logit: 2.5 },
    { word: "why", logit: 1.8 },
    { word: "and", logit: 1.1 },
    { word: "that", logit: 0.4 },
  ];

  // Softmax with temperature: P(w_i) = exp(z_i / T) / sum(exp(z_j / T))
  const computeProbabilities = (temp: number) => {
    const safeTemp = Math.max(0.1, temp);
    const expValues = baseLogits.map((item) => Math.exp(item.logit / safeTemp));
    const sumExp = expValues.reduce((acc, v) => acc + v, 0);
    return baseLogits.map((item, i) => ({
      word: item.word,
      prob: Math.round((expValues[i] / sumExp) * 100),
    }));
  };

  const currentProbabilities = computeProbabilities(temperature);

  return (
    <section id="interactive-previews" className="my-20 sm:my-28">
      {/* Section Header */}
      <div className="max-w-3xl mb-10">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] mb-2 font-semibold">
          <span>Hands-On Mechanics</span>
          <span>·</span>
          <span>Interactive Micro-Labs</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] tracking-tight">
          Don't just read. Experiment.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          Test the mathematical primitives firsthand with these three interactive previews.
        </p>
      </div>

      {/* Experiment Mode Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab('tokenizer')}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer border ${
            activeTab === 'tokenizer'
              ? 'bg-[#1c1917] text-white dark:bg-[#f3f4f6] dark:text-[#111215] border-transparent font-semibold'
              : 'bg-white dark:bg-[#141518] text-[#57534e] dark:text-[#9ca3af] border-[#e2dbce] dark:border-[#282a32] hover:text-[#1c1917] dark:hover:text-[#f3f4f6]'
          }`}
        >
          A. Tokenizer Preview
        </button>

        <button
          onClick={() => setActiveTab('attention')}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer border ${
            activeTab === 'attention'
              ? 'bg-[#1c1917] text-white dark:bg-[#f3f4f6] dark:text-[#111215] border-transparent font-semibold'
              : 'bg-white dark:bg-[#141518] text-[#57534e] dark:text-[#9ca3af] border-[#e2dbce] dark:border-[#282a32] hover:text-[#1c1917] dark:hover:text-[#f3f4f6]'
          }`}
        >
          B. Attention Heatmap Preview
        </button>

        <button
          onClick={() => setActiveTab('sampling')}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer border ${
            activeTab === 'sampling'
              ? 'bg-[#1c1917] text-white dark:bg-[#f3f4f6] dark:text-[#111215] border-transparent font-semibold'
              : 'bg-white dark:bg-[#141518] text-[#57534e] dark:text-[#9ca3af] border-[#e2dbce] dark:border-[#282a32] hover:text-[#1c1917] dark:hover:text-[#f3f4f6]'
          }`}
        >
          C. Next-Token Temperature Preview
        </button>
      </div>

      {/* Main Interactive Stage Container */}
      <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 sm:p-8">
        
        {/* EXPERIMENT A: Tokenizer */}
        {activeTab === 'tokenizer' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ece7dc] dark:border-[#22242b]">
              <div>
                <h3 className="font-serif text-xl font-medium text-[#1c1917] dark:text-[#f3f4f6]">
                  A. Subword Segmentation & Token IDs
                </h3>
                <p className="text-xs text-[#78716c] dark:text-[#9ca3af] mt-0.5">
                  Observe how words are broken into subwords and mapped to unique integers.
                </p>
              </div>

              {/* Sample Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-[#78716c] dark:text-[#9ca3af]">Sentences:</span>
                {sampleSentences.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSentenceIdx(i)}
                    className={`px-2 py-1 text-xs font-mono rounded cursor-pointer transition-colors ${
                      selectedSentenceIdx === i
                        ? 'bg-[#c2410c] dark:bg-[#d97706] text-white font-bold'
                        : 'bg-[#f4efe6] dark:bg-[#1f2127] text-[#57534e] dark:text-[#9ca3af]'
                    }`}
                  >
                    #{i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Tokenized String Output */}
            <div className="p-5 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-lg">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-3">
                Segmented Subwords (Clickable Primitives):
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {tokenSets[selectedSentenceIdx].map((tok, idx) => (
                  <div
                    key={idx}
                    className={`px-3 py-1.5 rounded-md border text-xs sm:text-sm font-mono font-medium ${tok.color} shadow-xs flex items-center gap-2`}
                  >
                    <span>{tok.text}</span>
                    <span className="text-[10px] opacity-60">ID: {tok.id}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 bg-[#f8f5ee] dark:bg-[#1a1c22] rounded border border-[#ded7ca] dark:border-[#282a32]">
                <span className="text-[#78716c] dark:text-[#9ca3af] block">Original String Length</span>
                <span className="text-base font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
                  {sampleSentences[selectedSentenceIdx].length} characters
                </span>
              </div>
              <div className="p-3 bg-[#f8f5ee] dark:bg-[#1a1c22] rounded border border-[#ded7ca] dark:border-[#282a32]">
                <span className="text-[#78716c] dark:text-[#9ca3af] block">Token Count</span>
                <span className="text-base font-semibold text-[#c2410c] dark:text-[#d97706]">
                  {tokenSets[selectedSentenceIdx].length} discrete tokens
                </span>
              </div>
              <div className="p-3 bg-[#f8f5ee] dark:bg-[#1a1c22] rounded border border-[#ded7ca] dark:border-[#282a32]">
                <span className="text-[#78716c] dark:text-[#9ca3af] block">Average Compression</span>
                <span className="text-base font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
                  {(sampleSentences[selectedSentenceIdx].length / tokenSets[selectedSentenceIdx].length).toFixed(1)} chars/token
                </span>
              </div>
            </div>
          </div>
        )}

        {/* EXPERIMENT B: Attention Heatmap */}
        {activeTab === 'attention' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ece7dc] dark:border-[#22242b]">
              <div>
                <h3 className="font-serif text-xl font-medium text-[#1c1917] dark:text-[#f3f4f6]">
                  B. Interactive Self-Attention Heatmap
                </h3>
                <p className="text-xs text-[#78716c] dark:text-[#9ca3af] mt-0.5">
                  Click any query token below to inspect how it selectively attends to preceding words.
                </p>
              </div>

              <div className="text-xs font-mono text-[#c2410c] dark:text-[#d97706]">
                Query Token: <span className="font-bold underline">"{attentionSentence[selectedAttentionTokenIdx]}"</span>
              </div>
            </div>

            {/* Sentence Token Selector */}
            <div className="p-4 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-lg">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-2.5">
                Select Active Query Token:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {attentionSentence.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedAttentionTokenIdx(idx)}
                    className={`px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer border ${
                      selectedAttentionTokenIdx === idx
                        ? 'bg-[#c2410c] dark:bg-[#d97706] text-white border-transparent font-bold scale-105 shadow-xs'
                        : 'bg-white dark:bg-[#1a1c22] text-[#44403c] dark:text-[#d1d5db] border-[#ded7ca] dark:border-[#282a32] hover:border-[#c2410c]'
                    }`}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>

            {/* Heatmap Weights Distribution */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block">
                Calculated Attention Weights from "{attentionSentence[selectedAttentionTokenIdx]}":
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {attentionSentence.map((word, idx) => {
                  const weight = attentionWeights[idx];
                  const isFuture = idx > selectedAttentionTokenIdx;

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded border text-xs font-mono flex flex-col justify-between h-20 transition-all ${
                        isFuture
                          ? 'bg-[#f4efe6]/40 dark:bg-[#17181d]/40 border-dashed border-[#ded7ca] dark:border-[#282a32] opacity-40'
                          : weight > 0.3
                          ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 dark:border-amber-700 font-semibold'
                          : 'bg-white dark:bg-[#16171c] border-[#ded7ca] dark:border-[#282a32]'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[#1c1917] dark:text-[#f3f4f6]">"{word}"</span>
                        <span className="text-[10px] text-[#78716c] dark:text-[#9ca3af]">#{idx}</span>
                      </div>
                      <div className="flex items-baseline justify-between pt-2">
                        <span className="text-[10px] text-[#78716c] dark:text-[#9ca3af]">
                          {isFuture ? 'Masked' : 'Weight'}
                        </span>
                        <span className="text-sm tabular-data text-[#c2410c] dark:text-[#d97706]">
                          {isFuture ? '-∞' : weight.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-xs text-[#57534e] dark:text-[#9ca3af]">
              Notice how the pronoun <strong>"it"</strong> allocates its highest weight (0.58) to <strong>"animal"</strong>, solving coreference resolution purely through dot-product vector projection.
            </p>
          </div>
        )}

        {/* EXPERIMENT C: Next-Token Softmax & Temperature */}
        {activeTab === 'sampling' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ece7dc] dark:border-[#22242b]">
              <div>
                <h3 className="font-serif text-xl font-medium text-[#1c1917] dark:text-[#f3f4f6]">
                  C. Softmax Temperature & Sampling Distribution
                </h3>
                <p className="text-xs text-[#78716c] dark:text-[#9ca3af] mt-0.5">
                  Adjust temperature to see how it reshapes the probability distribution over candidate next tokens.
                </p>
              </div>

              {/* Reset to Default */}
              <button
                onClick={() => setTemperature(0.7)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded bg-[#f4efe6] dark:bg-[#1f2127] text-[#57534e] dark:text-[#9ca3af] hover:text-[#1c1917] dark:hover:text-[#f3f4f6] cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset T = 0.7</span>
              </button>
            </div>

            {/* Temperature Slider */}
            <div className="p-5 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-lg space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#57534e] dark:text-[#9ca3af]">
                  Sampling Temperature (T):
                </span>
                <span className="text-base font-bold text-[#c2410c] dark:text-[#d97706] tabular-data">
                  T = {temperature.toFixed(2)}
                </span>
              </div>

              <input
                type="range"
                min="0.1"
                max="1.5"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
              />

              <div className="flex justify-between text-[11px] font-mono text-[#78716c] dark:text-[#9ca3af]">
                <span>T = 0.1 (Greedy / Deterministic)</span>
                <span>T = 0.7 (Balanced)</span>
                <span>T = 1.5 (High Entropy / Creative)</span>
              </div>
            </div>

            {/* Live Probabilities Bar Chart */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block">
                Normalized Softmax Probabilities:
              </span>

              <div className="space-y-2.5">
                {currentProbabilities.map((item, idx) => (
                  <div key={item.word} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
                        "{item.word}" {idx === 0 && <span className="text-[#c2410c] dark:text-[#d97706]">(Top Rank)</span>}
                      </span>
                      <span className="tabular-data font-bold text-[#1c1917] dark:text-[#f3f4f6]">
                        {item.prob}%
                      </span>
                    </div>
                    <div className="w-full bg-[#f0ebe1] dark:bg-[#1f2127] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-200 ${
                          idx === 0
                            ? 'bg-[#c2410c] dark:bg-[#d97706]'
                            : 'bg-[#a8a29e] dark:bg-[#52525b]'
                        }`}
                        style={{ width: `${item.prob}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-[#57534e] dark:text-[#9ca3af]">
              Lowering temperature scales the logit differences towards infinity, concentrating all probability mass onto the highest logit. Raising temperature divides logits by a large denominator, flattening the distribution toward equal entropy.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
