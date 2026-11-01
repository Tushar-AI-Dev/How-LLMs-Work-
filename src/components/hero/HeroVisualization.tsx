import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Cpu, ArrowRight } from 'lucide-react';

const SENTENCE = "The future belongs to those who understand.";

interface TokenUnit {
  text: string;
  id: number;
  color: string;
  vectorPreview: string;
}

const TOKENS_DATA: TokenUnit[] = [
  { text: "The", id: 464, color: "border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200", vectorPreview: "[+0.42, -0.18, ...]" },
  { text: "future", id: 2068, color: "border-sky-300 dark:border-sky-700/60 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200", vectorPreview: "[+0.91, +0.33, ...]" },
  { text: "belongs", id: 8912, color: "border-emerald-300 dark:border-emerald-700/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200", vectorPreview: "[-0.12, +0.76, ...]" },
  { text: "to", id: 284, color: "border-rose-300 dark:border-rose-700/60 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200", vectorPreview: "[+0.05, -0.64, ...]" },
  { text: "those", id: 1634, color: "border-purple-300 dark:border-purple-700/60 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200", vectorPreview: "[+0.67, +0.21, ...]" },
  { text: "who", id: 508, color: "border-indigo-300 dark:border-indigo-700/60 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200", vectorPreview: "[-0.38, +0.55, ...]" },
  { text: "understand", id: 3831, color: "border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200", vectorPreview: "[+0.84, -0.09, ...]" },
  { text: ".", id: 13, color: "border-stone-400 dark:border-stone-600 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-200", vectorPreview: "[-0.01, -0.04, ...]" },
];

const PREDICTED_CANDIDATES = [
  { token: "how", prob: 46.2, rank: 1, selected: true },
  { token: "what", prob: 21.8, rank: 2, selected: false },
  { token: "and", prob: 14.5, rank: 3, selected: false },
  { token: "its", prob: 8.4, rank: 4, selected: false },
  { token: "the", prob: 5.1, rank: 5, selected: false },
];

export const HeroVisualization: React.FC = () => {
  const [stage, setStage] = useState<number>(1); // 1 to 5
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const timerRef = useRef<number | null>(null);

  const stageDescriptions = [
    "Raw natural language string input buffer",
    "Subword segmentation into discrete token primitives",
    "Projection into continuous embedding vectors (d = 4096)",
    "Information routing across attention & feed-forward layers",
    "Softmax probability distribution & next-token prediction",
  ];

  // Auto-play through stages
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setStage((prev) => (prev < 5 ? prev + 1 : 1));
    }, 3800);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const handleReplay = () => {
    setStage(1);
    setIsPlaying(true);
  };

  const handleStep = (targetStage: number) => {
    setStage(targetStage);
    setIsPlaying(false);
  };

  return (
    <div className="w-full bg-white dark:bg-[#121316] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-5 sm:p-8 shadow-xs my-8 transition-colors">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#ece7dc] dark:border-[#22242b]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
              Stage 0{stage} / 05
            </span>
            <span className="text-xs text-[#a8a29e] dark:text-[#52525b]">·</span>
            <span className="text-xs text-[#57534e] dark:text-[#9ca3af] font-mono">
              {stageDescriptions[stage - 1]}
            </span>
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            The Journey of Information Through an LLM
          </h3>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause animation" : "Play animation"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#f2ede4] hover:bg-[#e6dfd2] dark:bg-[#1a1c22] dark:hover:bg-[#252831] text-[#292524] dark:text-[#e5e7eb] transition-colors cursor-pointer border border-[#ded7ca] dark:border-[#2c2f38]"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-[#c2410c] dark:text-[#d97706]" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#c2410c] dark:text-[#d97706]" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            onClick={handleReplay}
            aria-label="Replay animation from start"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#f2ede4] hover:bg-[#e6dfd2] dark:bg-[#1a1c22] dark:hover:bg-[#252831] text-[#292524] dark:text-[#e5e7eb] transition-colors cursor-pointer border border-[#ded7ca] dark:border-[#2c2f38]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>
        </div>
      </div>

      {/* Stage Progress Scrubber */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 my-5">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onClick={() => handleStep(s)}
            className={`
              py-2 px-1 text-center rounded transition-all cursor-pointer border
              ${
                stage === s
                  ? 'border-[#c2410c] dark:border-[#d97706] bg-[#fff7ed] dark:bg-[#21170d] text-[#c2410c] dark:text-[#d97706] font-semibold'
                  : stage > s
                  ? 'border-[#ded7ca] dark:border-[#2a2d36] bg-[#f8f5ee] dark:bg-[#16181d] text-[#78716c] dark:text-[#9ca3af]'
                  : 'border-[#ece7dc] dark:border-[#1e2026] bg-transparent text-[#a8a29e] dark:text-[#52525b]'
              }
            `}
          >
            <div className="text-[10px] font-mono tracking-wider">0{s}</div>
            <div className="text-[11px] font-sans truncate hidden sm:block">
              {s === 1 && "Input Text"}
              {s === 2 && "Tokens"}
              {s === 3 && "Vectors"}
              {s === 4 && "Layers"}
              {s === 5 && "Prediction"}
            </div>
          </button>
        ))}
      </div>

      {/* Main Interactive Stage Canvas */}
      <div className="min-h-[280px] sm:min-h-[320px] bg-[#faf8f5] dark:bg-[#0a0b0d] border border-[#e6e0d4] dark:border-[#22242b] rounded-lg p-5 sm:p-8 flex flex-col justify-center items-center relative overflow-hidden transition-colors">
        
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* STAGE 1: Full Input Sentence */}
        {stage === 1 && (
          <div className="text-center space-y-4 max-w-xl animate-fade-in">
            <span className="text-xs font-mono uppercase tracking-widest text-[#78716c] dark:text-[#9ca3af] block">
              1. Continuous Natural Language Input
            </span>
            <div className="p-4 sm:p-6 bg-white dark:bg-[#141518] border border-[#e2dbce] dark:border-[#282a32] rounded-lg shadow-xs">
              <span className="font-serif text-xl sm:text-2xl md:text-3xl font-medium text-[#1c1917] dark:text-[#f3f4f6] tracking-tight">
                "{SENTENCE}"
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#57534e] dark:text-[#9ca3af]">
              Human prose begins as an arbitrary stream of UTF-8 characters waiting for subword segmentation.
            </p>
          </div>
        )}

        {/* STAGE 2: Token Segmentation */}
        {stage === 2 && (
          <div className="w-full text-center space-y-5 animate-fade-in max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] block font-semibold">
              2. Byte-Pair Encoding: 8 Discrete Subword Tokens
            </span>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 p-4 bg-white dark:bg-[#141518] border border-[#e2dbce] dark:border-[#282a32] rounded-lg">
              {TOKENS_DATA.map((t, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-1.5 rounded-md border text-xs sm:text-sm font-mono font-medium ${t.color} shadow-xs flex items-center gap-1.5`}
                >
                  <span>{t.text}</span>
                  <span className="text-[10px] opacity-60">#{idx + 1}</span>
                </div>
              ))}
            </div>

            <p className="text-xs sm:text-sm text-[#57534e] dark:text-[#9ca3af]">
              The tokenizer splits the string at subword and punctuation boundaries. Notice the period (.) is an independent token.
            </p>
          </div>
        )}

        {/* STAGE 3: Numerical Embeddings */}
        {stage === 3 && (
          <div className="w-full text-center space-y-5 animate-fade-in max-w-4xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] block font-semibold">
              3. Discrete Tokens Mapped to Continuous Dense Vectors
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {TOKENS_DATA.map((t) => (
                <div
                  key={t.id}
                  className="p-3 bg-white dark:bg-[#141518] border border-[#e2dbce] dark:border-[#282a32] rounded-md text-left space-y-1"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">"{t.text}"</span>
                    <span className="text-[#c2410c] dark:text-[#d97706]">ID: {t.id}</span>
                  </div>
                  <div className="text-[11px] font-mono text-[#78716c] dark:text-[#9ca3af] truncate">
                    {t.vectorPreview}
                  </div>
                  <div className="text-[9px] font-mono text-[#a8a29e] dark:text-[#52525b]">
                    ℝ⁴⁰⁹⁶ continuous space
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs sm:text-sm text-[#57534e] dark:text-[#9ca3af]">
              Each token index indexes a row in the embedding table, projecting discrete symbols into 4,096 continuous geometric coordinates.
            </p>
          </div>
        )}

        {/* STAGE 4: Interconnected Layers Flow */}
        {stage === 4 && (
          <div className="w-full text-center space-y-5 animate-fade-in max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] block font-semibold">
              4. Multi-Layer Transformer Backbone Processing
            </span>

            {/* Visual Layers Stack */}
            <div className="space-y-2.5">
              {/* Layer 32 / Top */}
              <div className="p-3 bg-white dark:bg-[#16171c] border border-[#ded7ca] dark:border-[#2e313b] rounded-lg flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">Layer 32: Unembedding & RMSNorm</span>
                </div>
                <span className="text-[#78716c] dark:text-[#9ca3af] hidden sm:inline">Output Logits: ℝ¹²⁸²⁵⁶</span>
              </div>

              {/* Connecting Flow Particles */}
              <div className="flex items-center justify-center gap-4 text-xs font-mono text-[#c2410c] dark:text-[#d97706]">
                <span>↑ Residual Stream Bus</span>
                <span>·</span>
                <span>SwiGLU FFN Memory</span>
              </div>

              {/* Layer N / Middle */}
              <div className="p-3 bg-white dark:bg-[#16171c] border border-[#c2410c]/40 dark:border-[#d97706]/40 rounded-lg flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">Layer 16: Multi-Head Self-Attention</span>
                </div>
                <span className="text-[#c2410c] dark:text-[#d97706]">QKᵀ/√dₖ Causal Routing</span>
              </div>

              {/* Connecting Flow Particles */}
              <div className="flex items-center justify-center gap-4 text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
                <span>↑ RoPE Relative Rotations</span>
                <span>·</span>
                <span>LayerNorm</span>
              </div>

              {/* Layer 1 / Bottom */}
              <div className="p-3 bg-white dark:bg-[#16171c] border border-[#ded7ca] dark:border-[#2e313b] rounded-lg flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">Layer 01: Initial Positional Injection</span>
                </div>
                <span className="text-[#78716c] dark:text-[#9ca3af] hidden sm:inline">X₀ = Embeddings + Pos</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#57534e] dark:text-[#9ca3af]">
              Information travels up the central residual stream. At each block, self-attention allows tokens to exchange context, while feed-forward layers retrieve associative memories.
            </p>
          </div>
        )}

        {/* STAGE 5: Next-Token Prediction */}
        {stage === 5 && (
          <div className="w-full text-center space-y-5 animate-fade-in max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] block font-semibold">
              5. Final Softmax Distribution & Next-Token Sampling
            </span>

            {/* Prediction Display */}
            <div className="p-5 bg-white dark:bg-[#141518] border border-[#e2dbce] dark:border-[#282a32] rounded-lg space-y-4">
              <div className="flex items-center justify-center gap-2 font-serif text-lg sm:text-xl">
                <span className="text-[#78716c] dark:text-[#9ca3af]">"The future belongs to those who understand</span>
                <span className="font-bold text-[#c2410c] dark:text-[#d97706] underline decoration-2 underline-offset-4">
                  how"
                </span>
              </div>

              {/* Logits Probability Bar */}
              <div className="space-y-2 pt-2 text-left">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block">
                  Top Sampled Candidates (Temperature T = 0.7)
                </span>
                {PREDICTED_CANDIDATES.map((cand) => (
                  <div key={cand.token} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className={`font-medium ${cand.selected ? 'text-[#c2410c] dark:text-[#d97706] font-bold' : 'text-[#44403c] dark:text-[#d1d5db]'}`}>
                        "{cand.token}" {cand.selected && "← Sampled"}
                      </span>
                      <span className="tabular-data text-[#78716c] dark:text-[#9ca3af]">{cand.prob}%</span>
                    </div>
                    <div className="w-full bg-[#f0ebe1] dark:bg-[#1f2127] rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          cand.selected ? 'bg-[#c2410c] dark:bg-[#d97706]' : 'bg-[#a8a29e] dark:bg-[#52525b]'
                        }`}
                        style={{ width: `${cand.prob}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#57534e] dark:text-[#9ca3af]">
              The model does not generate whole sentences at once. It outputs an unnormalized vector of logits across all 128,256 vocabulary words, normalizes with Softmax, and samples a single next token before repeating.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Step Indicator Bar */}
      <div className="mt-4 pt-3 border-t border-[#ece7dc] dark:border-[#22242b] flex items-center justify-between text-xs text-[#78716c] dark:text-[#9ca3af]">
        <div className="flex items-center gap-1 font-mono text-[11px]">
          <span>Interactive Flow Schematic</span>
          <span>·</span>
          <span>Sequential Architecture</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStep(Math.max(1, stage - 1))}
            disabled={stage === 1}
            aria-label="Previous stage"
            className="p-1 rounded hover:bg-[#ece7dc] dark:hover:bg-[#1a1c22] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs tabular-data">
            {stage} / 5
          </span>
          <button
            onClick={() => handleStep(Math.min(5, stage + 1))}
            disabled={stage === 5}
            aria-label="Next stage"
            className="p-1 rounded hover:bg-[#ece7dc] dark:hover:bg-[#1a1c22] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
