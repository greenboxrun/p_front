# 173DAY Frontend

커뮤니티 댓글 반응을 AI가 정리해 보여주는 뉴스 서비스 **173DAY**의 웹 프론트엔드입니다. 최신 기사 목록과 상세 화면을 제공하며, 해시 라우팅으로 운영 화면과 미리보기 화면을 분리합니다.

> [p_api](https://github.com/greenboxrun/p_api)에서 발행한 기사 데이터를 읽어 사용자에게 전달하는 presentation layer입니다.

## 주요 기능

- 최신 기사 목록 및 카테고리 표시
- `#/article/:id` 형태의 기사 상세 화면
- `#/preview`, `#/preview/article/:id` 미리보기 모드
- 목록 복귀 시 이전 스크롤 위치 복원
- 운영 화면에서만 기사 조회 이벤트 전송
- 로딩·오류·재시도 상태 제공
- 5분 주기의 최신 기사 데이터 갱신
- 키보드 포커스와 `prefers-reduced-motion` 대응

## 기술 스택

- HTML5 / CSS3 / JavaScript
- Vue 3 (CDN)
- Tailwind CSS (CDN)
- Cloudflare 정적 호스팅
- Node.js built-in test runner

## 데이터 흐름

```text
R2의 news-articles.js
        ↓
ArticleRepository → ArticleData 정규화
        ↓
Vue 상태 관리 → 목록/상세 라우팅
        ↓
기사 조회 시 p_api 조회 로그 API 호출
```

기사 원문 데이터는 `https://r2.173day.net/news-articles.js`에서 동적으로 로드합니다. 데이터 저장소와 화면 렌더링을 분리해 콘텐츠 갱신과 UI 변경의 영향을 줄였습니다.

## 프로젝트 구조

```text
index.html              앱 shell 및 화면 마크업
css/site.css             서비스 전역 스타일
js/news-app.js           Vue 앱 진입점과 상태 조합
js/article-repository.js 기사 데이터 로딩 경계
js/article-data.js       기사 데이터 정규화
js/article-routing.js    목록/상세/미리보기 라우팅
js/article-view.js       기사 상세 컴포넌트
js/article-analytics.js  기사 조회 이벤트 전송
js/article-scroll.js     목록 스크롤 위치 관리
js/runtime-mode.js       운영/미리보기 런타임 구분
tests/                   라우팅·데이터·분석·화면 테스트
```

## 로컬 실행

```bash
npm install
npm run dev
```

## 테스트 및 배포

```bash
npm test
npm run deploy
```

## 포트폴리오 포인트

- 프레임워크 의존성을 최소화한 모듈 분리형 프론트엔드
- 운영/미리보기 모드를 라우팅과 분석 정책으로 분리
- 비동기 로딩, 실패 상태, 재시도까지 포함한 사용자 흐름
- 라우팅, 스크롤 복원, 조회 로그를 독립 모듈로 분리해 테스트 가능하게 구성
