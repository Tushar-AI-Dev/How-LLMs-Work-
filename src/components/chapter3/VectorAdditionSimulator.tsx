import React, { useState } from 'react';
import { SAMPLE_ADDITION_TOKENS, addVectors } from '../../services/positionalEncodingService';
import { Plus, Equal, ArrowRight, Check } from 'lucide-react';

export const VectorAdditionSimulator: React.FC = () => {
  const [selectedTokenKey, setSelectedTokenKey] = useState<string>('cat');
  const [selectedPos, setSelectedPos] = useState<number>(1);

  const availableTokens = Object.keys(SAMPLE_ADDITION_TOKENS);
  const tokenVec = SAMPLE_ADDITION_TOKENS[selectedTokenKey];

  // Mathematically compute exact 4D sinusoidal PE vector for selectedPos
  // dModel = 4
  const dModel = 4;
  const den0 = 1; // 10000^0
  const den2 = 100; // 10000^(2/4) = 10000^0.5 = 100
  const peVec = [
    Number(Math.sin(selectedPos / den0).toFixed(4)),
    Number(Math.cos(selectedPos / den0).toFixed(4)),
    Number(Math.sin(selectedPos / den2).toFixed(4)),
    Number(Math.cos(selectedPos / den2).toFixed(4)),
  ];

  // Combined representation via vector addition
  const combinedVec = addVectors(tokenVec, peVec);

  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-10 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ece7dc] dark:border-[#22242b] mb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            Interactive Feature · Section 06
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
            Vector Addition Simulator: Token + Position
          </h3>
        </div>

        <div className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          Formula: <code className="text-[#1c1917] dark:text-[#f3f4f6]">z = x_token + p_pos</code>
        </div>
      </div>

      <p className="text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed mb-6">
        To give the model sequence awareness without altering the dimensionality (<code className="font-mono">d_model</code>), the Transformer adds the positional vector directly to the token embedding element-by-element.
      </p>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Token Selector */}
        <div>
          <label className="block text-xs font-mono uppercase text-[#78716c] dark:text-[#9ca3af] mb-1.5 font-semibold">
            1. Select Vocabulary Token (x_token):
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTokens.map((tok) => (
              <button
                key={tok}
                onClick={() => setSelectedTokenKey(tok)}
                className={`px-3 py-1.5 text-xs font-mono rounded cursor-pointer transition-all border ${
                  selectedTokenKey === tok
                    ? 'bg-emerald-700 text-white border-transparent font-bold shadow-xs'
                    : 'bg-[#faf8f5] dark:bg-[#1a1c22] text-[#44403c] dark:text-[#d1d5db] border-[#ded7ca] dark:border-[#282a32] hover:border-emerald-600'
                }`}
              >
                "{tok}"
              </button>
            ))}
          </div>
        </div>

        {/* Position Selector */}
        <div>
          <label className="block text-xs font-mono uppercase text-[#78716c] dark:text-[#9ca3af] mb-1.5 font-semibold">
            2. Select Sequence Position (p_pos):
          </label>
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 3, 4, 5].map((pos) => (
              <button
                key={pos}
                onClick={() => setSelectedPos(pos)}
                className={`px-3 py-1.5 text-xs font-mono rounded cursor-pointer transition-all border ${
                  selectedPos === pos
                    ? 'bg-[#c2410c] dark:bg-[#d97706] text-white border-transparent font-bold shadow-xs'
                    : 'bg-[#faf8f5] dark:bg-[#1a1c22] text-[#44403c] dark:text-[#d1d5db] border-[#ded7ca] dark:border-[#282a32] hover:border-[#c2410c]'
                }`}
              >
                Pos {pos}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vector Addition Equation Strip */}
      <div className="p-5 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-xl space-y-6">
        
        {/* Dimension-by-Dimension Mathematical Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((dimIdx) => {
            const tVal = tokenVec[dimIdx];
            const pVal = peVec[dimIdx];
            const sumVal = combinedVec[dimIdx];

            return (
              <div
                key={dimIdx}
                className="p-3 bg-white dark:bg-[#141518] rounded-lg border border-[#ded7ca] dark:border-[#282a32] text-xs font-mono space-y-2"
              >
                <div className="flex justify-between items-center text-[10px] text-[#78716c] dark:text-[#9ca3af] border-b border-[#ece7dc] dark:border-[#22242b] pb-1">
                  <span>Dimension {dimIdx}</span>
                  <span>{dimIdx % 2 === 0 ? 'Sine' : 'Cosine'}</span>
                </div>

                {/* Token Component */}
                <div className="flex justify-between items-center text-emerald-800 dark:text-emerald-400">
                  <span>x_{dimIdx} (Token):</span>
                  <span className="font-bold tabular-data">{tVal >= 0 ? `+${tVal.toFixed(2)}` : tVal.toFixed(2)}</span>
                </div>

                {/* Positional Component */}
                <div className="flex justify-between items-center text-[#c2410c] dark:text-[#d97706]">
                  <span>p_{dimIdx} (Pos {selectedPos}):</span>
                  <span className="font-bold tabular-data">{pVal >= 0 ? `+${pVal.toFixed(2)}` : pVal.toFixed(2)}</span>
                </div>

                {/* Equal Line */}
                <div className="pt-1.5 border-t border-[#ece7dc] dark:border-[#22242b] flex justify-between items-center font-bold text-[#1c1917] dark:text-[#f3f4f6]">
                  <span>z_{dimIdx} (Sum):</span>
                  <span className="tabular-data text-sm">{sumVal >= 0 ? `+${sumVal.toFixed(2)}` : sumVal.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full Combined Vector Representation */}
        <div className="p-4 bg-white dark:bg-[#141518] rounded-lg border border-[#c2410c] dark:border-[#d97706] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-[#c2410c] dark:text-[#d97706] flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              Combined Input Representation (z) passed to Layer 1:
            </span>
            <span className="text-[#78716c] dark:text-[#9ca3af]">ℝ⁴ Tensor</span>
          </div>

          <div className="p-3 bg-[#faf8f5] dark:bg-[#0c0d10] rounded font-mono text-xs sm:text-sm text-[#1c1917] dark:text-[#f3f4f6] overflow-x-auto whitespace-nowrap">
            z = [ {combinedVec.map((v) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2))).join(', ')} ]
          </div>
        </div>

        {/* Labels Note */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#78716c] dark:text-[#9ca3af] pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Token Embeddings: Illustrative values</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#d97706]" />
            <span>Positional Encodings: Mathematically calculated values</span>
          </div>
        </div>
      </div>
    </div>
  );
};
