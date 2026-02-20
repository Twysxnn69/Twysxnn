import { fetchGames } from './api.js';
import { addToCart } from './cart.js';
import { gameCardTemplate, syncCartCounter } from './ui.js';

let gamesCache = [];

function applyFilters() {
  const query = document.querySelector('[data-search]')?.value.trim().toLowerCase() ?? '';
  const genre = document.querySelector('[data-genre]')?.value ?? 'all';

  return gamesCache.filter((game) => {
    const matchesText = game.title.toLowerCase().includes(query);
    const matchesGenre = genre === 'all' || game.genre === genre;
    return matchesText && matchesGenre;
  });
}

function renderCatalog(games) {
  const container = document.querySelector('[data-catalog-grid]');
  if (!container) return;

  if (!games.length) {
    container.innerHTML = '<p class="muted">Ничего не найдено. Попробуйте изменить фильтры.</p>';
    return;
  }

  container.innerHTML = games.map(gameCardTemplate).join('');
}

function renderGenres(games) {
  const select = document.querySelector('[data-genre]');
  if (!select) return;

  const genres = [...new Set(games.map((game) => game.genre))];
  select.innerHTML = '<option value="all">Все жанры</option>' + genres.map((genre) => `<option value="${genre}">${genre}</option>`).join('');
}

export async function initCatalogPage() {
  const root = document.querySelector('[data-catalog-page]');
  if (!root) return;

  gamesCache = await fetchGames();
  renderGenres(gamesCache);
  renderCatalog(gamesCache);

  root.addEventListener('input', (event) => {
    if (event.target.matches('[data-search]')) {
      renderCatalog(applyFilters());
    }
  });

  root.addEventListener('change', (event) => {
    if (event.target.matches('[data-genre]')) {
      renderCatalog(applyFilters());
    }
  });

  root.addEventListener('click', (event) => {
    const actionButton = event.target.closest('[data-action]');
    if (!actionButton) return;

    const id = actionButton.dataset.id;
    const game = gamesCache.find((item) => item.id === id);
    if (!game) return;

    if (actionButton.dataset.action === 'add') {
      addToCart(game);
      syncCartCounter();
    }

    if (actionButton.dataset.action === 'open') {
      window.location.href = `game.html?id=${id}`;
    }
  });
}

export async function loadGameById(id) {
  if (!gamesCache.length) {
    gamesCache = await fetchGames();
  }
  return gamesCache.find((game) => game.id === id);
}

export async function loadFeatured(limit = 4) {
  const games = await fetchGames();
  return games.slice(0, limit);
}
