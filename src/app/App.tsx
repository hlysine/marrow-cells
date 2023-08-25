import React, { useEffect, useState } from 'react';
import { redirect } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Compare from './marrow-cells/Compare';
// import Identify from './marrow-cells/Identify';
import { Helmet } from 'react-helmet';
import { CellTypes } from '../marrow-cell-types';
import { getTypes } from './marrow-cells/api';
import { DataProvider } from './DataContext';

function Redirect({ to }: { to: string }) {
  useEffect(() => {
    redirect(to);
  }, []);
  return null;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Redirect to="/compare" />,
  },
  {
    path: '/compare',
    element: <Compare />,
  },
  // {
  //   path: '/identify',
  //   element: <Identify />,
  // },
]);

export default function App() {
  const [cellTypes, setCellTypes] = useState<CellTypes>({});

  useEffect(() => {
    getTypes().then(setCellTypes);
  }, []);

  return (
    <>
      <div className="p-8 flex flex-col gap-2">
        <Helmet>
          <title>Bone Marrow Cell Database</title>
        </Helmet>
        <div className="text-sm breadcrumbs flex justify-center w-full">
          <ul>
            <li>
              <a href="https://lysine-med.hf.space/">Med</a>
            </li>
            <li>Marrow Cells</li>
          </ul>
        </div>
        <p className="text-3xl text-center">Bone Marrow Cell Database</p>
        <p className="text-center">
          Filter and access bone marrow cell images from the Bone Marrow Cell
          Classification dataset.
        </p>
        <p className="font-bold">Points to note</p>
        <ul className="list-disc">
          <li>Classification of the cells may not be 100% accurate.</li>
          <li>
            Not all cells are identifiable, and not all identified cells are
            classified into a specific cell type.
          </li>
        </ul>
        {cellTypes ? (
          <DataProvider data={{ cellTypes }}>
            <RouterProvider router={router} />
          </DataProvider>
        ) : (
          <div className="alert">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-info shrink-0 w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>Loading cell types...</span>
          </div>
        )}
      </div>
    </>
  );
}
