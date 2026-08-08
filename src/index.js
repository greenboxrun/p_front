export default {
  async fetch(request) {
    const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>173day</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`;
    return new Response(html, {
      headers: { "content-type": "text/html; charset=UTF-8" },
    });
  },
};
