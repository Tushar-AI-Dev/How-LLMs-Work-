import React, { useState, useEffect } from 'react';
import { Container } from '../components/layout/Container';
import { PredictionPipelineVisualizer } from '../components/chapter6/PredictionPipelineVisualizer';
import { LogitsExplorer } from '../components/chapter6/LogitsExplorer';
import { SoftmaxLaboratory } from '../components/chapter6/SoftmaxLaboratory';
import { GreedyDecodingVisualizer } from '../components/chapter6/GreedyDecodingVisualizer';
import { TemperatureSimulator } from '../components/chapter6/TemperatureSimulator';
import { TopKSamplingVisualizer } from '../components/chapter6/TopKSamplingVisualizer';
import { TopPSamplingVisualizer } from '../components/chapter6/TopPSamplingVisualizer';
import { GenerationPlayground } from '../components/chapter6/GenerationPlayground';
import { AutoregressiveLoopVisualizer } from '../components/chapter6/AutoregressiveLoopVisualizer';
import { StoppingCriteriaVisualizer } from '../components/chapter6/StoppingCriteriaVisualizer';
import { CompletePipelineMap } from '../components/chapter6/CompletePipelineMap';
import { Chapter6Checkpoint } from '../components/chapter6/Chapter6Checkpoint';
import { FinalConclusionCard } from '../components/chapter6/FinalConclusionCard';
import { Button } from '../components/ui/Button';
import { NavigationTab } from '../types';
import { Clock, ArrowLeft, CheckCircle2, Sparkles, Terminal } from 'lucide-react';
import { ChapterHeaderNav } from '../components/layout/ChapterHeaderNav';
import { TechnicalDeepDive } from '../components/ui/TechnicalDeepDive';

interface Chapter6PageProps {
  onNavigate: (tab: NavigationTab) => void;
  onSelectChapter?: (chapterNumber: string) => void;
}

export const Chapter6Page: React.FC<Chapter6PageProps> = ({ onNavigate, onSelectChapter }) => {
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
    'What happens to token representations after the final Transformer block.',
    'What the language modeling unembedding head does and what logits represent.',
    'How Softmax mathematically converts unconstrained real numbers into probabilities.',
    'How greedy decoding functions and why it risks deterministic repetition.',
    'How the temperature parameter (T) calibrates probability entropy and distribution sharpness.',
    'How Top-K sampling truncates improbable tail candidates.',
    'How Top-P (nucleus) sampling dynamically bounds the candidate pool based on cumulative probability mass.',
    'How autoregressive generation loops iteratively to synthesize continuous text one token at a time.',
    'How generation processes terminate via <EOS> tokens, max_tokens, and stop sequences.',
  ];

  return (
    <div className="relative pb-24">
      {/* Chapter Editorial Header */}
      <section className="pt-12 sm:pt-20 pb-10 border-b border-[#e6e0d4] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#0c0d0e]">
        <Container size="narrow">
          <ChapterHeaderNav
            chapterNumber="06"
            chapterTitle="How LLMs Generate Text"
            chapterSubtitle="From numerical representations to the next predicted token."
            readTime="24 min read"
            onNavigate={onNavigate}
            scrollProgress={scrollProgress}
            prevChapter={{ number: '05', tab: 'chapter-5', title: 'Inside a Transformer' }}
            playgroundTab="generation"
            simulatorStage={6}
          />

          {/* Chapter Metadata Badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#78716c] dark:text-[#9ca3af] mb-4">
            <span className="px-2.5 py-1 rounded-sm bg-[#ece6d8] dark:bg-[#1a1c22] text-[#1c1917] dark:text-[#f3f4f6] font-semibold">
              CHAPTER 06 · FINAL CHAPTER
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>24 min read</span>
            </span>
            <span>·</span>
            <span>Sampling & Decoding Systems</span>
            <span>·</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
              Interactive Lab
            </span>
          </div>

          {/* Main Title & Subtitle */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] tracking-tight leading-[1.15]">
            How LLMs Generate Text
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-[#57534e] dark:text-[#9ca3af] font-serif leading-relaxed">
            From numerical representations to the next predicted token. Discover how a language model generates an entire response one step at a time.
          </p>

          {/* Learning Objectives Box */}
          <div className="mt-8 p-6 rounded-xl bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] shadow-xs">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] font-semibold mb-3">
              Learning Objectives
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#57534e] dark:text-[#d1d5db]">
              {learningObjectives.map((obj, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#c2410c] dark:text-[#d97706] shrink-0 mt-0.5" />
                  <span className="leading-snug">{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Main Chapter Content Body */}
      <Container size="narrow" className="mt-12 space-y-16 sm:space-y-24">

        {/* Section 01: From Transformer Output to Prediction */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] font-semibold">
              Section 01 · The Inference Funnel
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              From Hidden Vector to Prediction
            </h2>
          </div>

          <div className="space-y-4 text-base sm:text-lg text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            <p>
              In Chapter 05, we saw how token representations circulate through stacked Transformer blocks, enriched by self-attention and refined by feed-forward networks. At the exit of the final block, the model possesses a high-dimensional contextual vector <code className="text-xs font-mono bg-[#ece7dc] dark:bg-[#1f2127] px-1 py-0.5 rounded">h_L ∈ R^d_model</code> (e.g. 4,096 numbers) for each position in the prompt.
            </p>
            <p>
              For standard next-token prediction, we discard all earlier positions and focus exclusively on the <strong>final sequence position</strong>. This terminal vector summarizes the entire prompt history and the trajectory of what should logically follow.
            </p>
            <p>
              To convert this internal geometric state into human-readable text, the model passes <code className="text-xs font-mono bg-[#ece7dc] dark:bg-[#1f2127] px-1 py-0.5 rounded">h_L</code> through the <strong>Language Modeling Head</strong> (unembedding projection), scaling into tens of thousands of raw scores called <em>logits</em>.
            </p>
          </div>

          <PredictionPipelineVisualizer />

          <TechnicalDeepDive
            title="The Language Modeling Head & Temperature-Scaled Softmax"
            subtitle="Architectural Anatomy · 5 Fundamental Questions"
            formula="\mathbf{z} = \mathbf{W}_u \mathbf{h}_{\text{last}}, \quad P(w_i \mid w_{<t}) = \frac{\exp(z_i / T)}{\sum_{j \in \mathcal{V}} \exp(z_j / T)}"
            tensorShapes={{
              input: "Final normalized hidden state h_last [d_model]",
              output: "Probability distribution P over vocabulary [V = 50,257]",
              weights: "Unembedding projection matrix W_u [V, d_model] (often weight-tied to W_e^T)",
            }}
            anatomy={{
              whatIsHappening: "The final hidden state of the last token in the prompt is multiplied by the unembedding matrix W_u to yield raw logits z. Each logit is divided by temperature T, exponentiated into a strictly positive quantity, and normalized by the total exponential sum across the candidate vocabulary.",
              whyIsItNeeded: "Internal Transformer states live in an abstract d_model-dimensional vector space. To generate human language, the model must translate this continuous representation back into a valid categorical probability distribution over discrete vocabulary tokens.",
              whatGoesIn: "The terminal hidden state vector h_last ∈ ℝ^{d_model} at the last sequence position, plus generation hyperparameters (Temperature T, Top-K, Top-P).",
              whatComesOut: "A normalized probability vector P(w) summing strictly to 1.0, from which the next token ID is sampled or greedily selected and appended to the input prompt.",
              whatToNotice: "Notice how Temperature T < 1.0 amplifies differences between logits (making the top token dominate), whereas T > 1.0 flattens the distribution (increasing randomness and diversity). In our educational simulator, logits and probabilities are evaluated and normalized over a curated 24-token candidate pool for visual clarity.",
            }}
            technicalNote="In many modern LLMs (including GPT-2), the unembedding matrix W_u shares the exact transposed weight tensor of the input token embedding table (W_u = W_e^T), a technique known as Weight Tying that saves hundreds of millions of parameters."
          />
        </section>

        {/* Section 02: What Are Logits? */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] font-semibold">
              Section 02 · Raw Unnormalized Scores
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              What Are Logits?
            </h2>
          </div>

          <div className="space-y-4 text-base sm:text-lg text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            <p>
              Logits are the raw, unbounded scores produced by matrix multiplying the final normalized hidden vector by the unembedding matrix: <code className="text-xs font-mono bg-[#ece7dc] dark:bg-[#1f2127] px-1 py-0.5 rounded">z = W_U · h + b_U</code>.
            </p>
            <p>
              There is exactly one logit for every entry in the model's vocabulary (typically between 32,000 and 128,000 tokens). Logits are <strong>not</strong> probabilities:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm sm:text-base text-[#1c1917] dark:text-[#f3f4f6]">
              <li>They can be arbitrarily positive (<code className="font-mono text-xs">+8.4</code>), zero (<code className="font-mono text-xs">0.0</code>), or negative (<code className="font-mono text-xs">-5.1</code>).</li>
              <li>They do not sum to 1.</li>
              <li>A larger logit indicates higher model preference, holding other logits constant.</li>
            </ul>
          </div>

          <LogitsExplorer />
        </section>

        {/* Section 03: Softmax and Probability Laboratory */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] font-semibold">
              Section 03 · Mathematical Normalization
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              Softmax & Probability Normalization
            </h2>
          </div>

          <div className="space-y-4 text-base sm:text-lg text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            <p>
              Because logits are unbounded real numbers, we cannot sample directly from them. The model needs a valid categorical probability distribution where every value is non-negative and all values sum strictly to 1.0 (100%).
            </p>
            <p>
              The <strong>Softmax function</strong> achieves this through two harmonious mathematical steps:
            </p>
            <ol className="list-decimal pl-6 space-y-1.5 text-sm sm:text-base text-[#1c1917] dark:text-[#f3f4f6]">
              <li>
                <strong>Exponentiation:</strong> Computing <code className="font-mono text-xs">exp(z_i)</code> guarantees that every output is strictly positive, because Euler's constant <code className="font-mono text-xs">e^z &gt; 0</code> for any real number.
              </li>
              <li>
                <strong>Normalization:</strong> Dividing each exponentiated score by the total sum of all exponentiated scores guarantees that the entire distribution sums strictly to 1.0.
              </li>
            </ol>
          </div>

          <SoftmaxLaboratory />
        </section>

        {/* Section 04: Greedy Decoding */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] font-semibold">
              Section 04 · Deterministic Commitments
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              Greedy Decoding (Argmax Selection)
            </h2>
          </div>

          <div className="space-y-4 text-base sm:text-lg text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            <p>
              Once probabilities are calculated, how do we select the next word? The simplest strategy is <strong>Greedy Decoding</strong>: at every step, always pick the token with the highest probability (<code className="font-mono text-xs">argmax P(w)</code>).
            </p>
            <p>
              While greedy decoding is perfectly reproducible and computationally cheap, it often fails in creative writing and open-ended dialogue: it easily falls into repetitive loops and cannot explore alternative trajectories that might yield higher-quality overall sentences.
            </p>
          </div>

          <GreedyDecodingVisualizer />
        </section>

        {/* Section 05: The Temperature Simulator */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] font-semibold">
              Section 05 · Calibrating Entropy
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              Temperature: Calibrating Sharpness
            </h2>
          </div>

          <div className="space-y-4 text-base sm:text-lg text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            <p>
              To control the balance between deterministic coherence and creative diversity, we introduce a single scalar parameter: <strong>Temperature (T)</strong>.
            </p>
            <p>
              Before applying Softmax, all logits are divided by <code className="font-mono text-xs">T</code>:
            </p>
            <div className="p-3 bg-[#faf8f5] dark:bg-[#181a1f] rounded-lg border border-[#ece7dc] dark:border-[#26282f] text-center font-mono text-sm text-[#1c1917] dark:text-[#f3f4f6]">
              P(w_i) = exp(z_i / T) / sum_j exp(z_j / T)
            </div>
            <p>
              When <code className="font-mono text-xs">T &lt; 1</code> (cold), logit gaps are magnified: the most likely token peaks sharply, absorbing almost all probability. When <code className="font-mono text-xs">T &gt; 1</code> (hot), differences between logits shrink, flattening the distribution toward equal random chance.
            </p>
          </div>

          <TemperatureSimulator />
        </section>

        {/* Section 06: Top-K Sampling */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] font-semibold">
              Section 06 · Truncating Improbable Tails
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              Top-K Sampling
            </h2>
          </div>

          <div className="space-y-4 text-base sm:text-lg text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            <p>
              Even with modest temperature, the "long tail" of an 80,000-word vocabulary contains bizarre, grammatically invalid words. If sampled, a single rogue token can derail the entire subsequent generation.
            </p>
            <p>
              <strong>Top-K Sampling</strong> solves this by sorting all candidate tokens descending by probability, keeping only the top <code className="font-mono text-xs">k</code> choices (e.g. <code className="font-mono text-xs">k = 40</code>), zeroing out all others, and renormalizing the remaining probabilities to sum to 100%.
            </p>
          </div>

          <TopKSamplingVisualizer />
        </section>

        {/* Section 07: Top-P (Nucleus) Sampling */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] font-semibold">
              Section 07 · Dynamic Probability Mass
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              Top-P (Nucleus) Sampling
            </h2>
          </div>

          <div className="space-y-4 text-base sm:text-lg text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            <p>
              While Top-K truncates dangerous tail tokens, its fixed integer boundary is brittle. When the model is 99% confident in a single word, Top-K forces irrational words into consideration. When the model is uncertain across 30 synonyms, Top-K prematurely prunes good options.
            </p>
            <p>
              <strong>Top-P (Nucleus) Sampling</strong> dynamically sizes the candidate pool by setting a cumulative probability threshold (e.g. <code className="font-mono text-xs">p = 0.90</code>). Tokens are added until their cumulative sum reaches 90%, naturally contracting to 1 token when confident and expanding to many when ambiguous.
            </p>
          </div>

          <TopPSamplingVisualizer />
        </section>

        {/* Section 08: Main Feature: Generation Playground */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] font-semibold">
              Section 08 · Interactive Generation Lab
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              The Interactive Next-Token Playground
            </h2>
          </div>

          <p className="text-base sm:text-lg text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            Experience next-token generation first-hand. Select a prompt prefix, adjust sampling parameters, and advance one token at a time to inspect the exact logit distributions, filtering thresholds, and selection logic.
          </p>

          <GenerationPlayground />
        </section>

        {/* Section 09: The Autoregressive Process */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] font-semibold">
              Section 09 · Iterative Synthesis
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              The Autoregressive Loop & Context Windows
            </h2>
          </div>

          <div className="space-y-4 text-base sm:text-lg text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            <p>
              Large Language Models do not generate complete sentences in one shot. They generate text strictly <strong>one token at a time</strong>.
            </p>
            <p>
              Every newly chosen token is immediately appended to the sequence. The augmented text is then passed back into the Transformer blocks to compute the next token. This sequential dependency explains why LLM inference latency scales linearly with output length, and why techniques like <em>KV-caching</em> are essential to store past keys and values in memory.
            </p>
          </div>

          <AutoregressiveLoopVisualizer />
        </section>

        {/* Section 10: When Does Generation Stop? */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] font-semibold">
              Section 10 · Stopping Conditions
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              When Does Generation Stop?
            </h2>
          </div>

          <StoppingCriteriaVisualizer />
        </section>

        {/* Section 11: The Complete LLM Pipeline */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] font-semibold">
              Section 11 · The Unified Monograph
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              The Complete LLM Architecture: Chapters 01 to 06
            </h2>
          </div>

          <CompletePipelineMap onNavigate={onNavigate} />
        </section>

        {/* Section 12: Knowledge Checkpoint */}
        <section className="space-y-6">
          <Chapter6Checkpoint />
        </section>

        {/* Section 13: Final Conclusion Card */}
        <section className="space-y-6 pt-8 border-t border-[#e6e0d4] dark:border-[#26282f]">
          <FinalConclusionCard onNavigate={onNavigate} />

          {/* Navigation Controls */}
          <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Button
              variant="outline"
              size="md"
              icon={<ArrowLeft className="w-4 h-4" />}
              iconPosition="left"
              onClick={() => onNavigate('chapter-5')}
            >
              Previous: Chapter 05 — Inside a Transformer
            </Button>

            <Button
              variant="editorial"
              size="lg"
              onClick={() => onNavigate('learn')}
            >
              Curriculum Overview
            </Button>
          </div>
        </section>

      </Container>
    </div>
  );
};
