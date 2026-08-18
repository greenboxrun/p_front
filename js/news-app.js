const ARTICLES_URL = 'https://r2.173day.net/news-articles.js';
const REFRESH_INTERVAL = 5 * 60 * 1000;

function getArticles() {
  if (!Array.isArray(window.NEWS_ARTICLES)) throw new Error('뉴스 기사 데이터를 불러오지 못했습니다.');
  return window.NEWS_ARTICLES;
}

// 기사 원문에 복사 과정에서 남은 이스케이프 따옴표가 있어도
// 화면에는 자연스러운 따옴표만 표시되도록 정리한다.
function cleanArticleValue(value) {
  if (typeof value === 'string') {
    let cleaned = value;
    while (cleaned.includes('\\"')) cleaned = cleaned.replace(/\\"/g, '"');
    return cleaned;
  }
  if (Array.isArray(value)) return value.map(cleanArticleValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cleanArticleValue(item)]));
  }
  return value;
}

function normalizeArticle(article) {
  const source = cleanArticleValue(article);
  if (!source || typeof source !== 'object' || Array.isArray(source)) throw new Error('기사 데이터는 하나의 객체여야 합니다.');
  if (!source.title || typeof source.title !== 'string') throw new Error('title 필드가 필요합니다.');
  if (!source.content || !Array.isArray(source.content)) throw new Error('content 필드는 배열이어야 합니다.');
  return {
    ...source,
    id: source.id ?? Date.now(),
    category: source.category || '기타',
    summary: source.summary || '',
    tags: Array.isArray(source.tags) ? source.tags : [],
    readingTime: Number(source.readingTime) || 0,
    content: source.content.filter((block) => block && typeof block === 'object' && typeof block.type === 'string').map((block) => ({
      ...block,
      text: block.type === 'quote' && typeof window.normalizeQuoteText === 'function'
        ? window.normalizeQuoteText(block.text || '')
        : (block.text || ''),
      items: Array.isArray(block.items) ? block.items : []
    }))
  };
}

function loadArticlesScript() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${ARTICLES_URL}?v=${Date.now()}`;
    script.onload = () => { script.remove(); resolve(getArticles()); };
    script.onerror = () => { script.remove(); reject(new Error('최신 뉴스 기사 데이터를 불러오지 못했습니다.')); };
    document.head.appendChild(script);
  });
}

const app = Vue.createApp({
  components: { ArticleView: window.ArticleView },
  setup() {
    const articles = Vue.ref([]);
    const isLoading = Vue.ref(true);
    const loadError = Vue.ref(false);
    const now = Vue.ref(new Date());
    const route = Vue.ref(location.hash || '#/');
    let refreshTimer;
    let listScrollY = null;
    let shouldRestoreListScroll = false;
    const selectedArticle = Vue.computed(() => { const match = route.value.match(/^#\/article\/(\d+)$/); return match ? articles.value.find((article) => article.id === Number(match[1])) : null; });
    const briefDate = Vue.computed(() => new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }).format(now.value));
    const formatDate = (value) => new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric' }).format(new Date(value));
    const rememberListScroll = () => {
      listScrollY = window.scrollY;
      shouldRestoreListScroll = true;
    };
    const scrollToTop = (behavior = 'smooth') => window.scrollTo({ top: 0, behavior });
    const restoreListScroll = () => {
      const savedScrollY = listScrollY;
      listScrollY = null;
      shouldRestoreListScroll = false;
      if (savedScrollY === null) return scrollToTop();
      requestAnimationFrame(() => window.scrollTo({ top: savedScrollY, behavior: 'auto' }));
    };
    const goHome = () => {
      listScrollY = null;
      shouldRestoreListScroll = false;
      if (location.hash === '#/') return scrollToTop();
      location.hash = '#/';
    };
    const returnToList = () => {
      if (location.hash === '#/') return restoreListScroll();
      location.hash = '#/';
    };
    const handleHash = () => {
      const previousRoute = route.value;
      const nextRoute = location.hash || '#/';
      route.value = nextRoute;
      const returningFromArticle = nextRoute === '#/' && /^#\/article\/\d+$/.test(previousRoute);
      if (returningFromArticle && shouldRestoreListScroll) restoreListScroll();
      else scrollToTop('auto');
    };
    const refreshArticles = async (isInitialLoad = false) => {
      if (isInitialLoad) {
        isLoading.value = true;
        loadError.value = false;
      }
      try {
        articles.value = (await loadArticlesScript()).map(normalizeArticle);
        isLoading.value = false;
        loadError.value = false;
      } catch (error) {
        if (isInitialLoad) {
          isLoading.value = false;
          loadError.value = true;
        }
        console.error(error);
      }
    };
    const retryInitialLoad = () => refreshArticles(true);
    Vue.onMounted(() => {
      refreshArticles(true);
      refreshTimer = setInterval(refreshArticles, REFRESH_INTERVAL);
      window.addEventListener('hashchange', handleHash);
    });
    Vue.onUnmounted(() => {
      clearInterval(refreshTimer);
      window.removeEventListener('hashchange', handleHash);
    });
    return { articles, isLoading, loadError, selectedArticle, briefDate, formatDate, goHome, returnToList, rememberListScroll, retryInitialLoad };
  }
});
app.mount('#app');
