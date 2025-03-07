import { describe, it, expect } from 'vitest';
import { toSegmentSource, toSegments, toCharacterSet } from '#src/utils.js';

describe('toSegmentSource', () => {
  describe('when value is a RegExp instance', () => {
    describe.each([
      ['no special characters', /some value/, 'some value'],
      ['flags', /some value/gi, 'some value'],
      ['special characters', /some value./, 'some value.'],
    ])('and the RegExp contains %s', (_, expression, expected) => {
      it('copies the RegExp source', () => {
        expect(toSegmentSource(expression)).toEqual(expected);
      });
    });
  });

  describe('when value is ', () => {
    describe.each([
      ['a number', 123, '123'],
      ['a decimal value', 1.2, String.raw`1\.2`],
      ['a string', 'some value', 'some value'],
      ['a string without special characters', 'a bc', 'a bc'],
      ['a string with special characters', 'foo %@#! 1234', 'foo %@#! 1234'],
      [
        'a string with escapaed characters',
        String.raw`\.|*?+(){}^$-[]`,
        String.raw`\\\.\|\*\?\+\(\)\{\}\^\$\-\[\]`,
      ],
      ['a string with many slashes', String.raw`\\\\`, String.raw`\\\\\\\\`],
      ['a string with multiple slashes', String.raw`\\.`, String.raw`\\\\\.`],
      ['NaN', NaN, 'NaN'],
      ['Infinity', Infinity, 'Infinity'],
      ['negative Infinity', -Infinity, String.raw`\-Infinity`],
    ])('%s', (_, expression, expected) => {
      it('sanitizes the expression', () => {
        expect(toSegmentSource(expression)).toEqual(expected);
      });
    });
  });

  it.each([true, false, undefined, null, {}, () => {}, new Date()])(
    'should throw an error when called with %s',
    val => {
      expect(() => sanitize(val)).toThrow();
    }
  );
});

describe('toSegments', () => {
  describe.each([
    ['a single string', ['some value'], ['some value']],
    ['a single number', [123], ['123']],
    ['a single RegExp', [/some value/], ['some value']],
    ['a single RegExp with flags', [/some value/gi], ['some value']],
    [
      'a single RegExp with special characters',
      [/some value./],
      ['some value.'],
    ],
    ['multiple strings', ['a', 'b'], ['a', 'b']],
    ['a string and a number', ['a', 123], ['a', '123']],
    ['a string and a RegExp', ['a', /b/], ['a', 'b']],
    ['a string and a RegExp with flags', ['a', /b/gim], ['a', 'b']],
    ['multiple RegExps', [/a/, /b/], ['a', 'b']],
    ['a string, a RegExp, and a number', ['a', /b/, 123], ['a', 'b', '123']],
  ])('when called with %s', (_, expressions, expected) => {
    describe.each(['', '-', '|'])('and a "%s" separator', separator => {
      it('joins the expressions', () => {
        expect(toSegments('', '', separator)(...expressions).source).toEqual(
          expected.join(separator)
        );
      });
    });
  });
});

describe('toCharacterSet', () => {
  describe('when given a string, number or RegExp', () => {
    it.each([
      ['abc', 'abc'],
      ['a-z', String.raw`a\-z`],
      ['[ab]', String.raw`\[ab\]`],
      ['[^a]', String.raw`\[\^a\]`],
      [1, '1'],
      [/ab/gm, 'ab'],
      [/a-z/gm, 'a-z'],
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

  describe.each([['a,', 'b', 'c'], null, undefined, () => {}, {}])(
    'when given anything else (%s) ',
    value => {
      it('should throw an error', () => {
        expect(() => toCharacterSet(value)).toThrow();
      });
    }
  );
});
