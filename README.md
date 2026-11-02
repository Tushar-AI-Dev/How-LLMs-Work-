# Inside the LLM — Interactive Visual Guide & Transformer Simulator

**Inside the LLM** is an interactive scientific publication and end-to-end educational laboratory that demystifies how modern decoder-only Large Language Models transform raw text into contextual representations and generate tokens step by step.

---

## 1. Project Overview

Designed with an **Editorial + Scientific Hybrid** aesthetic inspired by *Distill.pub*, *3Blue1Brown*, and *Stripe Press*, **Inside the LLM** combines six structured interactive chapters, an experimental Playground, and a complete seven-stage **LLM Simulator**:

- **Chapters 01–06:** Step-by-step interactive essays covering Tokenization, Embeddings, Positional Encoding, Self-Attention, Transformer Blocks, and Autoregressive Text Generation.
- **The LLM Playground:** Six isolated experimental sandboxes for testing mathematical parameters and inspecting real-time vector and matrix transformations.
- **The Complete LLM Simulator:** A unified seven-stage educational laboratory that traces a user prompt through every mathematical stage of a decoder-only Transformer using deterministic, inspectable 8-dimensional educational weights.

---

## 2. The Seven Learning Stages (LLM Simulator)

1. **Stage 01 — Tokenization (Byte-Pair Encoding):** Decomposes raw UTF-8 strings into subword tokens using the authentic **GPT-2 R50K BPE** vocabulary ($|V| = 50,257$) and maps them to integer vocabulary IDs.
2. **Stage 02 — Token Embeddings:** Projects discrete integer IDs into continuous 8-dimensional vector coordinates ($\mathbf{e}_i = W_e[t_i]$).
3. **Stage 03 — Positional Encoding:** Injects sequence order via canonical Vaswani sinusoidal waves ($\mathbf{x}_0 = \mathbf{e} + P$).
4. **Stage 04 — Scaled Dot-Product Self-Attention:** Projects Queries ($Q$), Keys ($K$), and Values ($V$), applies $\frac{1}{\sqrt{d_k}}$ scaling and lower-triangular causal masking ($-\infty$), and computes context-aggregated vectors.
5. **Stage 05 — Pre-Norm Transformer Block:** Routes representations through Root Mean Square Layer Normalization (`RMSNorm`), residual highway connections, and a `SiLU` Feed-Forward Network ($d_{\text{model}} = 8 \to d_{\text{ff}} = 16 \to d_{\text{model}} = 8$).
6. **Stage 06 — Next-Token Prediction (Logits & Softmax):** Projects the final hidden state through a weight-tied unembedding head ($W_u = W_e^T$) across a curated 24-token candidate subset and applies temperature-scaled Softmax, Top-$K$, and Top-$P$ filtering.
7. **Stage 07 — Educational Autoregressive Generation Loop:** Demonstrates how a single token is selected via Greedy (`ArgMax`) or Stochastic Sampling (with live Temperature, Top-$K$, and Top-$P$ controls), appended to the input sequence, and fed back into Stage 01 for the next forward pass.

---

## 3. Scientific Transparency & Future Roadmap

- **Deterministic Educational Weights (Current Implementation):**
  All seven stages of the simulator currently operate on compact, deterministic, untrained 8-dimensional educational parameters ($d_{\text{model}} = 8, d_{\text{ff}} = 16$). This design ensures the application loads instantaneously in any browser with zero gigabyte model downloads and allows every vector coordinate, dot product, and softmax probability to be verified by hand. Because these weights were not trained on a natural language corpus, Stage 07 is explicitly labeled as an educational numerical demonstration rather than a pretrained language generator.
- **Future Roadmap (Pretrained Remote Inference):**
  Integration with real pretrained remote LLM inference is planned for a future version of **Inside the LLM**, but is not currently implemented.

---

## 4. Architecture & Technologies

- **Frontend Framework:** React 19 + TypeScript + Vite
- **Styling & Typography:** Tailwind CSS v4 (`Fraunces` editorial serif, `Plus Jakarta Sans` UI sans, `JetBrains Mono` numerical & tensor inspection)
- **Mathematical Rendering:** KaTeX (`katex`)
- **Tokenizer Engine:** `gpt-tokenizer` (Authentic GPT-2 R50K Byte-Pair Encoding)

---

## 5. Installation, Local Development & Verification

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```
The application runs at `http://localhost:3000`.

### Run TypeScript Check & Simulator Audit Suite
```bash
npm run lint
npx tsx src/tests/simulatorAudit.test.ts
```

### Production Build
```bash
npm run build
npm run preview
```
