(() => {
  const LIST_ROUTE = '#/';
  const ARTICLE_ROUTE_PATTERN = /^#\/article\/(\d+)$/;

  const parseRoute = (hash = '') => {
    const value = hash || LIST_ROUTE;
    const match = value.match(ARTICLE_ROUTE_PATTERN);
    return match ? { name: 'article', articleId: Number(match[1]) } : { name: 'list' };
  };

  const createArticleRoute = (articleId) => `#/article/${encodeURIComponent(String(articleId))}`;

  window.ArticleRouting = { LIST_ROUTE, parseRoute, createArticleRoute };
})();
