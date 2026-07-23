import { DEFAULT_STYLES, STYLE_ID } from './constants.js';

export function injectDefaultStyles(): void {
  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = DEFAULT_STYLES;
  document.head.appendChild(style);
}
