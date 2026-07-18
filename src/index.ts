// Particles that should stay lowercase unless they're the first token of the full string.
// Each entry is a single word: multi-word particles (e.g. "van der", "de la") are
// matched as their individual words, which must all be present here.
const DEFAULT_PARTICLES = new Set([
  // Spanish / Portuguese
  'de', 'del', 'la', 'las', 'los', 'el', 'al',
  'dos', 'das', 'da', 'do',
  // French
  'du', 'des', 'le', 'les',
  // Italian
  'di', 'dello', 'della', 'degli', 'dei', 'dal', 'dalla',
  // Germanic / Dutch
  'von', 'van', 'der', 'den', 'zu', 'zum', 'zur', 'auf', 'am',
  // Arabic / other
  'bin', 'bint', 'ibn',
  // Conjunctions used in compound names
  'y', 'e', 'i',
]);

/** Options for {@link capitalizeName}. All fields are optional and non-breaking. */
export interface NameCapitalizeOptions {
  /**
   * Replace the built-in particle list entirely. Provide the full set of words
   * that should stay lowercase (unless they are the first word).
   */
  particles?: Iterable<string>;
  /** Add extra particles on top of the built-in (or `particles`) list. */
  extraParticles?: Iterable<string>;
  /** Remove particles from the built-in (or `particles`) list. */
  ignoreParticles?: Iterable<string>;
  /**
   * Capitalize the letter after a `Mc` prefix (`mcdonald` → `McDonald`).
   * Opt-in (default `false`); does not touch `Mac`, which needs an exception list.
   */
  mcPrefix?: boolean;
}

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
 * Uppercases the letter following a `Mc` prefix. Expects a word whose first
 * letter is already capitalized ("Mcdonald" → "McDonald"). Leaves a bare "Mc"
 * (no following letter) untouched. Does not handle "Mac" — that needs an
 * exception dictionary and is out of scope.
 */
function capitalizeMcPrefix(word: string): string {
  return word.replace(/^(Mc)(\p{L})/u, (_, mc, next) => mc + next.toUpperCase());
}

/**
 * Builds the effective particle set for a call. Returns the shared default set
 * unchanged (no allocation) when no particle overrides are supplied.
 */
function resolveParticles(options?: NameCapitalizeOptions): Set<string> {
  if (!options || (!options.particles && !options.extraParticles && !options.ignoreParticles)) {
    return DEFAULT_PARTICLES;
  }

  const set = new Set(options.particles ?? DEFAULT_PARTICLES);
  if (options.extraParticles) for (const p of options.extraParticles) set.add(p.toLowerCase());
  if (options.ignoreParticles) for (const p of options.ignoreParticles) set.delete(p.toLowerCase());
  return set;
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
 * @param options - Optional overrides for particles and `Mc` handling.
 * @returns Properly capitalized name.
 *
 * @example
 * nameCapitalize("JUAN de la MAZA")    // → "Juan de la Maza"
 * nameCapitalize("o'higgins")          // → "O'Higgins"
 * nameCapitalize("jean-pierre dupont") // → "Jean-Pierre Dupont"
 * nameCapitalize("otto van den berg")  // → "Otto van den Berg" (der/den stay lowercase)
 * nameCapitalize("Dick Van Dyke", { ignoreParticles: ["van"] }) // → "Dick Van Dyke"
 * nameCapitalize("ronald mcdonald", { mcPrefix: true })          // → "Ronald McDonald"
 */
export function capitalizeName(text: string, options?: NameCapitalizeOptions): string {
  if (!text || typeof text !== 'string') return '';

  const normalized = text.trim().toLowerCase();
  if (!normalized) return '';

  const particles = resolveParticles(options);
  const cap = options?.mcPrefix
    ? (word: string) => capitalizeMcPrefix(capitalizeFirst(word))
    : capitalizeFirst;

  const tokens = tokenize(normalized);

  // Find the index of the first non-separator token to decide particle exemption
  const firstWordIndex = tokens.findIndex((t) => !t.isSeparator);

  const result = tokens.map((token, index) => {
    // Separators pass through unchanged
    if (token.isSeparator) return token.value;

    const isFirstWord = index === firstWordIndex;

    // First word always gets capitalized, regardless of particle status
    if (isFirstWord) return cap(token.value);

    // What separator precedes this word?
    const prevToken = tokens[index - 1];
    const prevSep: Separator | null = prevToken?.isSeparator ? (prevToken.value as Separator) : null;

    // After hyphen or apostrophe → always capitalize (Jean-Pierre, O'Higgins)
    if (prevSep === '-' || prevSep === "'") {
      return cap(token.value);
    }

    // After space → keep particles lowercase
    if (particles.has(token.value)) return token.value;

    return cap(token.value);
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
