import { nonCaptureGroup } from './group.js';

const toLookAround = (expressions, prefix) =>
  new RegExp(`(?${prefix}${nonCaptureGroup(...expressions).source})`);

/**
 * Creates a new loohahead group segment with the provided expressions.
 *
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @returns {RegExp} The new loohahead group segment.
 */
export const lookahead = (...expressions) => toLookAround(expressions, '=');

/**
 * Creates a new negative loohahead group segment with the provided expressions.
 *
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @returns {RegExp} The new loohahead group segment.
 */
export const negativeLookahead = (...expressions) =>
  toLookAround(expressions, '!');

/**
 * Creates a new lookbehind group segment with the provided expressions.
 *
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @returns {RegExp} The new lookbehind group segment.
 */
export const lookbehind = (...expressions) => toLookAround(expressions, '<=');

/**
 * Creates a new negative lookbehind group segment with the provided expressions.
 *
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @returns {RegExp} The new lookbehind group segment.
 */
export const negativeLookbehind = (...expressions) =>
  toLookAround(expressions, '<!');
