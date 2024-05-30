import 'regenerator-runtime'; 
import '../styles/main.scss';
import { openDB } from 'idb';

const burgerIcon = document.getElementById('burger-nav');
const menuList = document.getElementById('nav-list');

burgerIcon.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        toggleMenu();
    }
});

burgerIcon.addEventListener('click', () => {
    toggleMenu();
});

function toggleMenu() {
    const isMenuVisible = menuList.classList.contains('show-menu');

    if (isMenuVisible) {
        closeMenu();
    } else {
        openMenu();
    }
}

function openMenu() {
    menuList.classList.add('show-menu');
    menuList.classList.remove('hide-menu');

    const firstMenuItem = menuList.querySelector('a');
    if (firstMenuItem) {
        firstMenuItem.focus();
    }
}

function closeMenu() {
    menuList.classList.remove('show-menu');
    menuList.classList.add('hide-menu');
    burgerIcon.focus();
}

const menuLinks = document.querySelectorAll('.menu-list a');
menuLinks.forEach(link => {
    link.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const href = link.getAttribute('href');

            if (href && href !== '#') {
                window.location.href = href; 
            } else {
                console.log('Aksi lainnya bisa ditambahkan di sini');
            }
            closeMenu();
        }
    });
});

// Function to open IndexedDB
function openDatabase() {
    return openDB('restaurant-favorites', 1, {
        upgrade(db) {
            db.createObjectStore('restaurants', { keyPath: 'id' });
        },
    });
}

// Function to save restaurant to IndexedDB
async function saveRestaurantToDB(restaurant) {
    const db = await openDatabase();
    const tx = db.transaction('restaurants', 'readwrite');
    const store = tx.objectStore('restaurants');
    await store.put(restaurant); // Menyimpan seluruh objek restoran
    await tx.done;
    await db.close();
}

// Function to remove restaurant from IndexedDB
async function removeRestaurantFromDB(restaurantId) {
    const db = await openDatabase();
    const tx = db.transaction('restaurants', 'readwrite');
    const store = tx.objectStore('restaurants');
    await store.delete(restaurantId);
    await tx.done;
    await db.close();
}

// Function to check if restaurant is already in favorites
async function isRestaurantFavoriteInDB(restaurantId) {
    const db = await openDatabase();
    const tx = db.transaction('restaurants', 'readonly');
    const store = tx.objectStore('restaurants');
    const result = await store.get(restaurantId);
    await tx.done;
    await db.close();
    return !!result; // Convert result to boolean
}

const RestaurantDetail = class extends HTMLElement {
    constructor() {
        super();
        this.restaurantId = null;
    }

    async connectedCallback() {
        this.render();
    }

    async render() {
        const urlParams = new URLSearchParams(window.location.search);
        this.restaurantId = urlParams.get('id');
        console.log(this.restaurantId);
        if (this.restaurantId) {
            await this.loadAndSaveRestaurantDetail(this.restaurantId); // Load and save detail to IndexedDB
            this.addSaveRestaurantListener();
            this.addReviewFormListener();

            // Update save button based on favorite status
            const saveButton = this.querySelector('#save-restaurant-button');
            if (saveButton) {
                const isFavorite = await isRestaurantFavoriteInDB(this.restaurantId);
                if (isFavorite) {
                    saveButton.textContent = 'Hapus dari Favorit';
                    saveButton.style.backgroundColor = 'red';
                }
            }
        } else {
            console.error('Restaurant ID is missing.');
        }
    }

    async loadAndSaveRestaurantDetail(restaurantId) {
        try {
            const response = await fetch(`https://restaurant-api.dicoding.dev/detail/${restaurantId}`);
            const data = await response.json();
            if (data.error) {
                console.error(data.message);
            } else {
                // Simpan seluruh objek restoran ke IndexedDB
                await saveRestaurantToDB(data.restaurant);
                this.displayRestaurantDetail(data.restaurant);
            }
        } catch (error) {
            console.error('Error fetching restaurant detail:', error);
        }
    }

    displayRestaurantDetail(restaurant) {
        this.innerHTML = `
        <div class="detail-h1"><h1>Detail Restaurant</h1> </div>
        <div class="restaurant-detail">
                <div class="restaurant-detail-left">
                    <h1 id="restaurant-name">${restaurant.name}</h1>
                    <img src="https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}" alt="${restaurant.name}">
                    <p id="restaurant-description">${restaurant.description}</p>
                    <p id="restaurant-city">City: ${restaurant.city}</p>
                    <p id="restaurant-address">Address: ${restaurant.address}</p>
                    <p id="restaurant-rating">Rating: ${this.ratingToStars(restaurant.rating)}</p>
                <div class="detail-categories">
                <p id="restaurant-categories">Categories: </p>
                </div>
                <button id="save-restaurant-button" aria-label="Save Restaurant">Tambah ke favorit <i class="ph ph-heart"></i></button>
                </div>
                <div class="restaurant-detail-right">
                <div class="menus-container">
                <h2>Menus</h2>
                <div class="detail-menu-food">
                <h3>Foods</h3>
                <ul id="foods-list"></ul>
            </div>
            <div class="detail-menu-drink">
                <h3>Drinks</h3>
                <ul id="drinks-list"></ul>
            </div>
                </div>
                <div class="detail-customer-review">
                <h2>Customer Reviews</h2>
                <p>${this.ratingToStars(restaurant.rating)}</p>
                <ul id="customer-reviews"></ul>
                <div class="add-review">
                <h2>Add Review</h2>
                <form id="add-review-form">
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name" required><br>
                    <label for="review">Review :</label>
                    <textarea id="review" name="review" required></textarea>
                    <button type="submit">Submit</button>
                </form>
                </div>
                </div>
            </div>
        `;

        // Display categories
        const categoriesList = this.querySelector('#restaurant-categories');
        restaurant.categories.forEach((category, index) => {
            const listItem = document.createElement('span');
            listItem.textContent = category.name;
            categoriesList.appendChild(listItem);
            // Tambahkan koma jika bukan kategori terakhir
            if (index < restaurant.categories.length - 1) {
                const comma = document.createElement('span');
                comma.textContent = ', ';
                categoriesList.appendChild(comma);
            }
        });
        
        // Display menus
        const foodsList = this.querySelector('#foods-list');
        restaurant.menus.foods.forEach(food => {
            const listItem = document.createElement('li');
            listItem.textContent = food.name;
            foodsList.appendChild(listItem);
        });
        const drinksList = this.querySelector('#drinks-list');
        restaurant.menus.drinks.forEach(drink => {
            const listItem = document.createElement('li');
            listItem.textContent = drink.name;
            drinksList.appendChild(listItem);
        });

        // Display customer reviews
        const reviewsList = this.querySelector('#customer-reviews');
        restaurant.customerReviews.forEach(review => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong id=name-review>${review.name}</strong> <small> (${review.date})</small> <br> ${review.review}`;
            reviewsList.appendChild(listItem);
        });
    }

    ratingToStars(rating) {
        const fullStars = Math.floor(rating);
        const emptyStars = 5 - fullStars;
        const stars = '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
        return stars;
    }

    // Metode untuk menambahkan event listener pada tombol save restaurant setelah elemen dirender
    addSaveRestaurantListener() {
        // Menambahkan event listener pada tombol save restaurant setelah elemen dirender
        const saveButton = this.querySelector('#save-restaurant-button');
        if (saveButton) { // Pastikan saveButton tidak null sebelum menambahkan event listener
            saveButton.addEventListener('click', async () => {
                const isFavorite = await this.isRestaurantFavorite();
                if (isFavorite) {
                    await this.removeFromFavorites();
                    saveButton.textContent = 'Tambah ke Favorit';
                    saveButton.style.backgroundColor = ''; // Menghapus warna latar
                    window.alert('Restaurant removed from favorites successfully!');
                } else {
                    await this.saveRestaurant();
                    saveButton.textContent = 'Hapus dari Favorit';
                    saveButton.style.backgroundColor = 'red'; // Memberi warna latar merah
                    window.alert('Restaurant added to favorites successfully!');
                }
            });
        } else {
            console.error('Save button not found.');
        }
    }

    // Metode untuk menambahkan event listener pada form review
    addReviewFormListener() {
        const reviewForm = this.querySelector('#add-review-form');
        if (reviewForm) {
            reviewForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const nameInput = this.querySelector('#name');
                const reviewInput = this.querySelector('#review');
                const name = nameInput.value.trim();
                const review = reviewInput.value.trim();
                if (name && review) {
                    await this.addReview({ name, review }); // Panggil metode untuk menambahkan review
                    nameInput.value = ''; // Bersihkan input setelah review ditambahkan
                    reviewInput.value = ''; // Bersihkan input setelah review ditambahkan
                } else {
                    console.error('Name and review are required.');
                }
            });
        } else {
            console.error('Review form not found.');
        }
    }

    // Metode untuk menambahkan review ke restoran
    async addReview(review) {
        const url = 'https://restaurant-api.dicoding.dev/review';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: this.restaurantId, // Gunakan restaurantId yang telah diinisialisasi
                    name: review.name,
                    review: review.review
                })
            });
            const data = await response.json();
            if (!data.error) {
                console.log('Review added successfully:', data.customerReviews);
                this.updateReviews(data.customerReviews);
            } else {
                console.error('Error adding review:', data.message);
            }
        } catch (error) {
            console.error('Error adding review:', error);
        }
    }

    // Metode untuk memperbarui tampilan dengan ulasan baru
    updateReviews(reviews) {
        const reviewsList = this.querySelector('#customer-reviews');
        reviewsList.innerHTML = ''; // Kosongkan ulasan yang sudah ada
        reviews.forEach(review => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong id=name-review>${review.name}</strong> <small> (${review.date})</small> <br> ${review.review}`;
            reviewsList.appendChild(listItem);
        });
    }

    async isRestaurantFavorite() {
        const isFavorite = await isRestaurantFavoriteInDB(this.restaurantId);
        return isFavorite;
    }

    async saveRestaurant() {
        const isFavorite = await this.isRestaurantFavorite();
        if (!isFavorite) {
            // Simpan seluruh objek restoran ke IndexedDB
            const response = await fetch(`https://restaurant-api.dicoding.dev/detail/${this.restaurantId}`);
            const data = await response.json();
            if (!data.error) {
                await saveRestaurantToDB(data.restaurant);
            }
        }
    }

    async removeFromFavorites() {
        await removeRestaurantFromDB(this.restaurantId);
    }
}

customElements.define('restaurant-detail', RestaurantDetail);
