export interface CellTypes {
  [key: string]: string;
}

export interface RandomResult {
  images: string[];
  type: string;
  count: number;
}

export interface FilterParams {
  type?: string[];
}
