import fs from 'fs';

const input = fs.readFileSync('./input.txt').toString().split('\n');

const getNumbersFromStrings = (
  numStrings: string[],
  doubleDigitRegex: RegExp,
  singleDigitRegex: RegExp,
  replaceFunc: (_: string) => string = (str) => str
) =>
  numStrings.map((val) => {
    const ddR = val.match(doubleDigitRegex);
    if (ddR) return Number(`${replaceFunc(ddR[1])}${replaceFunc(ddR[2])}`);
    const single = replaceFunc(val.match(singleDigitRegex)?.[0]!);
    return Number(`${single}${single}`);
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

console.log(solution1());

const solution2 = () => {
  const strNumbers = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
  };
  const doubleDigitRegex =
    /(\d|one|two|three|four|five|six|seven|eight|nine).*(\d|one|two|three|four|five|six|seven|eight|nine).*/;
  const singleDigitRegex = /\d|one|two|three|four|five|six|seven|eight|nine/;

  const repl = (str: string) =>
    Object.keys(strNumbers).includes(str) ? strNumbers[str] : str;

  const numbers = getNumbersFromStrings(
    input,
    doubleDigitRegex,
    singleDigitRegex,
    repl
  );
  return numbers.reduce((prev, curr) => prev + curr);
};

console.log(solution2());
