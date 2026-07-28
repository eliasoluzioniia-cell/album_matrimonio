import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');
const outputFile = path.join(__dirname, 'src', 'albumData.json');

const getImagesInFolder = (folderName) => {
  const folderPath = path.join(publicDir, folderName);
  if (!fs.existsSync(folderPath)) return [];
  
  const files = fs.readdirSync(folderPath);
  const imageFiles = files
    .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
    .sort(); // ordine alfabetico
  
  return imageFiles.map(file => `/${folderName}/${file}`);
};

// Scan login folder (prendiamo solo la prima immagine se ce ne sono di più)
const loginImages = getImagesInFolder('login');
const loginImage = loginImages.length > 0 ? loginImages[0] : null;

// Scan page folders
const pages = [];

// Trova tutte le cartelle che iniziano con "pg "
const allDirs = fs.readdirSync(publicDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && dirent.name.startsWith('pg '))
  .map(dirent => dirent.name);

// Ordina le cartelle numericamente in base al primo numero che trovano
allDirs.sort((a, b) => {
  const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
  const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
  return numA - numB;
});

// Aggiungi gli array di immagini trovate per ogni spread
for (const dirName of allDirs) {
  const imgPaths = getImagesInFolder(dirName);
  const isSpread = dirName.includes('_');
  
  pages.push({
    name: dirName,
    isSpread: dirName === 'pg 1' ? false : isSpread,
    images: imgPaths
  });
}

const data = {
  login: loginImage || '/wedding_couple_landscape_1784729586793.jpg',
  pages: pages.length > 0 ? pages : [
    { name: 'pg 1', isSpread: false, images: ['/wedding_couple_landscape_1784729586793.jpg'] },
    { name: 'pg 2_3', isSpread: true, images: ['/bride_portrait_1784729595978.jpg', '/wedding_ceremony_wide_1784729617911.jpg'] }
  ]
};

fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
console.log('✅ albumData.json generated successfully con spread detection!');
