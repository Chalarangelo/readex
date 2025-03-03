export const createOptionsValidator =
  (optionsKeys, singleOption = false) =>
  val =>
    val !== null &&
    typeof val === 'object' &&
    !(val instanceof RegExp) &&
    // Note: This check returns true if the object is empty.
    Object.entries(val).every(
      ([key, value], i) =>
        (i === 0 || !singleOption) &&
        optionsKeys.includes(key) &&
        (typeof value === 'boolean' || !singleOption)
    );

export const createOptionsExtractor =
  isValidOptions => expressionsAndOptions => {
    if (expressionsAndOptions.length === 0)
      throw new Error('No expressions provided.');

    const last = expressionsAndOptions[expressionsAndOptions.length - 1];

    if (expressionsAndOptions.length !== 1 && isValidOptions(last))
      return [expressionsAndOptions.slice(0, -1), last];

    return [expressionsAndOptions];
  };

export const isNil = val => val === undefined || val === null;
export const isPositiveInteger = val => Number.isInteger(val) && val > 0;
export const isNonNegativeInteger = val => Number.isInteger(val) && val >= 0;
