// src/scripts/components/CustomNavbar.js
class CustomNavbar extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <header>
          <nav>
            <div class="logo">
              <img src="https://res.cloudinary.com/dmlnwm5yj/image/upload/v1713766325/noesa-logo_g52v7w.png" alt="Logo Noesa">
              <p class="neosa">Noesa</p>
              <p class="resto">Restaurant</p>
            </div>
            <div id="burger-nav" class="burger-nav" tabindex="0">
              <i class="ph ph-list"></i>
            </div>
            <ul class="menu-list" id="nav-list" tabindex="0">
              <li><a href="/">Home</a></li>
              <li><a href="favorite.html">Favorite</a></li>
              <li><a href="https://www.instagram.com/irvanysfa_/">About Us</a></li>
            </ul>
          </nav>
        </header>
      `;
    }
  }
  
  customElements.define('custom-navbar', CustomNavbar);
  