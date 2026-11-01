import React, { useState } from 'react';
import { tokenizeTextReal } from '../../services/tokenizerService';
import {
  computeSinusoidalMatrix,
  getDimensionFrequency,
  addVectors,
} from '../../services/positionalEncodingService';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Sliders, Waves, RotateCw, Plus, Info } from 'lucide-react';

interface PositionalExperimentProps {
  sentence: string;
}

export const PositionalExperiment: React.FC<PositionalExperimentProps> = ({ sentence }) => {
  const tokenized = tokenizeTextReal(sentence);
  const activeTokens = tokenized.tokens;

  // Hyperparameters for PE matrix
  const [seqLen, setSeqLen] = useState<number>(Math.max(8, Math.min(24, activeTokens.length || 8)));
  const [dModel, setDModel] = useState<number>(16);
  const [selectedPos, setSelectedPos] = useState<number>(0);
  const [selectedDimPair, setSelectedDimPair] = useState<number>(0);
  const [mode, setMode] = useState<'sinusoidal' | 'rope'>('sinusoidal');

  // Compute PE matrix
  const peMatrix = computeSinusoidalMatrix(seqLen, dModel);
  const freqData = getDimensionFrequency(selectedDimPair, dModel);

  // Example vector addition: Token vector at selectedPos + PE vector at selectedPos
  const sampleTokenVec = [0.72, 0.48, -0.31, 0.15];
  const samplePeVec = peMatrix[selectedPos] ? peMatrix[selectedPos].slice(0, 4) : [0, 1, 0, 1];
  const combinedVec = addVectors(sampleTokenVec, samplePeVec);

  return (
    <div className="space-y-8">
      {/* Experiment Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#ece7dc] dark:border-[#26282f]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            <span>Experiment 03</span>
            <span>·</span>
            <span>Order & Permutation Invariance</span>
          </div>
          <h2 className="text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            Sinusoidal & Rotary Positional Encoding
          </h2>
        </div>

        {/* Method Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#f4efe6] dark:bg-[#1a1c22] rounded-lg border border-[#e6e0d4] dark:border-[#26282f] text-xs font-mono">
          <button
            onClick={() => setMode('sinusoidal')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              mode === 'sinusoidal'
                ? 'bg-white dark:bg-[#111215] text-[#1c1917] dark:text-[#f3f4f6] font-semibold shadow-xs'
                : 'text-[#57534e] dark:text-[#9ca3af]'
            }`}
          >
            Sinusoidal (Additive)
          </button>
          <button
            onClick={() => setMode('rope')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              mode === 'rope'
                ? 'bg-white dark:bg-[#111215] text-[#1c1917] dark:text-[#f3f4f6] font-semibold shadow-xs'
                : 'text-[#57534e] dark:text-[#9ca3af]'
            }`}
          >
            RoPE (Rotary Orthogonal)
          </button>
        </div>
      </div>

      {mode === 'sinusoidal' ? (
        <>
          {/* Controls & Grid Parameters */}
          <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#ece7dc] dark:border-[#22242b]">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#c2410c] dark:text-[#d97706]" />
                <h3 className="font-serif text-lg font-medium text-[#1c1917] dark:text-[#f3f4f6]">
                  Matrix Dimension Parameters
                </h3>
              </div>
              <span className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
                PE(pos, 2i) = sin(pos / 10000^{'{2i/d}'})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Sequence Length L */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-[#57534e] dark:text-[#9ca3af]">Sequence Length (L):</span>
                  <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">{seqLen} positions</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="24"
                  step="2"
                  value={seqLen}
                  onChange={(e) => setSeqLen(Number(e.target.value))}
                  className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#78716c] mt-1">
                  <span>4 pos</span>
                  <span>14 pos</span>
                  <span>24 pos</span>
                </div>
              </div>

              {/* Embedding Dimension d */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-[#57534e] dark:text-[#9ca3af]">Embedding Dimension (d_model):</span>
                  <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">{dModel} dimensions</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="32"
                  step="4"
                  value={dModel}
                  onChange={(e) => setDModel(Number(e.target.value))}
                  className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#78716c] mt-1">
                  <span>8 dims</span>
                  <span>20 dims</span>
                  <span>32 dims</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Heatmap Canvas */}
          <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif text-lg font-medium text-[#1c1917] dark:text-[#f3f4f6]">
                  Sinusoidal Positional Encoding Heatmap [{seqLen} × {dModel}]
                </h3>
                <p className="text-xs text-[#78716c] dark:text-[#9ca3af] mt-0.5">
                  Click any position row to inspect its exact high-dimensional coordinates.
                </p>
              </div>

              {/* Color legend */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-sky-600 dark:text-sky-400 font-semibold">-1.0 (Cos/Sin Min)</span>
                <div className="w-20 h-2.5 rounded bg-gradient-to-r from-sky-500 via-stone-200 to-amber-500" />
                <span className="text-amber-600 dark:text-amber-400 font-semibold">+1.0 (Max)</span>
              </div>
            </div>

            <div className="overflow-x-auto p-4 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-lg">
              <div className="min-w-[480px]">
                {/* Column Headers: Dimension i */}
                <div className="flex items-center mb-1 text-[10px] font-mono text-[#78716c] dark:text-[#9ca3af]">
                  <div className="w-16 shrink-0">Pos \ Dim</div>
                  {Array.from({ length: dModel }).map((_, i) => (
                    <div key={i} className="flex-1 text-center truncate">
                      {i % 2 === 0 ? `sin₂${i/2}` : `cos₂${Math.floor(i/2)}`}
                    </div>
                  ))}
                </div>

                {/* Matrix Rows */}
                {peMatrix.map((row, pos) => {
                  const isSelected = selectedPos === pos;
                  const tokenLabel = activeTokens[pos]?.text || `pos_${pos}`;

                  return (
                    <div
                      key={pos}
                      onClick={() => setSelectedPos(pos)}
                      className={`flex items-center gap-1 py-1 px-1 rounded cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#e2dbce] dark:bg-[#26282f] ring-1 ring-[#c2410c] dark:ring-[#d97706]'
                          : 'hover:bg-[#f0ebe1] dark:hover:bg-[#181a20]'
                      }`}
                    >
                      <div className="w-16 shrink-0 font-mono text-[11px] font-semibold text-[#1c1917] dark:text-[#f3f4f6] truncate">
                        #{pos} <span className="text-[10px] opacity-70">("{tokenLabel}")</span>
                      </div>

                      {row.map((val, dim) => {
                        // Map [-1, 1] to color
                        const isPositive = val >= 0;
                        const intensity = Math.abs(val);

                        return (
                          <div
                            key={dim}
                            title={`Pos: ${pos}, Dim: ${dim}, Value: ${val}`}
                            className={`flex-1 h-6 rounded-xs flex items-center justify-center text-[9px] font-mono tabular-data transition-all ${
                              isPositive
                                ? `bg-amber-500 text-stone-900 font-medium`
                                : `bg-sky-500 text-white font-medium`
                            }`}
                            style={{ opacity: Math.max(0.2, intensity) }}
                          >
                            {val.toFixed(1)}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Harmonic Wave Frequency Visualizer */}
          <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#ece7dc] dark:border-[#22242b]">
              <div className="flex items-center gap-2">
                <Waves className="w-4 h-4 text-[#c2410c] dark:text-[#d97706]" />
                <h3 className="font-serif text-lg font-medium text-[#1c1917] dark:text-[#f3f4f6]">
                  Continuous Frequency Progression
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-[#78716c] dark:text-[#9ca3af]">Dimension Pair i:</span>
                <select
                  value={selectedDimPair}
                  onChange={(e) => setSelectedDimPair(Number(e.target.value))}
                  className="px-2.5 py-1 text-xs font-mono bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#ded7ca] dark:border-[#282a32] rounded text-[#1c1917] dark:text-[#f3f4f6] cursor-pointer"
                >
                  {Array.from({ length: Math.floor(dModel / 2) }).map((_, i) => (
                    <option key={i} value={i}>
                      Pair i={i} (dims {2 * i}, {2 * i + 1})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-[#faf8f5] dark:bg-[#0c0d10] rounded border border-[#ded7ca] dark:border-[#282a32]">
                <span className="text-[#78716c] dark:text-[#9ca3af] block text-[11px]">Angular Frequency (ω)</span>
                <span className="text-xl font-bold text-[#c2410c] dark:text-[#d97706] mt-0.5 block tabular-data">
                  {freqData.omega} rad/pos
                </span>
                <span className="text-[10px] text-[#78716c] mt-0.5 block">
                  ω = 1 / 10000^{`{${(2 * selectedDimPair) / dModel}}`}
                </span>
              </div>

              <div className="p-3 bg-[#faf8f5] dark:bg-[#0c0d10] rounded border border-[#ded7ca] dark:border-[#282a32]">
                <span className="text-[#78716c] dark:text-[#9ca3af] block text-[11px]">Wavelength (λ = 2π / ω)</span>
                <span className="text-xl font-bold text-[#1c1917] dark:text-[#f3f4f6] mt-0.5 block tabular-data">
                  {freqData.wavelength} positions
                </span>
                <span className="text-[10px] text-[#78716c] mt-0.5 block">
                  {selectedDimPair === 0
                    ? 'High frequency (captures local syntax)'
                    : 'Low frequency (captures global sequence order)'}
                </span>
              </div>
            </div>
          </div>

          {/* Vector Summation Lab: E + PE */}
          <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#ece7dc] dark:border-[#22242b]">
              <Plus className="w-4 h-4 text-[#c2410c] dark:text-[#d97706]" />
              <h3 className="font-serif text-lg font-medium text-[#1c1917] dark:text-[#f3f4f6]">
                Element-wise Combination: x = Token Embedding + PE Vector
              </h3>
            </div>

            <p className="text-xs text-[#57534e] dark:text-[#9ca3af]">
              Before entering the first Transformer block, the semantic token embedding vector is combined with the positional vector at position #{selectedPos}:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3.5 bg-[#faf8f5] dark:bg-[#0c0d10] rounded border border-[#ded7ca] dark:border-[#282a32]">
                <span className="text-[11px] text-[#78716c] dark:text-[#9ca3af] block">
                  1. Semantic Embedding E (Token #{selectedPos})
                </span>
                <div className="text-sm font-semibold text-[#1c1917] dark:text-[#f3f4f6] mt-1">
                  [{sampleTokenVec.map((v) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2))).join(', ')}]
                </div>
              </div>

              <div className="p-3.5 bg-[#faf8f5] dark:bg-[#0c0d10] rounded border border-[#ded7ca] dark:border-[#282a32]">
                <span className="text-[11px] text-[#78716c] dark:text-[#9ca3af] block">
                  2. Positional Vector PE (Position #{selectedPos})
                </span>
                <div className="text-sm font-semibold text-amber-700 dark:text-amber-400 mt-1">
                  [{samplePeVec.map((v) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2))).join(', ')}]
                </div>
              </div>

              <div className="p-3.5 bg-[#faf8f5] dark:bg-[#0c0d10] rounded border border-[#c2410c]/40 dark:border-[#d97706]/40">
                <span className="text-[11px] text-[#c2410c] dark:text-[#d97706] block font-semibold">
                  3. Transformer Input x = E + PE
                </span>
                <div className="text-sm font-bold text-[#c2410c] dark:text-[#d97706] mt-1">
                  [{combinedVec.map((v) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2))).join(', ')}]
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* RoPE (Rotary Position Embedding) Mode */
        <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-[#ece7dc] dark:border-[#22242b]">
            <RotateCw className="w-5 h-5 text-[#c2410c] dark:text-[#d97706]" />
            <div>
              <h3 className="font-serif text-lg font-medium text-[#1c1917] dark:text-[#f3f4f6]">
                Rotary Position Embedding (RoPE) in Modern LLMs (LLaMA, Mistral, PaLM)
              </h3>
              <p className="text-xs text-[#78716c] dark:text-[#9ca3af] mt-0.5">
                Instead of adding vectors into the input embedding, RoPE multiplies Query and Key vectors by 2D orthogonal rotation matrices.
              </p>
            </div>
          </div>

          <div className="p-4 bg-[#faf8f5] dark:bg-[#0c0d10] rounded-lg border border-[#ded7ca] dark:border-[#282a32] text-center">
            <LatexRenderer
              math="\mathbf{R}_{\Theta, m}^d = \begin{pmatrix} \cos(m\theta_1) & -\sin(m\theta_1) & 0 & 0 \\ \sin(m\theta_1) & \cos(m\theta_1) & 0 & 0 \\ 0 & 0 & \cos(m\theta_2) & -\sin(m\theta_2) \\ 0 & 0 & \sin(m\theta_2) & \cos(m\theta_2) \end{pmatrix}"
              displayMode={true}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 bg-[#f8f5ee] dark:bg-[#1a1c22] rounded border border-[#ded7ca] dark:border-[#282a32] space-y-1.5">
              <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">1. Multiplicative Rotation</span>
              <p className="text-[#57534e] dark:text-[#9ca3af] leading-relaxed text-[11px]">
                Preserves vector norm ||q|| while rotating the query vector angle proportional to position index m.
              </p>
            </div>

            <div className="p-4 bg-[#f8f5ee] dark:bg-[#1a1c22] rounded border border-[#ded7ca] dark:border-[#282a32] space-y-1.5">
              <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">2. Relative Dot Product</span>
              <p className="text-[#57534e] dark:text-[#9ca3af] leading-relaxed text-[11px]">
                The dot product ⟨R_m q, R_n k⟩ depends strictly on relative offset (m - n), enabling length generalization.
              </p>
            </div>

            <div className="p-4 bg-[#f8f5ee] dark:bg-[#1a1c22] rounded border border-[#ded7ca] dark:border-[#282a32] space-y-1.5">
              <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">3. Zero Memory Overhead</span>
              <p className="text-[#57534e] dark:text-[#9ca3af] leading-relaxed text-[11px]">
                No learned embedding parameters required; rotations are computed on the fly via complex multiplications.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Explanatory Context */}
      <div className="p-4 bg-[#faf8f5] dark:bg-[#111215] border border-[#e6e0d4] dark:border-[#26282f] rounded-lg text-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
          <Info className="w-4 h-4 text-[#c2410c] dark:text-[#d97706]" />
          <span>Why Positional Encodings Are Essential</span>
        </div>
        <p className="text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          Because self-attention treats tokens as an unordered set of vectors (permutation-invariant), <em>"The cat chased the dog"</em> and <em>"The dog chased the cat"</em> would produce identical internal states without positional information. Encodings inject an explicit spatial coordinate system into the network.
        </p>
      </div>
    </div>
  );
};
