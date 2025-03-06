import { describe, it, expect } from 'vitest';
import './matchers.js';

import readEx from '#src/readEx.js';
import {
  toCharacterSet,
  anythingBut,
  anythingFrom,
} from '#src/characterSet.js';

describe('toCharacterSet', () => {
  describe('when given a string or number', () => {
    it.each([
      ['abc', 'abc'],
      ['a-z', String.raw`a\-z`],
      ['[ab]', String.raw`\[ab\]`],
      ['[^a]', String.raw`\[\^a\]`],
      [1, '1'],
    ])(
      'produces a segment that matches the characters exactly (%s) -> (%s)',
      (expression, expected) => {
        expect(toCharacterSet(expression).source).toEqual(expected);
      }
    );
  });

  describe('when given a 2-element array', () => {
    it.each([
      [['a', 'z'], String.raw`a-z`],
      [['0', '9'], String.raw`0-9`],
      [['A', 'Z'], String.raw`A-Z`],
    ])(
      'produces a segment that matches the character range (%s) -> (%s)',
      (expression, expected) => {
        expect(toCharacterSet(expression).source).toEqual(expected);
      }
    );
  });

  describe.each([['a,', 'b', 'c'], null, undefined, () => {}, {}, /ab/gm])(
    'when given anything else (%s) ',
    value => {
      it('should throw an error', () => {
        expect(() => toCharacterSet(value)).toThrow();
      });
    }
  );
});

describe('anythingFrom', () => {
  describe('when given a string', () => {
    describe.each([
      ['abc', ['a', 'b', 'c'], ['d']],
      ['a-z', ['a', '-', 'z'], ['b']],
      ['[ab]', ['a', '[', 'b', ']'], ['d']],
      ['[^a]', ['^', '[', 'a', ']'], ['d']],
    ])('matches exactly', (expression, matches, nonMatches) => {
      matches.forEach(str => {
        it(`${expression} matches ${str}`, () => {
          expect(readEx([/^/, anythingFrom(expression), /$/])).toMatchString(
            str
          );
        });
      });

      nonMatches.forEach(str => {
        it(`${expression} does not match ${str}`, () => {
          expect(
            readEx([/^/, anythingFrom(expression), /$/])
          ).not.toMatchString(str);
        });
      });
    });
  });

  describe('when given a single range array', () => {
    describe.each([
      [
        ['a', 'z'],
        ['a', 'b', 'e', 'z'],
        ['A', 'Z', '0', '9'],
      ],
      [
        ['0', '9'],
        ['0', '1', '8', '9'],
        ['A', 'Z', 'a', 'z'],
      ],
      [
        ['A', 'Z'],
        ['A', 'B', 'E', 'Z'],
        ['0', '9', 'a', 'z'],
      ],
      [
        ['^', 'a'],
        ['^', '`', 'a'],
        ['b', 'c'],
      ],
    ])('matches a range', (expression, matches, nonMatches) => {
      matches.forEach(str => {
        it(`[${expression.join('-')}] matches ${str}`, () => {
          expect(readEx([/^/, anythingFrom(expression), /$/])).toMatchString(
            str
          );
        });
      });

      nonMatches.forEach(str => {
        it(`[${expression.join('-')}] does not match ${str}`, () => {
          expect(
            readEx([/^/, anythingFrom(expression), /$/])
          ).not.toMatchString(str);
        });
      });
    });
  });

  describe('when given multiple ranges and strings ([a-df0-3B-D\\^\\-])', () => {
    const expression = [['a', 'd'], 'f', ['0', '3'], ['B', 'D'], '^', '-'];
    it.each([
      'a',
      'b',
      'c',
      'd',
      'f',
      '0',
      '1',
      '2',
      '3',
      'B',
      'C',
      'D',
      '^',
      '-',
    ])('matches characters in the given patterns (%s)', character => {
      expect(readEx([/^/, anythingFrom(...expression), /$/])).toMatchString(
        character
      );
    });

    it.each(['e', '4', 'A', 'E', ' ', '_'])(
      'does not match characters in the given patterns',
      character => {
        expect(
          readEx([/^/, anythingFrom(...expression), /$/])
        ).not.toMatchString(character);
      }
    );
  });
});

describe('anythingBut', () => {
  describe('when given a string', () => {
    describe.each([
      ['abc', ['d'], ['a', 'b', 'c']],
      ['a-z', ['d'], ['a', '-', 'z']],
      ['[ab]', ['d'], ['a', '[', 'b', ']']],
      ['[^a]', ['d'], ['^', '[', 'a', ']']],
    ])('matches exactly', (expression, matches, nonMatches) => {
      matches.forEach(str => {
        it(`${expression} matches ${str}`, () => {
          expect(readEx([/^/, anythingBut(expression), /$/])).toMatchString(
            str
          );
        });
      });

      nonMatches.forEach(str => {
        it(`${expression} does not match ${str}`, () => {
          expect(readEx([/^/, anythingBut(expression), /$/])).not.toMatchString(
            str
          );
        });
      });
    });
  });

  describe('when given a single range array', () => {
    describe.each([
      [
        ['a', 'z'],
        ['A', 'Z', '0', '9'],
        ['a', 'b', 'e', 'z'],
      ],
      [
        ['0', '9'],
        ['A', 'Z', 'a', 'z'],
        ['0', '1', '8', '9'],
      ],
      [
        ['A', 'Z'],
        ['0', '9', 'a', 'z'],
        ['A', 'B', 'E', 'Z'],
      ],
      [
        ['^', 'a'],
        ['b', 'c'],
        ['^', '`', 'a'],
      ],
    ])('matches a range', (expression, matches, nonMatches) => {
      matches.forEach(str => {
        it(`[^${expression.join('-')}] matches ${str}`, () => {
          expect(readEx([/^/, anythingBut(expression), /$/])).toMatchString(
            str
          );
        });
      });

      nonMatches.forEach(str => {
        it(`[^${expression.join('-')}] does not match ${str}`, () => {
          expect(readEx([/^/, anythingBut(expression), /$/])).not.toMatchString(
            str
          );
        });
      });
    });
  });

  describe('when given multiple ranges and strings ([a-df0-3B-D\\^\\-])', () => {
    const expression = [['a', 'd'], 'f', ['0', '3'], ['B', 'D'], '^', '-'];
    it.each(['e', '4', 'A', 'E', ' ', '_'])(
      'matches characters not in the given patterns (%s)',
      character => {
        expect(readEx([/^/, anythingBut(...expression), /$/])).toMatchString(
          character
        );
      }
    );

    it.each([
      'a',
      'b',
      'c',
      'd',
      'f',
      '0',
      '1',
      '2',
      '3',
      'B',
      'C',
      'D',
      '^',
      '-',
    ])('does not match characters in the given patterns', character => {
      expect(readEx([/^/, anythingBut(...expression), /$/])).not.toMatchString(
        character
      );
    });
  });
});
