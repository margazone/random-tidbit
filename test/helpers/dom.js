const originalRandom = Math.random;

export function resetEnvironment() {
  delete globalThis.document;
  delete globalThis.window;
  Math.random = originalRandom;
}

export function useRandomValues(values) {
  Math.random = () => values.shift() ?? 0;
}

export function createStorage() {
  const values = new Map();

  return {
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      values.set(key, value);
    },
    removeItem(key) {
      values.delete(key);
    },
  };
}

export function createElement(tagName = 'div') {
  return {
    tagName,
    children: [],
    id: '',
    className: '',
    textContent: '',
    classList: {
      values: new Set(),
      add(...names) {
        names.forEach((name) => this.values.add(name));
      },
      remove(...names) {
        names.forEach((name) => this.values.delete(name));
      },
      contains(name) {
        return this.values.has(name);
      },
    },
    appendChild(child) {
      this.children.push(child);
      return child;
    },
    replaceChildren(...children) {
      this.children = children;
    },
  };
}

export function installDom(target, storage) {
  const head = createElement('head');

  globalThis.document = {
    head,
    getElementById(id) {
      return head.children.find((child) => child.id === id) ?? null;
    },
    querySelector(selector) {
      return selector === '#tidbit' ? target : null;
    },
    createElement,
  };

  globalThis.window = { localStorage: storage };

  return { head };
}
