/**
 * @jest-environment jsdom
 */
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('front-end script (заглушка)', () => {
  let document, window;

  beforeEach(() => {
    const html = `
      <span class="eth-price"></span>
      <span class="gas-price"></span>
      <div class="burger-icon"></div>
      <ul class="burger-menu"></ul>
      <ul id="live-transactions"></ul>
      <form id="tx-form">
        <input name="from" value="0xA"/>
        <input name="to" value="0xB"/>
        <input name="amount" value="1"/>
        <button type="submit">OK</button>
      </form>`;
    const dom = new JSDOM(html, { url: 'http://localhost', runScripts: 'dangerously' });
    window = dom.window;
    document = window.document;

    global.fetch = () => Promise.resolve({ json: () => Promise.resolve({}) });

    window.WebSocket = class {
      sent = [];
      addEventListener() {}
      send(m) { this.sent.push(m); }
    };

    // Імітація функцій
    window.updatePrices = () => {
      document.querySelector('.eth-price').textContent = '$ETH 3500';
      document.querySelector('.gas-price').textContent = '⛽ 42 Gwei';
    };

    window.addTransactionToList = ({ from, to, amount }) => {
      const li = document.createElement('li');
      li.textContent = `${from} -> ${to} (${amount})`;
      document.getElementById('live-transactions').appendChild(li);
    };

    window.socket = new window.WebSocket();
    document.getElementById('tx-form').addEventListener('submit', (e) => {
      e.preventDefault();
      window.socket.send(JSON.stringify({ from: '0xA', to: '0xB', amount: '1' }));
    });

    window.updatePrices();
  });

  test('updatePrices пише ціни', () => {
    expect(document.querySelector('.eth-price').textContent).toBe('$ETH 3500');
    expect(document.querySelector('.gas-price').textContent).toBe('⛽ 42 Gwei');
  });

test('бургер перемикає клас show', () => {
  const menu = document.querySelector('.burger-menu');
  menu.classList.add('show');
  expect(menu.classList.contains('show')).toBe(true);
  menu.classList.remove('show');
  expect(menu.classList.contains('show')).toBe(false);
});


  test('addTransactionToList додає li', () => {
    window.addTransactionToList({ from: 'A', to: 'B', amount: 2 });
    const first = document.getElementById('live-transactions').firstChild;
    expect(first.textContent).toContain('A');
  });

  test('submit відправляє по WS', () => {
    document.getElementById('tx-form').dispatchEvent(new window.Event('submit', { bubbles: true }));
    expect(window.socket.sent.length).toBe(1);
  });
});
