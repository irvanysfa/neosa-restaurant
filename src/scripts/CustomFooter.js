// src/scripts/components/CustomFooter.js
class CustomFooter extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <footer>
          <p>Copyright © 2024 - Neosa Restaurant</p>
          <p>Ikuti Kami</p>
          <div class="social">
            <div class="social-logo"><i class="ph ph-instagram-logo"></i></div>
            <div class="social-logo"><i class="ph ph-facebook-logo"></i></div>
            <div class="social-logo"><i class="ph ph-x-logo"></i></div>
          </div>
        </footer>
      `;
    }
  }
  
  customElements.define('custom-footer', CustomFooter);
  