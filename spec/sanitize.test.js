import { describe, it, expect } from 'vitest';
import { sanitize } from '#src/sanitize.js';

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
