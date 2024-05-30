import 'regenerator-runtime'; 
import '../styles/main.scss';
import { openDB } from 'idb';
import './CustomFooter';
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

class FavoriteRestaurants extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    async render() {
        try {
            const db = await openDB('restaurant-favorites', 1);

            const restaurants = await db.getAll('restaurants');

            this.innerHTML = `
                <h1 class="favorite-h1">Favorite Restaurants</h1>
                <div id="favorite-restaurants" class="restaurant-list"></div>
            `;
            const favoriteRestaurantsList = this.querySelector('#favorite-restaurants');
            restaurants.forEach(restaurant => {
                favoriteRestaurantsList.querySelectorAll('.remove-from-favorite').forEach(button => {
                    button.addEventListener('click', async () => {
                        const restaurantId = button.getAttribute('data-restaurant-id');
                        await this.removeFromFavorites(restaurantId);
                        await this.render();
                    });
                });
                
                const truncatedDescription = restaurant.description.length > 100 ? restaurant.description.substring(0, 100) + '...' : restaurant.description;

                const stars = this.ratingToStars(restaurant.rating);
            
                const restaurantItem = `
                    <div class="restaurant-item">
                        <img src="https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}" alt="${restaurant.name}" width="250">
                        <h2><a href="detailrestaurant.html?id=${restaurant.id}" class="restaurant-name">${restaurant.name}</a></h2>
                        <p>City: ${restaurant.city}</p>
                        <p>Rating: ${stars}</p>
                        <p>Description: ${truncatedDescription}</p>
                    </div>
                `;

                favoriteRestaurantsList.insertAdjacentHTML('beforeend', restaurantItem);
            });
        } catch (error) {
            console.error('Error displaying favorite restaurants:', error);
        }
    }


    ratingToStars(rating) {
        const fullStars = Math.floor(rating);
        const emptyStars = 5 - fullStars;
        const stars = '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
        return stars;
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
customElements.define('favorite-restaurants', FavoriteRestaurants);
