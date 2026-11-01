import React, { useState } from 'react';
import { tokenizeTextReal } from '../../services/tokenizerService';
import {
  cosineSimilarity,
  dotProduct,
  vectorNorm,
  angularDistanceDegrees,
  EMBEDDING_SPACE_WORDS,
  LOOKUP_VOCABULARY,
} from '../../services/embeddingService';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Info, Compass, Layers, GitCompare } from 'lucide-react';

interface EmbeddingExperimentProps {
  sentence: string;
}

export const EmbeddingExperiment: React.FC<EmbeddingExperimentProps> = ({ sentence }) => {
  const tokenized = tokenizeTextReal(sentence);
  const activeTokens = tokenized.tokens;

  // Selected tokens for pairwise cosine similarity comparison
  const [tokenAIdx, setTokenAIdx] = useState<number>(0);
  const [tokenBIdx, setTokenBIdx] = useState<number>(Math.min(1, Math.max(0, activeTokens.length - 1)));

  // Generate deterministic illustrative 8D vectors for the active tokens based on their token ID
  const getTokenVector = (tokenText: string, id: number): number[] => {
    // Check if in preset vocabulary
    const clean = tokenText.trim().toLowerCase();
    const preset = LOOKUP_VOCABULARY.find((v) => v.word === clean);
    if (preset) return preset.vector;

    // Deterministic pseudo-random vector based on token ID
    const seed = (id * 9301 + 49297) % 233280;
    const vec: number[] = [];
    for (let i = 0; i < 8; i++) {
      const val = Math.sin(seed * (i + 1) * 0.73) * 0.95;
      vec.push(Number(val.toFixed(2)));
    }
    return vec;
  };

  const tokenA = activeTokens[tokenAIdx] || { text: 'cat', id: 0 };
  const tokenB = activeTokens[tokenBIdx] || { text: 'mat', id: 1 };

  const vecA = getTokenVector(tokenA.text, tokenA.id);
  const vecB = getTokenVector(tokenB.text, tokenB.id);

  const dot = Number(dotProduct(vecA, vecB).toFixed(4));
  const normA = Number(vectorNorm(vecA).toFixed(4));
  const normB = Number(vectorNorm(vecB).toFixed(4));
  const sim = cosineSimilarity(vecA, vecB);
  const angleDeg = angularDistanceDegrees(sim);

  return (
    <div className="space-y-8">
      {/* Experiment Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#ece7dc] dark:border-[#26282f]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            <span>Experiment 02</span>
            <span>·</span>
            <span>Geometric Vector Spaces</span>
          </div>
          <h2 className="text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            Embedding Table Lookup & Vector Geometry
          </h2>
        </div>
        <div className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          Mapping: <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">W_e ∈ ℝ^{'{|V| × d}'}</span>
        </div>
      </div>

      {/* Embedding Matrix Lookup Inspector */}
      <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-serif text-lg font-medium text-[#1c1917] dark:text-[#f3f4f6]">
            Active Sequence Token Vectors (Illustrative d = 8)
          </h3>
          <span className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
            Values normalized in range [-1.0, +1.0]
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-[#ece7dc] dark:border-[#26282f] text-left text-[#78716c] dark:text-[#9ca3af]">
                <th className="py-2.5 px-3">Token</th>
                <th className="py-2.5 px-3">ID</th>
                <th className="py-2.5 px-3">Vector Coordinates (d₁ ... d₈)</th>
                <th className="py-2.5 px-3 text-right">L2 Norm ||v||</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ece7dc] dark:divide-[#26282f]">
              {activeTokens.map((tok, idx) => {
                const vec = getTokenVector(tok.text, tok.id);
                const norm = vectorNorm(vec).toFixed(2);
                return (
                  <tr
                    key={idx}
                    className="hover:bg-[#faf8f5] dark:hover:bg-[#1a1c22] transition-colors"
                  >
                    <td className="py-2.5 px-3 font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
                      "{tok.text}"
                    </td>
                    <td className="py-2.5 px-3 text-[#c2410c] dark:text-[#d97706]">
                      #{tok.id}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {vec.map((val, dimIdx) => (
                          <span
                            key={dimIdx}
                            className={`px-1.5 py-0.5 rounded text-[11px] tabular-data ${
                              val > 0
                                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800'
                                : 'bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 border border-sky-200 dark:border-sky-800'
                            }`}
                          >
                            {val >= 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#57534e] dark:text-[#9ca3af] tabular-data font-semibold">
                      {norm}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pairwise Cosine Similarity Laboratory */}
      <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#ece7dc] dark:border-[#26282f]">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-[#c2410c] dark:text-[#d97706]" />
            <h3 className="font-serif text-lg font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              Pairwise Cosine Similarity Comparator
            </h3>
          </div>
          <span className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
            cos(u, v) = (u · v) / (||u|| ||v||)
          </span>
        </div>

        {/* Token Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block">
              Vector u (Token A):
            </label>
            <select
              value={tokenAIdx}
              onChange={(e) => setTokenAIdx(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs font-mono bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#ded7ca] dark:border-[#282a32] rounded-lg text-[#1c1917] dark:text-[#f3f4f6] cursor-pointer"
            >
              {activeTokens.map((t, idx) => (
                <option key={idx} value={idx}>
                  Token [{idx}]: "{t.text}" (ID {t.id})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block">
              Vector v (Token B):
            </label>
            <select
              value={tokenBIdx}
              onChange={(e) => setTokenBIdx(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs font-mono bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#ded7ca] dark:border-[#282a32] rounded-lg text-[#1c1917] dark:text-[#f3f4f6] cursor-pointer"
            >
              {activeTokens.map((t, idx) => (
                <option key={idx} value={idx}>
                  Token [{idx}]: "{t.text}" (ID {t.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Numerical Output Card */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-5 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-lg text-xs font-mono">
          <div className="p-3 bg-white dark:bg-[#141518] rounded border border-[#ded7ca] dark:border-[#282a32]">
            <span className="text-[#78716c] dark:text-[#9ca3af] block text-[11px]">Dot Product (u · v)</span>
            <span className="text-lg font-semibold text-[#1c1917] dark:text-[#f3f4f6] mt-1 block tabular-data">
              {dot}
            </span>
          </div>

          <div className="p-3 bg-white dark:bg-[#141518] rounded border border-[#ded7ca] dark:border-[#282a32]">
            <span className="text-[#78716c] dark:text-[#9ca3af] block text-[11px]">Magnitudes (||u|| × ||v||)</span>
            <span className="text-lg font-semibold text-[#1c1917] dark:text-[#f3f4f6] mt-1 block tabular-data">
              {(normA * normB).toFixed(3)}
            </span>
          </div>

          <div className="p-3 bg-white dark:bg-[#141518] rounded border border-[#ded7ca] dark:border-[#282a32]">
            <span className="text-[#78716c] dark:text-[#9ca3af] block text-[11px]">Cosine Similarity</span>
            <span className="text-2xl font-bold text-[#c2410c] dark:text-[#d97706] mt-0.5 block tabular-data">
              {sim.toFixed(3)}
            </span>
          </div>

          <div className="p-3 bg-white dark:bg-[#141518] rounded border border-[#ded7ca] dark:border-[#282a32]">
            <span className="text-[#78716c] dark:text-[#9ca3af] block text-[11px]">Subtended Angle θ</span>
            <span className="text-2xl font-bold text-[#1c1917] dark:text-[#f3f4f6] mt-0.5 block tabular-data">
              {angleDeg}°
            </span>
          </div>
        </div>

        {/* Visual Angle Meter */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
            <span>Opposite (-1.0 / 180°)</span>
            <span>Orthogonal (0.0 / 90°)</span>
            <span>Collinear (+1.0 / 0°)</span>
          </div>
          <div className="w-full bg-[#f0ebe1] dark:bg-[#1f2127] h-3 rounded-full relative overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 via-amber-500 to-[#c2410c] transition-all duration-300"
              style={{ width: `${Math.max(0, Math.min(100, ((sim + 1) / 2) * 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2D Latent Manifold Projection Canvas */}
      <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-medium text-[#1c1917] dark:text-[#f3f4f6]">
            Semantic Manifold Clusters (2D PCA Projection)
          </h3>
          <span className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
            Semantic affinity clusters concepts organically
          </span>
        </div>

        <div className="relative w-full h-64 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-lg overflow-hidden">
          <svg className="w-full h-full" viewBox="-1.2 -1.2 2.4 2.4">
            {/* Coordinate grid */}
            <line x1="-1.2" y1="0" x2="1.2" y2="0" stroke="#a8a29e" strokeWidth="0.01" strokeDasharray="0.04,0.04" />
            <line x1="0" y1="-1.2" x2="0" y2="1.2" stroke="#a8a29e" strokeWidth="0.01" strokeDasharray="0.04,0.04" />

            {/* Clusters */}
            {EMBEDDING_SPACE_WORDS.map((w, idx) => (
              <g key={idx} transform={`translate(${w.x}, ${-w.y})`}>
                <circle r="0.04" fill={w.color} />
                <text
                  x="0.06"
                  y="0.02"
                  fontSize="0.09"
                  fontFamily="JetBrains Mono, monospace"
                  fill="currentColor"
                  className="text-[#57534e] dark:text-[#9ca3af]"
                >
                  {w.word}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d97706]" />
            <span>Animals Cluster</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
            <span>Botanical / Fruit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
            <span>Vehicles</span>
          </div>
        </div>
      </div>

      {/* Explanatory Callout */}
      <div className="p-4 bg-[#faf8f5] dark:bg-[#111215] border border-[#e6e0d4] dark:border-[#26282f] rounded-lg text-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
          <Info className="w-4 h-4 text-[#c2410c] dark:text-[#d97706]" />
          <span>Why Embeddings Replace Scalar IDs</span>
        </div>
        <p className="text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          If we fed raw scalar integer token IDs (like 2841 and 2842) directly into mathematical operations, a computer would assume 2842 is twice the magnitude of 1421. High-dimensional vector embeddings project tokens onto a continuous hypersphere where geometric angles encode grammatical relationships, antonyms, and world knowledge.
        </p>
      </div>
    </div>
  );
};
