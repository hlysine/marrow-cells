import React from 'react';
import { createRoot } from 'react-dom/client';
import './globals.css';
import App from './App';

const container = document.querySelector('#root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
