import React, { useState } from 'react';
import { ArrowLeftRight, HelpCircle, Sparkles } from 'lucide-react';

export const SentencePermutationExperiment: React.FC = () => {
  const [activeSentence, setActiveSentence] = useState<'dogChasesCat' | 'catChasesDog'>('dogChasesCat');

  const sentenceA = [
    { text: "The", pos: 0, role: "Determiner" },
    { text: "dog", pos: 1, role: "Subject Agent (Chaser)" },
    { text: "chased", pos: 2, role: "Transitive Verb" },
    { text: "the", pos: 3, role: "Determiner" },
    { text: "cat", pos: 4, role: "Direct Object (Fleeing)" },
    { text: ".", pos: 5, role: "Period" },
  ];

  const sentenceB = [
    { text: "The", pos: 0, role: "Determiner" },
    { text: "cat", pos: 1, role: "Subject Agent (Chaser)" },
    { text: "chased", pos: 2, role: "Transitive Verb" },
    { text: "the", pos: 3, role: "Determiner" },
    { text: "dog", pos: 4, role: "Direct Object (Fleeing)" },
    { text: ".", pos: 5, role: "Period" },
  ];

  const currentSentence = activeSentence === 'dogChasesCat' ? sentenceA : sentenceB;

  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ece7dc] dark:border-[#22242b] mb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            Opening Experiment · Section 02
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
            Same Words, Inverted Meaning
          </h3>
        </div>

        <button
          onClick={() =>
            setActiveSentence(activeSentence === 'dogChasesCat' ? 'catChasesDog' : 'dogChasesCat')
          }
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-mono bg-[#f4efe6] dark:bg-[#1e2026] text-[#1c1917] dark:text-[#f3f4f6] hover:bg-[#ece7dc] dark:hover:bg-[#252830] transition-colors cursor-pointer border border-[#ded7ca] dark:border-[#2a2d36] self-start sm:self-auto"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-[#c2410c] dark:text-[#d97706]" />
          <span>Invert Sentence Roles</span>
        </button>
      </div>

      <p className="text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed mb-6">
        Compare the two sentences below. Both contain the <em>exact same vocabulary tokens</em>, yet their semantic meaning is opposite. Toggle between them to see how position dictates meaning.
      </p>

      {/* Interactive Sentence Stage */}
      <div className="p-6 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-xl space-y-6">
        
        {/* Token Sequence with Position Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {currentSentence.map((tok, idx) => {
            const isCat = tok.text.toLowerCase() === 'cat';
            const isDog = tok.text.toLowerCase() === 'dog';
            const isSubject = tok.pos === 1;

            return (
              <div
                key={`${tok.text}-${idx}`}
                className={`
                  p-3 rounded-lg border text-center transition-all duration-300 min-w-[70px] sm:min-w-[85px] shadow-xs
                  ${
                    isSubject
                      ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 dark:border-amber-700 ring-2 ring-[#c2410c] dark:ring-[#d97706]'
                      : 'bg-white dark:bg-[#16171c] border-[#ded7ca] dark:border-[#282a32]'
                  }
                `}
              >
                <div className="text-[10px] font-mono text-[#78716c] dark:text-[#9ca3af] mb-1">
                  Pos: {tok.pos}
                </div>
                <div className="font-serif text-lg sm:text-xl font-bold text-[#1c1917] dark:text-[#f3f4f6]">
                  "{tok.text}"
                </div>
                <div className="text-[10px] font-mono mt-1 text-[#c2410c] dark:text-[#d97706] truncate">
                  {isSubject ? 'Subject' : tok.pos === 4 ? 'Object' : tok.role.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>

        {/* Semantic Interpretation Strip */}
        <div className="p-4 bg-white dark:bg-[#141518] rounded-lg border border-[#ded7ca] dark:border-[#282a32] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div>
            <span className="text-[#78716c] dark:text-[#9ca3af]">Semantic Event: </span>
            <span className="font-bold text-base text-[#1c1917] dark:text-[#f3f4f6]">
              {activeSentence === 'dogChasesCat'
                ? "Dog is the Pursuer → Cat is Fleeing"
                : "Cat is the Pursuer → Dog is Fleeing"}
            </span>
          </div>

          <div className="text-[#c2410c] dark:text-[#d97706] font-semibold">
            {activeSentence === 'dogChasesCat'
              ? 'Pos 1: dog | Pos 4: cat'
              : 'Pos 1: cat | Pos 4: dog'}
          </div>
        </div>
      </div>

      {/* Why Permutation Invariance Fails Without Position */}
      <div className="mt-6 p-4 bg-[#f8f5ee] dark:bg-[#191b21] rounded-lg border border-[#ded7ca] dark:border-[#282a32] text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed space-y-2">
        <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6] block">
          The Architectural Dilemma: Self-Attention Is Permutation-Invariant
        </span>
        <p>
          Unlike older recurrent neural networks (RNNs) that processed words step-by-step from left to right, a Transformer processes all tokens in a sentence <strong>simultaneously</strong> in parallel. Mathematically, self-attention treats tokens as an unordered set. Without positional encodings, the model would perceive <code>{"dog, cat, chased"}</code> as identical regardless of order!
        </p>
      </div>
    </div>
  );
};
