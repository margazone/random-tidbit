import {
  DOM_ROOT_CLASS,
  DOM_TEXT_CLASS,
  DOM_ATTRIBUTION_CLASS,
  ERROR_PREFIX,
} from '../constants.js';
import type { Tidbit } from '../tidbit.js';
import { getNextTidbit } from './sequence/index.js';
import { injectDefaultStyles } from './styles/index.js';
import { clearTarget, resolveTarget } from './target.js';

type Options = {
  target: string | HTMLElement;
  tidbits: Tidbit[];
  useDefaultStyles?: boolean;
};

type Renderer = {
  readonly tidbit: Tidbit;
  renderNext: () => Tidbit;
  destroy: () => void;
};

export function renderRandomTidbit(options: Options): Renderer {
  assertBrowserEnvironment();

  const target = resolveTarget(options.target);
  const tidbits = normalizeTidbits(options.tidbits);
  let currentTidbit = getNextTidbit(tidbits);

  if (options.useDefaultStyles !== false) {
    injectDefaultStyles();
  }

  target.classList.add(DOM_ROOT_CLASS);
  renderTidbit(target, currentTidbit);

  return {
    get tidbit() {
      return currentTidbit;
    },
    renderNext() {
      currentTidbit = getNextTidbit(tidbits);
      renderTidbit(target, currentTidbit);
      return currentTidbit;
    },
    destroy() {
      clearTarget(target);
    },
  };
}

function normalizeTidbits(tidbits: Tidbit[]): Tidbit[] {
  const normalizedTidbits = tidbits
    .filter((tidbit) => typeof tidbit.text === 'string' && tidbit.text.trim())
    .map((tidbit) => ({
      text: tidbit.text.trim(),
      attribution: tidbit.attribution?.trim() || undefined,
    }));

  if (normalizedTidbits.length === 0) {
    throw new Error(`${ERROR_PREFIX} requires at least one valid tidbit.`);
  }

  return normalizedTidbits;
}

function renderTidbit(target: HTMLElement, tidbit: Tidbit): void {
  const tidbitElement = document.createElement('p');
  tidbitElement.className = DOM_TEXT_CLASS;
  tidbitElement.textContent = tidbit.text;

  target.replaceChildren(tidbitElement);

  if (tidbit.attribution) {
    const attributionElement = document.createElement('span');
    attributionElement.className = DOM_ATTRIBUTION_CLASS;
    attributionElement.textContent = tidbit.attribution;
    target.appendChild(attributionElement);
  }
}

function assertBrowserEnvironment(): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    throw new Error(`${ERROR_PREFIX} requires a browser environment.`);
  }
}
