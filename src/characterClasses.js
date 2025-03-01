import { Segment } from './segment.js';

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
