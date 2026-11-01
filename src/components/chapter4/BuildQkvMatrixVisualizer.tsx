import React, { useState } from 'react';
import {
  MINI_ATTENTION_SEQUENCE,
  MINI_X,
  MINI_W_Q,
  MINI_W_K,
  MINI_W_V,
  matmul,
} from '../../services/attentionService';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Calculator, ArrowRight, HelpCircle } from 'lucide-react';

export const BuildQkvMatrixVisualizer: React.FC = () => {
  const [activeProjection, setActiveProjection] = useState<'Q' | 'K' | 'V'>('Q');
  const [inspectedCell, setInspectedCell] = useState<{ row: number; col: number } | null>({
    row: 1,
    col: 0,
  });

  const activeW =
    activeProjection === 'Q' ? MINI_W_Q : activeProjection === 'K' ? MINI_W_K : MINI_W_V;
  const resultMatrix = matmul(MINI_X, activeW);

  const activeRow = inspectedCell ? inspectedCell.row : 0;
  const activeCol = inspectedCell ? inspectedCell.col : 0;
  const xRow = MINI_X[activeRow];
  const wCol = activeW.map((r) => r[activeCol]);
  const cellResult = resultMatrix[activeRow][activeCol];

  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ece7dc] dark:border-[#22242b] mb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            Interactive Feature · Section 05
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
            Building Q, K, and V via Matrix Projections
          </h3>
        </div>

        <div className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          Dynamic Matrix Multiplication
        </div>
      </div>

      <p className="text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed mb-6">
        Every token vector in sequence <code className="font-mono">X</code> is projected into Query, Key, and Value spaces by multiplying with learned weight matrices <code className="font-mono">W_Q</code>, <code className="font-mono">W_K</code>, and <code className="font-mono">W_V</code>. Select a target matrix and click any resulting cell to inspect its exact row-by-column dot product.
      </p>

      {/* Selector Tabs for Q, K, V */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setActiveProjection('Q')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all border ${
            activeProjection === 'Q'
              ? 'bg-[#c2410c] dark:bg-[#d97706] text-white border-transparent shadow-xs'
              : 'bg-[#faf8f5] dark:bg-[#1a1c22] text-[#44403c] dark:text-[#d1d5db] border-[#ded7ca] dark:border-[#282a32]'
          }`}
        >
          Compute Q = X · W_Q
        </button>

        <button
          onClick={() => setActiveProjection('K')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all border ${
            activeProjection === 'K'
              ? 'bg-[#0284c7] text-white border-transparent shadow-xs'
              : 'bg-[#faf8f5] dark:bg-[#1a1c22] text-[#44403c] dark:text-[#d1d5db] border-[#ded7ca] dark:border-[#282a32]'
          }`}
        >
          Compute K = X · W_K
        </button>

        <button
          onClick={() => setActiveProjection('V')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all border ${
            activeProjection === 'V'
              ? 'bg-emerald-600 dark:bg-emerald-500 text-white border-transparent shadow-xs'
              : 'bg-[#faf8f5] dark:bg-[#1a1c22] text-[#44403c] dark:text-[#d1d5db] border-[#ded7ca] dark:border-[#282a32]'
          }`}
        >
          Compute V = X · W_V
        </button>
      </div>

      {/* The 3 Matrices Display: X * W = Result */}
      <div className="p-6 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-xl space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
          
          {/* Matrix X (Input Representations: 4x4) */}
          <div className="lg:col-span-3 p-4 bg-white dark:bg-[#141518] rounded-lg border border-[#ded7ca] dark:border-[#282a32] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6]">Input Matrix X</span>
              <span className="text-[#78716c]">(4 × 4)</span>
            </div>

            <div className="space-y-1">
              {MINI_X.map((row, rIdx) => {
                const isSelectedRow = inspectedCell?.row === rIdx;
                return (
                  <div
                    key={rIdx}
                    className={`flex items-center gap-1 p-1 rounded transition-colors ${
                      isSelectedRow
                        ? 'bg-amber-100 dark:bg-amber-950/60 ring-1 ring-[#c2410c] dark:ring-[#d97706]'
                        : ''
                    }`}
                  >
                    <span className="w-12 text-[10px] font-mono text-[#78716c] truncate">
                      "{MINI_ATTENTION_SEQUENCE[rIdx]}"
                    </span>
                    {row.map((val, cIdx) => (
                      <span
                        key={cIdx}
                        className="flex-1 text-center font-mono text-[11px] font-medium text-[#1c1917] dark:text-[#f3f4f6]"
                      >
                        {val >= 0 ? `+${val.toFixed(1)}` : val.toFixed(1)}
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>
            <div className="text-[10px] font-mono text-[#78716c] text-center pt-1">
              Token Embeddings
            </div>
          </div>

          {/* Multiplication Operator */}
          <div className="lg:col-span-1 text-center text-xl font-mono font-bold text-[#78716c]">
            ×
          </div>

          {/* Matrix W (Projection Weights: 4x4) */}
          <div className="lg:col-span-3 p-4 bg-white dark:bg-[#141518] rounded-lg border border-[#ded7ca] dark:border-[#282a32] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6]">
                Weights W_{activeProjection}
              </span>
              <span className="text-[#78716c]">(4 × 4)</span>
            </div>

            <div className="space-y-1">
              {activeW.map((row, rIdx) => (
                <div key={rIdx} className="flex items-center gap-1 p-1">
                  <span className="w-6 text-[10px] font-mono text-[#78716c]">r{rIdx}</span>
                  {row.map((val, cIdx) => {
                    const isSelectedCol = inspectedCell?.col === cIdx;
                    return (
                      <span
                        key={cIdx}
                        className={`flex-1 text-center font-mono text-[11px] font-medium rounded p-0.5 transition-colors ${
                          isSelectedCol
                            ? 'bg-sky-100 dark:bg-sky-950/60 ring-1 ring-sky-500 font-bold'
                            : 'text-[#1c1917] dark:text-[#f3f4f6]'
                        }`}
                      >
                        {val >= 0 ? `+${val.toFixed(1)}` : val.toFixed(1)}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="text-[10px] font-mono text-[#78716c] text-center pt-1">
              Learned Projections
            </div>
          </div>

          {/* Equals Operator */}
          <div className="lg:col-span-1 text-center text-xl font-mono font-bold text-[#78716c]">
            =
          </div>

          {/* Result Matrix (Q, K, or V: 4x4) */}
          <div className="lg:col-span-3 p-4 bg-white dark:bg-[#141518] rounded-lg border border-[#ded7ca] dark:border-[#282a32] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#c2410c] dark:text-[#d97706]">
                Output Matrix {activeProjection}
              </span>
              <span className="text-[#78716c]">(4 × 4)</span>
            </div>

            <div className="space-y-1">
              {resultMatrix.map((row, rIdx) => (
                <div key={rIdx} className="flex items-center gap-1 p-1">
                  <span className="w-12 text-[10px] font-mono text-[#78716c] truncate">
                    "{MINI_ATTENTION_SEQUENCE[rIdx]}"
                  </span>
                  {row.map((val, cIdx) => {
                    const isSelected =
                      inspectedCell?.row === rIdx && inspectedCell?.col === cIdx;
                    return (
                      <button
                        key={cIdx}
                        onClick={() => setInspectedCell({ row: rIdx, col: cIdx })}
                        className={`flex-1 text-center font-mono text-[11px] font-bold p-1 rounded cursor-pointer transition-transform ${
                          isSelected
                            ? 'bg-[#1c1917] dark:bg-[#f3f4f6] text-white dark:text-[#111215] scale-105 shadow-xs'
                            : 'bg-[#faf8f5] dark:bg-[#1f2128] text-[#1c1917] dark:text-[#f3f4f6] hover:bg-[#ece7dc]'
                        }`}
                      >
                        {val >= 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="text-[10px] font-mono text-[#78716c] text-center pt-1">
              Click cell to inspect dot product
            </div>
          </div>
        </div>

        {/* Detailed Calculation Inspector */}
        {inspectedCell && (
          <div className="p-4 bg-white dark:bg-[#141518] rounded-lg border border-[#ded7ca] dark:border-[#282a32] space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2">
              <span className="font-bold text-[#c2410c] dark:text-[#d97706]">
                Inspected Cell: {activeProjection}["{MINI_ATTENTION_SEQUENCE[activeRow]}", dim {activeCol}]
              </span>
              <span className="text-sm font-bold text-[#1c1917] dark:text-[#f3f4f6]">
                Value = {cellResult >= 0 ? `+${cellResult.toFixed(3)}` : cellResult.toFixed(3)}
              </span>
            </div>

            <div className="p-3 bg-[#faf8f5] dark:bg-[#0c0d10] rounded font-mono text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed overflow-x-auto whitespace-nowrap">
              Calculation: Row {activeRow} of X · Col {activeCol} of W_{activeProjection}
              <div className="mt-1 text-[#1c1917] dark:text-[#f3f4f6] font-semibold">
                = ({xRow[0].toFixed(1)} × {wCol[0].toFixed(1)}) + ({xRow[1].toFixed(1)} × {wCol[1].toFixed(1)}) + ({xRow[2].toFixed(1)} × {wCol[2].toFixed(1)}) + ({xRow[3].toFixed(1)} × {wCol[3].toFixed(1)}) = {cellResult.toFixed(3)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
