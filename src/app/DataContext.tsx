import React, { PropsWithChildren, createContext, useContext } from 'react';
import { CellTypes } from '../marrow-cell-types';

interface AppData {
  cellTypes: CellTypes;
}

const dataContext = createContext<AppData>({
  cellTypes: {},
});

export function useData() {
  return useContext(dataContext);
}

interface DataProviderProps {
  data: AppData;
}

export function DataProvider({
  children,
  data,
}: PropsWithChildren<DataProviderProps>) {
  return <dataContext.Provider value={data}>{children}</dataContext.Provider>;
}
