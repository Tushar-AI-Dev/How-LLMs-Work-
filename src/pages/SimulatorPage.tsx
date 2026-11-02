import React, { useState, useEffect } from 'react';
import { Container } from '../components/layout/Container';
import { runCompleteSimulation, SimulatorForwardPass } from '../services/simulatorEngine';
import { SimulatorControlBar } from '../components/simulator/SimulatorControlBar';
import { ScientificInspector } from '../components/simulator/ScientificInspector';
import { Stage1Tokenization } from '../components/simulator/Stage1Tokenization';
import { Stage2Embeddings } from '../components/simulator/Stage2Embeddings';
import { Stage3Positional } from '../components/simulator/Stage3Positional';
import { Stage4Attention } from '../components/simulator/Stage4Attention';
import { Stage5TransformerBlock } from '../components/simulator/Stage5TransformerBlock';
import { Stage6Prediction } from '../components/simulator/Stage6Prediction';
import { Stage7Generation } from '../components/simulator/Stage7Generation';
import { Info, Play } from 'lucide-react';

export const SIMULATOR_PRESET_PROMPTS = [
  { id: 'cat', label: 'The cat sat on the', text: 'The cat sat on the' },
  { id: 'parallel', label: 'Transformers process tokens in parallel', text: 'Transformers process tokens in parallel' },
  { id: 'generation', label: 'Language models generate text one', text: 'Language models generate text one' },
  { id: 'coreference', label: 'The animal crossed the street because', text: 'The animal crossed the street because' },
];

export const SimulatorPage: React.FC = () => {
  // Input State
  const [inputText, setInputText] = useState<string>('The cat sat on the');
  const [committedText, setCommittedText] = useState<string>('The cat sat on the');

  // Simulation Stages & Controls State
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [trackedTokenIdx, setTrackedTokenIdx] = useState<number>(1); // Default to "cat" or 2nd token

  // Generation Hyperparameters State
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topK, setTopK] = useState<number>(5);
  const [topP, setTopP] = useState<number>(0.9);
  const [samplingMethod, setSamplingMethod] = useState<'greedy' | 'sampling'>('sampling');
  const [generationHistory, setGenerationHistory] = useState<string[]>([]);

  // Compute live forward pass simulation for Stages 01–07
  const [sim, setSim] = useState<SimulatorForwardPass>(() =>
    runCompleteSimulation(committedText, {
      temperature,
      topK,
      topP,
      samplingMethod,
    })
  );

  // Re-run simulation when committedText or generation hyperparameters change
  useEffect(() => {
    const newSim = runCompleteSimulation(committedText, {
      temperature,
      topK,
      topP,
      samplingMethod,
    });
    setSim(newSim);

    // Keep tracked token index in bounds
    if (trackedTokenIdx >= newSim.seqLen) {
      setTrackedTokenIdx(Math.max(0, newSim.seqLen - 1));
    }
  }, [committedText, temperature, topK, topP, samplingMethod]);

  // Auto-Play Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStage((prev) => {
          if (prev >= 7) {
            setIsPlaying(false);
            return 7;
          }
          return prev + 1;
        });
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Start Simulation button click
  const handleStartSimulation = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    setCommittedText(trimmed);
    setGenerationHistory([]);
    setCurrentStage(1);
    setIsPlaying(false);
  };

  // Reset to default
  const handleReset = () => {
    const defaultText = SIMULATOR_PRESET_PROMPTS[0].text;
    setInputText(defaultText);
    setCommittedText(defaultText);
    setGenerationHistory([]);
    setCurrentStage(1);
    setIsPlaying(false);
    setTrackedTokenIdx(1);
  };

  // Replay from Stage 1
  const handleReplay = () => {
    setCurrentStage(1);
    setIsPlaying(false);
  };

  // Educational Stepper
  const handleStepToken = () => {
    setGenerationHistory((prev) => [...prev, committedText]);
    const updated = sim.stage7.updatedText;
    setCommittedText(updated);
    setInputText(updated);
  };

  const handleGenerateMultiple = (count: number) => {
    let currentText = committedText;
    const historyBackup = [...generationHistory, committedText];

    for (let c = 0; c < count; c++) {
      const stepSim = runCompleteSimulation(currentText, {
        temperature,
        topK,
        topP,
        samplingMethod,
      });
      const nextTok = stepSim.stage7.selectedToken;
      currentText = stepSim.stage7.updatedText;
      if (nextTok === '<EOS>') break;
    }

    setGenerationHistory(historyBackup);
    setCommittedText(currentText);
    setInputText(currentText);
  };

  const handleUndo = () => {
    if (generationHistory.length > 0) {
      const previousText = generationHistory[generationHistory.length - 1];
      setGenerationHistory((prev) => prev.slice(0, -1));
      setCommittedText(previousText);
      setInputText(previousText);
    }
  };

  return (
    <div className="py-10 sm:py-16 space-y-10 sm:space-y-14">
      <Container>
        {/* Monograph Header */}
        <div className="max-w-4xl pb-6 border-b border-[#e6e0d4] dark:border-[#26282f] space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="font-semibold uppercase tracking-widest text-[#c2410c] dark:text-[#d97706]">
              End-to-End Scientific Laboratory
            </span>
            <span className="text-[#a8a29e] dark:text-[#52525b]">·</span>
            <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 font-semibold text-[11px]">
              Deterministic 8D Educational Transformer (d_model = 8, d_ff = 16)
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] tracking-tight">
            The LLM Simulator
          </h1>

          <p className="text-base sm:text-lg text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            Follow a sentence through every mechanical transformation inside a decoder-only Transformer: from raw characters to integer tokens, continuous embedding spaces, sinusoidal positional encodings, causal attention routing, residual highways, and probabilistic next-token generation.
          </p>

          <div className="pt-1 flex items-center gap-2 text-xs text-[#78716c] dark:text-[#9ca3af]">
            <Info className="w-4 h-4 text-[#c2410c] dark:text-[#d97706] shrink-0" />
            <span>
              Educational Demonstration Notice: This simulator executes real GPT-2 R50K BPE tokenization and exact Transformer linear algebra using deterministic, untrained 8-dimensional educational weights so every matrix operation can be verified by hand.
            </span>
          </div>
        </div>

        {/* Input Workspace Panel */}
        <div className="my-8 bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#ece7dc] dark:border-[#22242b]">
            <span className="text-xs font-mono uppercase tracking-wider text-[#1c1917] dark:text-[#f3f4f6] font-semibold">
              Input Sequence Workspace:
            </span>
            <span className="text-xs text-[#78716c] dark:text-[#9ca3af]">
              Enter any prompt or select a curated educational seed below
            </span>
          </div>

          <div className="space-y-3">
            <textarea
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter a sentence to pass through the Transformer pipeline..."
              className="w-full px-4 py-3 text-sm sm:text-base font-sans bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#ded7ca] dark:border-[#282a32] rounded-lg text-[#1c1917] dark:text-[#f3f4f6] focus:outline-none focus:border-[#c2410c] dark:focus:border-[#d97706] resize-none"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Presets */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                <span className="text-[11px] text-[#78716c] dark:text-[#9ca3af] mr-1">Seeds:</span>
                {SIMULATOR_PRESET_PROMPTS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setInputText(preset.text);
                      setCommittedText(preset.text);
                      setGenerationHistory([]);
                      setCurrentStage(1);
                      setIsPlaying(false);
                    }}
                    className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer border ${
                      committedText === preset.text
                        ? 'bg-[#1c1917] text-white dark:bg-[#f3f4f6] dark:text-[#111215] border-transparent font-medium'
                        : 'bg-[#faf8f5] dark:bg-[#1a1c22] text-[#57534e] dark:text-[#9ca3af] border-[#ded7ca] dark:border-[#282a32] hover:text-[#1c1917] dark:hover:text-[#f3f4f6]'
                    }`}
                  >
                    "{preset.label}"
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 text-xs font-mono rounded bg-[#f4efe6] dark:bg-[#1a1c22] text-[#57534e] dark:text-[#9ca3af] hover:text-[#1c1917] dark:hover:text-[#f3f4f6] transition-colors cursor-pointer"
                >
                  Reset
                </button>

                <button
                  onClick={handleStartSimulation}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-[#c2410c] hover:bg-[#9a3412] dark:bg-[#d97706] dark:hover:bg-[#b45309] text-white rounded-md text-xs font-mono font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Start Simulation</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Persistent Simulation Control Bar */}
        <div className="my-6 sticky top-18 z-30">
          <SimulatorControlBar
            currentStage={currentStage}
            onStageChange={(stg) => {
              setCurrentStage(stg);
              setIsPlaying(false);
            }}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onReset={handleReset}
            onReplay={handleReplay}
            trackedTokenIdx={trackedTokenIdx}
            onTrackedTokenChange={setTrackedTokenIdx}
            totalTokens={sim.seqLen}
            tokensList={sim.tokens.map((t) => ({ text: t.text, id: t.id }))}
          />
        </div>

        {/* Collapsible Scientific Inspector Panel */}
        <div className="my-6">
          <ScientificInspector
            currentStage={currentStage}
            sim={sim}
            trackedTokenIdx={trackedTokenIdx}
          />
        </div>

        {/* Active Stage Interactive Canvas */}
        <div className="my-8">
          {currentStage === 1 && (
            <Stage1Tokenization
              sim={sim}
              trackedTokenIdx={trackedTokenIdx}
              onSelectToken={setTrackedTokenIdx}
            />
          )}

          {currentStage === 2 && (
            <Stage2Embeddings
              sim={sim}
              trackedTokenIdx={trackedTokenIdx}
              onSelectToken={setTrackedTokenIdx}
            />
          )}

          {currentStage === 3 && (
            <Stage3Positional
              sim={sim}
              trackedTokenIdx={trackedTokenIdx}
              onSelectToken={setTrackedTokenIdx}
            />
          )}

          {currentStage === 4 && (
            <Stage4Attention
              sim={sim}
              trackedTokenIdx={trackedTokenIdx}
              onSelectToken={setTrackedTokenIdx}
            />
          )}

          {currentStage === 5 && (
            <Stage5TransformerBlock
              sim={sim}
              trackedTokenIdx={trackedTokenIdx}
              onSelectToken={setTrackedTokenIdx}
            />
          )}

          {currentStage === 6 && (
            <Stage6Prediction
              sim={sim}
              onAdvanceToGeneration={() => setCurrentStage(7)}
            />
          )}

          {currentStage === 7 && (
            <Stage7Generation
              sim={sim}
              onStepToken={handleStepToken}
              onGenerateMultiple={handleGenerateMultiple}
              onUndo={handleUndo}
              canUndo={generationHistory.length > 0}
              temperature={temperature}
              onTemperatureChange={setTemperature}
              topK={topK}
              onTopKChange={setTopK}
              topP={topP}
              onTopPChange={setTopP}
              samplingMethod={samplingMethod}
              onSamplingMethodChange={setSamplingMethod}
            />
          )}
        </div>
      </Container>
    </div>
  );
};
