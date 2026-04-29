import fs from 'fs';

const source = '/Users/alexb/.gemini/antigravity/brain/1c601353-3c51-4a56-bd83-fb59d30dad11/dartboard_pro_minimalist_1777464585843.png';
const dest = './public/dartboard.png';

try {
  fs.copyFileSync(source, dest);
  console.log('Image copiée avec succès dans le dossier public!');
} catch (error) {
  console.error('Erreur lors de la copie:', error);
}
