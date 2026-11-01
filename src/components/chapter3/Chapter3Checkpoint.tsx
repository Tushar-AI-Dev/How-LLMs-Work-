import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

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
    question: "Why does token order matter in language models?",
    options: [
      "It determines the size of the computer's hard drive.",
      "The order of words determines syntactic grammatical roles and semantic meaning (e.g. 'dog chased cat' vs 'cat chased dog').",
      "Because GPU memory cannot store words backwards.",
      "It is only required for displaying text in web browsers."
    ],
    correctIndex: 1,
    explanation: "Natural language syntax is heavily order-dependent. Inverting the sequence of words changes who is performing the action and who is receiving it."
  },
  {
    id: 2,
    question: "What information does positional encoding introduce?",
    options: [
      "The physical geographic GPS coordinates of the user.",
      "The relative or absolute sequence position of each token in the input stream.",
      "The dictionary definition and linguistic origin of the word.",
      "The probability of the next word."
    ],
    correctIndex: 1,
    explanation: "Positional encodings provide spatial coordinates indicating which token comes 1st, 2nd, or 100th, breaking the permutation invariance of self-attention."
  },
  {
    id: 3,
    question: "What mathematical functions are used in classic sinusoidal encoding?",
    options: [
      "Exponential and logarithmic functions.",
      "Sine and cosine trigonometric waves at geometric frequencies.",
      "Polynomial roots and quadratics.",
      "Random pseudo-number generators."
    ],
    correctIndex: 1,
    explanation: "Vaswani et al. used sine for even dimensions and cosine for odd dimensions across wavelengths scaling from 2π to 10000 · 2π."
  },
  {
    id: 4,
    question: "Are all positional encoding methods fixed mathematical functions?",
    options: [
      "Yes, all models must strictly use the original 2017 sinusoidal equations.",
      "No, some models (like GPT-2) use learned positional embedding matrices, while modern models (like LLaMA 3) use Rotary Position Embeddings (RoPE).",
      "Yes, mathematical constants cannot be altered by neural networks.",
      "No, position is never used in deep learning."
    ],
    correctIndex: 1,
    explanation: "Positional methods vary widely: sinusoidal is fixed, learned positional embeddings are trained matrices, and RoPE rotates vectors in complex sub-planes."
  },
  {
    id: 5,
    question: "What is the basic idea behind Rotary Position Embeddings (RoPE)?",
    options: [
      "Rotating the computer monitor to change text orientation.",
      "Applying 2D orthogonal rotations to query and key vectors inside attention heads so relative token distance is preserved.",
      "Randomly shuffling the order of words during each training step.",
      "Compressing vocabulary tokens into circular zip files."
    ],
    correctIndex: 1,
    explanation: "RoPE multiplies Query and Key vectors by rotation matrices proportional to their sequence position, causing their dot product to naturally encode the relative distance (m - n) between tokens."
  }
];

export const Chapter3Checkpoint: React.FC = () => {
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
              className="p-5 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#26282f] rounded-lg space-y-4"
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

              {/* Action / Explanation */}
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
