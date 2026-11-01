import React from 'react';
import {
  Binary,
  Compass,
  Waves,
  Eye,
  Layers,
  Sparkles,
  Calculator,
} from 'lucide-react';

export type PlaygroundTab =
  | 'tokenizer'
  | 'embeddings'
  | 'positional'
  | 'attention'
  | 'transformer'
  | 'generation'
  | 'metrics';

interface PlaygroundNavProps {
  activeTab: PlaygroundTab;
  onTabChange: (tab: PlaygroundTab) => void;
}

export const PlaygroundNav: React.FC<PlaygroundNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'tokenizer' as PlaygroundTab,
      label: 'Tokenizer',
      number: '01',
      icon: <Binary className="w-4 h-4" />,
      subtext: 'BPE & subwords',
    },
    {
      id: 'embeddings' as PlaygroundTab,
      label: 'Embeddings',
      number: '02',
      icon: <Compass className="w-4 h-4" />,
      subtext: 'Vectors & cosine',
    },
    {
      id: 'positional' as PlaygroundTab,
      label: 'Positional',
      number: '03',
      icon: <Waves className="w-4 h-4" />,
      subtext: 'Sinusoids & RoPE',
    },
    {
      id: 'attention' as PlaygroundTab,
      label: 'Attention',
      number: '04',
      icon: <Eye className="w-4 h-4" />,
      subtext: 'Q-K-V & masks',
    },
    {
      id: 'transformer' as PlaygroundTab,
      label: 'Transformer Block',
      number: '05',
      icon: <Layers className="w-4 h-4" />,
      subtext: 'Norm, FFN & residual',
    },
    {
      id: 'generation' as PlaygroundTab,
      label: 'Text Generation',
      number: '06',
      icon: <Sparkles className="w-4 h-4" />,
      subtext: 'Softmax & sampling',
    },
    {
      id: 'metrics' as PlaygroundTab,
      label: 'Tensor Metrics',
      number: 'Tools',
      icon: <Calculator className="w-4 h-4" />,
      subtext: 'Memory & scaling',
    },
  ];

  return (
    <div className="border-b border-[#e6e0d4] dark:border-[#26282f] overflow-x-auto">
      <nav className="flex space-x-2 min-w-max pb-2" aria-label="Playground Experiments">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                group flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-mono transition-all cursor-pointer border
                ${
                  isActive
                    ? 'bg-[#1c1917] text-white dark:bg-[#f3f4f6] dark:text-[#111215] border-transparent font-medium shadow-xs'
                    : 'bg-white dark:bg-[#141518] text-[#57534e] dark:text-[#9ca3af] border-[#e6e0d4] dark:border-[#26282f] hover:text-[#1c1917] dark:hover:text-[#f3f4f6] hover:border-[#cfc6b5] dark:hover:border-[#3a3e49]'
                }
              `}
            >
              <span
                className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                  isActive
                    ? 'bg-[#c2410c] text-white dark:bg-[#d97706]'
                    : 'bg-[#faf8f5] dark:bg-[#1f2127] text-[#78716c] dark:text-[#9ca3af]'
                }`}
              >
                {tab.number}
              </span>
              <div className="text-left">
                <div className="font-semibold">{tab.label}</div>
                <div
                  className={`text-[10px] hidden sm:block ${
                    isActive ? 'opacity-80' : 'text-[#a8a29e] dark:text-[#6b7280]'
                  }`}
                >
                  {tab.subtext}
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
