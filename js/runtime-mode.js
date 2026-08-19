(() => {
  const PREVIEW_HASH = '#/preview';
  const isPreviewHash = (hash = '') => hash === PREVIEW_HASH || hash.startsWith(`${PREVIEW_HASH}/`);

  const createRuntime = ({ hash = window.location.hash } = {}) => {
    const isPreview = isPreviewHash(hash);
    return Object.freeze({
      mode: isPreview ? 'preview' : 'production',
      isPreview,
      analyticsEnabled: !isPreview
    });
  };

  window.AppRuntime = { PREVIEW_HASH, isPreviewHash, createRuntime, current: createRuntime() };
})();
