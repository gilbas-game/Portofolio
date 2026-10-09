const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'images');
const MAX_WIDTH = 1920;
const QUALITY = 80;

if (!fs.existsSync(imagesDir)) {
  console.log('No images directory found. Nothing to optimize.');
  process.exit(0);
}

const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
const files = fs.readdirSync(imagesDir);
const imageFiles = files.filter(f => {
  const ext = path.extname(f).toLowerCase();
  return imageExtensions.includes(ext) && fs.statSync(path.join(imagesDir, f)).isFile();
});

if (imageFiles.length === 0) {
  console.log('No images found to optimize.');
  process.exit(0);
}

console.log('Found ' + imageFiles.length + ' image(s) to process.\n');

let optimizedCount = 0;
let skippedCount = 0;
let totalSaved = 0;

async function optimizeAll() {
  for (const file of imageFiles) {
    const filePath = path.join(imagesDir, file);
    const ext = path.extname(file).toLowerCase();
    const tempPath = filePath + '.tmp';

    try {
      const originalSize = fs.statSync(filePath).size;
      const metadata = await sharp(filePath).metadata();

      let pipeline = sharp(filePath, { failOn: 'none' });

      if (metadata.width && metadata.width > MAX_WIDTH) {
        pipeline = pipeline.resize(MAX_WIDTH, null, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      if (ext === '.jpg' || ext === '.jpeg') {
        pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true, progressive: true });
      } else if (ext === '.png') {
        pipeline = pipeline.png({ quality: QUALITY, compressionLevel: 9, palette: true });
      } else if (ext === '.webp') {
        pipeline = pipeline.webp({ quality: QUALITY });
      } else if (ext === '.avif') {
        pipeline = pipeline.avif({ quality: QUALITY });
      }

      await pipeline.toFile(tempPath);

      const optimizedSize = fs.statSync(tempPath).size;
      const savedBytes = originalSize - optimizedSize;

      if (optimizedSize < originalSize) {
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);

        const savedKB = Math.round(savedBytes / 1024);
        const percent = Math.round((savedBytes / originalSize) * 100);
        console.log('[OK] ' + file + ': ' + metadata.width + 'x' + metadata.height + ' -> saved ' + savedKB + 'KB (' + percent + '%)');

        optimizedCount++;
        totalSaved += savedBytes;
      } else {
        fs.unlinkSync(tempPath);
        console.log('[SKIP] ' + file + ': already optimized');
        skippedCount++;
      }
    } catch (err) {
      console.error('[ERROR] ' + file + ': ' + err.message);
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
      skippedCount++;
    }
  }

  console.log('\n=== Summary ===');
  console.log('Optimized: ' + optimizedCount);
  console.log('Skipped:   ' + skippedCount);
  console.log('Total saved: ' + Math.round(totalSaved / 1024) + 'KB');
}

optimizeAll().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
