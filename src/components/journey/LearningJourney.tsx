import React from 'react';
import { LatexRenderer } from '../ui/LatexRenderer';
import { ArrowRight, Clock, BookOpen, Layers } from 'lucide-react';
import { Chapter } from '../../types';

interface LearningJourneyProps {
  onSelectChapter?: (chapterNumber: string) => void;
}

export const LearningJourney: React.FC<LearningJourneyProps> = ({ onSelectChapter }) => {
  const chapters = [
    {
      number: '01',
      title: 'From Text to Tokens',
      tagline: 'How raw text becomes numerical token IDs.',
      description:
        'Continuous human language must be decomposed into discrete vocabulary units before calculation. We deconstruct how Byte-Pair Encoding merges high-frequency subword pairs and maps Unicode bytes to token integers.',
      readingTime: '12 min read',
      math: 'V_{new} = V \\cup \\{ (t_i, t_j) \\mid \\arg\\max \\text{freq}(t_i, t_j) \\}',
      illustrationType: 'tokens',
    },
    {
      number: '02',
      title: 'Understanding Embeddings',
      tagline: 'How tokens become vectors that carry learned information.',
      description:
        'A token ID is merely an arbitrary integer. Each index indexes a 4,096-dimensional row in a learned embedding matrix, projecting words into continuous geometric manifolds where geometric distance mirrors conceptual affinity.',
      readingTime: '15 min read',
      math: '\\cos(\\mathbf{u}, \\mathbf{v}) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\| \\|\\mathbf{v}\\|}',
      illustrationType: 'embeddings',
    },
    {
      number: '03',
      title: 'Positional Encoding',
      tagline: 'How a model receives information about token order.',
      description:
        'Self-attention calculates token pairs without intrinsic spatial awareness. Discover how sinusoidal frequencies and Rotary Position Embeddings (RoPE) rotate query vectors in 2D sub-planes to encode sequence distances.',
      readingTime: '14 min read',
      math: '\\mathbf{R}_{\\Theta, m}^d = \\text{diag}(R_{\\theta_1, m}, \\dots, R_{\\theta_{d/2}, m})',
      illustrationType: 'positional',
    },
    {
      number: '04',
      title: 'The Attention Mechanism',
      tagline: 'How tokens exchange contextual information.',
      description:
        'The mathematical heartbeat of transformer models. Every token broadcasts Query, Key, and Value vectors, computing scaled dot-product attention scores to dynamically route information across sequence context.',
      readingTime: '20 min read',
      math: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{QK^T}{\\sqrt{d_k}} + M \\right) V',
      illustrationType: 'attention',
    },
    {
      number: '05',
      title: 'Inside a Transformer',
      tagline: 'Explore attention, residual connections, normalization and feed-forward networks.',
      description:
        'The complete structural anatomy: multi-head projections, RMSNorm layers, SwiGLU feed-forward networks acting as key-value memory banks, and the uninterrupted residual communication stream.',
      readingTime: '22 min read',
      math: '\\mathbf{x}_{l+1} = \\mathbf{x}_l + \\text{MHA}(\\text{RMSNorm}(\\mathbf{x}_l)) + \\text{FFN}(\\text{RMSNorm}(\\mathbf{x}_l^{\\prime}))',
      illustrationType: 'transformer',
    },
    {
      number: '06',
      title: 'How LLMs Generate Text',
      tagline: 'Discover logits, probabilities, sampling and autoregressive generation.',
      description:
        'The final inference step: projecting high-dimensional hidden states back into vocabulary logits, calibrating entropy via temperature, filtering candidate tails through nucleus sampling, and looping autoregressively.',
      readingTime: '16 min read',
      math: 'P(w_i \\mid w_{<i}) = \\frac{\\exp(z_i / T)}{\\sum_j \\exp(z_j / T)}',
      illustrationType: 'generation',
    },
  ];

  return (
    <section id="learning-journey" className="my-20 sm:my-28 scroll-mt-20">
      {/* Section Header */}
      <div className="mb-12 sm:mb-16 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] mb-2 font-semibold">
          <span>The Learning Journey</span>
          <span>·</span>
          <span>Sequential Syllabus</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] tracking-tight">
          From a sentence to intelligence.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          Follow the journey of information as it passes through the components of a language model.
        </p>
      </div>

      {/* Visually Varied Chapter Entries */}
      <div className="space-y-12 sm:space-y-16">
        {chapters.map((ch, idx) => {
          const isEven = idx % 2 === 1;

          return (
            <article
              key={ch.number}
              className="bg-white dark:bg-[#131417] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 sm:p-8 lg:p-10 transition-all hover:border-[#cfc6b5] dark:hover:border-[#3a3e49]"
            >
              <div
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                  isEven ? 'lg:grid-flow-dense' : ''
                }`}
              >
                {/* Text Content Column */}
                <div className={`lg:col-span-7 space-y-4 ${isEven ? 'lg:col-start-6' : ''}`}>
                  {/* Metadata Kicker */}
                  <div className="flex items-center gap-3 text-xs text-[#78716c] dark:text-[#9ca3af]">
                    <span className="font-mono text-sm font-bold text-[#c2410c] dark:text-[#d97706]">
                      {ch.number}
                    </span>
                    <span aria-hidden="true" className="text-[#a8a29e] dark:text-[#52525b]">/</span>
                    <span className="font-mono uppercase tracking-wider">CHAPTER</span>
                    <span aria-hidden="true" className="text-[#a8a29e] dark:text-[#52525b]">·</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#a8a29e] dark:text-[#6b7280]" />
                      <span>{ch.readingTime}</span>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-2xl sm:text-3xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
                    {ch.title}
                  </h3>
                  <p className="text-sm sm:text-base font-medium text-[#c2410c] dark:text-[#d97706]">
                    {ch.tagline}
                  </p>

                  {/* Prose Description */}
                  <p className="text-sm sm:text-base text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
                    {ch.description}
                  </p>

                  {/* LaTeX Equation Preview */}
                  <div className="pt-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-1.5">
                      Governing Formulation:
                    </span>
                    <div className="p-3 bg-[#faf8f5] dark:bg-[#1a1c22] rounded-lg border border-[#ece7dc] dark:border-[#26282f] text-xs sm:text-sm text-[#1c1917] dark:text-[#f3f4f6] overflow-x-auto">
                      <LatexRenderer math={ch.math} displayMode={true} />
                    </div>
                  </div>

                  {/* Explore Link */}
                  <div className="pt-4">
                    <button
                      onClick={() => onSelectChapter?.(ch.number)}
                      className="inline-flex items-center gap-2 text-sm font-medium text-[#1c1917] dark:text-[#f3f4f6] hover:text-[#c2410c] dark:hover:text-[#d97706] transition-colors group cursor-pointer"
                    >
                      <span className="underline underline-offset-4 decoration-1 decoration-[#a8a29e] dark:decoration-[#52525b] group-hover:decoration-[#c2410c] dark:group-hover:decoration-[#d97706]">
                        Explore chapter
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Distinctive Visual Illustration Column */}
                <div
                  className={`lg:col-span-5 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-lg p-5 flex flex-col justify-center items-center min-h-[260px] ${
                    isEven ? 'lg:col-start-1' : ''
                  }`}
                >
                  {/* Custom Illustration per Chapter */}
                  {ch.illustrationType === 'tokens' && (
                    <div className="w-full space-y-3 font-mono text-xs">
                      <div className="text-[10px] uppercase text-[#78716c] dark:text-[#9ca3af] border-b border-[#ece7dc] dark:border-[#26282f] pb-1">
                        BPE Subword Decomposition Tree
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white dark:bg-[#15161b] rounded border border-[#ded7ca] dark:border-[#282a32]">
                        <span className="text-[#1c1917] dark:text-[#f3f4f6]">"unforgettable"</span>
                        <span className="text-[#c2410c] dark:text-[#d97706]">Raw Word</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 text-center">
                        <div className="p-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded">
                          <div className="font-semibold text-amber-950 dark:text-amber-200">"un"</div>
                          <div className="text-[9px] text-[#78716c]">ID: 2841</div>
                        </div>
                        <div className="p-2 bg-sky-50 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-800 rounded">
                          <div className="font-semibold text-sky-950 dark:text-sky-200">"forget"</div>
                          <div className="text-[9px] text-[#78716c]">ID: 19402</div>
                        </div>
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded">
                          <div className="font-semibold text-emerald-950 dark:text-emerald-200">"table"</div>
                          <div className="text-[9px] text-[#78716c]">ID: 1102</div>
                        </div>
                      </div>
                      <div className="text-[11px] text-[#78716c] dark:text-[#9ca3af] text-center pt-1">
                        3 Subwords · Fixed Vocabulary 128k
                      </div>
                    </div>
                  )}

                  {ch.illustrationType === 'embeddings' && (
                    <div className="w-full space-y-3 text-xs font-mono">
                      <div className="text-[10px] uppercase text-[#78716c] dark:text-[#9ca3af] border-b border-[#ece7dc] dark:border-[#26282f] pb-1">
                        High-Dimensional Geometric Projections
                      </div>
                      {/* Stylized Vector Geometry Diagram */}
                      <svg className="w-full h-32 text-[#78716c]" viewBox="0 0 240 120">
                        {/* Axes */}
                        <line x1="30" y1="100" x2="220" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
                        <line x1="30" y1="100" x2="30" y2="20" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
                        
                        {/* Vectors */}
                        <line x1="30" y1="100" x2="150" y2="40" stroke="#c2410c" strokeWidth="2" />
                        <circle cx="150" cy="40" r="4" fill="#c2410c" />
                        <text x="156" y="42" fill="currentColor" fontSize="10">u (king)</text>

                        <line x1="30" y1="100" x2="190" y2="55" stroke="#0284c7" strokeWidth="2" />
                        <circle cx="190" cy="55" r="4" fill="#0284c7" />
                        <text x="196" y="58" fill="currentColor" fontSize="10">v (queen)</text>

                        {/* Angle Arc */}
                        <path d="M 60 90 A 30 30 0 0 0 70 82" fill="none" stroke="#d97706" strokeWidth="1.5" />
                        <text x="75" y="85" fill="#d97706" fontSize="9">cos θ ≈ 0.89</text>
                      </svg>
                      <div className="text-[11px] text-[#78716c] dark:text-[#9ca3af] text-center">
                        Dense manifold ℝ⁴⁰⁹⁶ · Cosine affinity
                      </div>
                    </div>
                  )}

                  {ch.illustrationType === 'positional' && (
                    <div className="w-full space-y-3 text-xs font-mono">
                      <div className="text-[10px] uppercase text-[#78716c] dark:text-[#9ca3af] border-b border-[#ece7dc] dark:border-[#26282f] pb-1">
                        Rotary & Sinusoidal Harmonics
                      </div>
                      <svg className="w-full h-32" viewBox="0 0 240 100">
                        {/* Baseline */}
                        <line x1="10" y1="50" x2="230" y2="50" stroke="#78716c" strokeWidth="0.75" strokeDasharray="2,2" />
                        {/* Wave 1: Low frequency */}
                        <path
                          d="M 10 50 Q 65 10, 120 50 T 230 50"
                          fill="none"
                          stroke="#c2410c"
                          strokeWidth="2"
                        />
                        {/* Wave 2: High frequency */}
                        <path
                          d="M 10 50 Q 37 25, 65 50 T 120 50 T 175 50 T 230 50"
                          fill="none"
                          stroke="#0284c7"
                          strokeWidth="1.5"
                          opacity="0.8"
                        />
                        <circle cx="65" cy="50" r="3" fill="#c2410c" />
                        <circle cx="120" cy="50" r="3" fill="#0284c7" />
                        <circle cx="175" cy="50" r="3" fill="#c2410c" />
                      </svg>
                      <div className="text-[11px] text-[#78716c] dark:text-[#9ca3af] text-center">
                        Relative distance preserved across sequence positions
                      </div>
                    </div>
                  )}

                  {ch.illustrationType === 'attention' && (
                    <div className="w-full space-y-3 text-xs font-mono">
                      <div className="text-[10px] uppercase text-[#78716c] dark:text-[#9ca3af] border-b border-[#ece7dc] dark:border-[#26282f] pb-1">
                        Causal Attention Compatibility Matrix
                      </div>
                      <div className="grid grid-cols-4 gap-1 p-2 bg-white dark:bg-[#141518] rounded border border-[#ded7ca] dark:border-[#282a32]">
                        <div className="p-2 bg-amber-500/80 text-white rounded text-center">0.92</div>
                        <div className="p-2 bg-stone-200 dark:bg-stone-800 text-[#78716c] rounded text-center">-∞</div>
                        <div className="p-2 bg-stone-200 dark:bg-stone-800 text-[#78716c] rounded text-center">-∞</div>
                        <div className="p-2 bg-stone-200 dark:bg-stone-800 text-[#78716c] rounded text-center">-∞</div>

                        <div className="p-2 bg-amber-500/40 text-[#1c1917] dark:text-[#f3f4f6] rounded text-center">0.41</div>
                        <div className="p-2 bg-amber-500/70 text-white rounded text-center">0.78</div>
                        <div className="p-2 bg-stone-200 dark:bg-stone-800 text-[#78716c] rounded text-center">-∞</div>
                        <div className="p-2 bg-stone-200 dark:bg-stone-800 text-[#78716c] rounded text-center">-∞</div>

                        <div className="p-2 bg-amber-500/20 text-[#1c1917] dark:text-[#f3f4f6] rounded text-center">0.18</div>
                        <div className="p-2 bg-amber-500/30 text-[#1c1917] dark:text-[#f3f4f6] rounded text-center">0.32</div>
                        <div className="p-2 bg-amber-500/90 text-white rounded text-center">0.96</div>
                        <div className="p-2 bg-stone-200 dark:bg-stone-800 text-[#78716c] rounded text-center">-∞</div>

                        <div className="p-2 bg-amber-500/30 text-[#1c1917] dark:text-[#f3f4f6] rounded text-center">0.24</div>
                        <div className="p-2 bg-amber-500/50 text-[#1c1917] dark:text-[#f3f4f6] rounded text-center">0.55</div>
                        <div className="p-2 bg-amber-500/40 text-[#1c1917] dark:text-[#f3f4f6] rounded text-center">0.48</div>
                        <div className="p-2 bg-amber-500/80 text-white rounded text-center">0.88</div>
                      </div>
                      <div className="text-[11px] text-[#78716c] dark:text-[#9ca3af] text-center">
                        Lower-triangular causal mask prevents future leakage
                      </div>
                    </div>
                  )}

                  {ch.illustrationType === 'transformer' && (
                    <div className="w-full space-y-2 text-xs font-mono">
                      <div className="text-[10px] uppercase text-[#78716c] dark:text-[#9ca3af] border-b border-[#ece7dc] dark:border-[#26282f] pb-1">
                        Transformer Layer Block Anatomy
                      </div>
                      <div className="space-y-1.5 p-2 bg-white dark:bg-[#141518] rounded border border-[#ded7ca] dark:border-[#282a32]">
                        <div className="p-1.5 bg-[#f4efe6] dark:bg-[#1f2127] text-center rounded text-[11px] font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
                          Output Residual Addition (x + FFN(x))
                        </div>
                        <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center rounded text-[11px] text-emerald-950 dark:text-emerald-200">
                          Feed-Forward Network (SwiGLU)
                        </div>
                        <div className="p-1.5 bg-[#f4efe6] dark:bg-[#1f2127] text-center rounded text-[11px]">
                          RMSNorm & Residual Stream Bus
                        </div>
                        <div className="p-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-center rounded text-[11px] text-amber-950 dark:text-amber-200">
                          Multi-Head Self-Attention (32 Heads)
                        </div>
                      </div>
                      <div className="text-[11px] text-[#78716c] dark:text-[#9ca3af] text-center">
                        Stacked across 32 identical computational stages
                      </div>
                    </div>
                  )}

                  {ch.illustrationType === 'generation' && (
                    <div className="w-full space-y-2.5 text-xs font-mono">
                      <div className="text-[10px] uppercase text-[#78716c] dark:text-[#9ca3af] border-b border-[#ece7dc] dark:border-[#26282f] pb-1">
                        Unembedding & Softmax Sampling
                      </div>
                      <div className="space-y-1.5 p-2 bg-white dark:bg-[#141518] rounded border border-[#ded7ca] dark:border-[#282a32]">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="font-semibold text-[#c2410c] dark:text-[#d97706]">"tomorrow"</span>
                          <span>42.1%</span>
                        </div>
                        <div className="w-full bg-[#f0ebe1] dark:bg-[#1f2127] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#c2410c] dark:bg-[#d97706] h-full" style={{ width: '42%' }} />
                        </div>

                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-[#57534e] dark:text-[#9ca3af]">"today"</span>
                          <span>24.8%</span>
                        </div>
                        <div className="w-full bg-[#f0ebe1] dark:bg-[#1f2127] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#78716c] h-full" style={{ width: '25%' }} />
                        </div>

                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-[#57534e] dark:text-[#9ca3af]">"forever"</span>
                          <span>14.3%</span>
                        </div>
                        <div className="w-full bg-[#f0ebe1] dark:bg-[#1f2127] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#78716c] h-full" style={{ width: '14%' }} />
                        </div>
                      </div>
                      <div className="text-[11px] text-[#78716c] dark:text-[#9ca3af] text-center">
                        Categorical distribution sampled autoregressively
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
