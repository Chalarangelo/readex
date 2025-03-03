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

const validateFlag = flag => {
  if (!Object.keys(DEFAULT_FLAGS).includes(flag))
    throw new TypeError(`Invalid flag: ${flag}`);

  return flag;
};

/**
 * Converts the given input to a flags string.
 *
 * @param {Object} flags - The input to be converted to a flags string.
 * @returns {string} A string representing the flags for the regular expression.
 * @throws {TypeError} If the input is not an object or if the flags are invalid.
 */
export const asFlags = flags => {
  if (!(flags instanceof Object))
    throw new TypeError('flags must be an object');

  return Object.entries(
    Object.entries(flags).reduce(
      (acc, [flag, value]) => {
        if (value !== undefined) acc[validateFlag(flag)] = value;

        return acc;
      },
      { ...DEFAULT_FLAGS }
    )
  ).reduce((acc, [flag, value]) => (value ? acc + FLAG_MAP[flag] : acc), '');
};
