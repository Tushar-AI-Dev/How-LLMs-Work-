import React, { useState } from 'react';
import { Container } from '../components/layout/Container';
import { SectionHeader } from '../components/layout/SectionHeader';
import { CHAPTERS_DATA } from '../data/chaptersData';
import { Chapter } from '../types';
import { ChapterCard } from '../components/chapters/ChapterCard';
import { Callout } from '../components/ui/Callout';
import { Button } from '../components/ui/Button';
import { BookOpen, Layers, GitBranch, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LearnPageProps {
  onSelectChapter: (chapter: Chapter) => void;
}

export const LearnPage: React.FC<LearnPageProps> = ({ onSelectChapter }) => {
  const [filterTrack, setFilterTrack] = useState<'all' | 'foundations' | 'architecture' | 'generation'>('all');

  const tracks = [
    { id: 'all', label: 'Complete Curriculum (6 Chapters)' },
    { id: 'foundations', label: '1. Foundations (Tokens & Vectors)' },
    { id: 'architecture', label: '2. Architecture (Attention & Blocks)' },
    { id: 'generation', label: '3. Inference (Softmax & Sampling)' },
  ];

  const filteredChapters = CHAPTERS_DATA.filter((ch) => {
    if (filterTrack === 'foundations') return ch.id === 1 || ch.id === 2;
    if (filterTrack === 'architecture') return ch.id === 3 || ch.id === 4 || ch.id === 5;
    if (filterTrack === 'generation') return ch.id === 6;
    return true;
  });

  return (
    <div className="py-10 sm:py-16 space-y-14 sm:space-y-20">
      <Container>
        {/* Header */}
        <div className="max-w-3xl pb-8 border-b border-[#e6e0d4] dark:border-[#26282f]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#c2410c] dark:text-[#d97706] mb-2 font-semibold">
            <span>CURRICULUM SYLLABUS</span>
            <span>·</span>
            <span>PEDAGOGICAL STRUCTURE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] tracking-tight">
            The Six Learning Chapters
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            A comprehensive, rigorous course of study covering every mechanical and mathematical stage of transformer-based large language models.
          </p>
        </div>

        {/* Track Filter Tabs (Functional segmented control per zero-pill rules) */}
        <div className="my-8 flex flex-wrap items-center gap-2">
          {tracks.map((track) => (
            <button
              key={track.id}
              onClick={() => setFilterTrack(track.id as any)}
              className={`
                px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer
                ${
                  filterTrack === track.id
                    ? 'bg-[#1c1917] text-white dark:bg-[#f3f4f6] dark:text-[#111215]'
                    : 'bg-[#f0ebe1] text-[#57534e] hover:text-[#1c1917] hover:bg-[#e4ddd0] dark:bg-[#1a1c22] dark:text-[#9ca3af] dark:hover:text-[#f3f4f6]'
                }
              `}
            >
              {track.label}
            </button>
          ))}
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChapters.map((chapter, index) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              index={index}
              onSelect={onSelectChapter}
            />
          ))}
        </div>

        {/* Pedagogical Methodology Callout */}
        <div className="mt-16">
          <Callout type="curatorial" title="Pedagogical Philosophy: Interactive First Principles">
            Each chapter pairs mathematical formulations with live interactive simulations. Rather than treating neural networks as opaque black boxes, we render the geometric activations, rotary rotations, and attention weights directly on your canvas.
          </Callout>
        </div>
      </Container>
    </div>
  );
};
