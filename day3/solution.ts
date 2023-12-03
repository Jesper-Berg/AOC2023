import fs from 'fs';
import chalk from 'chalk';

type Match = {
  number: string;
  index: number;
};

type PartNumber = {
  number: number;
  row: number;
  col: {
    start: number;
    end: number;
  };
  gear?: string;
};

const input = fs.readFileSync('./input.txt').toString().split('\n');

const getMatches = (row: string) => {
  const re = /\d+/g;
  const m: Match[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(row)) !== null) {
    m.push({
      number: match[0],
      index: match.index,
    });
  }
  return m;
};

const partNumbers: PartNumber[] = input.flatMap((row, i) => {
  const matches = getMatches(row);
  if (!matches.length) return [];
  return matches.map((match) => ({
    number: Number(match.number),
    row: i,
    col: {
      start: match.index,
      end: match.index + match.number.length - 1,
    },
  }));
});

const gears = new Map<string, number>();
const gearRatios: number[] = [];

const matrix = input.map((row) => row.split(''));

const rowMax = matrix.length - 1;
const colMax = matrix[0].length - 1;

const prettyPrint = (matrix: string[][]) =>
  matrix.forEach((row) => {
    console.log(row);
  });

const appendGear = (val: number, row: number, col: number) => {
  const id = `r${row}c${col}`;
  const present = gears.get(id);
  if (!present) gears.set(id, val);
  else {
    gearRatios.push(val * present);
  }
};

const isSymbol = (row: number, col: number, val: number): boolean => {
  if (row < 0 || row > rowMax || col < 0 || col > colMax) return false;
  if (matrix[row][col] === '*') appendGear(val, row, col);
  return !matrix[row][col].match(/\d|\./);
};

const isSymbolAdjecent = ({ number: val, row, col }: PartNumber): boolean => {
  const checkAbove = (): boolean => {
    for (let i = col.start; i <= col.end; i++) {
      if (isSymbol(row - 1, i, val)) return true;
    }
    return false;
  };

  const checkBelow = (): boolean => {
    for (let i = col.start; i <= col.end; i++) {
      if (isSymbol(row + 1, i, val)) return true;
    }
    return false;
  };

  const checkLeft = (): boolean => {
    return isSymbol(row, col.start - 1, val);
  };

  const checkRight = (): boolean => {
    return isSymbol(row, col.end + 1, val);
  };

  const checkTopLeft = isSymbol(row - 1, col.start - 1, val);
  const checkTopRight = isSymbol(row - 1, col.end + 1, val);
  const checkBottomLeft = isSymbol(row + 1, col.start - 1, val);
  const checkBottomRight = isSymbol(row + 1, col.end + 1, val);

  return (
    checkAbove() ||
    checkBelow() ||
    checkLeft() ||
    checkRight() ||
    checkTopLeft ||
    checkTopRight ||
    checkBottomLeft ||
    checkBottomRight
  );
};

const solution1 = () =>
  partNumbers
    .filter(isSymbolAdjecent)
    .map((pn) => pn.number)
    .reduce((prev, curr) => prev + curr);

const solution2 = () => {
  return gearRatios.reduce((prev, curr) => prev + curr);
};

console.log(`Solution to problem 1 is ${chalk.bold.red(solution1())}`);

console.log(`Solution to problem 2 is ${chalk.bold.red(solution2())}`);
