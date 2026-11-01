import React from 'react';
import { NavigationTab } from '../../types';
import { Clock, ArrowLeft, ArrowRight, Play, Sparkles } from 'lucide-react';

interface ChapterHeaderNavProps {
  chapterNumber: string;
  chapterTitle: string;
  chapterSubtitle: string;
  readTime: string;
  onNavigate: (tab: NavigationTab) => void;
  scrollProgress: number;
  prevChapter?: { number: string; tab: NavigationTab; title: string };
  nextChapter?: { number: string; tab: NavigationTab; title: string };
  playgroundTab?: 'tokenizer' | 'embeddings' | 'positional' | 'attention' | 'transformer' | 'generation';
  simulatorStage?: number;
}

export const ChapterHeaderNav: React.FC<ChapterHeaderNavProps> = ({
  chapterNumber,
  chapterTitle,
  chapterSubtitle,
  readTime,
  onNavigate,
  scrollProgress,
  prevChapter,
  nextChapter,
  playgroundTab,
  simulatorStage,
}) => {
  return (
    <>
      {/* Reading Progress Indicator Bar */}
      <div
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Reading progress for Chapter ${chapterNumber}`}
        className="fixed top-16 left-0 right-0 h-[3px] bg-transparent z-30"
      >
        <div
          className="h-full bg-[#c2410c] dark:bg-[#d97706] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Chapter Stepper & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#e6e0d4] dark:border-[#26282f] text-xs font-mono">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[#78716c] dark:text-[#9ca3af]">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-[#1c1917] dark:hover:text-[#f3f4f6] transition-colors cursor-pointer"
          >
            Inside the LLM
          </button>
          <span aria-hidden="true">/</span>
          <button
            onClick={() => onNavigate('learn')}
            className="hover:text-[#1c1917] dark:hover:text-[#f3f4f6] transition-colors cursor-pointer"
          >
            Chapters
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-[#c2410c] dark:text-[#d97706] font-semibold">
            Chapter {chapterNumber}
          </span>
        </nav>

        {/* Quick Stepper + Quick Jumps */}
        <div className="flex items-center gap-2">
          {prevChapter && (
            <button
              onClick={() => onNavigate(prevChapter.tab)}
              title={`Go to Chapter ${prevChapter.number}: ${prevChapter.title}`}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-[#16171b] border border-[#ded7ca] dark:border-[#282a32] text-[#57534e] dark:text-[#9ca3af] hover:text-[#1c1917] dark:hover:text-[#f3f4f6] transition-colors cursor-pointer text-xs"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Ch {prevChapter.number}</span>
            </button>
          )}

          {nextChapter && (
            <button
              onClick={() => onNavigate(nextChapter.tab)}
              title={`Go to Chapter ${nextChapter.number}: ${nextChapter.title}`}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-[#16171b] border border-[#ded7ca] dark:border-[#282a32] text-[#57534e] dark:text-[#9ca3af] hover:text-[#1c1917] dark:hover:text-[#f3f4f6] transition-colors cursor-pointer text-xs font-medium"
            >
              <span>Ch {nextChapter.number}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          {playgroundTab && (
            <button
              onClick={() => onNavigate('playground')}
              title="Open relevant experiment in The LLM Playground"
              className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded bg-[#faf8f5] dark:bg-[#1f2127] border border-[#ded7ca] dark:border-[#282a32] text-[#c2410c] dark:text-[#d97706] hover:bg-[#ece7dc] dark:hover:bg-[#282a32] transition-colors cursor-pointer text-xs"
            >
              <Sparkles className="w-3 h-3" />
              <span>Playground</span>
            </button>
          )}

          {simulatorStage && (
            <button
              onClick={() => onNavigate('simulator')}
              title={`Inspect Stage ${simulatorStage} in The LLM Simulator`}
              className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded bg-[#c2410c]/10 dark:bg-[#d97706]/15 border border-[#c2410c]/30 dark:border-[#d97706]/30 text-[#c2410c] dark:text-[#d97706] hover:bg-[#c2410c]/20 transition-colors cursor-pointer text-xs font-semibold"
            >
              <Play className="w-3 h-3" />
              <span>Simulator Stage {simulatorStage}</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};
