(() => {
  const DEFAULT_ARTICLES_URL = 'https://r2.173day.net/news-articles.js';

  const createArticleRepository = ({ documentRef = document, articlesUrl = DEFAULT_ARTICLES_URL } = {}) => ({
    load: () => new Promise((resolve, reject) => {
      const script = documentRef.createElement('script');
      script.src = `${articlesUrl}?v=${Date.now()}`;
      script.onload = () => {
        script.remove();
        if (!Array.isArray(window.NEWS_ARTICLES)) {
          reject(new Error('뉴스 기사 데이터를 불러오지 못했습니다.'));
          return;
        }
        resolve(window.NEWS_ARTICLES);
      };
      script.onerror = () => {
        script.remove();
        reject(new Error('최신 뉴스 기사 데이터를 불러오지 못했습니다.'));
      };
      documentRef.head.appendChild(script);
    })
  });

  window.ArticleRepository = createArticleRepository();
  window.createArticleRepository = createArticleRepository;
})();
