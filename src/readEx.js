import { joinSegments, toSegments } from './segment.js';
import { asFlags } from './flags.js';

class ReadEx {
  constructor(expressions, flags = {}) {
    this.flags = asFlags(flags);
    this.source = joinSegments(toSegments(...expressions)).source;
  }

  toRegExp() {
    return new RegExp(this.source, this.flags.toString());
  }
}

const readEx = (...args) => new ReadEx(...args).toRegExp();

export default readEx;
