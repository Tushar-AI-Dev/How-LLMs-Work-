import React, { useState } from 'react';
import { getDimensionFrequency } from '../../services/positionalEncodingService';
import { Waves, Sliders, Info } from 'lucide-react';

export const SinusoidalWaveVisualizer: React.FC = () => {
  const [selectedPairIndex, setSelectedPairIndex] = useState<number>(0); // 0, 1, 2, 3
  const [currentPos, setCurrentPos] = useState<number>(3); // 0 to 20

  const dModel = 16;
  const pairConfigs = [
    { pairIdx: 0, dims: "Dims 0 & 1", label: "Ultra-High Frequency", note: "Wavelength ≈ 6.28 tokens (oscillates on virtually every word)" },
    { pairIdx: 1, dims: "Dims 2 & 3", label: "High Frequency", note: "Wavelength ≈ 19.8 tokens (captures clause-level position)" },
    { pairIdx: 2, dims: "Dims 6 & 7", label: "Mid-Range Frequency", note: "Wavelength ≈ 198 tokens (captures sentence and paragraph position)" },
    { pairIdx: 4, dims: "Dims 10 & 11", label: "Low Frequency", note: "Wavelength ≈ 1,980 tokens (slowly varying drift across chapters)" },
  ];

  const activeConfig = pairConfigs[selectedPairIndex];
  const { omega, wavelength } = getDimensionFrequency(activeConfig.pairIdx, dModel);

  // Compute values at current position
  const denominator = Math.pow(10000, (2 * activeConfig.pairIdx) / dModel);
  const currentSin = Math.sin(currentPos / denominator);
  const currentCos = Math.cos(currentPos / denominator);

  // Generate SVG wave path data across pos 0 to 20
  const maxPos = 20;
  const svgWidth = 320;
  const svgHeight = 120;
  const centerY = svgHeight / 2;
  const amplitude = 42;

  // Generate SVG path for sine and cosine
  const points = 80;
  let sinPath = "";
  let cosPath = "";

  for (let p = 0; p <= points; p++) {
    const posVal = (p / points) * maxPos;
    const x = (p / points) * svgWidth;
    const ySin = centerY - Math.sin(posVal / denominator) * amplitude;
    const yCos = centerY - Math.cos(posVal / denominator) * amplitude;

    if (p === 0) {
      sinPath = `M ${x} ${ySin}`;
      cosPath = `M ${x} ${yCos}`;
    } else {
      sinPath += ` L ${x} ${ySin}`;
      cosPath += ` L ${x} ${yCos}`;
    }
  }

  // Active cursor coordinate on the SVG
  const cursorX = (currentPos / maxPos) * svgWidth;
  const cursorYSin = centerY - currentSin * amplitude;
  const cursorYCos = centerY - currentCos * amplitude;

  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-8 shadow-xs">
      <div className="pb-4 border-b border-[#ece7dc] dark:border-[#22242b] mb-6">
        <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
          Section 05 · Geometric Waves
        </span>
        <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
          Understanding the Harmonic Waves
        </h3>
        <p className="mt-2 text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          Why did the authors of the Transformer paper pick trigonometric waves instead of simple counter integers (1, 2, 3...)? Because frequencies create a smooth, continuous geometric coordinate system that naturally generalizes to arbitrary distances.
        </p>
      </div>

      {/* Dimension Pair Selector */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af] mr-2">
          Select Wave Frequency:
        </span>
        {pairConfigs.map((config, idx) => (
          <button
            key={config.dims}
            onClick={() => setSelectedPairIndex(idx)}
            className={`px-3 py-1.5 text-xs font-mono rounded cursor-pointer transition-all border ${
              selectedPairIndex === idx
                ? 'bg-[#c2410c] dark:bg-[#d97706] text-white border-transparent font-bold shadow-xs'
                : 'bg-[#faf8f5] dark:bg-[#1a1c22] text-[#44403c] dark:text-[#d1d5db] border-[#ded7ca] dark:border-[#282a32] hover:border-[#c2410c]'
            }`}
          >
            {config.dims} ({config.label.split(' ')[0]})
          </button>
        ))}
      </div>

      {/* Position Slider */}
      <div className="p-4 bg-[#faf8f5] dark:bg-[#0c0d10] rounded-lg border border-[#ded7ca] dark:border-[#282a32] mb-6 space-y-2">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-[#57534e] dark:text-[#9ca3af]">Adjust Token Position (pos):</span>
          <span className="text-base font-bold text-[#c2410c] dark:text-[#d97706] tabular-data">
            pos = {currentPos}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max={maxPos}
          step="1"
          value={currentPos}
          onChange={(e) => setCurrentPos(Number(e.target.value))}
          className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-[#78716c]">
          <span>pos = 0 (Start)</span>
          <span>pos = 10 (Middle)</span>
          <span>pos = 20 (Distant)</span>
        </div>
      </div>

      {/* Wave Visualization Canvas */}
      <div className="p-6 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-lg space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          <span>Continuous Wave Harmonics for {activeConfig.dims}</span>
          <span className="text-[#c2410c] dark:text-[#d97706]">Wavelength: {wavelength} tokens</span>
        </div>

        {/* SVG Wave Canvas */}
        <div className="w-full overflow-x-auto bg-white dark:bg-[#141518] rounded-lg border border-[#ded7ca] dark:border-[#282a32] p-4 flex justify-center">
          <svg className="w-full max-w-[500px] h-36 select-none" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
            {/* Center zero line */}
            <line x1="0" y1={centerY} x2={svgWidth} y2={centerY} stroke="#78716c" strokeWidth="0.75" strokeDasharray="3,3" opacity="0.4" />

            {/* Vertical tracker line at current pos */}
            <line
              x1={cursorX}
              y1="10"
              x2={cursorX}
              y2={svgHeight - 10}
              stroke="#78716c"
              strokeWidth="1"
              strokeDasharray="2,2"
            />

            {/* Sine Wave (Amber) */}
            <path d={sinPath} fill="none" stroke="#d97706" strokeWidth="2.5" />

            {/* Cosine Wave (Sky Blue) */}
            <path d={cosPath} fill="none" stroke="#0284c7" strokeWidth="2" strokeDasharray="4,2" />

            {/* Active tracking points */}
            <circle cx={cursorX} cy={cursorYSin} r="5" fill="#d97706" />
            <circle cx={cursorX} cy={cursorYCos} r="5" fill="#0284c7" />
          </svg>
        </div>

        {/* Live Values and Legend */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 bg-white dark:bg-[#141518] rounded border border-amber-300 dark:border-amber-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d97706]" />
              <span className="text-[#1c1917] dark:text-[#f3f4f6]">
                Sine Wave (Even Dim {activeConfig.pairIdx * 2})
              </span>
            </div>
            <span className="text-sm font-bold text-[#d97706] tabular-data">
              {currentSin >= 0 ? `+${currentSin.toFixed(4)}` : currentSin.toFixed(4)}
            </span>
          </div>

          <div className="p-3 bg-white dark:bg-[#141518] rounded border border-sky-300 dark:border-sky-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
              <span className="text-[#1c1917] dark:text-[#f3f4f6]">
                Cosine Wave (Odd Dim {activeConfig.pairIdx * 2 + 1})
              </span>
            </div>
            <span className="text-sm font-bold text-[#0284c7] tabular-data">
              {currentCos >= 0 ? `+${currentCos.toFixed(4)}` : currentCos.toFixed(4)}
            </span>
          </div>
        </div>

        <p className="text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed pt-1">
          {activeConfig.note}
        </p>
      </div>

      {/* The Clock Hands Analogy */}
      <div className="mt-6 p-4 bg-[#f8f5ee] dark:bg-[#191b21] rounded-lg border border-[#ded7ca] dark:border-[#282a32] text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed space-y-2">
        <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6] block">
          Intuitive Analogy: The Hands of a Clock
        </span>
        <p>
          Think of each dimension pair as a clock hand. Dimension 0 is the rapid <strong>second hand</strong> (rotating fully every few tokens). Dimension 6 is the <strong>minute hand</strong> (rotating over dozens of tokens). Higher dimensions act as the slow <strong>hour hand</strong>. By glancing across all dimensions at once, the neural network can instantly read both immediate micro-position (which adjacent token is this?) and macro-position (how far into the chapter is this token?) with zero ambiguity.
        </p>
      </div>
    </div>
  );
};
