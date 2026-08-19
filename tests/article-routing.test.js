const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const context = { window: {}, Number, String, RegExp, encodeURIComponent };
vm.createContext(context);
vm.runInContext(fs.readFileSync('js/article-routing.js', 'utf8'), context);
const { LIST_ROUTE, parseRoute, createArticleRoute } = context.window.ArticleRouting;

assert.deepEqual({ ...parseRoute('') }, { name: 'list' });
assert.deepEqual({ ...parseRoute('#/article/42') }, { name: 'article', articleId: 42 });
assert.deepEqual({ ...parseRoute('#/article/not-a-number') }, { name: 'list' });
assert.equal(createArticleRoute(42), '#/article/42');
assert.equal(LIST_ROUTE, '#/');
console.log('article-routing checks passed');
