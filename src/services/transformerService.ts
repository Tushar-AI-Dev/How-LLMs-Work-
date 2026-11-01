// Inside the LLM - Chapter 05: Inside a Transformer
// Deterministic numerical mathematical service for Transformer sublayers,
// Residual connections, LayerNorm/RMSNorm, and Feed-Forward Networks.

export interface VectorNormStats {
  mean: number;
  variance: number;
  stdDev: number;
  rms: number;
  l2Norm: number;
}

export interface LayerNormResult {
  mean: number;
  variance: number;
  stdDev: number;
  centered: number[];
  standardized: number[];
  output: number[];
}

export interface RMSNormResult {
  rms: number;
  output: number[];
}

export interface FFNLayerResult {
  input: number[];
  expandedLinear: number[];
  activated: number[];
  output: number[];
  activationType: 'relu' | 'gelu' | 'silu';
}

/**
 * Computes mean, variance, standard deviation, RMS, and L2 norm of a vector.
 */
export function computeVectorStats(vec: number[], eps: number = 1e-5): VectorNormStats {
  const d = vec.length;
  if (d === 0) {
    return { mean: 0, variance: 0, stdDev: 0, rms: 0, l2Norm: 0 };
  }

  const sum = vec.reduce((a, b) => a + b, 0);
  const mean = sum / d;

  const sqDiffSum = vec.reduce((acc, val) => acc + (val - mean) ** 2, 0);
  const variance = sqDiffSum / d;
  const stdDev = Math.sqrt(variance + eps);

  const sqSum = vec.reduce((acc, val) => acc + val ** 2, 0);
  const rms = Math.sqrt(sqSum / d + eps);
  const l2Norm = Math.sqrt(sqSum);

  return { mean, variance, stdDev, rms, l2Norm };
}

/**
 * Standard Layer Normalization:
 * LN(x) = gamma * ((x - mu) / sqrt(sigma^2 + eps)) + beta
 */
export function layerNorm(
  vec: number[],
  gamma: number[] = [],
  beta: number[] = [],
  eps: number = 1e-5
): LayerNormResult {
  const d = vec.length;
  const stats = computeVectorStats(vec, eps);

  const centered = vec.map((val) => val - stats.mean);
  const standardized = centered.map((val) => val / stats.stdDev);

  const effectiveGamma = gamma.length === d ? gamma : new Array(d).fill(1.0);
  const effectiveBeta = beta.length === d ? beta : new Array(d).fill(0.0);

  const output = standardized.map((z, i) => z * effectiveGamma[i] + effectiveBeta[i]);

  return {
    mean: stats.mean,
    variance: stats.variance,
    stdDev: stats.stdDev,
    centered,
    standardized,
    output,
  };
}

/**
 * Root Mean Square Normalization (RMSNorm - used in LLaMA, PaLM, Gemma, Mistral):
 * RMSNorm(x) = gamma * (x / RMS(x))
 */
export function rmsNorm(
  vec: number[],
  gamma: number[] = [],
  eps: number = 1e-5
): RMSNormResult {
  const d = vec.length;
  const stats = computeVectorStats(vec, eps);
  const effectiveGamma = gamma.length === d ? gamma : new Array(d).fill(1.0);

  const output = vec.map((val, i) => (val / stats.rms) * effectiveGamma[i]);

  return {
    rms: stats.rms,
    output,
  };
}

/**
 * Activation function: ReLU(z) = max(0, z)
 */
export function relu(z: number): number {
  return Math.max(0, z);
}

/**
 * Activation function: GELU (Gaussian Error Linear Unit)
 * Approximation: 0.5 * z * (1 + tanh(sqrt(2/pi) * (z + 0.044715 * z^3)))
 */
export function gelu(z: number): number {
  const k = Math.sqrt(2 / Math.PI);
  return 0.5 * z * (1 + Math.tanh(k * (z + 0.044715 * z ** 3)));
}

/**
 * Activation function: SiLU / Swish(z) = z * sigmoid(z)
 */
export function silu(z: number): number {
  return z / (1 + Math.exp(-z));
}

/**
 * Vector-matrix multiplication with bias: y = Wx + b
 * x is (d_in), W is (d_out x d_in), b is (d_out)
 */
export function linearProjection(x: number[], W: number[][], b?: number[]): number[] {
  const dOut = W.length;
  const dIn = x.length;
  const out: number[] = new Array(dOut).fill(0);

  for (let i = 0; i < dOut; i++) {
    let sum = b && b[i] !== undefined ? b[i] : 0;
    for (let j = 0; j < dIn; j++) {
      sum += (W[i][j] || 0) * x[j];
    }
    out[i] = sum;
  }
  return out;
}

/**
 * Residual Vector Addition: y = x + F(x)
 */
export function residualAdd(x: number[], fx: number[]): number[] {
  const len = Math.min(x.length, fx.length);
  const result: number[] = new Array(len);
  for (let i = 0; i < len; i++) {
    result[i] = x[i] + fx[i];
  }
  return result;
}

/**
 * Cosine similarity between two vectors.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

/**
 * Two-layer position-wise Feed-Forward Network:
 * FFN(x) = W2 * act(W1 * x + b1) + b2
 */
export function runFFN(
  x: number[],
  W1: number[][],
  b1: number[],
  W2: number[][],
  b2: number[],
  activationType: 'relu' | 'gelu' | 'silu' = 'gelu'
): FFNLayerResult {
  const expandedLinear = linearProjection(x, W1, b1);
  const actFn = activationType === 'relu' ? relu : activationType === 'gelu' ? gelu : silu;
  const activated = expandedLinear.map((val) => actFn(val));
  const output = linearProjection(activated, W2, b2);

  return {
    input: [...x],
    expandedLinear,
    activated,
    output,
    activationType,
  };
}

// Preset weights for interactive FFN demo (d_model = 4, d_ff = 8)
export const DEFAULT_FFN_W1: number[][] = [
  [0.82, -0.45, 0.31, 0.12],
  [-0.15, 0.94, -0.62, 0.41],
  [0.64, 0.28, 0.85, -0.33],
  [-0.72, -0.18, 0.49, 0.91],
  [0.39, 0.77, -0.25, -0.58],
  [-0.44, 0.11, 0.68, 0.34],
  [0.55, -0.83, 0.19, -0.22],
  [0.21, 0.42, 0.51, 0.76],
];

export const DEFAULT_FFN_B1: number[] = [0.05, -0.1, 0.15, -0.05, 0.08, 0.0, -0.12, 0.04];

export const DEFAULT_FFN_W2: number[][] = [
  [0.45, -0.32, 0.61, -0.18, 0.29, -0.54, 0.38, 0.15],
  [-0.22, 0.71, 0.14, -0.41, 0.63, 0.25, -0.33, 0.48],
  [0.58, -0.19, 0.82, 0.35, -0.47, 0.66, 0.12, -0.29],
  [-0.31, 0.44, -0.28, 0.79, 0.18, -0.37, 0.52, 0.61],
];

export const DEFAULT_FFN_B2: number[] = [-0.02, 0.06, -0.04, 0.01];

// Preset example vectors for Chapter 5 interactive explorations
export const PRESET_TRANSFORMER_VECTORS = [
  {
    name: 'Token: "sleeps" (Balanced)',
    desc: 'Moderate variance, typical activation magnitudes after multi-head attention.',
    vector: [1.42, -0.85, 2.18, -1.04],
  },
  {
    name: 'Token: "because" (High Variance)',
    desc: 'Large activation skew, significant outlier dimension requiring normalization.',
    vector: [4.85, -2.91, 0.45, -6.12],
  },
  {
    name: 'Token: "tired" (Mean Drifted)',
    desc: 'Uncentered activations with positive baseline bias (+2.1 mean).',
    vector: [2.8, 3.4, 1.9, 3.1],
  },
  {
    name: 'Token: "The" (Low Norm)',
    desc: 'Syntactic determiner with low energy and subtle directionality.',
    vector: [0.35, -0.22, 0.18, -0.41],
  },
];
