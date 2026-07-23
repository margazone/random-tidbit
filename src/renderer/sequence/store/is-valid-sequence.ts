import type { TidbitSequence } from '../types.js';

export function isValidSequence(
  value: unknown,
  tidbitCount: number,
): value is TidbitSequence {
  if (
    typeof value !== 'object'
    || value === null
    || !('nextIndexes' in value)
    || !Array.isArray(value.nextIndexes)
    || !('prevIndexes' in value)
    || !Array.isArray(value.prevIndexes)
  ) {
    return false;
  }

  const nextIndexes = value.nextIndexes;
  const prevIndexes = value.prevIndexes;
  const lastSelectedIndex = prevIndexes.at(-1);

  return (
    nextIndexes.length <= tidbitCount
    && new Set(nextIndexes).size === nextIndexes.length
    && !nextIndexes.includes(lastSelectedIndex ?? -1)
    && nextIndexes.every(
      (index) => Number.isInteger(index) && index >= 0 && index < tidbitCount,
    )
    && prevIndexes.length <= tidbitCount
    && prevIndexes.every(
      (index) => Number.isInteger(index) && index >= 0 && index < tidbitCount,
    )
  );
}
