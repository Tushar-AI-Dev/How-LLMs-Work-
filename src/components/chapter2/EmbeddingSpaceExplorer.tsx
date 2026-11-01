import React, { useState } from 'react';
import {
  EMBEDDING_SPACE_WORDS,
  WordVector2D,
  cosineSimilarity,
  angularDistanceDegrees,
} from '../../services/embeddingService';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Compass, Sparkles, Check, Info } from 'lucide-react';

export const EmbeddingSpaceExplorer: React.FC = () => {
  const [wordA, setWordA] = useState<WordVector2D>(EMBEDDING_SPACE_WORDS[0]); // 'cat'
  const [wordB, setWordB] = useState<WordVector2D>(EMBEDDING_SPACE_WORDS[1]); // 'dog'

  // Mathematically compute exact cosine similarity from the true 2D vector coordinates
  const vecA = [wordA.x, wordA.y];
  const vecB = [wordB.x, wordB.y];
  const similarityScore = cosineSimilarity(vecA, vecB);
  const angleDegrees = angularDistanceDegrees(similarityScore);

  // SVG coordinate transformation:
  // Mathematical [-1, 1] range to SVG viewBox [20, 280] (center at 150, 150)
  const toSvgX = (x: number) => 150 + x * 110;
  const toSvgY = (y: number) => 150 - y * 110; // invert Y for SVG

  const ptAx = toSvgX(wordA.x);
  const ptAy = toSvgY(wordA.y);
  const ptBx = toSvgX(wordB.x);
  const ptBy = toSvgY(wordB.y);

  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-10 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ece7dc] dark:border-[#22242b] mb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            Interactive Feature · Section 05
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
            2D Embedding Space & Cosine Similarity Explorer
          </h3>
        </div>

        <div className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          Cosine Formula: <code className="text-[#1c1917] dark:text-[#f3f4f6]">cos(u, v) = (u·v) / (||u|| ||v||)</code>
        </div>
      </div>

      <p className="text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed mb-6">
        In real language models, words with similar contextual meanings cluster together in space. Select two words below or click on the 2D coordinate map to compute their mathematically exact angular distance and cosine similarity.
      </p>

      {/* Main Two-Zone Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Zone: 2D Interactive Coordinate Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#ded7ca] dark:border-[#282a32] rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center relative">
          
          <div className="w-full flex justify-between text-[11px] font-mono text-[#78716c] dark:text-[#9ca3af] mb-2 px-1">
            <span>2D Semantic Coordinate Plane</span>
            <span>Origin (0, 0)</span>
          </div>

          <svg
            className="w-full max-w-[340px] sm:max-w-[400px] h-[300px] sm:h-[320px] select-none"
            viewBox="0 0 300 300"
          >
            {/* Grid Circles / Radii */}
            <circle cx="150" cy="150" r="110" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" className="text-[#d6cfc0] dark:text-[#282b34]" />
            <circle cx="150" cy="150" r="55" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" className="text-[#d6cfc0] dark:text-[#282b34]" />

            {/* X and Y Axes */}
            <line x1="20" y1="150" x2="280" y2="150" stroke="currentColor" strokeWidth="1" className="text-[#a8a29e] dark:text-[#3f434f]" />
            <line x1="150" y1="20" x2="150" y2="280" stroke="currentColor" strokeWidth="1" className="text-[#a8a29e] dark:text-[#3f434f]" />

            {/* Origin Marker */}
            <circle cx="150" cy="150" r="2.5" fill="#78716c" />

            {/* Connecting line between Word A and Word B */}
            <line
              x1={ptAx}
              y1={ptAy}
              x2={ptBx}
              y2={ptBy}
              stroke="#c2410c"
              strokeWidth="1.5"
              strokeDasharray="4,4"
              className="dark:stroke-[#d97706]"
            />

            {/* Vector Ray A (from origin to ptA) */}
            <line
              x1="150"
              y1="150"
              x2={ptAx}
              y2={ptAy}
              stroke="#c2410c"
              strokeWidth="2"
              className="dark:stroke-[#d97706]"
            />

            {/* Vector Ray B (from origin to ptB) */}
            <line
              x1="150"
              y1="150"
              x2={ptBx}
              y2={ptBy}
              stroke="#0284c7"
              strokeWidth="2"
            />

            {/* Render All Words as Interactive Points */}
            {EMBEDDING_SPACE_WORDS.map((w) => {
              const cx = toSvgX(w.x);
              const cy = toSvgY(w.y);
              const isA = wordA.word === w.word;
              const isB = wordB.word === w.word;

              let fillColor = w.color;
              if (isA) fillColor = '#c2410c';
              if (isB) fillColor = '#0284c7';

              return (
                <g
                  key={w.word}
                  onClick={() => {
                    if (wordA.word === w.word) return;
                    setWordB(w);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Highlight Ring */}
                  {(isA || isB) && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="12"
                      fill="none"
                      stroke={isA ? '#c2410c' : '#0284c7'}
                      strokeWidth="2"
                      className="animate-pulse opacity-75"
                    />
                  )}

                  <circle
                    cx={cx}
                    cy={cy}
                    r={isA || isB ? 6 : 4.5}
                    fill={fillColor}
                    className="transition-transform group-hover:scale-125"
                  />

                  {/* Word Label */}
                  <text
                    x={cx + 8}
                    y={cy + 4}
                    fill="currentColor"
                    fontSize={isA || isB ? "12" : "11"}
                    fontWeight={isA || isB ? "bold" : "normal"}
                    className={`${
                      isA
                        ? 'text-[#c2410c] dark:text-[#d97706]'
                        : isB
                        ? 'text-[#0284c7] dark:text-[#38bdf8]'
                        : 'text-[#44403c] dark:text-[#d1d5db]'
                    }`}
                  >
                    {w.word}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-[#78716c] dark:text-[#9ca3af] mt-2 pt-2 border-t border-[#ded7ca] dark:border-[#282a32] w-full">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#d97706]" />
              <span>Animals</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#059669]" />
              <span>Fruits</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0284c7]" />
              <span>Vehicles</span>
            </div>
          </div>
        </div>

        {/* Right Zone: Math & Similarity Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Pair Selectors */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono uppercase text-[#c2410c] dark:text-[#d97706] font-semibold mb-1">
                Vector 1 (u):
              </label>
              <select
                value={wordA.word}
                onChange={(e) => {
                  const found = EMBEDDING_SPACE_WORDS.find((w) => w.word === e.target.value);
                  if (found) setWordA(found);
                }}
                className="w-full text-xs font-mono p-2.5 rounded bg-[#faf8f5] dark:bg-[#1a1c22] border border-[#ded7ca] dark:border-[#282a32] text-[#1c1917] dark:text-[#f3f4f6]"
              >
                {EMBEDDING_SPACE_WORDS.map((w) => (
                  <option key={w.word} value={w.word}>
                    "{w.word}" [{w.x >= 0 ? `+${w.x}` : w.x}, {w.y >= 0 ? `+${w.y}` : w.y}] ({w.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#0284c7] font-semibold mb-1">
                Vector 2 (v):
              </label>
              <select
                value={wordB.word}
                onChange={(e) => {
                  const found = EMBEDDING_SPACE_WORDS.find((w) => w.word === e.target.value);
                  if (found) setWordB(found);
                }}
                className="w-full text-xs font-mono p-2.5 rounded bg-[#faf8f5] dark:bg-[#1a1c22] border border-[#ded7ca] dark:border-[#282a32] text-[#1c1917] dark:text-[#f3f4f6]"
              >
                {EMBEDDING_SPACE_WORDS.map((w) => (
                  <option key={w.word} value={w.word}>
                    "{w.word}" [{w.x >= 0 ? `+${w.x}` : w.x}, {w.y >= 0 ? `+${w.y}` : w.y}] ({w.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Computed Similarity Display */}
          <div className="p-5 bg-white dark:bg-[#141518] rounded-xl border border-[#ded7ca] dark:border-[#282a32] space-y-4 shadow-xs">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block">
              Calculated Metric:
            </span>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-mono font-bold text-[#1c1917] dark:text-[#f3f4f6] tabular-data">
                  {similarityScore >= 0 ? `+${similarityScore.toFixed(4)}` : similarityScore.toFixed(4)}
                </span>
                <span className="block text-xs text-[#78716c] dark:text-[#9ca3af] mt-0.5">
                  Cosine Similarity: cos(θ)
                </span>
              </div>

              <div className="text-right">
                <span className="text-2xl font-mono font-bold text-[#c2410c] dark:text-[#d97706] tabular-data">
                  {angleDegrees}°
                </span>
                <span className="block text-xs text-[#78716c] dark:text-[#9ca3af] mt-0.5">
                  Angular Difference (θ)
                </span>
              </div>
            </div>

            {/* Visual Interpretation Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[10px] font-mono text-[#78716c] dark:text-[#9ca3af]">
                <span>Opposite (-1.0)</span>
                <span>Orthogonal (0.0)</span>
                <span>Parallel (+1.0)</span>
              </div>
              <div className="w-full bg-[#f0ebe1] dark:bg-[#1f2127] h-2 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-[#c2410c] dark:bg-[#d97706] transition-all duration-300 rounded-full"
                  style={{
                    width: `${Math.max(0, Math.min(100, ((similarityScore + 1) / 2) * 100))}%`,
                  }}
                />
              </div>
            </div>

            {/* Semantic Interpretation Explanation */}
            <div className="p-3 bg-[#faf8f5] dark:bg-[#0c0d10] rounded text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
              {similarityScore > 0.8 ? (
                <span>
                  <strong>High Semantic Affinity:</strong> Both vectors point in almost the same direction (θ ≈ {angleDegrees}°). In latent space, the model treats them as having similar contextual roles.
                </span>
              ) : similarityScore > 0.2 ? (
                <span>
                  <strong>Moderate Affinity:</strong> Vectors share some dimensional traits but maintain distinctive directional divergence.
                </span>
              ) : similarityScore >= -0.2 ? (
                <span>
                  <strong>Near Orthogonal:</strong> The vectors are essentially perpendicular (θ ≈ {angleDegrees}°). Changes in one word's direction have virtually zero projection onto the other.
                </span>
              ) : (
                <span>
                  <strong>Divergent Direction:</strong> Vectors point in opposing quadrants of the coordinate space, reflecting unrelated semantic domains.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scientific Footnote */}
      <div className="mt-6 pt-4 border-t border-[#ece7dc] dark:border-[#22242b] text-[11px] font-mono text-[#78716c] dark:text-[#9ca3af]">
        * Educational Notice: This 2D coordinate system is a simplified pedagogical illustration. Real LLMs compute cosine distances in 4,096 dimensions where geometry is significantly more multifaceted.
      </div>
    </div>
  );
};
