import type { Tidbit } from '../../tidbit.js';
import { getNextSequenceStep } from './step/index.js';
import {
  createLocalStorageSequenceStore,
  type SequenceStore,
} from './store/index.js';

const defaultSequenceStore = createLocalStorageSequenceStore();

export function getNextTidbit(
  tidbits: Tidbit[],
  store: SequenceStore = defaultSequenceStore,
): Tidbit {
  const previousSequence = store.load(tidbits);
  const { selectedIndex, nextSequence } = getNextSequenceStep(
    previousSequence,
    tidbits.length,
  );

  store.save(tidbits, nextSequence);

  return tidbits[selectedIndex];
}
