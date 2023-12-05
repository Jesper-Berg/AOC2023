import fs from 'fs';
import chalk from 'chalk';

type ConvMap = {
  destinationStart: number;
  sourceStart: number;
  length: number;
};

type Part2Seed = {
  start: number;
  rangeLength: number;
  n: number;
};

const input = fs.readFileSync('./input.txt').toString().split('\n\n');
const numberStringToNumberArray = (str: string) =>
  str.trim().split(' ').map(Number);

const seeds = numberStringToNumberArray(input[0].split(':')[1]);
const conversionMaps = input.slice(1).map((mapStr) =>
  mapStr
    .split('\n')
    .slice(1)
    .map(numberStringToNumberArray)
    .map(
      (mapArr): ConvMap => ({
        destinationStart: mapArr[0],
        sourceStart: mapArr[1],
        length: mapArr[2],
      })
    )
);

const findCorrespondent = (source: number, destinations: ConvMap[]): number => {
  const overlap = destinations.find((destination) => {
    const { sourceStart: destinationStart, length } = destination;
    return source <= destinationStart + length && destinationStart <= source;
  });
  const output =
    source + (overlap ? overlap.destinationStart - overlap.sourceStart : 0);
  return output;
};

const findLowestLocation = (seeds: number[]) =>
  Math.min(
    ...seeds.map((seed) => {
      for (const map of conversionMaps) seed = findCorrespondent(seed, map);
      return seed;
    })
  );

const solution1 = () => findLowestLocation(seeds);

const solution2 = () => {
  const makeSeeds = (seed: number[]): Part2Seed => ({
    start: seed[0],
    rangeLength: seed[1],
    n: Math.floor(Math.sqrt(seed[1])),
  });

  const part2Seeds = Array.from(
    { length: Math.ceil(seeds.length / 2) },
    (_, i) => seeds.slice(i * 2, i * 2 + 2)
  ).map(makeSeeds);

  const rangeToSeed = (range: number[], sq: number): Part2Seed => ({
    start: range[0],
    rangeLength: range.length * sq,
    n: Math.floor(Math.sqrt(range.length * sq)),
  });

  let activeSeeds: Part2Seed[] = [...part2Seeds];
  for (let j = 0; j < 12; j++) {
    const sqrtSeeds = activeSeeds.map((seed) => {
      const newSeed: number[] = [];
      for (let i = 0; i * seed.n < seed.rangeLength; i++) {
        newSeed.push(seed.start + i * seed.n);
      }
      return newSeed;
    });

    const lowestLocation = sqrtSeeds
      .map((seed, i) => ({
        range: seed,
        lowest: findLowestLocation(seed),
        index: i,
      }))
      .sort((a, b) => a.lowest - b.lowest)[0];

    const { range } = lowestLocation;
    activeSeeds = [
      rangeToSeed(range.slice(0, range.length / 2), activeSeeds[0].n),
      rangeToSeed(range.slice(range.length / 2), activeSeeds[0].n),
    ];
  }

  return (
    findLowestLocation(
      Array(50000)
        .fill(activeSeeds[0].start - 20000)
        .map((x, y) => x + y)
    ) - 1
  );
};

console.log(`Solution to problem 1 is ${chalk.bold.red(solution1())}`);

console.log(`Solution to problem 2 is ${chalk.bold.red(solution2())}`);
