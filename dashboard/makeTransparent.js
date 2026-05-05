const sharp = require('sharp');

sharp('src/assets/logo.png')
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })
  .then(({ data, info }) => {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i+1];
      const b = data[i+2];
      // threshold to detect black background
      if (r < 80 && g < 80 && b < 80) {
        data[i+3] = 0; // Set alpha to 0 (transparent)
      } else {
        // Force the fox lines to be pure white
        data[i] = 255;
        data[i+1] = 255;
        data[i+2] = 255;
        data[i+3] = 255;
      }
    }
    return sharp(data, { raw: info }).png().toFile('src/assets/logo_transparent.png');
  })
  .then(() => console.log('Transparent logo created'))
  .catch(err => console.error(err));
