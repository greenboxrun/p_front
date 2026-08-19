(() => {
  const createListScrollManager = ({
    windowRef = window,
    requestAnimationFrameRef = requestAnimationFrame
  } = {}) => {
    let savedScrollY = null;
    let shouldRestore = false;

    const scrollToTop = (behavior = 'smooth') => windowRef.scrollTo({ top: 0, behavior });
    const remember = () => {
      savedScrollY = windowRef.scrollY;
      shouldRestore = true;
    };
    const clear = () => {
      savedScrollY = null;
      shouldRestore = false;
    };
    const restore = () => {
      const position = savedScrollY;
      clear();
      if (position === null) {
        scrollToTop();
        return;
      }
      requestAnimationFrameRef(() => windowRef.scrollTo({ top: position, behavior: 'auto' }));
    };

    return {
      remember,
      restore,
      clear,
      scrollToTop,
      shouldRestore: () => shouldRestore
    };
  };

  window.ArticleScroll = { createListScrollManager };
})();
