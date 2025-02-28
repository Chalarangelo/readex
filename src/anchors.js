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
