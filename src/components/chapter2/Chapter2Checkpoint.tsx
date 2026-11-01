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
    question: "What is an embedding in a language model?",
    options: [
      "A compressed text file stored in GPU cache.",
      "A dense numerical vector of continuous coordinates representing a token.",
      "A database table containing grammatical definitions of words.",
      "A computer program that spells words backward."
    ],
    correctIndex: 1,
    explanation: "An embedding is a continuous vector of floating-point numbers associated with a token, projecting discrete symbols into a multidimensional geometric space."
  },
  {
    id: 2,
    question: "What does an embedding dimension represent?",
    options: [
      "The physical height and width of a word on screen.",
      "A specific page number in the training textbook.",
      "An independent coordinate axis in high-dimensional latent space capturing learned features.",
      "The elapsed training time in seconds."
    ],
    correctIndex: 2,
    explanation: "Each dimension corresponds to a continuous coordinate axis along which mathematical projections and contextual features are encoded."
  },
  {
    id: 3,
    question: "Is a token ID itself a semantic vector?",
    options: [
      "Yes, higher token IDs automatically encode more complex semantic meanings.",
      "No, a token ID is merely an arbitrary discrete integer index with no magnitude or direction.",
      "Yes, token IDs directly represent RGB color vectors.",
      "No, token IDs are only used for security encryption."
    ],
    correctIndex: 1,
    explanation: "Token IDs have no internal direction or geometry. They simply identify which row of the embedding matrix to retrieve."
  },
  {
    id: 4,
    question: "What does cosine similarity measure between two vectors?",
    options: [
      "The physical distance in millimeters between GPU memory chips.",
      "The total number of letters shared between two words.",
      "The normalized angular alignment between two directional vectors in coordinate space.",
      "The time it took the model to compute the token."
    ],
    correctIndex: 2,
    explanation: "Cosine similarity calculates the cosine of the angle between two vectors. A value near +1.0 indicates near-identical direction, 0 indicates orthogonality (unrelated), and -1 indicates opposite direction."
  },
  {
    id: 5,
    question: "How do embedding parameters become semantically useful?",
    options: [
      "Linguists manually write the vector values before training starts.",
      "They are randomly generated and never change.",
      "They are iteratively adjusted via backpropagation and gradient descent during pre-training on large text corpora.",
      "They are copied from English dictionaries."
    ],
    correctIndex: 2,
    explanation: "Embeddings start as random noise and are gradually nudged by gradient descent so words sharing linguistic contexts gravitate toward similar geometric trajectories."
  }
];

export const Chapter2Checkpoint: React.FC = () => {
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

              {/* Action / Feedback */}
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
