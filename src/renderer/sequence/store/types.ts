import type { Tidbit } from '../../../tidbit.js';
import type { TidbitSequence } from '../types.js';

export type SequenceStore = {
  load: (tidbits: readonly Tidbit[]) => TidbitSequence;
  save: (
    tidbits: readonly Tidbit[],
    sequence: TidbitSequence,
  ) => void;
};
