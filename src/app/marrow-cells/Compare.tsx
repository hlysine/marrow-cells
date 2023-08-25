import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RandomResult } from '../../marrow-cell-types';
import { getDataUrl, getImages } from './api';
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
    setSearchParams(compareToParams({ type1: cellType1, type2: cellType2 }));
  }, [cellType1]);

  useEffect(() => {
    loadImages(2);
    setSearchParams(compareToParams({ type1: cellType1, type2: cellType2 }));
  }, [cellType2]);

  useEffect(() => {
    const params = paramsToCompare(searchParams);
    setCellType1(params.type1);
    setCellType2(params.type2);
  }, []);

  return (
    <>
      <div className="flex w-full items-start gap-4 flex-col md:flex-row">
        <div className="flex flex-1 flex-col gap-4 items-center">
          <div className="form-control w-full max-w-xs">
            <select
              className={`select select-bordered ${
                loading1 ? 'animate-pulse' : ''
              }`}
              disabled={loading1}
              value={cellType1}
              onChange={e => setCellType1(e.target.value)}
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
                {imageSet1?.count ?? 0} cells of this type found
              </span>
            </label>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {imageSet1?.images.map(image => (
              <img
                key={image}
                src={getDataUrl(image)}
                className="shadow-lg"
                alt="Cell"
              />
            ))}
          </div>
        </div>
        <div className="divider md:divider-horizontal"></div>
        <div className="flex flex-1 flex-col gap-4 items-center">
          <div className="form-control w-full max-w-xs">
            <select
              className={`select select-bordered ${
                loading2 ? 'animate-pulse' : ''
              }`}
              disabled={loading2}
              value={cellType2}
              onChange={e => setCellType2(e.target.value)}
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
                {imageSet2?.count ?? 0} cells of this type found
              </span>
            </label>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {imageSet2?.images.map(image => (
              <img
                key={image}
                src={getDataUrl(image)}
                className="shadow-lg"
                alt="Cell"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
