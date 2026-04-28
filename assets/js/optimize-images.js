const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const optimizations = [
  { file: 'logo2.webp', width: 280, height: null, quality: 80 },
  { file: 'logo.webp', width: 360, height: null, quality: 80 },
  { file: 'imagens/a1.webp', width: 600, height: null, quality: 75 },
  { file: 'imagens/d1.webp', width: 600, height: null, quality: 75 },
  { file: 'imagens/a2.webp', width: 600, height: null, quality: 75 },
  { file: 'imagens/d2.webp', width: 600, height: null, quality: 75 },
  { file: 'imagens/a3.webp', width: 600, height: null, quality: 75 },
  { file: 'imagens/d3.webp', width: 600, height: null, quality: 75 },
  { file: 'imagens/r.webp', width: 800, height: null, quality: 75 },
  { file: 'imagens/c.webp', width: 800, height: null, quality: 75 },
  { file: 'hero/m1.webp', width: 800, height: null, quality: 75 }
];

async function optimize() {
  for (const opt of optimizations) {
    const filePath = path.join(__dirname, opt.file);
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping ${opt.file}, not found.`);
      continue;
    }
    
    try {
      const inputBuffer = fs.readFileSync(filePath);
      const outputBuffer = await sharp(inputBuffer)
        .resize(opt.width, opt.height, { withoutEnlargement: true })
        .webp({ quality: opt.quality })
        .toBuffer();
        
      fs.writeFileSync(filePath, outputBuffer);
      console.log(`Optimized: ${opt.file}`);
    } catch (err) {
      console.error(`Error optimizing ${opt.file}:`, err);
    }
  }
}

optimize();
