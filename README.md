# name-capitalize

[![npm version](https://img.shields.io/npm/v/name-capitalize)](https://www.npmjs.org/package/name-capitalize)
[![install size](https://packagephobia.com/badge?p=name-capitalize)](https://packagephobia.com/result?p=name-capitalize)
[![npm downloads](https://img.shields.io/npm/dm/name-capitalize)](https://npm-stat.com/charts.html?package=name-capitalize)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Lightweight, zero-dependency utility for smart capitalization of person names. Handles particles (`de`, `van`, `von`…), hyphenated names, apostrophes, and Unicode characters.

## Install

```bash
npm install name-capitalize
```

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
- Words after a hyphen or apostrophe are always capitalized (`Jean-Pierre`, `O'Higgins`).
- Unicode letters are handled natively (`Ñ`, `Ö`, `Ş`, `Å`…).
- Leading/trailing whitespace is trimmed.
- Returns an empty string for empty, whitespace-only, or non-string input.

## License

[MIT](./LICENSE) © Gabriel Galilea
