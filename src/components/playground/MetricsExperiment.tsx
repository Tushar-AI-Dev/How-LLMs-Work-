import React, { useState } from 'react';
import { REFERENCE_MODELS } from '../../data/chaptersData';
import { ModelSpec } from '../../types';
import { Callout } from '../ui/Callout';
import { Cpu, Calculator, Layers, HardDrive } from 'lucide-react';

export const MetricsExperiment: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<ModelSpec>(REFERENCE_MODELS[0]);

  // Custom Hyperparameters
  const [seqLen, setSeqLen] = useState<number>(2048);
  const [hiddenDim, setHiddenDim] = useState<number>(selectedModel.hiddenDim);
  const [numLayers, setNumLayers] = useState<number>(selectedModel.layers);
  const [numHeads, setNumHeads] = useState<number>(selectedModel.heads);
  const [vocabSize, setVocabSize] = useState<number>(selectedModel.vocabSize);

  // Sync when preset model is selected
  const handleModelPreset = (model: ModelSpec) => {
    setSelectedModel(model);
    setHiddenDim(model.hiddenDim);
    setNumLayers(model.layers);
    setNumHeads(model.heads);
    setVocabSize(model.vocabSize);
  };

  // Dimensional Computations
  const headDim = Math.round(hiddenDim / numHeads);

  // Attention Matrix: seqLen * seqLen * sizeof(fp32 in MB)
  const attentionMatrixElements = seqLen * seqLen;
  const attentionMemoryMB = ((attentionMatrixElements * 4) / (1024 * 1024)).toFixed(2);

  // KV Cache per token: 2 * layers * hiddenDim * 2 bytes (fp16)
  const kvCacheBytesPerToken = 2 * numLayers * hiddenDim * 2;
  const kvCacheTotalMB = ((kvCacheBytesPerToken * seqLen) / (1024 * 1024)).toFixed(1);

  // Embedding Matrix Parameters: vocabSize * hiddenDim
  const embeddingParamsM = ((vocabSize * hiddenDim) / 1_000_000).toFixed(1);

  // Approximate total parameters
  const approxLayerParams = 12 * hiddenDim * hiddenDim;
  const approxTotalParamsB = (
    (approxLayerParams * numLayers + vocabSize * hiddenDim * 2) /
    1_000_000_000
  ).toFixed(2);

  return (
    <div className="space-y-8">
      {/* Experiment Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#ece7dc] dark:border-[#26282f]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold">
            <span>Laboratory Tool</span>
            <span>·</span>
            <span>System Scaling & Memory</span>
          </div>
          <h2 className="text-2xl font-serif font-medium text-[#1c1917] dark:text-[#f3f4f6] mt-1">
            Architecture & Tensor Memory Calculator
          </h2>
        </div>
      </div>

      {/* Model Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] mr-2">
          Reference Architectures:
        </span>
        {REFERENCE_MODELS.map((model) => (
          <button
            key={model.name}
            onClick={() => handleModelPreset(model)}
            className={`
              px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer
              ${
                selectedModel.name === model.name
                  ? 'bg-[#1c1917] text-white dark:bg-[#f3f4f6] dark:text-[#111215]'
                  : 'bg-white dark:bg-[#141518] text-[#57534e] dark:text-[#9ca3af] border border-[#ded7ca] dark:border-[#282a32] hover:text-[#1c1917] dark:hover:text-[#f3f4f6]'
              }
            `}
          >
            {model.name} ({model.parameters})
          </button>
        ))}
      </div>

      {/* Two-Column Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Controls & Sliders */}
        <div className="lg:col-span-5 bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6 space-y-6">
          <h3 className="font-serif text-lg font-medium text-[#1c1917] dark:text-[#f3f4f6] pb-3 border-b border-[#ece7dc] dark:border-[#22242b]">
            Architectural Hyperparameters
          </h3>

          {/* Sequence Length */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-[#57534e] dark:text-[#9ca3af]">Sequence Length (L):</span>
              <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">{seqLen} tokens</span>
            </div>
            <input
              type="range"
              min="512"
              max="8192"
              step="512"
              value={seqLen}
              onChange={(e) => setSeqLen(Number(e.target.value))}
              className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#78716c] font-mono mt-1">
              <span>512</span>
              <span>4096</span>
              <span>8192</span>
            </div>
          </div>

          {/* Hidden Dimension */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-[#57534e] dark:text-[#9ca3af]">Hidden Dim (d_model):</span>
              <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">{hiddenDim}</span>
            </div>
            <input
              type="range"
              min="768"
              max="8192"
              step="256"
              value={hiddenDim}
              onChange={(e) => setHiddenDim(Number(e.target.value))}
              className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
            />
          </div>

          {/* Number of Layers */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-[#57534e] dark:text-[#9ca3af]">Transformer Layers (N):</span>
              <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">{numLayers}</span>
            </div>
            <input
              type="range"
              min="6"
              max="80"
              step="2"
              value={numLayers}
              onChange={(e) => setNumLayers(Number(e.target.value))}
              className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
            />
          </div>

          {/* Attention Heads */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-[#57534e] dark:text-[#9ca3af]">Attention Heads (H):</span>
              <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">{numHeads}</span>
            </div>
            <input
              type="range"
              min="8"
              max="64"
              step="4"
              value={numHeads}
              onChange={(e) => setNumHeads(Number(e.target.value))}
              className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
            />
            <div className="text-[11px] text-[#78716c] dark:text-[#9ca3af] font-mono mt-1">
              Per-Head Dim (d_k) = {headDim}
            </div>
          </div>

          {/* Vocabulary Size */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-[#57534e] dark:text-[#9ca3af]">Vocabulary Size (|V|):</span>
              <span className="font-semibold text-[#1c1917] dark:text-[#f3f4f6]">{vocabSize.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="32000"
              max="128256"
              step="8000"
              value={vocabSize}
              onChange={(e) => setVocabSize(Number(e.target.value))}
              className="w-full accent-[#c2410c] dark:accent-[#d97706] cursor-pointer"
            />
          </div>
        </div>

        {/* Right: Tensor Metrics Output */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-[#141518] border border-[#e6e0d4] dark:border-[#26282f] rounded-xl p-6">
            <span className="text-xs font-mono uppercase tracking-wider text-[#c2410c] dark:text-[#d97706] font-semibold block mb-1">
              Real-Time Computations
            </span>
            <h3 className="font-serif text-xl font-medium text-[#1c1917] dark:text-[#f3f4f6] mb-6">
              Memory & Parameter Breakdown
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#faf8f5] dark:bg-[#181a20] rounded border border-[#ece7dc] dark:border-[#26282f]">
                <span className="text-xs text-[#78716c] dark:text-[#9ca3af] block font-mono">
                  Estimated Parameter Count
                </span>
                <div className="text-2xl font-mono font-semibold text-[#1c1917] dark:text-[#f3f4f6] mt-1 tabular-data">
                  ~{approxTotalParamsB} B
                </div>
                <span className="text-[11px] text-[#78716c] dark:text-[#9ca3af]">
                  Parameters across {numLayers} blocks
                </span>
              </div>

              <div className="p-4 bg-[#faf8f5] dark:bg-[#181a20] rounded border border-[#ece7dc] dark:border-[#26282f]">
                <span className="text-xs text-[#78716c] dark:text-[#9ca3af] block font-mono">
                  Attention Matrix Footprint
                </span>
                <div className="text-2xl font-mono font-semibold text-[#1c1917] dark:text-[#f3f4f6] mt-1 tabular-data">
                  {attentionMemoryMB} MB
                </div>
                <span className="text-[11px] text-[#78716c] dark:text-[#9ca3af]">
                  [{seqLen} × {seqLen}] quadratic scaling per head
                </span>
              </div>

              <div className="p-4 bg-[#faf8f5] dark:bg-[#181a20] rounded border border-[#ece7dc] dark:border-[#26282f]">
                <span className="text-xs text-[#78716c] dark:text-[#9ca3af] block font-mono">
                  KV-Cache Memory at Context
                </span>
                <div className="text-2xl font-mono font-semibold text-[#c2410c] dark:text-[#d97706] mt-1 tabular-data">
                  {kvCacheTotalMB} MB
                </div>
                <span className="text-[11px] text-[#78716c] dark:text-[#9ca3af]">
                  Memory reserved per batch user
                </span>
              </div>

              <div className="p-4 bg-[#faf8f5] dark:bg-[#181a20] rounded border border-[#ece7dc] dark:border-[#26282f]">
                <span className="text-xs text-[#78716c] dark:text-[#9ca3af] block font-mono">
                  Embedding Matrix Parameters
                </span>
                <div className="text-2xl font-mono font-semibold text-[#1c1917] dark:text-[#f3f4f6] mt-1 tabular-data">
                  {embeddingParamsM} M
                </div>
                <span className="text-[11px] text-[#78716c] dark:text-[#9ca3af]">
                  [|V|: {vocabSize} × d: {hiddenDim}]
                </span>
              </div>
            </div>

            {/* Tensor Shape Schematic */}
            <div className="mt-6 pt-5 border-t border-[#ece7dc] dark:border-[#26282f]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#78716c] dark:text-[#9ca3af] block mb-2">
                Activation Flow Dimensions
              </span>
              <div className="p-3 bg-[#faf8f5] dark:bg-[#0f1013] rounded border border-[#ece7dc] dark:border-[#26282f] font-mono text-xs text-[#1c1917] dark:text-[#f3f4f6] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#78716c] dark:text-[#9ca3af]">Input Tokens (T):</span>
                  <span>[batch, {seqLen}]</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716c] dark:text-[#9ca3af]">Hidden State (X):</span>
                  <span>[batch, {seqLen}, {hiddenDim}]</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716c] dark:text-[#9ca3af]">Q, K, V Per Head:</span>
                  <span>[batch, {numHeads}, {seqLen}, {headDim}]</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716c] dark:text-[#9ca3af]">Logits Projection:</span>
                  <span>[batch, {seqLen}, {vocabSize}]</span>
                </div>
              </div>
            </div>
          </div>

          <Callout type="note" title="Quadratic Attention Memory Bottleneck">
            Notice how the raw attention matrix memory footprint scales quadratically as O(L²). Doubling context length from 2,048 to 4,096 quadruples memory requirements for attention logits, necessitating FlashAttention and KV-cache optimizations.
          </Callout>
        </div>
      </div>
    </div>
  );
};
