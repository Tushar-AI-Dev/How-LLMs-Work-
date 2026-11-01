import React, { useState } from 'react';
import { tokenizeTextReal } from '../../services/tokenizerService';
import {
  scaledDotProductAttention,
  transpose,
  matmul,
  MULTI_HEAD_SAMPLES,
} from '../../services/attentionService';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Eye, Shield, Layers, HelpCircle, Info, RefreshCw } from 'lucide-react';

interface AttentionExperimentProps {
  sentence: string;
}

export const AttentionExperiment: React.FC<AttentionExperimentProps> = ({ sentence }) => {
  const tokenized = tokenizeTextReal(sentence);
  // Restrict to max 8 tokens for clean matrix readability in playground
  const rawTokens = tokenized.tokens.slice(0, 8);
  const activeTokens = rawTokens.length > 0 ? rawTokens : [{ text: 'The', id: 0 }, { text: 'cat', id: 1 }];
  const numTokens = activeTokens.length;

  const [isCausal, setIsCausal] = useState<boolean>(true);
  const [selectedQueryIdx, setSelectedQueryIdx] = useState<number>(0);
  const [selectedHeadIdx, setSelectedHeadIdx] = useState<number>(0);
  const [scalingFactor, setScalingFactor] = useState<boolean>(true);

  // Generate deterministic 4D Q, K, V matrices for the active tokens based on token IDs
  const d_k = 4;
  const Q: number[][] = [];
  const K: number[][] = [];
  const V: number[][] = [];

  for (let i = 0; i < numTokens; i++) {
    const id = activeTokens[i].id;
    // Deterministic projection
    Q.push([
      Number((Math.sin(id * 0.17 + i) * 1.2).toFixed(2)),
      Number((Math.cos(id * 0.23 + i) * 1.1).toFixed(2)),
      Number((Math.sin(id * 0.31 + i) * 0.9).toFixed(2)),
      Number((Math.cos(id * 0.41 + i) * 1.3).toFixed(2)),
    ]);
    K.push([
      Number((Math.sin(id * 0.19 + i * 2) * 1.1).toFixed(2)),
      Number((Math.cos(id * 0.29 + i * 2) * 1.2).toFixed(2)),
      Number((Math.sin(id * 0.37 + i * 2) * 0.8).toFixed(2)),
      Number((Math.cos(id * 0.43 + i * 2) * 1.0).toFixed(2)),
    ]);
    V.push([
      Number((Math.sin(id * 0.13 + i * 3) * 1.5).toFixed(2)),
      Number((Math.cos(id * 0.21 + i * 3) * 1.3).toFixed(2)),
      Number((Math.sin(id * 0.33 + i * 3) * 1.4).toFixed(2)),
      Number((Math.cos(id * 0.47 + i * 3) * 1.2).toFixed(2)),
    ]);
  }

  // Calculate real scaled dot product attention
  const computation = scaledDotProductAttention(Q, K, V, isCausal);
  const weights = computation.attentionWeights;
  const rawScores = computation.rawScores;
  const output = computation.output;

  const currentQueryToken = activeTokens[selectedQueryIdx] || activeTokens[0];
  const activeWeights = weights[selectedQueryIdx] || [];

  return (
    <div className="space-y-8">
      {/* Experiment Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#ece7dc] dark:border-[#26282f]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            <span>Experiment 04</span>
            <span>·</span>
            <span>Dynamic Context Routing</span>
          </div>
          <h2 className="text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            Scaled Dot-Product Attention Laboratory
          </h2>
        </div>

        {/* Causal Masking Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCausal(!isCausal)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer ${
              isCausal
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                : 'bg-white dark:bg-[#1a1c22] text-[#57534e] dark:text-[#9ca3af] border-[#ded7ca] dark:border-[#282a32]'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#c2410c] dark:text-[#d97706]" />
            <span>Causal Mask (Autoregressive): {isCausal ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Governing Mathematical Formulation */}
      <div className="p-4 bg-white dark:bg-[#141518] rounded-xl border border-[#e6e0d4] dark:border-[#26282f] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          Mathematical Core:
        </div>
        <div className="overflow-x-auto text-xs sm:text-sm text-[#1c1917] dark:text-[#f3f4f6]">
          <LatexRenderer
            math="\text{Attention}(Q, K, V) = \text{softmax}\left( \frac{QK^T}{\sqrt{d_k}} + M \right) V"
            displayMode={true}
          />
        </div>
        <div className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          d_k = {d_k} | √d_k = 2.0
        </div>
      </div>

      {/* Two-Column Stage: Left Heatmap Matrix, Right Query Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Attention Heatmap Matrix (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              Attention Weight Matrix [{numTokens} × {numTokens}]
            </h3>
            <span className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
              Rows: Query (Q) · Cols: Key (K)
            </span>
          </div>

          <div className="overflow-x-auto p-4 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-lg">
            <div className="min-w-[360px]">
              {/* Header: Keys */}
              <div className="flex items-center mb-1 text-[11px] font-mono text-[#78716c] dark:text-[#9ca3af]">
                <div className="w-20 shrink-0 font-semibold text-center">Q \ K</div>
                {activeTokens.map((t, j) => (
                  <div key={j} className="flex-1 text-center font-medium truncate">
                    "{t.text}"
                  </div>
                ))}
              </div>

              {/* Rows: Queries */}
              {weights.map((row, i) => {
                const isSelectedRow = selectedQueryIdx === i;

                return (
                  <div
                    key={i}
                    onClick={() => setSelectedQueryIdx(i)}
                    className={`flex items-center gap-1 py-1 px-1 rounded cursor-pointer transition-colors ${
                      isSelectedRow
                        ? 'bg-[#e2dbce] dark:bg-[#26282f] ring-1 ring-[#c2410c] dark:ring-[#d97706]'
                        : 'hover:bg-[#f0ebe1] dark:hover:bg-[#181a20]'
                    }`}
                  >
                    <div className="w-20 shrink-0 font-mono text-xs font-semibold text-[#1c1917] dark:text-[#f3f4f6] truncate">
                      #{i} "{activeTokens[i]?.text}"
                    </div>

                    {row.map((weight, j) => {
                      const isMasked = isCausal && j > i;

                      return (
                        <div
                          key={j}
                          title={`Q: "${activeTokens[i]?.text}", K: "${activeTokens[j]?.text}", Weight: ${weight.toFixed(3)}`}
                          className={`flex-1 h-9 rounded flex items-center justify-center text-xs font-mono tabular-data font-semibold transition-all ${
                            isMasked
                              ? 'bg-[#ece7dc]/40 dark:bg-[#1f2127]/30 text-[#a8a29e] dark:text-[#52525b] border border-dashed border-[#ded7ca] dark:border-[#282a32]'
                              : weight > 0.4
                              ? 'bg-[#c2410c] text-white shadow-xs'
                              : weight > 0.2
                              ? 'bg-amber-400 dark:bg-amber-600 text-stone-900 font-bold'
                              : 'bg-amber-100 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200'
                          }`}
                        >
                          {isMasked ? '0.00' : weight.toFixed(2)}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-[#57534e] dark:text-[#9ca3af]">
            {isCausal ? (
              <span>
                <strong>Lower-Triangular Causal Mask Active:</strong> Tokens can only attend to past or present positions ($j \le i$). The upper triangle is strictly zeroed by adding $-\infty$ before softmax.
              </span>
            ) : (
              <span>
                <strong>Full Bidirectional Attention:</strong> Tokens can freely attend across the entire sequence forward and backward (used in encoders like BERT and T5).
              </span>
            )}
          </p>
        </div>

        {/* Right Column: Query Token Detail Probe & Value Aggregation (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#ece7dc] dark:border-[#22242b]">
            <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
              Query Focus Probe
            </span>
            <span className="text-xs font-mono text-[#1c1917] dark:text-[#f3f4f6]">
              Token [{selectedQueryIdx}]: <strong className="underline">"{currentQueryToken.text}"</strong>
            </span>
          </div>

          {/* Attention distribution breakdown for current query */}
          <div className="space-y-2.5">
            <span className="text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block">
              Attention Weights from "{currentQueryToken.text}":
            </span>

            <div className="space-y-2">
              {activeTokens.map((t, j) => {
                const w = activeWeights[j] || 0;
                const isMasked = isCausal && j > selectedQueryIdx;
                const pct = Math.round(w * 100);

                return (
                  <div key={j} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#1c1917] dark:text-[#f3f4f6]">
                        "{t.text}" #{j}
                      </span>
                      <span className="tabular-data font-semibold text-[#c2410c] dark:text-[#d97706]">
                        {isMasked ? 'Masked (-∞)' : `${pct}% (${w.toFixed(3)})`}
                      </span>
                    </div>

                    <div className="w-full bg-[#f0ebe1] dark:bg-[#1f2127] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-200 ${
                          isMasked
                            ? 'bg-transparent'
                            : w > 0.4
                            ? 'bg-[#c2410c] dark:bg-[#d97706]'
                            : 'bg-amber-400 dark:bg-amber-600'
                        }`}
                        style={{ width: isMasked ? '0%' : `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Output Vector z = Sum(weight_j * V_j) */}
          <div className="pt-3 border-t border-[#ece7dc] dark:border-[#26282f] space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block">
              Context-Updated Output Vector z_{'{' + selectedQueryIdx + '}'}:
            </span>
            <div className="p-3 bg-[#faf8f5] dark:bg-[#0c0d10] rounded border border-[#ded7ca] dark:border-[#282a32] text-xs font-mono text-[#1c1917] dark:text-[#f3f4f6]">
              <span className="text-[#78716c] dark:text-[#9ca3af]">z = </span>
              <span className="text-[#c2410c] dark:text-[#d97706] font-semibold">
                [{(output[selectedQueryIdx] || [0,0,0,0]).map((v) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2))).join(', ')}]
              </span>
            </div>
            <p className="text-[11px] text-[#78716c] dark:text-[#9ca3af]">
              This output vector is a weighted superposition of all accessible Value vectors.
            </p>
          </div>
        </div>
      </div>

      {/* Multi-Head Attention Role Presets */}
      <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#ece7dc] dark:border-[#26282f]">
          <Layers className="w-4 h-4 text-[#c2410c] dark:text-[#d97706]" />
          <h3 className="font-serif text-lg font-medium text-[#1c1917] dark:text-[#f3f4f6]">
            Multi-Head Attention: Specialized Linguistic Subspaces
          </h3>
        </div>

        <p className="text-xs text-[#57534e] dark:text-[#9ca3af]">
          Modern models deploy 32 to 128 attention heads in parallel. Each head learns distinct projection matrices $W_Q, W_K, W_V$, allowing the model to attend to different linguistic phenomena simultaneously:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          {MULTI_HEAD_SAMPLES.map((head, idx) => (
            <div
              key={head.id}
              className="p-3.5 bg-[#faf8f5] dark:bg-[#1a1c22] rounded-lg border border-[#ded7ca] dark:border-[#282a32] space-y-1.5"
            >
              <span className="text-[11px] text-[#c2410c] dark:text-[#d97706] font-bold block">
                HEAD 0{head.id}
              </span>
              <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6] block text-xs">
                {head.linguisticRole}
              </span>
              <p className="text-[11px] text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
                {head.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
