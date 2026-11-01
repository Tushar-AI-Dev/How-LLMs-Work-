/**
 * Pure vector mathematics and educational embedding datasets
 */

export interface WordVector2D {
  word: string;
  category: 'animals' | 'fruits' | 'vehicles';
  x: number; // coordinate in [-1, 1]
  y: number; // coordinate in [-1, 1]
  color: string;
}

export interface VocabularyEmbedding {
  id: number;
  word: string;
  category: string;
  vector: number[]; // 8-dimensional illustrative vector
}

// 2D Educational Embedding Space dataset
// Geometrically clustered: Animals in top-right, Fruits in bottom-right, Vehicles on the left
export const EMBEDDING_SPACE_WORDS: WordVector2D[] = [
  // Animals cluster
  { word: "cat", category: "animals", x: 0.68, y: 0.72, color: "#d97706" },
  { word: "dog", category: "animals", x: 0.75, y: 0.65, color: "#d97706" },
  { word: "wolf", category: "animals", x: 0.82, y: 0.52, color: "#d97706" },

  // Fruits cluster
  { word: "apple", category: "fruits", x: 0.70, y: -0.65, color: "#059669" },
  { word: "orange", category: "fruits", x: 0.82, y: -0.55, color: "#059669" },
  { word: "banana", category: "fruits", x: 0.60, y: -0.78, color: "#059669" },

  // Vehicles cluster
  { word: "car", category: "vehicles", x: -0.74, y: 0.28, color: "#0284c7" },
  { word: "bus", category: "vehicles", x: -0.65, y: 0.42, color: "#0284c7" },
];

// 8-Dimensional Illustrative Embedding Matrix (We)
// Values are normalized between -1.0 and +1.0
export const LOOKUP_VOCABULARY: VocabularyEmbedding[] = [
  {
    id: 0,
    word: "cat",
    category: "feline / animal",
    vector: [0.72, 0.48, -0.31, 0.15, 0.88, -0.12, 0.64, 0.29],
  },
  {
    id: 1,
    word: "dog",
    category: "canine / animal",
    vector: [0.68, 0.52, -0.28, 0.18, 0.84, -0.09, 0.61, 0.33],
  },
  {
    id: 2,
    word: "apple",
    category: "edible / fruit",
    vector: [-0.15, 0.82, 0.74, -0.45, -0.22, 0.68, -0.38, 0.14],
  },
  {
    id: 3,
    word: "fruit",
    category: "botanical / category",
    vector: [-0.12, 0.79, 0.71, -0.41, -0.25, 0.72, -0.35, 0.11],
  },
  {
    id: 4,
    word: "run",
    category: "action / dynamic",
    vector: [0.35, -0.61, 0.12, 0.84, -0.42, -0.38, 0.21, -0.75],
  },
  {
    id: 5,
    word: "sleep",
    category: "state / rest",
    vector: [-0.42, -0.55, -0.68, -0.71, 0.32, -0.44, 0.18, 0.81],
  },
];

/**
 * Compute the dot product of two vectors
 */
export function dotProduct(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Vectors must have equal length");
  }
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

/**
 * Compute Euclidean norm (magnitude) of a vector
 */
export function vectorNorm(v: number[]): number {
  const sumSq = v.reduce((sum, val) => sum + val * val, 0);
  return Math.sqrt(sumSq);
}

/**
 * Compute true mathematical cosine similarity:
 * cos(u, v) = (u . v) / (||u|| * ||v||)
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  const dot = dotProduct(a, b);
  const normA = vectorNorm(a);
  const normB = vectorNorm(b);

  if (normA === 0 || normB === 0) return 0;
  const sim = dot / (normA * normB);
  // Clamp between -1.0 and 1.0 to guard against precision float errors
  return Math.max(-1, Math.min(1, Number(sim.toFixed(4))));
}

/**
 * Convert cosine similarity to angular distance in degrees:
 * theta = arccos(cosineSim) * (180 / PI)
 */
export function angularDistanceDegrees(cosineSim: number): number {
  const clamped = Math.max(-1, Math.min(1, cosineSim));
  const radians = Math.acos(clamped);
  return Math.round(radians * (180 / Math.PI));
}
