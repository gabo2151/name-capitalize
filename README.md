# name-capitalize

[![npm version](https://img.shields.io/npm/v/name-capitalize/legacy)](https://www.npmjs.org/package/name-capitalize)
[![install size](https://packagephobia.com/badge?p=name-capitalize@legacy)](https://packagephobia.com/result?p=name-capitalize@legacy)
[![npm downloads](https://img.shields.io/npm/dm/name-capitalize)](https://npm-stat.com/charts.html?package=name-capitalize)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Lightweight, zero-dependency utility for smart capitalization of person names. Handles particles (`de`, `van`, `von`…), hyphenated names, apostrophes, and Unicode characters.

> **This is the legacy branch (v1), compatible with Node 16 and Angular 12.** For the current version see [`main`](../../tree/main) (`npm install name-capitalize`).

## Install

```bash
npm install name-capitalize@legacy
```

Requires Node 16 or higher.

## Usage

```ts
import { capitalizeName } from 'name-capitalize';

capitalizeName('JUAN DE LA MAZA')         // → 'Juan de la Maza'
capitalizeName('ludwig van beethoven')    // → 'Ludwig van Beethoven'
capitalizeName("bernardo o'higgins")      // → "Bernardo O'Higgins"
capitalizeName('JEAN-PIERRE DUPONT')      // → 'Jean-Pierre Dupont'
capitalizeName('gabriel garcía márquez')  // → 'Gabriel García Márquez'
```

## Behavior

- Particles (`de`, `del`, `van`, `von`, `di`, `da`, `bin`…) stay lowercase unless they are the first word.
- Multi-word particles (`van der`, `de la`, `de los`…) are handled as a unit.
- Words after a hyphen or apostrophe are always capitalized (`Jean-Pierre`, `O'Higgins`).
- Unicode letters are handled natively (`Ñ`, `Ö`, `Ş`, `Å`…).
- Leading/trailing whitespace is trimmed.
- Returns an empty string for empty, whitespace-only, or non-string input.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).

## License

[MIT](./LICENSE) © Gabriel Galilea