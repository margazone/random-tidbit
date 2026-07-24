import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const packageMetadata = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
);

test('exports the renderer without the quote collection module graph', async () => {
  const rendererUrl = import.meta.resolve('random-tidbit');
  const rendererModule = await import(rendererUrl);
  const moduleGraph = collectModuleGraph(rendererUrl);

  assert.equal(typeof rendererModule.renderRandomTidbit, 'function');
  assert.equal('quotes' in rendererModule, false);
  assert.equal(
    moduleGraph.some((url) => url.pathname.includes('/collections/')),
    false,
  );
});

test('exports quotes without the renderer module graph', async () => {
  const quotesUrl = import.meta.resolve('random-tidbit/quotes');
  const quotesModule = await import(quotesUrl);
  const moduleGraph = collectModuleGraph(quotesUrl);

  assert.equal(Array.isArray(quotesModule.quotes), true);
  assert.equal(
    moduleGraph.some((url) => url.pathname.includes('/renderer/')),
    false,
  );
});

test('maps quote declarations for legacy TypeScript resolution', () => {
  assert.deepEqual(
    packageMetadata.typesVersions['*'].quotes,
    ['./dist/collections/index.d.ts'],
  );
});

function collectModuleGraph(entryUrl) {
  const moduleUrls = new Map();

  function visit(moduleUrl) {
    if (moduleUrls.has(moduleUrl.href)) {
      return;
    }

    moduleUrls.set(moduleUrl.href, moduleUrl);
    const source = readFileSync(moduleUrl, 'utf8');
    const importPattern =
      /(?:\bfrom\s*|\bimport\s*)['"](\.[^'"]+)['"]/g;

    for (const match of source.matchAll(importPattern)) {
      visit(new URL(match[1], moduleUrl));
    }
  }

  visit(new URL(entryUrl));
  return [...moduleUrls.values()];
}
