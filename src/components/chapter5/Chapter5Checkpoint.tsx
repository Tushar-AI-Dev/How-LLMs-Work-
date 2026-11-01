import React, { useState } from 'react';
import { LatexRenderer } from '../ui/LatexRenderer';
import { Award, CheckCircle2, XCircle, RotateCcw, HelpCircle } from 'lucide-react';

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
    question: 'Why do residual connections eliminate the vanishing gradient problem across very deep neural networks?',
    mathPrompt: '\\frac{\\partial \\mathbf{y}}{\\partial \\mathbf{x}} = \\mathbf{I} + \\frac{\\partial \\mathcal{F}(\\mathbf{x})}{\\partial \\mathbf{x}}',
    options: [
      'They force all weight gradients to strictly equal zero during the backward pass.',
      'The identity matrix I ensures an unattenuated gradient highway passes directly back to early layers without multiplicative degradation.',
      'They double the sequence length at each computational stage.',
      'They prevent the model from using non-linear activation functions.',
    ],
    correctIndex: 1,
    explanation:
      'Because y = x + F(x), the derivative dy/dx contains the constant identity matrix I. Even if the sublayer derivative dF/dx approaches zero, gradients flow directly through the identity highway without vanishing.',
  },
  {
    id: 2,
    question: 'Across which dimension does Layer Normalization compute its mean and variance in a Transformer?',
    mathPrompt: '\\mu = \\frac{1}{d}\\sum_{i=1}^d x_i, \\quad \\sigma^2 = \\frac{1}{d}\\sum_{i=1}^d (x_i - \\mu)^2',
    options: [
      'Across all training sequences in the mini-batch (like Batch Normalization).',
      'Across the entire sequence length dimension L simultaneously.',
      'Across the feature/hidden dimension d_model for each individual token independently.',
      'Across the attention heads dimension h.',
    ],
    correctIndex: 2,
    explanation:
      'Layer Normalization computes statistics strictly across the hidden dimension d_model of a single token vector. This makes normalization completely invariant to batch size and sentence length, allowing single-token autoregressive streaming.',
  },
  {
    id: 3,
    question: 'Why did contemporary LLM architectures (GPT-3, LLaMA, PaLM, Gemma) migrate from Post-LN to Pre-LN?',
    options: [
      'Pre-LN reduces the parameter count of the Transformer by 50%.',
      'Pre-LN leaves the residual stream unobstructed, enabling stable gradient flow and effortless training of 80+ stacked layers.',
      'Post-LN cannot compute softmax attention scores.',
      'Pre-LN eliminates the need for Positional Encoding.',
    ],
    correctIndex: 1,
    explanation:
      'In Post-LN, Layer Normalization continually scales down the residual stream, causing gradients near input layers to vanish. Pre-LN keeps the residual backbone completely untouched, allowing deep networks to train smoothly from the very first step.',
  },
  {
    id: 4,
    question: 'What is the complementary division of labor between Multi-Head Attention and the Feed-Forward Network (FFN)?',
    options: [
      'MHA processes images, while FFN processes textual words.',
      'Attention routes contextual information across different tokens; the FFN processes each token position independently and acts as an associative memory store of factual knowledge.',
      'MHA generates tokens, while FFN removes tokens from vocabulary.',
      'FFN computes sequence order, while MHA computes spelling.',
    ],
    correctIndex: 1,
    explanation:
      'Attention allows tokens to converse and share contextual cues across the sequence. Once context is integrated, the FFN processes each token in isolation, where first-layer keys detect patterns and second-layer values read out factual knowledge.',
  },
  {
    id: 5,
    question: 'What would occur if a Transformer eliminated non-linear activation functions (like GELU or SwiGLU) in its FFN?',
    options: [
      'The model would run 10x faster with identical accuracy.',
      'The entire multi-layer deep network would mathematically collapse into a single giant linear matrix multiplication, losing the ability to compute non-linear relationships.',
      'The token vocabulary would be restricted to 256 characters.',
      'Attention scores would become negative.',
    ],
    correctIndex: 1,
    explanation:
      'The composition of linear functions is strictly linear: W_2(W_1 x) = (W_2 W_1)x = W_combined x. Without non-linear activations (like GELU, ReLU, or SwiGLU), stacking 80 layers provides no more expressive power than a single shallow matrix multiplication.',
  },
  {
    id: 6,
    question: 'Why has RMSNorm widely superseded standard Layer Normalization in modern open-weights LLMs like LLaMA 3 and Mistral?',
    mathPrompt: '\\text{RMSNorm}(\\mathbf{x}) = \\boldsymbol{\\gamma} \\odot \\frac{\\mathbf{x}}{\\text{RMS}(\\mathbf{x})}',
    options: [
      'It discards mean centering and learnable bias vectors, reducing memory and computation by ~30% with no loss in model perplexity.',
      'It is the only normalization compatible with English text.',
      'It allows transformers to operate without embedding vectors.',
      'It guarantees that attention weights sum to 100.',
    ],
    correctIndex: 0,
    explanation:
      'Zhang & Sennrich (2019) discovered that the scaling property of LayerNorm is what provides training stability, while mean-centering is computationally redundant. RMSNorm discards mean calculation and bias, delivering faster training with identical performance.',
  },
  {
    id: 7,
    question: 'Why has the Decoder-Only architecture become the universal foundation for generative frontier LLMs?',
    options: [
      'Decoder-only models cannot perform language translation.',
      'Next-token prediction seamlessly unifies pre-training with open-ended generation and in-context general reasoning without task-specific architectural splits.',
      'Encoder-only models require 10x more GPU memory.',
      'Decoders do not require residual connections.',
    ],
    correctIndex: 1,
    explanation:
      'By training to predict the next token autoregressively on internet-scale text, decoder-only models scale with computational power, learn flexible in-context problem solving, and directly match the generative inference loop without needing an encoder-decoder cross-attention bridge.',
  },
];

export const Chapter5Checkpoint: React.FC = () => {
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
            Chapter 05 Knowledge Checkpoint
          </h4>
          <p className="text-sm text-[#57534e] dark:text-[#9ca3af] mt-1">
            Test your mastery of Transformer block components, residual streams, normalization, and network depth.
          </p>
        </div>

        {/* Status / Score Readout */}
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
