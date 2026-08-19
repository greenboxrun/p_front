const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const beacons = [];
const context = {
  window: {},
  navigator: { sendBeacon: (url, blob) => { beacons.push({ url, blob }); return true; } },
  Blob: class BlobMock { constructor(parts, options) { this.parts = parts; this.options = options; } },
  fetch: () => { throw new Error('fetch should not be called when beacon succeeds'); },
  console
};
vm.createContext(context);
vm.runInContext(fs.readFileSync('js/article-analytics.js', 'utf8'), context);

context.window.ArticleViewTracker.record('story/42');
assert.equal(beacons.length, 1);
assert.equal(beacons[0].url, 'https://api.173day.net/public/topic/news/articles/story%2F42/view');
assert.equal(beacons[0].blob.parts.join(''), '{"article_id":"story/42"}');
assert.equal(beacons[0].blob.options.type, 'application/json');
console.log('article-analytics checks passed');
