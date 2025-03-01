import { describe, it, expect } from 'vitest';
import './matchers.js';

import readEx from '#src/readEx.js';
import {
  digit,
  nonDigit,
  wordCharacter,
  nonWordCharacter,
  whitespaceCharacter,
  nonWhitespaceCharacter,
} from '#src/characterClasses.js';

describe('digit', () => {
  it.each(Array.from({ length: 9 }, (_, i) => `${i}`))(
    'matches any digit (%s)',
    str => {
      expect(readEx([/^/, digit, /$/])).toMatchString(str);
    }
  );

  it.each(['a', '!', ' '])('does not match non-digit characters', str => {
    expect(readEx([/^/, digit, /$/])).not.toMatchString(str);
  });

  it('should not match more than one digit', () => {
    expect(readEx([/^/, digit, /$/])).not.toMatchString('12');
  });
});

describe('nonDigit', () => {
  it.each(['a', '!', ' '])('matches any non-digit (%s)', str => {
    expect(readEx([/^/, nonDigit, /$/])).toMatchString(str);
  });

  it.each(Array.from({ length: 9 }, (_, i) => `${i}`))(
    'does not match digit characters',
    str => {
      expect(readEx([/^/, nonDigit, /$/])).not.toMatchString(str);
    }
  );

  it('should not match more than one non-digit', () => {
    expect(readEx([/^/, nonDigit, /$/])).not.toMatchString('ab');
  });
});

describe('wordCharacter', () => {
  it.each(['a', 'A', '0', '_'])('matches any word character (%s)', str => {
    expect(readEx([/^/, wordCharacter, /$/])).toMatchString(str);
  });

  it.each(['!', ' ', '-'])('does not match non-word characters', str => {
    expect(readEx([/^/, wordCharacter, /$/])).not.toMatchString(str);
  });

  it('should not match more than one word character', () => {
    expect(readEx([/^/, wordCharacter, /$/])).not.toMatchString('ab');
  });
});

describe('nonWordCharacter', () => {
  it.each(['!', ' ', '-'])('matches any non-word character (%s)', str => {
    expect(readEx([/^/, nonWordCharacter, /$/])).toMatchString(str);
  });

  it.each(['a', 'A', '0', '_'])('does not match word characters', str => {
    expect(readEx([/^/, nonWordCharacter, /$/])).not.toMatchString(str);
  });

  it('should not match more than one non-word character', () => {
    expect(readEx([/^/, nonWordCharacter, /$/])).not.toMatchString('ab');
  });
});

describe('whitespaceCharacter', () => {
  it.each([' ', '\t', '\n', '\r'])(
    'matches any whitespace character (%s)',
    str => {
      expect(readEx([/^/, whitespaceCharacter, /$/])).toMatchString(str);
    }
  );

  it.each(['a', 'A', '0', '_', '-'])(
    'does not match non-whitespace characters',
    str => {
      expect(readEx([/^/, whitespaceCharacter, /$/])).not.toMatchString(str);
    }
  );

  it('should not match more than one whitespace character', () => {
    expect(readEx([/^/, whitespaceCharacter, /$/])).not.toMatchString('ab');
  });
});

describe('nonWhitespaceCharacter', () => {
  it.each(['a', 'A', '0', '_', '-'])(
    'matches any non-whitespace character (%s)',
    str => {
      expect(readEx([/^/, nonWhitespaceCharacter, /$/])).toMatchString(str);
    }
  );

  it.each([' ', '\t', '\n', '\r'])(
    'does not match whitespace characters',
    str => {
      expect(readEx([/^/, nonWhitespaceCharacter, /$/])).not.toMatchString(str);
    }
  );

  it('should not match more than one non-whitespace character', () => {
    expect(readEx([/^/, nonWhitespaceCharacter, /$/])).not.toMatchString('ab');
  });
});
