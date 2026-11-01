/**
 * Pure numerical service for Attention Mechanism calculations.
 * Implements deterministic matrix algebra, scaled dot-product attention,
 * numerically stable softmax, causal masking, and multi-head projections.
 */

// Basic vector dot product
export function dot(u: number[], v: number[]): number {
  if (u.length !== v.length) {
    throw new Error(`Dimension mismatch: u(${u.length}) vs v(${v.length})`);
  }
  let sum = 0;
  for (let i = 0; i < u.length; i++) {
    sum += u[i] * v[i];
  }
  return sum;
}

// Matrix transpose A^T
export function transpose(A: number[][]): number[][] {
  const rows = A.length;
  const cols = A[0].length;
  const AT: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      AT[c][r] = A[r][c];
    }
  }
  return AT;
}

// Matrix multiplication C = A x B
export function matmul(A: number[][], B: number[][]): number[][] {
  const rowsA = A.length;
  const colsA = A[0].length;
  const rowsB = B.length;
  const colsB = B[0].length;

  if (colsA !== rowsB) {
    throw new Error(`Cannot multiply matrices of shape (${rowsA}x${colsA}) and (${rowsB}x${colsB})`);
  }

  const C: number[][] = Array.from({ length: rowsA }, () => Array(colsB).fill(0));

  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      let sum = 0;
      for (let k = 0; k < colsA; k++) {
        sum += A[i][k] * B[k][j];
      }
      C[i][j] = sum;
    }
  }
  return C;
}

// Numerically stable Softmax for a vector of logits
// Uses the max subtraction trick: exp(x_i - max(x)) / sum(exp(x_j - max(x)))
// to prevent floating-point overflow.
export function softmax(scores: number[], temperature = 1.0): number[] {
  if (scores.length === 0) return [];
  const temp = Math.max(0.01, temperature);

  // Filter out negative infinities for finding max
  const finiteScores = scores.filter((s) => s > -1e8);
  if (finiteScores.length === 0) {
    // If all scores are masked, return uniform or zeros
    return scores.map(() => 0);
  }

  const maxVal = Math.max(...finiteScores.map((s) => s / temp));

  const exps = scores.map((s) => {
    if (s <= -1e8) return 0;
    return Math.exp(s / temp - maxVal);
  });

  const sumExps = exps.reduce((acc, val) => acc + val, 0);
  if (sumExps === 0) {
    return scores.map(() => 0);
  }

  return exps.map((e) => e / sumExps);
}

export interface AttentionComputation {
  rawScores: number[][]; // Q K^T
  scaledScores: number[][]; // Q K^T / sqrt(d_k)
  maskedScores: number[][]; // after applying causal mask (if causal)
  attentionWeights: number[][]; // softmax probabilities
  output: number[][]; // A x V
  d_k: number;
}

// Scaled Dot-Product Attention:
// Attention(Q, K, V) = softmax((Q K^T / sqrt(d_k)) + M) V
export function scaledDotProductAttention(
  Q: number[][],
  K: number[][],
  V: number[][],
  causal = false
): AttentionComputation {
  const numQueries = Q.length;
  const d_k = Q[0].length;
  const numKeys = K.length;

  // 1. Raw scores = Q x K^T  (shape: numQueries x numKeys)
  const KT = transpose(K);
  const rawScores = matmul(Q, KT);

  // 2. Scaled scores = rawScores / sqrt(d_k)
  const scaleFactor = Math.sqrt(d_k);
  const scaledScores: number[][] = rawScores.map((row) =>
    row.map((val) => val / scaleFactor)
  );

  // 3. Masked scores: if causal, position i can only attend to j <= i
  const maskedScores: number[][] = scaledScores.map((row, i) =>
    row.map((val, j) => {
      if (causal && j > i) {
        return -1e9; // Negative infinity for softmax masking
      }
      return val;
    })
  );

  // 4. Softmax per row
  const attentionWeights: number[][] = maskedScores.map((row) => softmax(row));

  // 5. Output = AttentionWeights x V (shape: numQueries x d_v)
  const output = matmul(attentionWeights, V);

  return {
    rawScores,
    scaledScores,
    maskedScores,
    attentionWeights,
    output,
    d_k,
  };
}

// Deterministic educational dataset for the 4-token sequence: "The cat sat calmly"
export const MINI_ATTENTION_SEQUENCE = ['The', 'cat', 'sat', 'calmly'];

// Input representations X (4 tokens x 4 dimensions)
export const MINI_X: number[][] = [
  [0.8, -0.4, 0.6, 0.2], // "The" (determiner)
  [1.2, 0.9, -0.3, 0.7], // "cat" (subject noun)
  [-0.5, 0.8, 1.1, -0.4], // "sat" (action verb)
  [0.3, -0.2, 0.5, 0.9], // "calmly" (adverb)
];

// Projection matrices (4x4): W_Q, W_K, W_V
export const MINI_W_Q: number[][] = [
  [0.4, -0.2, 0.3, 0.1],
  [0.1, 0.6, -0.4, 0.5],
  [-0.3, 0.2, 0.7, -0.1],
  [0.5, 0.1, 0.2, 0.4],
];

export const MINI_W_K: number[][] = [
  [0.3, 0.5, -0.2, 0.1],
  [-0.2, 0.4, 0.6, -0.3],
  [0.4, -0.1, 0.3, 0.5],
  [0.2, 0.3, 0.1, 0.4],
];

export const MINI_W_V: number[][] = [
  [0.5, 0.1, 0.3, -0.2],
  [0.2, 0.7, -0.1, 0.4],
  [-0.4, 0.3, 0.6, 0.1],
  [0.3, -0.2, 0.4, 0.5],
];

// Co-reference resolution example sentence:
// "The animal didn't cross the street because it was tired."
export const COREFERENCE_TOKENS = [
  'The',
  'animal',
  "didn't",
  'cross',
  'the',
  'street',
  'because',
  'it',
  'was',
  'tired',
];

// Realistic educational attention weights for the co-reference sentence
// Highlighting how "it" attends heavily to "animal" (co-reference) vs "street"
export const COREFERENCE_ATTENTION_MAP: Record<string, number[]> = {
  it: [0.03, 0.58, 0.02, 0.04, 0.02, 0.08, 0.05, 0.06, 0.04, 0.08], // "it" resolves to "animal"!
  animal: [0.15, 0.35, 0.05, 0.12, 0.04, 0.08, 0.02, 0.03, 0.04, 0.12],
  street: [0.02, 0.06, 0.03, 0.45, 0.22, 0.15, 0.02, 0.01, 0.01, 0.03], // "street" connects to "cross"
  cross: [0.04, 0.28, 0.21, 0.18, 0.05, 0.19, 0.01, 0.01, 0.01, 0.02],
  tired: [0.02, 0.42, 0.05, 0.02, 0.01, 0.01, 0.08, 0.22, 0.11, 0.06], // "tired" links back to "animal" & "it"
};

// 4 distinct Attention Heads for Multi-Head Attention demonstration
export interface AttentionHeadData {
  id: number;
  name: string;
  linguisticRole: string;
  description: string;
  matrix: number[][]; // 4x4 attention matrix
}

export const MULTI_HEAD_SAMPLES: AttentionHeadData[] = [
  {
    id: 1,
    name: 'Head 1: Syntactic Subject-Verb Agreement',
    linguisticRole: 'Connects verbs to their primary subjects',
    description: 'Specializes in tracking grammatical relations across tokens (e.g., matching "sat" back to "cat").',
    matrix: [
      [0.65, 0.25, 0.07, 0.03],
      [0.2, 0.6, 0.15, 0.05],
      [0.05, 0.72, 0.18, 0.05], // "sat" focuses strongly on "cat" (0.72)
      [0.02, 0.12, 0.68, 0.18], // "calmly" modifies "sat" (0.68)
    ],
  },
  {
    id: 2,
    name: 'Head 2: Local Positional Neighbor Focus',
    linguisticRole: 'Focuses on immediate previous tokens (Bigram / Trigram)',
    description: 'High diagonal and sub-diagonal weights capturing immediate neighboring words and punctuation.',
    matrix: [
      [0.9, 0.1, 0.0, 0.0],
      [0.45, 0.55, 0.0, 0.0],
      [0.1, 0.48, 0.42, 0.0],
      [0.05, 0.15, 0.5, 0.3],
    ],
  },
  {
    id: 3,
    name: 'Head 3: Action-Modifier Linking',
    linguisticRole: 'Connects adverbs to verbal predicates',
    description: 'Links qualifiers, descriptors, and adverbs ("calmly") to the predicate ("sat").',
    matrix: [
      [0.7, 0.15, 0.1, 0.05],
      [0.15, 0.7, 0.1, 0.05],
      [0.1, 0.2, 0.5, 0.2],
      [0.05, 0.1, 0.65, 0.2], // "calmly" heavily attends to "sat" (0.65)
    ],
  },
  {
    id: 4,
    name: 'Head 4: Broad Context / Delimiter Broadcaster',
    linguisticRole: 'Distributes attention evenly across sentential history',
    description: 'Acts as a global broadcaster, maintaining diffuse background context across the whole phrase.',
    matrix: [
      [0.25, 0.25, 0.25, 0.25],
      [0.28, 0.32, 0.2, 0.2],
      [0.22, 0.26, 0.32, 0.2],
      [0.21, 0.24, 0.28, 0.27],
    ],
  },
];

// Self-test suite verifying the math functions
export function runAttentionServiceTests(): { name: string; passed: boolean; error?: string }[] {
  const tests: { name: string; passed: boolean; error?: string }[] = [];

  // 1. Test Dot Product
  try {
    const d = dot([1, 2, 3], [4, 5, 6]); // 4 + 10 + 18 = 32
    tests.push({ name: 'dot product computation', passed: Math.abs(d - 32) < 1e-6 });
  } catch (err: any) {
    tests.push({ name: 'dot product computation', passed: false, error: err.message });
  }

  // 2. Test Softmax sum to 1
  try {
    const s = softmax([2.0, 1.0, 0.1]);
    const sum = s.reduce((a, b) => a + b, 0);
    tests.push({ name: 'softmax normalization sum = 1.0', passed: Math.abs(sum - 1.0) < 1e-5 });
  } catch (err: any) {
    tests.push({ name: 'softmax normalization sum = 1.0', passed: false, error: err.message });
  }

  // 3. Test Causal Masking
  try {
    const Q = [[1, 0], [0, 1]];
    const K = [[1, 0], [0, 1]];
    const V = [[1, 2], [3, 4]];
    const res = scaledDotProductAttention(Q, K, V, true);
    // In causal mode, position 0 attending to position 1 must be 0
    const zeroFuture = res.attentionWeights[0][1] === 0;
    tests.push({ name: 'causal future token mask is 0.0', passed: zeroFuture });
  } catch (err: any) {
    tests.push({ name: 'causal future token mask is 0.0', passed: false, error: err.message });
  }

  return tests;
}
