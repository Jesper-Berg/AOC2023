import fs from 'fs';
import chalk from 'chalk';

const directions = ['north', 'south', 'east', 'west'] as const;
type Direction = (typeof directions)[number];

const input = fs.readFileSync('./input.txt').toString().split('\n');

const prettyPrint = (matrix: any[][] = loopMatrix) => {
  matrix.forEach((row) =>
    console.log(row.map((col) => (col ? 'T' : '.')).join(''))
  );
};

const getTile = ([row, col]: number[]) => input[col]?.charAt(row) ?? '.';
const getIndexOfNextDirection = (
  [row, col]: number[],
  direction: Direction
) => {
  switch (direction) {
    case 'north':
      return [row, col - 1];
    case 'south':
      return [row, col + 1];
    case 'east':
      return [row + 1, col];
    case 'west':
      return [row - 1, col];
  }
};
const getTileDirectionFrom = (index: number[], direction: Direction) =>
  getTile(getIndexOfNextDirection(index, direction));

const findStart = () => {
  for (const [colI, col] of input.entries()) {
    const rowI = col.indexOf('S');
    if (rowI !== -1) return [rowI, colI];
  }
  return [-1, -1]; // Should never happen
};
const startIndex = findStart();

const findStartDirection = (): Direction => {
  for (const direction of directions) {
    const nextTile = getTileDirectionFrom(startIndex, direction);
    switch (direction) {
      case 'north':
        if (nextTile === '|' || nextTile === 'F' || nextTile === '7')
          return direction;
        break;
      case 'south':
        if (nextTile === '|' || nextTile === 'L' || nextTile === 'J')
          return direction;
        break;
      case 'east':
        if (nextTile === '-' || nextTile === 'J' || nextTile === '7')
          return direction;
        break;
      case 'west':
        if (nextTile === '-' || nextTile === 'F' || nextTile === 'L')
          return direction;
        break;
    }
  }
  return 'north'; // should never happen
};

const startDirection = findStartDirection();

const getFromDirection = (nextDirection: Direction): Direction => {
  switch (nextDirection) {
    case 'north':
      return 'south';
    case 'south':
      return 'north';
    case 'east':
      return 'west';
    case 'west':
      return 'east';
  }
};

const loopMatrix: boolean[][] = Array.from(new Array(input.length * 2), () =>
  new Array(input[0].length * 2).fill(false)
);

const addToLoopMatrix = ([row, col]: number[], direction: Direction) => {
  loopMatrix[col * 2][row * 2] = true;
  switch (direction) {
    case 'north':
      loopMatrix[col * 2 - 1][row * 2] = true;
      break;
    case 'south':
      loopMatrix[col * 2 + 1][row * 2] = true;
      break;
    case 'east':
      loopMatrix[col * 2][row * 2 + 1] = true;
      break;
    case 'west':
      loopMatrix[col * 2][row * 2 - 1] = true;
      break;
  }
};

addToLoopMatrix(startIndex, startDirection);

const getLoopLength = (curr: number[], next: Direction) => {
  const nextIndex = getIndexOfNextDirection(curr, next);
  const currentTile = getTile(nextIndex);
  const from = getFromDirection(next);
  if (currentTile === 'S') return 1;
  let nextNextDirection: Direction = 'north';
  switch (currentTile) {
    case '|':
      nextNextDirection = getFromDirection(from);
      break;
    case '-':
      nextNextDirection = getFromDirection(from);
      break;
    case 'L':
      nextNextDirection = from === 'north' ? 'east' : 'north';
      break;
    case 'J':
      nextNextDirection = from === 'north' ? 'west' : 'north';
      break;
    case '7':
      nextNextDirection = from === 'south' ? 'west' : 'south';
      break;
    case 'F':
      nextNextDirection = from === 'south' ? 'east' : 'south';
      break;
    default:
      throw new Error("Tried to move where it's not allowed");
  }
  addToLoopMatrix(nextIndex, nextNextDirection);
  return 1 + getLoopLength(nextIndex, nextNextDirection);
};

const loopLength = getLoopLength(startIndex, startDirection);
const solution1 = () => loopLength / 2;

const findNeighbors = ([row, col]: number[]) => [
  [row + 1, col],
  [row - 1, col],
  [row, col + 1],
  [row, col - 1],
];

// Add border to the matrix
const filledMatrix: boolean[][] = [];
const firstAndLastRow = new Array(loopMatrix[0].length + 2).fill(false);
filledMatrix.push(firstAndLastRow);
loopMatrix.forEach((row) => {
  const rowCopy = [...row];
  rowCopy.unshift(false);
  rowCopy.push(false);
  filledMatrix.push(rowCopy);
});
filledMatrix.push(firstAndLastRow);

// Flood fill outside loop
const queue = [[0, 0]];
while (queue.length > 0) {
  for (const neighbor of findNeighbors(queue.shift()!)) {
    const [col, row] = neighbor;
    if (
      col >= 0 &&
      row >= 0 &&
      col < filledMatrix.length &&
      row < filledMatrix[0].length &&
      !filledMatrix[col][row]
    ) {
      filledMatrix[col][row] = true;
      queue.push([col, row]);
    }
  }
}

// Remove border before getting solution
filledMatrix.shift();
filledMatrix.pop();
filledMatrix.forEach((row) => {
  row.shift();
  row.pop();
});

const solution2 = () =>
  filledMatrix.reduce(
    (sum, row, i) =>
      sum + row.filter((tile, j) => !(tile || i % 2 || j % 2)).length, // I used De morgan here #iHaveAMsc
    0
  );

console.log(`Solution to problem 1 is ${chalk.bold.red(solution1())}`);

console.log(`Solution to problem 2 is ${chalk.bold.red(solution2())}`);
