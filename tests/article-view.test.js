const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync('js/article-data.js', 'utf8'), context);
vm.runInContext(fs.readFileSync('js/article-view.js', 'utf8'), context);

const template = context.window.ArticleView.template;

assert.match(template, /기사 출처 확인하기/);
assert.match(template, /출처 확인하기 <span aria-hidden="true">↗<\/span>/);
assert.match(template, /article\.source\.title \|\| '이 기사는 온라인 커뮤니티 반응을 정리했습니다'/);
assert.match(template, /article\.source && article\.source\.title \? article\.source\.title : article\.title/);
console.log('article-view source checks passed');
