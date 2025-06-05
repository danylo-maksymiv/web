const ethPriceEl = document.querySelector('.eth-price');
const gasPriceEl = document.querySelector('.gas-price');

async function updatePrices() {
  try {
    // ETH price (без CORS)
    const ethRes = await fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD');
    const ethData = await ethRes.json();
    if (ethPriceEl) ethPriceEl.textContent = `$ETH ${ethData.USD}`;

    // Gas price (Etherscan)
    const gasRes = await fetch('https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=A5XMJUKGJF5RQPFQEBQQB7N1QM3H1PHEMP');
    const gasData = await gasRes.json();
    if (gasPriceEl) gasPriceEl.textContent = `⛽ ${gasData.result.ProposeGasPrice} Gwei`;
  } catch (err) {
    console.error('Помилка при отриманні цін:', err);
  }
}

updatePrices();
setInterval(updatePrices, 10000);

document.addEventListener('DOMContentLoaded', () => {
  const burgerIcon = document.querySelector('.burger-icon');
  const burgerMenu = document.querySelector('.burger-menu');

  if (burgerIcon && burgerMenu) {
    burgerIcon.addEventListener('click', () => {
      burgerMenu.classList.toggle('show');
    });

    // При кліку поза меню — ховаємо
    document.addEventListener('click', (e) => {
      if (!burgerIcon.contains(e.target) && !burgerMenu.contains(e.target)) {
        burgerMenu.classList.remove('show');
      }
    });
  }
});



const socket = new WebSocket('ws://localhost:8080');

socket.addEventListener('open', () => {
  console.log('Підключено до WebSocket');
});

socket.addEventListener('message', (event) => {
  const tx = JSON.parse(event.data);
  addTransactionToList(tx);
});

function addTransactionToList(tx) {
  const list = document.getElementById('live-transactions');
  if (!list) return;

  const el = document.createElement('li');
  el.innerHTML = `
    <strong>Від:</strong> ${tx.from} <strong>→</strong> ${tx.to}<br>
    <strong>Сума:</strong> ${tx.amount} ETH <br>
    <strong>Час:</strong> ${new Date().toLocaleTimeString()}
  `;
  list.prepend(el);
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('tx-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const from = form.elements['from'].value;
      const to = form.elements['to'].value;
      const amount = form.elements['amount'].value;

      const tx = { from, to, amount };
      socket.send(JSON.stringify(tx));
      form.reset();
    });
  }
});

