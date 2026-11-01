import React, { useState, useEffect, useRef } from 'react';
import { LatexRenderer } from '../ui/LatexRenderer';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Sliders,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Cpu,
  Layers,
  Flame,
} from 'lucide-react';
import {
  getToyModelLogits,
  computeNextTokenDistribution,
  FilteringResult,
  TOY_PROMPTS,
} from '../../services/generationService';

interface GeneratedTokenHistory {
  step: number;
  token: string;
  contextTokens: string[];
  diagnostic: FilteringResult;
}

export const GenerationPlayground: React.FC = () => {
  const [selectedPromptId, setSelectedPromptId] = useState<string>('cat');
  const [currentTokens, setCurrentTokens] = useState<string[]>(TOY_PROMPTS[0].tokens);
  const [history, setHistory] = useState<GeneratedTokenHistory[]>([]);
  const [selectedHistoryStep, setSelectedHistoryStep] = useState<number | null>(null);

  // Hyperparameters
  const [strategy, setStrategy] = useState<'greedy' | 'sampling'>('sampling');
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topK, setTopK] = useState<number>(4);
  const [topP, setTopP] = useState<number>(0.9);

  // Auto-generation loop state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset to prompt
  const handleSelectPrompt = (promptId: string) => {
    setIsPlaying(false);
    setSelectedPromptId(promptId);
    const p = TOY_PROMPTS.find((x) => x.id === promptId) || TOY_PROMPTS[0];
    setCurrentTokens([...p.tokens]);
    setHistory([]);
    setSelectedHistoryStep(null);
  };

  const handleResetCurrent = () => {
    setIsPlaying(false);
    const p = TOY_PROMPTS.find((x) => x.id === selectedPromptId) || TOY_PROMPTS[0];
    setCurrentTokens([...p.tokens]);
    setHistory([]);
    setSelectedHistoryStep(null);
  };

  // Generate 1 token step
  const executeStep = () => {
    const lastToken = currentTokens[currentTokens.length - 1];
    if (lastToken === '<EOS>' || currentTokens.length >= 18) {
      setIsPlaying(false);
      return;
    }

    const rawCandidates = getToyModelLogits(currentTokens);
    const diagnostic = computeNextTokenDistribution(rawCandidates, {
      temperature,
      topK,
      topP,
      samplingMethod: strategy,
    });

    const chosenToken = diagnostic.selectedToken.token;

    const newHistoryEntry: GeneratedTokenHistory = {
      step: history.length + 1,
      token: chosenToken,
      contextTokens: [...currentTokens],
      diagnostic,
    };

    setHistory((prev) => [...prev, newHistoryEntry]);
    setCurrentTokens((prev) => [...prev, chosenToken]);
    setSelectedHistoryStep(newHistoryEntry.step);

    if (chosenToken === '<EOS>' || currentTokens.length + 1 >= 18) {
      setIsPlaying(false);
    }
  };

  // Auto-play interval
  useEffect(() => {
    if (isPlaying) {
      autoPlayTimerRef.current = setInterval(() => {
        executeStep();
      }, 700);
    } else {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    }
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPlaying, currentTokens, strategy, temperature, topK, topP, history]);

  const activeInspection = history.find((h) => h.step === selectedHistoryStep) || (history.length > 0 ? history[history.length - 1] : null);

  const isAtStop = currentTokens[currentTokens.length - 1] === '<EOS>' || currentTokens.length >= 18;

  return (
    <div className="bg-white dark:bg-[#131417] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#ece7dc] dark:border-[#22242b] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Simulator</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            Next-Token Generation Playground
          </h4>
        </div>

        {/* Toy Model Disclaimer Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-900 dark:text-amber-200">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Educational Deterministic Toy Model</span>
        </div>
      </div>

      {/* Prompts Preset Bar */}
      <div className="my-6">
        <label className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-2">
          Select Starting Prompt Prefix:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {TOY_PROMPTS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPrompt(p.id)}
              className={`p-2.5 rounded-lg border text-left text-xs font-serif transition-all cursor-pointer ${
                selectedPromptId === p.id
                  ? 'border-[#c2410c] dark:border-[#d97706] bg-amber-500/10 text-[#1c1917] dark:text-[#f3f4f6] font-semibold'
                  : 'border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#1a1c22] text-[#57534e] dark:text-[#9ca3af] hover:border-[#cfc6b5]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hyperparameters Controls Bar */}
      <div className="p-5 rounded-xl border border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#16171b] grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        {/* Strategy Selector */}
        <div>
          <label className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-2">
            Decoding Strategy:
          </label>
          <div className="flex rounded-lg p-1 bg-white dark:bg-[#1f2127] border border-[#ece7dc] dark:border-[#282a32]">
            <button
              onClick={() => setStrategy('greedy')}
              className={`flex-1 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                strategy === 'greedy'
                  ? 'bg-[#1c1917] text-white dark:bg-white dark:text-[#1c1917] font-semibold'
                  : 'text-[#78716c] dark:text-[#9ca3af]'
              }`}
            >
              Greedy
            </button>
            <button
              onClick={() => setStrategy('sampling')}
              className={`flex-1 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                strategy === 'sampling'
                  ? 'bg-[#1c1917] text-white dark:bg-white dark:text-[#1c1917] font-semibold'
                  : 'text-[#78716c] dark:text-[#9ca3af]'
              }`}
            >
              Sampling
            </button>
          </div>
        </div>

        {/* Temperature */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#78716c] dark:text-[#9ca3af]">Temperature (T)</span>
            <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6]">{temperature.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={2.0}
            step={0.05}
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            disabled={strategy === 'greedy'}
            className="w-full accent-[#c2410c] dark:accent-[#d97706] disabled:opacity-40 cursor-pointer"
          />
        </div>

        {/* Top-K */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#78716c] dark:text-[#9ca3af]">Top-K (k)</span>
            <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6]">{topK}</span>
          </div>
          <input
            type="range"
            min={1}
            max={8}
            step={1}
            value={topK}
            onChange={(e) => setTopK(Number(e.target.value))}
            disabled={strategy === 'greedy'}
            className="w-full accent-[#c2410c] dark:accent-[#d97706] disabled:opacity-40 cursor-pointer"
          />
        </div>

        {/* Top-P */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#78716c] dark:text-[#9ca3af]">Top-P (p)</span>
            <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6]">{topP.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.2}
            max={1.0}
            step={0.05}
            value={topP}
            onChange={(e) => setTopP(Number(e.target.value))}
            disabled={strategy === 'greedy'}
            className="w-full accent-[#c2410c] dark:accent-[#d97706] disabled:opacity-40 cursor-pointer"
          />
        </div>
      </div>

      {/* Generation Canvas: Live Tokens */}
      <div className="p-6 rounded-xl border border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#181a1f] space-y-4 mb-6">
        <div className="flex items-center justify-between text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          <span>Generated Sequence ({currentTokens.length} tokens):</span>
          <span>Click any generated token to inspect its probability breakdown</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-serif text-lg sm:text-xl p-4 bg-white dark:bg-[#121316] rounded-xl border border-[#ece7dc] dark:border-[#26282f] min-h-[90px]">
          {/* Initial Prompt Tokens */}
          {currentTokens.map((tok, idx) => {
            const promptTokenCount = TOY_PROMPTS.find((p) => p.id === selectedPromptId)?.tokens.length || 0;
            const isGenerated = idx >= promptTokenCount;
            const stepNumber = isGenerated ? idx - promptTokenCount + 1 : null;
            const isInspected = selectedHistoryStep === stepNumber;

            if (!isGenerated) {
              return (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-[#1c1917] dark:text-[#f3f4f6]"
                >
                  {tok}
                </span>
              );
            }

            return (
              <button
                key={idx}
                onClick={() => setSelectedHistoryStep(stepNumber)}
                className={`px-2.5 py-0.5 rounded transition-all cursor-pointer ${
                  tok === '<EOS>'
                    ? 'bg-red-500/20 text-red-700 dark:text-red-300 font-mono text-xs font-bold border border-red-500/30'
                    : 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 border border-emerald-500/30 font-semibold'
                } ${isInspected ? 'ring-2 ring-[#c2410c] dark:ring-[#d97706] scale-105 shadow-xs' : 'hover:opacity-80'}`}
              >
                {tok}
              </button>
            );
          })}

          {!isAtStop && (
            <span className="inline-block w-2.5 h-6 bg-[#c2410c] dark:bg-[#d97706] animate-pulse ml-1" />
          )}
        </div>

        {/* Generation Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={executeStep}
              disabled={isAtStop}
              className="px-4 py-2 rounded-lg bg-[#c2410c] dark:bg-[#d97706] text-white font-mono text-xs font-semibold hover:bg-[#9c381f] dark:hover:bg-[#b45309] transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
            >
              <SkipForward className="w-4 h-4" />
              <span>Generate 1 Token</span>
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={isAtStop}
              className={`px-4 py-2 rounded-lg border font-mono text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                isPlaying
                  ? 'bg-amber-500/20 text-amber-900 dark:text-amber-200 border-amber-500/40'
                  : 'bg-white dark:bg-[#1f2127] border-[#ece7dc] dark:border-[#282a32] text-[#1c1917] dark:text-[#f3f4f6]'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause Auto-Run' : 'Auto-Generate'}</span>
            </button>
          </div>

          <button
            onClick={handleResetCurrent}
            className="px-3.5 py-2 rounded-lg border border-[#ece7dc] dark:border-[#282a32] bg-white dark:bg-[#1f2127] text-xs font-mono text-[#78716c] dark:text-[#9ca3af] hover:text-[#1c1917] dark:hover:text-[#f3f4f6] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Generated Tokens</span>
          </button>
        </div>
      </div>

      {/* Deep-Dive Step Trace Inspector */}
      {activeInspection && (
        <div className="p-6 rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-amber-500/20 gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-bold">
                Step 0{activeInspection.step} Diagnostic Logit & Probability Trace
              </span>
              <h5 className="text-lg font-serif font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
                Chosen Token: <span className="text-[#c2410c] dark:text-[#d97706]">"{activeInspection.token}"</span>
              </h5>
            </div>
            <div className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
              Method: {activeInspection.diagnostic.samplingMethod.toUpperCase()} | T={activeInspection.diagnostic.temperature} | Top-K={activeInspection.diagnostic.topK} | Top-P={activeInspection.diagnostic.topP}
            </div>
          </div>

          {/* Candidate Table for this step */}
          <div className="overflow-x-auto rounded-lg border border-[#ece7dc] dark:border-[#26282f] bg-white dark:bg-[#15161a]">
            <table className="w-full text-xs font-mono text-left">
              <thead className="bg-[#faf8f5] dark:bg-[#1f2127] border-b border-[#ece7dc] dark:border-[#282a32] text-[#78716c] dark:text-[#9ca3af]">
                <tr>
                  <th className="p-2.5">Candidate</th>
                  <th className="p-2.5 text-center">Raw Logit</th>
                  <th className="p-2.5 text-center">Scaled (z/T)</th>
                  <th className="p-2.5 text-center">Softmax Prob</th>
                  <th className="p-2.5 text-center">Filter Mask</th>
                  <th className="p-2.5 text-right">Renormalized Prob</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ece7dc] dark:divide-[#26282f]">
                {activeInspection.diagnostic.allCandidates.map((c) => {
                  const isSelected = c.token === activeInspection.token;
                  const isRetained = activeInspection.diagnostic.retained.some((r) => r.token === c.token);
                  const renormItem = activeInspection.diagnostic.retained.find((r) => r.token === c.token);

                  return (
                    <tr
                      key={c.token}
                      className={isSelected ? 'bg-amber-500/20 font-bold' : isRetained ? 'bg-emerald-500/5' : 'opacity-40'}
                    >
                      <td className="p-2.5 font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
                        "{c.token}" {isSelected && <span className="text-[10px] text-[#c2410c] dark:text-[#d97706] ml-1">(SELECTED)</span>}
                      </td>
                      <td className="p-2.5 text-center">{c.logit.toFixed(1)}</td>
                      <td className="p-2.5 text-center text-[#78716c] dark:text-[#9ca3af]">
                        {c.scaledLogit?.toFixed(2)}
                      </td>
                      <td className="p-2.5 text-center">{(c.prob * 100).toFixed(1)}%</td>
                      <td className="p-2.5 text-center">
                        {isRetained ? (
                          <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-[10px]">KEPT</span>
                        ) : (
                          <span className="text-stone-400 text-[10px]">PRUNED</span>
                        )}
                      </td>
                      <td className="p-2.5 text-right font-bold text-emerald-700 dark:text-emerald-300">
                        {renormItem?.filteredProb ? `${(renormItem.filteredProb * 100).toFixed(1)}%` : '0.0%'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
