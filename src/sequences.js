import { Segment } from './segment.js';

/**
 * An anchor segment that matches the start of a line.
 * In non-multi-line mode, it matches the start of the string.
 */
export const startOfLine = new Segment('^');

/**
 * An anchor segment that matches the end of a line.
 * In non-multi-line mode, it matches the end of the string.
 */
export const endOfLine = new Segment('$');

/**
 * An anchor segment that matches the start of a word boundary.
 */
export const wordBoundary = new Segment(String.raw`\b`);

/**
 * An anchor segment that matches the end of a word boundary.
 */
export const nonWordBoundary = new Segment(String.raw`\B`);

/**
 * A character class segment that matches any digit.
 */
export const digit = new Segment(String.raw`\d`);

/**
 * A character class segment that matches any non-digit.
 */
export const nonDigit = new Segment(String.raw`\D`);

/**
 * A character class segment that matches any word character.
 */
export const wordCharacter = new Segment(String.raw`\w`);

/**
 * A character class segment that matches any non-word character.
 */
export const nonWordCharacter = new Segment(String.raw`\W`);

/**
 * A character class segment that matches any whitespace character.
 */
export const whitespaceCharacter = new Segment(String.raw`\s`);

/**
 * A character class segment that matches any non-whitespace character.
 */
export const nonWhitespaceCharacter = new Segment(String.raw`\S`);

/**
 * A wildcard segment that matches any single character (/.).
 */
export const anyCharacter = new Segment('.');

/**
 * A wildcard segment that matches any sequence of characters (/.*).
 */
export const anything = new Segment('.*');

/**
 * A wildcard segment that matches any single character except line terminators (/./).
 */
export const something = new Segment('.+');
