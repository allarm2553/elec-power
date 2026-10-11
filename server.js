const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8082;

// Sub-path routing mapping for all 7 Power Electronics Learning Apps (Course 30105-2019)
const ROUTE_MAP = [
  // Direct folder routes (Capitalized matching disk)
  { prefix: '/Unit1', dir: 'Unit1', defaultFile: 'index.html' },
  { prefix: '/Unit2', dir: 'Unit2', defaultFile: 'index.html' },
  { prefix: '/Unit3', dir: 'Unit3', defaultFile: 'index.html' },
  { prefix: '/Unit4', dir: 'Unit4', defaultFile: 'index.html' },
  { prefix: '/Unit5', dir: 'Unit5', defaultFile: 'index.html' },
  { prefix: '/Unit6', dir: 'Unit6', defaultFile: 'index.html' },
  { prefix: '/Unit7', dir: 'Unit7', defaultFile: 'index.html' },

  // Lowercase compatibility routes
  { prefix: '/unit1', dir: 'Unit1', defaultFile: 'index.html' },
  { prefix: '/unit2', dir: 'Unit2', defaultFile: 'index.html' },
  { prefix: '/unit3', dir: 'Unit3', defaultFile: 'index.html' },
  { prefix: '/unit4', dir: 'Unit4', defaultFile: 'index.html' },
  { prefix: '/unit5', dir: 'Unit5', defaultFile: 'index.html' },
  { prefix: '/unit6', dir: 'Unit6', defaultFile: 'index.html' },
  { prefix: '/unit7', dir: 'Unit7', defaultFile: 'index.html' },

  // Friendly aliases
  { prefix: '/switching', dir: 'Unit1', defaultFile: 'index.html' },
  { prefix: '/rectifier', dir: 'Unit2', defaultFile: 'index.html' },
  { prefix: '/converter', dir: 'Unit3', defaultFile: 'index.html' },
  { prefix: '/inverter', dir: 'Unit4', defaultFile: 'index.html' },
  { prefix: '/ups', dir: 'Unit5', defaultFile: 'index.html' },
  { prefix: '/motor-drive', dir: 'Unit6', defaultFile: 'index.html' },
  { prefix: '/vfd', dir: 'Unit6', defaultFile: 'index.html' },
  { prefix: '/safety', dir: 'Unit7', defaultFile: 'index.html' },
  { prefix: '/industrial', dir: 'Unit7', defaultFile: 'index.html' }
];

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.csv': 'text/csv; charset=utf-8',
  '.gs': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(urlObj.pathname);

  // 1. Root Dashboard & Manual
  if (pathname === '/' || pathname === '/index.html' || pathname === '/dashboard') {
    serveStaticFile(path.join(__dirname, 'index.html'), res);
    return;
  }
  if (pathname === '/manual' || pathname === '/manual/') {
    serveStaticFile(path.join(__dirname, 'manual.html'), res);
    return;
  }

  // 2. Check for App Sub-paths
  for (const route of ROUTE_MAP) {
    if (pathname === route.prefix) {
      // Redirect to trailing slash for proper relative asset loading
      res.writeHead(302, { 'Location': route.prefix + '/' + (urlObj.search || '') });
      res.end();
      return;
    }

    if (pathname.startsWith(route.prefix + '/')) {
      let subPath = pathname.substring(route.prefix.length);
      if (subPath === '/' || subPath === '') {
        subPath = '/' + route.defaultFile;
      }
      const targetFile = path.join(__dirname, route.dir, subPath);
      serveStaticFile(targetFile, res);
      return;
    }
  }

  // 3. Fallback to Root Directory Static File
  const rootTargetFile = path.join(__dirname, pathname);
  serveStaticFile(rootTargetFile, res);
});

function serveStaticFile(filePath, res) {
  const safePath = path.resolve(filePath);
  if (!safePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden: Access Denied');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html lang="th">
        <head>
          <meta charset="UTF-8">
          <title>404 Not Found — Power Electronics Portal</title>
          <style>
            body { background: #050b14; color: #f8fafc; font-family: 'Segoe UI', system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .box { text-align: center; background: rgba(15, 23, 42, 0.85); padding: 2.5rem; border-radius: 16px; border: 1px solid rgba(56, 189, 248, 0.2); box-shadow: 0 12px 36px rgba(0,0,0,0.5); max-width: 500px; }
            h1 { font-size: 3rem; color: #fb7185; margin: 0 0 1rem; font-family: monospace; }
            p { color: #94a3b8; margin-bottom: 1.5rem; font-size: 1.05rem; }
            a { display: inline-block; background: #38bdf8; color: #020617; font-weight: 700; text-decoration: none; padding: 0.75rem 1.5rem; border-radius: 10px; transition: all 0.2s; }
            a:hover { background: #7dd3fc; }
          </style>
        </head>
        <body>
          <div class="box">
            <h1>404</h1>
            <p>ไม่พบหน้าเว็บที่คุณค้นหา หรือห้องเรียนกำลังอยู่ระหว่างการจัดเตรียม</p>
            <a href="./">← กลับสู่หน้าหลัก Master Portal</a>
          </div>
        </body>
        </html>
      `);
      return;
    }

    if (stats.isDirectory()) {
      const indexPath = path.join(safePath, 'index.html');
      serveStaticFile(indexPath, res);
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });

    const stream = fs.createReadStream(safePath);
    stream.pipe(res);
  });
}

server.listen(PORT, () => {
  console.log('================================================================');
  console.log('  ⚡ Power Electronics Web Learning Lab — Master Portal');
  console.log('  📘 Course: 30105-2019 อิเล็กทรอนิกส์กำลัง (Theory 2h / Lab 3h)');
  console.log(`  🌐 Master Dashboard URL : http://localhost:${PORT}/`);
  console.log(`  🔬 Unit 1 Switching Lab  : http://localhost:${PORT}/unit1/`);
  console.log('================================================================');
});
