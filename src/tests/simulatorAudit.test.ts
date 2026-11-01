// Inside the LLM - Complete LLM Simulator Technical Audit Test Suite
// Verifies mathematical and architectural consistency of Chapters 01-06 pipeline.

import {
  tokenizeTextReal,
  decodeTokenIds,
  GPT2_VOCABULARY_SIZE,
  GPT2_MAX_TOKEN_ID,
  GPT2_EOS_TOKEN_ID,
} from '../services/tokenizerService';
import { computeSinusoidalMatrix, addVectors } from '../services/positionalEncodingService';
import { runCompleteSimulation, SIMULATOR_D_MODEL, SIMULATOR_D_FF, SIMULATOR_D_K, EDUCATIONAL_CANDIDATE_DEFS } from '../services/simulatorEngine';
import { stableSoftmax, applyTopK, applyTopP, greedyDecode } from '../services/generationService';
import { rmsNorm } from '../services/transformerService';

interface TestRecord {
  category: string;
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
}

const results: TestRecord[] = [];

function assert(category: string, name: string, condition: boolean, expected: string, actual: string) {
  results.push({
    category,
    name,
    passed: condition,
    expected,
    actual,
  });
}

export function runAllAuditTests(): TestRecord[] {
  // =========================================================================
  // GROUP 1: TOKENIZER VOCABULARY & ID RANGE AUDIT
  // =========================================================================
  const testInputs = [
    'The cat sat on the mat',
    'quietly',
    ' quietly',
    'Transformers process tokens in parallel',
    'Language models generate text one step at a time.',
    '<|endoftext|>',
  ];

  assert(
    'Tokenizer',
    'Vocabulary size matches GPT-2 R50K standard',
    GPT2_VOCABULARY_SIZE === 50257,
    '50257',
    String(GPT2_VOCABULARY_SIZE)
  );

  for (const input of testInputs) {
    const res = tokenizeTextReal(input);
    const inRange = res.tokens.every((t) => t.id >= 0 && t.id <= GPT2_MAX_TOKEN_ID);
    assert(
      'Tokenizer',
      `Token IDs for "${input.slice(0, 20)}" within [0, ${GPT2_MAX_TOKEN_ID}]`,
      inRange,
      `All IDs <= ${GPT2_MAX_TOKEN_ID}`,
      `IDs: [${res.ids.join(', ')}]`
    );

    // Bidirectional consistency
    const reconstructed = decodeTokenIds(res.ids);
    assert(
      'Tokenizer',
      `Bidirectional decode matches input: "${input.slice(0, 20)}"`,
      reconstructed === input,
      JSON.stringify(input),
      JSON.stringify(reconstructed)
    );
  }

  // Specific audit check for "quietly" (previously reported as ID 58284)
  const quietlyRes = tokenizeTextReal(' quietly');
  assert(
    'Tokenizer',
    'Token ID for " quietly" is strictly < 50257 (resolving ID 58284 bug)',
    quietlyRes.ids.length === 1 && quietlyRes.ids[0] === 12703,
    'ID 12703',
    `ID ${quietlyRes.ids[0]}`
  );

  // Special token <|endoftext|> check
  const eosRes = tokenizeTextReal('<|endoftext|>');
  assert(
    'Tokenizer',
    'Special token <|endoftext|> encodes to token ID 50256',
    eosRes.ids[0] === GPT2_EOS_TOKEN_ID && eosRes.tokens[0].isSpecialToken === true,
    'ID 50256 (isSpecialToken=true)',
    `ID ${eosRes.ids[0]} (isSpecialToken=${eosRes.tokens[0]?.isSpecialToken})`
  );

  // =========================================================================
  // GROUP 2: POSITIONAL ENCODING MATHEMATICAL AUDIT
  // =========================================================================
  const peSeqLen = 6;
  const peDModel = 8;
  const peMatrix = computeSinusoidalMatrix(peSeqLen, peDModel);

  assert(
    'Positional Encoding',
    'PE matrix dimensions are [seqLen, d_model]',
    peMatrix.length === peSeqLen && peMatrix[0].length === peDModel,
    `[${peSeqLen}, ${peDModel}]`,
    `[${peMatrix.length}, ${peMatrix[0].length}]`
  );

  // Check pos=0: sin(0) = 0, cos(0) = 1 for all dimension pairs
  let posZeroValid = true;
  for (let i = 0; i < peDModel / 2; i++) {
    if (Math.abs(peMatrix[0][2 * i] - 0) > 1e-4 || Math.abs(peMatrix[0][2 * i + 1] - 1) > 1e-4) {
      posZeroValid = false;
    }
  }
  assert(
    'Positional Encoding',
    'At pos=0, even dimensions are sin(0)=0 and odd dimensions are cos(0)=1',
    posZeroValid,
    'sin=0, cos=1 across all pairs',
    `pos[0]: [${peMatrix[0].join(', ')}]`
  );

  // Check pos=3, pair i=1 (dim 2 and 3): denominator = 10000^(2*1/8) = 10000^0.25 = 10
  const expectedSin = Number(Math.sin(3 / 10).toFixed(4));
  const expectedCos = Number(Math.cos(3 / 10).toFixed(4));
  assert(
    'Positional Encoding',
    'Sinusoidal values match canonical Vaswani formula for pos=3, pair i=1',
    Math.abs(peMatrix[3][2] - expectedSin) < 1e-3 && Math.abs(peMatrix[3][3] - expectedCos) < 1e-3,
    `sin=${expectedSin}, cos=${expectedCos}`,
    `sin=${peMatrix[3][2]}, cos=${peMatrix[3][3]}`
  );

  // =========================================================================
  // GROUP 3: CAUSAL ATTENTION MECHANISM AUDIT
  // =========================================================================
  const sim = runCompleteSimulation('The cat sat on the mat');

  assert(
    'Self-Attention',
    'Q, K, V projection matrices have shape [seqLen, d_k]',
    sim.stage4.Q.length === sim.seqLen &&
      sim.stage4.Q[0].length === SIMULATOR_D_K &&
      sim.stage4.K.length === sim.seqLen &&
      sim.stage4.V.length === sim.seqLen,
    `[${sim.seqLen}, ${SIMULATOR_D_K}]`,
    `[${sim.stage4.Q.length}, ${sim.stage4.Q[0].length}]`
  );

  assert(
    'Self-Attention',
    'Raw and Scaled attention score matrices have shape [seqLen, seqLen]',
    sim.stage4.scaledScores.length === sim.seqLen &&
      sim.stage4.scaledScores[0].length === sim.seqLen,
    `[${sim.seqLen}, ${sim.seqLen}]`,
    `[${sim.stage4.scaledScores.length}, ${sim.stage4.scaledScores[0].length}]`
  );

  // Causal Masking check: all upper-triangular weights must be strictly 0.0
  let causalStrict = true;
  for (let i = 0; i < sim.seqLen; i++) {
    for (let j = i + 1; j < sim.seqLen; j++) {
      if (sim.stage4.attentionWeights[i][j] !== 0) {
        causalStrict = false;
      }
    }
  }
  assert(
    'Self-Attention',
    'Causal masking strictly zeros all future token weights (no future leakage)',
    causalStrict,
    'All weights for j > i are 0.0',
    causalStrict ? 'Zero future leakage confirmed' : 'Leak detected'
  );

  // Softmax normalization check: each row sums to 1.000
  let rowsSumOne = true;
  for (let i = 0; i < sim.seqLen; i++) {
    const sum = sim.stage4.attentionWeights[i].reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 1.0) > 1e-4) {
      rowsSumOne = false;
    }
  }
  assert(
    'Self-Attention',
    'Each row of attention weights sums to exactly 1.000',
    rowsSumOne,
    'Row sum = 1.000 for all queries',
    rowsSumOne ? 'Normalized sum = 1.000' : 'Row sum mismatch'
  );

  // =========================================================================
  // GROUP 4: TRANSFORMER BLOCK & RESIDUALS AUDIT
  // =========================================================================
  assert(
    'Transformer Block',
    'Pre-Norm architecture preserves tensor shape [seqLen, d_model]',
    sim.stage5.finalHidden.length === sim.seqLen &&
      sim.stage5.finalHidden[0].length === SIMULATOR_D_MODEL,
    `[${sim.seqLen}, ${SIMULATOR_D_MODEL}]`,
    `[${sim.stage5.finalHidden.length}, ${sim.stage5.finalHidden[0].length}]`
  );

  // RMSNorm check: vector normalized to unit RMS magnitude
  const sampleVec = [1.2, -0.8, 2.5, -1.4, 0.9, -0.3, 1.1, -0.6];
  const normRes = rmsNorm(sampleVec);
  const rmsAfter = Math.sqrt(normRes.output.reduce((a, b) => a + b * b, 0) / sampleVec.length);
  assert(
    'Transformer Block',
    'RMSNorm produces output with root-mean-square magnitude ~ 1.0',
    Math.abs(rmsAfter - 1.0) < 1e-3,
    'RMS ~ 1.000',
    `RMS = ${rmsAfter.toFixed(4)}`
  );

  // =========================================================================
  // GROUP 5: LANGUAGE MODELING HEAD & SAMPLING AUDIT
  // =========================================================================
  // Candidates ID range
  const allCandIdsValid = sim.stage6.candidates.every(
    (c) => c.id >= 0 && c.id <= GPT2_MAX_TOKEN_ID
  );
  assert(
    'Language Modeling Head',
    'All prediction candidates carry valid GPT-2 token IDs in [0, 50256]',
    allCandIdsValid,
    `All candidate IDs <= ${GPT2_MAX_TOKEN_ID}`,
    allCandIdsValid ? 'All IDs valid' : 'Invalid candidate ID found'
  );

  // Probabilities sum to 1.0
  const probSum = sim.stage6.candidates.reduce((a, b) => a + b.prob, 0);
  assert(
    'Language Modeling Head',
    'Softmax probabilities sum strictly to 1.000',
    Math.abs(probSum - 1.0) < 1e-3,
    'Sum = 1.000',
    `Sum = ${probSum.toFixed(4)}`
  );

  // Temperature Scaling Effect
  const simLowT = runCompleteSimulation('The cat sat on the mat', { temperature: 0.1 });
  const simHighT = runCompleteSimulation('The cat sat on the mat', { temperature: 1.5 });
  const maxProbLowT = simLowT.stage6.candidates[0].prob;
  const maxProbHighT = simHighT.stage6.candidates[0].prob;
  assert(
    'Language Modeling Head',
    'Lower temperature concentrates probability on top pick (sharper distribution)',
    maxProbLowT > maxProbHighT,
    `P_lowT (${maxProbLowT.toFixed(3)}) > P_highT (${maxProbHighT.toFixed(3)})`,
    `${maxProbLowT.toFixed(3)} vs ${maxProbHighT.toFixed(3)}`
  );

  // Top-K Filtering Check
  const topKTest = applyTopK(sim.stage6.candidates, 3);
  assert(
    'Language Modeling Head',
    'Top-K=3 retains exactly 3 candidates with renormalized sum = 1.0',
    topKTest.retained.length === 3 &&
      Math.abs(topKTest.renormalized.reduce((a, b) => a + (b.filteredProb || 0), 0) - 1.0) < 1e-3,
    'retained=3, sum=1.000',
    `retained=${topKTest.retained.length}, sum=${topKTest.renormalized.reduce((a, b) => a + (b.filteredProb || 0), 0).toFixed(3)}`
  );

  // Top-P Filtering Check
  const topPTest = applyTopP(sim.stage6.candidates, 0.8);
  const retainedCumSum = topPTest.retained.reduce((a, b) => a + b.prob, 0);
  assert(
    'Language Modeling Head',
    'Top-P=0.8 retains tokens covering >= 0.8 cumulative probability',
    retainedCumSum >= 0.8,
    'Cumulative probability >= 0.800',
    `Cumulative prob = ${retainedCumSum.toFixed(3)}`
  );

  // =========================================================================
  // GROUP 6: AUTOREGRESSIVE MULTI-STEP GENERATION AUDIT
  // =========================================================================
  let multiStepText = 'The cat sat on the';
  const generatedTokenIds: number[] = [];

  for (let step = 0; step < 3; step++) {
    const stepSim = runCompleteSimulation(multiStepText, {
      samplingMethod: 'greedy',
    });
    const selectedId = stepSim.stage7.selectedTokenId;
    const selectedText = stepSim.stage7.selectedTokenRaw;
    generatedTokenIds.push(selectedId);

    // Verify selected ID is valid
    assert(
      'Autoregressive Generation',
      `Step ${step + 1}: Generated token has valid ID within [0, 50256]`,
      selectedId >= 0 && selectedId <= GPT2_MAX_TOKEN_ID,
      `ID <= ${GPT2_MAX_TOKEN_ID}`,
      `ID ${selectedId} ("${stepSim.stage7.selectedToken}")`
    );

    // Verify token decodes to selected text
    const decoded = decodeTokenIds([selectedId]);
    assert(
      'Autoregressive Generation',
      `Step ${step + 1}: Token ID ${selectedId} decodes to "${selectedText}"`,
      decoded === selectedText,
      JSON.stringify(selectedText),
      JSON.stringify(decoded)
    );

    // Verify sequence growth
    const prevLen = stepSim.seqLen;
    multiStepText = stepSim.stage7.updatedText;
    const nextSim = runCompleteSimulation(multiStepText);
    assert(
      'Autoregressive Generation',
      `Step ${step + 1}: Sequence length increments by 1 (${prevLen} -> ${nextSim.seqLen})`,
      nextSim.seqLen === prevLen + 1,
      `seqLen = ${prevLen + 1}`,
      `seqLen = ${nextSim.seqLen}`
    );
  }

  // =========================================================================
  // GROUP 7: EDGE CASES AUDIT
  // =========================================================================
  // 1. Single token input
  const singleSim = runCompleteSimulation('The');
  assert(
    'Edge Cases',
    'Single token input produces valid forward pass ([1, 8] -> [1, 8])',
    singleSim.seqLen === 1 &&
      singleSim.stage4.attentionWeights[0][0] === 1.0 &&
      singleSim.stage5.finalHidden.length === 1,
    'seqLen=1, attention[0][0]=1.000',
    `seqLen=${singleSim.seqLen}, attention[0][0]=${singleSim.stage4.attentionWeights[0][0].toFixed(3)}`
  );

  // 2. Extreme low temperature (T = 0.01)
  const extremeLowSim = runCompleteSimulation('The cat sat on the', { temperature: 0.01 });
  const topLowProb = extremeLowSim.stage6.candidates[0].prob;
  assert(
    'Edge Cases',
    'Extreme low temperature (T=0.01) gives ~1.0 probability to argmax candidate',
    topLowProb > 0.95,
    'Top prob > 0.95',
    `Top prob = ${topLowProb.toFixed(4)}`
  );

  // 3. Extreme high temperature (T = 2.0)
  const extremeHighSim = runCompleteSimulation('The cat sat on the', { temperature: 2.0 });
  const topHighProb = extremeHighSim.stage6.candidates[0].prob;
  assert(
    'Edge Cases',
    'Extreme high temperature (T=2.0) flattens distribution entropy relative to default',
    topHighProb < 0.6,
    'Top prob < 0.60',
    `Top prob = ${topHighProb.toFixed(4)}`
  );

  // 4. Greedy equivalent: Top-K = 1
  const simForGreedy = runCompleteSimulation('The cat sat on the');
  const greedyToken = greedyDecode(simForGreedy.stage6.candidates);
  const topK1 = applyTopK(simForGreedy.stage6.candidates, 1);
  assert(
    'Edge Cases',
    'Top-K=1 is strictly equivalent to greedy argmax decoding',
    greedyToken.token === topK1.retained[0].token,
    `Greedy: "${greedyToken.token}"`,
    `Top-K=1: "${topK1.retained[0].token}"`
  );

  // 5. Top-P = 1.0 (no nucleus truncation)
  const topPAll = applyTopP(simForGreedy.stage6.candidates, 1.0);
  assert(
    'Edge Cases',
    'Top-P=1.0 retains all candidate tokens without nucleus exclusion',
    topPAll.retained.length === simForGreedy.stage6.candidates.length,
    `retained=${simForGreedy.stage6.candidates.length}`,
    `retained=${topPAll.retained.length}`
  );

  return results;
}

// Direct terminal execution helper
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('simulatorAudit')) {
  console.log('===============================================================');
  console.log('INSIDE THE LLM — SIMULATOR TECHNICAL AUDIT TEST SUITE');
  console.log('===============================================================\n');

  const testResults = runAllAuditTests();
  let passedCount = 0;
  let failedCount = 0;

  for (const t of testResults) {
    const status = t.passed ? '✓ PASS' : '✗ FAIL';
    if (t.passed) {
      passedCount++;
      console.log(`${status} [${t.category}] ${t.name}`);
    } else {
      failedCount++;
      console.error(`${status} [${t.category}] ${t.name}`);
      console.error(`   Expected: ${t.expected}`);
      console.error(`   Actual:   ${t.actual}`);
    }
  }

  console.log('\n---------------------------------------------------------------');
  console.log(`TOTAL TESTS: ${testResults.length} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
  console.log('===============================================================');

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}
