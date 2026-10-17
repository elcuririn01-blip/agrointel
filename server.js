const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const APP_DIR = path.join(__dirname, 'agrointel-app', 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2'
};

function serveFile(filePath, res, fallbackHtml = null) {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      if (fallbackHtml && fs.existsSync(fallbackHtml)) {
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=UTF-8',
          'Cache-Control': 'no-cache'
        });
        fs.createReadStream(fallbackHtml).pipe(res);
        return;
      }
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('404 Não Encontrado');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);

  // 1. Unified AgroIntel PRO Web Application (/app or /app/*)
  if (reqPath === '/app' || reqPath === '/app/' || reqPath.startsWith('/app/')) {
    let subPath = reqPath.slice(4); // Remove leading '/app'
    if (subPath === '' || subPath === '/') {
      return serveFile(path.join(APP_DIR, 'index.html'), res);
    }

    const safeSubPath = path.normalize(subPath).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(APP_DIR, safeSubPath);

    const KNOWN_ASSET_EXTS = new Set([
      '.js', '.css', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.ico', '.woff', '.woff2', '.json', '.map'
    ]);

    const ext = path.extname(filePath).toLowerCase();

    // If it's a known static asset (e.g. .js, .css under /app/assets)
    if (KNOWN_ASSET_EXTS.has(ext)) {
      return serveFile(filePath, res);
    }

    // Otherwise, route as SPA (React Router client-side routing for /app/skills/01.01, etc.)
    return serveFile(filePath, res, path.join(APP_DIR, 'index.html'));
  }

  // 2. Public Sales Landing Page (/) and global assets
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);

  serveFile(filePath, res);
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` AgroIntel PRO Unificado no mesmo site!`);
  console.log(` Porta: http://localhost:${PORT}/`);
  console.log(` - Página de Vendas (Front):  http://localhost:${PORT}/`);
  console.log(` - Aplicativo Web (Sistema): http://localhost:${PORT}/app`);
  console.log(`=======================================================`);
});
