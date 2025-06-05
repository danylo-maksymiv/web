const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const PORT = 8080;
const ROOT = path.join(__dirname, '..');

// HTTP сервер для файлів
const server = http.createServer((req, res) => {
  let urlPath = req.url === '/' ? '/pages/index.html' : req.url;
  let filePath = path.join(ROOT, urlPath);

  // Додаємо index.html якщо це директорія
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
});

// WebSocket сервер
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Клієнт підключився');

  ws.on('message', (msg) => {
    // Розсилаємо повідомлення всім підключеним
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg.toString());
      }
    });
  });

  ws.on('close', () => {
    console.log('Клієнт відключився');
  });
});

server.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});
module.exports = server;
