# name-capitalize

[![npm version](https://img.shields.io/npm/v/name-capitalize)](https://www.npmjs.org/package/name-capitalize)
[![install size](https://packagephobia.com/badge?p=name-capitalize)](https://packagephobia.com/result?p=name-capitalize)
[![npm downloads](https://img.shields.io/npm/dm/name-capitalize)](https://npm-stat.com/charts.html?package=name-capitalize)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Lightweight, zero-dependency utility for smart capitalization of person names. Handles particles (`de`, `van`, `von`…), hyphenated names, apostrophes, and Unicode characters.

> **Looking for the legacy version?** See the [`v1` branch](../../tree/v1) for Node 16 / Angular 12 compatibility (`npm install name-capitalize@legacy`).

## Install

```bash
npm install name-capitalize
```

Requires Node 18 or higher.

## Usage

```ts
import { capitalizeName } from 'name-capitalize';

capitalizeName('JUAN DE LA MAZA')         // → 'Juan de la Maza'
capitalizeName('ludwig van beethoven')    // → 'Ludwig van Beethoven'
capitalizeName("bernardo o'higgins")      // → "Bernardo O'Higgins"
capitalizeName('JEAN-PIERRE DUPONT')      // → 'Jean-Pierre Dupont'
capitalizeName('gabriel garcía márquez')  // → 'Gabriel García Márquez'
```

`namecase` is exported as an alias of `capitalizeName` — identical behavior, shorter name:

```ts
import { namecase } from 'name-capitalize';

namecase('JUAN DE LA MAZA')  // → 'Juan de la Maza'
```

## Options

`capitalizeName` accepts an optional second argument. Omitting it keeps the default
behavior (and costs nothing — the built-in particle set is reused, not rebuilt).

```ts
capitalizeName(text, {
  particles,        // Iterable<string> — replace the built-in particle list entirely
  extraParticles,   // Iterable<string> — add particles on top of the defaults
  ignoreParticles,  // Iterable<string> — remove particles from the defaults
  mcPrefix,         // boolean — capitalize the letter after "Mc" (default false)
})
```

```ts
// Treat a default particle as a normal word (e.g. English "Van Dyke"):
capitalizeName('dick van dyke', { ignoreParticles: ['van'] })  // → 'Dick Van Dyke'

// Add domain-specific particles:
capitalizeName('joan sa costa', { extraParticles: ['sa'] })    // → 'Joan sa Costa'

// Opt into Mc handling:
capitalizeName('ronald mcdonald', { mcPrefix: true })          // → 'Ronald McDonald'
```

`extraParticles` / `ignoreParticles` are case-insensitive. `mcPrefix` only handles
`Mc` (via a rule); `Mac` is left untouched because it needs an exception list
(`Macey`, `Mackay`, `Machado`…) — see the limitation below.

## Behavior

- Particles (`de`, `del`, `van`, `von`, `di`, `da`, `bin`…) stay lowercase unless they are the first word.
- Multi-word particles (`van der`, `de la`, `de los`…) work because each of their words is treated as a particle (`Otto van den Berg`).
- Words after a hyphen or apostrophe are always capitalized (`Jean-Pierre`, `O'Higgins`).
- Unicode letters are handled natively (`Ñ`, `Ö`, `Ş`, `Å`…).
- Leading/trailing whitespace is trimmed.
- Returns an empty string for empty, whitespace-only, or non-string input.

### Known limitation: intra-word capitals

The input is lowercased before re-capitalizing, so casing **inside** a word is not
preserved. Names that carry a capital after the first letter come out normalized:

```ts
capitalizeName('RONALD MCDONALD')  // → 'Ronald Mcdonald'  (not 'McDonald')
capitalizeName('DeShawn')          // → 'Deshawn'
```

Only the first letter of each name segment is uppercased. `Mc` can be enabled with
`{ mcPrefix: true }`, but `Mac` prefixes and camel-cased names (`DeShawn`, `LaToya`)
are out of scope by design — distinguishing `MacArthur` from `Machado` needs an
exception dictionary, which would trade the library's small footprint for coverage.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).

## License

[MIT](./LICENSE) © Gabriel Galilea
