import React from 'react';
import { NavigationTab } from '../../types';
import { Container } from './Container';

interface FooterProps {
  onNavigate: (tab: NavigationTab) => void;
  onScrollToJourney?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onScrollToJourney }) => {
  const handleExploreClick = () => {
    onNavigate('home');
    setTimeout(() => {
      onScrollToJourney?.();
    }, 100);
  };

  return (
    <footer className="border-t border-[#e6e0d4] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#0c0d0e] transition-colors py-12 sm:py-16 mt-24">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#ece7dc] dark:border-[#22242b]">
          {/* Left: INSIDE THE LLM + Short project description */}
          <div className="md:col-span-7 space-y-3">
            <h3 className="font-serif text-lg font-bold tracking-tight text-[#1c1917] dark:text-[#f3f4f6]">
              INSIDE THE LLM
            </h3>
            <p className="text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed max-w-md">
              A premium, interactive educational publication explaining how Large Language Models work, from raw text input to next-token prediction.
            </p>
          </div>

          {/* Right: Explore chapters, Playground, About */}
          <div className="md:col-span-5 md:flex md:justify-end">
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af]">
                Index & Navigation
              </h4>
              <ul className="space-y-2 text-sm text-[#57534e] dark:text-[#9ca3af]">
                <li>
                  <button
                    onClick={handleExploreClick}
                    className="hover:text-[#1c1917] dark:hover:text-[#f3f4f6] transition-colors cursor-pointer"
                  >
                    Explore chapters
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('playground')}
                    className="hover:text-[#1c1917] dark:hover:text-[#f3f4f6] transition-colors cursor-pointer"
                  >
                    Playground
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('about')}
                    className="hover:text-[#1c1917] dark:hover:text-[#f3f4f6] transition-colors cursor-pointer"
                  >
                    About
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom row: Subtle closing statement */}
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#78716c] dark:text-[#9ca3af]">
          <div>
            © 2026 INSIDE THE LLM. An open-access interactive science publication.
          </div>
          <div className="font-serif italic text-sm text-[#44403c] dark:text-[#d1d5db]">
            "Built to make the complex understandable."
          </div>
        </div>
      </Container>
    </footer>
  );
};
