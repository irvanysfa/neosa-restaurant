import 'regenerator-runtime';
import '../styles/main.scss';
import { saveRestaurantToDB, removeRestaurantFromDB, isRestaurantFavoriteInDB } from './db';
import './CustomFooter';
import './CustomGallery';
import './CustomNavbar';

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
            try {
                const response = await fetch(`https://restaurant-api.dicoding.dev/detail/${this.restaurantId}`);
                const data = await response.json();
                if (data.error) {
                    console.error(data.message);
                } else {
                    const restaurant = data.restaurant;
                    const isFavorite = await isRestaurantFavoriteInDB(this.restaurantId);
                    this.displayRestaurantDetail(restaurant, isFavorite);
                    this.addSaveRestaurantListener();
                    this.addReviewFormListener();
                }
            } catch (error) {
                console.error('Error fetching restaurant detail:', error);
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
                await saveRestaurantToDB(data.restaurant);
                this.displayRestaurantDetail(data.restaurant);
            }
        } catch (error) {
            console.error('Error fetching restaurant detail:', error);
        }
    }

    displayRestaurantDetail(restaurant, isFavorite) {
        this.innerHTML = `
        <div class="detail-h1"><h1>Detail Restaurant</h1> </div>
        <div class="restaurant-detail">
                <div class="restaurant-detail-left">
                    <h1 id="restaurant-name">${restaurant.name}</h1>
                    <div class="restaurant-detail-image">
                    <img class="img-detail" src="https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}" alt="${restaurant.name}">
                    </div>
                    <p id="restaurant-description">${restaurant.description}</p>
                    <p id="restaurant-city">City: ${restaurant.city}</p>
                    <p id="restaurant-address">Address: ${restaurant.address}</p>
                    <p id="restaurant-rating">Rating: ${this.ratingToStars(restaurant.rating)}</p>
                <div class="detail-categories">
                <p id="restaurant-categories">Categories: </p>
                </div>
                <button id="save-restaurant-button" aria-label="Save Restaurant">${isFavorite ? 'Hapus dari Favorit' : 'Tambah ke favorit'} <i class="ph ph-heart"></i></button>
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
                <div id="review-alert-modal" class="modal" role="alert" style="display: none;">
                    <div class="modal-content">
                        <p id="review-alert-message"></p>
                        <button id="review-alert-ok-button">OK</button>
                    </div>
                </div>
                <form id="add-review-form">
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name" ><br>
                    <label for="review">Review :</label>
                    <textarea id="review" name="review" ></textarea>
                    <button type="submit">Submit</button>
                </form>
                </div>
                </div>
            </div>
        `;

        const categoriesList = this.querySelector('#restaurant-categories');
        restaurant.categories.forEach((category, index) => {
            const listItem = document.createElement('span');
            listItem.textContent = category.name;
            categoriesList.appendChild(listItem);
            if (index < restaurant.categories.length - 1) {
                const comma = document.createElement('span');
                comma.textContent = ', ';
                categoriesList.appendChild(comma);
            }
        });

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

    addSaveRestaurantListener() {
        const saveButton = this.querySelector('#save-restaurant-button');
        if (saveButton) {
            saveButton.addEventListener('click', async () => {
                const isFavorite = await this.isRestaurantFavorite();
                if (isFavorite) {
                    await this.removeFromFavorites();
                    saveButton.textContent = 'Tambah ke Favorit';
                    saveButton.style.backgroundColor = '';
                    window.alert('Restaurant removed from favorites successfully!');
                } else {
                    await this.saveRestaurant();
                    saveButton.textContent = 'Hapus dari Favorit';
                    saveButton.style.backgroundColor = 'red';
                    window.alert('Restaurant added to favorites successfully!');
                }
            });
        } else {
            console.error('Save button not found.');
        }
    }

    addReviewFormListener() {
        const reviewForm = this.querySelector('#add-review-form');
        const reviewAlertModal = this.querySelector('#review-alert-modal');
        const reviewAlertMessage = this.querySelector('#review-alert-message');
        const reviewAlertOkButton = this.querySelector('#review-alert-ok-button');

        if (reviewForm) {
            reviewForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const nameInput = this.querySelector('#name');
                const reviewInput = this.querySelector('#review');
                const name = nameInput.value.trim();
                const review = reviewInput.value.trim();
                if (name && review) {
                    await this.addReview({ name, review });
                    nameInput.value = '';
                    reviewInput.value = '';
                } else {
                    reviewAlertMessage.textContent = 'Name and review are required.';
                    reviewAlertModal.style.display = 'block';
                }
            });

            reviewAlertOkButton.addEventListener('click', () => {
                reviewAlertModal.style.display = 'none';
            });
        } else {
            console.error('Review form not found.');
        }
    }

    async addReview(review) {
        const url = 'https://restaurant-api.dicoding.dev/review';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: this.restaurantId,
                    name: review.name,
                    review: review.review
                })
            });
            const data = await response.json();
            if (!data.error) {
                console.log('Review added successfully:', data.customerReviews);
                this.updateReviews(data.customerReviews);
                window.alert('Review added successfully!');
            } else {
                console.error('Error adding review:', data.message);
                window.alert('Error adding review. Please try again later.');
            }
        } catch (error) {
            console.error('Error adding review:', error);
            window.alert('Error adding review. Please try again later.');
        }
    }

    updateReviews(reviews) {
        const reviewsList = this.querySelector('#customer-reviews');
        reviewsList.innerHTML = '';
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

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}

customElements.define('restaurant-detail', RestaurantDetail);
