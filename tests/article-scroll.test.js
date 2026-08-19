const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const scrollCalls = [];
const queuedFrames = [];
const windowRef = { scrollY: 320, scrollTo: (options) => scrollCalls.push(options) };
const context = { window: {}, windowRef, requestAnimationFrame: (callback) => queuedFrames.push(callback) };
vm.createContext(context);
vm.runInContext(fs.readFileSync('js/article-scroll.js', 'utf8'), context);

const manager = context.window.ArticleScroll.createListScrollManager({ windowRef, requestAnimationFrameRef: context.requestAnimationFrame });
manager.remember();
assert.equal(manager.shouldRestore(), true);
manager.restore();
assert.equal(scrollCalls.length, 0);
assert.equal(manager.shouldRestore(), false);
queuedFrames.shift()();
assert.equal(scrollCalls[0].top, 320);
assert.equal(scrollCalls[0].behavior, 'auto');

manager.restore();
assert.equal(scrollCalls[1].top, 0);
assert.equal(scrollCalls[1].behavior, 'smooth');
console.log('article-scroll checks passed');
