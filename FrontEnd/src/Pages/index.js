// src/index.js (or src/main.jsx)
import React from 'react';
import ReactDOM from 'react-dom/client';  // React 18
import App from './App.jsx';  // Main App component
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter

const root = ReactDOM.createRoot(document.getElementById('root'));  // Get the root div

root.render(
  <BrowserRouter>  {/* Wrap your app with BrowserRouter to enable routing */}
    <App />
  </BrowserRouter>
);
