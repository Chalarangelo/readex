import { describe, it, expect } from 'vitest';
import './matchers.js';

import { readEx } from '#src/readEx.js';
import {
  zeroOrOne,
  zeroOrOneLazy,
  oneOrMore,
  oneOrMoreLazy,
  zeroOrMore,
  zeroOrMoreLazy,
  repeat,
  repeatLazy,
} from '#src/quantifiers.js';

describe('zeroOrOne', () => {
  it('should match the pattern if it is present', () => {
    expect(readEx([/^/, zeroOrOne('a'), /$/])).toMatchString('a');
  });

  it('should match the pattern if it is absent', () => {
    expect(readEx([/^/, zeroOrOne('a'), /$/])).toMatchString('');
  });

  it('should not match the pattern if it is not present', () => {
    expect(readEx([/^/, zeroOrOne('a'), /$/])).not.toMatchString('b');
  });

  it('should be greedy', () => {
    const regexp = readEx(['a', zeroOrOne(/./), 'a']);
    const [match] = regexp.exec('aaa');
    expect(match).toBe('aaa');
  });
});

describe('zeroOrOneLazy', () => {
  it('should match the pattern if it is present', () => {
    expect(readEx([/^/, zeroOrOneLazy('a'), /$/])).toMatchString('a');
  });

  it('should match the pattern if it is absent', () => {
    expect(readEx([/^/, zeroOrOneLazy('a'), /$/])).toMatchString('');
  });

  it('should not match the pattern if it is not present', () => {
    expect(readEx([/^/, zeroOrOneLazy('a'), /$/])).not.toMatchString('b');
  });

  it('should be lazy', () => {
    const regexp = readEx(['a', zeroOrOneLazy(/./), 'a']);
    const [match] = regexp.exec('aaa');
    expect(match).toBe('aa');
  });
});

describe('oneOrMore', () => {
  it('should match the pattern once', () => {
    expect(readEx([/^/, oneOrMore('a'), /$/])).toMatchString('a');
  });

  it('should match the pattern multiple times', () => {
    expect(readEx([/^/, oneOrMore('a'), /$/])).toMatchString('aaa');
  });

  it('should not match the pattern if it is not present', () => {
    expect(readEx([/^/, oneOrMore('a'), /$/])).not.toMatchString('');
  });

  it('should be greedy', () => {
    const regexp = readEx(['b', oneOrMore(/./), 'b']);
    const [match] = regexp.exec('bab bcb');
    expect(match).toBe('bab bcb');
  });
});

describe('oneOrMoreLazy', () => {
  it('should match the pattern once', () => {
    expect(readEx([/^/, oneOrMoreLazy('a'), /$/])).toMatchString('a');
  });

  it('should match the pattern multiple times', () => {
    expect(readEx([/^/, oneOrMoreLazy('a'), /$/])).toMatchString('aaa');
  });

  it('should not match the pattern if it is not present', () => {
    expect(readEx([/^/, oneOrMoreLazy('a'), /$/])).not.toMatchString('');
  });

  it('should be lazy', () => {
    const regexp = readEx(['b', oneOrMoreLazy(/./), 'b']);
    const [match] = regexp.exec('bab bcb');
    expect(match).toBe('bab');
  });
});

describe('zeroOrMore', () => {
  it('should match if the pattern is not present', () => {
    expect(readEx([/^/, zeroOrMore('a'), /$/])).toMatchString('');
  });

  it('should match the pattern once', () => {
    expect(readEx([/^/, zeroOrMore('a'), /$/])).toMatchString('a');
  });

  it('should match the pattern multiple times', () => {
    expect(readEx([/^/, zeroOrMore('a'), /$/])).toMatchString('aaa');
  });

  it('should be greedy by default', () => {
    const regexp = readEx(['b', zeroOrMore(/./), 'b']);
    const [match] = regexp.exec('bab bcb');
    expect(match).toBe('bab bcb');
  });
});

describe('zeroOrMoreLazy', () => {
  it('should match if the pattern is not present', () => {
    expect(readEx([/^/, zeroOrMoreLazy('a'), /$/])).toMatchString('');
  });

  it('should match the pattern once', () => {
    expect(readEx([/^/, zeroOrMoreLazy('a'), /$/])).toMatchString('a');
  });

  it('should match the pattern multiple times', () => {
    expect(readEx([/^/, zeroOrMoreLazy('a'), /$/])).toMatchString('aaa');
  });

  it('should be lazy', () => {
    const regexp = readEx(['b', zeroOrMoreLazy(/./), 'b']);
    const [match] = regexp.exec('bab bcb');
    expect(match).toBe('bab');
  });
});

describe('repeat', () => {
  describe('when given a number of times', () => {
    it('should match the pattern the specified number of times', () => {
      expect(readEx([/^/, repeat({ times: 3 }, 'a'), /$/])).toMatchString(
        'aaa'
      );
    });

    it('should not match the pattern fewer times', () => {
      expect(readEx([/^/, repeat({ times: 3 }, 'a'), /$/])).not.toMatchString(
        'aa'
      );
    });

    it('should not match the pattern more times', () => {
      expect(readEx([/^/, repeat({ times: 3 }, 'a'), /$/])).not.toMatchString(
        'aaaa'
      );
    });

    it('should throw an error if given a non-integer value', () => {
      expect(() => repeat({ times: 3.5 }, 'a')).toThrow();
    });
  });

  describe('when only a min is given', () => {
    it('should match the pattern the minimum number of times', () => {
      expect(readEx([/^/, repeat({ times: [2] }, 'a'), /$/])).toMatchString(
        'aa'
      );
    });

    it('should match the pattern more times', () => {
      expect(readEx([/^/, repeat({ times: [2] }, 'a'), /$/])).toMatchString(
        'aaa'
      );
    });

    it('should not match the pattern fewer times', () => {
      expect(readEx([/^/, repeat({ times: [2] }, 'a'), /$/])).not.toMatchString(
        'a'
      );
    });

    it('should throw an error if given a non-integer value', () => {
      expect(() => repeat({ times: [2.5] }, 'a')).toThrow();
    });
  });

  describe('when only a max is given', () => {
    it('should match the pattern the maximum number of times', () => {
      expect(readEx([/^/, repeat({ times: [, 2] }, 'a'), /$/])).toMatchString(
        'a'
      );
    });

    it('should match the pattern fewer times', () => {
      expect(readEx([/^/, repeat({ times: [, 2] }, 'a'), /$/])).toMatchString(
        'a'
      );
    });

    it('should not match the pattern more times', () => {
      expect(
        readEx([/^/, repeat({ times: [, 2] }, 'a'), /$/])
      ).not.toMatchString('aaa');
    });

    it('should throw an error if given a non-integer value', () => {
      expect(() => repeat({ times: [, 2.5] }, 'a')).toThrow();
    });
  });

  describe('when given both a min and a max', () => {
    it('should match the pattern the specified number of times', () => {
      expect(readEx([/^/, repeat({ times: [2, 3] }, 'a'), /$/])).toMatchString(
        'aa'
      );
      expect(readEx([/^/, repeat({ times: [2, 3] }, 'a'), /$/])).toMatchString(
        'aaa'
      );
    });

    it('should not match the pattern fewer times', () => {
      expect(
        readEx([/^/, repeat({ times: [2, 3] }, 'a'), /$/])
      ).not.toMatchString('a');
    });

    it('should not match the pattern more times', () => {
      expect(
        readEx([/^/, repeat({ times: [2, 3] }, 'a'), /$/])
      ).not.toMatchString('aasa');
    });

    it('should match the pattern exactly min times if min equals max', () => {
      expect(readEx([/^/, repeat({ times: [3, 3] }, 'a'), /$/])).toMatchString(
        'aaa'
      );
    });

    it('should throw an error if min is greater than max', () => {
      expect(() => repeat({ times: [3, 2] }, 'a')).toThrow();
    });
  });
});

describe('repeatLazy', () => {
  describe('when given a number of times', () => {
    it('should match the pattern the specified number of times', () => {
      expect(readEx([/^/, repeatLazy({ times: 3 }, 'a'), /$/])).toMatchString(
        'aaa'
      );
    });

    it('should not match the pattern fewer times', () => {
      expect(
        readEx([/^/, repeatLazy({ times: 3 }, 'a'), /$/])
      ).not.toMatchString('aa');
    });

    it('should not match the pattern more times', () => {
      expect(
        readEx([/^/, repeatLazy({ times: 3 }, 'a'), /$/])
      ).not.toMatchString('aaaa');
    });

    it('should throw an error if given a non-integer value', () => {
      expect(() => repeatLazy({ times: 3.5 }, 'a')).toThrow();
    });
  });

  describe('when only a min is given', () => {
    it('should match the pattern the minimum number of times', () => {
      expect(readEx([/^/, repeatLazy({ times: [2] }, 'a'), /$/])).toMatchString(
        'aa'
      );
    });

    it('should match the pattern more times', () => {
      expect(readEx([/^/, repeatLazy({ times: [2] }, 'a'), /$/])).toMatchString(
        'aaa'
      );
    });

    it('should not match the pattern fewer times', () => {
      expect(
        readEx([/^/, repeatLazy({ times: [2] }, 'a'), /$/])
      ).not.toMatchString('a');
    });

    it('should throw an error if given a non-integer value', () => {
      expect(() => repeatLazy({ times: [2.5] }, 'a')).toThrow();
    });
  });

  describe('when only a max is given', () => {
    it('should match the pattern the maximum number of times', () => {
      expect(
        readEx([/^/, repeatLazy({ times: [, 2] }, 'a'), /$/])
      ).toMatchString('a');
    });

    it('should match the pattern fewer times', () => {
      expect(
        readEx([/^/, repeatLazy({ times: [, 2] }, 'a'), /$/])
      ).toMatchString('a');
    });

    it('should not match the pattern more times', () => {
      expect(
        readEx([/^/, repeatLazy({ times: [, 2] }, 'a'), /$/])
      ).not.toMatchString('aaa');
    });

    it('should throw an error if given a non-integer value', () => {
      expect(() => repeatLazy({ times: [, 2.5] }, 'a')).toThrow();
    });
  });

  describe('when given both a min and a max', () => {
    it('should match the pattern the specified number of times', () => {
      expect(
        readEx([/^/, repeatLazy({ times: [2, 3] }, 'a'), /$/])
      ).toMatchString('aa');
      expect(
        readEx([/^/, repeatLazy({ times: [2, 3] }, 'a'), /$/])
      ).toMatchString('aaa');
    });

    it('should not match the pattern fewer times', () => {
      expect(
        readEx([/^/, repeatLazy({ times: [2, 3] }, 'a'), /$/])
      ).not.toMatchString('a');
    });

    it('should not match the pattern more times', () => {
      expect(
        readEx([/^/, repeatLazy({ times: [2, 3] }, 'a'), /$/])
      ).not.toMatchString('aasa');
    });

    it('should match the pattern exactly min times if min equals max', () => {
      expect(
        readEx([/^/, repeatLazy({ times: [3, 3] }, 'a'), /$/])
      ).toMatchString('aaa');
    });

    it('should throw an error if min is greater than max', () => {
      expect(() => repeatLazy({ times: [3, 2] }, 'a')).toThrow();
    });
  });
});
