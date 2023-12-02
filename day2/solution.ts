import fs from 'fs';
import chalk from 'chalk';

type Round = {
  blueAmount: number;
  greenAmount: number;
  redAmount: number;
};

type Game = {
  index: number;
  rounds: Round[];
};

type Color = 'blue' | 'green' | 'red';

const parseGame = (gameString: string, index: number): Game => {
  const roundsStrings = gameString.split(':')[1].split(';');

  const getColorAmount = (roundStr: string, color: Color) =>
    Number(roundStr.match(`(\\d+) ${color}`)?.[1]) || 0;
  const parseRound = (roundStr: string): Round => ({
    blueAmount: getColorAmount(roundStr, 'blue'),
    redAmount: getColorAmount(roundStr, 'red'),
    greenAmount: getColorAmount(roundStr, 'green'),
  });

  return {
    index,
    rounds: roundsStrings.map((roundStr) => parseRound(roundStr)),
  };
};

const input = fs
  .readFileSync('./input.txt')
  .toString()
  .split('\n')
  .map((gameStr, i) => parseGame(gameStr, i + 1));

const solution1 = () => {
  const maxAmounts = {
    red: 12,
    green: 13,
    blue: 14,
  };

  const isGameValid = (rounds: Round[]) => {
    for (const round of rounds) {
      if (
        round.blueAmount > maxAmounts.blue ||
        round.greenAmount > maxAmounts.green ||
        round.redAmount > maxAmounts.red
      )
        return false;
    }
    return true;
  };

  return input.reduce(
    (prev, currGame) =>
      prev + (isGameValid(currGame.rounds) ? currGame.index : 0),
    0
  );
};

const solution2 = () => {
  const getMaxAmounts = (rounds: Round[]): Round => {
    const getMax = (color: Color) =>
      Math.max(...rounds.map((round) => round[`${color}Amount`]));
    return {
      blueAmount: getMax('blue'),
      redAmount: getMax('red'),
      greenAmount: getMax('green'),
    };
  };

  const maxAmounts = input.map((game) => getMaxAmounts(game.rounds));
  return maxAmounts.reduce(
    (prev, currGame) =>
      prev + currGame.blueAmount * currGame.redAmount * currGame.greenAmount,
    0
  );
};

console.log(`Solution to problem 1 is ${chalk.bold.red(solution1())}`);

console.log(`Solution to problem 2 is ${chalk.bold.red(solution2())}`);
