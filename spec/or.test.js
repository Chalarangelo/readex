import { describe, it, expect } from 'vitest';
import './matchers.js';

import readEx from '#src/readEx.js';
import { or } from '#src/or.js';

describe('or', () => {
  it('should match either of the patterns', () => {
    expect(readEx([/^/, or('a', 'b'), /$/])).toMatchString('a');
    expect(readEx([/^/, or('a', 'b'), /$/])).toMatchString('b');
  });

  it('should not match other patterns', () => {
    expect(readEx([/^/, or('a', 'b'), /$/])).not.toMatchString('c');
  });

  it('should match an individual option, not both', () => {
    expect(readEx([/^/, or('a', 'b'), /$/])).not.toMatchString('ab');
  });

  it('should work with a single pattern', () => {
    expect(readEx([/^/, or('a'), /$/])).toMatchString('a');
  });
});
