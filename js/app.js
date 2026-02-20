import { initCatalogPage, loadFeatured, loadGameById } from './modules/catalog.js';
import { addToCart, cartTotal, checkout, removeFromCart, updateQty } from './modules/cart.js';
import { getCart } from './modules/storage.js';
import { formatPrice, gameCardTemplate, renderLayout, setText, syncCartCounter, toggleModal } from './modules/ui.js';

async function initHomePage() {
  const list = document.querySelector('[data-featured]');
  if (!list) return;
  const games = await loadFeatured(4);
  list.innerHTML = games.map(gameCardTemplate).join('');

  list.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-action]');
    if (!btn) return;

    const game = games.find((item) => item.id === btn.dataset.id);
    if (!game) return;

    if (btn.dataset.action === 'add') {
      addToCart(game);
      syncCartCounter();
    }

    if (btn.dataset.action === 'open') {
      window.location.href = `game.html?id=${game.id}`;
    }
  });
}

async function initGamePage() {
  const container = document.querySelector('[data-game-page]');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    container.innerHTML = '<p class="muted">Игра не найдена.</p>';
    return;
  }

  const game = await loadGameById(id);
  if (!game) {
    container.innerHTML = '<p class="muted">Игра не найдена.</p>';
    return;
  }

  container.innerHTML = `
    <div class="detail-layout">
      <div class="panel">
        <img src="${game.cover}" alt="${game.title}">
        <p class="muted">${game.description}</p>
      </div>
      <div class="panel">
        <h1>${game.title}</h1>
        <p class="muted">Жанр: ${game.genre}</p>
        <p class="muted">Рейтинг: ★ ${game.rating}</p>
        <p class="price">${formatPrice(game.price)}</p>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn btn-primary" data-action="add">В корзину</button>
          <button class="btn btn-outline" data-action="buy">Купить сейчас</button>
        </div>
      </div>
    </div>
  `;

  container.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-action]');
    if (!btn) return;

    if (btn.dataset.action === 'add') {
      addToCart(game);
      syncCartCounter();
    }

    if (btn.dataset.action === 'buy') {
      toggleModal(true);
    }
  });
}

function cartItemTemplate(item) {
  return `
    <li class="cart-item" data-id="${item.gameId}">
      <img src="${item.cover}" alt="${item.title}">
      <div>
        <h3>${item.title}</h3>
        <p class="muted">${formatPrice(item.price)} за копию</p>
      </div>
      <div>
        <div class="cart-item__controls">
          <button class="btn btn-outline" data-action="decrease">-</button>
          <strong>${item.qty}</strong>
          <button class="btn btn-outline" data-action="increase">+</button>
        </div>
        <p><strong>${formatPrice(item.price * item.qty)}</strong></p>
        <button class="btn btn-outline" data-action="remove">Удалить</button>
      </div>
    </li>
  `;
}

function renderCart() {
  const list = document.querySelector('[data-cart-list]');
  if (!list) return;

  const cart = getCart();
  if (!cart.length) {
    list.innerHTML = '<p class="muted">Корзина пуста. Перейдите в каталог и добавьте игры.</p>';
  } else {
    list.innerHTML = cart.map(cartItemTemplate).join('');
  }

  setText('[data-cart-total]', formatPrice(cartTotal(cart)));
  syncCartCounter();
}

function initCartPage() {
  const root = document.querySelector('[data-cart-page]');
  if (!root) return;

  renderCart();

  root.addEventListener('click', (event) => {
    const item = event.target.closest('[data-id]');
    const btn = event.target.closest('[data-action]');
    if (!item || !btn) return;

    const id = item.dataset.id;
    if (btn.dataset.action === 'increase') updateQty(id, 1);
    if (btn.dataset.action === 'decrease') updateQty(id, -1);
    if (btn.dataset.action === 'remove') removeFromCart(id);

    renderCart();
  });

  document.querySelector('[data-open-checkout]')?.addEventListener('click', () => {
    if (getCart().length) toggleModal(true);
  });
}

function initModal() {
  const modal = document.querySelector('[data-modal]');
  if (!modal) return;

  modal.addEventListener('click', (event) => {
    if (event.target.matches('[data-close-modal]') || event.target === modal) {
      toggleModal(false);
    }

    if (event.target.matches('[data-confirm-buy]')) {
      checkout();
      toggleModal(false);
      renderCart();
      syncCartCounter();
      alert('Покупка успешно завершена! Игры добавлены в библиотеку.');
    }
  });
}

function initProfilePage() {
  const root = document.querySelector('[data-profile-page]');
  if (!root) return;
  const owned = 17 + getCart().length;
  setText('[data-owned-games]', String(owned));
}

async function bootstrap() {
  const active = document.body.dataset.page || 'index.html';
  renderLayout(active);
  initModal();
  await initHomePage();
  await initCatalogPage();
  await initGamePage();
  initCartPage();
  initProfilePage();
}

bootstrap();
