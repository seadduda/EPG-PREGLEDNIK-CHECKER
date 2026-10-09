const http = require('http');
const path = require('path');
const fs = require('fs');

const host = '127.0.0.1';
const port = 18765;
const root = __dirname;
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

function send(response, status, body, type = 'text/plain; charset=utf-8') {
  response.writeHead(status, {'Content-Type': type, 'Cache-Control': 'no-store'});
  response.end(body);
}

async function proxyEpg(requestUrl, response) {
  const targetValue = requestUrl.searchParams.get('url');
  if (!targetValue) {
    send(response, 400, 'Nedostaje URL EPG liste.');
    return;
  }

  let target;
  try {
    target = new URL(targetValue);
  } catch {
    send(response, 400, 'URL EPG liste nije ispravan.');
    return;
  }

  if (!['http:', 'https:'].includes(target.protocol)) {
    send(response, 400, 'Dozvoljeni su samo HTTP i HTTPS URL-ovi.');
    return;
  }

  try {
    const upstream = await fetch(target, {
      redirect: 'follow',
      headers: {'User-Agent': 'EPG-Checker/1.0', 'Accept': '*/*'}
    });
    if (!upstream.ok) {
      send(response, upstream.status, `EPG server je vratio grešku ${upstream.status}.`);
      return;
    }

    const data = Buffer.from(await upstream.arrayBuffer());
    response.writeHead(200, {
      'Content-Type': upstream.headers.get('content-type') || 'application/octet-stream',
      'Content-Length': data.length,
      'Cache-Control': 'no-store'
    });
    response.end(data);
  } catch (error) {
    send(response, 502, `Preuzimanje EPG liste nije uspjelo: ${error.message}`);
  }
}

function serveFile(requestUrl, response) {
  const relativePath = decodeURIComponent(requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname);
  const filePath = path.resolve(root, `.${relativePath}`);
  if (!filePath.startsWith(`${root}${path.sep}`)) {
    send(response, 403, 'Pristup nije dozvoljen.');
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(response, error.code === 'ENOENT' ? 404 : 500, 'Fajl nije pronađen.');
      return;
    }
    send(response, 200, data, mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream');
  });
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, `http://${host}:${port}`);
  if (requestUrl.pathname === '/api/health') {
    send(response, 200, 'EPG-CHECKER-OK');
    return;
  }
  if (requestUrl.pathname === '/api/proxy') {
    proxyEpg(requestUrl, response);
    return;
  }
  serveFile(requestUrl, response);
});

server.on('error', error => {
  console.error(`EPG Checker server nije pokrenut: ${error.message}`);
  process.exitCode = 1;
});

server.listen(port, host, () => {
  console.log(`EPG Checker radi na http://${host}:${port}`);
});
