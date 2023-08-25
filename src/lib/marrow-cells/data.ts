import fs from 'fs/promises';
import { CellTypes } from '../../marrow-cell-types';
import { Glob } from 'glob';

const DATA_DIR = 'dist/app/marrow-cell-data/';

export let cellTypes: CellTypes;
export let cellImages: { [key: string]: string[] };

export async function readData(): Promise<void> {
  console.log('Marrow cells: Reading labels');

  cellTypes = {};
  const data = await fs.readFile(DATA_DIR + 'abbreviations.csv', {
    encoding: 'utf8',
  });
  data
    .split(/\r?\n/)
    .slice(1)
    .forEach(line => {
      const [key, description] = line.split(';');
      cellTypes[key] = description;
    });

  console.log('Marrow cells: Indexing images');

  cellImages = {};
  const directories = (
    await fs.readdir(DATA_DIR + 'bone_marrow_cell_dataset', {
      withFileTypes: true,
    })
  )
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const directory of directories) {
    cellImages[directory] = [];
    const g = new Glob(directory + '/**/*', {
      cwd: DATA_DIR + 'bone_marrow_cell_dataset/',
    });
    for await (const file of g) {
      cellImages[directory].push(file);
    }
  }
}
