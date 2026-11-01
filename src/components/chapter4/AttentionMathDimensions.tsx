import React, { useState } from 'react';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Cpu, Database, HardDrive, HelpCircle } from 'lucide-react';

export const AttentionMathDimensions: React.FC = () => {
  const [seqLen, setSeqLen] = useState<number>(4096);
  const [dModel, setDModel] = useState<number>(4096);
  const [numHeads, setNumHeads] = useState<number>(32);

  // Derived dimensions
  const d_k = Math.floor(dModel / numHeads); // e.g. 128
  // Number of elements in attention matrix: numHeads * seqLen * seqLen
  const attentionMatrixElements = numHeads * seqLen * seqLen;
  // In FP16 / BF16 (2 bytes per float)
  const attentionBytes = attentionMatrixElements * 2;
  const attentionMB = attentionBytes / (1024 * 1024);
  const attentionGB = attentionMB / 1024;

  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-8 shadow-xs">
      <div className="pb-4 border-b border-[#ece7dc] dark:border-[#22242b] mb-6">
        <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
          Section 11 · Computational Perspective
        </span>
        <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
          Tensor Shapes & The O(L²) Attention Matrix
        </h3>
        <p className="mt-2 text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          Understanding the tensor dimensionality of every intermediate step reveals why modern LLMs require specialized hardware and why extending context windows requires significant compute.
        </p>
      </div>

      {/* The Master Attention Formula */}
      <div className="p-4 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-lg mb-6 text-center">
        <span className="text-xs font-mono uppercase text-[#78716c] block mb-1">
          The Canonical Scaled Dot-Product Attention Equation
        </span>
        <div className="text-sm sm:text-lg text-[#1c1917] dark:text-[#f3f4f6] py-1">
          <LatexRenderer
            math="\text{Attention}(Q, K, V) = \text{softmax}\left( \frac{QK^T}{\sqrt{d_k}} + M \right) V"
            displayMode={true}
          />
        </div>
      </div>

      {/* Tensor Dimensionality Pipeline */}
      <div className="p-6 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-xl space-y-6 mb-6">
        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1c1917] dark:text-[#f3f4f6]">
          Matrix Dimensionality Transformation Flow
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 bg-white dark:bg-[#141518] rounded-lg border border-[#ded7ca] dark:border-[#282a32] space-y-1">
            <span className="text-[10px] font-mono text-[#78716c] uppercase">Input State (X)</span>
            <div className="font-mono text-sm font-bold text-[#1c1917] dark:text-[#f3f4f6]">
              [B, L, d_model]
            </div>
            <p className="text-[11px] text-[#57534e] dark:text-[#9ca3af]">
              Batch size × Sequence length × Hidden dimension
            </p>
          </div>

          <div className="p-3.5 bg-white dark:bg-[#141518] rounded-lg border border-[#ded7ca] dark:border-[#282a32] space-y-1">
            <span className="text-[10px] font-mono text-[#78716c] uppercase">Projections (Q, K, V)</span>
            <div className="font-mono text-sm font-bold text-[#c2410c] dark:text-[#d97706]">
              [B, h, L, d_k]
            </div>
            <p className="text-[11px] text-[#57534e] dark:text-[#9ca3af]">
              Partitioned across h heads, each with d_k = d_model / h
            </p>
          </div>

          <div className="p-3.5 bg-amber-50/80 dark:bg-amber-950/40 rounded-lg border border-amber-300 dark:border-amber-700/60 space-y-1">
            <span className="text-[10px] font-mono text-amber-800 dark:text-amber-300 uppercase font-bold">
              Attention Matrix (A)
            </span>
            <div className="font-mono text-sm font-bold text-amber-950 dark:text-amber-100">
              [B, h, L, L]
            </div>
            <p className="text-[11px] text-amber-900/80 dark:text-amber-200/80">
              Quadratic pairwise footprint across all sequence positions!
            </p>
          </div>

          <div className="p-3.5 bg-white dark:bg-[#141518] rounded-lg border border-[#ded7ca] dark:border-[#282a32] space-y-1">
            <span className="text-[10px] font-mono text-[#78716c] uppercase">Output State (O)</span>
            <div className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
              [B, L, d_model]
            </div>
            <p className="text-[11px] text-[#57534e] dark:text-[#9ca3af]">
              Concatenated heads multiplied by W_O restores original shape
            </p>
          </div>
        </div>
      </div>

      {/* Interactive GPU Memory & Attention Matrix Calculator */}
      <div className="p-6 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#ded7ca] dark:border-[#282a32]">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1c1917] dark:text-[#f3f4f6]">
            Interactive Attention Footprint Calculator
          </span>
          <span className="text-[11px] font-mono text-[#78716c]">
            Per Single Layer · FP16 Precision (2 bytes / element)
          </span>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-[#57534e] dark:text-[#9ca3af]">Sequence Context (L):</span>
              <span className="font-bold text-[#c2410c] dark:text-[#d97706]">{seqLen.toLocaleString()} tokens</span>
            </div>
            <input
              type="range"
              min="512"
              max="32768"
              step="512"
              value={seqLen}
              onChange={(e) => setSeqLen(Number(e.target.value))}
              className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#78716c] mt-1">
              <span>512</span>
              <span>8,192</span>
              <span>32k</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-[#57534e] dark:text-[#9ca3af]">Hidden Dim (d_model):</span>
              <span className="font-bold text-[#c2410c] dark:text-[#d97706]">{dModel}</span>
            </div>
            <input
              type="range"
              min="768"
              max="8192"
              step="256"
              value={dModel}
              onChange={(e) => setDModel(Number(e.target.value))}
              className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#78716c] mt-1">
              <span>768 (GPT-2)</span>
              <span>4,096 (7B/8B)</span>
              <span>8,192 (70B)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-[#57534e] dark:text-[#9ca3af]">Attention Heads (h):</span>
              <span className="font-bold text-[#c2410c] dark:text-[#d97706]">{numHeads} heads</span>
            </div>
            <input
              type="range"
              min="8"
              max="64"
              step="8"
              value={numHeads}
              onChange={(e) => setNumHeads(Number(e.target.value))}
              className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#78716c] mt-1">
              <span>8 heads</span>
              <span>32 heads</span>
              <span>64 heads</span>
            </div>
          </div>
        </div>

        {/* Live Calculation Output Card */}
        <div className="p-4 bg-white dark:bg-[#141518] rounded-lg border border-[#ded7ca] dark:border-[#282a32] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div>
            <span className="text-[#78716c] block">Head Dimension (d_k):</span>
            <span className="text-base font-bold text-[#1c1917] dark:text-[#f3f4f6] mt-0.5 block">
              {d_k} dims / head
            </span>
            <span className="text-[10px] text-[#78716c]">{dModel} ÷ {numHeads}</span>
          </div>

          <div>
            <span className="text-[#78716c] block">Attention Matrix Size:</span>
            <span className="text-base font-bold text-[#c2410c] dark:text-[#d97706] mt-0.5 block">
              {attentionMatrixElements > 1e6
                ? `${(attentionMatrixElements / 1e6).toFixed(1)}M floats`
                : `${(attentionMatrixElements / 1e3).toFixed(1)}k floats`}
            </span>
            <span className="text-[10px] text-[#78716c]">{numHeads} × {seqLen}²</span>
          </div>

          <div>
            <span className="text-[#78716c] block">Unfused VRAM Footprint:</span>
            <span className={`text-base font-bold mt-0.5 block ${attentionGB > 2 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {attentionGB >= 1 ? `${attentionGB.toFixed(2)} GB / layer` : `${attentionMB.toFixed(1)} MB / layer`}
            </span>
            <span className="text-[10px] text-[#78716c]">Notice quadratic <code className="font-mono">O(L²)</code> scaling</span>
          </div>
        </div>
      </div>
    </div>
  );
};
