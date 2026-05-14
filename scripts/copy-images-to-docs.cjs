// scripts/copy-images-to-docs.cjs
// This script copies all images from public/images to docs/images for GitHub Pages deployment.

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../public/images');
const destDir = path.join(__dirname, '../docs/images');

function copyImages() {
  if (!fs.existsSync(srcDir)) {
    console.error('Source images folder does not exist:', srcDir);
    process.exit(1);
  }
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  const files = fs.readdirSync(srcDir);
  files.forEach(file => {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);
    fs.copyFileSync(srcFile, destFile);
    console.log(`Copied ${file}`);
  });
  console.log('All images copied to docs/images.');

  const docsIndex = path.join(__dirname, '../docs/index.html');
  const docs404 = path.join(__dirname, '../docs/404.html');
  if (fs.existsSync(docsIndex)) {
    fs.copyFileSync(docsIndex, docs404);
    console.log('Copied docs/index.html to docs/404.html (GitHub Pages SPA fallback).');
  }
}

copyImages();
