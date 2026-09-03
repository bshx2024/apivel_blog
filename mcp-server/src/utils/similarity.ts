/**
 * Tokenize a text string into normalized lower-case words/tokens
 */
export function tokenize(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/(?<=\d)\.(?=\d)/g, "DOT")
    .replace(/[^\w\s-]/g, " ")
    .replace(/DOT/g, ".")
    .split(/[\s-]+/)
    .filter(w => w.length > 1 || /\d/.test(w));
  return new Set(words);
}

/**
 * Generate 2-gram and 3-gram character shingles or word n-grams
 */
export function getNGrams(tokens: string[], n: number): Set<string> {
  const ngrams = new Set<string>();
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.add(tokens.slice(i, i + n).join(" "));
  }
  return ngrams;
}

/**
 * Compute Jaccard Similarity between two token sets
 */
export function computeJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersectionSize = 0;
  for (const item of setA) {
    if (setB.has(item)) {
      intersectionSize++;
    }
  }
  const unionSize = setA.size + setB.size - intersectionSize;
  return unionSize === 0 ? 0 : intersectionSize / unionSize;
}

/**
 * Compare target topic keywords with an existing article's metadata
 */
export function calculateTopicOverlap(
  targetKeywords: string[],
  existingTitle: string,
  existingTags: string[],
  existingHeadings: string[]
): { score: number; matchedTerms: string[] } {
  const targetSet = new Set(targetKeywords.map(k => k.toLowerCase().trim()));
  const corpusTokens = tokenize(`${existingTitle} ${existingTags.join(" ")} ${existingHeadings.join(" ")}`);
  
  const matchedTerms: string[] = [];
  for (const kw of targetSet) {
    const kwTokens = Array.from(tokenize(kw));
    if (kwTokens.length > 0 && kwTokens.every(token => corpusTokens.has(token.toLowerCase()))) {
      matchedTerms.push(kw);
    }
  }

  const score = targetSet.size > 0 ? matchedTerms.length / targetSet.size : 0;
  return { score, matchedTerms };
}
