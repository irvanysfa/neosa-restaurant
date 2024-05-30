const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputImagePath = path.join(__dirname, 'src/public/images/heros/hero-image_4.jpg');
const outputDir = path.join(__dirname, 'src/public/images/heros/responsive');

if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
}

const sizes = [300, 600, 900, 1200];

sizes.forEach(size => {
  sharp(inputImagePath)
    .resize(size)
    .toFile(path.join(outputDir, `hero-image_4-${size}.jpg`), (err, info) => {
      if (err) {
        console.error('Error processing file', err);
      } else {
        console.log('Image processed', info);
      }
    });
});
