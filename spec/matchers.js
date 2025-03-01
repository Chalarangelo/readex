import { expect } from 'vitest';

expect.extend({
  toMatchString(regex, string) {
    const { isNot } = this;
    const pass = regex.test(string);
    return {
      pass,
      message: () =>
        `expected ${regex}${isNot ? ' not' : ''} to match "${string}"`,
    };
  },
});
