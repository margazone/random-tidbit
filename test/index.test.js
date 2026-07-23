import assert from 'node:assert/strict';
import test, { afterEach } from 'node:test';
import { quotes, renderRandomTidbit } from '../dist/index.js';
import {
  createElement,
  createStorage,
  installDom,
  resetEnvironment,
} from './helpers/dom.js';

afterEach(resetEnvironment);

test('exports quotes as a tidbit collection', () => {
  const target = createElement();
  installDom(target, createStorage());
  Math.random = () => 0;

  const renderer = renderRandomTidbit({
    target,
    tidbits: quotes,
  });

  assert.equal(renderer.tidbit.text.length > 0, true);
  assert.equal(target.children.length > 0, true);
});
