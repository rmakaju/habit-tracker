const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const publicDir = path.join(__dirname, '..', 'public');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('dist/index.html not found. Run the web export first.');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');
if (!html.includes('rel="manifest"')) {
  html = html.replace(
    '</head>',
    '  <link rel="manifest" href="/manifest.json" />\n</head>'
  );
  fs.writeFileSync(indexPath, html);
  console.log('Injected manifest link into dist/index.html');
} else {
  console.log('Manifest link already present in dist/index.html');
}

[
  'manifest.json',
  'offline.html',
  'pwa-192.png',
  'pwa-512.png',
  'service-worker.js',
].forEach((filename) => {
  const sourcePath = path.join(publicDir, filename);
  const destinationPath = path.join(distDir, filename);

  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destinationPath);
    console.log(`Copied ${filename} into dist`);
  }
});
