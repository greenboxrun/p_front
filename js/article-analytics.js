(() => {
  const DEFAULT_VIEW_LOG_URL = 'https://api.173day.net/public/topic/news/articles';

  const createArticleViewTracker = ({
    navigatorRef = navigator,
    fetchRef = fetch,
    BlobRef = Blob,
    logger = console,
    baseUrl = DEFAULT_VIEW_LOG_URL
  } = {}) => {
    const reportFailure = (error) => logger.warn('기사 조회 로그 전송에 실패했습니다.', error);

    const record = (articleId) => {
      const url = `${baseUrl}/${encodeURIComponent(String(articleId))}/view`;
      const body = JSON.stringify({ article_id: articleId });
      try {
        if (navigatorRef.sendBeacon && navigatorRef.sendBeacon(url, new BlobRef([body], { type: 'application/json' }))) return;
      } catch (error) {
        reportFailure(error);
      }
      fetchRef(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
        credentials: 'omit'
      }).catch(reportFailure);
    };

    return { record };
  };

  window.ArticleAnalytics = { createArticleViewTracker };
  window.ArticleViewTracker = createArticleViewTracker();
})();
