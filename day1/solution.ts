import fs from 'fs';

const input = fs.readFileSync('./input.txt').toString().split('\n');

const numberMap = new Map([
  ['one', '1'],
  ['two', '2'],
  ['three', '3'],
  ['four', '4'],
  ['five', '5'],
  ['six', '6'],
  ['seven', '7'],
  ['eight', '8'],
  ['nine', '9'],
]);

const getNumber = (numStr: string) => numberMap.get(numStr) || numStr;

const getNumbersFromStrings = (
  numStrings: string[],
  doubleDigitRegex: RegExp,
  singleDigitRegex: RegExp
) =>
  numStrings.map((val) => {
    const ddR = val.match(doubleDigitRegex);
    if (ddR) return Number(''.concat(...[1, 2].map((i) => getNumber(ddR[i]))));
    const single = getNumber(val.match(singleDigitRegex)?.[0]!);
    return Number(`${single.repeat(2)}`);
  });

const solution1 = () => {
  const doubleDigitRegex = /(\d).*(\d).*/;
  const singleDigitRegex = /\d/;
  const numbers = getNumbersFromStrings(
    input,
    doubleDigitRegex,
    singleDigitRegex
  );
  return numbers.reduce((prev, curr) => prev + curr);
};

const solution2 = () => {
  const numRegex = '(\\d|one|two|three|four|five|six|seven|eight|nine)';
  const doubleDigitRegex = new RegExp(`${numRegex}.*`.repeat(2));
  const singleDigitRegex = new RegExp(numRegex);

  const numbers = getNumbersFromStrings(
    input,
    doubleDigitRegex,
    singleDigitRegex
  );
  return numbers.reduce((prev, curr) => prev + curr);
};

console.log(solution1());

console.log(solution2());
