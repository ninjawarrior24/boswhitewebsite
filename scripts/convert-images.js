const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const cheerio = require('cheerio');

const IMAGES_DIR = path.join(__dirname, '..', 'images');
const HTML_PATH = path.join(__dirname, '..', 'index.html');

async function convertImage(file) {
  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file, ext);
  const input = path.join(IMAGES_DIR, file);
  const webpOut = path.join(IMAGES_DIR, base + '.webp');
  const avifOut = path.join(IMAGES_DIR, base + '.avif');
  try {
    await sharp(input).avif({ quality: 60 }).toFile(avifOut);
  } catch (e) {
    console.warn('avif conversion failed for', file, e.message);
  }
  try {
    await sharp(input).webp({ quality: 75 }).toFile(webpOut);
  } catch (e) {
    console.warn('webp conversion failed for', file, e.message);
  }
  return { base, ext };
}

function isImageFile(f) {
  // Only convert source raster images; skip already-generated webp/avif files
  return /\.(png|jpg|jpeg)$/i.test(f);
}

async function processAll() {
  const files = fs.readdirSync(IMAGES_DIR).filter(isImageFile);
  for (const f of files) {
    process.stdout.write(`Converting ${f} ... `);
    await convertImage(f);
    console.log('done');
  }

  // Update HTML: replace <img src="images/NAME.ext" ...> with <picture> fallback
  const html = fs.readFileSync(HTML_PATH, 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });

  $('img').each((i, el) => {
    const src = $(el).attr('src');
    if (!src) return;
    if (!src.startsWith('images/')) return;
    const srcPath = path.basename(src);
    const ext = path.extname(srcPath);
    const base = path.basename(srcPath, ext);
    const webp = `images/${base}.webp`;
    const avif = `images/${base}.avif`;
    // preserve attributes
    const attrs = {};
    for (const attr of el.attribs ? Object.keys(el.attribs) : []) {
      attrs[attr] = $(el).attr(attr);
    }
    // build picture element
    const picture = ['<picture>'];
    picture.push(`<source type="image/avif" srcset="${avif}">`);
    picture.push(`<source type="image/webp" srcset="${webp}">`);
    // rebuild img with same attributes
    const attrStr = Object.keys(attrs).map(k => `${k}="${attrs[k]}"`).join(' ');
    picture.push(`<img ${attrStr}>`);
    picture.push('</picture>');
    $(el).replaceWith(picture.join('\n'));
  });

  fs.writeFileSync(HTML_PATH, $.html(), 'utf8');
  console.log('index.html updated with <picture> elements for images');
}

processAll().catch(err => {
  console.error(err);
  process.exit(1);
});
