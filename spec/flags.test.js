import { describe, it, expect } from 'vitest';
import { asFlags } from '#src/flags.js';

describe('asFlags', () => {
  describe.each([
    [
      'no flags',
      {},
      {
        dotAll: false,
        global: true,
        ignoreCase: false,
        multiline: true,
        sticky: false,
        unicode: false,
      },
      'gm',
    ],
    [
      'some flags',
      { global: false, ignoreCase: true },
      {
        dotAll: false,
        multiline: true,
        sticky: false,
        unicode: false,
        global: false,
        ignoreCase: true,
      },
      'im',
    ],
    [
      'all flags',
      {
        dotAll: true,
        global: false,
        ignoreCase: true,
        multiline: false,
        sticky: true,
        unicode: true,
      },
      {
        dotAll: true,
        global: false,
        ignoreCase: true,
        multiline: false,
        sticky: true,
        unicode: true,
      },
      'siyu',
    ],
  ])('with %s', (_, flags, expected, expectedString) => {
    it(`when converted to object should produce correct flags`, () => {
      expect(asFlags(flags).value).toMatchObject(expected);
    });

    it(`when converted to string should produce correct value`, () => {
      expect(asFlags(flags).toString()).toEqual(expectedString);
    });
  });
});
