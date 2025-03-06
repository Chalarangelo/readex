const DEFAULT_FLAGS = {
  dotAll: false,
  global: true,
  ignoreCase: false,
  multiline: true,
  sticky: false,
  unicode: false
};
const FLAG_MAP = {
  dotAll: "s",
  global: "g",
  ignoreCase: "i",
  multiline: "m",
  sticky: "y",
  unicode: "u"
};
const validateFlag = (flag) => {
  if (!Object.keys(DEFAULT_FLAGS).includes(flag))
    throw new TypeError(`Invalid flag: ${flag}`);
  return flag;
};
const asFlags = (flags) => {
  if (!(flags instanceof Object))
    throw new TypeError("flags must be an object");
  return Object.entries(
    Object.entries(flags).reduce(
      (acc, [flag, value]) => {
        if (value !== void 0) acc[validateFlag(flag)] = value;
        return acc;
      },
      { ...DEFAULT_FLAGS }
    )
  ).reduce((acc, [flag, value]) => value ? acc + FLAG_MAP[flag] : acc, "");
};
const toSegmentSource = (expression) => {
  if (expression instanceof RegExp) return expression.source;
  if (typeof expression === "string" || typeof expression === "number")
    return new RegExp(`${expression}`.replace(/[|\\{}()[\]^$+*?.-]/g, "\\$&")).source;
  throw new TypeError("Value must be a string or a number");
};
const toSegments = (prefix = "", suffix = "", separator = "", mapFn = (x) => x, flags = {}) => (...expressions) => new RegExp(
  `${prefix}${expressions.map((e) => toSegmentSource(mapFn(e))).join(separator)}${suffix}`,
  asFlags(flags)
);
const readEx = (expressions, flags) => toSegments("", "", "", (x) => x, flags)(...expressions);
const backReference = (reference) => {
  if (typeof reference === "number") return new RegExp(`\\${reference}`);
  if (typeof reference === "string") return new RegExp(`\\k<${reference}>`);
  throw new TypeError("Invalid back reference. Must be a number or a string.");
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
    throw new TypeError(
      "Invalid times option: times must be either a number or an array of two numbers."
    );
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
const toCharacterSet = (expression) => {
  if (Array.isArray(expression) && expression.length === 2)
    return toSegments("", "", "-")(...expression);
  return toSegments()(expression);
};
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
