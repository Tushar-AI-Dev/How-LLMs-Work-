import React, { useState, useEffect } from 'react';
import { Container } from '../components/layout/Container';
import { SentencePermutationExperiment } from '../components/chapter3/SentencePermutationExperiment';
import { WhyEmbeddingsArentEnough } from '../components/chapter3/WhyEmbeddingsArentEnough';
import { SinusoidalHeatmapExplorer } from '../components/chapter3/SinusoidalHeatmapExplorer';
import { SinusoidalWaveVisualizer } from '../components/chapter3/SinusoidalWaveVisualizer';
import { VectorAdditionSimulator } from '../components/chapter3/VectorAdditionSimulator';
import { PositionalMethodsComparison } from '../components/chapter3/PositionalMethodsComparison';
import { Chapter3Checkpoint } from '../components/chapter3/Chapter3Checkpoint';
import { Button } from '../components/ui/Button';
import { NavigationTab } from '../types';
import { Clock, ArrowRight, ArrowLeft, CheckCircle2, Waves } from 'lucide-react';

import { ChapterHeaderNav } from '../components/layout/ChapterHeaderNav';
import { TechnicalDeepDive } from '../components/ui/TechnicalDeepDive';

interface Chapter3PageProps {
  onNavigate: (tab: NavigationTab) => void;
  onSelectChapter?: (chapterNumber: string) => void;
}

export const Chapter3Page: React.FC<Chapter3PageProps> = ({ onNavigate, onSelectChapter }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track reading scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const learningObjectives = [
    "Why natural language is strictly order-dependent and why Transformers are intrinsically order-blind.",
    "Why token embeddings alone cannot differentiate between 'dog chased cat' and 'cat chased dog'.",
    "How sinusoidal waves generate continuous, collision-free coordinate coordinates across sequence positions.",
    "How different dimension frequencies act like clock hands to encode micro and macro positions.",
    "How element-wise vector addition combines token semantics with spatial coordinates.",
    "The architectural evolution from fixed sinusoids to learned embeddings and Rotary Position Embeddings (RoPE).",
  ];

  return (
    <div className="relative pb-24">
      {/* Chapter Editorial Header */}
      <section className="pt-12 sm:pt-20 pb-10 border-b border-[#e6e0d4] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#0c0d0e]">
        <Container size="narrow">
          <ChapterHeaderNav
            chapterNumber="03"
            chapterTitle="Positional Encoding"
            chapterSubtitle="How does a Transformer know which token comes first, second, or last?"
            readTime="14 min read"
            onNavigate={onNavigate}
            scrollProgress={scrollProgress}
            prevChapter={{ number: '02', tab: 'chapter-2', title: 'Understanding Embeddings' }}
            nextChapter={{ number: '04', tab: 'chapter-4', title: 'The Attention Mechanism' }}
            playgroundTab="positional"
            simulatorStage={3}
          />

          {/* Chapter Metadata Ribbon */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#78716c] dark:text-[#9ca3af] mb-3">
            <span className="font-mono text-sm font-bold text-[#c2410c] dark:text-[#d97706]">
              CHAPTER 03
            </span>
            <span aria-hidden="true" className="text-[#a8a29e] dark:text-[#52525b]">·</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#a8a29e] dark:text-[#6b7280]" />
              <span>14 min read</span>
            </div>
            <span aria-hidden="true" className="text-[#a8a29e] dark:text-[#52525b]">·</span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Interactive Monograph
            </span>
          </div>

          {/* Main Chapter Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-[#1c1917] dark:text-[#f3f4f6] leading-[1.12] text-balance">
            Positional Encoding
          </h1>

          {/* Chapter Subtitle */}
          <p className="mt-4 text-lg sm:text-xl font-serif italic text-[#57534e] dark:text-[#d1d5db] leading-relaxed">
            "How does a Transformer know which token comes first, second, or last?"
          </p>

          {/* Short Introduction */}
          <p className="mt-6 text-base sm:text-lg text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            Because the attention mechanism processes all tokens simultaneously in parallel, it is fundamentally permutation-invariant. If you scramble the words in a prompt, pure self-attention computes the exact same mathematical sum. This chapter explores the ingenious mathematical coordinate systems that inject temporal order into neural activations.
          </p>

          {/* Learning Objectives Box */}
          <div className="mt-8 p-5 bg-white dark:bg-[#141518] rounded-xl border border-[#ded7ca] dark:border-[#282a32] space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold block">
              Core Learning Objectives
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#57534e] dark:text-[#9ca3af]">
              {learningObjectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c2410c] dark:text-[#d97706] shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Main Chapter Content */}
      <Container size="narrow" className="mt-12 space-y-16">

        {/* Section 02: Opening Experiment: Same Words, Different Meaning */}
        <section>
          <SentencePermutationExperiment />
        </section>

        {/* Section 03: Why Embeddings Aren't Enough */}
        <section>
          <WhyEmbeddingsArentEnough />
        </section>

        {/* Section 04: Interactive Sinusoidal Heatmap Explorer */}
        <section>
          <SinusoidalHeatmapExplorer />
        </section>

        {/* Section 05: Understanding the Waves */}
        <section>
          <SinusoidalWaveVisualizer />
        </section>

        {/* Section 06: Vector Addition Simulator */}
        <section>
          <VectorAdditionSimulator />

          <TechnicalDeepDive
            title="Harmonic Sinusoidal Positional Encoding"
            subtitle="Architectural Anatomy · 5 Fundamental Questions"
            formula="\mathbf{x}_{pos} = \mathbf{e}_{pos} + \mathbf{PE}_{pos}, \quad \text{PE}_{(pos, 2i)} = \sin\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right), \quad \text{PE}_{(pos, 2i+1)} = \cos\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)"
            tensorShapes={{
              input: "Token embedding e [seq_len, d_model] and position integer pos",
              output: "Context-ready initial representation x_0 [seq_len, d_model]",
              weights: "Zero learnable weights (deterministic closed-form trigonometric basis)",
            }}
            anatomy={{
              whatIsHappening: "For each position index pos (0, 1, 2, ...), a d_model-dimensional coordinate vector is computed from paired sine and cosine waves whose wavelengths geometrically stretch from 2π to 10,000·2π across dimensions i ∈ [0, d_model/2). This coordinate vector is directly added element-wise to the token embedding.",
              whyIsItNeeded: "Because self-attention computes dot products across all tokens in parallel, it is fundamentally permutation-invariant (order-blind). Without positional information, 'The cat chased the dog' and 'The dog chased the cat' produce mathematically identical attention scores.",
              whatGoesIn: "The static token embedding vector e_pos and the discrete position index pos ∈ [0, seq_len - 1].",
              whatComesOut: "The combined position-aware input vector x_0 = e_pos + PE_pos possessing the exact same dimension d_model.",
              whatToNotice: "Notice how early dimensions oscillate rapidly between consecutive words (distinguishing adjacent tokens), while higher dimensions change very slowly (distinguishing distant paragraphs). Because cos(α - β) relates relative distances, linear combinations allow the model to easily attend to relative offsets (pos + k).",
            }}
            technicalNote="While original Transformers (Vaswani et al., 2017) used additive sinusoidal encodings, modern open-weights architectures (LLaMA, Mistral, Gemma) employ Rotary Position Embeddings (RoPE), which rotate 2D query and key subvectors by an angle proportional to position rather than adding coordinates to the input stream."
          />
        </section>

        {/* Section 07: Modern Positional Methods (Sinusoidal vs Learned vs RoPE) */}
        <section>
          <PositionalMethodsComparison />
        </section>

        {/* Section 08: Knowledge Checkpoint */}
        <section>
          <Chapter3Checkpoint />
        </section>

        {/* Section 09: Chapter Summary & Transition to Attention */}
        <section className="p-8 bg-[#faf8f5] dark:bg-[#131417] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#c2410c] dark:text-[#d97706] font-semibold uppercase tracking-wider">
            <span>Chapter 03 Summary</span>
            <span>·</span>
            <span>The Sequence Is Complete</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#1c1917] dark:text-[#f3f4f6]">
            Every Token Now Has Identity and Position
          </h3>

          <div className="p-4 bg-white dark:bg-[#18191f] rounded-lg border border-[#ded7ca] dark:border-[#282a32] font-mono text-sm sm:text-base text-center font-semibold text-[#1c1917] dark:text-[#f3f4f6] overflow-x-auto whitespace-nowrap">
            Raw Text <span className="text-[#c2410c] dark:text-[#d97706]">→</span> Token IDs <span className="text-[#c2410c] dark:text-[#d97706]">→</span> Embeddings <span className="text-[#c2410c] dark:text-[#d97706]">→</span> Positional Information
          </div>

          <p className="text-sm sm:text-base text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            By combining semantic word embeddings with position coordinates, the input representations now embody both <strong>identity</strong> (what the word means) and <strong>contextual order</strong> (where the word stands).
          </p>

          <p className="text-sm sm:text-base font-serif italic text-[#1c1917] dark:text-[#f3f4f6] leading-relaxed border-l-2 border-[#c2410c] dark:border-[#d97706] pl-4 py-1">
            "Now that the model has information about what each token represents and where it appears, let's explore how tokens interact with one another."
          </p>

          {/* Chapter Navigation Controls */}
          <div className="pt-4 border-t border-[#ece7dc] dark:border-[#22242b] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Button
              variant="outline"
              size="md"
              icon={<ArrowLeft className="w-4 h-4" />}
              iconPosition="left"
              onClick={() => onNavigate('chapter-2')}
            >
              Previous: Chapter 02 — Understanding Embeddings
            </Button>

            <Button
              variant="editorial"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onNavigate('chapter-4')}
            >
              Continue to Chapter 04 — The Attention Mechanism
            </Button>
          </div>
        </section>

      </Container>
    </div>
  );
};
