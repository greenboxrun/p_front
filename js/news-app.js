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
  setup() {
    const articles = Vue.ref([]);
    const isLoading = Vue.ref(true);
    const loadError = Vue.ref(false);
    const now = Vue.ref(new Date());
    const route = Vue.ref(location.hash || '#/');
    let refreshTimer;
    const selectedArticle = Vue.computed(() => { const match = route.value.match(/^#\/article\/(\d+)$/); return match ? articles.value.find((article) => article.id === Number(match[1])) : null; });
    const briefDate = Vue.computed(() => new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }).format(now.value));
    const formatDate = (value) => new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric' }).format(new Date(value));
    const goHome = () => { location.hash = '#/'; window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const handleHash = () => { route.value = location.hash || '#/'; window.scrollTo({ top: 0, behavior: 'auto' }); };
    const refreshArticles = async (isInitialLoad = false) => {
      if (isInitialLoad) {
        isLoading.value = true;
        loadError.value = false;
      }
      try {
        articles.value = cleanArticleValue(await loadArticlesScript());
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
    return { articles, isLoading, loadError, selectedArticle, briefDate, formatDate, goHome, retryInitialLoad };
  }
});
app.mount('#app');
