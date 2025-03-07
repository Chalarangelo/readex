import { toSegments } from './utils.js';

const isValidTimes = val => val === null || (Number.isInteger(val) && val >= 0);

const toRepeatSuffix = times => {
  const [min = 0, max = null] = Array.isArray(times) ? times : [times, times];

  if ((max !== null && min > max) || !isValidTimes(min) || !isValidTimes(max))
    throw new TypeError('Times must be a number or 2-number array.');

  return min === max ? `{${min}}` : `{${min},${max ?? ''}}`;
};

/**
 * Creates a new non-capturing group segment that greedily matches the expressions zero or one time.
 *
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @returns {RegExp} The new group segment.
 */
export const zeroOrOne = toSegments(`(?:`, `)?`);

/**
 * Creates a new non-capturing group segment that lazily matches the expressions zero or one time.
 *
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @returns {RegExp} The new group segment.
 */
export const zeroOrOneLazy = toSegments(`(?:`, `)??`);

/**
 * Creates a new non-capturing group segment that greedily matches the expressions one or more times.
 *
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @returns {RegExp} The new group segment.
 */
export const oneOrMore = toSegments(`(?:`, `)+`);

/**
 * Creates a new non-capturing group segment that lazily matches the expressions one or more times.
 *
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @returns {RegExp} The new group segment.
 */
export const oneOrMoreLazy = toSegments(`(?:`, `)+?`);

/**
 * Creates a new non-capturing group segment that greedily matches the expressions zero or more times.
 *
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @returns {RegExp} The new group segment.
 */
export const zeroOrMore = toSegments(`(?:`, `)*`);

/**
 * Creates a new non-capturing group segment that lazily matches the expressions zero or more times.
 *
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @returns {RegExp} The new group segment.
 */
export const zeroOrMoreLazy = toSegments(`(?:`, `)*?`);

/**
 * Creates a new non-capturing group segment that greedily matches the expressions a specific number of times.
 *
 * @param {(number|number[])} times - The number of times to match the expressions.
 *   If a number is provided, the expressions will be matched exactly that number of times.
 *   If an array is provided, the first element is the minimum number of times to match,
 *   and the second element is the maximum number of times to match. `null`/`undefined` can be used
 *   to indicate no limit. (e.g. [2,] matches 2 or more times, [,4] matches 4 or fewer times)
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @returns {RegExp} The new group segment.
 */
export const repeat = ({ times }, ...expressions) =>
  toSegments('(?:', `)${toRepeatSuffix(times)}`)(...expressions);

/**
 * Creates a new non-capturing group segment that lazily matches the expressions a specific number of times.
 *
 * @param {(number|number[])} times - The number of times to match the expressions.
 *   If a number is provided, the expressions will be matched exactly that number of times.
 *   If an array is provided, the first element is the minimum number of times to match,
 *   and the second element is the maximum number of times to match. `null`/`undefined` can be used
 *   to indicate no limit. (e.g. [2,] matches 2 or more times, [,4] matches 4 or fewer times)
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @returns {RegExp} The new group segment.
 */
export const repeatLazy = ({ times }, ...expressions) =>
  toSegments('(?:', `)${toRepeatSuffix(times)}?`)(...expressions);
