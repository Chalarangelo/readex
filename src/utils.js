import { asFlags } from './flags.js';

/**
 * Converts the given expression to the source of a regular expression.
 * If given a string or number, sanitizes the given value by escaping special
 * characters used in regular expressions.
 *
 * @param {RegExp|string|number} expression - The expression to convert.
 * @returns {string} The expression as a regular expression source.
 * @throws {TypeError} If the provided value is not a RegExp, string or number.
 */
export const toSegmentSource = expression => {
  if (expression instanceof RegExp) return expression.source;
  if (['string', 'number'].includes(typeof expression))
    return new RegExp(`${expression}`.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&'))
      .source;
  throw new TypeError('Expression must be a string or number');
};

/**
 * Wraps an array of expressions with the provided prefix and suffix,
 * and joins them using the specified separator.
 *
 * @param {string} [prefix=''] - The prefix to add to the beginning of the expression.
 * @param {string} [suffix=''] - The suffix to add to the end of the expression.
 * @param {string} [separator='']  - The separator to use between expressions.
 * @param {function} [mapFn=x=>x] - A function to apply to each expression before joining.
 * @param {Object} [flags={}] - An object specifying the flags to apply to the resulting RegExp.
 * @returns {function} A function that takes an array of expressions and returns
 *    a new RegExp object.
 */
export const toSegments =
  (prefix = '', suffix = '', separator = '', mapFn = x => x, flags = {}) =>
  (...expressions) =>
    new RegExp(
      `${prefix}${expressions
        .map(e => toSegmentSource(mapFn(e)))
        .join(separator)}${suffix}`,
      asFlags(flags)
    );

/**
 * Converts an expression to a character set.
 *
 * @param {string | Array} expression - The expression to convert. Must be either a string or a 2-element array.
 * @returns {RegExp} A new segment representing the character set.
 * @throws {TypeError} If the expression is not a string or a 2-element array.
 */
export const toCharacterSet = expression => {
  if (Array.isArray(expression) && expression.length === 2)
    return toSegments('', '', '-')(...expression);
  return toSegments()(expression);
};
