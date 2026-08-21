(() => {
  const article = Object.freeze({
    id: 0,
    isNotice: true,
    title: 'topic.137day 즐기는 방법',
    category: '공지',
    summary: '댓글 반응을 중심으로 173DAY를 즐기는 방법을 안내합니다.',
    tags: ['173DAY', '이용안내', '댓글반응'],
    readingTime: 3,
    content: [
      {
        type: 'paragraph',
        text: '저도 가끔 제 사이트에 들어와 즐기곤 하지만, 처음 접했을 때는 어떻게 봐야 할지 저 스스로도 어색했던 기억이 있습니다. 그래서 이 사이트를 즐기는 방법을 간단히 소개해드리려 합니다.'
      },
      {
        type: 'heading',
        text: '이 사이트는 무엇을 하는 곳인가요?'
      },
      {
        type: 'paragraph',
        text: "이 사이트의 핵심은 콘텐츠에 대한 '반응'을 보는 재미에 있습니다."
      },
      {
        type: 'list',
        items: [
          'AI는 순수하게 커뮤니티의 댓글만을 기반으로 글을 작성합니다.',
          '원본 게시물의 본문, 사진, 영상 등은 애초에 수집하지 않습니다.',
          '따라서 AI가 쓴 글 속 본문 내용 묘사는 정확하지 않을 수 있습니다. AI 자체가 원문을 모르고, 오직 댓글들만 보고 글을 쓰기 때문입니다.'
        ]
      },
      {
        type: 'heading',
        text: '추천하는 이용 방법'
      },
      {
        type: 'ordered-list',
        items: [
          "먼저 '출처 보기'를 눌러 원문을 대략 읽고 내용을 이해합니다.",
          '그 상태에서 댓글 반응들을 읽습니다.'
        ]
      },
      {
        type: 'paragraph',
        text: '저도 반응 글만 읽으면 무슨 내용인지 아리송할 때가 있습니다. 그래서 보통은 이렇게 봅니다.'
      },
      {
        type: 'list',
        items: [
          '제목만 보고 대략 내용을 유추한 뒤, 그걸 기반으로 반응 글을 먼저 읽습니다.',
          '읽다가 내용이 헷갈리면 그때 원문을 확인합니다.'
        ]
      },
      {
        type: 'note',
        label: '이용 팁',
        text: '나름 재미있는 방식이니 한번 시도해보세요.'
      },
      {
        type: 'heading',
        text: '왜 댓글에 주목했는가'
      },
      {
        type: 'paragraph',
        text: '커뮤니티 게시물 하나에는 수백 개의 댓글이 달립니다. 그 안에는 수백 명의 의견과 주장, 생각이 담겨 있죠. 하지만 이제까지 커뮤니티 역사 속에서 이 댓글들은 늘 묻혀왔고, 제대로 조명된 적이 없었습니다. 그저 추천수 순으로 몇 개만 상위 댓글로 올라갈 뿐이었죠.'
      },
      {
        type: 'paragraph',
        text: '그렇다고 수십 페이지에 달하는 댓글을 전부 읽는 건 시간 낭비이자 노동입니다. 바로 이 지점에서 이 사이트가 출발했습니다. 댓글도 가치가 있고, 그 의견들을 보는 것 자체가 흥미롭고 재미있다는 관점입니다.'
      },
      {
        type: 'heading',
        text: '현재 수집 현황'
      },
      {
        type: 'paragraph',
        text: '지금은 펨코만 수집하고 있습니다. 아직 초반 단계이고 AI 수집 비용도 들다 보니, 수익이 전무한 상황에서 우선 조회수와 댓글 수가 가장 많은 대표 커뮤니티인 펨코부터 시작했습니다.'
      },
      {
        type: 'list',
        items: [
          '특정 정치 성향이나 개인적 호불호로 선택한 것이 아니며, 순수하게 트래픽과 댓글 수 기준으로 선정했습니다.',
          '앞으로 다른 커뮤니티도 추가될 수 있습니다.'
        ]
      },
      {
        type: 'heading',
        text: '마치며'
      },
      {
        type: 'paragraph',
        text: '저도 시간 날 때 가끔 사이트에 들어와 글을 몇 개씩 봅니다. 순식간에 수십 명의 생각이 머릿속에 들어오는 느낌이 들 때가 있는데, 그게 나름의 묘미인 것 같습니다.'
      },
      {
        type: 'paragraph',
        text: '이렇게 다양한 의견을 한데 모으는 사이트가 분명 의미 있다고 확신합니다. 많이 즐겨주시길 바라며, 접속해주셔서 감사합니다.'
      },
    ]
  });

  const createDisplayArticles = (articles = []) => [article, ...articles];
  const shouldTrackArticleView = (candidate) => !candidate || !candidate.isNotice;

  window.SiteNotice = Object.freeze({ article, createDisplayArticles, shouldTrackArticleView });
})();
