import { DOM_ROOT_CLASS, ERROR_PREFIX } from '../constants.js';

export function resolveTarget(target: string | HTMLElement): HTMLElement {
  if (typeof target !== 'string') {
    return target;
  }

  const element = document.querySelector<HTMLElement>(target);
  if (!element) {
    throw new Error(`${ERROR_PREFIX} could not find target: ${target}`);
  }

  return element;
}

export function clearTarget(target: HTMLElement): void {
  target.classList.remove(DOM_ROOT_CLASS);
  target.replaceChildren();
}
