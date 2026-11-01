import React from 'react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Layers,
  CheckCircle2,
  Crosshair,
} from 'lucide-react';

export const STAGES = [
  { id: 1, title: 'Tokenization', short: '1. Tokens', desc: 'Text to discrete integer IDs' },
  { id: 2, title: 'Embeddings', short: '2. Embeddings', desc: 'IDs to 8D continuous vectors' },
  { id: 3, title: 'Positional', short: '3. Positional', desc: 'Sinusoidal order injection' },
  { id: 4, title: 'Self-Attention', short: '4. Attention', desc: 'Causal Q-K-V dynamic routing' },
  { id: 5, title: 'Transformer', short: '5. Transformer', desc: 'Pre-Norm, FFN & residual bus' },
  { id: 6, title: 'Prediction', short: '6. Logits', desc: 'Unembedding & Softmax' },
  { id: 7, title: 'Generation', short: '7. Generate', desc: 'Next-token sampling loop' },
];

interface SimulatorControlBarProps {
  currentStage: number;
  onStageChange: (stage: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onReplay: () => void;
  trackedTokenIdx: number;
  onTrackedTokenChange: (idx: number) => void;
  totalTokens: number;
  tokensList: { text: string; id: number }[];
}

export const SimulatorControlBar: React.FC<SimulatorControlBarProps> = ({
  currentStage,
  onStageChange,
  isPlaying,
  onTogglePlay,
  onReset,
  onReplay,
  trackedTokenIdx,
  onTrackedTokenChange,
  totalTokens,
  tokensList,
}) => {
  const currentStageInfo = STAGES.find((s) => s.id === currentStage) || STAGES[0];

  return (
    <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Top row: Stage Stepper Progress Tabs */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-center min-w-[620px] gap-1.5" role="tablist">
          {STAGES.map((stage) => {
            const isActive = currentStage === stage.id;
            const isCompleted = currentStage > stage.id;

            return (
              <button
                key={stage.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => onStageChange(stage.id)}
                className={`
                  flex-1 py-2 px-2.5 rounded-lg text-left transition-all cursor-pointer border
                  ${
                    isActive
                      ? 'bg-[#1c1917] text-white dark:bg-[#f3f4f6] dark:text-[#111215] border-transparent font-semibold shadow-xs'
                      : isCompleted
                      ? 'bg-[#faf8f5] dark:bg-[#1a1c22] text-[#1c1917] dark:text-[#f3f4f6] border-[#ded7ca] dark:border-[#282a32] hover:border-[#c2410c]'
                      : 'bg-[#faf8f5]/60 dark:bg-[#121316]/60 text-[#78716c] dark:text-[#9ca3af] border-transparent hover:border-[#ded7ca]'
                  }
                `}
              >
                <div className="flex items-center justify-between text-[11px] font-mono mb-0.5">
                  <span
                    className={`font-bold ${
                      isActive ? 'text-[#c2410c] dark:text-[#d97706]' : ''
                    }`}
                  >
                    0{stage.id}
                  </span>
                  {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
                </div>
                <div className="text-xs font-sans font-medium truncate">{stage.title}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom controls row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#ece7dc] dark:border-[#22242b]">
        {/* Left: Playback controls */}
        <div className="flex items-center gap-2">
          {/* Previous Stage */}
          <button
            onClick={() => onStageChange(Math.max(1, currentStage - 1))}
            disabled={currentStage <= 1}
            aria-label="Previous Stage"
            className="p-2 rounded-lg bg-[#faf8f5] dark:bg-[#1a1c22] border border-[#ded7ca] dark:border-[#282a32] text-[#1c1917] dark:text-[#f3f4f6] hover:bg-[#ece7dc] dark:hover:bg-[#282a32] disabled:opacity-40 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Play/Pause Auto-Play */}
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                : 'bg-[#c2410c] hover:bg-[#9a3412] dark:bg-[#d97706] dark:hover:bg-[#b45309] text-white shadow-xs'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Auto-Play</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Auto-Play Journey</span>
              </>
            )}
          </button>

          {/* Next Stage */}
          <button
            onClick={() => onStageChange(Math.min(7, currentStage + 1))}
            disabled={currentStage >= 7}
            aria-label="Next Stage"
            className="p-2 rounded-lg bg-[#faf8f5] dark:bg-[#1a1c22] border border-[#ded7ca] dark:border-[#282a32] text-[#1c1917] dark:text-[#f3f4f6] hover:bg-[#ece7dc] dark:hover:bg-[#282a32] disabled:opacity-40 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Replay */}
          <button
            onClick={onReplay}
            className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-mono text-[#57534e] dark:text-[#9ca3af] hover:text-[#1c1917] dark:hover:text-[#f3f4f6] transition-colors cursor-pointer"
            title="Replay from Stage 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Replay</span>
          </button>
        </div>

        {/* Right: "Track This Token" Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
            <Crosshair className="w-3.5 h-3.5 text-[#c2410c] dark:text-[#d97706]" />
            <span className="hidden sm:inline font-semibold">Track Token:</span>
          </div>

          <select
            value={trackedTokenIdx}
            onChange={(e) => onTrackedTokenChange(Number(e.target.value))}
            className="px-2.5 py-1.5 text-xs font-mono bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#ded7ca] dark:border-[#282a32] rounded-lg text-[#1c1917] dark:text-[#f3f4f6] cursor-pointer"
          >
            {tokensList.map((t, idx) => (
              <option key={idx} value={idx}>
                Token [{idx}]: "{t.text}" (ID {t.id})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
