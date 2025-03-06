import { wrapSegments } from './utils.js';

/**
 * Creates a new loohahead group segment with the provided expressions.
 *
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @returns {RegExp} The new loohahead group segment.
 */
export const lookahead = wrapSegments(`(?=(?:`, `))`);

/**
 * Creates a new negative loohahead group segment with the provided expressions.
 *
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @returns {RegExp} The new loohahead group segment.
 */
export const negativeLookahead = wrapSegments(`(?!(?:`, `))`);

/**
 * Creates a new lookbehind group segment with the provided expressions.
 *
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @returns {RegExp} The new lookbehind group segment.
 */
export const lookbehind = wrapSegments(`(?<=(?:`, `))`);

/**
 * Creates a new negative lookbehind group segment with the provided expressions.
 *
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @returns {RegExp} The new lookbehind group segment.
 */
export const negativeLookbehind = wrapSegments(`(?<!(?:`, `))`);
