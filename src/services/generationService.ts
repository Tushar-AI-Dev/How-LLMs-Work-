// Inside the LLM - Chapter 06: How LLMs Generate Text
// Numerically stable mathematical functions for logits, softmax,
// temperature scaling, greedy decoding, top-k, top-p (nucleus) sampling,
// and an educational deterministic toy language model.

export interface CandidateToken {
  token: string;
  rawToken?: string;
  id?: number;
  logit: number;
  scaledLogit?: number;
  prob: number;
  filteredProb?: number;
  cumulativeProb?: number;
  isRetained?: boolean;
}

export interface FilteringResult {
  allCandidates: CandidateToken[];
  retained: CandidateToken[];
  excluded: CandidateToken[];
  selectedToken: CandidateToken;
  samplingMethod: 'greedy' | 'sampling';
  temperature: number;
  topK: number;
  topP: number;
}

/**
 * Numerically stable Softmax calculation:
 * P(i) = exp(z_i - max(z)) / sum(exp(z_j - max(z)))
 *
 * Prevents floating-point overflow for large positive logits.
 */
export function stableSoftmax(logits: number[], temperature: number = 1.0): number[] {
  if (logits.length === 0) return [];

  // Protect against division by zero or extreme near-zero temperature
  const temp = Math.max(0.001, temperature);

  // Scale logits by temperature
  const scaledLogits = logits.map((z) => z / temp);

  // Find max scaled logit for numerical stability
  const maxLogit = Math.max(...scaledLogits);

  // Compute exponentiated differences
  const expScores = scaledLogits.map((z) => Math.exp(z - maxLogit));

  // Compute partition function (sum of exponentials)
  const sumExp = expScores.reduce((acc, val) => acc + val, 0);

  if (sumExp === 0 || !Number.isFinite(sumExp)) {
    // Fallback: uniform distribution if numeric underflow occurs
    return new Array(logits.length).fill(1 / logits.length);
  }

  return expScores.map((score) => score / sumExp);
}

/**
 * Applies Temperature Scaling to logits:
 * z'_i = z_i / T
 */
export function scaleLogits(logits: number[], temperature: number = 1.0): number[] {
  const temp = Math.max(0.001, temperature);
  return logits.map((z) => z / temp);
}

/**
 * Greedy Decoding: Always selects the candidate with the highest logit/probability.
 */
export function greedyDecode(candidates: CandidateToken[]): CandidateToken {
  if (candidates.length === 0) {
    throw new Error('Candidate list cannot be empty.');
  }

  let best = candidates[0];
  for (let i = 1; i < candidates.length; i++) {
    if (candidates[i].prob > best.prob) {
      best = candidates[i];
    }
  }
  return best;
}

/**
 * Top-K Filtering:
 * Retains only the k highest-scoring tokens, sets all other probabilities to zero,
 * and renormalizes remaining probabilities so they sum strictly to 1.0.
 */
export function applyTopK(
  candidates: CandidateToken[],
  k: number
): {
  retained: CandidateToken[];
  excluded: CandidateToken[];
  renormalized: CandidateToken[];
} {
  const effectiveK = Math.max(1, Math.min(k, candidates.length));

  // Sort descending by probability
  const sorted = [...candidates].sort((a, b) => b.prob - a.prob);

  const retained = sorted.slice(0, effectiveK).map((c) => ({ ...c, isRetained: true }));
  const excluded = sorted.slice(effectiveK).map((c) => ({ ...c, isRetained: false }));

  // Renormalize retained tokens
  const retainedSum = retained.reduce((acc, c) => acc + c.prob, 0);
  const reNorm = retainedSum > 0 ? retainedSum : 1;

  const renormalized = retained.map((c) => ({
    ...c,
    filteredProb: c.prob / reNorm,
  }));

  return { retained, excluded, renormalized };
}

/**
 * Top-P (Nucleus) Filtering:
 * Retains the smallest set of tokens whose cumulative probability reaches or exceeds threshold p.
 * Renormalizes remaining tokens so they sum strictly to 1.0.
 */
export function applyTopP(
  candidates: CandidateToken[],
  p: number
): {
  retained: CandidateToken[];
  excluded: CandidateToken[];
  renormalized: CandidateToken[];
  cutoffIndex: number;
} {
  const threshold = Math.max(0.01, Math.min(1.0, p));

  // Sort descending by probability
  const sorted = [...candidates].sort((a, b) => b.prob - a.prob);

  let cumulativeSum = 0;
  let cutoffIndex = 0;

  for (let i = 0; i < sorted.length; i++) {
    cumulativeSum += sorted[i].prob;
    sorted[i].cumulativeProb = cumulativeSum;
    cutoffIndex = i;
    if (cumulativeSum >= threshold) {
      break;
    }
  }

  const retained = sorted.slice(0, cutoffIndex + 1).map((c) => ({ ...c, isRetained: true }));
  const excluded = sorted.slice(cutoffIndex + 1).map((c) => ({ ...c, isRetained: false }));

  // Renormalize retained tokens
  const retainedSum = retained.reduce((acc, c) => acc + c.prob, 0);
  const reNorm = retainedSum > 0 ? retainedSum : 1;

  const renormalized = retained.map((c) => ({
    ...c,
    filteredProb: c.prob / reNorm,
  }));

  return { retained, excluded, renormalized, cutoffIndex };
}

/**
 * Cumulative Distribution Sampling:
 * Given a probability distribution, samples a token according to its probability mass.
 */
export function sampleFromCandidates(
  candidates: CandidateToken[],
  randomRoll?: number
): CandidateToken {
  if (candidates.length === 0) {
    throw new Error('Candidates list cannot be empty.');
  }

  const roll = randomRoll !== undefined ? randomRoll : Math.random();
  let cumulative = 0;

  for (const candidate of candidates) {
    cumulative += candidate.filteredProb !== undefined ? candidate.filteredProb : candidate.prob;
    if (roll <= cumulative) {
      return candidate;
    }
  }

  // Fallback to last candidate
  return candidates[candidates.length - 1];
}

/**
 * Combined Generation Step:
 * Applies temperature scaling -> Softmax -> Top-K / Top-P filtering -> Sampling / Greedy.
 */
export function computeNextTokenDistribution(
  rawCandidates: { token: string; logit: number }[],
  options: {
    temperature: number;
    topK: number;
    topP: number;
    samplingMethod: 'greedy' | 'sampling';
    randomRoll?: number;
  }
): FilteringResult {
  const { temperature, topK, topP, samplingMethod, randomRoll } = options;

  // 1. Temperature-scaled softmax probabilities
  const logits = rawCandidates.map((c) => c.logit);
  const scaledLogits = scaleLogits(logits, temperature);
  const probs = stableSoftmax(logits, temperature);

  const initialCandidates: CandidateToken[] = rawCandidates.map((c, i) => ({
    token: c.token,
    logit: c.logit,
    scaledLogit: scaledLogits[i],
    prob: probs[i],
  }));

  // Sort descending
  initialCandidates.sort((a, b) => b.prob - a.prob);

  // 2. Apply Top-K filtering
  const topKRes = applyTopK(initialCandidates, topK);

  // 3. Apply Top-P filtering on retained candidates from Top-K
  const topPRes = applyTopP(topKRes.renormalized, topP);

  // Combine excluded
  const excluded = [...topKRes.excluded, ...topPRes.excluded];

  // 4. Select token
  let selectedToken: CandidateToken;
  if (samplingMethod === 'greedy') {
    selectedToken = greedyDecode(topPRes.renormalized);
  } else {
    selectedToken = sampleFromCandidates(topPRes.renormalized, randomRoll);
  }

  return {
    allCandidates: initialCandidates,
    retained: topPRes.renormalized,
    excluded,
    selectedToken,
    samplingMethod,
    temperature,
    topK,
    topP,
  };
}

// ==========================================
// EDUCATIONAL DETERMINISTIC TOY LANGUAGE MODEL
// ==========================================

export interface GenerationStepState {
  step: number;
  prefix: string[];
  newToken: string;
  details: FilteringResult;
}

export const TOY_PROMPTS = [
  {
    id: 'cat',
    label: 'The cat slept on the...',
    tokens: ['The', 'cat', 'slept', 'on', 'the'],
  },
  {
    id: 'animal',
    label: "The animal didn't cross because it was...",
    tokens: ['The', 'animal', "didn't", 'cross', 'because', 'it', 'was'],
  },
  {
    id: 'library',
    label: 'In the quiet library, the student...',
    tokens: ['In', 'the', 'quiet', 'library', ',', 'the', 'student'],
  },
  {
    id: 'future',
    label: 'Language models generate text one...',
    tokens: ['Language', 'models', 'generate', 'text', 'one'],
  },
];

/**
 * Deterministic toy vocabulary and context scoring rules.
 * Simulates how an LLM assigns logits to next candidate tokens based on immediate context.
 */
export function getToyModelLogits(currentTokens: string[]): { token: string; logit: number }[] {
  const lastToken = currentTokens[currentTokens.length - 1]?.toLowerCase() || '';
  const secondLastToken = currentTokens[currentTokens.length - 2]?.toLowerCase() || '';
  const contextStr = currentTokens.slice(-4).join(' ').toLowerCase();

  // "The cat slept on the..."
  if (contextStr.includes('slept on the') || lastToken === 'the') {
    if (contextStr.includes('cat')) {
      return [
        { token: 'mat', logit: 4.8 },
        { token: 'rug', logit: 4.1 },
        { token: 'couch', logit: 3.5 },
        { token: 'floor', logit: 2.8 },
        { token: 'bed', logit: 2.2 },
        { token: 'roof', logit: 0.9 },
        { token: 'moon', logit: -1.2 },
        { token: 'syntax', logit: -2.8 },
        { token: '<EOS>', logit: -4.5 },
      ];
    }
  }

  // After "mat", "rug", "couch", "bed"
  if (['mat', 'rug', 'couch', 'floor', 'bed'].includes(lastToken)) {
    return [
      { token: 'peacefully', logit: 4.5 },
      { token: '.', logit: 4.2 },
      { token: 'all', logit: 3.1 },
      { token: 'until', logit: 2.5 },
      { token: 'without', logit: 1.2 },
      { token: 'whispered', logit: -0.8 },
      { token: 'subword', logit: -3.2 },
      { token: '<EOS>', logit: 0.5 },
    ];
  }

  // After "peacefully"
  if (lastToken === 'peacefully') {
    return [
      { token: '.', logit: 5.6 },
      { token: 'in', logit: 3.2 },
      { token: 'under', logit: 2.1 },
      { token: 'and', logit: 1.8 },
      { token: '<EOS>', logit: 3.8 },
    ];
  }

  // "it was..."
  if (lastToken === 'was' && secondLastToken === 'it') {
    return [
      { token: 'tired', logit: 5.2 },
      { token: 'frightened', logit: 3.8 },
      { token: 'injured', logit: 3.1 },
      { token: 'exhausted', logit: 2.9 },
      { token: 'curious', logit: 1.4 },
      { token: 'asleep', logit: 0.6 },
      { token: 'purple', logit: -1.5 },
      { token: '<EOS>', logit: -3.0 },
    ];
  }

  // After "tired", "frightened", "exhausted"
  if (['tired', 'frightened', 'injured', 'exhausted'].includes(lastToken)) {
    return [
      { token: '.', logit: 5.8 },
      { token: 'and', logit: 3.6 },
      { token: 'after', logit: 2.4 },
      { token: 'from', logit: 1.5 },
      { token: '<EOS>', logit: 4.2 },
    ];
  }

  // "the student..."
  if (lastToken === 'student') {
    return [
      { token: 'read', logit: 4.9 },
      { token: 'opened', logit: 4.2 },
      { token: 'studied', logit: 3.7 },
      { token: 'whispered', logit: 2.6 },
      { token: 'slept', logit: 1.8 },
      { token: 'calculated', logit: 0.5 },
      { token: 'shouted', logit: -2.0 },
      { token: '<EOS>', logit: -4.0 },
    ];
  }

  // After "read", "opened", "studied"
  if (['read', 'opened', 'studied'].includes(lastToken)) {
    return [
      { token: 'a', logit: 4.8 },
      { token: 'the', logit: 4.3 },
      { token: 'their', logit: 3.2 },
      { token: 'quietly', logit: 2.7 },
      { token: 'notes', logit: 1.9 },
      { token: '<EOS>', logit: -2.5 },
    ];
  }

  // After "a" or "the" following student action
  if ((lastToken === 'a' || lastToken === 'the') && (secondLastToken === 'read' || secondLastToken === 'opened')) {
    return [
      { token: 'book', logit: 5.4 },
      { token: 'notebook', logit: 4.1 },
      { token: 'chapter', logit: 3.6 },
      { token: 'manuscript', logit: 2.5 },
      { token: 'laptop', logit: 2.0 },
      { token: 'sandwich', logit: -1.8 },
      { token: '<EOS>', logit: -3.5 },
    ];
  }

  // "Language models generate text one..."
  if (lastToken === 'one') {
    return [
      { token: 'token', logit: 6.2 },
      { token: 'step', logit: 4.5 },
      { token: 'word', logit: 3.8 },
      { token: 'day', logit: 0.9 },
      { token: 'sandwich', logit: -3.5 },
      { token: '<EOS>', logit: -5.0 },
    ];
  }

  // After "token" or "step"
  if (['token', 'step', 'word'].includes(lastToken)) {
    return [
      { token: 'at', logit: 6.5 },
      { token: 'by', logit: 3.2 },
      { token: '.', logit: 2.1 },
      { token: '<EOS>', logit: 0.8 },
    ];
  }

  if (lastToken === 'at') {
    return [
      { token: 'a', logit: 6.8 },
      { token: 'once', logit: 1.5 },
      { token: 'night', logit: -1.0 },
    ];
  }

  if (lastToken === 'a' && secondLastToken === 'at') {
    return [
      { token: 'time', logit: 7.2 },
      { token: 'moment', logit: 2.4 },
      { token: 'rate', logit: 1.1 },
    ];
  }

  // After period "."
  if (lastToken === '.') {
    return [
      { token: '<EOS>', logit: 5.5 },
      { token: 'This', logit: 3.8 },
      { token: 'They', logit: 3.2 },
      { token: 'It', logit: 3.0 },
      { token: 'However', logit: 2.1 },
    ];
  }

  // Generic fallback candidates
  return [
    { token: 'carefully', logit: 3.5 },
    { token: 'forward', logit: 2.9 },
    { token: 'slowly', logit: 2.4 },
    { token: 'again', logit: 1.8 },
    { token: '.', logit: 1.2 },
    { token: '<EOS>', logit: 0.5 },
    { token: 'quantum', logit: -1.5 },
  ];
}
