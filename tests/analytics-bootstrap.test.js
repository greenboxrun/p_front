const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const appendedToHead = [];
const context = {
  window: { AppRuntime: { current: { analyticsEnabled: false } } },
  document: {
    createElement: () => { throw new Error('preview mode must not create analytics scripts'); },
    head: { appendChild: (node) => appendedToHead.push(node) },
    querySelector: () => null
  },
  Date
};
vm.createContext(context);
vm.runInContext(fs.readFileSync('js/analytics-bootstrap.js', 'utf8'), context);

assert.equal(appendedToHead.length, 0);
assert.equal(context.window.dataLayer, undefined);

const productionScripts = [];
const counterScripts = [];
const productionContext = {
  window: { AppRuntime: { current: { analyticsEnabled: true } } },
  document: {
    createElement: () => ({}),
    head: { appendChild: (node) => productionScripts.push(node) },
    querySelector: () => ({ appendChild: (node) => counterScripts.push(node) })
  },
  Date
};
vm.createContext(productionContext);
vm.runInContext(fs.readFileSync('js/analytics-bootstrap.js', 'utf8'), productionContext);

assert.equal(productionScripts[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-2L4E6MTFJB');
assert.equal(counterScripts[0].src, 'https://waust.at/s.js');
console.log('analytics bootstrap checks passed');
