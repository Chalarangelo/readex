import { toSegments } from './utils.js';

/**
 * Creates a new capturing group segment with the provided expressions.
 *
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @returns {RegExp} The new group segment.
 */
export const captureGroup = toSegments('(', ')');

/**
 * Creates a new non-capturing group segment with the provided expressions.
 *
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @returns {RegExp} The new group segment.
 */
export const nonCaptureGroup = toSegments('(?:', ')');

/**
 * Creates a new named group segment with the provided expressions.
 *
 * @param {Object} options - The group options.
 * @param {string} options.name - The name of the group.
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @throws {TypeError} If the group name is not a string.
 * @returns {RegExp} The new group segment.
 */
export const namedGroup = ({ name }, ...expressions) => {
  if (!name || typeof name !== 'string')
    throw new TypeError('Named groups must have a name.');
  return toSegments(`(?<${name}>`, ')')(...expressions);
};

/**
 * Combines multiple expressions into a single non-capturing group segment.
 *
 * @param {...(RegExp|string)} expressions - The expressions to be combined.
 * @returns {RegExp} The combined expression as a non-capturing group segment.
 */
export const concat = nonCaptureGroup;

/**
 * Combines multiple expressions into a single non-capturing group segment separated by the OR (`|`) operator.
 *
 * @param {...(RegExp|string)} expressions - The expressions to be combined.
 * @returns {RegExp} The combined expression as a non-capturing group segment.
 */
export const or = toSegments(`(?:`, ')', '|');
