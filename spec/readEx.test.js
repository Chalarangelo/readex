import { describe, it, expect } from 'vitest';
import readEx from '#src/readEx.js';

describe('readEx', () => {
  it('should be a function', () => {
    expect(readEx).toBeTypeOf('function');
  });

  it('should create a RegExp instance', () => {
    expect(readEx(['some value'])).toBeInstanceOf(RegExp);
  });

  describe.each([
    ['a single string', ['some value'], /some value/gm],
    ['a single RegExp', [/some value/], /some value/gm],
    ['a single RegExp with flags', [/some value/gi], /some value/gm],
    [
      'a single RegExp with special characters',
      [/some value./],
      /some value./gm,
    ],
    ['multiple strings', ['a', 'b'], /ab/gm],
    ['a string and a RegExp', ['a', /b/], /ab/gm],
    ['a string and a RegExp with flags', ['a', /b/gim], /ab/gm],
    ['multiple RegExps', [/a/, /b/], /ab/gm],
  ])('when called with %s', (_, expressions, expected) => {
    it('should return a RegExp instance', () => {
      expect(readEx(expressions)).toEqual(expected);
    });
  });
});
