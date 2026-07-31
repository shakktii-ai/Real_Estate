import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');

const heavyImages = [
  'Galaxy-04.png',
  'Galaxy-04_1.png',
  'Galaxy-04_2.png',
  'Galaxy-04_3.png',
  'Galaxy-04_4.png',
  'backgroundImg.png',
  'banner.png',
  'Rectangle_4826.png',
  'mission.png',
  'strengths.png',
  'founder1.png',
  'founder.png',
  'image-59.png',
  'image-60.png',
  'image-61.png',
  'image-65.png',
  'image-71.png',
  'Why.png',
  'joinus.png',
  'referImg.png',
  'consultNow.png',
];

async function optimize() {
  for (const filename of heavyImages) {
    const inputPath = path.join(publicDir, filename);
    if (!fs.existsSync(inputPath)) continue;

    const stats = fs.statSync(inputPath);
    console.log(`Optimizing ${filename} (Original size: ${(stats.size / 1024 / 1024).toFixed(2)} MB)...`);

    const tempPngPath = path.join(publicDir, `_opt_${filename}`);
    const webpFilename = filename.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    const webpPath = path.join(publicDir, webpFilename);

    try {
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      const targetWidth = metadata.width > 1920 ? 1920 : metadata.width;

      // 1. Generate optimized WebP
      await sharp(inputPath)
        .resize({ width: targetWidth, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(webpPath);

      // 2. Generate optimized compressed PNG overwriting original file
      await sharp(inputPath)
        .resize({ width: targetWidth, withoutEnlargement: true })
        .png({ quality: 80, palette: true })
        .toFile(tempPngPath);

      fs.renameSync(tempPngPath, inputPath);

      const newStats = fs.statSync(inputPath);
      const webpStats = fs.statSync(webpPath);
      console.log(`  -> New PNG size: ${(newStats.size / 1024).toFixed(1)} KB`);
      console.log(`  -> New WebP size: ${(webpStats.size / 1024).toFixed(1)} KB`);
    } catch (err) {
      console.error(`Error optimizing ${filename}:`, err);
    }
  }
}

optimize();
