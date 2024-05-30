import * as idb from 'idb';
import { openDB } from 'idb';
async function openDatabase() {
    return openDB('restaurant-favorites', 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('restaurants')) {
                db.createObjectStore('restaurants', { keyPath: 'id' });
            }
        },
    });
}

export async function saveRestaurantToDB(restaurant) {
    const db = await openDatabase();
    const tx = db.transaction('restaurants', 'readwrite');
    const store = tx.objectStore('restaurants');
    await store.put(restaurant);
    await tx.done;
}

export async function removeRestaurantFromDB(restaurantId) {
    const db = await openDatabase();
    const tx = db.transaction('restaurants', 'readwrite');
    const store = tx.objectStore('restaurants');
    await store.delete(restaurantId);
    await tx.done;
}

export async function isRestaurantFavoriteInDB(restaurantId) {
    const db = await openDatabase();
    const tx = db.transaction('restaurants', 'readonly');
    const store = tx.objectStore('restaurants');
    const result = await store.get(restaurantId);
    await tx.done;
    return !!result;
}
