const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3012;

http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  let targetFile = urlPath;
  if (urlPath === '/' || urlPath === '/index.html') {
    targetFile = '/index.html';
  }
  let filePath = path.join(__dirname, targetFile);
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('File not found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Server Error: ' + err.code);
      }
    } else {
      let ext = path.extname(filePath);
      let contentType = 'text/html; charset=utf-8';
      if (ext === '.js' || ext === '.gs') contentType = 'text/javascript; charset=utf-8';
      else if (ext === '.css') contentType = 'text/css; charset=utf-8';
      else if (ext === '.json') contentType = 'application/json; charset=utf-8';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.svg') contentType = 'image/svg+xml';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
}).listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  ⚡ Unit 2: Phase-Controlled Rectifiers Lab is running!`);
  console.log(`  Local URL: http://localhost:${PORT}/`);
  console.log(`======================================================\n`);
});
