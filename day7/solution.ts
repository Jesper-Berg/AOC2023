import fs from 'fs';
import chalk from 'chalk';

type Hand = {
  cards: string;
  bid: number;
  typeValue: number;
};

const excluding = (i: number) => (xs: string[]) =>
  [...xs.slice(0, i), ...xs.slice(i + 1)];
const permutations = (xs: string[]): string[] | never[][] =>
  xs.length == 0
    ? [[]]
    : xs.flatMap((x, i) => permutations(excluding(i)(xs)).map((p) => x + p));

const getHandTypeValue = (
  cards: string,
  typeRegex: RegExp[],
  sort = true
): number => {
  const sortedHand = sort ? cards.split('').sort().join('') : cards;
  for (const [i, re] of typeRegex.entries()) {
    if (sortedHand.match(re)) return typeRegex.length - i;
  }
  return 0;
};

const getHandTypeValue2 = (cards: string, typeRegex: RegExp[]): number => {
  let max = 0;
  permutations(cards.split('')).forEach(
    (perm) => (max = Math.max(getHandTypeValue(perm, typeRegex, false), max))
  );
  return max;
};

const input = fs.readFileSync('./input.txt').toString().split('\n');

const getRanks = (hands: Hand[], cardValues: string[]) =>
  hands.sort(({ cards: aCards }, { cards: bCards }) => {
    for (let i = 0; i < aCards.length; i++) {
      const aCardVal = cardValues.indexOf(aCards.charAt(i));
      const bCardVal = cardValues.indexOf(bCards.charAt(i));
      if (aCardVal > bCardVal) return 1;
      else if (aCardVal < bCardVal) return -1;
    }
    return -1;
  });

const solution1 = () => {
  const typeRegex = [
    /(\w)\1{4}/, // Five of a kind
    /(\w)\1{3}/, // Four of a kind
    /(\w)\1{2}(\w)\2{1}|(\w)\3{1}(\w)\4{2}/, // Full house
    /(\w)\1{2}/, // Three of a kind
    /(\w)\1{1}.*(\w)\2{1}/, // Two Pairs
    /(\w)\1{1}/, // Two of a kind
  ];

  const hands = input.map((handStr): Hand => {
    const [cards, bidStr] = handStr.split(' ');
    return {
      cards,
      bid: Number(bidStr),
      typeValue: getHandTypeValue(cards, typeRegex),
    };
  });

  const cardValues = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'T',
    'J',
    'Q',
    'K',
    'A',
  ];

  const grouped = [...Array(7).keys()].flatMap((i) =>
    getRanks(
      hands.filter(({ typeValue }) => typeValue === i),
      cardValues
    )
  );

  return grouped.reduce((prev, curr, i) => (prev += curr.bid * (i + 1)), 0);
};

const solution2 = () => {
  const typeRegex = [
    /(\w)(\1|J){4}/, // Five of a kind
    /(\w)(\1|J){3}/, // Four of a kind
    /(\w)(\1|J){2}(\w)(\3|J){1}|(\w)(\5|J){1}(\w)(\6|J){2}/, // Full house
    /(\w)(\1|J){2}/, // Three of a kind
    /(\w)(\1|J){1}.*(\w)(\3|J){1}/, // Two Pairs
    /(\w)(\1|J){1}/, // Two of a kind
  ];

  const hands = input.map((handStr): Hand => {
    const [cards, bidStr] = handStr.split(' ');
    return {
      cards,
      bid: Number(bidStr),
      typeValue: getHandTypeValue2(cards, typeRegex),
    };
  });

  const cardValues = [
    'J',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'T',
    'Q',
    'K',
    'A',
  ];

  const grouped = [...Array(7).keys()].flatMap((i) =>
    getRanks(
      hands.filter(({ typeValue }) => typeValue === i),
      cardValues
    )
  );

  return grouped.reduce((prev, curr, i) => (prev += curr.bid * (i + 1)), 0);
};

console.log(`Solution to problem 1 is ${chalk.bold.red(solution1())}`);

console.log(`Solution to problem 2 is ${chalk.bold.red(solution2())}`);
