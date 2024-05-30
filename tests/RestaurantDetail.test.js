import { openDB } from 'idb';
import { saveRestaurantToDB, removeRestaurantFromDB, isRestaurantFavoriteInDB } from '../src/scripts/db';

describe("Favorites Functionality", () => {
  // Membersihkan dan menyiapkan database sebelum setiap pengujian
  beforeEach(async () => {
    // Hapus database untuk memastikan pengujian dimulai dari keadaan bersih
    await indexedDB.deleteDatabase('restaurant-favorites');
    // Buka database dan buat toko objek jika belum ada
    const db = await openDB('restaurant-favorites', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('restaurants')) {
          db.createObjectStore('restaurants', { keyPath: 'id' });
        }
      }
    });
    // Membersihkan toko objek
    const tx = db.transaction('restaurants', 'readwrite');
    const store = tx.objectStore('restaurants');
    await store.clear(); // Membersihkan semua data dalam toko objek 'restaurants'
    await tx.done;
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
