import {
  DOM_ROOT_CLASS,
  DOM_TEXT_CLASS,
  DOM_ATTRIBUTION_CLASS,
} from '../../constants.js';

export const STYLE_ID = 'random-tidbit-styles';

export const DEFAULT_STYLES = `.${DOM_ROOT_CLASS} {
  box-sizing: border-box;
  display: grid;
  gap: 0.5rem;
}

.${DOM_TEXT_CLASS} {
  margin: 0;
}

.${DOM_ATTRIBUTION_CLASS} {
  opacity: 0.75;
}

.${DOM_ATTRIBUTION_CLASS}::before {
  content: "~ ";
}`;
