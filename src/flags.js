export const DEFAULT_FLAGS = {
  dotAll: false,
  global: true,
  ignoreCase: false,
  multiline: true,
  sticky: false,
  unicode: false,
};

const FLAG_MAP = {
  dotAll: 's',
  global: 'g',
  ignoreCase: 'i',
  multiline: 'm',
  sticky: 'y',
  unicode: 'u',
};

class Flags {
  constructor(flags) {
    this.value = {
      ...DEFAULT_FLAGS,
      ...flags,
    };
  }

  toString() {
    return Object.entries(this.value).reduce(
      (acc, [flag, value]) => (value ? acc + FLAG_MAP[flag] : acc),
      ''
    );
  }
}

/**
 * Converts the given input to a Flags object.
 *
 * @param {Object|Flags} flags - The input to be converted to a Flags instance.
 * @returns {Flags} An Flags object.
 * @throws {TypeError} If the input is not an object or a Flags instance.
 */
export const asFlags = flags => {
  if (flags instanceof Flags) return flags;
  if (!(flags instanceof Object))
    throw new TypeError('flags must be an object');
  return new Flags(flags);
};
