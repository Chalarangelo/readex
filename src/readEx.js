import { joinSegments, toSegments } from './segment.js';

const DEFAULT_FLAGS = {
  dotAll: false,
  global: true,
  ignoreCase: false,
  multiline: true,
  sticky: false,
  unicode: false,
};

const FLAG_MAP = {
  dotAll: 's',
  global: 'g',
  ignoreCase: 'i',
  multiline: 'm',
  sticky: 'y',
  unicode: 'u',
};

class ReadEx {
  constructor(expressions, flags = {}) {
    this.flags = {
      ...DEFAULT_FLAGS,
      ...flags,
    };

    this.source = joinSegments(toSegments(...expressions));
  }

  getFlags() {
    return Object.entries(this.flags).reduce(
      (acc, [flag, value]) => (value ? acc + FLAG_MAP[flag] : acc),
      ''
    );
  }

  toRegExp() {
    return new RegExp(this.source.value, this.getFlags());
  }
}

const readEx = (...args) => new ReadEx(...args).toRegExp();

export default readEx;
