(() => {
  const normalizeQuoteText = (value) => {
    const text = String(value ?? '');
    if (text.startsWith('““') && text.endsWith('””')) return text.slice(1, -1);
    return text;
  };

  const formatQuoteText = (value) => {
    const text = normalizeQuoteText(value);
    if (text.startsWith('“') && text.endsWith('”')) return text;
    return `“${text}”`;
  };
  const normalizeArticle = (article) => {
    if (!article || typeof article !== 'object' || Array.isArray(article)) throw new Error('기사 데이터는 하나의 객체여야 합니다.');
    if (!article.title || typeof article.title !== 'string') throw new Error('title 필드가 필요합니다.');
    if (!Array.isArray(article.content)) throw new Error('content 필드는 배열이어야 합니다.');
    return { ...article, id: article.id ?? Date.now(), category: article.category || '기타', summary: article.summary || '', tags: Array.isArray(article.tags) ? article.tags : [], readingTime: Number(article.readingTime) || 0, content: article.content.filter((block) => block && typeof block === 'object' && typeof block.type === 'string').map((block) => ({ ...block, text: block.type === 'quote' ? normalizeQuoteText(block.text || '') : (block.text || ''), items: Array.isArray(block.items) ? block.items : [] })) };
  };

  const parseArticleJson = (input) => {
    let source = String(input || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim().replace(/,\s*$/, '');
    let cleaned = '';
    let inString = false;
    let escaped = false;
    for (let index = 0; index < source.length; index += 1) {
      const character = source[index];
      if (inString) {
        cleaned += character;
        if (escaped) escaped = false;
        else if (character === '\\') escaped = true;
        else if (character === '"') inString = false;
        continue;
      }
      if (character === '"') inString = true;
      if (character === ',') {
        let next = index + 1;
        while (/\s/.test(source[next] || '')) next += 1;
        if (source[next] === '}' || source[next] === ']') continue;
      }
      cleaned += character;
    }
    return JSON.parse(cleaned);
  };
  const ArticleView = {
    props: {
      article: { type: Object, required: true }
    },
    emits: ['home'],
    setup(props, { emit }) {
      const formatDate = (value) => {
        if (!value) return '날짜 미상';
        const date = new Date(value);
        return Number.isNaN(date.getTime())
          ? '날짜 미상'
          : new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric' }).format(date);
      };
      const goHome = () => emit('home');
      return { formatDate, formatQuoteText, goHome };
    },
    template: `
      <main class="mx-auto max-w-4xl px-5 pb-20 pt-8 sm:px-8 sm:pt-14">
        <button @click="goHome" class="group mb-10 inline-flex items-center gap-2 text-sm font-semibold text-ink/65 hover:text-moss">
          <span class="transition-transform group-hover:-translate-x-1">←</span> 목록으로
        </button>
        <article>
          <div class="flex flex-wrap items-center gap-3 font-mono text-[11px] tracking-[.08em] text-moss">
            <span>{{ article.category || '기타' }}</span><span class="text-ink/30">/</span>
            <span class="text-ink/50">{{ formatDate(article.publishedAt) }}</span><span class="text-ink/30">/</span>
            <span class="text-ink/50">{{ article.readingTime || 0 }} MIN READ</span>
          </div>
          <h1 class="mt-5 font-display text-4xl font-bold leading-[1.35] tracking-[-.055em] sm:text-5xl">{{ article.title }}</h1>
          <p class="mt-6 border-l-4 border-lime pl-5 text-lg leading-8 text-ink/70">{{ article.summary }}</p>
          <div v-if="article.tags.length" class="mt-6 flex flex-wrap gap-2">
            <span v-for="tag in article.tags" :key="tag" class="rounded-full bg-mist px-3 py-1 text-xs text-ink/65">#{{ tag }}</span>
          </div>
          <div class="my-10 h-px bg-ink/15"></div>
          <div class="max-w-2xl space-y-8 text-[17px] leading-8 text-ink/75">
            <template v-for="(block,index) in article.content" :key="index">
              <p v-if="block.type === 'paragraph'">{{ block.text }}</p>
              <h2 v-else-if="block.type === 'heading'" class="content-heading pt-4 text-2xl font-bold leading-9 text-ink">{{ block.text }}</h2>
              <blockquote v-else-if="block.type === 'quote'" class="content-quote">{{ formatQuoteText(block.text) }}</blockquote>
              <ul v-else-if="block.type === 'list'" class="content-list"><li v-for="item in block.items" :key="item">{{ item }}</li></ul>
              <aside v-else-if="block.type === 'note'" class="content-note"><p class="content-note-label">{{ block.label }}</p><p class="mt-2 text-[15px] leading-7 text-ink/70">{{ block.text }}</p></aside>
            </template>
          </div>
          <div class="article-disclaimer-divider" aria-hidden="true"><span>NOTICE</span></div>
          <aside class="article-disclaimer max-w-2xl" aria-label="뉴스 안내">
            <div class="article-disclaimer-heading"><p class="article-disclaimer-label">AI CONTENT NOTICE</p></div>
            <p class="article-disclaimer-copy mt-2.5">본 뉴스는 AI가 작성한 콘텐츠로, 내용에 오류가 있을 수 있는 점 양해 부탁드립니다.<br>혹시 내용과 관련해 궁금하신 점이 있으시면 아래 버튼으로 문의해 주세요.<br>감사합니다.<br><a class="article-disclaimer-mail" href="mailto:clumpy49_queues@icloud.com">문의 메일 보내기 <span aria-hidden="true">↗</span></a></p>
            <p class="article-disclaimer-site mt-3 pt-3"><a href="https://topic.173day.net">topic.173day.net — 네티즌 반응 모아보기</a></p>
          </aside>
        </article>
      </main>`
  };

  window.ArticleView = ArticleView;
  window.normalizeArticle = normalizeArticle;
  window.parseArticleJson = parseArticleJson;
  window.normalizeQuoteText = normalizeQuoteText;
})();
