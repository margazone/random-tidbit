import { getStorageKey } from './get-storage-key.js';
import { isValidSequence } from './is-valid-sequence.js';
import type { SequenceStore } from './types.js';
import type { TidbitSequence } from '../types.js';

export function createLocalStorageSequenceStore(): SequenceStore {
  return {
    load(tidbits) {
      const storage = getLocalStorage();
      if (!storage) {
        return createEmptySequence();
      }

      const storageKey = getStorageKey(tidbits);
      let savedValue: string | null;

      try {
        savedValue = storage.getItem(storageKey);
      } catch {
        return createEmptySequence();
      }

      if (!savedValue) {
        return createEmptySequence();
      }

      try {
        const sequence: unknown = JSON.parse(savedValue);
        if (isValidSequence(sequence, tidbits.length)) {
          return sequence;
        }
      } catch {}

      removeInvalidSequence(storage, storageKey);
      return createEmptySequence();
    },

    save(tidbits, sequence) {
      const storage = getLocalStorage();
      if (!storage) {
        return;
      }

      try {
        storage.setItem(
          getStorageKey(tidbits),
          JSON.stringify(sequence),
        );
      } catch {}
    },
  };
}

function createEmptySequence(): TidbitSequence {
  return {
    nextIndexes: [],
    prevIndexes: [],
  };
}

function getLocalStorage(): Storage | undefined {
  try {
    return window.localStorage ?? undefined;
  } catch {
    return undefined;
  }
}

function removeInvalidSequence(
  storage: Storage,
  storageKey: string,
): void {
  try {
    storage.removeItem(storageKey);
  } catch {}
}
