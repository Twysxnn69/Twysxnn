import { getCart, saveCart, clearCart } from './storage.js';

function findItem(cart, gameId) {
  return cart.find((item) => item.gameId === gameId);
}

export function addToCart(game) {
  const cart = getCart();
  const existing = findItem(cart, game.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ gameId: game.id, qty: 1, price: game.price, title: game.title, cover: game.cover });
  }

  saveCart(cart);
  return cart;
}

export function updateQty(gameId, delta) {
  const cart = getCart();
  const item = findItem(cart, gameId);
  if (!item) return cart;

  item.qty += delta;
  if (item.qty <= 0) {
    const next = cart.filter((entry) => entry.gameId !== gameId);
    saveCart(next);
    return next;
  }

  saveCart(cart);
  return cart;
}

export function removeFromCart(gameId) {
  const next = getCart().filter((item) => item.gameId !== gameId);
  saveCart(next);
  return next;
}

export function countItems(cart = getCart()) {
  return cart.reduce((acc, item) => acc + item.qty, 0);
}

export function cartTotal(cart = getCart()) {
  return cart.reduce((acc, item) => acc + item.price * item.qty, 0);
}

export function checkout() {
  clearCart();
}
