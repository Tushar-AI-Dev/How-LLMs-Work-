import React, { useState, useEffect } from 'react';
import { Container } from '../components/layout/Container';
import { TransformerBlockDiagram } from '../components/chapter5/TransformerBlockDiagram';
import { ResidualConnectionSimulator } from '../components/chapter5/ResidualConnectionSimulator';
import { LayerNormLaboratory } from '../components/chapter5/LayerNormLaboratory';
import { FeedForwardNetworkVisualizer } from '../components/chapter5/FeedForwardNetworkVisualizer';
import { PreNormPostNormComparison } from '../components/chapter5/PreNormPostNormComparison';
import { StackedBlocksVisualizer } from '../components/chapter5/StackedBlocksVisualizer';
import { TransformerArchitecturesComparison } from '../components/chapter5/TransformerArchitecturesComparison';
import { Chapter5Checkpoint } from '../components/chapter5/Chapter5Checkpoint';
import { Button } from '../components/ui/Button';
import { NavigationTab } from '../types';
import { Clock, ArrowRight, ArrowLeft, CheckCircle2, Layers, Cpu, Sparkles } from 'lucide-react';
import { ChapterHeaderNav } from '../components/layout/ChapterHeaderNav';
import { TechnicalDeepDive } from '../components/ui/TechnicalDeepDive';

interface Chapter5PageProps {
  onNavigate: (tab: NavigationTab) => void;
  onSelectChapter?: (chapterNumber: string) => void;
}

export const Chapter5Page: React.FC<Chapter5PageProps> = ({ onNavigate, onSelectChapter }) => {
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
    'What components constitute a complete Transformer block and how they fit together.',
    'What happens to token representations immediately after multi-head self-attention.',
    'Why residual connections exist and how they provide an unattenuated identity gradient highway.',
    'How Layer Normalization and RMSNorm stabilize activations across deep layers.',
    'What a position-wise Feed-Forward Network does and why it acts as associative factual memory.',
    'Why non-linear activation functions (ReLU, GELU, SwiGLU) prevent mathematical collapse.',
    'Why modern LLMs (LLaMA, GPT-3, Gemma) transitioned from Post-LN to Pre-LN.',
    'How stacking 32 to 80 Transformer blocks builds hierarchical semantic abstractions.',
    'The architectural distinction between Decoder-only, Encoder-only, and Encoder-Decoder topologies.',
  ];

  return (
    <div className="relative pb-24">
      {/* Chapter Editorial Header */}
      <section className="pt-12 sm:pt-20 pb-10 border-b border-[#e6e0d4] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#0c0d0e]">
        <Container size="narrow">
          <ChapterHeaderNav
            chapterNumber="05"
            chapterTitle="Inside a Transformer"
            chapterSubtitle="Attention is only one part of the architecture. Explore the complete Transformer block."
            readTime="22 min read"
            onNavigate={onNavigate}
            scrollProgress={scrollProgress}
            prevChapter={{ number: '04', tab: 'chapter-4', title: 'The Attention Mechanism' }}
            nextChapter={{ number: '06', tab: 'chapter-6', title: 'How LLMs Generate Text' }}
            playgroundTab="transformer"
            simulatorStage={5}
          />

          {/* Chapter Metadata Badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#78716c] dark:text-[#9ca3af] mb-4">
            <span className="px-2.5 py-1 rounded-sm bg-[#ece6d8] dark:bg-[#1a1c22] text-[#1c1917] dark:text-[#f3f4f6] font-semibold">
              CHAPTER 05
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>22 min read</span>
            </span>
            <span>·</span>
            <span>Architectural Anatomy</span>
            <span>·</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
              Interactive Systems
            </span>
          </div>

          {/* Main Title & Subtitle */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] tracking-tight leading-[1.15]">
            Inside a Transformer
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-[#57534e] dark:text-[#9ca3af] font-serif leading-relaxed">
            Attention is only one part of the architecture. Let's explore the components that turn it into a complete Transformer block.
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

        {/* Section 01: From Attention to a Complete Block */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] font-semibold">
              Section 01 · Architectural Context
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              From Attention to a Complete Block
            </h2>
          </div>

          <div className="space-y-4 text-base sm:text-lg text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            <p>
              In Chapter 04, we saw how Multi-Head Attention enables tokens to converse dynamically across sequence context. However, attention alone cannot build a functioning Large Language Model. Attention is fundamentally a routing and mixing mechanism: it rearranges and combines existing vectors, but does not add non-linear expressive capacity or maintain representation stability across dozens of layers.
            </p>
            <p>
              To construct a modern Transformer block, attention must be augmented with three essential structural partners:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-[#1c1917] dark:text-[#f3f4f6]">
              <li>
                <strong>Residual Connections (Skip Connections):</strong> Element-wise addition that preserves the identity representation and creates an uninterrupted gradient highway back to early layers.
              </li>
              <li>
                <strong>Normalization Layers (RMSNorm / LayerNorm):</strong> Feature scaling that prevents activation values from exploding or vanishing as representations circulate through deep networks.
              </li>
              <li>
                <strong>Position-wise Feed-Forward Networks (FFN / MLP):</strong> A two-layer non-linear neural network that processes each token independently, acting as an associative memory store of factual knowledge.
              </li>
            </ul>
          </div>

          {/* Interactive Block Diagram */}
          <TransformerBlockDiagram />

          <TechnicalDeepDive
            title="The Pre-Norm Transformer Block (RMSNorm + Residual + FFN)"
            subtitle="Architectural Anatomy · 5 Fundamental Questions"
            formula="\mathbf{x}_{\text{mid}} = \mathbf{x}_l + \text{Attn}(\text{RMSNorm}(\mathbf{x}_l)), \quad \mathbf{x}_{l+1} = \mathbf{x}_{\text{mid}} + \text{FFN}(\text{RMSNorm}(\mathbf{x}_{\text{mid}}))"
            tensorShapes={{
              input: "Hidden state matrix X_l of shape [seq_len, d_model]",
              output: "Refined hidden state matrix X_{l+1} of shape [seq_len, d_model]",
              weights: "Attention W_Q,W_K,W_V,W_O + FFN W_1 [d_model, d_ff], W_2 [d_ff, d_model] + RMSNorm γ",
            }}
            anatomy={{
              whatIsHappening: "The input stream is normalized via RMSNorm, passed into Multi-Head Self-Attention, and added back to the unperturbed input via a residual shortcut. This intermediate representation is again normalized via RMSNorm, expanded through a two-layer non-linear Feed-Forward Network (SiLU/SwiGLU), and added back to the residual highway.",
              whyIsItNeeded: "Attention alone is a weighted linear combination; without non-linear Feed-Forward layers, stacking 100 attention layers would collapse into a single linear projection. Furthermore, without Residual Connections and Pre-RMSNorm, gradients would vanish or explode across deep stacks.",
              whatGoesIn: "An input activation tensor X_l ∈ ℝ^{seq_len × d_model} from the previous block (or positional embedding layer).",
              whatComesOut: "An identically shaped tensor X_{l+1} ∈ ℝ^{seq_len × d_model} enriched with both cross-token context (from Attention) and retrieved factual associations (from the FFN).",
              whatToNotice: "Notice the difference between RMSNorm and LayerNorm: standard LayerNorm subtracts the mean μ and divides by standard deviation σ, whereas RMSNorm omits mean subtraction entirely and scales solely by √(1/d Σ x_i² + ε). Our simulator and modern LLMs (LLaMA, Mistral, Gemma) use RMSNorm for faster, equally stable training.",
            }}
            technicalNote="Because every Transformer block preserves the exact tensor shape [seq_len, d_model], blocks are modular and can be stacked 32, 80, or 120 times in sequence."
          />
        </section>

        {/* Section 02: The Residual Connection */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] font-semibold">
              Section 02 · Identity Preservation
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              The Residual Connection: An Identity Highway
            </h2>
          </div>

          <div className="space-y-4 text-base sm:text-lg text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            <p>
              Prior to 2015, training deep neural networks with more than 20 layers was notoriously difficult. When inputs pass sequentially through layer after layer without shortcuts, gradients during backpropagation multiply exponentially. Small values rapidly vanish to zero (<code className="text-xs font-mono bg-[#ece7dc] dark:bg-[#1f2127] px-1 py-0.5 rounded">0.9^50 ≈ 0.005</code>), starving early layers of any learning signal.
            </p>
            <p>
              Kaiming He et al. (ResNet, 2015) introduced the <strong>residual connection</strong>: instead of asking a sublayer to learn the entire target mapping <code className="text-xs font-mono bg-[#ece7dc] dark:bg-[#1f2127] px-1 py-0.5 rounded">y = F(x)</code>, the sublayer only learns an incremental refinement delta:
            </p>
            <div className="p-3 bg-[#faf8f5] dark:bg-[#181a1f] rounded-lg border border-[#ece7dc] dark:border-[#26282f] text-center font-mono text-sm text-[#1c1917] dark:text-[#f3f4f6]">
              y = x + F(x)
            </div>
            <p>
              When we differentiate with respect to input <code className="text-xs font-mono bg-[#ece7dc] dark:bg-[#1f2127] px-1 py-0.5 rounded">x</code>, the derivative is <code className="text-xs font-mono bg-[#ece7dc] dark:bg-[#1f2127] px-1 py-0.5 rounded">dy/dx = I + dF/dx</code>. The identity matrix <code className="text-xs font-mono bg-[#ece7dc] dark:bg-[#1f2127] px-1 py-0.5 rounded">I</code> ensures that even if <code className="text-xs font-mono bg-[#ece7dc] dark:bg-[#1f2127] px-1 py-0.5 rounded">dF/dx</code> approaches zero, a clean gradient of magnitude 1 flows straight through the residual backbone unattenuated.
            </p>
          </div>

          {/* Interactive Residual Simulator */}
          <ResidualConnectionSimulator />
        </section>

        {/* Section 03: Layer Normalization & RMSNorm */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] font-semibold">
              Section 03 · Feature Stabilization
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              Layer Normalization & RMSNorm
            </h2>
          </div>

          <div className="space-y-4 text-base sm:text-lg text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            <p>
              As vectors pass through repeated matrix additions and multiplications, their individual coordinate values tend to drift. Some dimensions grow disproportionately large, causing numerical saturation and erratic gradient steps.
            </p>
            <p>
              In computer vision, <em>Batch Normalization</em> stabilizes activations by computing statistics across different images in a mini-batch. But in natural language processing, sentences vary in length, and generation produces one token at a time where batch size can be 1.
            </p>
            <p>
              <strong>Layer Normalization</strong> solves this by computing mean <code className="text-xs font-mono bg-[#ece7dc] dark:bg-[#1f2127] px-1 py-0.5 rounded">μ</code> and variance <code className="text-xs font-mono bg-[#ece7dc] dark:bg-[#1f2127] px-1 py-0.5 rounded">σ²</code> across the feature dimensions <code className="text-xs font-mono bg-[#ece7dc] dark:bg-[#1f2127] px-1 py-0.5 rounded">d_model</code> of each token independently. Modern architectures like LLaMA, Mistral, and Gemma take this further with <strong>RMSNorm</strong>, omitting mean centering entirely to save 30% execution latency with zero loss in output accuracy.
            </p>
          </div>

          {/* Interactive Normalization Lab */}
          <LayerNormLaboratory />
        </section>

        {/* Section 04: The Position-Wise Feed-Forward Network */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] font-semibold">
              Section 04 · Factual Memory Banks
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              Position-Wise Feed-Forward Networks (FFN / MLP)
            </h2>
          </div>

          <div className="space-y-4 text-base sm:text-lg text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            <p>
              After multi-head attention pools context across the sequence, each token representation enters an independent <strong>Feed-Forward Network (FFN)</strong>. Unlike attention, the FFN applies the exact same weights to every position in parallel without inter-token cross-talk.
            </p>
            <p>
              The FFN expands the representation from <code className="text-xs font-mono bg-[#ece7dc] dark:bg-[#1f2127] px-1 py-0.5 rounded">d_model</code> (e.g. 4,096) to <code className="text-xs font-mono bg-[#ece7dc] dark:bg-[#1f2127] px-1 py-0.5 rounded">4 × d_model</code> (e.g. 16,384), applies a non-linear activation function, and projects back to <code className="text-xs font-mono bg-[#ece7dc] dark:bg-[#1f2127] px-1 py-0.5 rounded">d_model</code>.
            </p>
            <p>
              Why expand dimensionality? In 2021, researchers (Geva et al.) revealed that FFN layers act as <em>Key-Value associative memory banks</em>: the first projection matrix <code className="text-xs font-mono bg-[#ece7dc] dark:bg-[#1f2127] px-1 py-0.5 rounded">W_1</code> acts as pattern-matching keys, while the second projection matrix <code className="text-xs font-mono bg-[#ece7dc] dark:bg-[#1f2127] px-1 py-0.5 rounded">W_2</code> acts as values reading out factual attributes (e.g., retrieving capital cities, dates, or grammar rules) directly into the residual stream.
            </p>
          </div>

          {/* Interactive FFN Visualizer */}
          <FeedForwardNetworkVisualizer />
        </section>

        {/* Section 05: Pre-Norm vs Post-Norm */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] font-semibold">
              Section 05 · Architectural Stability
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              Pre-LayerNorm vs Post-LayerNorm
            </h2>
          </div>

          <div className="space-y-4 text-base sm:text-lg text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            <p>
              The original 2017 Transformer used <strong>Post-LN</strong>, placing the normalization layer after the residual sum. While theoretically elegant, Post-LN rescales the residual stream at every single layer, forcing gradients near input layers to vanish as depth increases. Early researchers were forced to design complex learning rate warmup schedules lasting tens of thousands of steps to prevent models from immediately diverging.
            </p>
            <p>
              Today, virtually all frontier LLMs adopt <strong>Pre-LN</strong> (or Pre-RMSNorm). By normalizing only the inputs to each sublayer and leaving the residual backbone untouched, the identity gradient highway remains 100% unimpeded.
            </p>
          </div>

          {/* Interactive Pre-LN vs Post-LN Comparison */}
          <PreNormPostNormComparison />
        </section>

        {/* Section 06: Stacking Transformer Blocks */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] font-semibold">
              Section 06 · Depth & Abstraction
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              Stacking Blocks: Representation Depth
            </h2>
          </div>

          <div className="space-y-4 text-base sm:text-lg text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            <p>
              A single Transformer block transforms vectors once. Modern LLMs stack 32, 64, or even 96 identical blocks sequentially.
            </p>
            <p>
              As token vectors ascend through network depth, mechanistic interpretability studies reveal a clear hierarchical division of cognitive labor: early layers resolve local syntax and word forms; middle layers resolve long-range coreference and syntactic trees; and deep layers recall world knowledge and condition representations for next-token prediction.
            </p>
          </div>

          {/* Interactive Stack Visualizer */}
          <StackedBlocksVisualizer />
        </section>

        {/* Section 07: Transformer Architecture Families */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] font-semibold">
              Section 07 · Architectural Typologies
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              Decoder-Only, Encoder-Only, and Seq2Seq
            </h2>
          </div>

          <div className="space-y-4 text-base sm:text-lg text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            <p>
              While the Transformer family shares core components, models are structured into three distinct topologies based on attention masking and training objectives:
            </p>
          </div>

          {/* Interactive Arch Comparison */}
          <TransformerArchitecturesComparison />
        </section>

        {/* Section 08: Knowledge Checkpoint */}
        <section className="space-y-6">
          <Chapter5Checkpoint />
        </section>

        {/* Section 09: Chapter Summary & Bridge */}
        <section className="space-y-6 pt-8 border-t border-[#e6e0d4] dark:border-[#26282f]">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] font-semibold">
              Chapter Summary & Synthesis
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
              The Engine is Built. Now Let's Generate.
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            A complete Transformer block is a harmonious union: multi-head self-attention enables dynamic cross-token dialogue; residual connections guarantee safe gradient propagation through extreme depth; RMSNorm controls numerical stability; and position-wise Feed-Forward Networks act as high-capacity associative memory stores.
          </p>

          <p className="text-sm sm:text-base font-serif italic text-[#1c1917] dark:text-[#f3f4f6] leading-relaxed border-l-2 border-[#c2410c] dark:border-[#d97706] pl-4 py-1">
            "We now understand how representations are repeatedly transformed through self-attention, residual streams, layer normalization, and feed-forward networks. Let's discover how the model turns its final representation into the next token."
          </p>

          {/* Navigation Buttons */}
          <div className="pt-4 border-t border-[#ece7dc] dark:border-[#22242b] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Button
              variant="outline"
              size="md"
              icon={<ArrowLeft className="w-4 h-4" />}
              iconPosition="left"
              onClick={() => onNavigate('chapter-4')}
            >
              Previous: Chapter 04 — The Attention Mechanism
            </Button>

            <Button
              variant="editorial"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onNavigate('chapter-6')}
            >
              Continue to Chapter 06 — How LLMs Generate Text
            </Button>
          </div>
        </section>

      </Container>
    </div>
  );
};
