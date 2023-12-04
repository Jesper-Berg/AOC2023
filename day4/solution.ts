import fs from 'fs';
import chalk from 'chalk';

const input = fs
  .readFileSync('./input.txt')
  .toString()
  .split('\n')
  .map((line) => {
    const [winningNumbers, selectedNumbers] = line
      .split(':')[1]
      .split('|')
      .map((nums) => nums.split(' ').filter(Boolean).map(Number));
    return selectedNumbers.filter((num) => winningNumbers.includes(num)).length;
  });

const solution1 = () => {
  const getCardWorth = (winningAmount: number) =>
    Math.floor(2 ** (winningAmount - 1));
  return input.reduce((prev, curr) => prev + getCardWorth(curr));
};

const solution2 = () => {
  const totals = new Array(input.length).fill(1);
  input.forEach((card, cardIndex) => {
    for (let i = 1; i <= card; i++) {
      totals[cardIndex + i] += totals[cardIndex];
    }
  });
  return totals.reduce((prev, curr) => prev + curr);
};

console.log(`Solution to problem 1 is ${chalk.bold.red(solution1())}`);

console.log(`Solution to problem 2 is ${chalk.bold.red(solution2())}`);
