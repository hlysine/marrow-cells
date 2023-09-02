import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import marrowCellApi from './lib/marrow-cells/api';
import { readData, cellImages } from './lib/marrow-cells/data';
import cors from 'cors';
import { isBoom } from '@hapi/boom';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { log } from './lib/helper';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { PORT = 7860 } = process.env;

const app = express();

// Enable cross-origin resource sharing
app.use(cors());

// Middleware that parses json and looks at requests where the Content-Type header matches the type option.
app.use(express.json());

// Serve API requests from the router
app.use('/api/marrow-cells', marrowCellApi);

// Serve app production bundle
app.use(express.static('dist/app'));

app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  if (isBoom(err)) {
    return res.status(err.output.statusCode).json(err.output.payload);
  }
  next(err);
});

// Handle client routing, return all requests to the app
app.get('*', (_req, res) => {
  res.sendFile(join(__dirname, 'app/index.html'));
});

Promise.all([
  (async () => {
    await readData();
    log(
      `Marrow cells: ${
        Object.keys(cellImages).length
      } cell types and ${Object.values(cellImages).reduce(
        (prev, curr) => prev + curr.length,
        0
      )} cell images loaded`
    );
  })(),
]).then(() => {
  app.listen(PORT, () => {
    log(`Server listening at http://localhost:${PORT}`);
  });
});
