import React from 'react';
import { SimulatorForwardPass } from '../../services/simulatorEngine';
import { Sparkles, Play, FastForward, Undo, Sliders, CheckCircle2 } from 'lucide-react';

interface Stage7GenerationProps {
  sim: SimulatorForwardPass;
  onStepToken: () => void;
  onGenerateMultiple: (count: number) => void;
  onUndo: () => void;
  canUndo: boolean;
  temperature: number;
  onTemperatureChange: (t: number) => void;
  topK: number;
  onTopKChange: (k: number) => void;
  topP: number;
  onTopPChange: (p: number) => void;
  samplingMethod: 'greedy' | 'sampling';
  onSamplingMethodChange: (m: 'greedy' | 'sampling') => void;
}

export const Stage7Generation: React.FC<Stage7GenerationProps> = ({
  sim,
  onStepToken,
  onGenerateMultiple,
  onUndo,
  canUndo,
  temperature,
  onTemperatureChange,
  topK,
  onTopKChange,
  topP,
  onTopPChange,
  samplingMethod,
  onSamplingMethodChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#ece7dc] dark:border-[#26282f]">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            Stage 07 of 07
          </span>
          <h3 className="text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
            Autoregressive Generation: Sample & Append
          </h3>
        </div>
        <div className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af] flex items-center gap-2">
          <span>
            Next Token Selected: <strong className="text-[#c2410c] dark:text-[#d97706]">"{sim.stage7.selectedToken}"</strong>
          </span>
          <span className="px-1.5 py-0.5 rounded bg-[#f4efe6] dark:bg-[#1f2127] border border-[#ded7ca] dark:border-[#282a32] font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
            ID #{sim.stage7.selectedTokenId}
          </span>
          {sim.stage7.isEOS && (
            <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 font-bold">
              EOS Terminal
            </span>
          )}
        </div>
      </div>

      {/* Generated Token Showcase & Sequence Canvas */}
      <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#ece7dc] dark:border-[#22242b]">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] font-semibold">
              Live Accumulated Text Buffer:
            </span>
            <p className="text-xs text-[#57534e] dark:text-[#9ca3af] mt-0.5">
              Each new token is appended and fed back into Stage 01 for the subsequent token prediction.
            </p>
          </div>

          {/* Stepper Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onStepToken}
              disabled={sim.stage7.isEOS}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#c2410c] hover:bg-[#9a3412] dark:bg-[#d97706] dark:hover:bg-[#b45309] disabled:opacity-40 text-white rounded-md text-xs font-mono font-medium transition-colors cursor-pointer shadow-xs"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{sim.stage7.isEOS ? 'EOS Reached' : 'Step 1 Token'}</span>
            </button>

            <button
              onClick={() => onGenerateMultiple(3)}
              disabled={sim.stage7.isEOS}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1c1917] hover:bg-black dark:bg-[#f3f4f6] dark:hover:bg-white disabled:opacity-40 text-white dark:text-[#111215] rounded-md text-xs font-mono font-medium transition-colors cursor-pointer"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>Generate 3</span>
            </button>

            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-1.5 bg-[#f4efe6] dark:bg-[#1a1c22] rounded text-[#57534e] dark:text-[#9ca3af] hover:text-[#1c1917] dark:hover:text-[#f3f4f6] disabled:opacity-40 transition-colors cursor-pointer"
              title="Undo last generated token"
            >
              <Undo className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Sequence Pill Cloud */}
        <div className="p-5 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#ded7ca] dark:border-[#282a32] rounded-lg min-h-[80px] flex flex-wrap items-center gap-2 text-sm sm:text-base font-sans">
          {sim.tokens.map((tok, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-md bg-white dark:bg-[#181a20] border border-[#ded7ca] dark:border-[#282a32] font-mono text-xs sm:text-sm text-[#1c1917] dark:text-[#f3f4f6]"
            >
              {tok.text}
            </span>
          ))}

          {/* Newly Sampled Candidate Token Highlighted */}
          <span className="px-3 py-1 rounded-md bg-[#c2410c] dark:bg-[#d97706] text-white font-mono text-xs sm:text-sm font-bold shadow-xs animate-pulse flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ "{sim.stage7.selectedToken}" (ID #{sim.stage7.selectedTokenId})</span>
          </span>
          {!sim.stage7.isEOS && (
            <span className="text-xs font-mono text-[#c2410c] dark:text-[#d97706] animate-pulse">
              ▋
            </span>
          )}
        </div>
      </div>

      {/* Sampling Controls Bar */}
      <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#ece7dc] dark:border-[#22242b]">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#c2410c] dark:text-[#d97706]" />
            <h4 className="font-serif text-base font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              Sampling Parameters & Decoding Strategy
            </h4>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#f4efe6] dark:bg-[#1a1c22] rounded-lg border border-[#e6e0d4] dark:border-[#26282f] text-xs font-mono">
            <button
              onClick={() => onSamplingMethodChange('sampling')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                samplingMethod === 'sampling'
                  ? 'bg-white dark:bg-[#111215] text-[#1c1917] dark:text-[#f3f4f6] font-semibold shadow-xs'
                  : 'text-[#57534e] dark:text-[#9ca3af]'
              }`}
            >
              Stochastic Sampling
            </button>
            <button
              onClick={() => onSamplingMethodChange('greedy')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                samplingMethod === 'greedy'
                  ? 'bg-white dark:bg-[#111215] text-[#1c1917] dark:text-[#f3f4f6] font-semibold shadow-xs'
                  : 'text-[#57534e] dark:text-[#9ca3af]'
              }`}
            >
              Greedy (ArgMax)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-mono">
          {/* Temperature Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[#57534e] dark:text-[#9ca3af]">Temperature (T):</span>
              <span className="font-bold text-[#c2410c] dark:text-[#d97706] tabular-data">
                T = {temperature.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.8"
              step="0.05"
              value={temperature}
              onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
              className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#78716c]">
              <span>0.1 (Focused)</span>
              <span>0.7 (Balanced)</span>
              <span>1.8 (Creative)</span>
            </div>
          </div>

          {/* Top-K Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[#57534e] dark:text-[#9ca3af]">Top-K Cutoff:</span>
              <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6] tabular-data">
                K = {topK}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={topK}
              onChange={(e) => onTopKChange(parseInt(e.target.value))}
              className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#78716c]">
              <span>K = 1</span>
              <span>K = 5</span>
              <span>K = 10</span>
            </div>
          </div>

          {/* Top-P Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[#57534e] dark:text-[#9ca3af]">Top-P (Nucleus):</span>
              <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6] tabular-data">
                P = {topP.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={topP}
              onChange={(e) => onTopPChange(parseFloat(e.target.value))}
              className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#78716c]">
              <span>P = 0.2</span>
              <span>P = 0.9</span>
              <span>P = 1.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
