const assert = require('node:assert/strict');
const fs = require('node:fs');

const config = JSON.parse(fs.readFileSync('wrangler.jsonc', 'utf8'));

assert.equal(config.main, undefined);
assert.deepEqual(config.assets, { directory: '.' });
assert.equal(fs.existsSync('js/preview-worker.js'), false);
console.log('static preview hosting checks passed');
