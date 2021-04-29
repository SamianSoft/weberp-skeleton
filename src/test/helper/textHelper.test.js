import {
  isCleanStringMatch,
  isStringWthStarsMatch,
  getOperatorByValueForFilter,
  replaceArabicCharacters,
} from '../../helper/TextHelper';

describe('Replace good letters with bad letters', () => {
  test('Takes a string with incorrect letters and returns its correct shape', () => {
    const returnString = isCleanStringMatch('ائمان', 'ی', true);
    expect(returnString).toBe('ایمان');
  });

  test('Clear the word and expect `true` --- `ي`, `ی`', () => {
    const findLetter = isCleanStringMatch('كليه', 'ی');
    expect(findLetter).toBe(true);
  });

  test('Clear the word and expect `true` --- `ئ`, `ی`', () => {
    const findLetter = isCleanStringMatch('كلئه', 'ی');
    expect(findLetter).toBe(true);
  });

  test('Clear the word and expect `true` --- `ى`, `ی`', () => {
    const findLetter = isCleanStringMatch('بامیه', 'ی');
    expect(findLetter).toBe(true);
  });

  test('Clear the word and expect `true` --- `ۍ`, `ی`', () => {
    const findLetter = isCleanStringMatch('بامۍه', 'ی');
    expect(findLetter).toBe(true);
  });

  test('Clear the word and expect `true` --- `ێ`, `ی`', () => {
    const findLetter = isCleanStringMatch('بامێه', 'ی');
    expect(findLetter).toBe(true);
  });

  test('Clear the word and expect `true` --- `ې`, `ی`', () => {
    const findLetter = isCleanStringMatch('گونې', 'ی');
    expect(findLetter).toBe(true);
  });

  test('Clear the word and expect `true` --- `ۑ`, `ی`', () => {
    const findLetter = isCleanStringMatch('گونۑ', 'ی');
    expect(findLetter).toBe(true);
  });

  test('Clear the word and expect `true` --- `ے`, `ی`', () => {
    const findLetter = isCleanStringMatch('گونے', 'ی');
    expect(findLetter).toBe(true);
  });

  test('Clear the word and expect `true` --- `ۓ`, `ی`', () => {
    const findLetter = isCleanStringMatch('گونۓ', 'ی');
    expect(findLetter).toBe(true);
  });

  test('Clear the word and expect `true` --- `ک`, `ک`', () => {
    const findLetter = isCleanStringMatch('کامئاب', 'ک');
    expect(findLetter).toBe(true);
  });

  test('Clear the word and expect `true` --- `ڪ`, `ک`', () => {
    const findLetter = isCleanStringMatch('ڪامئاب', 'ک');
    expect(findLetter).toBe(true);
  });

  test('Clear the word and expect `true` --- `ڪ`, `ک`', () => {
    const findLetter = isCleanStringMatch('ګیف', 'ک');
    expect(findLetter).toBe(true);
  });

  test('Clear the word and expect `true` --- `ڬ`, `ک`', () => {
    const findLetter = isCleanStringMatch('ڬیف', 'ک');
    expect(findLetter).toBe(true);
  });

  test('Clear the word and expect `true` --- `ڭ`, `ک`', () => {
    const findLetter = isCleanStringMatch('ڭیف', 'ک');
    expect(findLetter).toBe(true);
  });

  test('Clear the word and expect `true` --- `ڮ`, `ک`', () => {
    const findLetter = isCleanStringMatch('ڮیف', 'ک');
    expect(findLetter).toBe(true);
  });

  test('Clear the word and expect `true` --- `ي`, `ی`', () => {
    const findLetter = isCleanStringMatch('ياغي', 'ی');
    expect(findLetter).toBe(true);
  });

  test('Clear the word and expect `true` --- `ك`, `ک`', () => {
    const findLetter = isCleanStringMatch('كاملئا', 'ک');
    expect(findLetter).toBe(true);
  });
});

describe('Is string with stars match', () => {
  test('There is no star in the input string and it is replaced in the output of the correct letters', () => {
    const tempString = isStringWthStarsMatch('ائمان', 'ی');
    const cleanWord = isCleanStringMatch('ائمان', 'ی');
    expect(tempString).toBe(cleanWord);
  });

  test('There is a star in the input string and it returns in True', () => {
    const stringWithStar = isStringWthStarsMatch('ائ*مان', 'ی');
    expect(stringWithStar).toBe(true);
  });

  test('In the input letter does not match with string and returns `false`', () => {
    const noHaystack = isStringWthStarsMatch('ظالم', 'ی');
    expect(noHaystack).toBe(false);
  });

  test('Should be abel to detect words that are not a match', () => {
    const haystack = 'abcd';
    const needle = 'z';

    expect(isStringWthStarsMatch(haystack, needle)).toBe(false);
  });

  test('Should be abel to match Regular english words no matter the case', () => {
    const haystack = 'ABCD';
    const needle = 'a';

    expect(isStringWthStarsMatch(haystack, needle)).toBe(true);
  });

  test('Should be abel to match Regular english words', () => {
    const haystack = 'abcd';
    const needle = 'a';

    expect(isStringWthStarsMatch(haystack, needle)).toBe(true);
  });
});

describe('Get operator by value for filter', () => {
  test('If value was Boolean returns `equal`', () => {
    const value = getOperatorByValueForFilter(true);
    expect(value).toBe('equal');
  });

  test('If value was false returns `equal`', () => {
    const value = getOperatorByValueForFilter(false);
    expect(value).toBe('equal');
  });

  test('If value was `true` returns `equal`', () => {
    const value = getOperatorByValueForFilter('true');
    expect(value).toBe('equal');
  });

  test('If value was `false` returns `equal`', () => {
    const value = getOperatorByValueForFilter('false');
    expect(value).toBe('equal');
  });

  test('If value was null returns `equal`', () => {
    const value = getOperatorByValueForFilter(null);
    expect(value).toBe('equal');
  });

  test('The input is `string` and returns `contains`', () => {
    const value = getOperatorByValueForFilter('24nps');
    expect(value).toBe('contains');
  });

  test('Non-Boolean and Non-numeric string at the input, returns `equal`', () => {
    const value = getOperatorByValueForFilter(4654);
    expect(value).toBe('contains');
  });
});

describe('Replace special Arabic characters with persian one', () => {
  it('should replace nothing and return empty object', () => {
    expect(replaceArabicCharacters({})).toStrictEqual({});
  });

  it('should return empty string', () => {
    expect(replaceArabicCharacters('')).toStrictEqual('');
  });

  it('should touch nothing', () => {
    expect(replaceArabicCharacters({ test: '' })).toStrictEqual({ test: '' });
  });

  it('should return non-string parameters, itself.', () => {
    expect(replaceArabicCharacters(['test'])).toStrictEqual(['test']);
  });

  it('should handle non-string', () => {
    expect(replaceArabicCharacters(123)).toStrictEqual(123);
  });

  it('should replace Arabic `Y` & `K` with persian ones', () => {
    const input = 'كرئم باقري';
    const output = 'کریم باقری';
    const value = replaceArabicCharacters(input);

    expect(value).toStrictEqual(output);
  });
});
