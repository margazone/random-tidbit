import { MINIMUM_REPETITION_GAP_DIVISOR } from './constants.js';
import type { SequenceStep } from './types.js';
import type { TidbitSequence } from '../types.js';

export function getNextSequenceStep(
  previousSequence: TidbitSequence,
  tidbitCount: number,
): SequenceStep {
  const nextIndexes = previousSequence.nextIndexes.length > 0
    ? [...previousSequence.nextIndexes]
    : createNextIndexes(tidbitCount, previousSequence.prevIndexes);
  const index = nextIndexes.shift();

  if (index === undefined) {
    throw new Error('Unable to select the next tidbit.');
  }

  return {
    selectedIndex: index,
    nextSequence: {
      nextIndexes,
      prevIndexes: [...previousSequence.prevIndexes, index]
        .slice(-tidbitCount),
    },
  };
}

function createNextIndexes(
  length: number,
  prevIndexes: number[],
): number[] {
  if (
    prevIndexes.length !== length
    || new Set(prevIndexes).size !== length
  ) {
    return shuffleIndexes(length);
  }

  const minimumRepetitionGap = Math.floor(
    length / MINIMUM_REPETITION_GAP_DIVISOR,
  );
  const previousPositions = new Map(
    prevIndexes.map((index, position) => [index, position]),
  );
  const availableIndexes = Array.from({ length }, (_, index) => index);
  const nextIndexes: number[] = [];

  for (let position = 0; position < length; position += 1) {
    const eligibleIndexes = availableIndexes.filter((index) => {
      const previousPosition = previousPositions.get(index);
      if (previousPosition === undefined) {
        return true;
      }
      const repetitionGap = length + position - previousPosition - 1;
      return repetitionGap >= minimumRepetitionGap;
    });
    const randomIndex = Math.floor(Math.random() * eligibleIndexes.length);
    const nextIndex = eligibleIndexes[randomIndex];

    nextIndexes.push(nextIndex);
    availableIndexes.splice(availableIndexes.indexOf(nextIndex), 1);
  }

  return nextIndexes;
}

function shuffleIndexes(length: number): number[] {
  const indexes = Array.from({ length }, (_, index) => index);

  for (let index = indexes.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [indexes[index], indexes[randomIndex]] = [
      indexes[randomIndex],
      indexes[index],
    ];
  }

  return indexes;
}
