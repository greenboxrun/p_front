const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const context = { window: {}, Object, Array };
vm.createContext(context);
vm.runInContext(fs.readFileSync('js/site-notice.js', 'utf8'), context);

const { article, createDisplayArticles, shouldTrackArticleView } = context.window.SiteNotice;
assert.equal(article.title, 'topic.137day 즐기는 방법');
assert.equal(article.category, '공지');
assert.equal(article.isNotice, true);
assert.equal(article.content.find((block) => block.type === 'list').items.length, 3);
assert.equal(article.content.some((block) => block.type === 'heading' && block.text === '작성은 어떻게 진행되나요?'), true);
assert.equal(article.content.some((block) => block.type === 'paragraph' && block.text.includes('약 30분에 한 번씩')), true);
assert.equal(article.content.some((block) => block.type === 'note'), true);

const remoteArticles = [{ id: 42, title: '뉴스' }];
assert.equal(createDisplayArticles(remoteArticles).map((item) => item.id).join(','), '0,42');
assert.equal(shouldTrackArticleView(article), false);
assert.equal(shouldTrackArticleView(remoteArticles[0]), true);

const indexHtml = fs.readFileSync('index.html', 'utf8');
const newsApp = fs.readFileSync('js/news-app.js', 'utf8');
assert.match(indexHtml, /v-for="\(article,index\) in displayArticles"/);
assert.ok(indexHtml.indexOf('js/site-notice.js') < indexHtml.indexOf('js/news-app.js'));
assert.match(newsApp, /if \(shouldTrackArticleView\(article\)\) window\.ArticleViewTracker\.record\(articleId\)/);
console.log('site notice checks passed');
