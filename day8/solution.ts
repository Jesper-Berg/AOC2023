import fs from 'fs';
import chalk from 'chalk';

type Node = {
  val: string;
  left: string;
  right: string;
};

const input = fs.readFileSync('./input.txt').toString().split('\n');

const instructions = input[0].split('');

const nodeMap = new Map<string, Node>();
const nodeRegex = /(\w{3}) = \((\w{3}), (\w{3})\)/;
input.slice(2).forEach((row) => {
  const [_, val, left, right] = row.match(nodeRegex)!;
  nodeMap.set(val, {
    val,
    left,
    right,
  });
});

const getLeft = (node: Node) => nodeMap.get(node.left);
const getRight = (node: Node) => nodeMap.get(node.right);

const followInstruction = (
  currNode: Node,
  endCond: (_: string) => boolean,
  instructionIndex: number = 0,
  sum: number = 0
) => {
  if (endCond(currNode.val)) return sum;
  if (instructionIndex >= instructions.length) instructionIndex = 0;
  let newNode: Node;
  switch (instructions[instructionIndex]) {
    case 'R':
      newNode = getRight(currNode)!;
      break;
    case 'L':
      newNode = getLeft(currNode)!;
      break;
    default:
      newNode = currNode; // Should never happen
  }
  return followInstruction(newNode, endCond, instructionIndex + 1, sum + 1);
};

const solution1 = () => {
  const root = nodeMap.get('AAA')!;

  return followInstruction(root, (val: string) => val === 'ZZZ');
};

const solution2 = () => {
  let roots = Array.from(nodeMap.values()).filter((node) =>
    node.val.endsWith('A')
  );
  const times = roots.map((root) =>
    followInstruction(root, (val: string) => val.endsWith('Z'))
  );

  const findGCD = (a: number, b: number) => {
    if (b === 0) return a;
    return findGCD(b, a % b);
  };

  let LCM = times[0];
  for (let i = 1; i < times.length; i++)
    LCM = (times[i] * LCM) / findGCD(times[i], LCM); // Math lol

  return LCM;
};

console.log(`Solution to problem 1 is ${chalk.bold.red(solution1())}`);

console.log(`Solution to problem 2 is ${chalk.bold.red(solution2())}`);
