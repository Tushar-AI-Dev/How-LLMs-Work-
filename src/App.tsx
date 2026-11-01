import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { LearnPage } from './pages/LearnPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { AboutPage } from './pages/AboutPage';
import { Chapter1Page } from './pages/Chapter1Page';
import { Chapter2Page } from './pages/Chapter2Page';
import { Chapter3Page } from './pages/Chapter3Page';
import { Chapter4Page } from './pages/Chapter4Page';
import { Chapter5Page } from './pages/Chapter5Page';
import { Chapter6Page } from './pages/Chapter6Page';
import { NavigationTab, Chapter } from './types';
import { CHAPTERS_DATA } from './data/chaptersData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [selectedChapterNumber, setSelectedChapterNumber] = useState<string | null>(null);

  // Scroll to top on navigation tab change
  const handleNavigate = (tab: NavigationTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToJourney = () => {
    if (currentTab !== 'home') {
      setCurrentTab('home');
      setTimeout(() => {
        const el = document.getElementById('learning-journey');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('learning-journey');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectChapter = (chapterNum: string) => {
    setSelectedChapterNumber(chapterNum);
    if (chapterNum === '01') {
      handleNavigate('chapter-1');
    } else if (chapterNum === '02') {
      handleNavigate('chapter-2');
    } else if (chapterNum === '03') {
      handleNavigate('chapter-3');
    } else if (chapterNum === '04') {
      handleNavigate('chapter-4');
    } else if (chapterNum === '05') {
      handleNavigate('chapter-5');
    } else if (chapterNum === '06') {
      handleNavigate('chapter-6');
    } else {
      handleNavigate('learn');
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[#faf8f5] dark:bg-[#0c0d0e] text-[#1c1917] dark:text-[#f3f4f6] font-sans antialiased transition-colors duration-200">
        {/* Navigation Bar */}
        <Header
          currentTab={currentTab}
          onNavigate={handleNavigate}
          onScrollToJourney={handleScrollToJourney}
        />

        {/* Main Content Area */}
        <main className="grow">
          {currentTab === 'home' && (
            <HomePage
              onNavigate={handleNavigate}
              onSelectChapter={handleSelectChapter}
              onScrollToJourney={handleScrollToJourney}
            />
          )}

          {currentTab === 'chapter-1' && (
            <Chapter1Page
              onNavigate={handleNavigate}
              onSelectChapter={handleSelectChapter}
            />
          )}

          {currentTab === 'chapter-2' && (
            <Chapter2Page
              onNavigate={handleNavigate}
              onSelectChapter={handleSelectChapter}
            />
          )}

          {currentTab === 'chapter-3' && (
            <Chapter3Page
              onNavigate={handleNavigate}
              onSelectChapter={handleSelectChapter}
            />
          )}

          {currentTab === 'chapter-4' && (
            <Chapter4Page
              onNavigate={handleNavigate}
              onSelectChapter={handleSelectChapter}
            />
          )}

          {currentTab === 'chapter-5' && (
            <Chapter5Page
              onNavigate={handleNavigate}
              onSelectChapter={handleSelectChapter}
            />
          )}

          {currentTab === 'chapter-6' && (
            <Chapter6Page
              onNavigate={handleNavigate}
              onSelectChapter={handleSelectChapter}
            />
          )}

          {currentTab === 'learn' && (
            <LearnPage
              onSelectChapter={(ch) => {
                if (ch.id === 1) {
                  handleNavigate('chapter-1');
                } else if (ch.id === 2) {
                  handleNavigate('chapter-2');
                } else if (ch.id === 3) {
                  handleNavigate('chapter-3');
                } else if (ch.id === 4) {
                  handleNavigate('chapter-4');
                } else if (ch.id === 5) {
                  handleNavigate('chapter-5');
                } else if (ch.id === 6) {
                  handleNavigate('chapter-6');
                }
              }}
            />
          )}

          {currentTab === 'simulator' && <SimulatorPage />}

          {currentTab === 'playground' && <PlaygroundPage />}

          {currentTab === 'about' && <AboutPage />}
        </main>

        {/* Minimal Footer */}
        <Footer
          onNavigate={handleNavigate}
          onScrollToJourney={handleScrollToJourney}
        />
      </div>
    </ThemeProvider>
  );
}
