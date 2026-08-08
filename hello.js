const articles = [
  { id: 1, time: '09:42', category: '테크', title: 'AI가 바꾸는 일의 속도, 기업들은 어디에 시간을 다시 쓰고 있나', summary: '도입 경쟁을 넘어 업무의 우선순위와 사람의 역할을 재설계하는 단계로 진입했다.', content: ['생성형 AI를 도입한 조직의 질문은 빠르게 달라지고 있다. “무엇을 자동화할 수 있을까”에서 “절약한 시간을 어디에 써야 할까”로 무게중심이 옮겨갔다.', '현장에서는 반복 작업의 감소보다 의사결정 과정의 변화가 더 크게 감지된다. 정보를 모으고 정리하는 일은 빨라졌지만, 좋은 질문을 만들고 결과를 판단하는 역량의 중요성은 오히려 커졌다.', '전문가들은 도구 자체보다 업무 흐름을 함께 고치는 일이 중요하다고 말한다. 기술을 추가하는 것만으로는 충분하지 않으며, 팀이 검토하고 책임지는 방식까지 설계해야 한다.'] },
  { id: 2, time: '09:28', category: '비즈니스', title: '작지만 선명한 브랜드가 선택받는 이유, 취향의 빈틈을 읽다', summary: '대중성보다 구체적인 감각을 택한 브랜드들이 새로운 충성도를 만들고 있다.', content: ['모두를 위한 메시지보다 특정한 사람의 하루를 정확히 이해하는 메시지가 더 오래 남는다. 최근 소비 시장에서 작은 브랜드가 보여주는 힘은 이 지점에서 나온다.', '제품의 기능을 나열하기보다 그것이 놓일 장면을 설계할 때, 브랜드는 하나의 선택지가 아니라 취향의 기준이 된다.', '선명함은 배타성을 뜻하지 않는다. 누구에게 가장 유용한지 솔직하게 말하는 태도가 오히려 더 넓은 공감을 만든다.'] },
  { id: 3, time: '09:11', category: '사회', title: '도시의 밤이 조금 더 길어졌다, 심야 교통을 둘러싼 새로운 실험', summary: '늦게 끝나는 일과 문화 생활을 지지하는 이동망이 여러 도시에서 논의되고 있다.', content: ['도시의 운영 시간은 이미 자정을 넘어 확장됐다. 하지만 귀가를 위한 선택지는 여전히 제한적인 경우가 많다.', '심야 대중교통 확대는 단순히 막차 시간을 늦추는 문제가 아니다. 수요를 세밀하게 읽고, 안전과 노동 환경을 함께 고려해야 하는 생활 인프라의 과제다.', '작은 노선의 변화가 누군가의 하루를 완성할 수 있다. 시민들은 더 예측 가능한 밤의 이동을 기대하고 있다.'] },
  { id: 4, time: '08:55', category: '문화', title: '짧은 영상 다음의 독서: 깊게 머무는 콘텐츠가 다시 주목받는다', summary: '즉각적인 반응 대신 오래 남는 경험을 찾는 이용자들이 늘고 있다.', content: ['짧은 형식의 콘텐츠가 일상을 채운 뒤, 역설적으로 긴 호흡의 이야기를 찾는 흐름도 함께 나타나고 있다.', '이용자는 단순히 더 긴 글을 원하는 것이 아니다. 중간에 멈추지 않아도 될 만큼 밀도 있고, 생각을 이어갈 여백이 있는 경험을 기대한다.', '콘텐츠의 길이보다 중요한 것은 머무를 이유다. 좋은 편집은 바로 그 이유를 독자에게 건넨다.'] }
];

function startFileFallback() {
  const app = document.querySelector('#app');
  const date = new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }).format(new Date());
  app.removeAttribute('v-cloak');

  const shell = (body) => `
    <header class="border-b border-ink/15 bg-paper"><div class="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
      <button data-home class="group flex items-center gap-3" aria-label="173DAY 홈"><span class="grid h-8 w-8 place-items-center rounded-full bg-ink text-xs font-bold text-lime">17</span><span class="font-mono text-sm font-medium tracking-[.14em]">3DAY</span></button>
      <p class="hidden font-mono text-[11px] tracking-[.08em] text-ink/50 sm:block">10 MINUTE NEWS WINDOW</p><button data-home class="text-sm font-semibold underline decoration-moss/40 underline-offset-4">오늘의 흐름</button>
    </div></header>${body}`;
  const home = () => {
    app.innerHTML = shell(`<main class="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-16">
      <section class="grid gap-8 border-b border-ink/20 pb-10 lg:grid-cols-[1fr_280px] lg:items-end"><div><p class="mb-4 font-mono text-xs tracking-[.14em] text-moss">BRIEFING · ${date}</p><h1 class="max-w-3xl font-display text-4xl font-bold leading-[1.28] tracking-[-.055em] sm:text-5xl lg:text-6xl">지금, 세상이<br><em class="font-normal text-moss">움직이는 방향.</em></h1><p class="mt-5 max-w-xl text-base leading-7 text-ink/65">바쁜 하루 중에도 놓치고 싶지 않은 이야기를 10분마다 새로 고릅니다. 제목을 눌러 맥락까지 확인하세요.</p></div><div class="rounded-2xl bg-ink p-5 text-paper shadow-card"><p class="font-mono text-[10px] tracking-[.16em] text-lime">NEXT EDITION IN</p><p data-clock class="mt-2 font-mono text-4xl tracking-[-.08em]"></p><p class="mt-4 text-xs text-paper/60">새로운 제목이 도착하면 목록 상단에 표시됩니다.</p></div></section>
      <section class="mt-8 grid gap-10 lg:grid-cols-[1fr_280px]"><div><div class="mb-4 flex items-center justify-between"><h2 class="font-mono text-xs font-medium tracking-[.12em]">LATEST SIGNALS <span class="text-moss">${articles.length}</span></h2><span class="rounded-full bg-mist px-3 py-1 font-mono text-[10px] text-ink/65">방금 UPDATED</span></div><div class="border-t border-ink/20">${articles.map((a, i) => `<button data-article="${a.id}" class="story-card grid w-full gap-3 border-b border-ink/15 bg-paper px-1 py-5 text-left sm:grid-cols-[86px_1fr_auto] sm:items-center sm:gap-5 sm:px-4"><div class="flex items-center gap-3 sm:block"><span class="font-mono text-xs text-moss">${a.time}</span><span class="font-mono text-[10px] text-ink/35 sm:mt-1 sm:block">0${i + 1}</span></div><div><span class="mb-2 inline-block rounded-full border border-moss/25 px-2 py-0.5 text-[10px] font-semibold text-moss">${a.category}</span><h3 class="text-lg font-semibold leading-7 tracking-[-.03em] sm:text-xl">${a.title}</h3><p class="mt-1.5 text-sm leading-6 text-ink/55">${a.summary}</p></div><span class="hidden text-2xl font-light text-ink/30 sm:block">↗</span></button>`).join('')}</div></div><aside class="self-start border-t-2 border-ink pt-4"><p class="font-mono text-[10px] tracking-[.14em] text-ink/55">HOW 173DAY READS</p><p class="mt-3 font-display text-xl leading-8">한 번에 많이 말하지 않고, 지금 필요한 이야기만 남깁니다.</p></aside></section></main>`);
    app.querySelectorAll('[data-article]').forEach((button) => button.addEventListener('click', () => detail(Number(button.dataset.article))));
    bindHome(); updateClock();
  };
  const detail = (id) => {
    const a = articles.find((item) => item.id === id); if (!a) return home();
    app.innerHTML = shell(`<main class="mx-auto max-w-4xl px-5 pb-20 pt-8 sm:px-8 sm:pt-14"><button data-home class="group mb-10 inline-flex items-center gap-2 text-sm font-semibold text-ink/65"><span>←</span> 목록으로</button><article><div class="flex flex-wrap items-center gap-3 font-mono text-[11px] tracking-[.08em] text-moss"><span>${a.category}</span><span class="text-ink/30">/</span><span class="text-ink/50">${a.time} KST</span></div><h1 class="mt-5 font-display text-4xl font-bold leading-[1.35] tracking-[-.055em] sm:text-5xl">${a.title}</h1><p class="mt-6 border-l-4 border-lime pl-5 text-lg leading-8 text-ink/70">${a.summary}</p><div class="my-10 h-px bg-ink/15"></div><div class="max-w-2xl space-y-6 text-[17px] leading-8 text-ink/75">${a.content.map((paragraph) => `<p>${paragraph}</p>`).join('')}</div></article></main>`); bindHome(); window.scrollTo(0, 0);
  };
  const bindHome = () => app.querySelectorAll('[data-home]').forEach((button) => button.addEventListener('click', home));
  const updateClock = () => { const target = app.querySelector('[data-clock]'); if (!target) return; const d = new Date(); const remain = 600 - ((d.getMinutes() % 10) * 60 + d.getSeconds()); target.textContent = `${String(Math.floor(remain / 60)).padStart(2, '0')}:${String(remain % 60).padStart(2, '0')}`; };
  setInterval(updateClock, 1000); home();
}

if (!window.Vue) {
  startFileFallback();
} else {
  const { createApp, ref, computed, onMounted, onUnmounted } = Vue;
  createApp({
    setup() {
      const now = ref(new Date()); const route = ref(location.hash); const lastUpdated = ref('방금'); let timer;
      const selectedArticle = computed(() => { const match = route.value.match(/^#\/article\/(\d+)$/); return match ? articles.find((item) => item.id === Number(match[1])) : null; });
      const countdown = computed(() => { const remaining = 600 - ((now.value.getMinutes() % 10) * 60 + now.value.getSeconds()); return `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`; });
      const briefDate = computed(() => new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }).format(now.value));
      const goHome = () => { location.hash = '#/'; window.scrollTo({ top: 0, behavior: 'smooth' }); };
      const handleHash = () => { route.value = location.hash; window.scrollTo({ top: 0, behavior: 'auto' }); };
      onMounted(() => { timer = setInterval(() => { now.value = new Date(); }, 1000); window.addEventListener('hashchange', handleHash); });
      onUnmounted(() => { clearInterval(timer); window.removeEventListener('hashchange', handleHash); });
      return { articles, selectedArticle, countdown, briefDate, lastUpdated, goHome };
    }
  }).mount('#app');
}
