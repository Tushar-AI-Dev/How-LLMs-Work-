import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Is every token necessarily a complete word?",
    options: [
      "Yes, tokenizers always isolate dictionary words.",
      "No, tokens can be subwords, word stems, single characters, or punctuation.",
      "Yes, except for emojis and foreign symbols.",
      "No, tokens are only ever single individual letters."
    ],
    correctIndex: 1,
    explanation: "Tokens are subword segments. Common words may remain whole, while unfamiliar, long, or inflected words are split into prefixes, stems, or suffixes (e.g. 'un' + 'believable')."
  },
  {
    id: 2,
    question: "What does a token ID represent?",
    options: [
      "The mathematical meaning and semantic value of the word.",
      "The position of the token within the sentence.",
      "An integer index corresponding to a specific entry in the model's vocabulary lookup table.",
      "The statistical probability of that word appearing in English."
    ],
    correctIndex: 2,
    explanation: "A token ID is simply a categorical integer that acts as a row index in the embedding matrix. It contains no inherent semantic meaning by itself."
  },
  {
    id: 3,
    question: "Does a larger token ID mean a more important token?",
    options: [
      "Yes, higher IDs carry greater computational weight in neural activations.",
      "No, token IDs are arbitrary discrete labels and have no magnitude significance.",
      "Yes, higher IDs correspond to words added later in human history.",
      "No, lower IDs are strictly reserved for verbs."
    ],
    correctIndex: 1,
    explanation: "Token IDs have no numerical magnitude or hierarchy. Token #45000 is not 'greater' or 'more important' than Token #12. Neural networks do not perform scalar arithmetic on token IDs."
  },
  {
    id: 4,
    question: "Why do language models use tokenization?",
    options: [
      "Computers operate on numerical matrices, so continuous text must be converted to discrete mathematical primitives.",
      "To compress English text so it takes up less hard drive space.",
      "Because Python strings cannot be stored in computer memory.",
      "To translate text into English before processing."
    ],
    correctIndex: 0,
    explanation: "Neural networks cannot directly compute dot products or matrix multiplications on raw character strings. Tokenization bridges human prose to integer indices that map into continuous embedding vector spaces."
  }
];

export const KnowledgeCheckpoint: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});

  const handleSelect = (questionId: number, optionIdx: number) => {
    if (submitted[questionId]) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitQuestion = (questionId: number) => {
    if (selectedAnswers[questionId] === undefined) return;
    setSubmitted((prev) => ({ ...prev, [questionId]: true }));
  };

  const handleRetryQuestion = (questionId: number) => {
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
    setSubmitted((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };

  const correctCount = Object.keys(submitted).filter(
    (qId) => selectedAnswers[Number(qId)] === QUESTIONS.find((q) => q.id === Number(qId))?.correctIndex
  ).length;

  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-10 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ece7dc] dark:border-[#22242b] mb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            Section 08 · Assessment
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
            Knowledge Checkpoint
          </h3>
        </div>

        <div className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          Score: <span className="font-bold text-[#1c1917] dark:text-[#f3f4f6] tabular-data">{correctCount}</span> of {QUESTIONS.length} Verified
        </div>
      </div>

      <div className="space-y-8">
        {QUESTIONS.map((q, idx) => {
          const isAnswered = submitted[q.id];
          const chosen = selectedAnswers[q.id];
          const isCorrect = isAnswered && chosen === q.correctIndex;

          return (
            <div
              key={q.id}
              className="p-5 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-lg space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-medium text-sm sm:text-base text-[#1c1917] dark:text-[#f3f4f6]">
                  <span className="font-mono text-xs text-[#c2410c] dark:text-[#d97706] mr-2">
                    0{idx + 1}.
                  </span>
                  {q.question}
                </h4>

                {isAnswered && (
                  <span className="shrink-0">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    )}
                  </span>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = chosen === optIdx;
                  let optionStyle = 'bg-white dark:bg-[#141518] border-[#ded7ca] dark:border-[#282a32] text-[#44403c] dark:text-[#d1d5db]';

                  if (isAnswered) {
                    if (optIdx === q.correctIndex) {
                      optionStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 font-medium';
                    } else if (isSelected) {
                      optionStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200';
                    }
                  } else if (isSelected) {
                    optionStyle = 'border-[#c2410c] dark:border-[#d97706] bg-[#fffaf5] dark:bg-[#20180f] text-[#c2410c] dark:text-[#d97706] font-medium';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isAnswered}
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={`
                        w-full text-left p-3 rounded text-xs sm:text-sm border transition-all cursor-pointer
                        ${optionStyle}
                        ${!isAnswered ? 'hover:border-[#c2410c]' : ''}
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-4 h-4 rounded-full border border-current/40 flex items-center justify-center text-[10px] shrink-0 font-mono">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Action / Explanation Box */}
              {!isAnswered ? (
                <div className="pt-2 flex justify-end">
                  <button
                    disabled={chosen === undefined}
                    onClick={() => handleSubmitQuestion(q.id)}
                    className="px-4 py-1.5 text-xs font-medium rounded bg-[#1c1917] text-white dark:bg-[#f3f4f6] dark:text-[#111215] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-opacity"
                  >
                    Check Answer
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-[#ece7dc] dark:border-[#22242b] space-y-2">
                  <div className={`text-xs ${isCorrect ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-rose-700 dark:text-rose-400 font-semibold'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </div>
                  <p className="text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
                    {q.explanation}
                  </p>
                  {!isCorrect && (
                    <button
                      onClick={() => handleRetryQuestion(q.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-[#c2410c] dark:text-[#d97706] hover:underline cursor-pointer pt-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Retry Question</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
