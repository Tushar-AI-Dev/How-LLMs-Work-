import React, { useState } from 'react';
import { LatexRenderer } from '../ui/LatexRenderer';
import { HelpCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export const TokenIdExplainer: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'common' | 'subwords' | 'punctuation' | 'numbers'>('common');

  const categories = {
    common: [
      { token: "The", id: 464, explanation: "High frequency sentence-starter with capitalized T" },
      { token: " cat", id: 3797, explanation: "Common noun with leading space" },
      { token: " is", id: 318, explanation: "Auxiliary verb with leading space" },
      { token: " sleeping", id: 5633, explanation: "Participle verb merged into a single token" },
      { token: " understand", id: 3831, explanation: "Base verb with leading space" },
    ],
    subwords: [
      { token: "un", id: 2841, explanation: "Common English negation prefix" },
      { token: "forget", id: 19402, explanation: "Root morpheme" },
      { token: "table", id: 1102, explanation: "Common suffix morpheme" },
      { token: "ing", id: 278, explanation: "Frequent present participle suffix" },
      { token: "tion", id: 290, explanation: "Noun suffix formed from verbs" },
    ],
    punctuation: [
      { token: ".", id: 13, explanation: "Period punctuation mark" },
      { token: ",", id: 11, explanation: "Comma separator" },
      { token: "!", id: 0, explanation: "Exclamation point in some vocabularies" },
      { token: "?", id: 30, explanation: "Question mark" },
      { token: '"', id: 1, explanation: "Double quotation mark" },
    ],
    numbers: [
      { token: "1", id: 16, explanation: "Single digit character" },
      { token: "2", id: 17, explanation: "Single digit character" },
      { token: "123", id: 10265, explanation: "Multi-digit cluster merged due to frequency" },
      { token: "2026", id: 35142, explanation: "Year cluster token" },
      { token: " 42", id: 3266, explanation: "Number with leading whitespace" },
    ],
  };

  const currentList = categories[selectedCategory];

  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-8 shadow-xs">
      <div className="pb-4 border-b border-[#ece7dc] dark:border-[#22242b] mb-6">
        <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
          Section 05
        </span>
        <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
          Understanding Token IDs: Identifiers, Not Magnitudes
        </h3>
        <p className="mt-2 text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          Every token is mapped to an integer index. It is critical to recognize what this integer is—and what it is not.
        </p>
      </div>

      {/* The 3 Core Rules of Token IDs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-[#faf8f5] dark:bg-[#18191f] rounded-lg border border-[#ded7ca] dark:border-[#26282f]">
          <span className="font-mono text-xs font-bold text-[#c2410c] dark:text-[#d97706] block mb-1">
            01. IDs Are Not Values
          </span>
          <p className="text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            Token ID <strong>3797</strong> (<code>" cat"</code>) is not "worth more" or "ten times larger" than Token ID <strong>318</strong> (<code>" is"</code>). They are arbitrary categorical indices.
          </p>
        </div>

        <div className="p-4 bg-[#faf8f5] dark:bg-[#18191f] rounded-lg border border-[#ded7ca] dark:border-[#26282f]">
          <span className="font-mono text-xs font-bold text-[#c2410c] dark:text-[#d97706] block mb-1">
            02. No Inherent Arithmetic
          </span>
          <p className="text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            The neural network does not add or multiply ID numbers directly. Doing math on IDs (e.g. <code>ID 10 + ID 20 = ID 30</code>) produces nonsensical garbage words.
          </p>
        </div>

        <div className="p-4 bg-[#faf8f5] dark:bg-[#18191f] rounded-lg border border-[#ded7ca] dark:border-[#26282f]">
          <span className="font-mono text-xs font-bold text-[#c2410c] dark:text-[#d97706] block mb-1">
            03. Matrix Lookup Keys
          </span>
          <p className="text-xs text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            The only purpose of a Token ID is to specify <strong>which row</strong> to retrieve from the learned embedding matrix:
            <code className="block mt-1 font-mono text-[11px] text-[#1c1917] dark:text-[#f3f4f6]">
              x = EmbeddingMatrix[ID]
            </code>
          </p>
        </div>
      </div>

      {/* Interactive Token-to-ID Mapping Table */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af]">
            Interactive Token-to-ID Mapping Table
          </span>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5">
            {(['common', 'subwords', 'punctuation', 'numbers'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-xs font-mono rounded cursor-pointer transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#1c1917] text-white dark:bg-[#f3f4f6] dark:text-[#111215] font-bold'
                    : 'bg-[#f4efe6] dark:bg-[#1f2127] text-[#57534e] dark:text-[#9ca3af]'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-[#ded7ca] dark:border-[#282a32] rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#f4efe6] dark:bg-[#1a1c22] border-b border-[#ded7ca] dark:border-[#282a32] text-[#78716c] dark:text-[#9ca3af]">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Token Representation</th>
                <th className="py-2.5 px-4 font-semibold">Assigned Token ID</th>
                <th className="py-2.5 px-4 font-semibold hidden sm:table-cell">Linguistic Context</th>
                <th className="py-2.5 px-4 font-semibold text-right">Embedding Row</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ece7dc] dark:divide-[#22242b] bg-white dark:bg-[#141518]">
              {currentList.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#faf8f5] dark:hover:bg-[#191b22] transition-colors">
                  <td className="py-2.5 px-4 font-bold text-[#1c1917] dark:text-[#f3f4f6]">
                    "{item.token.replace(' ', '␣')}"
                  </td>
                  <td className="py-2.5 px-4 text-[#c2410c] dark:text-[#d97706] font-bold tabular-data">
                    #{item.id}
                  </td>
                  <td className="py-2.5 px-4 text-[#57534e] dark:text-[#9ca3af] hidden sm:table-cell font-sans">
                    {item.explanation}
                  </td>
                  <td className="py-2.5 px-4 text-right text-[#78716c] dark:text-[#9ca3af] tabular-data">
                    W_e[{item.id}]
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
