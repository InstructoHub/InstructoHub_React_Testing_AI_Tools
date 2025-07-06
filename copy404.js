const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, './build/index.html');
const dest = path.resolve(__dirname, './build/404.html');

try {
  fs.copyFileSync(src, dest);
  console.log('✅ index.html successfully copied to 404.html');
} catch (err) {
  console.error('❌ Failed to copy file:', err);
  process.exit(1);
}
