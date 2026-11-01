import React, { useState, useEffect } from 'react';
import { Container } from '../components/layout/Container';
import { WhichWordsMatterExperiment } from '../components/chapter4/WhichWordsMatterExperiment';
import { SelfAttentionConcept } from '../components/chapter4/SelfAttentionConcept';
import { QkvConceptExplorer } from '../components/chapter4/QkvConceptExplorer';
import { BuildQkvMatrixVisualizer } from '../components/chapter4/BuildQkvMatrixVisualizer';
import { AttentionScoresVisualizer } from '../components/chapter4/AttentionScoresVisualizer';
import { SoftmaxLaboratory } from '../components/chapter4/SoftmaxLaboratory';
import { AttentionHeatmapVisualizer } from '../components/chapter4/AttentionHeatmapVisualizer';
import { ValueAggregationVisualizer } from '../components/chapter4/ValueAggregationVisualizer';
import { MultiHeadAttentionVisualizer } from '../components/chapter4/MultiHeadAttentionVisualizer';
import { AttentionMathDimensions } from '../components/chapter4/AttentionMathDimensions';
import { Chapter4Checkpoint } from '../components/chapter4/Chapter4Checkpoint';
import { Button } from '../components/ui/Button';
import { NavigationTab } from '../types';
import { Clock, ArrowRight, ArrowLeft, CheckCircle2, Network } from 'lucide-react';
import { ChapterHeaderNav } from '../components/layout/ChapterHeaderNav';
import { TechnicalDeepDive } from '../components/ui/TechnicalDeepDive';

interface Chapter4PageProps {
  onNavigate: (tab: NavigationTab) => void;
  onSelectChapter?: (chapterNumber: string) => void;
}

export const Chapter4Page: React.FC<Chapter4PageProps> = ({ onNavigate, onSelectChapter }) => {
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
    "What self-attention is and why static embeddings cannot capture contextual ambiguity alone.",
    "The distinct roles of Query (seeking), Key (advertising), and Value (content).",
    "How Q, K, and V matrices are projected from input representations via linear transformations.",
    "How scaled dot products measure affinity and why division by √d_k prevents vanishing gradients.",
    "How Softmax normalizes scores into a probability distribution summing strictly to 1.0.",
    "How attention weights compute a context-infused weighted average of Value vectors.",
    "What causal masking prevents in autoregressive decoder-only language models.",
    "Why Multi-Head Attention enables simultaneous tracking of multiple complementary subspaces.",
  ];

  return (
    <div className="relative pb-24">
      {/* Chapter Editorial Header */}
      <section className="pt-12 sm:pt-20 pb-10 border-b border-[#e6e0d4] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#0c0d0e]">
        <Container size="narrow">
          <ChapterHeaderNav
            chapterNumber="04"
            chapterTitle="The Attention Mechanism"
            chapterSubtitle="How does a language model decide which other tokens are relevant?"
            readTime="20 min read"
            onNavigate={onNavigate}
            scrollProgress={scrollProgress}
            prevChapter={{ number: '03', tab: 'chapter-3', title: 'Positional Encoding' }}
            nextChapter={{ number: '05', tab: 'chapter-5', title: 'Inside a Transformer' }}
            playgroundTab="attention"
            simulatorStage={4}
          />

          {/* Chapter Metadata Badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#78716c] dark:text-[#9ca3af] mb-4">
            <span className="px-2.5 py-1 rounded-sm bg-[#ece6d8] dark:bg-[#1a1c22] text-[#1c1917] dark:text-[#f3f4f6] font-semibold">
              CHAPTER 04
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>20 min read</span>
            </span>
            <span>·</span>
            <span>Mathematical Heartbeat of Transformers</span>
            <span>·</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
              Interactive Laboratory
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-[#1c1917] dark:text-[#f3f4f6] leading-[1.15] text-balance">
            The Attention Mechanism
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-lg sm:text-xl text-[#57534e] dark:text-[#9ca3af] font-serif italic leading-relaxed">
            "How does a language model decide which other tokens are relevant when processing a particular token?"
          </p>

          {/* Lead Editorial Paragraph */}
          <div className="mt-8 pt-8 border-t border-[#e6e0d4] dark:border-[#26282f] text-base sm:text-lg text-[#44403c] dark:text-[#d1d5db] leading-relaxed space-y-4">
            <p>
              In previous chapters, we decomposed text into tokens, mapped integers into continuous embedding manifolds, and injected spatial coordinates via sinusoidal frequencies.
            </p>
            <p>
              Yet, up to this point, each token vector is strictly isolated. The embedding of <strong className="text-[#1c1917] dark:text-[#f3f4f6]">"it"</strong> in <em>"The animal didn't cross the street because it was tired"</em> has no way of knowing whether it refers to the animal or the street.
            </p>
            <p>
              The <strong>Attention Mechanism</strong> is the mathematical breakthrough that shatters this isolation. By broadcasting queries, comparing against keys, and computing dynamic dot-product distributions, tokens can selectively route features from across sequence history.
            </p>
          </div>

          {/* Learning Objectives Card */}
          <div className="mt-10 p-6 bg-white dark:bg-[#141518] border border-[#ded7ca] dark:border-[#282a32] rounded-xl space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#c2410c] dark:text-[#d97706]">
              <Network className="w-4 h-4" />
              <span>Chapter Learning Objectives</span>
            </div>
            <p className="text-xs text-[#78716c] dark:text-[#9ca3af]">
              By completing this interactive monograph, you will master:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-[#44403c] dark:text-[#d1d5db]">
              {learningObjectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Main Chapter Content Container */}
      <Container size="narrow" className="mt-12 space-y-16">
        
        {/* Section 02: Which Words Matter? (Opening Experiment) */}
        <section>
          <WhichWordsMatterExperiment />
        </section>

        {/* Section 03: What Is Self-Attention? */}
        <section>
          <SelfAttentionConcept />
        </section>

        {/* Section 04: Query, Key, and Value */}
        <section>
          <QkvConceptExplorer />
        </section>

        {/* Section 05: Build Q, K, and V via Matrix Projections */}
        <section>
          <BuildQkvMatrixVisualizer />
        </section>

        {/* Section 06: Calculating Attention Scores */}
        <section>
          <AttentionScoresVisualizer />
        </section>

        {/* Section 07: The Softmax Laboratory */}
        <section>
          <SoftmaxLaboratory />
        </section>

        {/* Section 08: The Attention Matrix & Causal Masking */}
        <section>
          <AttentionHeatmapVisualizer />
        </section>

        {/* Section 09: Attention Output: Linearly Combining Value Vectors */}
        <section>
          <ValueAggregationVisualizer />

          <TechnicalDeepDive
            title="Scaled Dot-Product Self-Attention with Causal Mask"
            subtitle="Architectural Anatomy · 5 Fundamental Questions"
            formula="\text{Attention}(\mathbf{Q}, \mathbf{K}, \mathbf{V}) = \text{softmax}\left( \frac{\mathbf{Q}\mathbf{K}^T}{\sqrt{d_k}} + \mathbf{M} \right) \mathbf{V}"
            tensorShapes={{
              input: "Q, K, V matrices of shape [seq_len, d_k] (where d_k = d_model / n_heads)",
              output: "Context-aggregated output matrix of shape [seq_len, d_k]",
              weights: "Projection weight matrices W_Q, W_K, W_V [d_model, d_k] and output W_O [d_model, d_model]",
            }}
            anatomy={{
              whatIsHappening: "For every query vector, dot products against all key vectors compute mutual affinity scores. These scores are divided by √d_k, masked with -∞ in upper-triangular future entries, transformed into positive probabilities via softmax, and then used as weighting coefficients to compute a weighted sum over Value vectors.",
              whyIsItNeeded: "Tokens cannot predict future text in isolation. Attention is the communication mechanism allowing each token to dynamically extract relevant syntactic, grammatical, and factual information from preceding tokens.",
              whatGoesIn: "The input representations X ∈ ℝ^{seq_len × d_model}, projected via W_Q, W_K, W_V into Queries Q, Keys K, and Values V.",
              whatComesOut: "A context-saturated matrix of shape [seq_len, d_model] where each row contains an updated representation that blends relevant features from across the sequence history.",
              whatToNotice: "Notice how the causal mask sets all future interactions to -∞ so that softmax(e^{-∞}) = 0. This guarantees that token t cannot inspect tokens t+1, t+2, etc., preventing future information leakage during training and generation.",
            }}
            technicalNote="In multi-head attention with h heads, this operation is executed independently across h parallel heads. Each head specializes in distinct relational subspace patterns (such as coreference, grammar agreements, or distant semantic associations), whose outputs are concatenated and linearly projected via W_O."
          />
        </section>

        {/* Section 10: Multi-Head Attention */}
        <section>
          <MultiHeadAttentionVisualizer />
        </section>

        {/* Section 11: Computational Perspective & Tensor Shapes */}
        <section>
          <AttentionMathDimensions />
        </section>

        {/* Section 12: Knowledge Checkpoint */}
        <section>
          <Chapter4Checkpoint />
        </section>

        {/* Section 13: Chapter Summary & Transition to Chapter 05 */}
        <section className="p-8 bg-[#faf8f5] dark:bg-[#131417] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#c2410c] dark:text-[#d97706] font-semibold uppercase tracking-wider">
            <span>Chapter 04 Summary</span>
            <span>·</span>
            <span>The Attention Loop</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#1c1917] dark:text-[#f3f4f6]">
            The Dynamic Routing Pipeline Is Complete
          </h3>

          <div className="p-4 bg-white dark:bg-[#18191f] rounded-lg border border-[#ded7ca] dark:border-[#282a32] font-mono text-xs sm:text-sm text-center font-semibold text-[#1c1917] dark:text-[#f3f4f6] overflow-x-auto whitespace-nowrap">
            Input X <span className="text-[#c2410c] dark:text-[#d97706]">→</span> Q, K, V Projections <span className="text-[#c2410c] dark:text-[#d97706]">→</span> QKᵀ / √d_k <span className="text-[#c2410c] dark:text-[#d97706]">→</span> Masked Softmax <span className="text-[#c2410c] dark:text-[#d97706]">→</span> Value Sum <span className="text-[#c2410c] dark:text-[#d97706]">→</span> Output Projection W_O
          </div>

          <p className="text-sm sm:text-base text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            Attention enables contextual information to flow effortlessly between tokens. Instead of fixed, isolated symbols, our tokens are now context-saturated representations that know what they mean and where they stand.
          </p>

          <p className="text-sm sm:text-base font-serif italic text-[#1c1917] dark:text-[#f3f4f6] leading-relaxed border-l-2 border-[#c2410c] dark:border-[#d97706] pl-4 py-1">
            "We've explored how tokens exchange information. Now let's see how attention fits into the complete Transformer block."
          </p>

          {/* Chapter Navigation Controls */}
          <div className="pt-4 border-t border-[#ece7dc] dark:border-[#22242b] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Button
              variant="outline"
              size="md"
              icon={<ArrowLeft className="w-4 h-4" />}
              iconPosition="left"
              onClick={() => onNavigate('chapter-3')}
            >
              Previous: Chapter 03 — Positional Encoding
            </Button>

            <Button
              variant="editorial"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onNavigate('chapter-5')}
            >
              Continue to Chapter 05 — Inside a Transformer
            </Button>
          </div>
        </section>

      </Container>
    </div>
  );
};
