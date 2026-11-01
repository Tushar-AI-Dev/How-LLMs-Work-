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
    question: "What is self-attention?",
    options: [
      "A mechanism where tokens in a sequence attend to other tokens within the exact same sequence to build context-aware representations.",
      "An algorithm that forces the computer to read only one token at a time from left to right.",
      "A technique for translating text between two completely different languages simultaneously.",
      "A user interface feature that highlights words on screen for humans."
    ],
    correctIndex: 0,
    explanation: "Self-attention allows every token in an input sequence to dynamically gather information from all other tokens in the same sequence, transforming isolated embeddings into rich contextual representations."
  },
  {
    id: 2,
    question: "What do Query, Key, and Value represent?",
    options: [
      "Database credentials (username, password, and access token).",
      "Three learned vector projections: Query is what a token seeks, Key is what a token advertises for matching, and Value is what it contributes.",
      "Three different English dictionaries used to translate foreign words.",
      "The RGB color channels used to render the attention heatmap."
    ],
    correctIndex: 1,
    explanation: "Q, K, and V are distinct linear transformations (X · W_Q, X · W_K, X · W_V). Query and Key vectors determine alignment scores via dot products, while Value vectors are weighted and summed to form the output."
  },
  {
    id: 3,
    question: "Why are raw attention scores (Q · Kᵀ) scaled by √d_k?",
    options: [
      "To convert integers into floating-point numbers.",
      "To prevent dot products from growing excessively large in high dimensions, which would saturate Softmax and cause vanishing gradients.",
      "Because computer screens cannot display numbers greater than 100.",
      "To speed up hard drive storage read operations."
    ],
    correctIndex: 1,
    explanation: "For independent components with unit variance, the dot product has variance proportional to d_k. Scaling by √d_k normalizes the variance to 1, preventing Softmax from entering extremely flat regions where gradients vanish."
  },
  {
    id: 4,
    question: "Why is Softmax applied to the scaled attention scores?",
    options: [
      "To convert arbitrary positive and negative scores into a valid probability distribution that sums strictly to 1.0 (100%).",
      "To compress text into a smaller file size.",
      "To invert the sequence order of the tokens.",
      "To delete vowels from the vocabulary."
    ],
    correctIndex: 0,
    explanation: "Softmax exponentiates scores (guaranteeing non-negative numbers) and divides by their sum, turning raw affinity scores into normalized attention weights that act as blending percentages."
  },
  {
    id: 5,
    question: "What do the attention weights in a row of the attention matrix represent?",
    options: [
      "The physical CPU temperature of the GPU cluster.",
      "A discrete probability distribution dictating what fraction of each Key's Value vector the Query token will absorb.",
      "The number of vowels contained in each word.",
      "The elapsed time taken to generate the word in milliseconds."
    ],
    correctIndex: 1,
    explanation: "Each row i represents how Query token i distributes its attention across all positions. Multiplying this row by the Value matrix computes a context-infused weighted average."
  },
  {
    id: 6,
    question: "What does causal masking prevent in decoder-only language models?",
    options: [
      "It prevents the model from generating swear words.",
      "It prevents tokens from attending to future tokens that have not been generated yet, preserving autoregressive validity.",
      "It prevents GPU memory from overheating during training.",
      "It prevents users from downloading model weights."
    ],
    correctIndex: 1,
    explanation: "Autoregressive generation generates tokens sequentially. Causal masking sets future positions (j > i) to -∞ so that exp(-∞) = 0, ensuring future tokens cannot leak information to past tokens."
  },
  {
    id: 7,
    question: "Why do modern Transformers employ Multi-Head Attention instead of a single large head?",
    options: [
      "To allow the model to attend to multiple different linguistic, syntactic, and relational subspaces in parallel.",
      "Because one head cannot process words with more than four letters.",
      "To force the model to speak multiple foreign languages at once.",
      "It is a legacy compatibility requirement for older 32-bit operating systems."
    ],
    correctIndex: 0,
    explanation: "A single attention head produces only one distribution per token. Multi-Head Attention projects Q, K, and V into h parallel subspaces, enabling simultaneous tracking of syntax, co-reference, position, and semantics."
  }
];

export const Chapter4Checkpoint: React.FC = () => {
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
            Section 12 · Assessment
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
                  let optionStyle =
                    'bg-white dark:bg-[#141518] border-[#ded7ca] dark:border-[#282a32] text-[#44403c] dark:text-[#d1d5db]';

                  if (isAnswered) {
                    if (optIdx === q.correctIndex) {
                      optionStyle =
                        'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      optionStyle =
                        'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 line-through';
                    }
                  } else if (isSelected) {
                    optionStyle =
                      'bg-amber-100/70 dark:bg-amber-950/60 border-amber-400 dark:border-amber-700 text-[#1c1917] dark:text-[#f3f4f6] font-semibold';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isAnswered}
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={`w-full text-left p-3 rounded-md text-xs sm:text-sm border transition-all cursor-pointer flex items-start gap-2.5 ${optionStyle}`}
                    >
                      <span className="font-mono text-[11px] opacity-75 mt-0.5">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      <span className="flex-1 leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Check & Retry Actions */}
              {!isAnswered ? (
                <div className="flex justify-end pt-2">
                  <button
                    disabled={chosen === undefined}
                    onClick={() => handleSubmitQuestion(q.id)}
                    className="px-4 py-1.5 rounded text-xs font-mono font-semibold bg-[#1c1917] dark:bg-[#f3f4f6] text-white dark:text-[#111215] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-all"
                  >
                    Verify Answer
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-[#ece7dc] dark:border-[#22242b] space-y-2">
                  <div className="text-xs leading-relaxed text-[#57534e] dark:text-[#9ca3af]">
                    <strong className="text-[#1c1917] dark:text-[#f3f4f6]">
                      {isCorrect ? 'Correct!' : 'Incorrect.'}
                    </strong>{' '}
                    {q.explanation}
                  </div>

                  {!isCorrect && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleRetryQuestion(q.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#c2410c] dark:text-[#d97706] hover:underline cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Try Again</span>
                      </button>
                    </div>
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
