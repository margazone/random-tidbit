import type { Tidbit } from '../../../tidbit.js';
import {
  FNV_1A_32_OFFSET_BASIS,
  FNV_1A_32_PRIME,
  STORAGE_KEY_HASH_RADIX,
  STORAGE_KEY_PREFIX,
  TIDBIT_FIELD_SEPARATOR,
  TIDBIT_SEPARATOR,
} from './constants.js';

export function getStorageKey(tidbits: readonly Tidbit[]): string {
  const hashedValue = tidbits
    .map((tidbit) => (
      `${tidbit.text}${TIDBIT_FIELD_SEPARATOR}${tidbit.attribution ?? ''}`
    ))
    .join(TIDBIT_SEPARATOR);
  let hash = FNV_1A_32_OFFSET_BASIS;

  for (let index = 0; index < hashedValue.length; index += 1) {
    hash ^= hashedValue.charCodeAt(index);
    hash = Math.imul(hash, FNV_1A_32_PRIME);
  }

  return `${STORAGE_KEY_PREFIX}:${(hash >>> 0).toString(STORAGE_KEY_HASH_RADIX)}`;
}
