import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RandomResult } from '../../marrow-cell-types';
import { getImages } from './api';
import { useData } from '../DataContext';

interface CompareParams {
  type1?: string;
  type2?: string;
}

function compareToParams(filter: CompareParams): URLSearchParams {
  const params = new URLSearchParams();
  if (filter.type1) {
    params.append('type1', filter.type1);
  }
  if (filter.type2) {
    params.append('type2', filter.type2);
  }
  return params;
}

function paramsToCompare(params: URLSearchParams): CompareParams {
  const newFilter: CompareParams = {};
  if (params.has('type1')) {
    newFilter.type1 = params.get('type1')!;
  }
  if (params.has('type2')) {
    newFilter.type2 = params.get('type2')!;
  }
  return newFilter;
}

export default function Compare(): JSX.Element {
  const { cellTypes } = useData();
  const [searchParams, setSearchParams] = useSearchParams();

  const [cellType1, setCellType1] = useState<string>();
  const [imageSet1, setImageSet1] = useState<RandomResult>();
  const [loading1, setLoading1] = useState<boolean>(false);
  const [cellType2, setCellType2] = useState<string>();
  const [imageSet2, setImageSet2] = useState<RandomResult>();
  const [loading2, setLoading2] = useState<boolean>(false);

  const loadImages = (cell: 1 | 2) => {
    if (cell === 1) {
      if (!cellType1) return;
      setLoading1(true);
    } else {
      if (!cellType2) return;
      setLoading2(true);
    }
    getImages({ type: [cell === 1 ? cellType1! : cellType2!] })
      .then(result => {
        if (cell === 1) {
          setImageSet1(result);
        } else {
          setImageSet2(result);
        }
      })
      .finally(() => {
        if (cell === 1) {
          setLoading1(false);
        } else {
          setLoading2(false);
        }
      });
  };

  useEffect(() => {
    loadImages(1);
  }, [cellType1]);

  useEffect(() => {
    loadImages(2);
  }, [cellType2]);

  useEffect(() => {
    const newFilter = paramsToCompare(searchParams);
    setCellType1(newFilter.type1);
    setCellType2(newFilter.type2);
  }, [searchParams]);

  const updateParams = (
    type1: string | undefined,
    type2: string | undefined
  ) => {
    setSearchParams(compareToParams({ type1, type2 }));
  };

  return (
    <>
      <div className="tabs">
        <a
          className={`tab tab-bordered ${
            location.pathname.startsWith('/compare') ? 'tab-active' : ''
          }`}
        >
          Compare
        </a>
        <a
          className={`tab tab-bordered ${
            location.pathname.startsWith('/compare') ? 'tab-active' : ''
          }`}
        >
          Identify
        </a>
      </div>
      <div className="flex w-full items-center gap-4">
        <div className="flex flex-col gap-4">
          <div className="form-control w-full max-w-xs">
            <select
              className={`select select-bordered ${
                loading1 ? 'animate-pulse' : ''
              }`}
              disabled={loading1}
              onChange={e => updateParams(e.target.value, cellType2)}
            >
              <option disabled selected>
                Select a cell type
              </option>
              {Object.entries(cellTypes).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
            <label className="label">
              <span
                className={`label-text-alt ${!imageSet1 ? 'invisible' : ''}`}
              >
                {imageSet1?.count ?? 0}
              </span>
            </label>
          </div>
          <div className="flex flex-wrap gap-4">
            {imageSet1?.images.map(image => (
              <img key={image} src={image} className="shadow-lg" alt="Cell" />
            ))}
          </div>
        </div>
        <div className="divider divider-horizontal"></div>
        <div className="flex flex-col gap-4">
          <div className="form-control w-full max-w-xs">
            <select
              className={`select select-bordered ${
                loading2 ? 'animate-pulse' : ''
              }`}
              disabled={loading2}
              onChange={e => updateParams(e.target.value, cellType2)}
            >
              <option disabled selected>
                Select a cell type
              </option>
              {Object.entries(cellTypes).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
            <label className="label">
              <span
                className={`label-text-alt ${!imageSet2 ? 'invisible' : ''}`}
              >
                {imageSet2?.count ?? 0}
              </span>
            </label>
          </div>
          <div className="flex flex-wrap gap-4">
            {imageSet2?.images.map(image => (
              <img key={image} src={image} className="shadow-lg" alt="Cell" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
