import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';

import 'bootstrap/dist/css/bootstrap.min.css';

if ( ! document.getElementById('main') ) {
  const mainDiv = document.createElement('div');
  mainDiv.setAttribute('id', 'main');
  document.body.appendChild(mainDiv);
}

const root = createRoot(document.getElementById('main'));
root.render(<App />);