const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const scripts = [];
const document = {
  createElement: () => {
    const script = { remove: () => { script.removed = true; } };
    scripts.push(script);
    return script;
  },
  head: {
    appendChild: (script) => setImmediate(() => script.onload())
  }
};
const context = { window: {}, document, setImmediate, Date, Array, Error, Promise };
vm.createContext(context);
vm.runInContext(fs.readFileSync('js/article-repository.js', 'utf8'), context);

context.window.NEWS_ARTICLES = [{ id: 1 }];
context.window.ArticleRepository.load().then((articles) => {
  assert.deepEqual(articles, [{ id: 1 }]);
  assert.equal(scripts[0].removed, true);
  assert.match(scripts[0].src, /^https:\/\/r2\.173day\.net\/news-articles\.js\?v=/);
  console.log('article-repository checks passed');
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
