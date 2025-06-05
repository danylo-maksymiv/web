const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const ROOT = path.join(__dirname, '..');

http.createServer((req, res) => {
  let urlPath = req.url === '/' ? '/pages/index.html' : req.url;
  let filePath = path.join(ROOT, urlPath);

  // Якщо шлях веде на директорію — додаємо index.html
  if (!path.extname(filePath)) {
    filePath = path.join(filePath, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const mime = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp'
  };
  const contentType = mime[ext] || 'text/plain';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      fs.readFile(path.join(ROOT, 'pages', 'error.html'), (_err, errorPage) => {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(errorPage || '<h1>404 Not Found</h1>');
      });
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
}).listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});
