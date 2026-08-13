const ARTICLES_URL = 'https://r2.173day.net/news-articles.js';
const REFRESH_INTERVAL = 5 * 60 * 1000;

function getArticles() {
  if (!Array.isArray(window.NEWS_ARTICLES)) throw new Error('뉴스 기사 데이터를 불러오지 못했습니다.');
  return window.NEWS_ARTICLES;
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

const initialArticles = getArticles();
const app = Vue.createApp({
  setup() {
    const articles = Vue.ref(initialArticles);
    const now = Vue.ref(new Date());
    const route = Vue.ref(location.hash || '#/');
    let clockTimer;
    let refreshTimer;
    const selectedArticle = Vue.computed(() => { const match = route.value.match(/^#\/article\/(\d+)$/); return match ? articles.value.find((article) => article.id === Number(match[1])) : null; });
    const countdown = Vue.computed(() => { const remaining = 600 - ((now.value.getMinutes() % 10) * 60 + now.value.getSeconds()); return `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`; });
    const briefDate = Vue.computed(() => new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }).format(now.value));
    const formatDate = (value) => new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
    const goHome = () => { location.hash = '#/'; window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const handleHash = () => { route.value = location.hash || '#/'; window.scrollTo({ top: 0, behavior: 'auto' }); };
    const refreshArticles = async () => {
      try {
        articles.value = await loadArticlesScript();
      } catch (error) {
        console.error(error);
      }
    };
    Vue.onMounted(() => {
      clockTimer = setInterval(() => { now.value = new Date(); }, 1000);
      refreshArticles();
      refreshTimer = setInterval(refreshArticles, REFRESH_INTERVAL);
      window.addEventListener('hashchange', handleHash);
    });
    Vue.onUnmounted(() => {
      clearInterval(clockTimer);
      clearInterval(refreshTimer);
      window.removeEventListener('hashchange', handleHash);
    });
    return { articles, selectedArticle, countdown, briefDate, formatDate, goHome };
  }
});
app.mount('#app');
