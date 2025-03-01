import { Segment, toSegments, joinSegments } from './segment.js';

const DEFAULT_OPTIONS = {
  capture: true,
  name: null,
};

const OPTIONS_KEYS = Object.keys(DEFAULT_OPTIONS);

const isValidOptions = val =>
  typeof val === 'object' &&
  val !== null &&
  Object.keys(val).every(key => OPTIONS_KEYS.includes(key));

class Group {
  constructor(expressions, options = {}) {
    this.expression = joinSegments(toSegments(...expressions));
    this.options = { ...DEFAULT_OPTIONS, ...options };

    if (this.options.name && typeof this.options.name !== 'string')
      throw new TypeError('Invalid group name. Must be a string.');

    if (!this.options.capture && this.options.name)
      throw new Error('Named groups must be captured.');
  }

  toSegment() {
    const { capture, name } = this.options;

    if (name) return new Segment(`(?<${name}>${this.expression})`);
    if (capture) return new Segment(`(${this.expression})`);
    return new Segment(`(?:${this.expression})`);
  }
}

export const group = (...expressionsAndOptions) => {
  if (expressionsAndOptions.length === 0)
    throw new Error('No expressions provided.');

  const last = expressionsAndOptions[expressionsAndOptions.length - 1];

  if (expressionsAndOptions.length !== 1 && isValidOptions(last))
    return new Group(expressionsAndOptions.slice(0, -1), last).toSegment();

  return new Group(expressionsAndOptions).toSegment();
};
