import React, { useState } from 'react';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Award, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  mathPrompt?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'What are logits in a Large Language Model?',
    mathPrompt: '\\mathbf{z} = W_U \\mathbf{h} + \\mathbf{b}',
    options: [
      'Normalized probabilities that always sum strictly to 1.0.',
      'Unconstrained real-valued scores produced by the unembedding projection before softmax.',
      'The binary representations of ASCII characters.',
      'Integer token IDs stored in the dictionary vocabulary.',
    ],
    correctIndex: 1,
    explanation:
      'Logits are unbounded real numbers (-inf to +inf) produced by multiplying the final hidden state with the unembedding matrix. Higher logits indicate greater model preference, but they must pass through softmax to become probabilities.',
  },
  {
    id: 2,
    question: 'How does the Softmax function convert logits into a valid probability distribution?',
    mathPrompt: 'P(w_i) = \\frac{\\exp(z_i)}{\\sum_j \\exp(z_j)}',
    options: [
      'It rounds all negative numbers to zero and multiplies by 100.',
      'It exponentiates each logit to ensure non-negativity and divides by the sum of exponentials so probabilities sum to 1.0.',
      'It computes the square root of each logit.',
      'It sorts logits alphabetically.',
    ],
    correctIndex: 1,
    explanation:
      'Because exp(z) is strictly positive for all real numbers, exponentiation converts unconstrained values into positive numbers. Dividing by the partition sum ensures that all probabilities sum strictly to 1.000.',
  },
  {
    id: 3,
    question: 'What does greedy decoding do during text generation?',
    mathPrompt: 'w_{t+1} = \\arg\\max_w P(w)',
    options: [
      'It randomly selects a token from the entire vocabulary.',
      'It deterministically chooses the single candidate token with the highest probability.',
      'It picks words with the most syllables.',
      'It deletes the last 3 words in the prompt.',
    ],
    correctIndex: 1,
    explanation:
      'Greedy decoding is the argmax strategy: at every single step, it strictly commits to the token with highest predicted probability. It is 100% reproducible and deterministic.',
  },
  {
    id: 4,
    question: 'How does the temperature parameter (T) mathematically alter output probabilities?',
    mathPrompt: 'P(w_i) = \\frac{\\exp(z_i / T)}{\\sum_j \\exp(z_j / T)}',
    options: [
      'Lower T sharpens the distribution toward argmax; higher T flattens probabilities toward uniform randomness.',
      'Higher T makes the GPU run physically hotter to calculate faster.',
      'Temperature reverses the order of vocabulary words.',
      'Temperature changes the underlying weights of the neural network.',
    ],
    correctIndex: 0,
    explanation:
      'Dividing logits by T < 1 scales up differences between scores, concentrating almost all probability mass on the top choice. Dividing by T > 1 shrinks differences, flattening the distribution toward equal probabilities.',
  },
  {
    id: 5,
    question: 'How does Top-K sampling filter candidate tokens before sampling?',
    mathPrompt: 'V^{(k)} = \\text{Top-}k(V)',
    options: [
      'It keeps only the single first token in the vocabulary.',
      'It keeps strictly the k highest-scoring tokens, zeroes out the tail, and renormalizes remaining probabilities to 1.0.',
      'It keeps all tokens whose length is shorter than k letters.',
      'It samples k different sentences at once.',
    ],
    correctIndex: 1,
    explanation:
      'Top-K restricts sampling to a fixed count of top candidates (e.g. k=50), preventing low-probability, bizarre tail tokens from ever being chosen.',
  },
  {
    id: 6,
    question: 'Why is Top-P (nucleus) sampling often preferred over Top-K sampling?',
    mathPrompt: '\\sum_{w \\in V^{(p)}} P(w) \\ge p',
    options: [
      'Top-P uses half as many GPU memory bytes.',
      'Top-P dynamically adapts candidate pool size based on context confidence: few candidates when certain, many candidates when uncertain.',
      'Top-P completely eliminates the need for Softmax.',
      'Top-P guarantees that generated code never has bugs.',
    ],
    correctIndex: 1,
    explanation:
      'Unlike Top-K which uses a rigid, fixed integer, Top-P sets a cumulative mass threshold (e.g. p=0.9). When certainty is high, the nucleus naturally shrinks to 1 or 2 tokens; when ambiguity is high, it smoothly expands.',
  },
  {
    id: 7,
    question: 'What does autoregressive generation mean in a language model?',
    mathPrompt: 'w_{t+1} = f(w_1, w_2, \\dots, w_t)',
    options: [
      'The model generates an entire 500-word paragraph simultaneously in a single forward pass.',
      'The model generates text strictly one token at a time, repeatedly appending each new token back into the prompt context to predict the next.',
      'The model only predicts verbs, while adjectives are generated by a separate network.',
      'The model generates text backwards from the conclusion to the beginning.',
    ],
    correctIndex: 1,
    explanation:
      'Autoregressive synthesis is an iterative loop: each newly emitted token is appended to the sequence and fed back into the model to predict token t+1.',
  },
  {
    id: 8,
    question: 'How does an autoregressive generation process know when to stop?',
    options: [
      'When the user closes their web browser.',
      'When the model emits the special <EOS> token, when max_tokens is reached, or when a stop sequence is matched.',
      'When the computer runs out of disk storage.',
      'When all vocabulary words have been used at least once.',
    ],
    correctIndex: 1,
    explanation:
      'Generation terminates when the model predicts the learned End-Of-Sequence delimiter (<EOS>), when a predefined maximum length cutoff is hit, or when a client-specified stop sequence is detected.',
  },
];

export const Chapter6Checkpoint: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (showResults) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isComplete = answeredCount === QUESTIONS.length;

  const score = QUESTIONS.reduce((acc, q) => {
    return selectedAnswers[q.id] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  return (
    <div className="bg-white dark:bg-[#131417] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 sm:p-8 lg:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#ece7dc] dark:border-[#22242b] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            <Award className="w-4 h-4" />
            <span>Interactive Assessment</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            Chapter 06 Knowledge Checkpoint
          </h4>
          <p className="text-sm text-[#57534e] dark:text-[#9ca3af] mt-1">
            Test your mastery of logits, temperature scaling, top-k/top-p sampling, and autoregressive generation.
          </p>
        </div>

        {/* Score & Reset */}
        <div className="flex items-center gap-3">
          {showResults && (
            <div className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-mono font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
              Score: {score} / {QUESTIONS.length} ({Math.round((score / QUESTIONS.length) * 100)}%)
            </div>
          )}
          <button
            onClick={handleReset}
            className="p-2 rounded-lg border border-[#ece7dc] dark:border-[#26282f] text-[#78716c] dark:text-[#9ca3af] hover:text-[#1c1917] dark:hover:text-[#f3f4f6] transition-colors cursor-pointer"
            title="Reset Quiz"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-8 my-8">
        {QUESTIONS.map((q, qIdx) => {
          const userAnswer = selectedAnswers[q.id];
          const isAnswered = userAnswer !== undefined;
          const isCorrect = isAnswered && userAnswer === q.correctIndex;

          return (
            <div
              key={q.id}
              className="p-5 sm:p-6 rounded-xl border border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#16171b] space-y-4"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#ece7dc] dark:bg-[#282a32] text-[#57534e] dark:text-[#9ca3af] shrink-0 mt-0.5">
                    0{qIdx + 1}
                  </span>
                  <div>
                    <h5 className="text-sm sm:text-base font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6]">
                      {q.question}
                    </h5>
                    {q.mathPrompt && (
                      <div className="mt-2 p-2 bg-white dark:bg-[#1f2127] rounded border border-[#ece7dc] dark:border-[#282a32] text-xs inline-block">
                        <LatexRenderer math={q.mathPrompt} />
                      </div>
                    )}
                  </div>
                </div>

                {showResults && (
                  <div>
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2 pt-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = userAnswer === optIdx;
                  let optionStyle =
                    'border-[#ece7dc] dark:border-[#282a32] bg-white dark:bg-[#1f2127] text-[#57534e] dark:text-[#d1d5db] hover:border-[#cfc6b5]';

                  if (showResults) {
                    if (optIdx === q.correctIndex) {
                      optionStyle =
                        'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold ring-1 ring-emerald-500';
                    } else if (isSelected && optIdx !== q.correctIndex) {
                      optionStyle =
                        'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 ring-1 ring-red-500';
                    }
                  } else if (isSelected) {
                    optionStyle =
                      'border-[#c2410c] dark:border-[#d97706] bg-amber-500/10 text-[#1c1917] dark:text-[#f3f4f6] font-semibold';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={showResults}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`p-3 rounded-lg border text-left text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
                    >
                      <span className="font-mono text-xs opacity-60 mt-0.5">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      <span className="flex-1 leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation (Shown when Results active) */}
              {showResults && (
                <div className="mt-3 p-3.5 rounded-lg bg-stone-100 dark:bg-[#1a1c22] border border-[#ece7dc] dark:border-[#26282f] text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
                  <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6] block mb-0.5">
                    Explanation:
                  </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-[#ece7dc] dark:border-[#22242b] gap-4">
        <div className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
          {isComplete
            ? 'All questions answered! Click below to check your score.'
            : `${answeredCount} of ${QUESTIONS.length} questions answered.`}
        </div>

        {!showResults ? (
          <button
            disabled={!isComplete}
            onClick={() => setShowResults(true)}
            className={`px-5 py-2 rounded-lg text-xs font-mono font-semibold transition-all shadow-xs cursor-pointer ${
              isComplete
                ? 'bg-[#c2410c] dark:bg-[#d97706] text-white hover:bg-[#9c381f] dark:hover:bg-[#b45309]'
                : 'bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed'
            }`}
          >
            Submit & Check Answers
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="px-5 py-2 rounded-lg text-xs font-mono font-semibold bg-[#1c1917] dark:bg-white text-white dark:text-[#1c1917] transition-all cursor-pointer"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};
