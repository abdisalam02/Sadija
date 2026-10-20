import { removeBackground } from '@imgly/background-removal-node';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const inputDir = path.join(rootDir, 'public', 'img');
const outputDir = path.join(rootDir, 'public', 'cutouts');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const keyImages = [
  {
    input: 'sadijagure_1775054675_3865759672544587784_1345598477.jpg',
    output: 'look1-denim.png',
    title: 'Look 01: Signature Denim'
  },
  {
    input: 'sadijagure_1747488606_3634520314699983813_1345598477.jpg',
    output: 'look2-striped.png',
    title: 'Look 02: Architectural Grey'
  },
  {
    input: 'sadijagure_1747488606_3634520314758605136_1345598477.jpg',
    output: 'look3-profile.png',
    title: 'Look 03: Oslo Sunlight'
  },
  {
    input: 'sadijagure_1711988159_3336720982988705667_1345598477.jpg',
    output: 'look4-editorial.png',
    title: 'Look 04: Editorial Chic'
  }
];

async function run() {
  console.log('Starting automated AI background removal...');
  
  for (const item of keyImages) {
    const inputPath = path.join(inputDir, item.input);
    const outputPath = path.join(outputDir, item.output);
    
    if (!fs.existsSync(inputPath)) {
      console.warn(`Input not found: ${inputPath}`);
      continue;
    }
    
    console.log(`Processing ${item.title} (${item.input})...`);
    try {
      const fileBuffer = fs.readFileSync(inputPath);
      const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
      
      const resultBlob = await removeBackground(blob, {
        output: {
          format: 'image/png',
          quality: 0.95
        }
      });
      
      const arrayBuffer = await resultBlob.arrayBuffer();
      const outputBuffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(outputPath, outputBuffer);
      console.log(`Saved: ${item.output} (${(outputBuffer.length / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`Error processing ${item.input}:`, err);
    }
  }
  
  console.log('Automated background removal complete!');
}

run();
