const fs = require('fs');
const path = require('path');
const HTML_PATH = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(HTML_PATH, 'utf8');

// Update CSS link (preload href or direct href) to minified file
html = html.replace(/href="css\/styles\.css"/g, 'href="css/styles.min.css"');
// Update JS src to minified file
html = html.replace(/src="js\/app\.js"/g, 'src="js/app.min.js"');

fs.writeFileSync(HTML_PATH, html, 'utf8');
console.log('index.html updated to reference minified CSS/JS');
