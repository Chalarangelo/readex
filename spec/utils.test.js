import { describe, it, expect } from 'vitest';
import { sanitize, toSegment, toSegments } from '#src/utils.js';

describe('sanitize', () => {
  it.each([
    ['without special characters', 'a bc', 'a bc'],
    ['with special characters', 'foo %@#! 1234', 'foo %@#! 1234'],
    [
      'with escapaed characters',
      String.raw`\.|*?+(){}^$-[]`,
      String.raw`\\\.\|\*\?\+\(\)\{\}\^\$\-\[\]`,
    ],
    ['with many slashes', String.raw`\\\\`, String.raw`\\\\\\\\`],
    ['with multiple slashes', String.raw`\\.`, String.raw`\\\\\.`],
    ['with a numeric value', 1, '1'],
    ['with a decimal value', 1.2, String.raw`1\.2`],
    ['with NaN', NaN, 'NaN'],
    ['with Infinity', Infinity, 'Infinity'],
    ['with negative Infinity', -Infinity, String.raw`\-Infinity`],
  ])('should return the correct result %s (%s) -> (%s)', (_, val, expected) => {
    expect(sanitize(val)).toBe(expected);
  });

  it.each([
    true,
    false,
    undefined,
    null,
    {},
    () => {},
    new RegExp(),
    new Date(),
  ])('should throw an error when called with %s', val => {
    expect(() => sanitize(val)).toThrow();
  });
});

describe('toSegment', () => {
  describe('when value is a RegExp segment', () => {
    it('copies the segment value', () => {
      const segment = toSegment('some value');
      expect(toSegment(segment).source).toEqual('some value');
    });
  });

  describe('when value is a RegExp instance', () => {
    describe.each([
      ['no special characters', /some value/, 'some value'],
      ['flags', /some value/gi, 'some value'],
      ['special characters', /some value./, 'some value.'],
    ])('and the RegExp contains %s', (_, expression, expected) => {
      it('copies the RegExp source', () => {
        expect(toSegment(expression).source).toEqual(expected);
      });
    });
  });

  describe('when value is ', () => {
    describe.each([
      ['a string', 'some value', 'some value'],
      ['a number', 123, '123'],
    ])('%s', (_, expression, expected) => {
      it('sanitizes the expression', () => {
        expect(toSegment(expression).source).toEqual(expected);
      });
    });
  });
});

describe('joinSegments (toSegments())', () => {
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
    it.each(['', '-', '|'])('and a "%s" separator', separator => {
      expect(toSegments('', '', separator)(...expressions).source).toEqual(
        expected.join(separator)
      );
    });
  });
});
