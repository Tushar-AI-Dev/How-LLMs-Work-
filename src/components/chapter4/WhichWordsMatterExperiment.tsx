import React, { useState } from 'react';
import { COREFERENCE_TOKENS, COREFERENCE_ATTENTION_MAP } from '../../services/attentionService';
import { HelpCircle, Sparkles, ArrowRight, Eye } from 'lucide-react';

export const WhichWordsMatterExperiment: React.FC = () => {
  const [selectedWord, setSelectedWord] = useState<string>('it');

  // Lookup weights or fallback to uniform distribution
  const attentionWeights =
    COREFERENCE_ATTENTION_MAP[selectedWord.toLowerCase()] ||
    COREFERENCE_TOKENS.map((tok) =>
      tok.toLowerCase() === selectedWord.toLowerCase() ? 0.4 : 0.6 / (COREFERENCE_TOKENS.length - 1)
    );

  const selectedIndex = COREFERENCE_TOKENS.findIndex(
    (t) => t.toLowerCase() === selectedWord.toLowerCase()
  );

  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ece7dc] dark:border-[#22242b] mb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            Opening Experiment · Section 02
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
            Which Words Matter? The Winograd Dilemma
          </h3>
        </div>

        <div className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af] self-start sm:self-auto">
          Illustrative Attention Weights
        </div>
      </div>

      <p className="text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed mb-6">
        Consider the famous Winograd sentence below. When processing the ambiguous pronoun <strong className="text-[#1c1917] dark:text-[#f3f4f6]">"it"</strong>, which other word in the sequence should the model consult to know what was tired? Click <strong className="text-[#c2410c] dark:text-[#d97706]">"it"</strong> or any other word to view its attention focus across the sentence.
      </p>

      {/* Interactive Sentence Strip */}
      <div className="p-6 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#e6e0d4] dark:border-[#22242b] rounded-xl space-y-6">
        
        {/* Clickable Token Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {COREFERENCE_TOKENS.map((token, idx) => {
            const isSelected = token.toLowerCase() === selectedWord.toLowerCase();
            const weight = attentionWeights[idx];
            // Opacity based on attention weight
            const opacity = Math.max(0.15, weight * 1.5);

            return (
              <button
                key={idx}
                onClick={() => setSelectedWord(token)}
                className={`
                  relative px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-serif font-medium cursor-pointer transition-all border
                  ${
                    isSelected
                      ? 'bg-[#1c1917] dark:bg-[#f3f4f6] text-white dark:text-[#111215] border-transparent ring-2 ring-[#c2410c] dark:ring-[#d97706] scale-105 shadow-sm'
                      : 'bg-white dark:bg-[#16171c] text-[#1c1917] dark:text-[#f3f4f6] border-[#ded7ca] dark:border-[#282a32] hover:border-[#c2410c]'
                  }
                `}
              >
                <span>{token}</span>

                {/* Sub-badge indicating attention received */}
                {!isSelected && (
                  <span
                    className="block text-[10px] font-mono mt-0.5 text-[#c2410c] dark:text-[#d97706] font-semibold"
                    style={{ opacity }}
                  >
                    {(weight * 100).toFixed(0)}%
                  </span>
                )}
                {isSelected && (
                  <span className="block text-[10px] font-mono mt-0.5 text-amber-300 dark:text-[#c2410c] font-semibold">
                    Query
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Attention Arc / Distribution Breakdown */}
        <div className="p-4 bg-white dark:bg-[#141518] rounded-lg border border-[#ded7ca] dark:border-[#282a32] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2">
            <div>
              <span className="text-[#78716c] dark:text-[#9ca3af]">Query Token: </span>
              <span className="font-bold text-[#c2410c] dark:text-[#d97706] text-sm">
                "{selectedWord}" (Position {selectedIndex})
              </span>
            </div>
            <div className="text-[#57534e] dark:text-[#9ca3af]">
              Target attention distribution (sums to 100%):
            </div>
          </div>

          {/* Attention Weight Visual Bars */}
          <div className="space-y-1.5 pt-2">
            {COREFERENCE_TOKENS.map((token, idx) => {
              const weight = attentionWeights[idx];
              const isTargetHigh = weight >= 0.25;

              return (
                <div key={idx} className="flex items-center gap-2 text-xs font-mono">
                  <span className="w-16 shrink-0 text-right text-[#78716c] dark:text-[#9ca3af] truncate">
                    {token}:
                  </span>
                  <div className="flex-1 h-3.5 bg-[#f0ebe1] dark:bg-[#1f2128] rounded overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isTargetHigh
                          ? 'bg-[#c2410c] dark:bg-[#d97706]'
                          : 'bg-[#9ca3af] dark:bg-[#52525b]'
                      }`}
                      style={{ width: `${Math.min(100, weight * 100)}%` }}
                    />
                  </div>
                  <span
                    className={`w-12 text-right font-semibold tabular-data ${
                      isTargetHigh
                        ? 'text-[#c2410c] dark:text-[#d97706]'
                        : 'text-[#78716c] dark:text-[#9ca3af]'
                    }`}
                  >
                    {(weight * 100).toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Contextual Linguistic Insight Callout */}
          <div className="mt-4 pt-3 border-t border-[#ece7dc] dark:border-[#22242b] text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            {selectedWord.toLowerCase() === 'it' && (
              <p>
                <strong className="text-[#1c1917] dark:text-[#f3f4f6]">Co-reference Resolution:</strong> Notice how the query <code className="font-mono">"it"</code> routes <strong>58%</strong> of its attention weight directly to <strong className="text-[#c2410c] dark:text-[#d97706]">"animal"</strong>, while allocating only 8% to "street". Because animals can become tired but physical streets cannot, self-attention resolves the pronoun's antecedent before passing information downstream!
              </p>
            )}
            {selectedWord.toLowerCase() === 'street' && (
              <p>
                <strong className="text-[#1c1917] dark:text-[#f3f4f6]">Syntactic Object-Action Linking:</strong> The query <code className="font-mono">"street"</code> allocates <strong>45%</strong> of its attention weight back to the transitive verb <strong className="text-[#c2410c] dark:text-[#d97706]">"cross"</strong>, allowing the embedding of "street" to be enriched with the action performed upon it.
              </p>
            )}
            {selectedWord.toLowerCase() !== 'it' && selectedWord.toLowerCase() !== 'street' && (
              <p>
                Every token in the sequence simultaneously computes an attention distribution over all other tokens. Rather than being static, the contextual representation of <strong className="text-[#1c1917] dark:text-[#f3f4f6]">"{selectedWord}"</strong> is dynamically synthesized by pooling features from across the sentence.
              </p>
            )}
          </div>
        </div>

        {/* Educational Note */}
        <div className="text-[11px] font-mono text-[#78716c] dark:text-[#9ca3af] text-center">
          *Note: Attention values shown above are simplified illustrative weights demonstrating linguistic co-reference, not raw activations from a specific pretrained checkpoint.
        </div>
      </div>
    </div>
  );
};
