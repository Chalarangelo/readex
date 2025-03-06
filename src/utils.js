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
 * Joins an array of segments into a single segment, using the specified separator.
 *
 * @param {RegExp[]} segments - The array of segments to join.
 * @param {string} [separator=''] - The separator to use between segments.
 * @returns {RegExp} A new segment object containing the joined segments.
 */
export const joinSegments = (expressions, separator = '') =>
  new RegExp(
    expressions
      .map(toSegment)
      .map(s => s.source)
      .join(separator)
  );

/**
 * Wraps an array of expressions with the provided prefix and suffix,
 * and joins them using the specified separator.
 *
 * @param {string} prefix - The prefix to add to the beginning of the expression.
 * @param {string} suffix - The suffix to add to the end of the expression.
 * @param {string} separator - The separator to use between expressions.
 * @param {function} mapFn - A function to apply to each expression before joining.
 * @returns {function} A function that takes an array of expressions and returns
 *    a new RegExp object.
 */
export const wrapSegments =
  (prefix = '', suffix = '', separator = '', mapFn = x => x) =>
  (...expressions) =>
    new RegExp(
      `${prefix}${
        joinSegments(expressions.map(mapFn), separator).source
      }${suffix}`
    );
