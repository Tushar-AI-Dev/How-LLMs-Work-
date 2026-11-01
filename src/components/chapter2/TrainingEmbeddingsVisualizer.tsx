import React, { useState } from 'react';
import { ArrowRight, RotateCcw, Cpu, TrendingDown, Layers, Check } from 'lucide-react';

export const TrainingEmbeddingsVisualizer: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<number>(1); // 1 to 4

  const stages = [
    {
      num: 1,
      title: "1. Random Gaussian Initialization (Epoch 0)",
      description: "At the beginning of pre-training, every number in the embedding matrix is initialized to small random values (e.g. Gaussian noise ~ N(0, 0.02)). Words have no semantic arrangement.",
      loss: "11.45 (High)",
      points: [
        { word: "cat", x: -0.6, y: 0.7, color: "#d97706" },
        { word: "dog", x: 0.4, y: -0.8, color: "#d97706" },
        { word: "apple", x: 0.7, y: 0.5, color: "#059669" },
        { word: "orange", x: -0.3, y: -0.5, color: "#059669" },
        { word: "car", x: 0.1, y: 0.8, color: "#0284c7" },
        { word: "bus", x: -0.8, y: -0.2, color: "#0284c7" },
      ],
    },
    {
      num: 2,
      title: "2. Training Contexts & Prediction Error",
      description: "The model encounters billions of text tokens. When reading 'The ___ climbed the tree', the model predicts words. If it predicts an unlikely word, a Cross-Entropy Loss penalty is generated.",
      loss: "6.82 (Decreasing)",
      points: [
        { word: "cat", x: -0.2, y: 0.5, color: "#d97706" },
        { word: "dog", x: 0.1, y: 0.2, color: "#d97706" },
        { word: "apple", x: 0.5, y: -0.2, color: "#059669" },
        { word: "orange", x: 0.2, y: -0.3, color: "#059669" },
        { word: "car", x: -0.4, y: 0.4, color: "#0284c7" },
        { word: "bus", x: -0.6, y: 0.2, color: "#0284c7" },
      ],
    },
    {
      num: 3,
      title: "3. Backpropagation & Gradient Nudges",
      description: "Calculus (the chain rule) flows error backward through every transformer layer into the embedding matrix. Gradients gently push words appearing in similar contexts closer together.",
      loss: "3.14 (Optimizing)",
      points: [
        { word: "cat", x: 0.5, y: 0.6, color: "#d97706" },
        { word: "dog", x: 0.6, y: 0.55, color: "#d97706" },
        { word: "apple", x: 0.6, y: -0.5, color: "#059669" },
        { word: "orange", x: 0.7, y: -0.45, color: "#059669" },
        { word: "car", x: -0.6, y: 0.2, color: "#0284c7" },
        { word: "bus", x: -0.55, y: 0.35, color: "#0284c7" },
      ],
    },
    {
      num: 4,
      title: "4. Converged Semantic Geometry (Trained Model)",
      description: "After trillions of tokens, words with shared semantic patterns have formed structured clusters and geometric relationships. The famous distributional hypothesis: 'You shall know a word by the company it keeps.'",
      loss: "1.28 (Converged)",
      points: [
        { word: "cat", x: 0.68, y: 0.72, color: "#d97706" },
        { word: "dog", x: 0.75, y: 0.65, color: "#d97706" },
        { word: "apple", x: 0.70, y: -0.65, color: "#059669" },
        { word: "orange", x: 0.82, y: -0.55, color: "#059669" },
        { word: "car", x: -0.74, y: 0.28, color: "#0284c7" },
        { word: "bus", x: -0.65, y: 0.42, color: "#0284c7" },
      ],
    },
  ];

  const active = stages[currentStage - 1];

  const toSvgX = (x: number) => 150 + x * 110;
  const toSvgY = (y: number) => 150 - y * 110;

  return (
    <div className="border border-[#e6e0d4] dark:border-[#26282f] bg-white dark:bg-[#141518] rounded-xl p-6 sm:p-8 my-8 shadow-xs">
      <div className="pb-4 border-b border-[#ece7dc] dark:border-[#22242b] mb-6">
        <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
          Section 06 · Training
        </span>
        <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-0.5">
          How Are Embeddings Learned?
        </h3>
        <p className="mt-2 text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
          No human programmer manually positioned "cat" near "dog" or defined feline coordinates. The semantic geometry emerges naturally through gradient descent.
        </p>
      </div>

      {/* Stage Stepper Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {stages.map((st) => (
          <button
            key={st.num}
            onClick={() => setCurrentStage(st.num)}
            className={`p-2.5 rounded-lg text-left text-xs font-mono border transition-all cursor-pointer ${
              currentStage === st.num
                ? 'bg-[#c2410c] dark:bg-[#d97706] text-white border-transparent font-bold shadow-xs'
                : 'bg-[#faf8f5] dark:bg-[#1a1c22] text-[#44403c] dark:text-[#d1d5db] border-[#ded7ca] dark:border-[#282a32] hover:border-[#c2410c]'
            }`}
          >
            <div className="text-[10px] opacity-75">PHASE 0{st.num}</div>
            <div className="truncate font-sans font-medium mt-0.5">
              {st.num === 1 && "Initialization"}
              {st.num === 2 && "Loss Function"}
              {st.num === 3 && "Gradients"}
              {st.num === 4 && "Convergence"}
            </div>
          </button>
        ))}
      </div>

      {/* Visual Canvas and Narrative Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Scatter Plot showing vector clustering changes */}
        <div className="lg:col-span-6 bg-[#faf8f5] dark:bg-[#0c0d10] border border-[#ded7ca] dark:border-[#282a32] rounded-xl p-4 flex flex-col items-center">
          <svg className="w-full max-w-[280px] h-[260px] select-none" viewBox="0 0 300 300">
            {/* Center axes */}
            <line x1="20" y1="150" x2="280" y2="150" stroke="#78716c" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4" />
            <line x1="150" y1="20" x2="150" y2="280" stroke="#78716c" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4" />

            {/* Points transitioning smoothly */}
            {active.points.map((pt) => {
              const cx = toSvgX(pt.x);
              const cy = toSvgY(pt.y);
              return (
                <g key={pt.word} className="transition-all duration-500 ease-out">
                  <circle cx={cx} cy={cy} r="6" fill={pt.color} />
                  <text
                    x={cx + 8}
                    y={cy + 4}
                    fill="currentColor"
                    fontSize="11"
                    fontFamily="monospace"
                    className="text-[#1c1917] dark:text-[#f3f4f6]"
                  >
                    {pt.word}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="text-[11px] font-mono text-[#78716c] dark:text-[#9ca3af] mt-2">
            Training Objective Loss: <span className="font-bold text-[#c2410c] dark:text-[#d97706]">{active.loss}</span>
          </div>
        </div>

        {/* Narrative Description (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <h4 className="font-serif text-lg font-medium text-[#1c1917] dark:text-[#f3f4f6]">
            {active.title}
          </h4>
          <p className="text-sm text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            {active.description}
          </p>

          <div className="p-3 bg-[#faf8f5] dark:bg-[#181920] rounded border border-[#ded7ca] dark:border-[#26282f] text-xs font-mono text-[#44403c] dark:text-[#cbd5e1] space-y-1">
            <span className="text-[10px] text-[#78716c] uppercase block">Parameter Update Formula:</span>
            <code>W_e := W_e - η · ∇_W_e ℒ</code>
            <div className="text-[11px] text-[#78716c] pt-1">
              Where η is the learning rate and ℒ is the next-token cross-entropy error.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
