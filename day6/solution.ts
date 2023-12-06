import fs from 'fs';
import chalk from 'chalk';

type Race = {
  time: number;
  distance: number;
};

const input = fs
  .readFileSync('./input.txt')
  .toString()
  .split('\n')
  .map((row) => row.trim().split(' ').slice(1).filter(Boolean).map(Number));

const calcWins = (race: Race) => {
  let wins = 0;
  for (let holdTime = 0; holdTime <= race.time; holdTime++) {
    wins += holdTime * (race.time - holdTime) > race.distance ? 1 : 0;
  }
  return wins;
};

const solution1 = () => {
  const races = input[0].map(
    (time, i): Race => ({
      time,
      distance: input[1][i],
    })
  );

  const winsPerRace = races.map(calcWins);
  return winsPerRace.reduce((prev, curr) => prev * curr);
};

const solution2 = () => {
  const combineToString = (ns: number[]) =>
    Number(ns.map(String).reduce((prev, curr) => prev + curr));

  const part2Input = input.map(combineToString);
  const part2Race: Race = {
    time: part2Input[0],
    distance: part2Input[1],
  };
  return calcWins(part2Race);
};

console.log(`Solution to problem 1 is ${chalk.bold.red(solution1())}`);

console.log(`Solution to problem 2 is ${chalk.bold.red(solution2())}`);
