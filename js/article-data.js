(() => {
  const normalizeQuoteText = (value) => {
    const text = String(value ?? '');
    if (text.startsWith('““') && text.endsWith('””')) return text.slice(1, -1);
    return text;
  };

  const cleanArticleValue = (value) => {
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
  };

  const normalizeArticle = (article) => {
    const source = cleanArticleValue(article);
    if (!source || typeof source !== 'object' || Array.isArray(source)) throw new Error('기사 데이터는 하나의 객체여야 합니다.');
    if (!source.title || typeof source.title !== 'string') throw new Error('title 필드가 필요합니다.');
    if (!Array.isArray(source.content)) throw new Error('content 필드는 배열이어야 합니다.');
    return {
      ...source,
      id: source.id ?? Date.now(),
      category: source.category || '기타',
      summary: source.summary || '',
      tags: Array.isArray(source.tags) ? source.tags : [],
      readingTime: Number(source.readingTime) || 0,
      content: source.content
        .filter((block) => block && typeof block === 'object' && typeof block.type === 'string')
        .map((block) => ({
          ...block,
          text: block.type === 'quote' ? normalizeQuoteText(block.text || '') : (block.text || ''),
          items: Array.isArray(block.items) ? block.items : []
        }))
    };
  };

  const parseArticleJson = (input) => {
    const source = String(input || '')
      .trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()
      .replace(/,\s*$/, '');
    let cleaned = '';
    let inString = false;
    let escaped = false;
    for (let index = 0; index < source.length; index += 1) {
      const character = source[index];
      if (inString) {
        cleaned += character;
        if (escaped) escaped = false;
        else if (character === '\\') escaped = true;
        else if (character === '"') inString = false;
        continue;
      }
      if (character === '"') inString = true;
      if (character === ',') {
        let next = index + 1;
        while (/\s/.test(source[next] || '')) next += 1;
        if (source[next] === '}' || source[next] === ']') continue;
      }
      cleaned += character;
    }
    return JSON.parse(cleaned);
  };

  window.ArticleData = { normalizeArticle, normalizeQuoteText, parseArticleJson };
})();
