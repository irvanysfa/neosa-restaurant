import { openDB } from 'idb';
import { saveRestaurantToDB, removeRestaurantFromDB, isRestaurantFavoriteInDB } from '../src/scripts/db';

describe("Favorites Functionality", () => {
  let db;

  beforeEach(async () => {
    db = await openDB('restaurant-favorites', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('restaurants')) {
          db.createObjectStore('restaurants', { keyPath: 'id' });
        }
      }
    });
  });

  afterEach(async () => {
    // Tutup koneksi database setelah setiap pengujian selesai
    db.close();
  });

  test("Add to Favorites", async () => {
    const restaurantDetail = { id: "1", name: "Restaurant A" };
    await saveRestaurantToDB(restaurantDetail);
    const isFavorite = await isRestaurantFavoriteInDB(restaurantDetail.id);
    expect(isFavorite).toBe(true); // Memastikan restoran ditambahkan ke favorit
  });

  test("Remove from Favorites", async () => {
    const restaurantDetail = { id: "1", name: "Restaurant A" };
    await saveRestaurantToDB(restaurantDetail); // Menambahkan restoran ke favorit
    await removeRestaurantFromDB(restaurantDetail.id);
    const isFavorite = await isRestaurantFavoriteInDB(restaurantDetail.id);
    expect(isFavorite).toBe(false); // Memastikan restoran dihapus dari favorit
  });
});
