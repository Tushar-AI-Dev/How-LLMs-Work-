import React from 'react';
import { Container } from '../components/layout/Container';
import { HeroVisualization } from '../components/hero/HeroVisualization';
import { LearningJourney } from '../components/journey/LearningJourney';
import { InteractivePreviewSection } from '../components/interactive/InteractivePreviewSection';
import { Button } from '../components/ui/Button';
import { NavigationTab, Chapter } from '../types';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: NavigationTab) => void;
  onSelectChapter: (chapterNumber: string) => void;
  onScrollToJourney: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectChapter,
  onScrollToJourney,
}) => {
  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="pt-12 sm:pt-20 pb-4">
        <Container>
          {/* Subtle Curatorial Kicker */}
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] mb-4 font-semibold">
            <span>Interactive Science Monograph</span>
            <span aria-hidden="true" className="text-[#a8a29e] dark:text-[#52525b]">·</span>
            <span>Volume I</span>
          </div>

          {/* Main Hero Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-medium tracking-tight text-[#1c1917] dark:text-[#f3f4f6] leading-[1.1] text-balance max-w-4xl">
            Understand what happens inside a language model.
          </h1>

          {/* Supporting Text */}
          <p className="mt-6 text-lg sm:text-xl text-[#57534e] dark:text-[#9ca3af] leading-relaxed max-w-3xl">
            From the first token to the final prediction, explore the mechanisms that allow LLMs to understand and generate language.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              variant="editorial"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={onScrollToJourney}
            >
              Explore the journey
            </Button>
            <Button
              variant="primary"
              size="lg"
              icon={<Sparkles className="w-4 h-4" />}
              onClick={() => onNavigate('simulator')}
            >
              Run the simulator
            </Button>
            <Button
              variant="outline"
              size="lg"
              icon={<Compass className="w-4 h-4" />}
              onClick={() => onNavigate('playground')}
            >
              Playground
            </Button>
          </div>

          {/* Hero Animated Visualization */}
          <HeroVisualization />
        </Container>
      </section>

      {/* Learning Journey Section (The 6 Chapters with Custom Illustrations) */}
      <Container>
        <LearningJourney onSelectChapter={onSelectChapter} />
      </Container>

      {/* Interactive Micro-Labs / Previews Section */}
      <Container>
        <InteractivePreviewSection />
      </Container>
    </div>
  );
};
