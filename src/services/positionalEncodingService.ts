/**
 * Pure mathematical service for Sinusoidal Positional Encoding & Vector Arithmetic
 * Based on Vaswani et al. (2017) "Attention Is All You Need"
 */

export interface PositionalEncodingParams {
  seqLen: number; // number of positions (e.g. 16)
  dModel: number; // dimension size (must be even, e.g. 16 or 32)
}

/**
 * Compute the classic sinusoidal positional encoding matrix:
 * PE(pos, 2i)   = sin(pos / 10000^(2i / d_model))
 * PE(pos, 2i+1) = cos(pos / 10000^(2i / d_model))
 * where i is the frequency pair index: i in [0, d_model / 2 - 1]
 */
export function computeSinusoidalMatrix(seqLen: number, dModel: number): number[][] {
  const matrix: number[][] = [];

  for (let pos = 0; pos < seqLen; pos++) {
    const row: number[] = new Array(dModel).fill(0);
    const numPairs = Math.floor(dModel / 2);

    for (let i = 0; i < numPairs; i++) {
      // Frequency denominator for dimension pair 2i and 2i+1: 10000^(2i / dModel)
      const denominator = Math.pow(10000, (2 * i) / dModel);

      const sinVal = Math.sin(pos / denominator);
      const cosVal = Math.cos(pos / denominator);

      row[2 * i] = Number(sinVal.toFixed(4));
      if (2 * i + 1 < dModel) {
        row[2 * i + 1] = Number(cosVal.toFixed(4));
      }
    }
    matrix.push(row);
  }

  return matrix;
}

/**
 * Calculate the frequency (omega) for dimension pair i:
 * omega = 1 / (10000^(2i / dModel))
 * wavelength = 2 * PI / omega
 */
export function getDimensionFrequency(i: number, dModel: number): {
  omega: number;
  wavelength: number;
} {
  const denominator = Math.pow(10000, (2 * i) / dModel);
  const omega = 1 / denominator;
  const wavelength = (2 * Math.PI) / omega;
  return {
    omega: Number(omega.toFixed(6)),
    wavelength: Number(wavelength.toFixed(2)),
  };
}

/**
 * Illustrative token embedding vectors (4D) for vector addition simulation
 */
export const SAMPLE_ADDITION_TOKENS: Record<string, number[]> = {
  cat: [0.72, 0.48, -0.31, 0.88],
  dog: [0.68, 0.52, -0.28, 0.84],
  chased: [-0.15, 0.82, 0.74, -0.45],
  the: [0.12, -0.25, 0.08, 0.35],
};

/**
 * Vector element-wise addition: tokenVector + peVector
 */
export function addVectors(tokenVec: number[], peVec: number[]): number[] {
  if (tokenVec.length !== peVec.length) {
    throw new Error("Vectors must have equal length for addition");
  }
  return tokenVec.map((val, idx) => Number((val + peVec[idx]).toFixed(4)));
}
