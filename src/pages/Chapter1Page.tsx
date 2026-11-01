import React, { useState, useEffect } from 'react';
import { Container } from '../components/layout/Container';
import { TextToTokensHero } from '../components/chapter1/TextToTokensHero';
import { TokenConceptExplorer } from '../components/chapter1/TokenConceptExplorer';
import { InteractivePlayground } from '../components/chapter1/InteractivePlayground';
import { TokenIdExplainer } from '../components/chapter1/TokenIdExplainer';
import { VocabularyExplorer } from '../components/chapter1/VocabularyExplorer';
import { SubwordVsWordComparison } from '../components/chapter1/SubwordVsWordComparison';
import { KnowledgeCheckpoint } from '../components/chapter1/KnowledgeCheckpoint';
import { Button } from '../components/ui/Button';
import { Callout } from '../components/ui/Callout';
import { NavigationTab, Chapter } from '../types';
import { Clock, ArrowRight, ArrowLeft, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

import { ChapterHeaderNav } from '../components/layout/ChapterHeaderNav';
import { TechnicalDeepDive } from '../components/ui/TechnicalDeepDive';

interface Chapter1PageProps {
  onNavigate: (tab: NavigationTab) => void;
  onSelectChapter?: (chapterNumber: string) => void;
}

export const Chapter1Page: React.FC<Chapter1PageProps> = ({ onNavigate, onSelectChapter }) => {
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
    "What a token is and why computers require numerical representations of human text.",
    "Why naive approaches (character-level or dictionary-word) fail at modern scale.",
    "How Byte-Pair Encoding (BPE) statistically constructs an optimal subword vocabulary.",
    "How each subword is deterministically assigned a unique integer token ID.",
    "Why whitespace, casing, and punctuation form distinct token primitives.",
    "Why token IDs alone carry zero semantic geometry until projected into embeddings.",
  ];

  return (
    <div className="relative pb-24">
      {/* Chapter Editorial Header */}
      <section className="pt-12 sm:pt-20 pb-10 border-b border-[#e6e0d4] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#0c0d0e]">
        <Container size="narrow">
          <ChapterHeaderNav
            chapterNumber="01"
            chapterTitle="From Text to Tokens"
            chapterSubtitle="Before a language model can process language, it must turn text into numbers."
            readTime="12 min read"
            onNavigate={onNavigate}
            scrollProgress={scrollProgress}
            nextChapter={{ number: '02', tab: 'chapter-2', title: 'Understanding Embeddings' }}
            playgroundTab="tokenizer"
            simulatorStage={1}
          />

          {/* Chapter Metadata Ribbon */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#78716c] dark:text-[#9ca3af] mb-3">
            <span className="font-mono text-sm font-bold text-[#c2410c] dark:text-[#d97706]">
              CHAPTER 01
            </span>
            <span aria-hidden="true" className="text-[#a8a29e] dark:text-[#52525b]">·</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#a8a29e] dark:text-[#6b7280]" />
              <span>12 min read</span>
            </div>
            <span aria-hidden="true" className="text-[#a8a29e] dark:text-[#52525b]">·</span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Interactive Monograph
            </span>
          </div>

          {/* Main Chapter Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-[#1c1917] dark:text-[#f3f4f6] leading-[1.12] text-balance">
            From Text to Tokens
          </h1>

          {/* Chapter Subtitle */}
          <p className="mt-4 text-lg sm:text-xl font-serif italic text-[#57534e] dark:text-[#d1d5db] leading-relaxed">
            "Before a language model can process language, it must turn text into something a computer can work with."
          </p>

          {/* Short Introduction */}
          <p className="mt-6 text-base sm:text-lg text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            Before an artificial neural network can calculate a single dot product, continuous human prose must be broken into discrete mathematical primitives. This chapter demonstrates the exact algorithms modern LLMs use to convert arbitrary strings into arrays of integers.
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
        
        {/* Section 02: Computers Don't Read Text Like Humans */}
        <section>
          <div className="mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
              Section 02
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
              Computers Don't Read Text Like Humans
            </h2>
          </div>

          <div className="prose text-[#44403c] dark:text-[#d1d5db] text-base leading-relaxed space-y-4">
            <p>
              When a human reads the sentence <strong className="text-[#1c1917] dark:text-[#f3f4f6]">"The cat is sleeping,"</strong> we immediately access a lifetime of sensory experience: images of whiskers, memories of soft fur, and the concept of rest.
            </p>
            <p>
              Silicon microprocessors possess no such intuition. A computer is purely a calculus engine—it performs millions of numerical matrix multiplications per second. To a neural network, raw words are inert symbols. An LLM needs a deterministic, invertible mechanism to translate continuous letters into integer primitives.
            </p>
          </div>

          <TextToTokensHero />
        </section>

        {/* Section 03: What Is Tokenization? */}
        <section>
          <div className="mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
              Section 03
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
              What is Tokenization?
            </h2>
          </div>

          <div className="prose text-[#44403c] dark:text-[#d1d5db] text-base leading-relaxed space-y-4">
            <p>
              At its core, <strong>tokenization</strong> is the process of breaking a stream of text into smaller, discrete chunks called <strong>tokens</strong>.
            </p>
            <p>
              Crucially, tokens are not simply dictionary words. A token can be an entire word (<code>"cat"</code>), a common subword prefix (<code>"un"</code>), a grammatical suffix (<code>"ing"</code>), a punctuation mark (<code>"."</code>), or even a single byte.
            </p>
          </div>

          <TokenConceptExplorer />
        </section>

        {/* Section 04: Main Feature: Interactive Tokenizer Playground */}
        <section>
          <div className="mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
              Section 04 · Laboratory
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
              Interactive Tokenizer Playground
            </h2>
            <p className="mt-2 text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
              Experiment below with arbitrary prose, code, punctuation, or foreign characters. This playground executes a real Byte-Pair Encoding (BPE) tokenizer compatible with GPT-2 and GPT-3.
            </p>
          </div>

          <InteractivePlayground />

          <TechnicalDeepDive
            title="The Mechanics of Byte-Pair Tokenization"
            subtitle="Architectural Anatomy · 5 Fundamental Questions"
            formula="\text{Tokenizer}: \mathcal{S} \xrightarrow{\text{BPE Merges}} [t_1, t_2, \dots, t_N] \xrightarrow{\mathcal{V}^{-1}} [id_1, id_2, \dots, id_N], \quad id_i \in [0, 50256]"
            tensorShapes={{
              input: "String S of length L chars",
              output: "Array of N integers (shape: [N])",
              weights: "Fixed vocabulary lookup table V (|V| = 50,257)",
            }}
            anatomy={{
              whatIsHappening: "The tokenizer receives continuous text, maps initial characters to byte primitives, and iteratively merges the most statistically frequent adjacent byte pairs according to a learned vocabulary rank table until no further merges apply.",
              whyIsItNeeded: "Neural networks are calculus engines that perform matrix arithmetic on numbers. They cannot directly process unicode strings. Character-level tokenization would create sequences too long for attention quadratic complexity, while full-word tokenization causes vocabulary explosion and out-of-vocabulary failures for new words.",
              whatGoesIn: "A raw UTF-8 text string of arbitrary length (e.g., 'The cat sat on the mat.').",
              whatComesOut: "An array of discrete integer token IDs in the range [0, 50256] matching GPT-2 BPE, alongside corresponding text token chunks.",
              whatToNotice: "Notice how spaces are bound to the beginning of words (e.g. ' sat' is a single token distinct from 'sat'). Notice also how rare words or compound words are cleanly split into familiar subwords rather than throwing an unknown token error.",
            }}
            technicalNote="GPT-2 uses a byte-level BPE vocabulary of 50,257 tokens (50,000 merged subwords + 256 individual byte tokens + 1 special token <|endoftext|> at ID 50256). Every possible byte sequence is representable without ever encountering an Out-Of-Vocabulary (OOV) error."
          />
        </section>

        {/* Section 05: Understanding Token IDs */}
        <section>
          <TokenIdExplainer />
        </section>

        {/* Section 06: What Is a Vocabulary? */}
        <section>
          <VocabularyExplorer />
        </section>

        {/* Section 07: Why Not Process Entire Words? */}
        <section>
          <SubwordVsWordComparison />
        </section>

        {/* Section 08: Knowledge Checkpoint */}
        <section>
          <KnowledgeCheckpoint />
        </section>

        {/* Section 09: Chapter Summary & Transition */}
        <section className="p-8 bg-[#faf8f5] dark:bg-[#131417] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#c2410c] dark:text-[#d97706] font-semibold uppercase tracking-wider">
            <span>Chapter 01 Summary</span>
            <span>·</span>
            <span>The Journey Ahead</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#1c1917] dark:text-[#f3f4f6]">
            From Raw Text to Numerical Primitives
          </h3>

          <div className="p-4 bg-white dark:bg-[#18191f] rounded-lg border border-[#ded7ca] dark:border-[#282a32] font-mono text-sm sm:text-base text-center font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
            Text String <span className="text-[#c2410c] dark:text-[#d97706]">→</span> Discrete Tokens <span className="text-[#c2410c] dark:text-[#d97706]">→</span> Integer Token IDs <span className="text-[#c2410c] dark:text-[#d97706]">→</span> Continuous Vectors
          </div>

          <p className="text-sm sm:text-base text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            We have witnessed how human sentences are sliced into subwords and mapped to categorical integer IDs. But an integer like <code>3797</code> has no spatial or relational meaning.
          </p>
          <p className="text-sm sm:text-base text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            In the next chapter, we step into the <strong>Embedding Layer</strong>, where each arbitrary token ID is projected into a 4,096-dimensional geometric space where direction, angle, and distance represent semantic concepts.
          </p>

          {/* Prominent Next Chapter CTA */}
          <div className="pt-4 border-t border-[#ece7dc] dark:border-[#22242b] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-2 text-xs font-mono text-[#78716c] hover:text-[#1c1917] dark:hover:text-[#f3f4f6] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Monograph Home</span>
            </button>

            <Button
              variant="editorial"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onNavigate('chapter-2')}
            >
              Continue to Understanding Embeddings
            </Button>
          </div>
        </section>

      </Container>
    </div>
  );
};
