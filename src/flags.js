export const FLAGS = {
  dotAll: [false, 's'],
  global: [true, 'g'],
  ignoreCase: [false, 'i'],
  multiline: [true, 'm'],
  sticky: [false, 'y'],
  unicode: [false, 'u'],
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
    throw new TypeError('Flags must be an object.');

  return Object.keys({ ...FLAGS, ...flags }).reduce((acc, flag) => {
    if (!(flag in FLAGS)) throw new TypeError('Invalid flag key.');
    return flags[flag] ?? FLAGS[flag][0] ? acc + FLAGS[flag][1] : acc;
  }, '');
};
