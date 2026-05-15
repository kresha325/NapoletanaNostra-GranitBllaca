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
  if (!fs.existsSync(docsIndex)) {
    console.warn('Skipping docs/404.html: docs/index.html not found (run vite build first).');
    return;
  }
  // Must match vite.config.ts base path (no trailing slash in template string below).
  const repoBase = '/NapoletanaNostra-GranitBllaca';
  const spa404 = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Redirecting…</title>
  <script>
    (function () {
      var base = "${repoBase}";
      try {
        window.sessionStorage.setItem(
          "ghp-spa",
          window.location.pathname + window.location.search + window.location.hash
        );
      } catch (e) {}
      window.location.replace(window.location.origin + base + "/");
    })();
  </script>
</head>
<body></body>
</html>
`;
  fs.writeFileSync(docs404, spa404, 'utf8');
  console.log('Wrote docs/404.html (GitHub Pages SPA redirect to index).');
}

copyImages();
