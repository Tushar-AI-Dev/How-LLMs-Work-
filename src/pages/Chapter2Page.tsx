import React, { useState, useEffect } from 'react';
import { Container } from '../components/layout/Container';
import { IdsToVectorsHero } from '../components/chapter2/IdsToVectorsHero';
import { EmbeddingLookupVisualizer } from '../components/chapter2/EmbeddingLookupVisualizer';
import { DimensionExplorer } from '../components/chapter2/DimensionExplorer';
import { EmbeddingSpaceExplorer } from '../components/chapter2/EmbeddingSpaceExplorer';
import { TrainingEmbeddingsVisualizer } from '../components/chapter2/TrainingEmbeddingsVisualizer';
import { TokenVsEmbeddingComparison } from '../components/chapter2/TokenVsEmbeddingComparison';
import { Chapter2Checkpoint } from '../components/chapter2/Chapter2Checkpoint';
import { Button } from '../components/ui/Button';
import { NavigationTab } from '../types';
import { Clock, ArrowRight, ArrowLeft, CheckCircle2, Compass, Layers } from 'lucide-react';

import { ChapterHeaderNav } from '../components/layout/ChapterHeaderNav';
import { TechnicalDeepDive } from '../components/ui/TechnicalDeepDive';

interface Chapter2PageProps {
  onNavigate: (tab: NavigationTab) => void;
  onSelectChapter?: (chapterNumber: string) => void;
}

export const Chapter2Page: React.FC<Chapter2PageProps> = ({ onNavigate, onSelectChapter }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll progress
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
    "What an embedding is and why neural networks require continuous representations.",
    "Why discrete token IDs are insufficient for capturing semantic relationships.",
    "How the embedding matrix (W_e) maps an integer ID to a row vector in O(1) time.",
    "What vector dimensions represent in latent concept space.",
    "How embeddings are iteratively tuned by backpropagation during pre-training.",
    "How cosine similarity geometrically calculates semantic alignment between words.",
  ];

  return (
    <div className="relative pb-24">
      {/* Chapter Editorial Header */}
      <section className="pt-12 sm:pt-20 pb-10 border-b border-[#e6e0d4] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#0c0d0e]">
        <Container size="narrow">
          <ChapterHeaderNav
            chapterNumber="02"
            chapterTitle="Understanding Embeddings"
            chapterSubtitle="How do numbers represent the information contained in tokens?"
            readTime="15 min read"
            onNavigate={onNavigate}
            scrollProgress={scrollProgress}
            prevChapter={{ number: '01', tab: 'chapter-1', title: 'From Text to Tokens' }}
            nextChapter={{ number: '03', tab: 'chapter-3', title: 'Positional Encoding' }}
            playgroundTab="embeddings"
            simulatorStage={2}
          />

          {/* Chapter Metadata Ribbon */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#78716c] dark:text-[#9ca3af] mb-3">
            <span className="font-mono text-sm font-bold text-[#c2410c] dark:text-[#d97706]">
              CHAPTER 02
            </span>
            <span aria-hidden="true" className="text-[#a8a29e] dark:text-[#52525b]">·</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#a8a29e] dark:text-[#6b7280]" />
              <span>15 min read</span>
            </div>
            <span aria-hidden="true" className="text-[#a8a29e] dark:text-[#52525b]">·</span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Interactive Monograph
            </span>
          </div>

          {/* Main Chapter Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-[#1c1917] dark:text-[#f3f4f6] leading-[1.12] text-balance">
            Understanding Embeddings
          </h1>

          {/* Chapter Subtitle */}
          <p className="mt-4 text-lg sm:text-xl font-serif italic text-[#57534e] dark:text-[#d1d5db] leading-relaxed">
            "How do numbers represent the information contained in tokens?"
          </p>

          {/* Introduction */}
          <p className="mt-6 text-base sm:text-lg text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            A token ID like <code className="font-mono">3797</code> tells the computer which vocabulary item was spoken, but it carries no inherent semantic meaning. In this chapter, we explore the embedding matrix—the translation dictionary that projects discrete tokens into continuous geometric coordinates where angle, direction, and distance encode conceptual relationships.
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
        
        {/* Section 02: From IDs to Vectors */}
        <section>
          <IdsToVectorsHero />

          <TechnicalDeepDive
            title="The Embedding Lookup Matrix Operation"
            subtitle="Architectural Anatomy · 5 Fundamental Questions"
            formula="\mathbf{e}_i = \mathbf{e}(\text{token\_id}) = \mathbf{W}_e[\text{token\_id}, :], \quad \mathbf{W}_e \in \mathbb{R}^{V \times d_{\text{model}}}"
            tensorShapes={{
              input: "Scalar token ID integer (or 1-hot vector [1, V])",
              output: "Continuous dense vector [d_model]",
              weights: "Embedding table W_e [V = 50257, d_model = 4096]",
            }}
            anatomy={{
              whatIsHappening: "The integer token ID acts as a zero-cost index into an enormous weight table (the embedding matrix W_e). It retrieves a dense, continuous row of real-valued floating-point numbers.",
              whyIsItNeeded: "Integer IDs are arbitrary category indexes: ID 3797 ('cat') and ID 3798 ('dog') have numerical distance 1, while 'puppy' might be 15000. In integer space, there is no geometry. In embedding space, vectors for semantically related words point in nearly identical directions.",
              whatGoesIn: "A single integer token ID (e.g., id = 3797).",
              whatComesOut: "A d_model-dimensional embedding vector (e.g. 4,096 numbers in GPT-3 / LLaMA, or 8 numbers in our educational simulator).",
              whatToNotice: "Notice that this retrieval requires zero matrix multiplication runtime cost—it is an O(1) table lookup. Also notice that these initial embeddings are static: 'cat' retrieves the exact same vector regardless of context.",
            }}
            technicalNote="In our educational simulator, d_model is set to 8 dimensions with deterministic weights for transparent visual inspection. Production models scale this: GPT-2 uses d_model = 768, GPT-3 uses d_model = 12,288, and LLaMA 3 uses d_model = 4,096 or 8,192."
          />
        </section>

        {/* Section 03: Interactive Embedding Lookup */}
        <section>
          <EmbeddingLookupVisualizer />
        </section>

        {/* Section 04: What Are Embedding Dimensions? */}
        <section>
          <DimensionExplorer />
        </section>

        {/* Section 05: Explore Vector Relationships (2D Explorer) */}
        <section>
          <EmbeddingSpaceExplorer />
        </section>

        {/* Section 06: How Are Embeddings Learned? */}
        <section>
          <TrainingEmbeddingsVisualizer />
        </section>

        {/* Section 07: Important Distinction (Token ID vs Embedding) */}
        <section>
          <TokenVsEmbeddingComparison />
        </section>

        {/* Section 08: Knowledge Checkpoint */}
        <section>
          <Chapter2Checkpoint />
        </section>

        {/* Section 09: Chapter Summary & Next Stage */}
        <section className="p-8 bg-[#faf8f5] dark:bg-[#131417] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#c2410c] dark:text-[#d97706] font-semibold uppercase tracking-wider">
            <span>Chapter 02 Summary</span>
            <span>·</span>
            <span>The Missing Coordinate</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#1c1917] dark:text-[#f3f4f6]">
            Tokens Are Now Vectors. But Where Are They Located?
          </h3>

          <div className="p-4 bg-white dark:bg-[#18191f] rounded-lg border border-[#ded7ca] dark:border-[#282a32] font-mono text-sm sm:text-base text-center font-semibold text-[#1c1917] dark:text-[#f3f4f6] overflow-x-auto whitespace-nowrap">
            Token ID <span className="text-[#c2410c] dark:text-[#d97706]">→</span> Matrix Lookup <span className="text-[#c2410c] dark:text-[#d97706]">→</span> Vector Coordinates ℝ⁴⁰⁹⁶
          </div>

          <p className="text-sm sm:text-base text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            By mapping token IDs into dense embedding vectors, the model can now compute semantic affinity using cosine angles and dot products.
          </p>
          <p className="text-sm sm:text-base text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            However, there is a fundamental limitation: <strong>the embedding matrix is static</strong>. The vector for <code className="font-mono">"dog"</code> in <strong className="text-[#1c1917] dark:text-[#f3f4f6]">"The dog chased the cat"</strong> is identical to the vector for <code className="font-mono">"dog"</code> in <strong className="text-[#1c1917] dark:text-[#f3f4f6]">"The cat chased the dog"</strong>.
          </p>
          <p className="text-sm sm:text-base text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            Because self-attention is permutation-invariant, the model cannot distinguish sequence order without an explicit mathematical coordinate system. In the next chapter, we unpack how <strong>Positional Encoding</strong> injects temporal sequence order into these static embeddings.
          </p>

          {/* Chapter Navigation Controls */}
          <div className="pt-4 border-t border-[#ece7dc] dark:border-[#22242b] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Button
              variant="outline"
              size="md"
              icon={<ArrowLeft className="w-4 h-4" />}
              iconPosition="left"
              onClick={() => onNavigate('chapter-1')}
            >
              Previous: Chapter 01 — From Text to Tokens
            </Button>

            <Button
              variant="editorial"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onNavigate('chapter-3')}
            >
              Continue to Chapter 03 — Positional Encoding
            </Button>
          </div>
        </section>

      </Container>
    </div>
  );
};
