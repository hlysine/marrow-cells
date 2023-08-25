import express from 'express';
import { z } from 'zod';
import { validate, wrap } from '../helper';
import { cellTypes, cellImages } from './data';
import { notFound } from '@hapi/boom';
import { RandomResult } from '../../marrow-cell-types';

const router = express.Router();

router.get(
  '/types',
  wrap(async (_req, res) => {
    res.status(200).json(cellTypes);
  })
);

router.get(
  '/images',
  wrap(async (req, res) => {
    const { query } = await validate(
      req,
      z.object({
        query: z
          .object({
            type: z.union([z.string().array(), z.string()]).optional(),
          })
          .strict(),
      })
    );
    if (query.type) {
      const validateType = (type: string) => {
        if (!(type in cellImages)) {
          throw notFound(`${query.type} is not a valid cell type`);
        }
      };
      if (Array.isArray(query.type)) {
        query.type.forEach(validateType);
      } else {
        validateType(query.type);
      }
    }
    const typeOptions: string[] = [];
    if (Array.isArray(query.type) && query.type.length === 0) {
      throw notFound('No cell types given');
    } else if (Array.isArray(query.type)) {
      typeOptions.push(...query.type);
    } else if (query.type) {
      typeOptions.push(query.type);
    }
    if (typeOptions.length === 0) {
      typeOptions.push(...Object.keys(cellImages));
    }
    const type = typeOptions[Math.floor(Math.random() * typeOptions.length)];
    const images = cellImages[type].slice();
    // randomly sample at most 16 images
    const sampleSize = Math.min(16, images.length);
    const sample: string[] = [];
    for (let i = 0; i < sampleSize; i++) {
      const index = Math.floor(Math.random() * images.length);
      sample.push(images[index].replace('\\', '/'));
      images.splice(index, 1);
    }
    res.status(200).json({
      type,
      images: sample,
      count: cellImages[type].length,
    } satisfies RandomResult);
  })
);

export default router;
