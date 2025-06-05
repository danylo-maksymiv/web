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

