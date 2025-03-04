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
 * Converts a list of expressions into segments.
 *
 * @param {...(RegExp|string)} expressions - The expressions to convert.
 * @returns {RegExp[]} An array of segments.
 */
export const toSegments = (...expressions) => expressions.map(toSegment);

/**
 * Joins an array of segments into a single segment, using the specified separator.
 *
 * @param {RegExp[]} segments - The array of segments to join.
 * @param {string} [separator=''] - The separator to use between segments.
 * @returns {RegExp} A new segment object containing the joined segments.
 */
export const joinSegments = (segments, separator = '') =>
  new RegExp(segments.map(s => s.source).join(separator));
