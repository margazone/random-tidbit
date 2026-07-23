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

test('requires a browser environment', () => {
  assert.throws(
    () => renderRandomTidbit({ target: '#tidbit' }),
    /\[random-tidbit\].*browser environment/,
  );
});

test('renders normalized tidbit text and attribution', () => {
  const target = createElement();
  installDom(target, createStorage());

  const renderer = renderRandomTidbit({
    target,
    tidbits: [{ text: '  Hello  ', attribution: '  World  ' }],
  });

  assert.deepEqual(renderer.tidbit, { text: 'Hello', attribution: 'World' });
  assert.equal(target.children[0].textContent, 'Hello');
  assert.equal(target.children[0].tagName, 'p');
  assert.equal(target.children[0].className, 'random-tidbit__text');
  assert.equal(target.children[1].textContent, 'World');
  assert.equal(target.classList.contains('random-tidbit'), true);
});

test('rejects tidbit lists without valid text', () => {
  const target = createElement();
  installDom(target, createStorage());

  assert.throws(
    () => renderRandomTidbit({ target, tidbits: [{ text: '   ' }] }),
    /\[random-tidbit\].*valid tidbit/,
  );
});

test('destroy clears the rendered target', () => {
  const target = createElement();
  installDom(target, createStorage());
  const renderer = renderRandomTidbit({
    target,
    tidbits: [{ text: 'Hello' }],
  });

  renderer.destroy();

  assert.equal(target.children.length, 0);
  assert.equal(target.classList.contains('random-tidbit'), false);
});
