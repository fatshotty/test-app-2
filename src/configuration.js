import Path from 'node:path';

const __dirname = import.meta.dirname;

export const ROOT_FOLDER = Path.resolve( Path.join(__dirname, '..') );

export const MenuPizzas = {
  margherita: 'margherita',
  bufalina: 'bufalina',
  marinara: 'marinara',
  cotto: 'cotto',
  funghi: 'funghi'
}