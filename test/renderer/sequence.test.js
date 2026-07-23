import assert from 'node:assert/strict';
import test, { afterEach } from 'node:test';
import { renderRandomTidbit } from '../../dist/index.js';
import { getNextTidbit } from '../../dist/renderer/sequence/index.js';
import {
  getNextSequenceStep,
} from '../../dist/renderer/sequence/step/index.js';
import {
  createElement,
  createStorage,
  installDom,
  resetEnvironment,
  useRandomValues,
} from '../helpers/dom.js';

afterEach(resetEnvironment);

test('gets the next sequence step without mutating the previous sequence', () => {
  const previousSequence = {
    nextIndexes: [1, 0],
    prevIndexes: [2],
  };

  const result = getNextSequenceStep(previousSequence, 3);

  assert.deepEqual(result, {
    selectedIndex: 1,
    nextSequence: {
      nextIndexes: [0],
      prevIndexes: [2, 1],
    },
  });
  assert.deepEqual(previousSequence, {
    nextIndexes: [1, 0],
    prevIndexes: [2],
  });
});

test('coordinates sequence state through an injected store', () => {
  const tidbits = [{ text: 'First' }, { text: 'Second' }];
  let storedSequence = {
    nextIndexes: [1, 0],
    prevIndexes: [],
  };
  const store = {
    load() {
      return storedSequence;
    },
    save(receivedTidbits, sequence) {
      assert.equal(receivedTidbits, tidbits);
      storedSequence = sequence;
    },
  };

  const tidbit = getNextTidbit(tidbits, store);

  assert.equal(tidbit.text, 'Second');
  assert.deepEqual(storedSequence, {
    nextIndexes: [0],
    prevIndexes: [1],
  });
});

test('renders without localStorage but may repeat tidbits', () => {
  const target = createElement();
  installDom(target);
  useRandomValues([0, 0]);

  const renderer = renderRandomTidbit({
    target,
    tidbits: [{ text: 'First' }, { text: 'Second' }],
  });

  assert.equal(renderer.tidbit.text, 'Second');
  assert.equal(renderer.renderNext().text, 'Second');
});

test('uses every tidbit once before repeating', () => {
  const target = createElement();
  installDom(target, createStorage());
  useRandomValues([0.5, 0, 0.5, 0]);

  const renderer = renderRandomTidbit({
    target,
    tidbits: [
      { text: 'First' },
      { text: 'Second' },
      { text: 'Third' },
    ],
  });

  const firstCycle = [
    renderer.tidbit.text,
    renderer.renderNext().text,
    renderer.renderNext().text,
  ];

  assert.deepEqual(firstCycle, ['Third', 'First', 'Second']);
  assert.equal(new Set(firstCycle).size, 3);
});

test('does not repeat the last tidbit when a new sequence starts', () => {
  const target = createElement();
  installDom(target, createStorage());
  useRandomValues([0.99, 0]);

  const renderer = renderRandomTidbit({
    target,
    tidbits: [{ text: 'First' }, { text: 'Second' }],
  });

  renderer.renderNext();
  const lastTidbit = renderer.tidbit.text;
  const firstTidbitInNextSequence = renderer.renderNext().text;

  assert.notEqual(firstTidbitInNextSequence, lastTidbit);
});

test('maintains a minimum repetition gap across sequences', () => {
  const target = createElement();
  const tidbits = ['A', 'B', 'C', 'D', 'E', 'F']
    .map((text) => ({ text }));
  const minimumRepetitionGap = Math.floor(tidbits.length / 2);
  installDom(target, createStorage());
  useRandomValues(Array(tidbits.length * 3).fill(0));

  const renderer = renderRandomTidbit({ target, tidbits });
  const renderedTexts = [renderer.tidbit.text];

  for (let index = 1; index < tidbits.length * 2; index += 1) {
    renderedTexts.push(renderer.renderNext().text);
  }

  tidbits.forEach(({ text }) => {
    const firstPosition = renderedTexts.indexOf(text);
    const secondPosition = renderedTexts.indexOf(text, firstPosition + 1);
    const repetitionGap = secondPosition - firstPosition - 1;

    assert.equal(repetitionGap >= minimumRepetitionGap, true);
  });
});

test('continues the sequence across renderer instances', () => {
  const storage = createStorage();
  useRandomValues([0.99, 0.75]);

  const firstTarget = createElement();
  installDom(firstTarget, storage);
  const firstRenderer = renderRandomTidbit({
    target: firstTarget,
    tidbits: [
      { text: 'First' },
      { text: 'Second' },
      { text: 'Third' },
    ],
  });

  const secondTarget = createElement();
  installDom(secondTarget, storage);
  const secondRenderer = renderRandomTidbit({
    target: secondTarget,
    tidbits: [
      { text: 'First' },
      { text: 'Second' },
      { text: 'Third' },
    ],
  });

  assert.equal(firstRenderer.tidbit.text, 'First');
  assert.equal(secondRenderer.tidbit.text, 'Second');
});

test('keeps different tidbit lists in independent sequences', () => {
  const storage = createStorage();
  useRandomValues([0.99, 0.99]);

  const firstTarget = createElement();
  installDom(firstTarget, storage);
  const firstRenderer = renderRandomTidbit({
    target: firstTarget,
    tidbits: [{ text: 'A1' }, { text: 'A2' }],
  });

  const secondTarget = createElement();
  installDom(secondTarget, storage);
  const secondRenderer = renderRandomTidbit({
    target: secondTarget,
    tidbits: [{ text: 'B1' }, { text: 'B2' }],
  });

  assert.equal(firstRenderer.tidbit.text, 'A1');
  assert.equal(secondRenderer.tidbit.text, 'B1');
});
