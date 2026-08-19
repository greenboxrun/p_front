(() => {
  const PREVIEW_HASH = '#/preview';

  const createRuntime = ({ hash = window.location.hash } = {}) => {
    const isPreview = hash === PREVIEW_HASH;
    return Object.freeze({
      mode: isPreview ? 'preview' : 'production',
      isPreview,
      analyticsEnabled: !isPreview
    });
  };

  window.AppRuntime = { PREVIEW_HASH, createRuntime, current: createRuntime() };
})();
