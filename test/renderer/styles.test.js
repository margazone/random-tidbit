import assert from 'node:assert/strict';
import test, { afterEach } from 'node:test';
import { renderRandomTidbit } from '../../dist/index.js';
import {
  createElement,
  createStorage,
  installDom,
  resetEnvironment,
} from '../helpers/dom.js';

afterEach(resetEnvironment);

test('injects built-in styles once by default', () => {
  const storage = createStorage();
  const firstTarget = createElement();
  const { head } = installDom(firstTarget, storage);

  renderRandomTidbit({ target: firstTarget, tidbits: [{ text: 'First' }] });
  renderRandomTidbit({ target: createElement(), tidbits: [{ text: 'Second' }] });

  assert.equal(head.children.length, 1);
  assert.equal(head.children[0].id, 'random-tidbit-styles');
  assert.match(head.children[0].textContent, /\.random-tidbit__text/);
});

test('can disable built-in styles', () => {
  const target = createElement();
  const { head } = installDom(target, createStorage());

  renderRandomTidbit({
    target,
    tidbits: [{ text: 'Hello' }],
    useDefaultStyles: false,
  });

  assert.equal(head.children.length, 0);
});
