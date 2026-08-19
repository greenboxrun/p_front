(() => {
  const LIST_ROUTE = '#/';
  const PREVIEW_LIST_ROUTE = '#/preview';
  const ARTICLE_ROUTE_PATTERN = /^#\/article\/(\d+)$/;
  const PREVIEW_ARTICLE_ROUTE_PATTERN = /^#\/preview\/article\/(\d+)$/;

  const parseRoute = (hash = '') => {
    const value = hash || LIST_ROUTE;
    const previewMatch = value.match(PREVIEW_ARTICLE_ROUTE_PATTERN);
    if (previewMatch) return { name: 'article', mode: 'preview', articleId: Number(previewMatch[1]) };
    const match = value.match(ARTICLE_ROUTE_PATTERN);
    if (match) return { name: 'article', mode: 'production', articleId: Number(match[1]) };
    return { name: 'list', mode: value === PREVIEW_LIST_ROUTE ? 'preview' : 'production' };
  };

  const createArticleRoute = (articleId, { mode = 'production' } = {}) => {
    const prefix = mode === 'preview' ? '#/preview/article/' : '#/article/';
    return `${prefix}${encodeURIComponent(String(articleId))}`;
  };
  const createListRoute = ({ mode = 'production' } = {}) => mode === 'preview' ? PREVIEW_LIST_ROUTE : LIST_ROUTE;

  window.ArticleRouting = { LIST_ROUTE, PREVIEW_LIST_ROUTE, parseRoute, createArticleRoute, createListRoute };
})();
