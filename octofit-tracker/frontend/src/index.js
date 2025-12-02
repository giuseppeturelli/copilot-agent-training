import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { getApiBase } from './api';

const container = document.getElementById('root');
const root = createRoot(container);

console.log('OctoFit frontend starting');
console.log('API base URL (computed):', getApiBase());

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
