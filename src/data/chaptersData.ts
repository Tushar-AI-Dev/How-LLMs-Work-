import { Chapter, ModelSpec } from '../types';

export const CHAPTERS_DATA: Chapter[] = [
  {
    id: 1,
    number: '01',
    slug: 'from-text-to-tokens',
    title: 'From Text to Tokens',
    subtitle: 'Byte-Pair Encoding, subword vocabularies, and integer mapping',
    summary: 'Explore how arbitrary natural language strings are systematically decomposed into discrete subword units, compressed via Byte-Pair Encoding algorithms, and indexed into mathematical token IDs.',
    readingTime: '12 min',
    mathematicalPrerequisites: ['Discrete set theory', 'Frequency distributions', 'Unicode byte encoding'],
    coreEquation: {
      latex: 'V_{new} = V \\cup \\{ (t_i, t_j) \\mid \\arg\\max \\text{freq}(t_i, t_j) \\}',
      description: 'Iterative byte-pair merging rule maximizing contiguous pair frequency',
    },
    keyConcepts: [
      'Byte-Pair Encoding (BPE)',
      'Vocabulary size trade-offs (32k–128k)',
      'Special tokens (<|endoftext|>, <|im_start|>)',
      'UTF-8 byte fallback mechanisms'
    ],
    status: 'available',
    visualModelType: 'Interactive BPE Tokenizer & Subword Splitter',
    chapterOverview: 'Before a neural network can calculate a single dot product, continuous human prose must be broken into discrete mathematical primitives. This chapter demonstrates the exact algorithms modern LLMs use to convert strings into arrays of integers.'
  },
  {
    id: 2,
    number: '02',
    slug: 'understanding-embeddings',
    title: 'Understanding Embeddings',
    subtitle: 'Mapping discrete tokens into continuous high-dimensional geometric spaces',
    summary: 'Witness how discrete token indices are converted into dense vector coordinates ($d_{\\text{model}} = 4096$) where geometric proximity corresponds to semantic affinity and relational symmetry.',
    readingTime: '15 min',
    mathematicalPrerequisites: ['Vector spaces', 'Euclidean & Cosine distance', 'Matrix lookups'],
    coreEquation: {
      latex: '\\cos(\\mathbf{u}, \\mathbf{v}) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\| \\|\\mathbf{v}\\|}',
      description: 'Cosine similarity metric in high-dimensional latent space',
    },
    keyConcepts: [
      'Lookup table projection: E ∈ R^{|V| × d_model}',
      'Vector dimensionality vs model capacity',
      'Semantic linear arithmetic (King - Man + Woman = Queen)',
      'Token distance metrics in latent space'
    ],
    status: 'available',
    visualModelType: '3D/2D Latent Vector Projection Explorer',
    chapterOverview: 'A token ID is merely an arbitrary integer. To allow neural layers to reason, each token index maps to a row in an embedding matrix, projecting discrete symbols into continuous manifolds where geometry mirrors meaning.'
  },
  {
    id: 3,
    number: '03',
    slug: 'positional-encoding',
    title: 'Positional Encoding',
    subtitle: 'Injecting order and temporal awareness into permutation-invariant networks',
    summary: 'Transformers are inherently permutation-invariant. Discover how sinusoidal frequencies and Rotary Position Embeddings (RoPE) inject sequence order without destroying semantic geometry.',
    readingTime: '14 min',
    mathematicalPrerequisites: ['Trigonometric functions', 'Complex plane rotations', 'Orthogonal transformations'],
    coreEquation: {
      latex: '\\mathbf{R}_{\\Theta, m}^d = \\text{diag}(R_{\\theta_1, m}, \\dots, R_{\\theta_{d/2}, m})',
      description: 'Rotary Position Embedding (RoPE) 2D orthogonal rotation matrix',
    },
    keyConcepts: [
      'Permutation invariance in self-attention',
      'Absolute Sinusoidal Encodings (Vaswani et al.)',
      'Rotary Position Embedding (RoPE in LLaMA)',
      'Context window extrapolation & ALiBi'
    ],
    status: 'available',
    visualModelType: 'Rotary Frequency Wave & Complex Rotation Visualizer',
    chapterOverview: 'Because self-attention treats tokens as an unordered set, models require a mathematical coordinate system for sequence order. We deconstruct how frequency rotations preserve relative token distance across long contexts.'
  },
  {
    id: 4,
    number: '04',
    slug: 'the-attention-mechanism',
    title: 'The Attention Mechanism',
    subtitle: 'Dynamic context routing via Query, Key, and Value dot-product projections',
    summary: 'The mathematical heartbeat of modern intelligence. Dissect how tokens broadcast queries, compare against keys, and compute scaled dot-product attention distributions over sequence history.',
    readingTime: '20 min',
    mathematicalPrerequisites: ['Linear transformations', 'Softmax distribution', 'Matrix multiplication'],
    coreEquation: {
      latex: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{QK^T}{\\sqrt{d_k}} + M \\right) V',
      description: 'Scaled Dot-Product Attention with causal masking matrix M',
    },
    keyConcepts: [
      'Query, Key, and Value vector projections',
      'Scaled dot-product matrix: QK^T / √d_k',
      'Causal triangular masking for autoregressive models',
      'Attention heatmap interpretation across syntax'
    ],
    status: 'available',
    visualModelType: 'Dynamic Q-K-V Matrix & Causal Heatmap Simulator',
    chapterOverview: 'Attention allows every token in a sequence to selectively communicate with every preceding token. We unpack how queries match keys to generate dynamic weighting weights that route value vectors.'
  },
  {
    id: 5,
    number: '05',
    slug: 'inside-a-transformer',
    title: 'Inside a Transformer',
    subtitle: 'Multi-head projections, residual streams, normalization, and MLP layers',
    summary: 'Examine the full architectural stack: stacking Multi-Head Attention, RMSNorm layers, SwiGLU Feed-Forward Networks, and the uninterrupted residual stream that enables deep gradient flow.',
    readingTime: '22 min',
    mathematicalPrerequisites: ['Non-linear activations (GELU, SwiGLU)', 'Layer & RMS Normalization', 'Residual connections'],
    coreEquation: {
      latex: '\\mathbf{x}_{l+1} = \\mathbf{x}_l + \\text{MHA}(\\text{RMSNorm}(\\mathbf{x}_l)) + \\text{FFN}(\\text{RMSNorm}(\\mathbf{x}_l^{\\prime}))',
      description: 'Pre-LayerNorm residual block accumulation rule',
    },
    keyConcepts: [
      'Multi-Head vs Grouped-Query Attention (GQA)',
      'The Residual Stream as a central communication bus',
      'RMSNorm vs LayerNorm numerical stability',
      'SwiGLU Feed-Forward Networks as key-value memory'
    ],
    status: 'available',
    visualModelType: 'Interactive Transformer Block Flowchart & Residual Probe',
    chapterOverview: 'A full transformer combines attention heads with feed-forward memory networks. Learn how residual streams maintain information fidelity while depth allows representations to grow progressively abstract.'
  },
  {
    id: 6,
    number: '06',
    slug: 'how-llms-generate-text',
    title: 'How LLMs Generate Text',
    subtitle: 'Unembedding projections, logits distributions, temperature, and sampling loops',
    summary: 'Follow the final step of generation: projecting hidden states back into vocabulary logits, applying temperature scaling, navigating Top-k / Top-p (nucleus) sampling, and looping autoregressively.',
    readingTime: '16 min',
    mathematicalPrerequisites: ['Probability distributions', 'Logits & temperature calibration', 'Autoregressive sampling'],
    coreEquation: {
      latex: 'P(w_i \\mid w_{<i}) = \\frac{\\exp(z_i / T)}{\\sum_j \\exp(z_j / T)}',
      description: 'Softmax probability with temperature scaling parameter T',
    },
    keyConcepts: [
      'Unembedding head: W_u ∈ R^{d_model × |V|}',
      'Temperature scaling effects on entropy',
      'Top-K vs Top-P (Nucleus) truncation',
      'The KV-Cache inference acceleration'
    ],
    status: 'available',
    visualModelType: 'Live Temperature & Probability Distribution Slider',
    chapterOverview: 'Generation is an autoregressive loop. The model produces unnormalized logits for every word in its vocabulary, scales entropy through temperature, samples the next token, and feeds it back into the sequence.'
  }
];

export const REFERENCE_MODELS: ModelSpec[] = [
  {
    name: 'LLaMA 3',
    creator: 'Meta AI',
    parameters: '8B',
    layers: 32,
    hiddenDim: 4096,
    heads: 32,
    vocabSize: 128256,
    contextWindow: 8192
  },
  {
    name: 'GPT-2 Small',
    creator: 'OpenAI (Foundational)',
    parameters: '124M',
    layers: 12,
    hiddenDim: 768,
    heads: 12,
    vocabSize: 50257,
    contextWindow: 1024
  },
  {
    name: 'Mistral 7B',
    creator: 'Mistral AI',
    parameters: '7.3B',
    layers: 32,
    hiddenDim: 4096,
    heads: 32,
    vocabSize: 32000,
    contextWindow: 32768
  }
];

export const PIPELINE_STAGES = [
  {
    stage: '01',
    name: 'Raw Text Input',
    subtext: 'Arbitrary UTF-8 string',
    math: 'S = "The quick brown fox"',
    output: 'String buffer'
  },
  {
    stage: '02',
    name: 'Tokenization',
    subtext: 'Byte-Pair Encoding (BPE)',
    math: 'T = [464, 2068, 7586, 21831]',
    output: 'Integer tensor [seq_len]'
  },
  {
    stage: '03',
    name: 'Embedding Lookup',
    subtext: 'Discrete index to dense vector',
    math: 'X_0 = W_e[T] \\in \\mathbb{R}^{\\text{seq} \\times d}',
    output: 'Continuous tensor [seq, 4096]'
  },
  {
    stage: '04',
    name: 'Positional Injection',
    subtext: 'Sinusoids or RoPE rotations',
    math: 'X = X_0 + P \\quad \\text{or} \\quad \\text{RoPE}(X_0)',
    output: 'Position-aware tensor'
  },
  {
    stage: '05',
    name: 'Transformer Layers',
    subtext: 'N × (MHA + FFN + Residuals)',
    math: 'X_{l+1} = X_l + \\text{Attn}(X_l) + \\text{FFN}(X_l)',
    output: 'Contextual representation'
  },
  {
    stage: '06',
    name: 'Unembedding & Softmax',
    subtext: 'Logits distribution & sampling',
    math: 'P(t_{next}) = \\text{softmax}(W_u \\cdot X_N / T)',
    output: 'Next token ID sampled'
  }
];
