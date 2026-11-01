export type NavigationTab = 'home' | 'learn' | 'simulator' | 'playground' | 'about' | 'chapter-1' | 'chapter-2' | 'chapter-3' | 'chapter-4' | 'chapter-5' | 'chapter-6';

export type ChapterStatus = 'available' | 'in-development' | 'planned';

export interface Chapter {
  id: number;
  number: string;
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  readingTime: string;
  mathematicalPrerequisites: string[];
  coreEquation?: {
    latex: string;
    description: string;
  };
  keyConcepts: string[];
  status: ChapterStatus;
  visualModelType: string;
  chapterOverview: string;
}

export interface ModelSpec {
  name: string;
  creator: string;
  parameters: string;
  layers: number;
  hiddenDim: number;
  heads: number;
  vocabSize: number;
  contextWindow: number;
}
