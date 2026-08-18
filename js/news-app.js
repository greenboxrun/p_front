const REFRESH_INTERVAL = 5 * 60 * 1000;

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
        articles.value = (await window.ArticleRepository.load()).map(window.ArticleData.normalizeArticle);
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
