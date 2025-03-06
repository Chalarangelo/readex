import { nonCaptureGroup } from './group.js';

const toLookAround =
  prefix =>
  (...expressions) =>
    new RegExp(`(?${prefix}${nonCaptureGroup(...expressions).source})`);

/**
 * Creates a new loohahead group segment with the provided expressions.
 *
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @returns {RegExp} The new loohahead group segment.
 */
export const lookahead = toLookAround('=');

/**
 * Creates a new negative loohahead group segment with the provided expressions.
 *
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @returns {RegExp} The new loohahead group segment.
 */
export const negativeLookahead = toLookAround('!');

/**
 * Creates a new lookbehind group segment with the provided expressions.
 *
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @returns {RegExp} The new lookbehind group segment.
 */
export const lookbehind = toLookAround('<=');

/**
 * Creates a new negative lookbehind group segment with the provided expressions.
 *
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @returns {RegExp} The new lookbehind group segment.
 */
export const negativeLookbehind = toLookAround('<!');
