const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const context = { window: {}, Number, String, RegExp, encodeURIComponent };
vm.createContext(context);
vm.runInContext(fs.readFileSync('js/article-routing.js', 'utf8'), context);
const { LIST_ROUTE, PREVIEW_LIST_ROUTE, parseRoute, createArticleRoute, createListRoute } = context.window.ArticleRouting;

assert.deepEqual({ ...parseRoute('') }, { name: 'list', mode: 'production' });
assert.deepEqual({ ...parseRoute('#/article/42') }, { name: 'article', mode: 'production', articleId: 42 });
assert.deepEqual({ ...parseRoute('#/preview') }, { name: 'list', mode: 'preview' });
assert.deepEqual({ ...parseRoute('#/preview/article/42') }, { name: 'article', mode: 'preview', articleId: 42 });
assert.deepEqual({ ...parseRoute('#/article/not-a-number') }, { name: 'list', mode: 'production' });
assert.equal(createArticleRoute(42), '#/article/42');
assert.equal(createArticleRoute(42, { mode: 'preview' }), '#/preview/article/42');
assert.equal(createListRoute(), '#/');
assert.equal(createListRoute({ mode: 'preview' }), '#/preview');
assert.equal(LIST_ROUTE, '#/');
assert.equal(PREVIEW_LIST_ROUTE, '#/preview');
console.log('article-routing checks passed');
