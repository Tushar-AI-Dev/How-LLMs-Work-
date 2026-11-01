import React, { useState } from 'react';
import { CHAPTERS_DATA } from '../../data/chaptersData';
import { Chapter } from '../../types';
import { ChapterCard } from './ChapterCard';
import { SectionHeader } from '../layout/SectionHeader';
import { X, BookOpen, Clock, Calculator, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { LatexRenderer } from '../ui/LatexRenderer';

interface ChapterRoadmapProps {
  onStartChapter?: (chapter: Chapter) => void;
}

export const ChapterRoadmap: React.FC<ChapterRoadmapProps> = ({ onStartChapter }) => {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  const handleSelect = (chapter: Chapter) => {
    setSelectedChapter(chapter);
  };

  const handleClose = () => {
    setSelectedChapter(null);
  };

  return (
    <section id="chapters" className="my-16 sm:my-24">
      <SectionHeader
        kicker="The Six Core Pillars"
        title="Curriculum & Architectural Roadmap"
        description="A structured pedagogical progression from discrete characters to high-dimensional geometry, self-attention routing, and probabilistic decoding."
      />

      {/* Grid of the 6 Learning Chapters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CHAPTERS_DATA.map((chapter, index) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            index={index}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Detail Modal / Drawer for Chapter Syllabus */}
      {selectedChapter && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs"
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-2xl bg-white dark:bg-[#15161a] border border-[#e6e0d4] dark:border-[#2a2d36] rounded-xl shadow-2xl overflow-hidden p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#ece7dc] dark:border-[#26282f]">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#c2410c] dark:text-[#d97706] mb-1">
                  <span>CHAPTER {selectedChapter.number}</span>
                  <span>·</span>
                  <span className="text-[#78716c] dark:text-[#9ca3af]">{selectedChapter.readingTime} read</span>
                </div>
                <h3 className="text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
                  {selectedChapter.title}
                </h3>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close chapter details"
                className="p-1.5 rounded-md text-[#78716c] hover:text-[#1c1917] dark:text-[#9ca3af] dark:hover:text-[#f3f4f6] hover:bg-[#f4efe6] dark:hover:bg-[#1f2127] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-5 space-y-5 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] mb-1.5">
                  Overview
                </h4>
                <p className="text-sm sm:text-base text-[#44403c] dark:text-[#d1d5db] leading-relaxed">
                  {selectedChapter.chapterOverview}
                </p>
              </div>

              {/* Mathematical Equation */}
              {selectedChapter.coreEquation && (
                <div className="p-4 bg-[#faf8f5] dark:bg-[#191a20] rounded-lg border border-[#ece7dc] dark:border-[#26282f]">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#78716c] dark:text-[#9ca3af] mb-2">
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Governing Mathematical Law</span>
                  </div>
                  <div className="text-sm sm:text-base text-[#1c1917] dark:text-[#f3f4f6] p-3 bg-white dark:bg-[#101114] rounded border border-[#ece7dc] dark:border-[#22242b] overflow-x-auto flex items-center justify-center">
                    <LatexRenderer math={selectedChapter.coreEquation.latex} displayMode={true} />
                  </div>
                  <p className="mt-2 text-xs text-[#78716c] dark:text-[#9ca3af]">
                    {selectedChapter.coreEquation.description}
                  </p>
                </div>
              )}

              {/* Key Concepts */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] mb-2.5">
                  Learning Objectives & Syllabus
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedChapter.keyConcepts.map((concept, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2.5 bg-[#fbf9f5] dark:bg-[#18191f] rounded border border-[#ece7dc] dark:border-[#26282f] text-xs text-[#44403c] dark:text-[#d1d5db]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#c2410c] dark:text-[#d97706] shrink-0 mt-0.5" />
                      <span>{concept}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prerequisites & Interactive Simulation Model */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] mb-1.5">
                    Prerequisites
                  </h4>
                  <ul className="text-xs text-[#78716c] dark:text-[#9ca3af] space-y-1">
                    {selectedChapter.mathematicalPrerequisites.map((prereq, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#78716c]" />
                        <span>{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] mb-1.5">
                    Interactive Engine
                  </h4>
                  <p className="text-xs font-mono text-[#c2410c] dark:text-[#d97706]">
                    {selectedChapter.visualModelType}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#ece7dc] dark:border-[#26282f] flex items-center justify-between">
              <span className="text-xs text-[#78716c] dark:text-[#9ca3af]">
                Publication Edition · 2026
              </span>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={handleClose}>
                  Close
                </Button>
                {selectedChapter.status === 'available' ? (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<ArrowRight className="w-3.5 h-3.5" />}
                    onClick={() => {
                      if (onStartChapter) onStartChapter(selectedChapter);
                      handleClose();
                    }}
                  >
                    Open Interactive Model
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" disabled>
                    Drafting Review
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
