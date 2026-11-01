import React, { useState } from 'react';
import { NavigationTab } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  onScrollToJourney?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onScrollToJourney,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleExploreClick = () => {
    if (currentTab !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        onScrollToJourney?.();
      }, 100);
    } else {
      onScrollToJourney?.();
    }
    setMobileMenuOpen(false);
  };

  const handleNavClick = (tab: NavigationTab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#faf8f5]/90 dark:bg-[#0c0d0e]/90 backdrop-blur-md border-b border-[#e6e0d4] dark:border-[#26282f] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Left: INSIDE THE LLM (wordmark) + subtle descriptor */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c2410c] dark:focus-visible:ring-[#d97706] rounded"
            >
              <div className="flex items-baseline gap-2.5">
                <span className="font-serif font-bold text-base sm:text-lg tracking-tight text-[#1c1917] dark:text-[#f3f4f6] group-hover:text-[#c2410c] dark:group-hover:text-[#d97706] transition-colors whitespace-nowrap">
                  INSIDE THE LLM
                </span>
                <span className="hidden md:inline-block text-[11px] text-[#78716c] dark:text-[#9ca3af] border-l border-[#d6cfc0] dark:border-[#2a2d36] pl-2.5 tracking-normal font-sans">
                  An interactive guide to language models.
                </span>
              </div>
            </button>
          </div>

          {/* Right: Explore · Playground · About · Theme toggle */}
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium">
              <button
                onClick={handleExploreClick}
                className={`py-1 whitespace-nowrap transition-colors cursor-pointer ${
                  currentTab === 'home'
                    ? 'text-[#1c1917] dark:text-[#f3f4f6] font-semibold'
                    : 'text-[#78716c] hover:text-[#1c1917] dark:text-[#9ca3af] dark:hover:text-[#f3f4f6]'
                }`}
              >
                Overview
              </button>

              <button
                onClick={() => handleNavClick('learn')}
                className={`py-1 whitespace-nowrap transition-colors cursor-pointer ${
                  ['learn', 'chapter-1', 'chapter-2', 'chapter-3', 'chapter-4', 'chapter-5', 'chapter-6'].includes(currentTab)
                    ? 'text-[#c2410c] dark:text-[#d97706] font-semibold'
                    : 'text-[#78716c] hover:text-[#1c1917] dark:text-[#9ca3af] dark:hover:text-[#f3f4f6]'
                }`}
              >
                Chapters
              </button>

              <button
                onClick={() => handleNavClick('simulator')}
                className={`py-1 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'simulator'
                    ? 'text-[#c2410c] dark:text-[#d97706] font-semibold'
                    : 'text-[#78716c] hover:text-[#1c1917] dark:text-[#9ca3af] dark:hover:text-[#f3f4f6]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#c2410c] dark:bg-[#d97706]" />
                <span>Simulator</span>
              </button>

              <button
                onClick={() => handleNavClick('playground')}
                className={`py-1 whitespace-nowrap transition-colors cursor-pointer ${
                  currentTab === 'playground'
                    ? 'text-[#1c1917] dark:text-[#f3f4f6] font-semibold'
                    : 'text-[#78716c] hover:text-[#1c1917] dark:text-[#9ca3af] dark:hover:text-[#f3f4f6]'
                }`}
              >
                Playground
              </button>

              <button
                onClick={() => handleNavClick('about')}
                className={`py-1 whitespace-nowrap transition-colors cursor-pointer ${
                  currentTab === 'about'
                    ? 'text-[#1c1917] dark:text-[#f3f4f6] font-semibold'
                    : 'text-[#78716c] hover:text-[#1c1917] dark:text-[#9ca3af] dark:hover:text-[#f3f4f6]'
                }`}
              >
                About
              </button>
            </nav>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-md text-[#78716c] hover:text-[#1c1917] dark:text-[#9ca3af] dark:hover:text-[#f3f4f6] hover:bg-[#ece7dc] dark:hover:bg-[#1a1c22] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c2410c] dark:focus-visible:ring-[#d97706]"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 rounded-md text-[#78716c] hover:text-[#1c1917] dark:text-[#9ca3af] dark:hover:text-[#f3f4f6] hover:bg-[#ece7dc] dark:hover:bg-[#1a1c22] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#ece7dc] dark:border-[#26282f] space-y-2">
            <div className="px-3 pb-2 text-[11px] text-[#78716c] dark:text-[#9ca3af]">
              An interactive guide to language models.
            </div>
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'home'
                  ? 'bg-[#ece7dc] text-[#1c1917] dark:bg-[#1f2127] dark:text-[#f3f4f6] font-semibold'
                  : 'text-[#78716c] hover:text-[#1c1917] dark:text-[#9ca3af] dark:hover:text-[#f3f4f6]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => handleNavClick('learn')}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                ['learn', 'chapter-1', 'chapter-2', 'chapter-3', 'chapter-4', 'chapter-5', 'chapter-6'].includes(currentTab)
                  ? 'bg-[#ece7dc] text-[#c2410c] dark:bg-[#1f2127] dark:text-[#d97706] font-semibold'
                  : 'text-[#78716c] hover:text-[#1c1917] dark:text-[#9ca3af] dark:hover:text-[#f3f4f6]'
              }`}
            >
              Chapters (1–6)
            </button>
            <button
              onClick={() => handleNavClick('simulator')}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'simulator'
                  ? 'bg-[#ece7dc] text-[#c2410c] dark:bg-[#1f2127] dark:text-[#d97706] font-semibold'
                  : 'text-[#78716c] hover:text-[#1c1917] dark:text-[#9ca3af] dark:hover:text-[#f3f4f6]'
              }`}
            >
              The LLM Simulator
            </button>
            <button
              onClick={() => handleNavClick('playground')}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'playground'
                  ? 'bg-[#ece7dc] text-[#1c1917] dark:bg-[#1f2127] dark:text-[#f3f4f6]'
                  : 'text-[#78716c] hover:text-[#1c1917] dark:text-[#9ca3af] dark:hover:text-[#f3f4f6]'
              }`}
            >
              Playground
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'about'
                  ? 'bg-[#ece7dc] text-[#1c1917] dark:bg-[#1f2127] dark:text-[#f3f4f6]'
                  : 'text-[#78716c] hover:text-[#1c1917] dark:text-[#9ca3af] dark:hover:text-[#f3f4f6]'
              }`}
            >
              About
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
