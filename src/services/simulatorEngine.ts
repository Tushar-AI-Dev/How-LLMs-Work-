// Inside the LLM - Complete Educational Simulator Engine
// Deterministic forward-pass and autoregressive generation pipeline
// connecting Chapters 01 to 06 with strict mathematical consistency.

import {
  tokenizeTextReal,
  TokenDetail,
  GPT2_VOCABULARY_SIZE,
  GPT2_MAX_TOKEN_ID,
  GPT2_EOS_TOKEN_ID,
  decodeTokenIds,
} from './tokenizerService';
import { computeSinusoidalMatrix, addVectors } from './positionalEncodingService';
import { softmax, matmul, transpose } from './attentionService';
import { rmsNorm, silu, linearProjection, residualAdd, computeVectorStats } from './transformerService';
import { applyTopK, applyTopP, sampleFromCandidates, greedyDecode, stableSoftmax } from './generationService';

export const SIMULATOR_D_MODEL = 8;
export const SIMULATOR_D_FF = 16;
export const SIMULATOR_D_K = 8;

export interface TokenRepresentation {
  index: number;
  id: number;
  text: string;
  bytes: number[];
  byteLength: number;
  embedding: number[];
  positional: number[];
  inputVector: number[]; // embedding + positional
  qVector: number[];
  kVector: number[];
  vVector: number[];
  attendedVector: number[];
  residual1: number[];
  ffnVector: number[];
  finalHidden: number[];
}

export interface SimulatorCandidateToken {
  token: string;
  rawToken: string;
  id: number;
  logit: number;
  scaledLogit: number;
  prob: number;
  cumulativeProb: number;
  isRetained: boolean;
}

export interface SimulatorForwardPass {
  rawText: string;
  seqLen: number;
  dModel: number;
  tokens: TokenDetail[];
  tokenReps: TokenRepresentation[];

  // Stage 1: Tokenization
  stage1: {
    tokens: TokenDetail[];
    charCount: number;
    tokenCount: number;
    compressionRatio: number;
    shape: string;
    vocabSize: number;
  };

  // Stage 2: Embeddings
  stage2: {
    embeddingMatrix: number[][]; // [seqLen x dModel]
    sampleVocabRows: { word: string; id: number; vector: number[] }[];
    shape: string;
  };

  // Stage 3: Positional Encoding
  stage3: {
    peMatrix: number[][]; // [seqLen x dModel]
    combinedMatrix: number[][]; // [seqLen x dModel]
    shape: string;
  };

  // Stage 4: Self-Attention
  stage4: {
    Q: number[][];
    K: number[][];
    V: number[][];
    rawScores: number[][]; // Q K^T
    scaledScores: number[][]; // Q K^T / sqrt(d_k)
    causalMask: number[][];
    attentionWeights: number[][]; // Softmax(scaled + mask)
    contextVectors: number[][]; // A x V
    shape: string;
    d_k: number;
  };

  // Stage 5: Transformer Block
  stage5: {
    preNormMatrix: number[][];
    residual1: number[][];
    midNormMatrix: number[][];
    ffnOutput: number[][];
    finalHidden: number[][];
    architecture: 'Pre-Norm' | 'Post-Norm';
    shapes: {
      input: string;
      attention: string;
      residual1: string;
      ffn: string;
      output: string;
    };
  };

  // Stage 6: Next-Token Prediction
  stage6: {
    predictionIndex: number;
    lastHiddenVector: number[];
    candidates: SimulatorCandidateToken[];
    temperature: number;
    topK: number;
    topP: number;
    shape: string;
  };

  // Stage 7: Generation
  stage7: {
    selectedToken: string;
    selectedTokenRaw: string;
    selectedTokenId: number;
    isEOS: boolean;
    samplingMethod: 'greedy' | 'sampling';
    updatedText: string;
    updatedTokens: string[];
    updatedTokenIds: number[];
  };
}

// Deterministic Pseudo-Random Generator for Reproducible Educational Parameters
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 9999 + 1234) * 10000;
  return x - Math.floor(x);
}

// Generate deterministic embedding vector for any token ID
export function getEducationalEmbedding(id: number, dModel = SIMULATOR_D_MODEL): number[] {
  const vec: number[] = [];
  for (let d = 0; d < dModel; d++) {
    // Generate normalized value between -0.9 and +0.9
    const val = (pseudoRandom(id * 17 + d * 31 + 7) * 1.8 - 0.9);
    vec.push(Number(val.toFixed(3)));
  }
  return vec;
}

// Deterministic Projection Weights (8x8)
function getProjectionMatrix(seedOffset: number, rows = 8, cols = 8): number[][] {
  const M: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      const val = (pseudoRandom(seedOffset + r * 13 + c * 29) * 0.8 - 0.4);
      row.push(Number(val.toFixed(3)));
    }
    M.push(row);
  }
  return M;
}

const W_Q = getProjectionMatrix(101);
const W_K = getProjectionMatrix(202);
const W_V = getProjectionMatrix(303);
const W_FFN_1 = getProjectionMatrix(404, SIMULATOR_D_FF, SIMULATOR_D_MODEL);
const W_FFN_2 = getProjectionMatrix(505, SIMULATOR_D_MODEL, SIMULATOR_D_FF);
const B_FFN_1 = new Array(SIMULATOR_D_FF).fill(0.02);
const B_FFN_2 = new Array(SIMULATOR_D_MODEL).fill(0.01);

// Structured candidate token definitions with genuine GPT-2 BPE token IDs and exact subwords
export interface EducationalCandidateDef {
  text: string;
  label: string;
  id: number;
}

export const EDUCATIONAL_CANDIDATE_DEFS: EducationalCandidateDef[] = [
  { text: ' mat', label: 'mat', id: 2603 },
  { text: ' ground', label: 'ground', id: 2323 },
  { text: ' floor', label: 'floor', id: 4314 },
  { text: ' couch', label: 'couch', id: 18507 },
  { text: ' bed', label: 'bed', id: 3996 },
  { text: ' peacefully', label: 'peacefully', id: 30996 },
  { text: ' quietly', label: 'quietly', id: 12703 }, // Genuine GPT-2 token ID (< 50257)
  { text: ' carefully', label: 'carefully', id: 7773 },
  { text: ' slowly', label: 'slowly', id: 6364 },
  { text: ' and', label: 'and', id: 290 },
  { text: ' then', label: 'then', id: 788 },
  { text: ' because', label: 'because', id: 780 },
  { text: ' while', label: 'while', id: 981 },
  { text: ' with', label: 'with', id: 351 },
  { text: ' tokens', label: 'tokens', id: 16326 },
  { text: ' words', label: 'words', id: 2456 },
  { text: ' models', label: 'models', id: 4981 },
  { text: ' sequences', label: 'sequences', id: 16311 },
  { text: '.', label: '.', id: 13 },
  { text: ',', label: ',', id: 11 },
  { text: '!', label: '!', id: 0 },
  { text: ' one', label: 'one', id: 530 },
  { text: ' step', label: 'step', id: 2239 },
  { text: '<|endoftext|>', label: '<EOS>', id: 50256 }, // GPT-2 canonical EOS token
];

export const EDUCATIONAL_CANDIDATE_VOCAB = EDUCATIONAL_CANDIDATE_DEFS.map((c) => c.label);

/**
 * Execute the complete 7-stage LLM forward simulation pass on an input text.
 */
export function runCompleteSimulation(
  rawText: string,
  options: {
    temperature?: number;
    topK?: number;
    topP?: number;
    samplingMethod?: 'greedy' | 'sampling';
    randomRoll?: number;
  } = {}
): SimulatorForwardPass {
  const temperature = Math.max(0.01, options.temperature ?? 0.7);
  const topK = Math.max(1, options.topK ?? 5);
  const topP = Math.max(0.01, Math.min(1.0, options.topP ?? 0.9));
  const samplingMethod = options.samplingMethod ?? 'sampling';

  // 1. Stage 1: Tokenization
  const tokenized = tokenizeTextReal(rawText.trim() || 'The cat sat on the');
  const tokens = tokenized.tokens;
  const seqLen = tokens.length;
  const dModel = SIMULATOR_D_MODEL;

  // 2. Stage 2: Embeddings
  const embeddingMatrix: number[][] = tokens.map((t) => getEducationalEmbedding(t.id, dModel));

  // 3. Stage 3: Positional Encoding (Sinusoidal)
  const peMatrix = computeSinusoidalMatrix(seqLen, dModel);
  const combinedMatrix: number[][] = embeddingMatrix.map((emb, pos) =>
    addVectors(emb, peMatrix[pos])
  );

  // 4. Stage 4: Self-Attention (Pre-Norm Transformer architecture)
  // Pre-Norm Step 1: Pre-RMSNorm on input representations
  const preNorm1 = combinedMatrix.map((vec) => rmsNorm(vec).output);

  // Linear projections for Query, Key, Value
  const Q = matmul(preNorm1, W_Q);
  const K = matmul(preNorm1, W_K);
  const V = matmul(preNorm1, W_V);

  // Raw dot-product: Q K^T
  const KT = transpose(K);
  const rawScores = matmul(Q, KT);

  // Scaled by 1 / sqrt(d_k)
  const sqrtDk = Math.sqrt(SIMULATOR_D_K);
  const scaledScores = rawScores.map((row) => row.map((v) => Number((v / sqrtDk).toFixed(3))));

  // Causal Masking: position i can only attend to j <= i
  const causalMask = scaledScores.map((row, i) =>
    row.map((val, j) => (j > i ? -1e9 : 0))
  );

  const maskedScores = scaledScores.map((row, i) =>
    row.map((val, j) => (j > i ? -1e9 : val))
  );

  const attentionWeights = maskedScores.map((row) => softmax(row));
  const contextVectors = matmul(attentionWeights, V);

  // 5. Stage 5: Transformer Block (Pre-Norm architecture)
  // Step A: Residual 1: x_mid = x_0 + Attention(PreNorm1)
  const residual1 = combinedMatrix.map((vec, i) => residualAdd(vec, contextVectors[i]));

  // Step B: Pre-Norm 2 + FFN + Residual 2
  const preNorm2 = residual1.map((vec) => rmsNorm(vec).output);
  const ffnOutput: number[][] = [];
  const finalHidden: number[][] = [];

  for (let i = 0; i < seqLen; i++) {
    const x = preNorm2[i];
    // Expanded projection to d_ff = 16
    const linear1 = linearProjection(x, W_FFN_1, B_FFN_1);
    // Non-linear activation (SiLU)
    const act = linear1.map((v) => silu(v));
    // Contracted projection back to d_model = 8
    const ffn = linearProjection(act, W_FFN_2, B_FFN_2);
    ffnOutput.push(ffn);

    // Final residual add: x_out = x_mid + FFN(PreNorm2)
    const out = residualAdd(residual1[i], ffn);
    finalHidden.push(out);
  }

  // 6. Stage 6: Next-Token Prediction
  // Take last hidden vector representing current sequence context
  const predictionIndex = seqLen - 1;
  const lastHiddenVector = finalHidden[predictionIndex] || finalHidden[0];

  // Language Modeling Head: projection into vocabulary candidate embeddings (tied weights W_u = W_e^T)
  const rawCandidates = EDUCATIONAL_CANDIDATE_DEFS.map((cand) => {
    // Retrieve genuine embedding for candidate token ID from nominal embedding table W_e
    const candEmb = getEducationalEmbedding(cand.id, dModel);
    // Logit = dot(lastHiddenVector, candEmb)
    let dot = 0;
    for (let d = 0; d < dModel; d++) {
      dot += lastHiddenVector[d] * candEmb[d];
    }

    // Contextual semantic affinity boosts for coherent educational generation
    const lastTokenStr = tokens[tokens.length - 1]?.text.trim().toLowerCase();
    const secondLastStr = tokens.length >= 2 ? tokens[tokens.length - 2]?.text.trim().toLowerCase() : '';

    if (['the', 'a', 'an'].includes(lastTokenStr)) {
      if (['mat', 'floor', 'couch', 'ground', 'bed'].includes(cand.label)) dot += 4.5;
      if (['words', 'tokens', 'models'].includes(cand.label)) dot += 2.0;
    }
    if (['mat', 'floor', 'bed', 'couch'].includes(lastTokenStr)) {
      if (['peacefully', 'quietly', '.', 'and'].includes(cand.label)) dot += 4.8;
    }
    if (['peacefully', 'quietly'].includes(lastTokenStr)) {
      if (['.', 'and'].includes(cand.label)) dot += 5.2;
    }
    if (['parallel', 'and'].includes(lastTokenStr)) {
      if (['tokens', 'words', 'sequences', 'models'].includes(cand.label)) dot += 4.0;
    }
    if (['generate', 'predict', 'process'].includes(lastTokenStr) || lastTokenStr === 'text') {
      if (['one', 'tokens', 'words', 'sequences'].includes(cand.label)) dot += 4.5;
    }
    if (lastTokenStr === 'one') {
      if (['step', 'token', 'word'].includes(cand.label)) dot += 6.0;
    }
    if (['step', 'token'].includes(lastTokenStr)) {
      if (['.', 'and'].includes(cand.label)) dot += 4.0;
    }
    if (lastTokenStr === '.') {
      if (cand.label === '<EOS>') dot += 5.5;
      if (['and', 'then', 'because'].includes(cand.label)) dot += 2.0;
    }

    return {
      token: cand.label,
      rawToken: cand.text,
      id: cand.id,
      logit: Number(dot.toFixed(2)),
    };
  });

  // Scale logits by temperature
  const logits = rawCandidates.map((c) => c.logit);
  const probs = stableSoftmax(logits, temperature);

  const initialCandidates: SimulatorCandidateToken[] = rawCandidates.map((c, idx) => ({
    token: c.token,
    rawToken: c.rawToken,
    id: c.id,
    logit: c.logit,
    scaledLogit: Number((c.logit / temperature).toFixed(2)),
    prob: probs[idx],
    cumulativeProb: 0,
    isRetained: true,
  }));

  // Sort descending by probability
  initialCandidates.sort((a, b) => b.prob - a.prob);

  // Apply Top-K
  const topKFiltered = applyTopK(initialCandidates, topK);

  // Apply Top-P
  const topPFiltered = applyTopP(topKFiltered.renormalized, topP);

  // Mark retention status in master candidate list
  const retainedSet = new Set(topPFiltered.retained.map((r) => r.token));
  const finalCandidates: SimulatorCandidateToken[] = initialCandidates.map((c) => ({
    ...c,
    isRetained: retainedSet.has(c.token),
  }));

  // 7. Stage 7: Next-Token Selection
  let selectedTokenCandidate: SimulatorCandidateToken;
  if (samplingMethod === 'greedy') {
    selectedTokenCandidate = greedyDecode(topPFiltered.retained) as SimulatorCandidateToken;
  } else {
    selectedTokenCandidate = sampleFromCandidates(topPFiltered.retained, options.randomRoll) as SimulatorCandidateToken;
  }

  const selectedToken = selectedTokenCandidate.token;
  const selectedTokenRaw = selectedTokenCandidate.rawToken;
  const selectedTokenId = selectedTokenCandidate.id;
  const isEOS = selectedTokenId === GPT2_EOS_TOKEN_ID || selectedToken === '<EOS>';

  let updatedText = rawText;
  if (!isEOS) {
    const needsTrim =
      rawText.endsWith(' ') ||
      selectedTokenRaw === '.' ||
      selectedTokenRaw === ',' ||
      selectedTokenRaw === '!';
    updatedText = needsTrim
      ? `${rawText.trimEnd()}${selectedTokenRaw}`
      : `${rawText}${selectedTokenRaw}`;
  }

  const updatedTokens = isEOS
    ? [...tokens.map((t) => t.text), '<EOS>']
    : [...tokens.map((t) => t.text), selectedTokenRaw];

  const updatedTokenIds = isEOS
    ? [...tokens.map((t) => t.id), selectedTokenId]
    : [...tokens.map((t) => t.id), selectedTokenId];

  // Token Representations with unified tracking
  const tokenReps: TokenRepresentation[] = tokens.map((t, i) => ({
    index: i,
    id: t.id,
    text: t.text,
    bytes: t.bytes,
    byteLength: t.byteLength,
    embedding: embeddingMatrix[i],
    positional: peMatrix[i],
    inputVector: combinedMatrix[i],
    qVector: Q[i],
    kVector: K[i],
    vVector: V[i],
    attendedVector: contextVectors[i],
    residual1: residual1[i],
    ffnVector: ffnOutput[i],
    finalHidden: finalHidden[i],
  }));

  return {
    rawText,
    seqLen,
    dModel,
    tokens,
    tokenReps,

    stage1: {
      tokens,
      charCount: tokenized.charCount,
      tokenCount: tokenized.tokenCount,
      compressionRatio: tokenized.compressionRatio,
      shape: `[${seqLen}]`,
      vocabSize: GPT2_VOCABULARY_SIZE,
    },

    stage2: {
      embeddingMatrix,
      sampleVocabRows: tokens.slice(0, 4).map((t, idx) => ({
        word: t.text,
        id: t.id,
        vector: embeddingMatrix[idx],
      })),
      shape: `[${seqLen}, ${dModel}]`,
    },

    stage3: {
      peMatrix,
      combinedMatrix,
      shape: `[${seqLen}, ${dModel}]`,
    },

    stage4: {
      Q,
      K,
      V,
      rawScores,
      scaledScores,
      causalMask,
      attentionWeights,
      contextVectors,
      shape: `[${seqLen}, ${dModel}]`,
      d_k: SIMULATOR_D_K,
    },

    stage5: {
      preNormMatrix: preNorm1,
      residual1,
      midNormMatrix: preNorm2,
      ffnOutput,
      finalHidden,
      architecture: 'Pre-Norm',
      shapes: {
        input: `[${seqLen}, ${dModel}]`,
        attention: `[${seqLen}, ${dModel}]`,
        residual1: `[${seqLen}, ${dModel}]`,
        ffn: `[${seqLen}, ${dModel}]`,
        output: `[${seqLen}, ${dModel}]`,
      },
    },

    stage6: {
      predictionIndex,
      lastHiddenVector,
      candidates: finalCandidates,
      temperature,
      topK,
      topP,
      shape: `[${finalCandidates.length}]`,
    },

    stage7: {
      selectedToken,
      selectedTokenRaw,
      selectedTokenId,
      isEOS,
      samplingMethod,
      updatedText,
      updatedTokens,
      updatedTokenIds,
    },
  };
}

/**
 * Self-test suite verifying the complete forward pass and generation invariants
 */
export function runSimulatorEngineTests(): { name: string; passed: boolean; details?: string }[] {
  const tests: { name: string; passed: boolean; details?: string }[] = [];

  try {
    const sim = runCompleteSimulation('The cat sat on the mat');

    // 1. Check sequence length and token IDs validity
    const allIdsValid = sim.tokens.every((t) => t.id >= 0 && t.id <= GPT2_MAX_TOKEN_ID);
    tests.push({
      name: 'Tokenization produces valid GPT-2 token IDs within [0, 50256]',
      passed: sim.seqLen > 0 && allIdsValid,
      details: `Tokens: ${sim.seqLen}, IDs valid: ${allIdsValid}`,
    });

    // 2. Check Embedding dimensions
    tests.push({
      name: 'Embedding matrix shape is [seqLen, 8]',
      passed:
        sim.stage2.embeddingMatrix.length === sim.seqLen &&
        sim.stage2.embeddingMatrix[0].length === SIMULATOR_D_MODEL,
      details: `${sim.stage2.embeddingMatrix.length}x${sim.stage2.embeddingMatrix[0].length}`,
    });

    // 3. Check Positional Encoding sinusoidal formula
    const pe00 = sim.stage3.peMatrix[0][0]; // pos=0, 2i=0 => sin(0) = 0
    const pe01 = sim.stage3.peMatrix[0][1]; // pos=0, 2i+1=1 => cos(0) = 1
    tests.push({
      name: 'Positional encoding matches canonical sinusoidal Vaswani formula',
      passed: Math.abs(pe00 - 0) < 1e-4 && Math.abs(pe01 - 1) < 1e-4,
      details: `P(0,0)=${pe00}, P(0,1)=${pe01}`,
    });

    // 4. Check Causal attention mask zeros future tokens
    let causalValid = true;
    for (let i = 0; i < sim.seqLen; i++) {
      for (let j = i + 1; j < sim.seqLen; j++) {
        if (sim.stage4.attentionWeights[i][j] > 1e-4) {
          causalValid = false;
        }
      }
    }
    tests.push({
      name: 'Attention weights strictly enforce causal upper-triangular masking',
      passed: causalValid,
      details: causalValid ? 'All future attention weights are 0.0' : 'Causal leak detected',
    });

    // 5. Check Attention softmax rows sum to 1.0
    let softmaxSumValid = true;
    for (let i = 0; i < sim.seqLen; i++) {
      const sum = sim.stage4.attentionWeights[i].reduce((a, b) => a + b, 0);
      if (Math.abs(sum - 1.0) > 1e-3) {
        softmaxSumValid = false;
      }
    }
    tests.push({
      name: 'Attention softmax rows normalize to 1.0',
      passed: softmaxSumValid,
      details: softmaxSumValid ? 'Sum = 1.000' : 'Normalization error',
    });

    // 6. Check Transformer Block dimensions
    tests.push({
      name: 'Transformer block output shape preserves [seqLen, 8]',
      passed:
        sim.stage5.finalHidden.length === sim.seqLen &&
        sim.stage5.finalHidden[0].length === SIMULATOR_D_MODEL,
      details: `${sim.stage5.finalHidden.length}x${sim.stage5.finalHidden[0].length}`,
    });

    // 7. Check Next-Token candidate probabilities sum to 1.0 and candidate IDs are valid
    const probSum = sim.stage6.candidates.reduce((a, b) => a + b.prob, 0);
    const candidateIdsValid = sim.stage6.candidates.every(
      (c) => c.id >= 0 && c.id <= GPT2_MAX_TOKEN_ID
    );
    tests.push({
      name: 'Next-token probabilities sum to 1.0 and candidates use valid GPT-2 token IDs',
      passed: Math.abs(probSum - 1.0) < 1e-3 && candidateIdsValid,
      details: `Prob Sum = ${probSum.toFixed(3)}, Candidate IDs valid: ${candidateIdsValid}`,
    });

    // 8. Check Selected token ID validity and decoding fidelity
    const selectedIdValid =
      sim.stage7.selectedTokenId >= 0 && sim.stage7.selectedTokenId <= GPT2_MAX_TOKEN_ID;
    const decodedStr = decodeTokenIds([sim.stage7.selectedTokenId]);
    tests.push({
      name: 'Selected token has valid ID in [0, 50256] and decodes cleanly',
      passed: selectedIdValid && decodedStr === sim.stage7.selectedTokenRaw,
      details: `ID ${sim.stage7.selectedTokenId} -> "${decodedStr}"`,
    });
  } catch (err: any) {
    tests.push({
      name: 'Forward simulation pass execution',
      passed: false,
      details: err.message,
    });
  }

  return tests;
}
