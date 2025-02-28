import { expect } from 'vitest';

expect.extend({
  toMatchString(regex, string) {
    const pass = regex.test(string);
    return {
      pass,
      message: () => `expected ${regex} to match "${string}"`,
    };
  },
});
