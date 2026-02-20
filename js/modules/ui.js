import { countItems } from './cart.js';
import { getCart } from './storage.js';

export function renderLayout(activePath) {
  const header = document.querySelector('[data-header]');
  const footer = document.querySelector('[data-footer]');

  if (header) {
    header.innerHTML = `
      <div class="container topbar">
        <a href="index.html" class="brand">
          <span class="brand-mark" aria-hidden="true"></span>
          <span>NOVA PLAY</span>
        </a>
        <nav aria-label="Основная навигация">
          <ul class="nav-list">
            ${link('index.html', 'Главная', activePath)}
            ${link('catalog.html', 'Каталог', activePath)}
            ${link('cart.html', 'Корзина', activePath, `<span class="cart-counter" data-cart-counter>0</span>`)}
            ${link('profile.html', 'Профиль', activePath)}
          </ul>
        </nav>
      </div>
    `;
  }

  if (footer) {
    footer.innerHTML = '<div class="container">© 2026 NOVA PLAY. Цифровой магазин игр.</div>';
  }

  syncCartCounter();
}

function link(path, text, activePath, extra = '') {
  const activeClass = activePath === path ? 'is-active' : '';
  return `<li><a class="nav-link ${activeClass}" href="${path}">${text}${extra}</a></li>`;
}

export function syncCartCounter() {
  document.querySelectorAll('[data-cart-counter]').forEach((badge) => {
    badge.textContent = String(countItems(getCart()));
  });
}

export function gameCardTemplate(game) {
  return `
    <article class="game-card">
      <img class="game-card__media" src="${game.cover}" alt="${game.title}" loading="lazy" />
      <div class="game-card__body">
        <h3>${game.title}</h3>
        <div class="game-meta">
          <span>${game.genre}</span>
          <span>★ ${game.rating}</span>
        </div>
        <div class="game-actions">
          <span class="price">${formatPrice(game.price)}</span>
          <div>
            <button class="btn btn-outline" data-action="open" data-id="${game.id}">Подробнее</button>
            <button class="btn btn-primary" data-action="add" data-id="${game.id}">В корзину</button>
          </div>
        </div>
      </div>
    </article>
  `;
}

export function formatPrice(value) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value);
}

export function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = value;
}

export function toggleModal(isOpen) {
  const modal = document.querySelector('[data-modal]');
  if (!modal) return;
  modal.classList.toggle('is-open', isOpen);
}
