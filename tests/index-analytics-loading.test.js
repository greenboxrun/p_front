const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');
assert.doesNotMatch(html, /googletagmanager\.com\/gtag\/js/);
assert.doesNotMatch(html, /https:\/\/waust\.at\/s\.js/);
assert.match(html, /js\/runtime-mode\.js/);
assert.match(html, /js\/analytics-bootstrap\.js/);
assert.match(html, /data-visitor-counter/);
assert.ok(html.indexOf('js/runtime-mode.js') < html.indexOf('js/article-analytics.js'));
console.log('index analytics loading checks passed');
