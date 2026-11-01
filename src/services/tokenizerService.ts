import { encode, decode, vocabularySize } from 'gpt-tokenizer/model/gpt-2';

export const GPT2_VOCABULARY_SIZE = 50257;
export const GPT2_MAX_TOKEN_ID = 50256;
export const GPT2_EOS_TOKEN_ID = 50256;

export interface TokenDetail {
  id: number;
  text: string;
  bytes: number[];
  byteLength: number;
  isSpecialToken?: boolean;
}

export interface TokenizeResult {
  tokens: TokenDetail[];
  tokenCount: number;
  charCount: number;
  compressionRatio: number;
  ids: number[];
}

/**
 * Tokenize an arbitrary string using the real GPT-2 / GPT-3 R50K BPE pretrained tokenizer.
 * Strict vocabulary size: 50,257 tokens (valid ID range: 0 to 50,256).
 */
export function tokenizeTextReal(input: string): TokenizeResult {
  if (!input) {
    return {
      tokens: [],
      tokenCount: 0,
      charCount: 0,
      compressionRatio: 0,
      ids: [],
    };
  }

  // Real GPT-2 BPE token encoding with special tokens enabled
  const ids = encode(input, { allowedSpecial: 'all' });
  const encoder = new TextEncoder();

  const tokens: TokenDetail[] = ids.map((id) => {
    // Decode individual token
    const tokenStr = decode([id]);
    const bytes = Array.from(encoder.encode(tokenStr));

    return {
      id,
      text: tokenStr,
      bytes,
      byteLength: bytes.length,
      isSpecialToken: id === GPT2_EOS_TOKEN_ID || id >= 50256,
    };
  });

  const charCount = input.length;
  const tokenCount = tokens.length;
  const compressionRatio = tokenCount > 0 ? Number((charCount / tokenCount).toFixed(2)) : 0;

  return {
    tokens,
    tokenCount,
    charCount,
    compressionRatio,
    ids,
  };
}

/**
 * Vocabulary lookup helper for common tokens and searched phrases
 */
export function lookupTokenInVocabulary(query: string): TokenDetail[] {
  if (!query || query.trim() === '') return [];

  const encoder = new TextEncoder();

  // If query starts without leading space, also check with leading space
  const variants = [query];
  if (!query.startsWith(' ')) {
    variants.push(' ' + query);
  }

  const results: TokenDetail[] = [];
  const seenIds = new Set<number>();

  for (const variant of variants) {
    const ids = encode(variant, { allowedSpecial: 'all' });
    for (const id of ids) {
      if (!seenIds.has(id)) {
        seenIds.add(id);
        const decoded = decode([id]);
        results.push({
          id,
          text: decoded,
          bytes: Array.from(encoder.encode(decoded)),
          byteLength: encoder.encode(decoded).length,
          isSpecialToken: id === GPT2_EOS_TOKEN_ID || id >= 50256,
        });
      }
    }
  }

  return results;
}

/**
 * Decode a single token ID or array of token IDs back into text.
 */
export function decodeTokenIds(ids: number[]): string {
  return decode(ids);
}

export { vocabularySize, decode };

