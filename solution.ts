import fs from 'fs';
import chalk from 'chalk';

const input = fs.readFileSync('./input.txt').toString().split('\n');

const solution1 = () => {};

const solution2 = () => {};

console.log(`Solution to problem 1 is ${chalk.bold.red(solution1())}`);

console.log(`Solution to problem 2 is ${chalk.bold.red(solution2())}`);
