function loadArticles() {
  if (!Array.isArray(window.NEWS_ARTICLES)) throw new Error('뉴스 기사 데이터를 불러오지 못했습니다.');
  return window.NEWS_ARTICLES;
}
const articles = loadArticles();
const app = Vue.createApp({
  setup() {
    const now = Vue.ref(new Date());
    const route = Vue.ref(location.hash || '#/');
    let timer;
    const selectedArticle = Vue.computed(() => { const match = route.value.match(/^#\/article\/(\d+)$/); return match ? articles.find((article) => article.id === Number(match[1])) : null; });
    const countdown = Vue.computed(() => { const remaining = 600 - ((now.value.getMinutes() % 10) * 60 + now.value.getSeconds()); return `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`; });
    const briefDate = Vue.computed(() => new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }).format(now.value));
    const formatDate = (value) => new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
    const goHome = () => { location.hash = '#/'; window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const handleHash = () => { route.value = location.hash || '#/'; window.scrollTo({ top: 0, behavior: 'auto' }); };
    Vue.onMounted(() => { timer = setInterval(() => { now.value = new Date(); }, 1000); window.addEventListener('hashchange', handleHash); });
    Vue.onUnmounted(() => { clearInterval(timer); window.removeEventListener('hashchange', handleHash); });
    return { articles, selectedArticle, countdown, briefDate, formatDate, goHome };
  }
});
app.mount('#app');
