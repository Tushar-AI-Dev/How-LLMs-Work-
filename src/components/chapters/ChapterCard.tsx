import React from 'react';
import { Chapter } from '../../types';
import { ArrowRight, Clock, BookOpen, Layers } from 'lucide-react';
import { LatexRenderer } from '../ui/LatexRenderer';

interface ChapterCardProps {
  chapter: Chapter;
  onSelect: (chapter: Chapter) => void;
  index: number;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, onSelect }) => {
  const isAvailable = chapter.status === 'available';

  return (
    <article
      onClick={() => onSelect(chapter)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(chapter);
        }
      }}
      className={`
        group relative flex flex-col justify-between
        bg-white dark:bg-[#141518]
        border border-[#e6e0d4] dark:border-[#26282f]
        hover:border-[#cfc6b5] dark:hover:border-[#3a3e49]
        rounded-lg p-6 sm:p-7 transition-all duration-150 cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c2410c] dark:focus-visible:ring-[#d97706]
      `}
    >
      <div>
        {/* Top bar metadata: clean unboxed typographic separator */}
        <div className="flex items-center justify-between gap-3 text-xs text-[#78716c] dark:text-[#9ca3af] mb-4">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-[#c2410c] dark:text-[#d97706] font-semibold text-sm">
              {chapter.number}
            </span>
            <span aria-hidden="true" className="text-[#a8a29e] dark:text-[#52525b]">/</span>
            <span>CHAPTER</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#a8a29e] dark:text-[#6b7280]" />
              <span>{chapter.readingTime}</span>
            </div>
            <span aria-hidden="true" className="text-[#a8a29e] dark:text-[#52525b]">·</span>
            <span className={`text-[11px] uppercase tracking-wider font-mono ${
              chapter.status === 'available'
                ? 'text-emerald-700 dark:text-emerald-400 font-medium'
                : chapter.status === 'in-development'
                ? 'text-amber-700 dark:text-amber-400 font-medium'
                : 'text-stone-500 dark:text-stone-400'
            }`}>
              {chapter.status === 'available' ? 'Interactive' : chapter.status === 'in-development' ? 'In Review' : 'Planned'}
            </span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-xl sm:text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] group-hover:text-[#c2410c] dark:group-hover:text-[#d97706] transition-colors leading-snug">
          {chapter.title}
        </h3>
        <p className="mt-2 text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          {chapter.subtitle}
        </p>

        {/* Core Mathematical Equation Preview rendered with KaTeX */}
        {chapter.coreEquation && (
          <div className="mt-4 p-2.5 bg-[#faf8f5] dark:bg-[#181a1f] rounded border border-[#ece7dc] dark:border-[#26282f] text-xs text-[#1c1917] dark:text-[#f3f4f6] overflow-x-auto flex items-center justify-center min-h-[38px]">
            <LatexRenderer math={chapter.coreEquation.latex} />
          </div>
        )}

        {/* Key Concepts List */}
        <div className="mt-5 space-y-1.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#a8a29e] dark:text-[#6b7280]">
            Core Concepts
          </div>
          <ul className="text-xs text-[#57534e] dark:text-[#9ca3af] space-y-1">
            {chapter.keyConcepts.slice(0, 3).map((concept, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#c2410c] dark:bg-[#d97706] shrink-0" />
                <span className="truncate">{concept}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-6 pt-4 border-t border-[#ece7dc] dark:border-[#22242b] flex items-center justify-between text-xs font-medium">
        <span className="text-[#78716c] dark:text-[#9ca3af] font-mono text-[11px]">
          Model: {chapter.visualModelType.split(' ')[0]}
        </span>
        <div className="flex items-center gap-1.5 text-[#c2410c] dark:text-[#d97706] group-hover:translate-x-0.5 transition-transform">
          <span>{isAvailable ? 'Explore Chapter' : 'View Syllabus'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </article>
  );
};
