(() => {
  const runtime = window.AppRuntime && window.AppRuntime.current;
  if (!runtime || !runtime.analyticsEnabled) return;

  const measurementId = 'G-2L4E6MTFJB';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId);

  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(gaScript);

  const counter = document.querySelector('[data-visitor-counter]');
  if (!counter) return;
  window._wau = window._wau || [];
  window._wau.push(['small', 'rqkjnoqcjy', 'qla']);
  const counterScript = document.createElement('script');
  counterScript.async = true;
  counterScript.src = 'https://waust.at/s.js';
  counter.appendChild(counterScript);
})();
