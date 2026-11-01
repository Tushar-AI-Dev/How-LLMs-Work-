import React, { useState } from 'react';
import { Container } from '../components/layout/Container';
import { tokenizeTextReal } from '../services/tokenizerService';
import { PlaygroundNav, PlaygroundTab } from '../components/playground/PlaygroundNav';
import { SharedContextBar, PLAYGROUND_PRESETS } from '../components/playground/SharedContextBar';
import { TokenizerExperiment } from '../components/playground/TokenizerExperiment';
import { EmbeddingExperiment } from '../components/playground/EmbeddingExperiment';
import { PositionalExperiment } from '../components/playground/PositionalExperiment';
import { AttentionExperiment } from '../components/playground/AttentionExperiment';
import { TransformerBlockExperiment } from '../components/playground/TransformerBlockExperiment';
import { GenerationExperiment } from '../components/playground/GenerationExperiment';
import { MetricsExperiment } from '../components/playground/MetricsExperiment';

export const PlaygroundPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PlaygroundTab>('tokenizer');
  const [sentence, setSentence] = useState<string>(PLAYGROUND_PRESETS[0].text);

  // Compute live token count for the shared sequence
  const tokenized = tokenizeTextReal(sentence);
  const tokenCount = tokenized.tokenCount;

  const handleReset = () => {
    setSentence(PLAYGROUND_PRESETS[0].text);
  };

  return (
    <div className="py-10 sm:py-16 space-y-8 sm:space-y-12">
      <Container>
        {/* Monograph Header */}
        <div className="max-w-3xl pb-6 border-b border-[#e6e0d4] dark:border-[#26282f]">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#c2410c] dark:text-[#d97706] mb-2 font-semibold">
            <span>Interactive Scientific Laboratory</span>
            <span>·</span>
            <span>All Mechanical Stages</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] tracking-tight">
            The LLM Playground
          </h1>
          <p className="mt-3.5 text-base sm:text-lg text-[#57534e] dark:text-[#9ca3af] leading-relaxed">
            Explore the internal mechanisms of a language model. Change parameters, inspect representations and experiment with how information flows.
          </p>
        </div>

        {/* Shared Session Context Bar */}
        <div className="my-6">
          <SharedContextBar
            sentence={sentence}
            onSentenceChange={setSentence}
            tokenCount={tokenCount}
            onReset={handleReset}
          />
        </div>

        {/* Experiment Navigation Tabs */}
        <div className="mb-8">
          <PlaygroundNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Active Experiment Stage */}
        <div className="mt-6">
          {activeTab === 'tokenizer' && (
            <TokenizerExperiment sentence={sentence} onSentenceChange={setSentence} />
          )}

          {activeTab === 'embeddings' && (
            <EmbeddingExperiment sentence={sentence} />
          )}

          {activeTab === 'positional' && (
            <PositionalExperiment sentence={sentence} />
          )}

          {activeTab === 'attention' && (
            <AttentionExperiment sentence={sentence} />
          )}

          {activeTab === 'transformer' && (
            <TransformerBlockExperiment />
          )}

          {activeTab === 'generation' && (
            <GenerationExperiment />
          )}

          {activeTab === 'metrics' && (
            <MetricsExperiment />
          )}
        </div>
      </Container>
    </div>
  );
};
