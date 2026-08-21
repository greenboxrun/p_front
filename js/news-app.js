const REFRESH_INTERVAL = 5 * 60 * 1000;
const app = Vue.createApp({
  components: { ArticleView: window.ArticleView },
  setup() {
    const { LIST_ROUTE, parseRoute, createArticleRoute, createListRoute } = window.ArticleRouting;
    const { article: siteNotice, createDisplayArticles, shouldTrackArticleView } = window.SiteNotice;
    const articles = Vue.ref([]);
    const isLoading = Vue.ref(true);
    const loadError = Vue.ref(false);
    const now = Vue.ref(new Date());
    const route = Vue.ref(location.hash || LIST_ROUTE);
    let refreshTimer;
    const listScroll = window.ArticleScroll.createListScrollManager();
    const displayArticles = Vue.computed(() => createDisplayArticles(articles.value));
    const selectedArticle = Vue.computed(() => {
      const currentRoute = parseRoute(route.value);
      return currentRoute.name === 'article'
        ? displayArticles.value.find((article) => article.id === currentRoute.articleId)
        : null;
    });
    const briefDate = Vue.computed(() => new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }).format(now.value));
    const formatDate = (value) => new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric' }).format(new Date(value));
    const routeMode = () => parseRoute(route.value).mode;
    const listRoute = () => createListRoute({ mode: routeMode() });
    const articleHref = (articleId) => createArticleRoute(articleId, { mode: routeMode() });
    const rememberListScroll = () => listScroll.remember();
    const handleArticleClick = (articleId) => {
      const article = displayArticles.value.find((item) => item.id === articleId);
      if (shouldTrackArticleView(article)) window.ArticleViewTracker.record(articleId);
      rememberListScroll();
    };
    const restoreListScroll = () => listScroll.restore();
    const goHome = () => {
      listScroll.clear();
      const destination = listRoute();
      if (location.hash === destination) return listScroll.scrollToTop();
      location.hash = destination;
    };
    const returnToList = () => {
      const destination = listRoute();
      if (location.hash === destination) return restoreListScroll();
      location.hash = destination;
    };
    const handleHash = () => {
      const previousRoute = route.value;
      const nextRoute = location.hash || LIST_ROUTE;
      route.value = nextRoute;
      const returningFromArticle = parseRoute(nextRoute).name === 'list' && parseRoute(previousRoute).name === 'article';
      if (returningFromArticle && listScroll.shouldRestore()) restoreListScroll();
      else listScroll.scrollToTop('auto');
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
    return { articles, displayArticles, siteNotice, isLoading, loadError, selectedArticle, briefDate, formatDate, articleHref, goHome, returnToList, rememberListScroll, handleArticleClick, retryInitialLoad };
  }
});
app.mount('#app');
