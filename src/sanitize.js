/**
 * Sanitizes a given value by escaping special characters used in regular expressions.
 *
 * @param {(string|number)} val - The value to sanitize. Must be a string or a number.
 * @returns {string} The sanitized string with special characters escaped.
 * @throws {TypeError} If the provided value is not a string or a number.
 */
const sanitize = val => {
  if (typeof val !== 'string' && typeof val !== 'number')
    throw new TypeError('Value must be a string or a number');
  return `${val}`.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&');
};

export default sanitize;
