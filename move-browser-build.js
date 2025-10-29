const fs = require('fs');
const path = require('path');

const browserPath = path.join(__dirname, 'docs', 'browser');
const docsPath = path.join(__dirname, 'docs');

if (!fs.existsSync(browserPath)) {
  console.log('No docs/browser folder found. Nothing to move.');
  process.exit(0);
}

fs.readdirSync(browserPath).forEach(file => {
  const src = path.join(browserPath, file);
  const dest = path.join(docsPath, file);
  fs.renameSync(src, dest);
});
fs.rmdirSync(browserPath, { recursive: true });

console.log('Moved browser build files from docs/browser to docs/');