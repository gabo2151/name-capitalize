import { capitalizeName, namecase } from '../src/index';

// ---------------------------------------------------------------------------
// Helper to keep tests DRY
// ---------------------------------------------------------------------------
function cases(pairs: [string, string][]) {
  pairs.forEach(([input, expected]) => {
    it(`"${input}" → "${expected}"`, () => {
      expect(capitalizeName(input)).toBe(expected);
    });
  });
}

// ---------------------------------------------------------------------------
// 1. Edge cases & guard clauses
// ---------------------------------------------------------------------------
describe('edge cases', () => {
  it('returns empty string for empty input', () => {
    expect(capitalizeName('')).toBe('');
  });

  it('returns empty string for whitespace-only input', () => {
    expect(capitalizeName('   ')).toBe('');
  });

  it('handles a single letter', () => {
    expect(capitalizeName('a')).toBe('A');
  });

  it('handles a single uppercase letter', () => {
    expect(capitalizeName('Z')).toBe('Z');
  });

  it('trims leading and trailing whitespace', () => {
    expect(capitalizeName('  juan  ')).toBe('Juan');
  });

  it('returns empty string for null-ish input', () => {
    // @ts-expect-error testing runtime guard
    expect(capitalizeName(null)).toBe('');
    // @ts-expect-error testing runtime guard
    expect(capitalizeName(undefined)).toBe('');
  });
});

// ---------------------------------------------------------------------------
// 2. Basic capitalization
// ---------------------------------------------------------------------------
describe('basic capitalization', () => {
  cases([
    ['juan', 'Juan'],
    ['JUAN', 'Juan'],
    ['María', 'María'],
    ['MARÍA', 'María'],
    ['juan pérez', 'Juan Pérez'],
    ['JUAN PÉREZ', 'Juan Pérez'],
    ['ana maría', 'Ana María'],
    ['ANA MARÍA', 'Ana María'],
  ]);
});

// ---------------------------------------------------------------------------
// 3. Particles — must stay lowercase unless first word
// ---------------------------------------------------------------------------
describe('particles stay lowercase', () => {
  cases([
    // Spanish
    ['juan de dios', 'Juan de Dios'],
    ['miguel de la maza', 'Miguel de la Maza'],
    ['pedro del campo', 'Pedro del Campo'],
    ['rosa de los ángeles', 'Rosa de los Ángeles'],
    ['luis de las casas', 'Luis de las Casas'],
    // Portuguese
    ['ana da silva', 'Ana da Silva'],
    ['carlos dos santos', 'Carlos dos Santos'],
    // French
    ['charles de gaulle', 'Charles de Gaulle'],
    ['guy du bois', 'Guy du Bois'],
    // Germanic
    ['ludwig van beethoven', 'Ludwig van Beethoven'],
    ['otto von bismarck', 'Otto von Bismarck'],
    // Italian
    ['leonardo di caprio', 'Leonardo di Caprio'],
    ['giovanni della casa', 'Giovanni della Casa'],
    // Dutch multi-word particles (der / den must stay lowercase)
    ['johannes van der waals', 'Johannes van der Waals'],
    ['otto van den berg', 'Otto van den Berg'],
    // Spanish multi-word particles
    ['rosa de los ángeles', 'Rosa de los Ángeles'],
    ['miguel de la maza', 'Miguel de la Maza'],
    // Conjunction in compound surname
    ['miguel de cervantes y saavedra', 'Miguel de Cervantes y Saavedra'],
  ]);
});

// ---------------------------------------------------------------------------
// 4. Particle as first word → must be capitalized
// ---------------------------------------------------------------------------
describe('particle as first word gets capitalized', () => {
  cases([
    ['de la maza', 'De la Maza'],
    ['van gogh', 'Van Gogh'],
    ['von trapp', 'Von Trapp'],
    ['del toro', 'Del Toro'],
    ['da vinci', 'Da Vinci'],
  ]);
});

// ---------------------------------------------------------------------------
// 5. Hyphenated names — each part capitalized
// ---------------------------------------------------------------------------
describe('hyphenated names', () => {
  cases([
    ['jean-pierre', 'Jean-Pierre'],
    ['JEAN-PIERRE', 'Jean-Pierre'],
    ['marie-claire dupont', 'Marie-Claire Dupont'],
    ['ana-maría de la torre', 'Ana-María de la Torre'],
    ['josé-luis de la peña', 'José-Luis de la Peña'],
    // Triple hyphen (rare but valid)
    ['marie-anne-claire', 'Marie-Anne-Claire'],
  ]);
});

// ---------------------------------------------------------------------------
// 6. Apostrophe names — letter after apostrophe capitalized
// ---------------------------------------------------------------------------
describe("apostrophe names (O'Higgins style)", () => {
  cases([
    ["o'higgins", "O'Higgins"],
    ["O'HIGGINS", "O'Higgins"],
    ["d'artagnan", "D'Artagnan"],
    ["D'ARTAGNAN", "D'Artagnan"],
    ["o'brien", "O'Brien"],
    ["mc'allister", "Mc'Allister"],
    // Apostrophe in a middle name
    ["bernardo o'higgins riquelme", "Bernardo O'Higgins Riquelme"],
    ["charles d'artagnan de batz", "Charles D'Artagnan de Batz"],
  ]);
});

// ---------------------------------------------------------------------------
// 7. Unicode & accented characters
// ---------------------------------------------------------------------------
describe('unicode and accented characters', () => {
  cases([
    ['ñoño ñañez', 'Ñoño Ñañez'],
    ['ångström', 'Ångström'],
    ['ülkü şahin', 'Ülkü Şahin'],
    ['óscar', 'Óscar'],
    ['ève', 'Ève'],
    ['índira', 'Índira'],
  ]);
});

// ---------------------------------------------------------------------------
// 8. Real-world compound names (stress test)
// ---------------------------------------------------------------------------
describe('real-world compound names', () => {
  cases([
    // Chilean hero
    ['bernardo o\'higgins riquelme', "Bernardo O'Higgins Riquelme"],
    // Spanish compound surname
    ['gabriel garcía márquez', 'Gabriel García Márquez'],
    // German composer
    ['ludwig van beethoven', 'Ludwig van Beethoven'],
    // Italian polymath
    ['leonardo da vinci', 'Leonardo da Vinci'],
    // French president
    ['charles de gaulle', 'Charles de Gaulle'],
    // Dutch painter
    ['vincent van gogh', 'Vincent van Gogh'],
    // Spanish explorer
    ['juan ponce de león', 'Juan Ponce de León'],
    // Portuguese explorer
    ['vasco da gama', 'Vasco da Gama'],
    // Arabic-style name
    ['ali bin husain', 'Ali bin Husain'],
    // French musketeers author
    ['alexandre dumas', 'Alexandre Dumas'],
    // Mexican surname with compound particle
    ['frida kahlo de rivera', 'Frida Kahlo de Rivera'],
    // Full Chilean name with two particles
    ['javiera de la carrera y fontecilla', 'Javiera de la Carrera y Fontecilla'],
    // Hyphen + particle combo
    ['marie-curie de la sorbonne', 'Marie-Curie de la Sorbonne'],
    // Irish-style
    ["seamus o'brien-mcallister", "Seamus O'Brien-Mcallister"],
  ]);
});

// ---------------------------------------------------------------------------
// 9. Casing normalization (input is already mixed/correct case)
// ---------------------------------------------------------------------------
describe('normalizes pre-capitalized input correctly', () => {
  cases([
    ['Juan Pérez', 'Juan Pérez'],
    ['JUAN DE LA MAZA', 'Juan de la Maza'],
    ["BERNARDO O'HIGGINS", "Bernardo O'Higgins"],
    ['Ludwig Van Beethoven', 'Ludwig van Beethoven'],
  ]);
});

// ---------------------------------------------------------------------------
// 9b. Options: particle overrides & Mc prefix
// ---------------------------------------------------------------------------
describe('options: particle overrides', () => {
  it('ignoreParticles: treats a default particle as a normal word', () => {
    expect(capitalizeName('dick van dyke', { ignoreParticles: ['van'] })).toBe('Dick Van Dyke');
    // unaffected particles still behave
    expect(capitalizeName('juan de la maza', { ignoreParticles: ['van'] })).toBe('Juan de la Maza');
  });

  it('extraParticles: adds new lowercase particles', () => {
    expect(capitalizeName('joan sa costa', { extraParticles: ['sa'] })).toBe('Joan sa Costa');
  });

  it('particles: replaces the whole set', () => {
    // only "of" stays lowercase now; "de" is no longer a particle
    expect(capitalizeName('juan de la maza', { particles: ['of'] })).toBe('Juan De La Maza');
    expect(capitalizeName('john of gaunt', { particles: ['of'] })).toBe('John of Gaunt');
  });

  it('extra/ignore are case-insensitive', () => {
    expect(capitalizeName('dick van dyke', { ignoreParticles: ['VAN'] })).toBe('Dick Van Dyke');
    expect(capitalizeName('joan sa costa', { extraParticles: ['SA'] })).toBe('Joan sa Costa');
  });

  it('no options behaves exactly like the default call', () => {
    expect(capitalizeName('juan de la maza', {})).toBe('Juan de la Maza');
  });
});

describe('options: mcPrefix', () => {
  it('is off by default', () => {
    expect(capitalizeName('ronald mcdonald')).toBe('Ronald Mcdonald');
  });

  it('capitalizes the letter after Mc when enabled', () => {
    expect(capitalizeName('ronald mcdonald', { mcPrefix: true })).toBe('Ronald McDonald');
    expect(capitalizeName('mcallister', { mcPrefix: true })).toBe('McAllister');
  });

  it('handles Mc after hyphen and apostrophe', () => {
    expect(capitalizeName("seamus o'brien-mcallister", { mcPrefix: true })).toBe("Seamus O'Brien-McAllister");
  });

  it('leaves a bare "mc" untouched', () => {
    expect(capitalizeName('mc', { mcPrefix: true })).toBe('Mc');
  });

  it('does not touch Mac', () => {
    expect(capitalizeName('macarthur', { mcPrefix: true })).toBe('Macarthur');
  });
});

// ---------------------------------------------------------------------------
// 10. namecase alias
// ---------------------------------------------------------------------------
describe('namecase alias', () => {
  it('is a function', () => {
    expect(typeof namecase).toBe('function');
  });

  it('produces the same result as capitalizeName', () => {
    const samples = [
      'juan de la maza',
      "o'higgins",
      'jean-pierre dupont',
      'LUDWIG VAN BEETHOVEN',
    ];
    samples.forEach((s) => {
      expect(namecase(s)).toBe(capitalizeName(s));
    });
  });
});
