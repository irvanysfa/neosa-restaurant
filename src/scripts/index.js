import 'regenerator-runtime'; 
import '../styles/main.scss';
import './CustomFooter';
import './CustomGallery';
import './CustomNavbar';
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange'; 

function ratingToStars(rating) {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    
    const stars = '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
    return stars;
}

setTimeout(function () {
    document.body.classList.remove("loading");
}, 3000); 

// Function to fetch restaurant data from API
async function fetchRestaurants() {
    try {
        const response = await fetch('https://restaurant-api.dicoding.dev/list');
        const data = await response.json();
        if (data.error) {
            console.error(data.message);
            return [];
        } else {
            return data.restaurants;
        }
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        return [];
    }
}

// Function to render restaurants
async function renderRestaurants() {
    const restaurants = await fetchRestaurants();
    const restaurantList = document.querySelector('.restaurant-list');
    restaurantList.innerHTML = '';

    restaurants.forEach(restaurant => {
        const stars = ratingToStars(restaurant.rating);
        const truncatedDescription = restaurant.description.length > 50 ? restaurant.description.substr(0, 50) + '...' : restaurant.description;
        const restaurantItem = `
        <div class="restaurant-item">
            <img class="lazyload" data-src="https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}" alt="${restaurant.name}" width="250">
            <h2><a href="detailrestaurant.html?id=${restaurant.id}" class="restaurant-name">${restaurant.name}</a></h2>
            <p>City: ${restaurant.city}</p>
            <p>Rating: ${stars}</p>
            <p>Description: ${truncatedDescription}</p>
        </div>
    `;    
        restaurantList.innerHTML += restaurantItem;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderRestaurants();
});

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

// Slider
let images = document.querySelectorAll('.slider img');
let currentIndex = 0;

function showImage(index) {
    images.forEach((image, i) => {
        if (i === index) {
            image.style.display = 'block';
        } else {
            image.style.display = 'none';
        }
    });
}

function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
}

function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
}

showImage(currentIndex);

document.querySelector('.next-btn').addEventListener('click', function() {
    nextImage();
    console.log("Tombol next diklik");
});

document.querySelector('.prev-btn').addEventListener('click', function() {
    prevImage();
    console.log("Tombol prev diklik");
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then(registration => {
        console.log('SW registered: ', registration);
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
    });
}

showImage(currentIndex);
document.querySelector('.next-btn').addEventListener('click', nextImage);
document.querySelector('.prev-btn').addEventListener('click', prevImage);
