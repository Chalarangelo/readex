import { Segment, toSegments, joinSegments } from './segment.js';
import { createOptionsValidator, createOptionsExtractor } from './utils.js';

const DEFAULT_OPTIONS = {
  capture: true,
  name: null,
};

const isValidOptions = createOptionsValidator(Object.keys(DEFAULT_OPTIONS));
const isValidOptionsWithNameCheck = val => {
  if (!isValidOptions(val)) return false;

  const { name = null, capture = true } = val;

  if (name && typeof name !== 'string')
    throw new TypeError('Invalid group name. Must be a string.');
  if (name && !capture) throw new Error('Named groups must be captured.');

  return true;
};

const extractOptionsAndExpressions = createOptionsExtractor(
  isValidOptionsWithNameCheck
);

const createGroup = (expressions, options = {}) => {
  const expression = joinSegments(toSegments(...expressions));
  const { capture, name } = { ...DEFAULT_OPTIONS, ...options };

  if (name) return new Segment(`(?<${name}>${expression})`);
  if (capture) return new Segment(`(${expression})`);
  return new Segment(`(?:${expression})`);
};

/**
 * Creates a new capturing/non-capturing/named group segment with the provided expressions.
 *
 * @param {...any} expressionsAndOptions - The expressions and options to group.
 *    The last argument can be an options object with the following properties:
 *      - capture: boolean - Whether the group should be captured.
 *      - name: string - The name of the group.
 * @throws {Error} If no expressions are provided.
 * @returns {Segment} The new group segment.
 */
export const group = (...expressionsAndOptions) =>
  createGroup(...extractOptionsAndExpressions(expressionsAndOptions));

/**
 * Combines multiple expressions into a single non-capturing group segment.
 *
 * @param {...(Segment|RegExp|string)} expressions - The expressions to be combined.
 * @returns {Segment} The combined expression as a non-capturing group segment.
 */
export const concat = (...expressions) =>
  group(...expressions, { capture: false });
