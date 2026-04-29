const fs = require('fs');
const http = require('http');
const path = require('path');

const root = path.resolve(__dirname, '..', 'dist');
const host = process.env.HABIT_TRACKER_HOST || '127.0.0.1';
const port = Number(process.env.HABIT_TRACKER_PORT || 3000);

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
};

function send(res, status, body, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': contentType,
    'Cache-Control': 'no-cache',
  });
  res.end(body);
}

function resolveRequestPath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath.split('?')[0]);
  const safePath = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/, '');
  const requestedPath = path.join(root, safePath);

  if (!requestedPath.startsWith(root)) {
    return null;
  }

  return requestedPath;
}

if (!fs.existsSync(path.join(root, 'index.html'))) {
  console.error('dist/index.html is missing. Run `npm run build:web` first.');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const requestedPath = resolveRequestPath(req.url || '/');

  if (!requestedPath) {
    send(res, 403, 'Forbidden');
    return;
  }

  let filePath = requestedPath;
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    filePath = path.join(root, 'index.html');
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(res, 500, 'Unable to read file');
      return;
    }

    const contentType = mimeTypes[path.extname(filePath)] || 'application/octet-stream';
    send(res, 200, data, contentType);
  });
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`Habit Tracker appears to already be running at http://${host}:${port}/`);
    process.exit(0);
  }

  console.error(error);
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(`Habit Tracker is running at http://${host}:${port}/`);
});
