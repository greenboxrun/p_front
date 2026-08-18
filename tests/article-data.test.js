const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const context = { window: {}, JSON, Date, Object, Array, String, Number, Error, RegExp };
vm.createContext(context);
vm.runInContext(fs.readFileSync('js/article-data.js', 'utf8'), context);

const { normalizeArticle, normalizeQuoteText, parseArticleJson } = context.window.ArticleData;

const article = normalizeArticle({
  title: '테스트',
  content: [{ type: 'quote', text: '““인용””' }, null],
  tags: 'invalid',
  readingTime: '4'
});

assert.equal(article.content.length, 1);
assert.equal(article.content[0].text, '“인용”');
assert.equal(article.tags.length, 0);
assert.equal(article.readingTime, 4);
assert.equal(normalizeQuoteText('““x””'), '“x”');
assert.deepEqual(parseArticleJson('{"title":"테스트","content":[],}'), { title: '테스트', content: [] });

assert.throws(() => normalizeArticle({ title: '제목' }), /content 필드는 배열이어야 합니다/);
console.log('article-data checks passed');
