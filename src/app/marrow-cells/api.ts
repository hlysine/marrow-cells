import axios from 'axios';
import { CellTypes, FilterParams, RandomResult } from '../../marrow-cell-types';

const SERVER_BASE_PATH = import.meta.env.VITE_SERVER_URL;

export async function getImages(params: FilterParams): Promise<RandomResult> {
  const response = await axios.get(
    `${SERVER_BASE_PATH}api/marrow-cells/images`,
    {
      params,
    }
  );
  return response.data;
}

export async function getTypes(): Promise<CellTypes> {
  const response = await axios.get(`${SERVER_BASE_PATH}api/marrow-cells/types`);
  return response.data;
}

export function getDataUrl(filename: string): string {
  return `${SERVER_BASE_PATH}marrow-cell-data/bone_marrow_cecll_dataset/${filename}`;
}
