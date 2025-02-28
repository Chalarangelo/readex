import { describe, it, expect } from 'vitest';
import './matchers.js';

import readEx from '#src/readEx.js';
import { anyCharacter, anything, something } from '#src/wildcards.js';

describe('anyCharacter', () => {
  it.each(['a', '1', '.', '!', 'α'])(
    'should match any character (%s)',
    character => {
      expect(readEx([/^/, anyCharacter, /$/])).toMatchString(character);
    }
  );

  it.each(['\n', '\r', '\u2028', '\u2029'])(
    'should not match line terminators',
    character => {
      expect(readEx([/^/, anyCharacter, /$/])).not.toMatchString(character);
    }
  );

  it('should not match empty string', () => {
    expect(readEx([/^/, anyCharacter, /$/])).not.toMatchString('');
  });

  it('should not match more than one character', () => {
    expect(readEx([/^/, anyCharacter, /$/])).not.toMatchString('ab');
  });
});

describe('anything', () => {
  it.each(['a', '1', '.', '!', 'α', '\n', '\r', '\u2028', '\u2029'])(
    'should match any single character or line terminator',
    character => {
      expect(readEx([/^/, anything, /$/])).toMatchString(character);
    }
  );

  it('should match empty string', () => {
    expect(readEx([/^/, anything, /$/])).toMatchString('');
  });

  it.each(['ab', 'a\n', '\na', 'abc \n.α!', '\n a', '\n\n'])(
    'should match multiple characters and/or line terminators',
    string => {
      expect(readEx([/^/, anything, /$/])).toMatchString(string);
    }
  );
});

describe('something', () => {
  it.each(['a', '1', '.', '!', 'α'])(
    'should match any single character (%s)',
    character => {
      expect(readEx([/^/, something, /$/])).toMatchString(character);
    }
  );

  it.each(['\n', '\r', '\u2028', '\u2029', '\n\n'])(
    'should not match single or multiple line terminators',
    character => {
      expect(readEx([/^/, anyCharacter, /$/])).not.toMatchString(character);
    }
  );

  it('should not match empty string', () => {
    expect(readEx([/^/, something, /$/])).not.toMatchString('');
  });

  it.each(['ab', 'a\n', '\na', 'abc \n.α!', '\n a'])(
    'should match multiple characters and line terminators',
    string => {
      expect(readEx([/^/, something, /$/])).toMatchString(string);
    }
  );
});
