import type { TidbitSequence } from '../types.js';

export type SequenceStep = {
  selectedIndex: number;
  nextSequence: TidbitSequence;
};
