import React, { useState } from 'react';
import { Container } from '../components/layout/Container';
import { SectionHeader } from '../components/layout/SectionHeader';
import { Button } from '../components/ui/Button';
import { CodeBlock } from '../components/ui/MathBlock';
import { BookOpen, Copy, Check, FileText, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const bibtexCitation = `@article{insidethellm2026,
  title   = {Inside the LLM: An Interactive Science Monograph},
  author  = {The Inside the LLM Editorial Initiative},
  journal = {Computational Foundations Review},
  volume  = {1},
  year    = {2026},
  url     = {https://insidethellm.org}
}`;

  const academicPapers = [
    {
      title: 'Attention Is All You Need',
      authors: 'A. Vaswani, N. Shazeer, N. Parmar, J. Uszkoreit, L. Jones, A. N. Gomez, Ł. Kaiser, I. Polosukhin',
      year: '2017',
      venue: 'NeurIPS 2017',
      contribution: 'Introduced the Transformer architecture, replacing recurrent and convolutional layers entirely with self-attention.',
    },
    {
      title: 'Language Models are Unsupervised Multitask Learners',
      authors: 'A. Radford, J. Wu, R. Child, D. Luan, D. Amodei, I. Sutskever',
      year: '2019',
      venue: 'OpenAI Technical Report',
      contribution: 'Demonstrated that scaling decoder-only models trained on next-token prediction yields zero-shot task transfer.',
    },
    {
      title: 'RoFormer: Enhanced Transformer with Rotary Position Embedding',
      authors: 'J. Su, Y. Lu, S. Pan, A. Murtadha, B. Wen, Y. Liu',
      year: '2021',
      venue: 'Neurocomputing 2024',
      contribution: 'Formulated Rotary Position Embeddings (RoPE), rotating key and query vectors in complex sub-planes to encode relative distances.',
    },
    {
      title: 'LLaMA: Open and Efficient Foundation Language Models',
      authors: 'H. Touvron, T. Lavril, G. Izacard, X. Martinet, M.-A. Lachaux, T. Lacroix, et al.',
      year: '2023',
      venue: 'Meta AI Technical Report',
      contribution: 'Demonstrated competitive open-weights architectures using RMSNorm, SwiGLU activations, and rotary embeddings.',
    },
    {
      title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness',
      authors: 'T. Dao, D. Y. Fu, S. Ermon, A. Rudra, C. Ré',
      year: '2022',
      venue: 'NeurIPS 2022',
      contribution: 'Tiled exact softmax attention across GPU SRAM hierarchies to overcome the quadratic memory bottleneck without approximation.',
    },
  ];

  return (
    <div className="py-10 sm:py-16 space-y-14 sm:space-y-20">
      <Container>
        {/* Header */}
        <div className="max-w-3xl pb-8 border-b border-[#e6e0d4] dark:border-[#26282f]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#c2410c] dark:text-[#d97706] mb-2 font-semibold">
            <span>COLOPHON & METHODOLOGY</span>
            <span>·</span>
            <span>OPEN SCIENCE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] tracking-tight">
            About Inside the LLM
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            A peer-grade educational publication dedicated to demystifying the computational geometry, linear algebra, and software systems powering modern generative models.
          </p>
        </div>

        {/* Editorial Mission Prose */}
        <div className="max-w-prose space-y-6 text-[#44403c] dark:text-[#d1d5db] text-base sm:text-lg leading-relaxed pt-6">
          <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-medium first-letter:text-[#1c1917] dark:first-letter:text-[#f3f4f6] first-letter:float-left first-letter:mr-3 first-letter:mt-1">
            Modern machine learning is too often explained through either impenetrable equations in academic PDFs or superficial hand-waving metaphors in consumer tech media. Between the raw mathematical proofs and the casual analogies lies an enormous gap: the mechanical and geometric intuition of how information actually flows.
          </p>
          <p>
            <em>Inside the LLM</em> was founded to bridge that chasm. Inspired by the interactive publication standards of <span className="text-[#1c1917] dark:text-[#f3f4f6] font-medium">Distill.pub</span> and the curatorial elegance of <span className="text-[#1c1917] dark:text-[#f3f4f6] font-medium">Stripe Press</span>, we build explorable explanations where every theorem is paired with a manipulable simulation.
          </p>
          <p>
            We reject synthetic marketing gradients, fake AI buzzwords, and hand-waving anthropomorphism. A transformer is not an "oracle" or a "brain" — it is an autoregressive sequence model computing linear transformations, parameterized activations, and categorical softmax distributions over a discrete vocabulary.
          </p>
        </div>

        {/* Scientific Methodology & Mathematical Honesty */}
        <div className="mt-16 pt-10 border-t border-[#e6e0d4] dark:border-[#26282f]">
          <SectionHeader
            kicker="Scientific Transparency"
            title="Mathematical Scope & Simulation Architecture"
            description="What our interactive laboratories execute in real time, and how educational parameters differ from multi-billion-parameter production models."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
            <div className="p-5 bg-white dark:bg-[#141518] rounded-xl border border-[#e6e0d4] dark:border-[#26282f] space-y-2">
              <div className="font-mono text-xs uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
                1. Authentic GPT-2 BPE Tokenization
              </div>
              <p className="text-[#57534e] dark:text-[#d1d5db] leading-relaxed">
                All tokenizers across Chapter 01, the Playground, and Stage 01 of the Simulator run the exact <strong>GPT-2 R50K Byte-Pair Encoding</strong> vocabulary (<code className="font-mono">|V| = 50,257</code>, valid IDs <code className="font-mono">0–50,256</code>, with <code className="font-mono">&lt;|endoftext|&gt; = 50256</code>).
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-[#141518] rounded-xl border border-[#e6e0d4] dark:border-[#26282f] space-y-2">
              <div className="font-mono text-xs uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
                2. Deterministic Educational Weights
              </div>
              <p className="text-[#57534e] dark:text-[#d1d5db] leading-relaxed">
                Rather than loading gigabytes of opaque pretrained weights (or reproducing proprietary systems like ChatGPT), the simulator uses compact, deterministic educational parameters (<code className="font-mono">d_model = 8, d_ff = 16</code>) so every matrix entry can be read and verified by hand.
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-[#141518] rounded-xl border border-[#e6e0d4] dark:border-[#26282f] space-y-2">
              <div className="font-mono text-xs uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
                3. Pre-RMSNorm & Sinusoidal Coordinates
              </div>
              <p className="text-[#57534e] dark:text-[#d1d5db] leading-relaxed">
                The simulator implements canonical Vaswani sinusoidal positional encodings paired with a modern <strong>Pre-RMSNorm</strong> Transformer block (<code className="font-mono">RMSNorm → Attention → Residual → RMSNorm → FFN (SiLU) → Residual</code>), explicitly distinguishing root-mean-square scaling from mean-centered LayerNorm.
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-[#141518] rounded-xl border border-[#e6e0d4] dark:border-[#26282f] space-y-2">
              <div className="font-mono text-xs uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
                4. 24-Token Candidate Subset Normalization
              </div>
              <p className="text-[#57534e] dark:text-[#d1d5db] leading-relaxed">
                In Stage 06, the weight-tied language modeling head (<code className="font-mono">W_u = W_e^T</code>) projects the final hidden state onto a curated <strong>24-token candidate subset</strong> (each with its authentic GPT-2 ID) and normalizes softmax probabilities over those 24 candidates for clear visual inspection.
              </p>
            </div>
          </div>
        </div>

        {/* Bibliography Section */}
        <div className="mt-16 pt-10 border-t border-[#e6e0d4] dark:border-[#26282f]">
          <SectionHeader
            kicker="Primary Bibliography"
            title="Seminal Literature & Citations"
            description="The foundational research papers whose algorithms and mathematical formulations are explorable throughout this publication."
          />

          <div className="space-y-4">
            {academicPapers.map((paper, idx) => (
              <div
                key={idx}
                className="p-5 bg-white dark:bg-[#141518] rounded-lg border border-[#e6e0d4] dark:border-[#26282f] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 text-xs font-mono text-[#78716c] dark:text-[#9ca3af] mb-1">
                  <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
                    [{idx + 1}] {paper.venue}
                  </span>
                  <span>{paper.year}</span>
                </div>
                <h4 className="font-serif text-lg font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
                  {paper.title}
                </h4>
                <p className="text-xs text-[#78716c] dark:text-[#9ca3af] mt-1">
                  {paper.authors}
                </p>
                <p className="text-xs sm:text-sm text-[#57534e] dark:text-[#d1d5db] mt-2 leading-relaxed">
                  {paper.contribution}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* BibTeX Citation Box */}
        <div className="mt-16 pt-10 border-t border-[#e6e0d4] dark:border-[#26282f]">
          <SectionHeader
            kicker="Academic Attribution"
            title="Cite This Publication"
            description="For educators, researchers, and engineers referencing Inside the LLM in syllabi, technical reports, or publications."
          />

          <CodeBlock
            caption="BibTeX Entry"
            language="bibtex"
            code={bibtexCitation}
          />
        </div>
      </Container>
    </div>
  );
};
