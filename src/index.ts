// Particles that should stay lowercase unless they're the first token of the full string
const PARTICLES = new Set([
  // Spanish / Portuguese
  'de', 'del', 'la', 'las', 'los', 'el', 'al',
  'dos', 'das', 'da', 'do',
  // French
  'de', 'du', 'des', 'le', 'les', 'y', 'e',
  // Italian
  'di', 'dello', 'della', 'degli', 'dei', 'dal', 'dalla',
  // Germanic
  'von', 'van', 'van der', 'van den', 'de la',
  'zu', 'zum', 'zur', 'auf', 'am',
  // Arabic / other
  'al', 'el', 'bin', 'bint', 'ibn',
  // Conjunctions used in compound names
  'y', 'e', 'i',
]);

type Separator = '-' | "'" | ' ';

interface Token {
  value: string;
  isSeparator: boolean;
}

/**
 * Capitalizes the first Unicode letter of a word, leaving the rest unchanged.
 * Uses Unicode-aware regex so accented letters (á, é, ñ, ü…) are handled correctly.
 */
function capitalizeFirst(word: string): string {
  return word.replace(/^(\p{L})(\p{L}*)/u, (_, first, rest) => first.toUpperCase() + rest);
}

/**
 * Tokenizes a name string, preserving separators (spaces, hyphens, apostrophes) as tokens.
 * Example: "jean-pierre o'higgins de la maza"
 *   → [{value:'jean'}, {value:'-',sep}, {value:'pierre'}, {value:' ',sep}, ...]
 */
function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  let current = '';

  for (const char of text) {
    if (char === '-' || char === "'" || char === ' ') {
      if (current) {
        tokens.push({ value: current, isSeparator: false });
        current = '';
      }
      tokens.push({ value: char, isSeparator: true });
    } else {
      current += char;
    }
  }

  if (current) {
    tokens.push({ value: current, isSeparator: false });
  }

  return tokens;
}

/**
 * Smartly capitalizes person names, keeping Latin/Germanic particles lowercase.
 *
 * Rules:
 * - Particles are lowercased unless they appear as the very first word of the string.
 * - After a hyphen, the next word is capitalized (compound given names: Jean-Pierre).
 * - After an apostrophe, the next word is capitalized (O'Higgins, D'Artagnan).
 * - After a space, particles stay lowercase; all other words are capitalized.
 * - Handles Unicode letters natively (accents, ñ, ü, etc.).
 *
 * @param text - Raw name string (any casing).
 * @returns Properly capitalized name.
 *
 * @example
 * nameCapitalize("JUAN de la MAZA")    // → "Juan de la Maza"
 * nameCapitalize("o'higgins")          // → "O'Higgins"
 * nameCapitalize("jean-pierre dupont") // → "Jean-Pierre Dupont"
 * nameCapitalize("van der waals")      // → "van der Waals"  (particle first? no → lowercase)
 */
export function capitalizeName(text: string): string {
  if (!text || typeof text !== 'string') return '';

  const normalized = text.trim().toLowerCase();
  if (!normalized) return '';

  const tokens = tokenize(normalized);

  // Find the index of the first non-separator token to decide particle exemption
  const firstWordIndex = tokens.findIndex((t) => !t.isSeparator);

  const result = tokens.map((token, index) => {
    // Separators pass through unchanged
    if (token.isSeparator) return token.value;

    const isFirstWord = index === firstWordIndex;

    // First word always gets capitalized, regardless of particle status
    if (isFirstWord) return capitalizeFirst(token.value);

    // What separator precedes this word?
    const prevToken = tokens[index - 1];
    const prevSep: Separator | null = prevToken?.isSeparator ? (prevToken.value as Separator) : null;

    // After hyphen or apostrophe → always capitalize (Jean-Pierre, O'Higgins)
    if (prevSep === '-' || prevSep === "'") {
      return capitalizeFirst(token.value);
    }

    // After space → keep particles lowercase
    if (PARTICLES.has(token.value)) return token.value;

    return capitalizeFirst(token.value);
  });

  return result.join('');
}

/**
 * Alias for {@link capitalizeName}.
 *
 * @example
 * namecase("JUAN de la MAZA") // → "Juan de la Maza"
 */
export const namecase = capitalizeName;
