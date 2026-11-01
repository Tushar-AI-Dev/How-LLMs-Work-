import React, { useState } from 'react';
import { Octagon, ShieldAlert, Square, CheckCircle, ArrowRight } from 'lucide-react';

interface StopMechanism {
  id: string;
  name: string;
  trigger: string;
  typicalUse: string;
  icon: React.ReactNode;
  example: string;
}

const MECHANISMS: StopMechanism[] = [
  {
    id: 'eos',
    name: '1. End-Of-Sequence Token (<EOS>)',
    trigger: 'Model internal probability output',
    typicalUse: 'Natural completion of thoughts, sentences, or structured code blocks.',
    icon: <Octagon className="w-5 h-5 text-red-500" />,
    example: 'The student finished reading the chapter. <|im_end|>',
  },
  {
    id: 'max_tokens',
    name: '2. Maximum Generation Ceiling',
    trigger: 'Developer / User API budget parameter',
    typicalUse: 'Prevents infinite generation loops, controls cost and inference latency.',
    icon: <Square className="w-5 h-5 text-amber-500" />,
    example: 'Hard cut after 512, 1024, or 4096 output tokens.',
  },
  {
    id: 'stop_sequence',
    name: '3. Custom Stop Sequences',
    trigger: 'String pattern match in emitted token stream',
    typicalUse: 'Halts multi-turn conversational agents (e.g. "User:", "Human:", "###").',
    icon: <ShieldAlert className="w-5 h-5 text-sky-500" />,
    example: 'Stops immediately when substring "\nUser:" appears.',
  },
];

export const StoppingCriteriaVisualizer: React.FC = () => {
  const [selectedMechanismId, setSelectedMechanismId] = useState<string>('eos');

  const activeMechanism = MECHANISMS.find((m) => m.id === selectedMechanismId) || MECHANISMS[0];

  return (
    <div className="bg-white dark:bg-[#131417] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#ece7dc] dark:border-[#22242b] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            <Octagon className="w-4 h-4" />
            <span>Generation Termination</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            When Does Generation Stop?
          </h4>
        </div>
      </div>

      {/* Mechanism Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        {MECHANISMS.map((m) => {
          const isSelected = selectedMechanismId === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedMechanismId(m.id)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#c2410c] dark:border-[#d97706] bg-amber-500/10 shadow-xs'
                  : 'border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#16171b] hover:border-[#cfc6b5]'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {m.icon}
                <span className="font-serif font-bold text-sm text-[#1c1917] dark:text-[#f3f4f6]">
                  {m.name.split('. ')[1]}
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#78716c] dark:text-[#9ca3af]">
                Trigger: {m.trigger}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail Card */}
      <div className="p-6 rounded-xl border border-[#ece7dc] dark:border-[#26282f] bg-[#faf8f5] dark:bg-[#181a1f] space-y-4">
        <div className="flex items-center justify-between border-b border-[#ece7dc] dark:border-[#26282f] pb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            Termination Mechanics
          </span>
          <span className="text-xs font-mono text-[#78716c] dark:text-[#9ca3af]">
            Trigger: {activeMechanism.trigger}
          </span>
        </div>

        <h5 className="text-lg font-serif font-semibold text-[#1c1917] dark:text-[#f3f4f6]">
          {activeMechanism.name}
        </h5>

        <p className="text-xs sm:text-sm text-[#57534e] dark:text-[#d1d5db] leading-relaxed">
          {activeMechanism.typicalUse}
        </p>

        <div className="p-3 bg-white dark:bg-[#121316] rounded-lg border border-[#ece7dc] dark:border-[#26282f]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-1">
            Example Scenario:
          </span>
          <div className="font-mono text-xs text-[#1c1917] dark:text-[#f3f4f6]">
            {activeMechanism.example}
          </div>
        </div>
      </div>
    </div>
  );
};
