const GAMES_URL = 'assets/data/games.json';

/**
 * Загружает каталог игр из локального JSON-файла.
 */
export async function fetchGames() {
  const response = await fetch(GAMES_URL);
  if (!response.ok) {
    throw new Error('Не удалось загрузить список игр');
  }

  return response.json();
}
