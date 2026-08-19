const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const context = { window: { location: { hash: '#/preview' } }, Object };
vm.createContext(context);
vm.runInContext(fs.readFileSync('js/runtime-mode.js', 'utf8'), context);

assert.deepEqual({ ...context.window.AppRuntime.current }, {
  mode: 'preview',
  isPreview: true,
  analyticsEnabled: false
});
assert.deepEqual({ ...context.window.AppRuntime.createRuntime({ hash: '#/' }) }, {
  mode: 'production',
  isPreview: false,
  analyticsEnabled: true
});
assert.deepEqual({ ...context.window.AppRuntime.createRuntime({
  hash: '#/preview'
}) }, {
  mode: 'preview',
  isPreview: true,
  analyticsEnabled: false
});
assert.deepEqual({ ...context.window.AppRuntime.createRuntime({
  hash: '#/preview/article/42'
}) }, {
  mode: 'preview',
  isPreview: true,
  analyticsEnabled: false
});
assert.deepEqual({ ...context.window.AppRuntime.createRuntime({ hash: '#/article/42' }) }, {
  mode: 'production',
  isPreview: false,
  analyticsEnabled: true
});
console.log('runtime mode checks passed');
