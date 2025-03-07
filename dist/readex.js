const FLAGS = {
  dotAll: [false, "s"],
  global: [true, "g"],
  ignoreCase: [false, "i"],
  multiline: [true, "m"],
  sticky: [false, "y"],
  unicode: [false, "u"]
};
const asFlags = (flags) => {
  if (!(flags instanceof Object))
    throw new TypeError("Flags must be an object.");
  return Object.keys({ ...FLAGS, ...flags }).reduce((acc, flag) => {
    if (!(flag in FLAGS)) throw new TypeError("Invalid flag key.");
    return flags[flag] ?? FLAGS[flag][0] ? acc + FLAGS[flag][1] : acc;
  }, "");
};
const toSegmentSource = (expression) => {
  if (expression instanceof RegExp) return expression.source;
  if (["string", "number"].includes(typeof expression))
    return new RegExp(`${expression}`.replace(/[|\\{}()[\]^$+*?.-]/g, "\\$&")).source;
  throw new TypeError("Expression must be a string or number");
};
const toSegments = (prefix = "", suffix = "", separator = "", mapFn = (x) => x, flags = {}) => (...expressions) => new RegExp(
  `${prefix}${expressions.map((e) => toSegmentSource(mapFn(e))).join(separator)}${suffix}`,
  asFlags(flags)
);
const toCharacterSet = (expression) => Array.isArray(expression) && expression.length === 2 ? toSegments("", "", "-")(...expression) : toSegments()(expression);
const readEx = (expressions, flags) => toSegments("", "", "", (x) => x, flags)(...expressions);
const backReference = (reference) => {
  if (typeof reference === "string")
    return toSegments(`\\k<${reference}`, ">")();
  if (typeof reference === "number") return toSegments(`\\${reference}`)();
  throw new TypeError("Reference must be a number or a string.");
};
const captureGroup = toSegments("(", ")");
const nonCaptureGroup = toSegments("(?:", ")");
const namedGroup = ({ name }, ...expressions) => {
  if (!name || typeof name !== "string")
    throw new TypeError("Named groups must have a name.");
  return toSegments(`(?<${name}>`, ")")(...expressions);
};
const concat = nonCaptureGroup;
const or = toSegments(`(?:`, ")", "|");
const lookahead = toSegments(`(?=(?:`, `))`);
const negativeLookahead = toSegments(`(?!(?:`, `))`);
const lookbehind = toSegments(`(?<=(?:`, `))`);
const negativeLookbehind = toSegments(`(?<!(?:`, `))`);
const isValidTimes = (val) => val === null || Number.isInteger(val) && val >= 0;
const toRepeatSuffix = (times) => {
  const [min = 0, max = null] = Array.isArray(times) ? times : [times, times];
  if (max !== null && min > max || !isValidTimes(min) || !isValidTimes(max))
    throw new TypeError("Times must be a number or 2-number array.");
  return min === max ? `{${min}}` : `{${min},${max ?? ""}}`;
};
const zeroOrOne = toSegments(`(?:`, `)?`);
const zeroOrOneLazy = toSegments(`(?:`, `)??`);
const oneOrMore = toSegments(`(?:`, `)+`);
const oneOrMoreLazy = toSegments(`(?:`, `)+?`);
const zeroOrMore = toSegments(`(?:`, `)*`);
const zeroOrMoreLazy = toSegments(`(?:`, `)*?`);
const repeat = ({ times }, ...expressions) => toSegments("(?:", `)${toRepeatSuffix(times)}`)(...expressions);
const repeatLazy = ({ times }, ...expressions) => toSegments("(?:", `)${toRepeatSuffix(times)}?`)(...expressions);
const startOfLine = /^/;
const endOfLine = /$/;
const wordBoundary = /\b/;
const nonWordBoundary = /\B/;
const digit = /\d/;
const nonDigit = /\D/;
const wordCharacter = /\w/;
const nonWordCharacter = /\W/;
const whitespaceCharacter = /\s/;
const nonWhitespaceCharacter = /\S/;
const anyCharacter = /./;
const anything = /.*/;
const something = /.+/;
const anythingFrom = toSegments(`[`, "]", "|", toCharacterSet);
const anythingBut = toSegments(`[^`, "]", "|", toCharacterSet);
export {
  anyCharacter,
  anything,
  anythingBut,
  anythingFrom,
  backReference,
  captureGroup,
  concat,
  digit,
  endOfLine,
  lookahead,
  lookbehind,
  namedGroup,
  negativeLookahead,
  negativeLookbehind,
  nonCaptureGroup,
  nonDigit,
  nonWhitespaceCharacter,
  nonWordBoundary,
  nonWordCharacter,
  oneOrMore,
  oneOrMoreLazy,
  or,
  readEx,
  repeat,
  repeatLazy,
  something,
  startOfLine,
  whitespaceCharacter,
  wordBoundary,
  wordCharacter,
  zeroOrMore,
  zeroOrMoreLazy,
  zeroOrOne,
  zeroOrOneLazy
};
