// ЛПЗ 12: Работа с localStorage для хранения массива объектов (корзина)

const cart = [
  { name: "Ноутбук", price: 45000, quantity: 1 },
  { name: "Мышь", price: 1200, quantity: 2 },
  { name: "Клавиатура", price: 2800, quantity: 1 }
];

// 1) Сохраняем массив в localStorage под ключом "cart"
function saveCart(items) {
  localStorage.setItem("cart", JSON.stringify(items));
}

// 2) Читаем массив из localStorage
function loadCart() {
  const data = localStorage.getItem("cart");
  return data ? JSON.parse(data) : [];
}

// 3) Считаем общую сумму всех товаров и выводим в консоль
function printCartTotal() {
  const items = loadCart();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  console.log(`Общая сумма корзины: ${total} ₽`);
  return total;
}

// Пример запуска
saveCart(cart);
printCartTotal();
