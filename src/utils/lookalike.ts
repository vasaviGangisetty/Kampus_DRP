/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Kampus DRP - Advanced Look-alike & Permutation Detection Engine
 * Implements: Character Swaps, Homoglyphs (typosquatting), Affix Additions,
 * Delimiter/Spacing Changes, and False-Positive Suppression.
 */

export interface LookalikeResult {
  variant: string;
  original: string;
  technique: 'character_swap' | 'homoglyph' | 'added_word' | 'spacing_delimiter' | 'combosquatting';
  levenshteinDistance: number;
  similarityPct: number; // 0 - 100
  riskWeight: 'critical' | 'high' | 'medium' | 'low';
  explanation: string;
}

// Homoglyph map for visual look-alikes across Latin, Cyrillic, and numbers
export const HOMOGLYPH_MAP: Record<string, string[]> = {
  a: ['4', '@', 'а', 'ä', 'á', 'à', 'â'],
  b: ['8', 'ß', 'ь', 'в'],
  c: ['(', '<', 'с', 'ç'],
  d: ['cl', 'd'],
  e: ['3', 'е', 'ë', 'é', 'è', 'ê', '€'],
  g: ['9', 'q'],
  h: ['#', 'lh'],
  i: ['1', '!', '|', 'l', 'í', 'ï', 'і'],
  k: ['k', 'к'],
  l: ['1', '|', 'i', 'I', 'l'],
  m: ['rn', 'nn', 'м'],
  n: ['п', 'ñ'],
  o: ['0', 'о', 'ö', 'ó', 'ò'],
  p: ['р'],
  s: ['5', '$', 'z', 'ѕ'],
  t: ['7', '+'],
  u: ['v', 'ü', 'ú'],
  v: ['u', 'v', '\\/'],
  w: ['vv', 'w', 'ш'],
  x: ['%', 'х'],
  y: ['у', 'j'],
};

// Common scam & impersonation affixes
export const THREAT_AFFIXES = [
  'official',
  'support',
  'helpdesk',
  'service',
  'claims',
  'giveaway',
  'airdrop',
  'rewards',
  'verify',
  'security',
  'login',
  'portal',
  'invest',
  'fund',
  'ventures',
  'hq',
  'global',
  'team',
  'care',
  'desk',
];

/**
 * Standard Levenshtein Distance calculation
 */
export function calculateLevenshtein(a: string, b: string): number {
  const s1 = a.toLowerCase();
  const s2 = b.toLowerCase();
  const m = s1.length;
  const n = s2.length;
  const d: number[][] = [];

  for (let i = 0; i <= m; i++) {
    d[i] = [i];
  }
  for (let j = 0; j <= n; j++) {
    d[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1, // deletion
        d[i][j - 1] + 1, // insertion
        d[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return d[m][n];
}

/**
 * Computes percentage similarity based on max length
 */
export function calculateSimilarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 100;
  const dist = calculateLevenshtein(a, b);
  const similarity = ((maxLen - dist) / maxLen) * 100;
  return Math.round(similarity * 10) / 10;
}

/**
 * Normalizes input string (lowercased, removes standard delimiters)
 */
export function normalizeToken(str: string): string {
  return str.toLowerCase().replace(/[\s\-_.]/g, '');
}

/**
 * Analyzes whether candidateName is an intentional look-alike of targetBrand
 */
export function analyzeLookalike(targetBrand: string, candidateName: string): LookalikeResult | null {
  const targetNorm = normalizeToken(targetBrand);
  const candNorm = normalizeToken(candidateName);

  // Exact match normalized (e.g. "Kampus VC" vs "kampusvc" or "kampus_vc")
  if (targetNorm === candNorm && targetBrand !== candidateName) {
    return {
      variant: candidateName,
      original: targetBrand,
      technique: 'spacing_delimiter',
      levenshteinDistance: calculateLevenshtein(targetBrand, candidateName),
      similarityPct: 98,
      riskWeight: 'critical',
      explanation: 'Identical normalized characters with spacing/punctuation alteration designed to bypass basic exact match filters.',
    };
  }

  // 1. Check for Character Swaps (Transposition, e.g., "kmapus" vs "kampus")
  if (targetNorm.length === candNorm.length && targetNorm.length > 3) {
    let diffCount = 0;
    const diffIndices: number[] = [];
    for (let i = 0; i < targetNorm.length; i++) {
      if (targetNorm[i] !== candNorm[i]) {
        diffCount++;
        diffIndices.push(i);
      }
    }
    if (diffCount === 2 && diffIndices[1] === diffIndices[0] + 1) {
      if (
        targetNorm[diffIndices[0]] === candNorm[diffIndices[1]] &&
        targetNorm[diffIndices[1]] === candNorm[diffIndices[0]]
      ) {
        return {
          variant: candidateName,
          original: targetBrand,
          technique: 'character_swap',
          levenshteinDistance: 1,
          similarityPct: calculateSimilarity(targetNorm, candNorm),
          riskWeight: 'high',
          explanation: `Adjacent character swap detected between '${targetNorm[diffIndices[0]]}' and '${targetNorm[diffIndices[1]]}'. Classic typosquatting tactic.`,
        };
      }
    }
  }

  // 2. Check for Added Words / Affixes (e.g. "kampus_support", "official_kampus_vc")
  for (const affix of THREAT_AFFIXES) {
    if (
      candNorm.includes(targetNorm) &&
      (candNorm.startsWith(affix) || candNorm.endsWith(affix) || candidateName.toLowerCase().includes(affix))
    ) {
      return {
        variant: candidateName,
        original: targetBrand,
        technique: 'added_word',
        levenshteinDistance: calculateLevenshtein(targetBrand, candidateName),
        similarityPct: calculateSimilarity(targetBrand, candidateName),
        riskWeight: 'critical',
        explanation: `Appended threat affix '${affix}' combined with brand identity. Frequently used in fake helpdesks and credential phishing.`,
      };
    }
  }

  // 3. Check for Homoglyphs / Typosquatting (e.g., '0' for 'o', 'rn' for 'm')
  let homoglyphMatches = 0;
  let simulatedNormalized = candNorm;
  for (const [char, glyphs] of Object.entries(HOMOGLYPH_MAP)) {
    for (const g of glyphs) {
      if (simulatedNormalized.includes(g)) {
        simulatedNormalized = simulatedNormalized.split(g).join(char);
        homoglyphMatches++;
      }
    }
  }

  if (homoglyphMatches > 0 && simulatedNormalized === targetNorm) {
    return {
      variant: candidateName,
      original: targetBrand,
      technique: 'homoglyph',
      levenshteinDistance: calculateLevenshtein(targetBrand, candidateName),
      similarityPct: 94,
      riskWeight: 'critical',
      explanation: `Homoglyph substitution detected (${homoglyphMatches} character replacements). Human eye reads as original brand while machine treats as different string.`,
    };
  }

  // 4. Combosquatting / High Levenshtein Similarity
  const dist = calculateLevenshtein(targetNorm, candNorm);
  const sim = calculateSimilarity(targetNorm, candNorm);

  if (dist <= 2 && targetNorm.length >= 4 && dist > 0) {
    return {
      variant: candidateName,
      original: targetBrand,
      technique: 'combosquatting',
      levenshteinDistance: dist,
      similarityPct: sim,
      riskWeight: sim > 85 ? 'high' : 'medium',
      explanation: `Levenshtein edit distance of ${dist} with ${sim}% structural match. High potential for brand confusion.`,
    };
  }

  return null;
}

/**
 * Generates test permutations for brand vulnerability preview & proactive defense
 */
export function generateBrandPermutations(brandName: string): LookalikeResult[] {
  const results: LookalikeResult[] = [];
  const clean = brandName.trim();
  const lower = clean.toLowerCase();

  // 1. Spacing / Delimiters
  results.push({
    variant: lower.replace(/\s+/g, '-'),
    original: clean,
    technique: 'spacing_delimiter',
    levenshteinDistance: 1,
    similarityPct: 95,
    riskWeight: 'high',
    explanation: 'Hyphenated permutation commonly registered for phishing landers.',
  });
  results.push({
    variant: lower.replace(/\s+/g, '_'),
    original: clean,
    technique: 'spacing_delimiter',
    levenshteinDistance: 1,
    similarityPct: 95,
    riskWeight: 'high',
    explanation: 'Underscore variant commonly used for fake social media profiles.',
  });

  // 2. Character Swaps
  if (lower.length >= 4) {
    const chars = lower.split('');
    // Swap 2nd and 3rd char
    const swapped = [...chars];
    const temp = swapped[1];
    swapped[1] = swapped[2];
    swapped[2] = temp;
    const swapStr = swapped.join('');
    results.push({
      variant: swapStr,
      original: clean,
      technique: 'character_swap',
      levenshteinDistance: 1,
      similarityPct: calculateSimilarity(lower, swapStr),
      riskWeight: 'high',
      explanation: 'Common typing slip transposition.',
    });
  }

  // 3. Homoglyph mutations
  let mutatedHomoglyph = lower;
  if (mutatedHomoglyph.includes('o')) {
    mutatedHomoglyph = mutatedHomoglyph.replace(/o/g, '0');
  } else if (mutatedHomoglyph.includes('i')) {
    mutatedHomoglyph = mutatedHomoglyph.replace(/i/g, '1');
  } else if (mutatedHomoglyph.includes('m')) {
    mutatedHomoglyph = mutatedHomoglyph.replace(/m/g, 'rn');
  } else if (mutatedHomoglyph.includes('e')) {
    mutatedHomoglyph = mutatedHomoglyph.replace(/e/g, '3');
  } else {
    mutatedHomoglyph = mutatedHomoglyph + 'l';
  }

  results.push({
    variant: mutatedHomoglyph,
    original: clean,
    technique: 'homoglyph',
    levenshteinDistance: calculateLevenshtein(lower, mutatedHomoglyph),
    similarityPct: calculateSimilarity(lower, mutatedHomoglyph),
    riskWeight: 'critical',
    explanation: 'Visual twin using number/letter homoglyph substitution.',
  });

  // 4. High-risk Affixes
  const keyAffixes = ['support', 'official', 'helpdesk', 'giveaway', 'portal'];
  keyAffixes.forEach((affix) => {
    results.push({
      variant: `${lower}_${affix}`,
      original: clean,
      technique: 'added_word',
      levenshteinDistance: affix.length + 1,
      similarityPct: calculateSimilarity(lower, `${lower}_${affix}`),
      riskWeight: 'critical',
      explanation: `High-risk customer lure variant appending '${affix}'.`,
    });
  });

  return results;
}
