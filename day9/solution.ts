import fs from 'fs';
import chalk from 'chalk';

const input = fs.readFileSync('./input.txt').toString().split('\n');

const seqs = input.map((line) => line.split(' ').map(Number).reverse());

const findNext = (seq: number[]): number => {
  if (!seq.find((num) => num)) return 0;
  const diffs = seq
    .map((num, i) => {
      if (i + 1 === seq.length) return NaN;
      return num - seq[i + 1];
    })
    .filter((n) => !isNaN(n));
  return seq[0] + findNext(diffs);
};

const getExtSum = (seqs: number[][]) =>
  seqs.map(findNext).reduce((prev, curr) => prev + curr);

const solution1 = () => getExtSum(seqs);

const solution2 = () => getExtSum(seqs.map((seq) => seq.reverse()));

console.log(`Solution to problem 1 is ${chalk.bold.red(solution1())}`);

console.log(`Solution to problem 2 is ${chalk.bold.red(solution2())}`);
