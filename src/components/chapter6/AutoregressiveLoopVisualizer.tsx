import React, { useState, useEffect } from 'react';
import { LatexRenderer } from '../ui/LatexRenderer';
import { RefreshCw, Play, Pause, ArrowRight, Layers, Database, Cpu } from 'lucide-react';

interface LoopStage {
  step: number;
  title: string;
  context: string[];
  action: string;
  outputToken: string;
}

const LOOP_STAGES: LoopStage[] = [
  {
    step: 1,
    title: 'Initial Prompt Evaluation',
    context: ['The', 'cat', 'slept', 'on', 'the'],
    action: 'Compute full self-attention across 5 tokens. Project final hidden state to vocabulary logits.',
    outputToken: 'mat',
  },
  {
    step: 2,
    title: 'First Autoregressive Append',
    context: ['The', 'cat', 'slept', 'on', 'the', 'mat'],
    action: 'Append "mat". Sequence length is now 6. Pass 6 tokens through all Transformer blocks.',
    outputToken: 'peacefully',
  },
  {
    step: 3,
    title: 'Second Autoregressive Append',
    context: ['The', 'cat', 'slept', 'on', 'the', 'mat', 'peacefully'],
    action: 'Append "peacefully". Sequence length is now 7. Predict next token conditioned on full history.',
    outputToken: '.',
  },
  {
    step: 4,
    title: 'Third Autoregressive Append',
    context: ['The', 'cat', 'slept', 'on', 'the', 'mat', 'peacefully', '.'],
    action: 'Append ".". Sequence length is now 8. Final layer emits the special <EOS> termination token.',
    outputToken: '<EOS>',
  },
];

export const AutoregressiveLoopVisualizer: React.FC = () => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isAutoCycling, setIsAutoCycling] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isAutoCycling) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => (prev + 1) % LOOP_STAGES.length);
      }, 2000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoCycling]);

  const activeStage = LOOP_STAGES[currentStepIdx];

  return (
    <div className="bg-white dark:bg-[#131417] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#ece7dc] dark:border-[#22242b] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            <RefreshCw className="w-4 h-4" />
            <span>Iterative Sequence Synthesis</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            The Autoregressive Feedback Loop
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoCycling(!isAutoCycling)}
            className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              isAutoCycling
                ? 'bg-amber-500/20 text-amber-900 dark:text-amber-200 border-amber-500/40'
                : 'bg-[#faf8f5] dark:bg-[#1a1c22] border-[#ece7dc] dark:border-[#282a32] text-[#78716c] dark:text-[#9ca3af]'
            }`}
          >
            {isAutoCycling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoCycling ? 'Pause Loop' : 'Cycle Loop'}</span>
          </button>
        </div>
      </div>

      {/* Governing Formula */}
      <div className="my-6 p-4 bg-[#faf8f5] dark:bg-[#181a1f] rounded-lg border border-[#ece7dc] dark:border-[#26282f] text-center">
        <LatexRenderer
          math="P(w_1, w_2, \dots, w_T) = \prod_{t=1}^T P(w_t \mid w_1, \dots, w_{t-1})"
          displayMode={true}
        />
        <p className="mt-2 text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          The joint probability of an entire generated passage decomposes into the product of conditional next-token probabilities.
        </p>
      </div>

      {/* Step Selector Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {LOOP_STAGES.map((st, idx) => (
          <button
            key={st.step}
            onClick={() => {
              setIsAutoCycling(false);
              setCurrentStepIdx(idx);
            }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              currentStepIdx === idx
                ? 'border-[#c2410c] dark:border-[#d97706] bg-amber-500/10 shadow-xs'
                : 'border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#16171b] hover:border-[#cfc6b5]'
            }`}
          >
            <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] mb-1">
              <span>Iteration 0{st.step}</span>
              {currentStepIdx === idx && <span className="w-1.5 h-1.5 rounded-full bg-[#c2410c] dark:bg-[#d97706]" />}
            </div>
            <div className="font-semibold text-xs text-[#1c1917] dark:text-[#f3f4f6] truncate">
              Append "{st.outputToken}"
            </div>
            <div className="text-[10px] font-mono text-[#78716c] dark:text-[#9ca3af] mt-0.5">
              Length: {st.context.length} tokens
            </div>
          </button>
        ))}
      </div>

      {/* Visual Loop Animation & State Card */}
      <div className="p-6 rounded-xl border border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#181a1f] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ece7dc] dark:border-[#26282f] pb-3">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
              Current Loop Iteration
            </span>
            <h5 className="text-lg font-serif font-bold text-[#1c1917] dark:text-[#f3f4f6]">
              {activeStage.title}
            </h5>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#ece7dc] dark:bg-[#282a32] text-[#57534e] dark:text-[#d1d5db]">
            Emitted: "{activeStage.outputToken}"
          </span>
        </div>

        {/* Tokens Growing Sequence */}
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-2">
            Context Vector Fed to Transformer (Length = {activeStage.context.length}):
          </span>
          <div className="flex flex-wrap items-center gap-1.5 p-3.5 bg-white dark:bg-[#121316] rounded-xl border border-[#ece7dc] dark:border-[#26282f] font-serif text-base">
            {activeStage.context.map((w, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-[#1c1917] dark:text-[#f3f4f6]"
              >
                {w}
              </span>
            ))}
            <ArrowRight className="w-4 h-4 text-[#c2410c] dark:text-[#d97706] mx-1" />
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 border border-emerald-500/30 font-bold">
              {activeStage.outputToken}
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#57534e] dark:text-[#d1d5db] leading-relaxed">
          {activeStage.action}
        </p>

        {/* KV Cache & Context Window Explainer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#ece7dc] dark:border-[#26282f] text-xs">
          <div className="p-3 bg-white dark:bg-[#15161a] rounded-lg border border-[#ece7dc] dark:border-[#26282f] space-y-1">
            <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6] flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-sky-600" />
              KV-Caching Acceleration:
            </span>
            <p className="text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
              Without optimization, recomputing past tokens would be quadratic (<LatexRenderer math="\mathcal{O}(T^2)" />). Real LLMs store past Key and Value vectors in memory (KV Cache), calculating only the single newly appended token at each step.
            </p>
          </div>

          <div className="p-3 bg-white dark:bg-[#15161a] rounded-lg border border-[#ece7dc] dark:border-[#26282f] space-y-1">
            <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-amber-600" />
              Context Window Limits:
            </span>
            <p className="text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
              Every language model has a fixed maximum sequence buffer <LatexRenderer math="L_{\max}" /> (e.g. 8k, 32k, or 128k tokens). Once generation exceeds this window, the earliest tokens must be truncated or forgotten.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
