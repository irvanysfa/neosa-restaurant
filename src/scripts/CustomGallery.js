// src/scripts/components/CustomGallery.js
class CustomGallery extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <section id="galery-section">
          <div id="galery">
            <br>
            <div id="galery-content">
              <h2>Gallery</h2>
              <div class="gallery-container">
                <div class="slider">
                  <img src="https://res.cloudinary.com/dmlnwm5yj/image/upload/v1713878568/pexels-pixabay-262978_onwpmy.jpg" alt="Gallery-1">
                  <img src="https://res.cloudinary.com/dmlnwm5yj/image/upload/v1713878568/pexels-igor-starkov-233202-1307698_ptcqg8.jpg" alt="Gallery-2">
                  <img src="https://res.cloudinary.com/dmlnwm5yj/image/upload/v1713878566/pexels-life-of-pix-67468_gfxjui.jpg" alt="Gallery-33">
                  <img src="https://res.cloudinary.com/dmlnwm5yj/image/upload/v1713880622/pexels-elletakesphotos-2696064_f9tvjq.jpg" alt="Gallery-4">
                  <img src="https://res.cloudinary.com/dmlnwm5yj/image/upload/v1713880623/pexels-pixabay-460537_jqvsaz.jpg" alt="Gallery-5">
                </div>
              </div>
            </div>
            <div class="btn-container">
              <button class="prev-btn"><i class="ph ph-skip-back"></i></button>
              <button class="next-btn"><i class="ph ph-skip-forward"></i></button>
            </div>
          </div>
        </section>
      `;
    }
  }
  
  customElements.define('custom-gallery', CustomGallery);
  