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

test('resolves selector targets and rejects missing targets', () => {
  const target = createElement();
  installDom(target, createStorage());

  const renderer = renderRandomTidbit({
    target: '#tidbit',
    tidbits: [{ text: 'Hello' }],
  });

  assert.equal(renderer.tidbit.text, 'Hello');
  assert.throws(
    () => renderRandomTidbit({ target: '#missing' }),
    /\[random-tidbit\].*could not find target/,
  );
});
