import fs from 'fs';

const source = '/Users/alexb/.gemini/antigravity/brain/1c601353-3c51-4a56-bd83-fb59d30dad11/app_icon_darts_1777465937607.png';
const dest = './public/icon.png';

try {
  fs.copyFileSync(source, dest);
  console.log('Icône copiée avec succès et a remplacé l\'ancienne !');
} catch (error) {
  console.error('Erreur lors de la copie:', error);
}
