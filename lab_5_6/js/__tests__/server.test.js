/* сервер.тест.джс
 * npm i -D jest supertest ws
 * сервер.js має експортувати server: module.exports = server;
 * запуск: npx jest сервер.тест.джс
 */
const supertest = require('supertest');
const WebSocket = require('ws');


const PORT = 8080;
let request;

beforeAll(() => {
  require('../server');               // піднімає сервер і WS на 8080
  request = supertest('http://localhost:' + PORT);
});

afterAll(done => {
  // server експортований з server.js
  require('../server').close(done);
});

describe('HTTP статичні файли', () => {
  test('GET / повертає index.html', async () => {
    const res = await request.get('/');
    expect(res.status).toBe(200);
    expect(res.type).toMatch(/html/);
  });

  test('GET /none дає 404', async () => {
    const res = await request.get('/none');
    expect(res.status).toBe(404);
  });
});

describe('WebSocket трансляція', () => {
  test('повідомлення ретранслюється іншим клієнтам', done => {
    const a = new WebSocket('ws://localhost:' + PORT);
    const b = new WebSocket('ws://localhost:' + PORT);
    const payload = JSON.stringify({ ping: 1 });

    b.on('message', m => {
      expect(m.toString()).toBe(payload);
      a.close(); b.close(); done();
    });
    a.on('open', () => a.send(payload));
  });
});
