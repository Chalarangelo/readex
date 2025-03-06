import { wrapSegments } from './utils.js';

const toQuantifier = suffix => wrapSegments(`(?:`, `)${suffix}`);

const toRepeat = (expressions, options) => {
  const { times, lazy } = options;

  const [min = null, max = null] = Array.isArray(times)
    ? times
    : [times, times];

  let hasError = min === null && max === null;
  if (min !== null && (!Number.isInteger(min) || min < 0)) hasError = true;
  if (
    max !== null &&
    (!Number.isInteger(max) || max < 0 || (min !== null && min > max))
  )
    hasError = true;

  if (hasError)
    throw new TypeError(
      'Invalid times option: times must be either a number or an array of two numbers.'
    );

  const [start, end] = [min ?? 0, max ?? ''];
  const suffix = start === end ? `{${start}}` : `{${start},${end}}`;

  return toQuantifier(lazy ? `${suffix}?` : suffix)(...expressions);
};

/**
 * Creates a new non-capturing group segment that greedily matches the expressions zero or one time.
 *
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @returns {RegExp} The new group segment.
 */
export const zeroOrOne = toQuantifier('?');

/**
 * Creates a new non-capturing group segment that lazily matches the expressions zero or one time.
 *
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @returns {RegExp} The new group segment.
 */
export const zeroOrOneLazy = toQuantifier('??');

/**
 * Creates a new non-capturing group segment that greedily matches the expressions one or more times.
 *
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @returns {RegExp} The new group segment.
 */
export const oneOrMore = toQuantifier('+');

/**
 * Creates a new non-capturing group segment that lazily matches the expressions one or more times.
 *
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @returns {RegExp} The new group segment.
 */
export const oneOrMoreLazy = toQuantifier('+?');

/**
 * Creates a new non-capturing group segment that greedily matches the expressions zero or more times.
 *
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @returns {RegExp} The new group segment.
 */
export const zeroOrMore = toQuantifier('*');

/**
 * Creates a new non-capturing group segment that lazily matches the expressions zero or more times.
 *
 * @param {...(RegExp|string)} expressions - The expressions to group.
 * @returns {RegExp} The new group segment.
 */
export const zeroOrMoreLazy = toQuantifier('*?');

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
export const repeat = (options, ...expressions) =>
  toRepeat(expressions, options);

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
export const repeatLazy = (options, ...expressions) =>
  toRepeat(expressions, { ...options, lazy: true });
