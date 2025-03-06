/**
 * Sanitizes a given value by escaping special characters used in regular expressions.
 *
 * @param {(string|number)} val - The value to sanitize. Must be a string or a number.
 * @returns {string} The sanitized string with special characters escaped.
 * @throws {TypeError} If the provided value is not a string or a number.
 */
export const sanitize = val => {
  if (typeof val !== 'string' && typeof val !== 'number')
    throw new TypeError('Value must be a string or a number');
  return `${val}`.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&');
};

/**
 * Converts the given expression to a RegExp segment.
 *
 * @param {RegExp|string} expression - The expression to convert.
 * @returns {RegExp} - The resulting segment.
 */
export const toSegment = expression => {
  if (expression instanceof RegExp) return new RegExp(expression.source);
  return new RegExp(sanitize(expression));
};

/**
 * Wraps an array of expressions with the provided prefix and suffix,
 * and joins them using the specified separator.
 *
 * @param {string} [prefix=''] - The prefix to add to the beginning of the expression.
 * @param {string} [suffix=''] - The suffix to add to the end of the expression.
 * @param {string} [separator='']  - The separator to use between expressions.
 * @param {function} [mapFn=x=>x] - A function to apply to each expression before joining.
 * @returns {function} A function that takes an array of expressions and returns
 *    a new RegExp object.
 */
export const toSegments =
  (prefix = '', suffix = '', separator = '', mapFn = x => x) =>
  (...expressions) =>
    new RegExp(
      `${prefix}${expressions
        .map(e => toSegment(mapFn(e)).source)
        .join(separator)}${suffix}`
    );
