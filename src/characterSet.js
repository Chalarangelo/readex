import { toSegments } from './utils.js';

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

/**
 * Creates a new segment that matches any character from the provided expressions.
 *
 * @param {...(string | Array)} expressions - The expressions to include in the character set.
 *    Each expression must be either a string or a 2-element array.
 * @returns {RegExp} A new segment that matches any character from the provided expressions.
 */
export const anythingFrom = toSegments(`[`, ']', '|', toCharacterSet);

/**
 * Creates a character set that matches any character not in the provided expressions.
 *
 * @param {...string} expressions - The expressions to exclude from the character set.
 *    Each expression must be either a string or a 2-element array.
 * @returns {RegExp} A segment that matches any character not in the provided expressions.
 */
export const anythingBut = toSegments(`[^`, ']', '|', toCharacterSet);
